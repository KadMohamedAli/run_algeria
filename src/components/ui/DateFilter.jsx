"use client";
import { useState, useRef, useEffect } from "react";

export default function DateRangeFilter({ label, value = {}, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleFrom = (e) => {
    onChange({ ...value, from: e.target.value });
  };

  const handleTo = (e) => {
    onChange({ ...value, to: e.target.value });
  };

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to format date string as "dd MMM. yyyy"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
      .format(date)
      .replace("sept.", "Sep.") // optional abbreviation consistency
      .replace("août", "Août"); // adjust any month abbreviations if needed
  };

  const formattedRange =
    value.from && value.to
      ? `${formatDate(value.from)} → ${formatDate(value.to)}`
      : value.from
      ? `${formatDate(value.from)} → ...`
      : value.to
      ? `... → ${formatDate(value.to)}`
      : "";

  return (
    <div className="relative w-full sm:w-[200px]" ref={dropdownRef}>
      {/* Bouton affichage */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-600 bg-gray-800 rounded px-3 py-2 text-left text-sm text-white flex justify-between items-center whitespace-nowrap overflow-hidden"
      >
        <span className="truncate">{formattedRange || label}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Panneau du dropdown */}
      {open && (
        <div className="absolute z-20 mt-1 w-full border border-gray-600 bg-gray-800 rounded shadow-lg p-2 flex flex-col gap-2 text-sm text-white">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Début</label>
            <input
              type="date"
              value={value.from || ""}
              onChange={handleFrom}
              className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Fin</label>
            <input
              type="date"
              value={value.to || ""}
              onChange={handleTo}
              className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
