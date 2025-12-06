/**
 * Normalize distance:
 * - exactly 21.1 → "Semi-marathon"
 * - exactly 42.2 → "Marathon"
 * - else → numeric with "km"
 */
export function normalizeDistance(distance) {
  if (distance === null || distance === undefined) return null;

  // If it's an array (e.g., [12, 12]), handle each element
  if (Array.isArray(distance)) {
    const normalizedParts = distance.map((d) => {
      let str = String(d).trim().toLowerCase();
      str = str.replace(/km|m/g, "").trim();
      const num = parseFloat(str);
      if (isNaN(num)) return d;
      if (num === 21.1) return "Semi-marathon";
      if (num === 42.2) return "Marathon";
      return `${num}`;
    });

    // Join with "+" to show multiple segments (e.g., "12+12 km")
    return `${normalizedParts.join("+")}`;
  }

  // Normal single-value case
  let str = String(distance).trim().toLowerCase();
  str = str.replace(/km|m/g, "").trim();

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
  // If deniveleM is not a number, return it as-is
  if (deniveleM === null || deniveleM === undefined || isNaN(Number(deniveleM))) {
    return deniveleM;
  }

  // If distance is missing, just return deniveleM
  if (!distanceKm) return deniveleM;

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

export const getPrice = (course) => {
  const price = parseFloat(course.prix_inscription);
  // Return null if price is not a number
  return isNaN(price) ? null : price;
};

export const getDistance = (course) => {
  if (!course.distance) return null;

  // Extract the first number from strings like "12+12" or "15 km"
  const match = String(course.distance).match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
};

export const getDenivele = (course) => course.denivele_plus || 0;
export const getDate = (course) => new Date(course.date || 0);

export const matchesSearch = (course, query) => {
  if (!query) return true;
  const q = query.toLowerCase();
  const haystack = [
    course.nom,
    course.description,
    course.organisateur_nom,
    course.commune,
    course.pays,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
};

export function filterCourses(courses, filters) {
  return courses.filter((course) => {
    if (filters.wilaya.length && !filters.wilaya.includes(String(course.wilaya)))
      return false;

    if (
      filters.type.length &&
      !course.type.some((t) => filters.type.includes(Number(t)))
    )
      return false;

    const courseDate = getDate(course);
    if (filters.date.start && courseDate < new Date(filters.date.start)) return false;
    if (filters.date.end && courseDate > new Date(filters.date.end)) return false;

    const coursePrice = getPrice(course);
    if (coursePrice < filters.price[0] || coursePrice > filters.price[1]) return false;

    const distance = getDistance(course);
    if (distance < filters.distance[0] || distance > filters.distance[1]) return false;

    const denivele = getDenivele(course);
    if (denivele < filters.denivele[0] || denivele > filters.denivele[1]) return false;

    if (!matchesSearch(course, filters.search)) return false;

    return true;
  });
}
export function sortCourses(courses, orderBy) {
  return courses.slice().sort((a, b) => {
    const [key, dir] = orderBy.split("_");
    const multiplier = dir === "desc" ? -1 : 1;

    const isChrono = (course) => course.type.includes(25);

    switch (key) {
      case "price": {
        const priceA = getPrice(a);
        const priceB = getPrice(b);
        if (priceA === null && priceB === null) return 0;
        if (priceA === null) return 1; // put missing prices at the end
        if (priceB === null) return -1;
        return (priceA - priceB) * multiplier;
      }
      case "distance": {
        const distA = getDistance(a);
        const distB = getDistance(b);

        // Chronometer races go last
        if (isChrono(a) && !isChrono(b)) return 1;
        if (!isChrono(a) && isChrono(b)) return -1;
        if (distA === null && distB === null) return 0;
        if (distA === null) return 1;
        if (distB === null) return -1;

        return (distA - distB) * multiplier;
      }
      case "denivele":
        return (getDenivele(a) - getDenivele(b)) * multiplier;
      case "date":
      default: {
        const dateA = getDate(a);
        const dateB = getDate(b);

        if (key === "date" && dir === "asc") {
          const now = new Date();
          const isPastA = dateA < now;
          const isPastB = dateB < now;
          if (isPastA && !isPastB) return 1;
          if (!isPastA && isPastB) return -1;
        }

        return (dateA - dateB) * multiplier;
      }
    }
  });
}