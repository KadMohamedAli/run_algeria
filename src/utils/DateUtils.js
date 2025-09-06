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