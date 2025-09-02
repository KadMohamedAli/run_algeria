import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import CourseTitle from "./CourseTitle";
import CourseInfoItem from "./CourseInfoItem";

export default function CourseCard({ course }) {
  // Format date
  const formatCourseDate = (dateString) => {
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
      return `Aujourd'hui ${new Intl.DateTimeFormat(
        "fr-FR",
        timeOptions
      ).format(date)}`;
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

  const isPast = new Date(course.date) < new Date();

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block w-min-[400px] w-full relative"
    >
      <div
        className={`relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 w-min-[400px] h-36 md:h-42`}
      >
        {/* Background Image */}
        {course.image && (
          <Image
            src={
              course.image.startsWith("/")
                ? course.image
                : `/images/${course.image}`
            }
            alt={course.name}
            className="h-full w-auto object-cover brightness-45 blur-[12px]"
            fill
          />
        )}

        {/* Foreground Image */}
        {course.image && (
          <div className="absolute top-0 right-0 h-full overflow-hidden">
            <Image
              src={
                course.image.startsWith("/")
                  ? course.image
                  : `/images/${course.image}`
              }
              alt={course.name}
              className="h-full w-auto object-cover brightness-75 blur-[1px] transform transition-transform ease-in-out duration-700 group-hover:scale-120"
              width={600}
              height={800}
            />
          </div>
        )}

        {/* Overlay */}
        <div
          className={`absolute inset-0 ${
            !isPast ? "bg-gray-900/60" : "bg-red-900/20"
          }`}
        ></div>

        {/* FINI badge */}
        {isPast && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-black px-2 py-1 rounded">
            FINI
          </div>
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-around text-center py-2 px-4">
          {/* Title */}
          <CourseTitle text={course.nom} seed={course.id} />

          {/* Info Items */}
          <div className="w-full flex justify-between mt-0 text-gray-200 text-sm md:text-base items-center">
            <CourseInfoItem value={course.distance} suffix="KM" />
            <CourseInfoItem
              value={course.denivele_plus ? `${course.denivele_plus}m` : null}
              suffix="D+"
            />
            <CourseInfoItem value={course.prix_inscription} suffix="DA" />
          </div>

          {/* Date */}
          {course.date && (
            <p className="flex items-center justify-center gap-1 text-white text-xl">
              <ClockIcon className="h-5 w-5 text-white" />
              {formatCourseDate(course.date)} à{" "}
              {course.commune ? course.commune + ", " : null}
              {course.wilaya}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
