"use client";

import { useState } from "react";
import MultiSelect from "./ui/MultiSelect";
import RangeFilter from "./ui/RangeFilter";
import DateRangeFilter from "./ui/DateFilter";

// ----- Main FilterBar -----
export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
      <MultiSelect
        label="Wilaya"
        options={["Alger", "Blida", "Oran", "Annaba"]}
        value={filters.wilaya}
        onChange={(val) => setFilters({ ...filters, wilaya: val })}
      />
      <MultiSelect
        label="Type"
        options={["Trail", "Route", "Semi-marathon", "Marathon"]}
        value={filters.type}
        onChange={(val) => setFilters({ ...filters, type: val })}
      />
      <DateRangeFilter
        label="Date"
        value={filters.date || {}}
        onChange={(val) => setFilters({ ...filters, date: val })}
      />
      <RangeFilter
        label="Prix (DA)"
        min={0}
        max={5000}
        step={100}
        value={filters.price || [0, 5000]}
        onChange={(val) => setFilters({ ...filters, price: val })}
      />
      <RangeFilter
        label="Distance (km)"
        min={0}
        max={50}
        step={1}
        value={filters.distance || [0, 50]}
        onChange={(val) => setFilters({ ...filters, distance: val })}
      />
      <RangeFilter
        label="Dénivelé (m)"
        min={0}
        max={2000}
        step={50}
        value={filters.denivele || [0, 2000]}
        onChange={(val) => setFilters({ ...filters, denivele: val })}
      />
    </div>
  );
}
