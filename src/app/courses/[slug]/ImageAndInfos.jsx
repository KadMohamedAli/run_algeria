import Image from "next/image";
import {
  normalizeDistance,
  normalizeElevation,
  normalizePrice,
} from "@/utils/CourseUtils";
import InfoLine from "./InfoLine";
import {
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { formatChrono } from "@/utils/DateUtils";
import typesData from "@/data/type.json";

export default function ImageAndInfos({ course }) {
  // --- Parse and normalize fields
  const distance = course.distance;
  const rawDenivele = course.denivele_plus;
  const rawPrice = course.prix_inscription
    ? normalizePrice(course.prix_inscription)
    : null;

  const price =
    rawPrice && !isNaN(parseFloat(rawPrice)) ? `${rawPrice} DA` : rawPrice;

  // --- Identify types
  const typeCodes = Array.isArray(course.type)
    ? course.type
    : course.type
    ? [course.type]
    : [];

  const typeObjects = typeCodes
    .map((code) => typesData.find((t) => t.code === code))
    .filter(Boolean);

  const isChronoType = typeCodes.includes(25);

  // --- Compute chrono display using helper
  const chronoDisplay =
    isChronoType && course.chrono ? formatChrono(course.chrono) : null;

  // --- Handle elevation
  let denivele = null;
  if (rawDenivele) {
    if (!isNaN(parseFloat(rawDenivele))) {
      denivele = `${rawDenivele} m D+`;
    } else {
      denivele = rawDenivele; // keep text as-is
    }
  }

  return (
    <section className="flex flex-col md:flex-row gap-8">
      {/* Image */}
      <div className="relative w-full md:w-1/2 aspect-[3/4] rounded-xl overflow-hidden">
        {course.image ? (
          <Image
            src={
              course.image.startsWith("/")
                ? course.image
                : `/images/${course.image}`
            }
            alt={course.nom}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Image non disponible</p>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
        {/* If chrono race → show chrono instead of distance */}
        {isChronoType && chronoDisplay ? (
          <InfoLine icon={ClockIcon} label="Durée" value={chronoDisplay} />
        ) : (
          distance && (
            <InfoLine
              icon={ChartBarIcon}
              label="Distance"
              value={
                Array.isArray(distance)
                  ? `${distance.join("+")} km`
                  : `${distance} km`
              }
            />
          )
        )}

        {denivele && (
          <InfoLine icon={ChartBarIcon} label="Dénivelé" value={denivele} />
        )}

        {/* make some space */}
        {denivele && <div></div>}

        {price && (
          <InfoLine
            icon={CurrencyDollarIcon}
            label="Prix"
            value={price}
            bgColor={"#ab3300"}
          />
        )}
      </div>
    </section>
  );
}
