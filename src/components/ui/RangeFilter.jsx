"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import LabelWithCount from "./LabelWithCount";

export default function RangeFilter({
  label,
  min,
  max,
  value = [min, max],
  unit = "",
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);
  const containerRef = useRef(null);

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

  // stable timer ref for debounce
  const timerRef = useRef(null);
  const minInputRef = useRef(null);
  const maxInputRef = useRef(null);
  const lastFocused = useRef("min");

  const normalizeValues = useCallback(
    (low, high) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        if (low > high) {
          // swap
          setMinVal(high);
          setMaxVal(low);
          onChange([high, low]);

          // restore focus AFTER swap
          setTimeout(() => {
            if (lastFocused.current === "min") {
              // user was typing in Min → focus should move to Max
              maxInputRef.current?.focus();
            } else {
              // user was typing in Max → focus should move to Min
              minInputRef.current?.focus();
            }
          }, 0);
        } else {
          onChange([low, high]);
        }

        timerRef.current = null;
      }, 500);
    },
    [onChange]
  );
  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleMin = (e) => {
    const val = Number(e.target.value === "" ? null : e.target.value);
    setMinVal(val);
    normalizeValues(val, maxVal);
  };

  const handleMax = (e) => {
    const val = Number(e.target.value === "" ? null : e.target.value);
    setMaxVal(val);
    normalizeValues(minVal, val);
  };

  const clearMin = () => {
    setMinVal(min);
    onChange([min, maxVal]);
  };
  const clearMax = () => {
    setMaxVal(max);
    onChange([minVal, max]);
  };

  // Bloquer caractères non numériques
  const blockInvalidChars = (e) => {
    // allow: digits, Backspace, Delete, Arrow keys, Tab
    // block e/E + + - . for integer-only
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Empêcher coller ou input invalides
  const sanitizeInput = (e) => {
    let clean = e.target.value.replace(/[^0-9]/g, ""); // garder que digits
    if (clean !== e.target.value) {
      // For controlled input we still update the underlying state
      e.target.value = clean;
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (!/^\d+$/.test(paste)) {
      e.preventDefault();
    }
  };

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
                type="text"
                inputMode="numeric"
                ref={minInputRef}
                value={minVal}
                onChange={handleMin}
                onKeyDown={blockInvalidChars}
                onInput={sanitizeInput}
                onPaste={handlePaste}
                onFocus={() => (lastFocused.current = "min")}
                className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full text-sm text-center focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder={`Min ${unit}`}
              />
              {minVal !== min && (
                <button
                  type="button"
                  onClick={clearMin}
                  className="text-orange-400 hover:text-orange-300 shrink-0 transition-all duration-300"
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
                type="text"
                inputMode="numeric"
                ref={maxInputRef}
                value={maxVal}
                onChange={handleMax}
                onKeyDown={blockInvalidChars}
                onInput={sanitizeInput}
                onPaste={handlePaste}
                onFocus={() => (lastFocused.current = "max")}
                className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full text-sm text-center focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder={`Max ${unit}`}
              />
              {maxVal !== max && (
                <button
                  type="button"
                  onClick={clearMax}
                  className="text-orange-400 hover:text-orange-300 shrink-0 transition-all duration-300"
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
