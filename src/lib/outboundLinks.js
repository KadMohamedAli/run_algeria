const UTM_SOURCE = "coursesalgerie";
const UTM_MEDIUM = "referral";

export function getTrackedHref(rawUrl, campaign) {
  if (typeof rawUrl !== "string") return null;

  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (url.protocol === "http:") return rawUrl;
  if (url.protocol !== "https:") return null;

  if (!url.searchParams.has("utm_source")) {
    url.searchParams.set("utm_source", UTM_SOURCE);
  }
  if (!url.searchParams.has("utm_medium")) {
    url.searchParams.set("utm_medium", UTM_MEDIUM);
  }
  if (campaign && !url.searchParams.has("utm_campaign")) {
    url.searchParams.set("utm_campaign", campaign);
  }

  return url.toString();
}
