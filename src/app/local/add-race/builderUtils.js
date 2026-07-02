export const DEFAULT_OFFSET = "+01:00";
export const DEFAULT_COLORS = {
  background_color: "#1e293b",
  secondary_color: "#334155",
  accent_color: "#ea580c",
};

export function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function splitLines(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseDistance(form) {
  if (form.distanceMode === "segments") {
    const values = form.distanceSegments
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => Number(part.replace(",", ".")))
      .filter((part) => !Number.isNaN(part));

    return values.length ? values : undefined;
  }

  if (form.distanceMode === "text") {
    return form.distanceText.trim() || undefined;
  }

  if (form.distanceSingle.trim()) {
    const numeric = Number(form.distanceSingle.replace(",", "."));
    return Number.isNaN(numeric) ? form.distanceSingle.trim() : numeric;
  }

  return undefined;
}

export function buildIsoDate(date, time, offset) {
  if (!date) return undefined;
  return `${date}T${time || "00:00"}:00${offset || DEFAULT_OFFSET}`;
}

export function parseOptionalNumber(value) {
  if (!value.trim()) return undefined;
  const normalized = Number(value.replace(",", "."));
  return Number.isNaN(normalized) ? undefined : normalized;
}

export function parseJsonObject(value) {
  if (!value.trim()) return undefined;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : undefined;
  } catch {
    return undefined;
  }
}

export function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function toHex(value) {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, "0");
}

function rgbToHex(r, g, b) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function adjustColor(hex, amount) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);

  return rgbToHex(r + amount, g + amount, b + amount);
}

function getContrastingAccent(hex) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  return brightness > 150 ? adjustColor(hex, -90) : adjustColor(hex, 90);
}

export async function extractPalette(file) {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const width = 64;
    const height = Math.max(
      1,
      Math.round((image.height / image.width) * width)
    );

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    const { data } = ctx.getImageData(0, 0, width, height);
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;
    let bestScore = -1;
    let accent = DEFAULT_COLORS.accent_color;

    for (let index = 0; index < data.length; index += 16) {
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const alpha = data[index + 3];

      if (alpha < 150) continue;

      totalR += r;
      totalG += g;
      totalB += b;
      count += 1;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      const brightness = (r + g + b) / 3;
      const score = saturation * 255 + Math.abs(brightness - 128);

      if (score > bestScore) {
        bestScore = score;
        accent = rgbToHex(r, g, b);
      }
    }

    if (!count) {
      return DEFAULT_COLORS;
    }

    const main = rgbToHex(totalR / count, totalG / count, totalB / count);

    return {
      background_color: adjustColor(main, -24),
      secondary_color: adjustColor(main, 12),
      accent_color: accent || getContrastingAccent(main),
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}
