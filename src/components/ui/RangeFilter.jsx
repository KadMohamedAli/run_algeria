"use client";
import { useState, useRef, useEffect } from "react";

export default function RangeFilter({
  label,
  min,
  max,
  value = [min, max],
  unit = "", // unit prompt, e.g., "kg", "€"
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

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-[200px]" ref={containerRef}>
      {/* Button display */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-600 bg-gray-800 rounded px-3 py-2 text-left text-sm text-white flex justify-between items-center whitespace-nowrap overflow-hidden"
      >
        <span className="truncate">
          {label}: {minVal} → {maxVal} {unit}
        </span>
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

      {/* Dropdown inputs */}
      {open && (
        <div className="absolute z-20 mt-1 w-full border border-gray-600 bg-gray-800 rounded shadow-lg p-3 flex flex-col gap-3 text-sm text-white">
          {/* Dropdown label */}
          <div className="text-sm font-medium text-gray-200">{label}</div>

          {/* Min input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Min ({unit})</label>
            <input
              type="number"
              value={minVal}
              onChange={handleMin}
              min={min}
              max={maxVal}
              className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full text-sm text-center"
              placeholder={`Min ${unit}`}
            />
          </div>

          {/* Max input */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-300">Max ({unit})</label>
            <input
              type="number"
              value={maxVal}
              onChange={handleMax}
              min={minVal}
              max={max}
              className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full text-sm text-center"
              placeholder={`Max ${unit}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
