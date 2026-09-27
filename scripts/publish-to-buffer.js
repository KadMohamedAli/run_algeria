#!/usr/bin/env node
/**
 * Cree un brouillon Buffer pour chaque course ajoutee a courses.json.
 *
 * Declenchement : push sur la branche prod (voir .github/workflows/buffer-publish.yml)
 *declenchement      ou manuellement via `npm run publish:buffer`.
 *
 * Variables d'environnement :
 *   BUFFER_API_KEY        cle personnelle Buffer (Settings -> API)
 *   NEXT_PUBLIC_SITE_URL  domaine public utilise dans les liens des posts
 *   BUFFER_ORG_ID         organisation Buffer (par defaut ci-dessous)
 *   BUFFER_DRY_RUN        mettre a "1" pour afficher sans envoyer
 *   BUFFER_SOURCE         etiquette source attachee aux posts Buffer
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const { BufferError, createPost, listPosts } = require("./lib/buffer");
const { buildPostText } = require("./lib/post-text");

const ROOT = path.resolve(__dirname, "..");
const COURSES_PATH = path.join(ROOT, "src", "data", "courses.json");
const TYPES_PATH = path.join(ROOT, "src", "data", "type.json");
const WILAYAS_PATH = path.join(ROOT, "src", "data", "wilaya.json");
const BASELINE_PATH = path.join(ROOT, "scripts", "buffer-baseline.json");

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.coursealgerie.com"
).replace(/\/+$/, "");

const ORGANIZATION_ID = process.env.BUFFER_ORG_ID || "6a9ae67c66843788ad871a31";

const CHANNELS = [
  { service: "instagram", id: process.env.BUFFER_CHANNEL_INSTAGRAM || "6a9ae6d1065799be4689ed48" },
  { service: "facebook", id: process.env.BUFFER_CHANNEL_FACEBOOK || "6a9ae6fa065799be4689ee08" },
  { service: "tiktok", id: process.env.BUFFER_CHANNEL_TIKTOK || "6a9ae70c065799be4689ee54" },
];

const SOURCE = process.env.BUFFER_SOURCE || "courses-algerie-ci";
const FALLBACK_IMAGE = "/ca_logo.jpg";
const IMAGE_POLL_ATTEMPTS = Number(process.env.BUFFER_IMAGE_ATTEMPTS || 24);
const IMAGE_POLL_INTERVAL_MS = Number(process.env.BUFFER_IMAGE_INTERVAL_MS || 15000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function git(...args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

/**
 * Slugs ajoutes par le push courant, compares a la baseline et au commit precedent.
 * La baseline ecarte tout ce qui existait avant l'activation du workflow.
 */
function detectNewSlugs(courses) {
  const baseline = new Set(readJson(BASELINE_PATH, { slugs: [] }).slugs ?? []);
  const known = new Set(courses.map((course) => course.slug));
  const beforeSha = process.env.BUFFER_BASE_SHA?.trim();

  const candidates = new Set();

  if (beforeSha && /^[0-9a-f]{40}$/.test(beforeSha)) {
    let previous = [];
    try {
      previous = JSON.parse(
        git("show", `${beforeSha}:src/data/courses.json`),
      );
    } catch {
      console.warn(
        `⚠️  Commit ${beforeSha.slice(0, 7)} illisible, fallback sur la baseline.`,
      );
    }
    for (const course of previous) candidates.add(course.slug);
  } else {
    console.warn(
      "⚠️  BUFFER_BASE_SHA absent ou invalide, fallback sur la baseline uniquement.",
    );
  }

  return courses
    .map((course) => course.slug)
    .filter((slug) => slug && known.has(slug) && !candidates.has(slug) && !baseline.has(slug));
}

async function isImageLive(url) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow" });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForImage(url) {
  if (await isImageLive(url)) return true;

  console.log(`   ⏳ Image pas encore en ligne, attente du build Vercel...`);
  for (let attempt = 1; attempt <= IMAGE_POLL_ATTEMPTS; attempt += 1) {
    await sleep(IMAGE_POLL_INTERVAL_MS);
    if (await isImageLive(url)) {
      console.log(`   ✅ Image en ligne (${attempt} tentative(s)).`);
      return true;
    }
    console.log(`   ⏳ Toujours pas en ligne (${attempt}/${IMAGE_POLL_ATTEMPTS})...`);
  }

  return false;
}

