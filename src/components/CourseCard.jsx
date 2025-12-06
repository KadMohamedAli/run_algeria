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
import wilayas from "@/data/wilaya.json";

const getWilayaName = (wilaya) => {
  if (wilaya === null || wilaya === undefined) return "—";
  const code = String(wilaya).trim();
  if (/^\d+$/.test(code)) {
    const found = wilayas.find((w) => w.code === code || w.id === code);
    if (found) return found.name;
  }
  return wilaya;
};

export default function CourseCard({ course }) {
  const isPast = new Date(course.date) < new Date();

  const colors = {
    main: course.colors?.background_color || "#141c3c",
    secondary: course.colors?.secondary_color || "#856140",
    accent: course.colors?.accent_color || "#083B92",
  };

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block w-full relative"
    >
      <div
        className="relative flex flex-col rounded-xl overflow-hidden transition-all duration-900 ease-out h-36 md:h-42
          hover:scale-101 hover:-translate-y-1
          shadow-2xl hover:shadow-2xl
          before:absolute before:inset-0 before:rounded-xl before:pointer-events-none
          before:opacity-0 hover:before:opacity-80 before:transition-opacity before:duration-500
          before:bg-linear-to-br before:from-white/8 before:via-transparent before:to-orange-500/5
          after:absolute after:-inset-0.5 after:rounded-xl after:pointer-events-none
          after:opacity-50 hover:after:opacity-100 after:transition-opacity after:duration-500
          after:bg-linear-to-br after:from-orange-500/60 after:via-orange-400/30 after:to-transparent after:-z-10
          drop-shadow-lg hover:drop-shadow-2xl"
        style={{
          filter: isPast ? "saturate(0.4)" : "none",
          border: `2px solid ${colors.accent}55`,
          transition:
            "filter 0.3s ease-in-out, transform 0.5s ease-out, box-shadow 0.5s ease-out, border-color 0.3s ease-out",
          boxShadow: `
            0 15px 35px ${colors.accent}22, 
            0 8px 20px ${colors.main}33, 
            0 0 30px ${colors.accent}44,
            0 0 50px ${colors.accent}22,
            inset 0 1px 1px rgba(255, 255, 255, 0.05)
          `,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `
            0 20px 40px ${colors.accent}44,
            0 10px 25px ${colors.main}55,
            0 0 40px ${colors.accent}66,
            0 0 60px ${colors.accent}44,
            inset 0 1px 2px rgba(255, 255, 255, 0.1)
          `;
          e.currentTarget.style.borderColor = `${colors.accent}AA`; // stronger border on hover
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `
            0 15px 35px ${colors.accent}22, 
            0 8px 20px ${colors.main}33, 
            0 0 30px ${colors.accent}44,
            0 0 50px ${colors.accent}22,
            inset 0 1px 1px rgba(255, 255, 255, 0.05)
          `;
          e.currentTarget.style.borderColor = `${colors.accent}55`; // revert to original
        }}
      >
        {/* CARD CONTENT WRAPPER */}
        <div className="flex flex-row h-full">
          {/* FULL-CARD BACKGROUND */}
          <SubtleBackground
            color={colors.main}
            image={course.image ? course.image : null}
            isPast={isPast}
          />

          {/* LEFT: Content */}
          <div
            className={`relative flex flex-col justify-around text-center z-10 py-2 px-2 ${
              course.image ? "w-3/4" : "w-full"
            }
            transition-all duration-500 group-hover:brightness-110`}
          >
            {/* Title */}
            <CourseTitle text={course.nom} seed={course.id} />

            {/* Distance or Chrono */}
            <div
              className="w-full px-1 flex justify-around text-white text-sm md:text-base items-center
              transition-all duration-500 group-hover:scale-105"
            >
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
              <p
                className="flex px-1 items-center justify-start gap-1 text-white text-sm md:text-base
                transition-all duration-500 group-hover:text-orange-300"
              >
                <ClockIcon className="h-4 w-4 md:h-5 md:w-5 transition-all duration-500 group-hover:scale-110" />
                {formatCourseDate(course.date)} à {getWilayaName(course.wilaya)}
              </p>
            )}
          </div>

          {/* RIGHT: Image */}
          {course.image && (
            <div className="relative w-1/4 h-full overflow-hidden z-10 group/image">
              <Image
                alt={course.nom || course.name || "Course image"}
                src={
                  course.image.startsWith("/")
                    ? course.image
                    : `/images/${course.image}`
                }
                className="
          h-full w-full object-cover 
          transform transition-all ease-out duration-700
          brightness-75 blur-[0.25px]
          group-hover/image:scale-115 group-hover/image:brightness-100 group-hover/image:blur-[0px]
        "
                width={300}
                height={300}
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to left, black 65%, transparent 100%)",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "100% 100%",
                  maskImage:
                    "linear-gradient(to left, black 65%, transparent 100%)",
                  maskRepeat: "no-repeat",
                  maskSize: "100% 100%",
                }}
              />
            </div>
          )}
        </div>

        {/* FINI badge */}
        {isPast && (
          <div
            className="absolute top-2 right-2 bg-linear-to-br from-orange-600 to-red-700 text-white text-xs font-black px-2.5 py-1 rounded-lg z-30
            shadow-md hover:shadow-lg
            transition-all duration-400 group-hover:scale-110
            border border-orange-400/40"
          >
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
                className="absolute bottom-2 right-2 text-white text-xs font-black px-2.5 py-1 rounded-lg z-30
                  shadow-md transition-all duration-400 group-hover:scale-110
                  border border-orange-400/40"
                style={{
                  backgroundColor: colors.secondary,
                  boxShadow: `0 4px 12px ${colors.secondary}55`,
                }}
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
