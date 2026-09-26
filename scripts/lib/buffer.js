const BUFFER_ENDPOINT = "https://api.buffer.com";

class BufferError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "BufferError";
    this.details = details;
  }
}

async function request(query, variables, apiKey) {
  const response = await fetch(BUFFER_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new BufferError(
      `Buffer a repondu ${response.status} ${response.statusText}`,
      payload,
    );
  }

  if (payload?.errors?.length) {
    throw new BufferError(
      payload.errors.map((error) => error.message).join(" | "),
      payload.errors,
    );
  }

  return payload?.data;
}

/** Posts pas encore publies : ce sont les seuls qui peuvent partir en double. */
const PENDING_STATUSES = ["draft", "scheduled", "needs_approval", "sending"];

const LIST_POSTS = `
  query ListPosts($organizationId: OrganizationId!, $channelIds: [ChannelId!], $status: [PostStatus!]) {
    posts(
      input: {
        organizationId: $organizationId
        filter: { channelIds: $channelIds, status: $status }
      }
      first: 100
    ) {
      edges {
        node {
          id
          status
          text
          dueAt
        }
      }
    }
  }
`;

async function listPosts({ apiKey, organizationId, channelIds }) {
  const data = await request(
    LIST_POSTS,
    { organizationId, channelIds, status: PENDING_STATUSES },
    apiKey,
  );

  return (data?.posts?.edges ?? []).map((edge) => edge.node);
}

const CREATE_POST = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      __typename
      ... on PostActionSuccess {
        post {
          id
          status
          shareMode
          dueAt
        }
      }
      ... on NotFoundError { message }
      ... on UnauthorizedError { message }
      ... on UnexpectedError { message }
      ... on RestProxyError { code message }
      ... on LimitReachedError { message }
      ... on InvalidInputError { message }
    }
  }
`;

/**
 * Instagram et Facebook exigent un type de publication explicite.
 * `post` = publication dans le fil, avec repartition automatique en feed.
 */
const CHANNEL_METADATA = {
  instagram: { instagram: { type: "post", shouldShareToFeed: true } },
  facebook: { facebook: { type: "post" } },
};

async function createPost({ apiKey, channelId, service, text, imageUrl, source }) {
  const input = {
    channelId,
    text,
    mode: "addToQueue",
    schedulingType: "automatic",
    needsApproval: false,
    source,
    assets: imageUrl ? [{ image: { url: imageUrl } }] : [],
  };

  if (CHANNEL_METADATA[service]) {
    input.metadata = CHANNEL_METADATA[service];
  }

  const data = await request(CREATE_POST, { input }, apiKey);
  const payload = data?.createPost;

  if (payload?.__typename !== "PostActionSuccess") {
    const reason = payload?.message ?? payload?.__typename ?? "reponse inconnue";
    const code = payload?.code ? ` (${payload.code})` : "";
    throw new BufferError(
      `Creation refusee sur le canal ${channelId}: ${reason}${code}`,
      payload,
    );
  }

  return payload.post ?? null;
}

const DELETE_POST = `
  mutation DeletePost($input: DeletePostInput!) {
    deletePost(input: $input) {
      __typename
      ... on DeletePostSuccess { id }
      ... on VoidMutationError { message }
    }
  }
`;

async function deletePost({ apiKey, postId }) {
  const data = await request(DELETE_POST, { input: { id: postId } }, apiKey);
  const payload = data?.deletePost;

  if (payload?.__typename !== "DeletePostSuccess") {
    throw new BufferError(
      `Suppression refusee pour ${postId}: ${payload?.message ?? "raison inconnue"}`,
      payload,
    );
  }

  return payload.id;
}

module.exports = { BufferError, createPost, deletePost, listPosts };