/** Un post existe deja dans Buffer si l'un des canaux contient l'URL de la fiche. */
async function findExistingPosts(slugs) {
  if (slugs.length === 0) return new Set();

  const posts = await listPosts({
    apiKey: process.env.BUFFER_API_KEY,
    organizationId: ORGANIZATION_ID,
    channelIds: CHANNELS.map((channel) => channel.id),
  });

  const published = new Set();
  for (const post of posts) {
    for (const slug of slugs) {
      if (post.text?.includes(`/courses/${slug}`)) published.add(slug);
    }
  }

  return published;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || process.env.BUFFER_DRY_RUN === "1";
  const manualSlug = args.includes("--slug")
    ? args[args.indexOf("--slug") + 1]
    : process.env.BUFFER_SLUG?.trim();

  if (!dryRun && !process.env.BUFFER_API_KEY) {
    console.error(
      "❌ BUFFER_API_KEY est absente. Ajoute-la dans les secrets GitHub ou dans .env.local.",
    );
    process.exitCode = 1;
    return;
  }

  const courses = readJson(COURSES_PATH, []);
  const typeNames = new Map(
    readJson(TYPES_PATH, []).map((entry) => [entry.code, entry.type]),
  );
  const wilayas = readJson(WILAYAS_PATH, []);

  if (courses.length === 0) {
    console.error("❌ courses.json est vide ou illisible.");
    process.exitCode = 1;
    return;
  }

  let targets;
  if (manualSlug) {
    targets = courses.filter((course) => course.slug === manualSlug);
    if (targets.length === 0) {
      console.error(`❌ Aucune course avec le slug "${manualSlug}".`);
      process.exitCode = 1;
      return;
    }
    console.log(`▶️  Relance manuelle sur "${manualSlug}"`);
  } else {
    const slugs = detectNewSlugs(courses);
    if (slugs.length === 0) {
      console.log("✅ Aucune nouvelle course dans ce push, rien a publier.");
      return;
    }
    targets = courses.filter((course) => slugs.includes(course.slug));
    console.log(
      `▶️  ${targets.length} nouvelle(s) course(s) : ${slugs.join(", ")}`,
    );
  }

  const alreadyPublished = dryRun
    ? new Set()
    : await findExistingPosts(targets.map((course) => course.slug));

  let created = 0;
  const failures = [];

  for (const course of targets) {
    const text = buildPostText({ course, typeNames, wilayas, siteUrl: SITE_URL });
    const imageUrl = `${SITE_URL}${course.image || FALLBACK_IMAGE}`;
    const live = await waitForImage(imageUrl);

    console.log(`\n──────── ${course.nom} ────────`);
    console.log(text);
    console.log(`🖼  ${imageUrl}${live ? "" : "  ⚠️  indisponible"}`);

    if (alreadyPublished.has(course.slug)) {
      console.log("⏭️  Un post existe déjà dans Buffer pour cette course, ignoré.");
      continue;
    }

    if (!live) {
      failures.push(
        `${course.slug}: image toujours absente de ${SITE_URL} apres ${IMAGE_POLL_ATTEMPTS} tentatives`,
      );
      console.log("❌ Image indisponible, post non envoyé.");
      continue;
    }

    if (dryRun) {
      console.log("🧪 DRY RUN — aucun post envoyé.");
      continue;
    }

    for (const channel of CHANNELS) {
      try {
        const post = await createPost({
          apiKey: process.env.BUFFER_API_KEY,
          channelId: channel.id,
          service: channel.service,
          text,
          imageUrl,
          source: SOURCE,
        });
        console.log(`✅ ${channel.service} → post ${post?.id ?? "?"} (${post?.status})`);
        created += 1;
      } catch (error) {
        const reason = error instanceof BufferError ? error.message : String(error);
        failures.push(`${course.slug} / ${channel.service}: ${reason}`);
        console.error(`❌ ${channel.service} : ${reason}`);
      }
    }
  }

  console.log(
    `\n${dryRun ? "🧪" : "📤"} ${created} post(s) ajouté(s) à la file Buffer.`,
  );

  if (failures.length > 0) {
    console.error("\n❌ Echecs :");
    for (const failure of failures) console.error(`   - ${failure}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("💥", error);
  process.exitCode = 1;
});
