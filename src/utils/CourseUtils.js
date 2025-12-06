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
  if (
    deniveleM === null ||
    deniveleM === undefined ||
    isNaN(Number(deniveleM))
  ) {
    return deniveleM;
  }

  // If distance is missing, just return deniveleM
  if (!distanceKm) return deniveleM;

  const d = parseFloat(
    String(distanceKm).trim().toLowerCase().replace(/km|m/g, "").trim()
  );
  const e = parseFloat(
    String(deniveleM).trim().toLowerCase().replace(/km|m/g, "").trim()
  );

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

export function getPrice(course) {
  const raw = course.prix_inscription;
  if (raw === null || raw === undefined) return null;

  const parsed = parseFloat(String(raw).trim().replace(",", "."));
  const price = isNaN(parsed) ? null : parsed;

  return price;
}

export function getPriceForSort(course, dir = "asc") {
  const price = getPrice(course);
  if (price === null) {
    // Unknown price: put at the end
    return dir === "asc" ? Infinity : -Infinity;
  }
  return price;
}

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
    if (
      filters.wilaya.length &&
      !filters.wilaya.includes(String(course.wilaya))
    )
      return false;

    if (
      filters.type.length &&
      !course.type.some((t) => filters.type.includes(Number(t)))
    )
      return false;

    const courseDate = getDate(course);
    if (filters.date.start && courseDate < new Date(filters.date.start))
      return false;
    if (filters.date.end && courseDate > new Date(filters.date.end))
      return false;

    const coursePrice = getPrice(course);

    if (coursePrice < filters.price[0] || coursePrice > filters.price[1])
      return false;

    const distance = getDistance(course);
    if (distance < filters.distance[0] || distance > filters.distance[1])
      return false;

    const denivele = getDenivele(course);
    if (denivele < filters.denivele[0] || denivele > filters.denivele[1])
      return false;

    if (!matchesSearch(course, filters.search)) return false;

    return true;
  });
}
export function sortCourses(courses, orderBy) {
  const [key, dir] = orderBy.split("_");
  const multiplier = dir === "desc" ? -1 : 1;

  const isChrono = (course) => course.type.includes(25);

  // Map courses with original index for stable sort
  return courses
    .map((course, index) => ({ course, index }))
    .sort((a, b) => {
      const A = a.course;
      const B = b.course;

      switch (key) {
        case "price": {
          const priceA = getPrice(A);
          const priceB = getPrice(B);

          const isUnknownA = priceA === null;
          const isUnknownB = priceB === null;

          // Unknown prices always go last
          if (isUnknownA && isUnknownB) {
            return a.index - b.index; // stable among unknowns
          }
          if (isUnknownA) {
            return 1;
          }
          if (isUnknownB) {
            return -1;
          }

          // Both prices known, compare properly with multiplier
          if (priceA < priceB) {
            return -1 * multiplier;
          }
          if (priceA > priceB) {
            return 1 * multiplier;
          }

          return a.index - b.index;
        }

        case "distance": {
          const distA = getDistance(A);
          const distB = getDistance(B);

          // Chronometer races go last
          if (isChrono(A) && !isChrono(B)) return 1;
          if (!isChrono(A) && isChrono(B)) return -1;

          if (distA === null && distB === null) return a.index - b.index;
          if (distA === null) return 1;
          if (distB === null) return -1;

          const diff = (distA - distB) * multiplier;
          return diff === 0 ? a.index - b.index : diff;
        }

        case "denivele": {
          const diff = (getDenivele(A) - getDenivele(B)) * multiplier;
          return diff === 0 ? a.index - b.index : diff;
        }

        case "date":
        default: {
          const dateA = getDate(A);
          const dateB = getDate(B);

          if (key === "date" && dir === "asc") {
            const now = new Date();
            const isPastA = dateA < now;
            const isPastB = dateB < now;
            if (isPastA && !isPastB) return 1;
            if (!isPastA && isPastB) return -1;
          }

          const diff = (dateA - dateB) * multiplier;
          return diff === 0 ? a.index - b.index : diff;
        }
      }
    })
    .map(({ course }) => course);
}
