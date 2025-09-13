"use client";

import { useState } from "react";
import MultiSelect from "./ui/MultiSelect";
import RangeFilter from "./ui/RangeFilter";
import DateRangeFilter from "./ui/DateFilter";
import wilayas from "@/data/wilaya.json";
import runType from "@/data/type.json";

// ----- Main FilterBar -----
export default function FilterBar({ filters, setFilters }) {
  // Map wilayas JSON to { id, name } format
  const wilayaOptions = wilayas.map((w) => ({ id: w.id, name: w.name }));

  // Map runType JSON to { id, name } format
  const typeOptions = runType.map((t) => ({ id: t.code, name: t.type }));

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-6">
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
      <DateRangeFilter
        label="Date"
        value={filters.date || {}}
        onChange={(val) => setFilters({ ...filters, date: val })}
      />
      <RangeFilter
        label="Prix"
        unit="DA"
        min={0}
        max={5000}
        step={100}
        value={filters.price || [0, 5000]}
        onChange={(val) => setFilters({ ...filters, price: val })}
      />
      <RangeFilter
        label="Distance"
        unit="KM"
        min={0}
        max={50}
        step={1}
        value={filters.distance || [0, 50]}
        onChange={(val) => setFilters({ ...filters, distance: val })}
      />
      <RangeFilter
        label="Dénivelé"
        unit="M"
        min={0}
        max={2000}
        step={50}
        value={filters.denivele || [0, 2000]}
        onChange={(val) => setFilters({ ...filters, denivele: val })}
      />
    </div>
  );
}
