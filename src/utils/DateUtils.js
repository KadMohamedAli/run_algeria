export const formatCourseDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  const timeOptions = { hour: "2-digit", minute: "2-digit" };

  if (isToday) {
    return `Aujourd'hui ${new Intl.DateTimeFormat("fr-FR", timeOptions).format(
      date
    )}`;
  } else if (isTomorrow) {
    return `Demain ${new Intl.DateTimeFormat("fr-FR", timeOptions).format(
      date
    )}`;
  } else {
    const options = { day: "numeric", month: "short", ...timeOptions };
    if (date.getFullYear() !== now.getFullYear()) {
      options.year = "numeric";
    }
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  }
};

export function formatChrono(seconds) {
  if (!seconds || seconds <= 0) return "—";

  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  let parts = [];
  if (days) parts.push(`${days}j`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (!days && !hours && seconds) parts.push(`${seconds}s`);

  return parts.join(" ");
}