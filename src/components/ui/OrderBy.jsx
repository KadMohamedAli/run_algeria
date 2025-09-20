"use client";

import { useState, useRef, useEffect } from "react";

const options = [
  { value: "date_asc", label: "Date la plus proche" },
  { value: "date_desc", label: "Date la plus éloignée" },
  { value: "price_asc", label: "Prix le plus bas" },
  { value: "price_desc", label: "Prix le plus élevé" },
  { value: "distance_asc", label: "Distance la plus courte" },
  { value: "distance_desc", label: "Distance la plus longue" },
  { value: "denivele_asc", label: "Dénivelé le plus faible" },
  { value: "denivele_desc", label: "Dénivelé le plus élevé" },
];

export default function OrderBy({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const btnRef = useRef(null);

  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open || !btnRef.current) return;

    const rect = btnRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // if the button is more to the right half of the screen, align dropdown right
    if (rect.left > viewportWidth / 2) {
      setAlignRight(true);
    } else {
      setAlignRight(false);
    }
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={btnRef}>
      {/* Mobile button */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden px-3 py-1.5 text-xs rounded-full 
                   bg-gray-700 text-gray-200 border border-gray-600 
                   shadow-sm hover:bg-gray-600 transition-all duration-200 flex items-center gap-1"
      >
        {current ? current.label : "Trier"}
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
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

      {/* Desktop button */}
      <button
        onClick={() => setOpen(!open)}
        className="hidden sm:flex px-3 py-2 text-sm rounded-md border border-gray-600 bg-gray-700 text-gray-200 
                   hover:bg-gray-600 items-center gap-1 transition"
      >
        {current ? current.label : "Trier"}
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
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

      {open && (
        <div
          className={`absolute mt-1 w-52 bg-gray-800 border border-gray-600 rounded-md shadow-lg z-50 
                      ${alignRight ? "right-0" : "left-0"}`}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition ${
                value === opt.value ? "bg-gray-700" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
