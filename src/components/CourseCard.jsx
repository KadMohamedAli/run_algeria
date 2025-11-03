import Link from "next/link";
import Image from "next/image";
import { ClockIcon } from "@heroicons/react/24/outline";
import CourseTitle from "./CourseTitle";
import CourseInfoItem from "./CourseInfoItem";
import SubtleBackground from "./Background";
import { formatCourseDate, formatChrono } from "../utils/DateUtils";
import {
  normalizeDistance,
  normalizePrice,
  normalizeElevation,
} from "../utils/CourseUtils";
import wilayas from "@/data/wilaya.json"; // adjust path

const getWilayaName = (wilaya) => {
  if (wilaya === null || wilaya === undefined) return "—";

  // Convert wilaya to string for uniform matching
  const code = String(wilaya).trim();

  // Only continue if code is purely numeric
  if (/^\d+$/.test(code)) {
    const found = wilayas.find((w) => w.code === code || w.id === code);
    if (found) return found.name;
  }

  return wilaya; // return as-is if not numeric
};

export default function CourseCard({ course }) {
  const isPast = new Date(course.date) < new Date();

  const colors = {
    main: course.colors?.background_color || "#141c3c", // default dark blue
    secondary: course.colors?.secondary_color || "#856140", // default light contrast
    accent: course.colors?.accent_color || "#083B92", // default vivid blue
  };

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block w-full relative"
    >
      <div
        className="relative flex rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-36 md:h-42"
        style={{
          outline: `1px solid ${colors.accent}`,
          filter: isPast ? "saturate(0.4)" : "none",
          transition: "filter 0.3s ease-in-out",
        }}
      >
        {/* FULL-CARD BACKGROUND */}
        <SubtleBackground
          color={colors.main}
          image={course.image ? course.image : null}
          isPast={isPast}
        />

        {/* LEFT: Content (3/4 or full width if no image) */}
        <div
          className={`relative flex flex-col justify-around text-center z-10 py-0 px-1 ${
            course.image ? "w-3/4" : "w-full"
          }`}
        >
          {/* Title */}
          <CourseTitle text={course.nom} seed={course.id} />

          {/* Distance or Chrono */}
          <div className="w-full px-1 flex justify-around text-white text-sm md:text-base items-center">
            {course.distance ? (
              (() => {
                const normDist = normalizeDistance(course.distance);
                const isNumeric = /^[0-9.+]+$/.test(
                  normDist.replace(" km", "")
                );
                return (
                  <CourseInfoItem
                    value={normDist}
                    suffix={isNumeric ? "KM" : null}
                  />
                );
              })()
            ) : course.chrono ? (
              (() => {
                const chronoStr = formatChrono(course.chrono);
                return <CourseInfoItem value={chronoStr} suffix={null} />;
              })()
            ) : (
              <CourseInfoItem value="—" suffix={null} />
            )}

            {/* Elevation */}
            {(() => {
              const normElev = normalizeElevation(
                course.distance,
                course.denivele_plus
              );
              const isNumeric = /^[0-9.]+$/.test(normElev);
              return (
                <CourseInfoItem
                  value={normElev}
                  suffix={isNumeric ? "D+" : null}
                />
              );
            })()}
          </div>

          {/* Date */}
          {course.date && (
            <p className="flex px-1 items-center justify-start gap-1 text-white text-xl">
              <ClockIcon className="h-5 w-5 text-white" />
              {formatCourseDate(course.date)} à {getWilayaName(course.wilaya)}
            </p>
          )}
        </div>

        {/* RIGHT: Image (1/4) */}
        {course.image && (
          <div className="relative w-1/4 h-full overflow-hidden z-10 group">
            <Image
              alt={course.nom || course.name || "Course image"}
              src={
                course.image.startsWith("/")
                  ? course.image
                  : `/images/${course.image}`
              }
              className="
        h-full w-full object-cover 
        transform transition-all ease-in-out duration-700 
        brightness-75 blur-[0.25px]
        group-hover:scale-110 group-hover:brightness-100 group-hover:blur-[0px]
      "
              width={300}
              height={300}
              style={{
                WebkitMaskImage:
                  "linear-gradient(to left, black 80%, transparent 100%)",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "100% 100%",
                maskImage:
                  "linear-gradient(to left, black 80%, transparent 100%)",
                maskRepeat: "no-repeat",
                maskSize: "100% 100%",
              }}
            />
          </div>
        )}

        {/* FINI badge */}
        {isPast && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-black px-2 py-1 rounded-bl-lg z-12">
            FINI
          </div>
        )}

        {/* Price badge */}
        {course.prix_inscription !== undefined &&
          (() => {
            const normPrice = normalizePrice(course.prix_inscription);
            const isNumeric = /^[0-9.]+/.test(normPrice);
            return (
              <div
                className="absolute bottom-0 right-0 text-white text-xs font-black px-2 py-1 rounded-tl-lg z-12"
                style={{ backgroundColor: colors.secondary }}
              >
                <CourseInfoItem
                  value={normPrice}
                  suffix={isNumeric ? "DA" : null}
                />
              </div>
            );
          })()}
      </div>
    </Link>
  );
}
