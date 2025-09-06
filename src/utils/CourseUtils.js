/**
 * Normalize distance:
 * - exactly 21.1 → "Semi-marathon"
 * - exactly 42.2 → "Marathon"
 * - else → numeric with "km"
 */
export function normalizeDistance(distance) {
  if (distance === null || distance === undefined) return null;

  let str = String(distance).trim().toLowerCase();
  str = str.replace(/km|m/g, "").trim(); // remove units if present

  const num = parseFloat(str);
  if (isNaN(num)) return distance;

  if (num === 21.1) return "Semi-marathon";
  if (num === 42.2) return "Marathon";

  return `${num}`;
}

/**
 * Normalize elevation relative to distance:
 * - ratio < 1% → "Plat"
 * - else keep numeric value
 */
export function normalizeElevation(distanceKm, deniveleM) {
  if (!distanceKm || !deniveleM) return null;

  const d = parseFloat(String(distanceKm).trim().toLowerCase().replace(/km|m/g, "").trim());
  const e = parseFloat(String(deniveleM).trim().toLowerCase().replace(/km|m/g, "").trim());

  if (isNaN(d) || isNaN(e) || d <= 0) return deniveleM;

  const ratio = e / (d * 1000);

  if (ratio < 0.005) return "Plat";

  return `${e}`;
}

/**
 * Normalize price:
 * - 0 → "Gratuit"
 * - strip "DA"/"da" and spaces
 */
export function normalizePrice(price) {
  if (price === null || price === undefined) return null;

  let str = String(price).trim().toLowerCase();
  str = str.replace(/da/g, "").trim();

  if (str === "0" || str === "") return "Gratuit";

  return `${str}`;
}
