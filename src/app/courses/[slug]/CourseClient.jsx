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
import WinnerPricesComponent from "./WinnerPricesComponent";
import CourseTags from "./CourseTags";
import RightPanel from "./RightPanel";

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

  const dateObj = course.date ? new Date(course.date) : null;
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const formattedTime = dateObj
    ? dateObj.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // --- Build location string ---
  const wilaya = course.wilaya || null;
  const pays = course.pays || "Algérie";
  const commune = course.commune?.trim() || "";

  const locationParts = [commune, wilaya, pays].filter(Boolean).join(", ");
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
          {formattedDate && (
            <>
              Le {formattedDate}
              {formattedTime && <> à {formattedTime}</>}
            </>
          )}
          {locationParts && <> • {locationParts}</>}
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
    <div className="lg:col-span-2 space-y-8">
      <ImageAndInfos course={course} />

      {course.description && <DescriptionComponent text={course.description} />}

      {course.prix_gagnants && (
        <WinnerPricesComponent prix_gagnants={course.prix_gagnants} />
      )}
    </div>
  );
}
