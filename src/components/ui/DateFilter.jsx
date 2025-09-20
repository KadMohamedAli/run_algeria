"use client";
import { useState, useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid"; // heroicons (tailwind)
import LabelWithCount from "./LabelWithCount"; // import

export default function DateRangeFilter({ label, value = {}, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const normalizeDate = (dateStr, isStart) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isStart) {
      date.setHours(0, 0, 0, 0); // début journée
    } else {
      date.setHours(23, 59, 59, 999); // fin journée
    }
    return date.toISOString();
  };

  const handleFrom = (e) => {
    onChange({
      ...value,
      start: normalizeDate(e.target.value, true),
    });
  };

  const handleTo = (e) => {
    onChange({
      ...value,
      end: normalizeDate(e.target.value, false),
    });
  };

  const clearFrom = () => {
    onChange({ ...value, start: null });
  };

  const clearTo = () => {
    onChange({ ...value, end: null });
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

  const activeCount = [value.start, value.end].filter(Boolean).length;

  return (
    <div className="relative w-full sm:w-[200px]" ref={dropdownRef}>
      {/* Bouton affichage */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-600 bg-gray-800 rounded px-3 py-2 text-left text-sm text-white flex justify-between items-center whitespace-nowrap overflow-hidden"
      >
        <LabelWithCount label={label} count={activeCount} />
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
        <div className="absolute z-20 mt-1 w-full border border-gray-600 bg-gray-800 rounded shadow-lg p-2 flex flex-col gap-3 text-sm text-white">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Début</label>
            <div className="flex items-center gap-2 transition-all duration-300">
              <input
                type="date"
                value={value.start ? value.start.slice(0, 10) : ""}
                onChange={handleFrom}
                className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
              />
              {value.start && (
                <button
                  type="button"
                  onClick={clearFrom}
                  className="text-orange-400 hover:text-orange-300 flex-shrink-0 transition-all duration-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Fin</label>
            <div className="flex items-center gap-2 transition-all duration-300">
              <input
                type="date"
                value={value.end ? value.end.slice(0, 10) : ""}
                onChange={handleTo}
                className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
              />
              {value.end && (
                <button
                  type="button"
                  onClick={clearTo}
                  className="text-orange-400 hover:text-orange-300 flex-shrink-0 transition-all duration-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
