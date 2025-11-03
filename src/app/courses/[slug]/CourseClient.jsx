"use client";

import { useEffect, useState, useRef } from "react";
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

const formatOrdinals = (text) => {
  if (!text) return "";
  return text
    .replace(/(\d+)\s?e(?![a-zA-Z])/g, "$1<sup>ᵉ</sup>") // 5e → 5ᵉ
    .replace(/(\d+)\s?er(?![a-zA-Z])/g, "$1<sup>ᵉʳ</sup>"); // 1er → 1ᵉʳ
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

  const wilayaCode = course.wilaya || null;
  const wilaya = getWilayaName(wilayaCode);
  const pays = course.pays || "Algérie";
  const commune = course.commune?.trim() || "";
  const locationParts = [commune, wilaya, pays].filter(Boolean).join(", ");
  const typeCodes = Array.isArray(course.type)
    ? course.type
    : course.type
    ? [course.type]
    : [];

  const isPastEvent = course.date ? new Date(course.date) < new Date() : false;

  /* ===== Sticky button show/hide logic ===== */
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const diff = currentY - lastScrollY.current;

          if (Math.abs(diff) > 10) {
            // if scrolling down → show button, if up → hide
            setVisible(diff > 0 && currentY > 100);
            lastScrollY.current = currentY;
          }

          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* === HEADER === */}
      <header className="pt-4 md:pt-10 pb-4 px-6 md:px-12 text-center border-b border-white/10">
        <h1
          className="text-4xl md:text-6xl font-extrabold mb-3"
          dangerouslySetInnerHTML={{ __html: formatOrdinals(course.nom) }}
        />
        <p className="text-gray-300 text-lg">
          {formattedDate && (
            <span className="block sm:inline">
              {isPastEvent ? (
                <>
                  <span className="line-through">{`Le ${formattedDate}`}</span>
                  {formattedTime && (
                    <span className="line-through">{` à ${formattedTime}`}</span>
                  )}
                  <span className="block sm:inline ml-0 sm:ml-2 text-orange-600 font-semibold">
                    (Course terminée)
                  </span>
                </>
              ) : (
                <>
                  Le {formattedDate}
                  {formattedTime && <> à {formattedTime}</>}
                </>
              )}
            </span>
          )}

          {locationParts && (
            <>
              {/* Mobile: line break */}
              <span className="block sm:hidden">{locationParts}</span>

              {/* Desktop: bullet separator */}
              <span className="hidden sm:inline sm:before:content-['•'] sm:before:mx-1">
                {locationParts}
              </span>
            </>
          )}
        </p>

        {typeCodes && <CourseTags typeCodes={typeCodes} />}
      </header>

      {/* === MAIN CONTENT === */}
      <main className="mx-auto w-full px-2 md:px-2 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12 md:mb-0">
        {/* LEFT PANEL */}
        <LeftPanel course={course} />

        {/* RIGHT PANEL (Sticky) */}
        <div className="lg:col-span-1">
          <RightPanel course={course} />
        </div>
      </main>

      {/* === Sticky Inscription Button (mobile only) === */}
      {course.inscription_link && !isPastEvent && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 sm:hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.3,1)] ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="bg-gray-900/95 border-t border-white/10 px-4 py-3 backdrop-blur-sm shadow-[0_-2px_15px_rgba(0,0,0,0.4)]">
            <a
              href={course.inscription_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full bg-[#ab3300] text-white uppercase text-lg font-black py-3 rounded-lg shadow-md hover:bg-[#c33b00] transition-all duration-300 ease-in-out"
            >
              S’inscrire
            </a>
          </div>
        </div>
      )}
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
