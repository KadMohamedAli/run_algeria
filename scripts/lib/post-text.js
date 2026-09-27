const TIME_ZONE = "Africa/Algiers";
const MAX_TEXT_LENGTH = 2000;

const DEFAULT_HASHTAGS = ["coursealgerie", "runningalgerie", "algerie"];

const TYPE_HASHTAGS = {
  0: "course-sur-route",
  1: "trail",
  2: "ultratrail",
  3: "marathon",
  4: "semimarathon",
  5: "10km",
  6: "5km",
  7: "endurance",
  8: "course-a-etapes",
  9: "relais",
  10: "relais",
  11: "crosscountry",
  12: "skyrunning",
  13: "montagne",
  14: "desert",
  17: "caritative",
  19: "colorrun",
  20: "mudrun",
  23: "trail",
  25: "chrono",
  30: "backyardultra",
  32: "vertical",
  33: "combinee",
};

const DISTANCE_ONLY_TYPE = /^\d+(?:[.,]\d+)?\s*km$/i;

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 40);
}

function formatNumber(value) {
  return Number(value).toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
}

function formatKm(value) {
  const numeric = Number(String(value).replace(",", "."));
  if (Number.isNaN(numeric) || numeric <= 0) return null;
  return `${formatNumber(numeric)} km`;
}

function formatDistance(raw) {
  const values = Array.isArray(raw) ? raw : [raw];

  const formatted = [
    ...new Set(
      values.map(formatKm).filter(Boolean),
    ),
  ].filter((value, index, list) => list.indexOf(value) === index);

  if (formatted.length === 0) return null;
  if (formatted.length === 1) return formatted[0];
  return formatted.join(" et ");
}

function formatPrice(raw) {
  if (raw === null || raw === undefined) return null;

  const value = String(raw).trim();
  if (!value) return "Inscription gratuite";

  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return /gratuit|free/i.test(value) ? "Inscription gratuite" : null;
  }

  if (Number(digits) === 0) return "Inscription gratuite";

  return `Inscription ${formatNumber(digits)} DA`;
}

/** Les descriptions du site sont du markdown : on retire la syntaxe avant publication. */
function cleanDescription(raw, maxLength = 320) {
  const text = String(raw ?? "")
    .replace(/\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_`#>|]+/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;

  const cut = text.slice(0, maxLength);
  const sentenceEnd = Math.max(
    cut.lastIndexOf(". "),
    cut.lastIndexOf("! "),
    cut.lastIndexOf("? "),
  );

  if (sentenceEnd > maxLength * 0.5) {
    return cut.slice(0, sentenceEnd + 1).trim();
  }

  return `${cut.slice(0, cut.lastIndexOf(" ")).trim()}…`;
}

function formatDPlus(raw) {
  if (raw === null || raw === undefined) return null;

  const value = String(raw).trim().replace(",", ".");
  if (!/^\d+(?:\.\d+)?$/.test(value)) return null;

  const meters = Number(value);
  if (!Number.isFinite(meters) || meters <= 0) return null;

  return `D+ ${formatNumber(meters)} m`;
}

function formatDate(raw) {
  if (!raw) return null;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;

  const day = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  const time = new Intl.DateTimeFormat("fr-FR", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);

  return `${day} à ${time}`;
}

function resolveLocation(course, wilayas) {
  const wilaya =
    typeof course.wilaya === "number" || /^\d+$/.test(course.wilaya)
      ? wilayas.find((entry) => entry.id === String(course.wilaya))?.name
      : course.wilaya;

  // commune vaut parfois "Les Sablettes, Alger" : on retire les doublons de wilaya.
  const parts = [course.commune, wilaya]
    .flatMap((value) => String(value ?? "").split(","))
    .map((part) => part.trim())
    .filter(Boolean);

  return [...new Set(parts)].join(", ") || null;
}

function resolveTypes(course, typeNames) {
  const codes = Array.isArray(course.type) ? course.type : [];
  const distance = formatDistance(course.distance);

  const names = codes
    .map((code) => typeNames.get(Number(code)))
    .filter(Boolean)
    .filter((name) => !DISTANCE_ONLY_TYPE.test(name))
    .filter((name) => !distance || !name.includes(distance));

  return [...new Set(names)].slice(0, 3).join(" · ") || null;
}

function buildHashtags(course, typeCodes) {
  const tags = [...DEFAULT_HASHTAGS];

  for (const code of typeCodes) {
    const tag = TYPE_HASHTAGS[Number(code)];
    if (tag && !tags.includes(tag)) tags.push(tag);
    if (tags.length >= 5) break;
  }

  const commune = slugify(course.commune ?? "");
  if (commune && commune.length >= 4 && tags.length < 5) tags.push(commune);

  return tags.map((tag) => `#${tag}`).join(" ");
}

function buildPostText({ course, typeNames, wilayas, siteUrl }) {
  const url = `${siteUrl.replace(/\/+$/, "")}/courses/${course.slug}`;
  const typeCodes = Array.isArray(course.type) ? course.type : [];

  const lines = [`🏃‍♂️ ${course.nom}`];

  // Rappel des faits avant la description : nom, distance, D+, wilaya, prix.
  const facts = [];

  const typeLabel = resolveTypes(course, typeNames);
  const raceFacts = [
    typeLabel,
    formatDistance(course.distance),
    formatDPlus(course.denivele_plus),
  ].filter(Boolean);

  if (raceFacts.length) facts.push(`🏷 ${raceFacts.join(" · ")}`);

  const location = resolveLocation(course, wilayas);
  if (location) facts.push(`📍 ${location}`);

  const price = formatPrice(course.prix_inscription);
  if (price) facts.push(`💰 ${price}`);

  const date = formatDate(course.date);
  if (date) facts.push(`📅 ${date}`);

  if (facts.length) lines.push("", ...facts);

  const description = cleanDescription(course.description);
  if (description) lines.push("", description);

  lines.push(
    "",
    `👉 Inscription et détails : ${url}`,
    "",
    buildHashtags(course, typeCodes),
  );

  let text = lines.join("\n");
  if (text.length > MAX_TEXT_LENGTH) {
    text = `${text.slice(0, MAX_TEXT_LENGTH - 1).trimEnd()}…`;
  }

  return text;
}

module.exports = {
  MAX_TEXT_LENGTH,
  buildHashtags,
  buildPostText,
  cleanDescription,
  formatDPlus,
  formatDate,
  formatDistance,
  formatPrice,
  slugify,
};
