export const addCourseAlgerieTracking = (url) => {
  if (!url) return url;

  try {
    const trackedUrl = new URL(url);

    trackedUrl.searchParams.set("utm_source", "coursealgerie");
    trackedUrl.searchParams.set("utm_medium", "referral");
    trackedUrl.searchParams.set("utm_campaign", "registration");

    return trackedUrl.toString();
  } catch {
    return url;
  }
};
