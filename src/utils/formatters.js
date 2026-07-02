import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  addDays,
  addWeeks,
  addMonths,
  endOfYear,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from "date-fns";
import { fr } from "date-fns/locale";

// Format court avec mois FR
const formatShort = (date) => format(date, "d MMM yyyy", { locale: fr });
const isValidDate = (value) =>
  value instanceof Date && !Number.isNaN(value.getTime());

/**
 * Formatte un intervalle de dates en texte humain
 */
export function formatDateRange(start, end) {
  if (!start && !end) return "";

  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  const s = isValidDate(startDate) ? startDate : null;
  const e = isValidDate(endDate) ? endDate : null;

  if (!s && !e) return "";

  // === Cas : une seule date (début ou fin) ===
  if (s && !e) {
    if (isToday(s)) return "À partir d’aujourd’hui";
    if (isTomorrow(s)) return "À partir de demain";
    if (isYesterday(s)) return "À partir d’hier";
    return `À partir du ${formatShort(s)}`;
  }

  if (!s && e) {
    if (isToday(e)) return "Jusqu’à aujourd’hui";
    if (isTomorrow(e)) return "Jusqu’à demain";
    if (isYesterday(e)) return "Jusqu’à hier";
    return `Jusqu’au ${formatShort(e)}`;
  }

  // === Cas : deux dates ===
  if (s && e) {
    if (isToday(s) && isToday(e)) return "Aujourd’hui";
    if (isYesterday(s) && isYesterday(e)) return "Hier";
    if (isTomorrow(s) && isTomorrow(e)) return "Demain";

    const daysDiff = differenceInDays(e, s);
    const weeksDiff = differenceInWeeks(e, s);
    const monthsDiff = differenceInMonths(e, s);

    // Périodes à partir d’aujourd’hui
    if (isToday(s)) {
      if (daysDiff > 0 && daysDiff <= 6) {
        return `Les ${daysDiff + 1} prochains jours`;
      }
      if (weeksDiff === 1) return "La semaine prochaine";
      if (weeksDiff > 1 && weeksDiff <= 4)
        return `Les ${weeksDiff} prochaines semaines`;
      if (monthsDiff === 1) return "Le mois prochain";
      if (monthsDiff > 1 && monthsDiff <= 11)
        return `Les ${monthsDiff} prochains mois`;
      if (e <= endOfYear(new Date())) return "Cette année";

      return `À partir d’aujourd’hui jusqu’au ${formatShort(e)}`;
    }

    // Cas général
    return `Du ${formatShort(s)} au ${formatShort(e)}`;
  }

  return "";
}
/**
 * Formatte un prix avec espace fine insécable
 */
export function formatPrice(value) {
  if (typeof value !== "number") return value;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f"); // petit espace
}

export function formatPhoneNumber(phone) {
  if (!phone || typeof phone !== "string") return phone;

  // Only handle Algerian numbers starting with +213
  if (phone.startsWith("+213")) {
    // Remove +213 and keep the rest
    const localPart = phone.replace("+213", "0").replace(/\s+/g, "");

    // Try grouping digits: 0X XX XX XX XX
    return localPart.replace(
      /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
      "$1 $2 $3 $4 $5"
    );
  }

  return phone; // no change for others
}

// --- Format URLs: remove protocol for cleaner display
export function formatWebsite(url) {
  if (!url || typeof url !== "string") return url;
  return url.replace(/^https?:\/\//, "").replace(/\/$/, ""); // remove http(s):// and trailing slash
}
