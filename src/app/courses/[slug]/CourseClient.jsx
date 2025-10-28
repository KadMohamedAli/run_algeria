"use client";

import { useMemo } from "react";
import { formatCourseDate } from "@/utils/DateUtils";
import {
  normalizeDistance,
  normalizeElevation,
  normalizePrice,
} from "@/utils/CourseUtils";
import wilayas from "@/data/wilaya.json";
import ImageAndInfos from "./ImageAndInfos";
import DescriptionComponent from "./Description";
import ConditionsComponent from "./Conditions";
import WinnerPricesComponent from "./WinnerPricesComponent";
import CourseTags from "./CourseTags";
import {
  BuildingOffice2Icon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

/* ===== HELPERS ===== */
const getWilayaName = (wilaya) => {
  if (!wilaya) return null;
  const code = String(wilaya).trim();
  const found = wilayas.find((w) => w.code === code || w.id === code);
  return found ? found.name : wilaya;
};

/* ===== MAIN PAGE ===== */
export default function CoursePageClient({ course }) {
  if (!course) return null;

  const date = course.date ? formatCourseDate(course.date) : null;
  const distance = course.distance ? normalizeDistance(course.distance) : null;
  const denivele = normalizeElevation(course.distance, course.denivele_plus);
  const wilaya = getWilayaName(course.wilaya);
  const pays = course.pays || "Algérie";
  const locationParts = useMemo(
    () => [course.commune, wilaya, pays].filter(Boolean).join(" • "),
    [course.commune, wilaya, pays]
  );
  // --- Identify types
  const typeCodes = Array.isArray(course.type)
    ? course.type
    : course.type
    ? [course.type]
    : [];

  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* === HEADER === */}
      <header className="pt-10 pb-4 px-6 md:px-12 text-center border-b border-white/10">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-3">
          {course.nom}
        </h1>
        <p className="text-gray-300 text-lg">
          {date && <>{date}</>}{" "}
          {locationParts && (
            <>
              {" • "}
              {locationParts}
            </>
          )}
        </p>
        {typeCodes && <CourseTags typeCodes={typeCodes} />}
      </header>

      {/* === MAIN CONTENT === */}
      <main className="mx-auto w-full px-2 md:px-2 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT PANEL */}
        <LeftPanel course={course} />

        {/* RIGHT PANEL (Sticky) */}
        <div className="lg:col-span-1">
          <RightPanel course={course} />
        </div>
      </main>
    </div>
  );
}

/* ===== LEFT PANEL ===== */
function LeftPanel({ course }) {
  return (
    <div className="lg:col-span-2 space-y-12">
      <ImageAndInfos course={course} />

      {course.description && <DescriptionComponent text={course.description} />}

      {Array.isArray(course.conditions) && course.conditions.length > 0 && (
        <ConditionsComponent conditions={course.conditions} />
      )}

      {course.prix_gagnants && (
        <WinnerPricesComponent prix_gagnants={course.prix_gagnants} />
      )}
    </div>
  );
}

/* ===== RIGHT PANEL ===== */
function RightPanel({ course }) {
  const org = course.organisateur_nom
    ? {
        name: course.organisateur_nom,
        phone: course.contact_numero,
        email: course.contact_email,
        website: course.site_web,
      }
    : null;

  if (!org) return null;

  return (
    <aside className="sticky top-24 bg-white/5 rounded-xl p-6 shadow-md">
      <h3 className="text-2xl font-semibold text-white mb-4">Organisateur</h3>

      <div className="space-y-3 text-gray-200 text-sm">
        {org.name && (
          <div className="flex items-center  gap-2">
            <BuildingOffice2Icon className="h-5 w-5 text-white flex-shrink-0" />
            <span>{org.name}</span>
          </div>
        )}

        {org.phone && (
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-5 w-5 text-white flex-shrink-0" />
            <a
              href={`tel:${org.phone}`}
              className="hover:underline text-blue-400"
            >
              {org.phone}
            </a>
          </div>
        )}

        {org.email && (
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="h-5 w-5 text-white flex-shrink-0" />
            <a
              href={`mailto:${org.email}`}
              className="hover:underline text-blue-400 break-words"
            >
              {org.email}
            </a>
          </div>
        )}

        {org.website && (
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="h-5 w-5 text-white flex-shrink-0" />
            <a
              href={org.website}
              className="text-blue-400 hover:underline break-words"
              target="_blank"
              rel="noopener noreferrer"
            >
              {org.website}
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
