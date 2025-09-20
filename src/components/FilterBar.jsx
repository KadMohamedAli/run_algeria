"use client";

import { useState } from "react";
import MultiSelect from "./ui/MultiSelect";
import RangeFilter from "./ui/RangeFilter";
import DateRangeFilter from "./ui/DateFilter";
import wilayas from "@/data/wilaya.json";
import runType from "@/data/type.json";

export default function FilterBar({ filters, setFilters }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const wilayaOptions = wilayas.map((w) => ({ id: w.id, name: w.name }));
  const typeOptions = runType.map((t) => ({ id: t.code, name: t.type }));

  return (
    <div className="mb-6 relative">
      {/* Subtle toggle button (mobile only) */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="sm:hidden absolute right-0 top-0 translate-y-[-120%] 
                   px-3 py-1.5 text-xs rounded-full 
                   bg-gray-700 text-gray-200 border border-gray-600 
                   shadow-sm hover:bg-gray-600 transition-all duration-200 flex items-center gap-1"
      >
        {mobileOpen ? "Masquer" : "Filtres"}
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            mobileOpen ? "rotate-180" : ""
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

      {/* Filters container */}
      <div
        className={`transition-all duration-500 ease-in-out
          ${
            mobileOpen
              ? "max-h-[1000px] opacity-100"
              : "max-h-0 opacity-0 sm:opacity-100 sm:max-h-none"
          }
          mt-6 sm:mt-0
          overflow-x-visible overflow-y-visible
        `}
      >
        {/* Desktop: inline flex-wrap / Mobile: custom grouping */}
        <div className="sm:flex sm:flex-row sm:flex-wrap sm:gap-3 sm:space-y-0 space-y-3 relative z-40">
          {/* Wilaya + Type */}
          <div className="flex flex-row gap-2 w-full sm:w-auto">
            <MultiSelect
              label="Wilaya"
              options={wilayaOptions}
              value={filters.wilaya || []}
              onChange={(val) => setFilters({ ...filters, wilaya: val })}
            />
            <MultiSelect
              label="Type"
              options={typeOptions}
              value={filters.type || []}
              onChange={(val) => setFilters({ ...filters, type: val })}
            />
          </div>

          {/* Date + Prix */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <DateRangeFilter
              label="Date"
              value={filters.date || {}}
              onChange={(val) => setFilters({ ...filters, date: val })}
            />
            <RangeFilter
              label="Prix"
              unit="DA"
              min={0}
              max={100000}
              step={100}
              value={filters.price}
              onChange={(val) => setFilters({ ...filters, price: val })}
            />
          </div>

          {/* Distance + Dénivelé */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <RangeFilter
              label="Distance"
              unit="KM"
              min={0}
              max={500}
              step={1}
              value={filters.distance}
              onChange={(val) => setFilters({ ...filters, distance: val })}
            />
            <RangeFilter
              label="Dénivelé"
              unit="m"
              min={0}
              max={10000}
              step={10}
              value={filters.denivele}
              onChange={(val) => setFilters({ ...filters, denivele: val })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
