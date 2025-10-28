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

/**
 * Formatte un intervalle de dates en texte humain
 */
export function formatDateRange(start, end) {
  if (!start && !end) return "";

  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : null;

  // Cas : une seule date
  if (s && !e) {
    if (isToday(s)) return "Aujourd’hui";
    if (isTomorrow(s)) return "Demain";
    if (isYesterday(s)) return "Hier";
    return `Après le ${formatShort(s)}`;
  }

  if (!s && e) {
    if (isToday(e)) return "Jusqu’à aujourd’hui";
    if (isTomorrow(e)) return "Avant demain";
    if (isYesterday(e)) return "Avant hier";
    return `Avant le ${formatShort(e)}`;
  }

  // Cas : deux dates
  if (s && e) {
    if (isToday(s) && isToday(e)) return "Aujourd’hui";
    if (isYesterday(s) && isYesterday(e)) return "Hier";
    if (isTomorrow(s) && isTomorrow(e)) return "Demain";

    // Différences
    const daysDiff = differenceInDays(e, s);
    const weeksDiff = differenceInWeeks(e, s);
    const monthsDiff = differenceInMonths(e, s);

    // Prochains jours
    if (isToday(s) && daysDiff > 1 && daysDiff <= 6) {
      return `${daysDiff + 1} prochains jours`;
    }

    // Prochaines semaines
    if (isToday(s) && weeksDiff === 1) return "Prochaine semaine";
    if (isToday(s) && weeksDiff > 1 && weeksDiff <= 4) {
      return `${weeksDiff} prochaines semaines`;
    }

    // Prochains mois
    if (isToday(s) && monthsDiff === 1) return "Prochain mois";
    if (isToday(s) && monthsDiff > 1 && monthsDiff <= 11) {
      return `${monthsDiff} prochains mois`;
    }

    // Cette année
    if (isToday(s) && e <= endOfYear(new Date())) {
      return "Cette année";
    }

    // Par défaut
    return `${formatShort(s)} → ${formatShort(e)}`;
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