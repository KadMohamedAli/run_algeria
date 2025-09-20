"use client";
import { useState, useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import LabelWithCount from "./LabelWithCount"; // import

export default function RangeFilter({
  label,
  min,
  max,
  value = [min, max],
  unit = "",
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [minVal, maxVal] = value;
  const containerRef = useRef(null);

  const handleMin = (e) => {
    const val = Number(e.target.value);
    if (val <= maxVal && val >= min) onChange([val, maxVal]);
  };

  const handleMax = (e) => {
    const val = Number(e.target.value);
    if (val >= minVal && val <= max) onChange([minVal, val]);
  };

  const clearMin = () => onChange([min, maxVal]);
  const clearMax = () => onChange([minVal, max]);

  // Fermer si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCount = (minVal !== min ? 1 : 0) + (maxVal !== max ? 1 : 0);

  return (
    <div className="relative w-full sm:w-[200px]" ref={containerRef}>
      {/* Bouton principal */}
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

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-1 w-full border border-gray-600 bg-gray-800 rounded shadow-lg p-3 flex flex-col gap-3 text-sm text-white">
          <div className="text-sm font-medium text-gray-200">{label}</div>

          {/* Min input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Min ({unit})</label>
            <div className="flex items-center gap-2 transition-all duration-300">
              <input
                type="number"
                value={minVal}
                onChange={handleMin}
                min={min}
                max={maxVal}
                className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full text-sm text-center focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder={`Min ${unit}`}
              />
              {minVal !== min && (
                <button
                  type="button"
                  onClick={clearMin}
                  className="text-orange-400 hover:text-orange-300 flex-shrink-0 transition-all duration-300"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Max input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Max ({unit})</label>
            <div className="flex items-center gap-2 transition-all duration-300">
              <input
                type="number"
                value={maxVal}
                onChange={handleMax}
                min={minVal}
                max={max}
                className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full text-sm text-center focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder={`Max ${unit}`}
              />
              {maxVal !== max && (
                <button
                  type="button"
                  onClick={clearMax}
                  className="text-orange-400 hover:text-orange-300 flex-shrink-0 transition-all duration-300"
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
