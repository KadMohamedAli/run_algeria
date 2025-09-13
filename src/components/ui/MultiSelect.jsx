"use client";

import { useState, useRef, useEffect } from "react";

export default function MultiSelect({ label, options, value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggle = (opt) => {
    // check if the option is already selected (compare by id)
    const exists = value.some((v) => v.id === opt.id);
    if (exists) {
      onChange(value.filter((v) => v.id !== opt.id));
    } else {
      onChange([...value, opt]);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sort options by id
  const sortedOptions = [...options].sort((a, b) => a.id - b.id);

  return (
    <div className="relative w-full sm:w-[200px]" ref={dropdownRef}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-600 bg-gray-800 rounded px-3 py-2 text-left text-sm text-white flex justify-between items-center"
      >
        <span>
          {value.length > 0
            ? `${label}: ${value.map((v) => v.name).join(", ")}`
            : label}
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

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-20 mt-1 w-full border border-gray-600 bg-gray-800 rounded shadow-lg max-h-48 overflow-y-auto p-2 text-sm text-white">
          {sortedOptions.map((opt) => {
            const isChecked = value.some((v) => v.id === opt.id);
            return (
              <label
                key={opt.id}
                className="flex items-center gap-2 mb-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(opt)}
                  className="accent-blue-500"
                />
                {opt.name}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
