"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LZString from "lz-string";

import coursesData from "../data/courses.json";
import CourseCard from "../components/CourseCard";
import FilterBar from "../components/FilterBar";
import ActiveFilters from "@/components/ui/ActiveFilters";

// 🔹 Define defaults once
const defaultFilters = {
  wilaya: [],
  type: [],
  date: { start: null, end: null },
  price: [0, 100000],
  distance: [0, 5000],
  denivele: [0, 10000],
  orderBy: "date_asc",
  search: "",
};

// 🔹 Save only differences
function encodeFilters(filters) {
  try {
    const diff = {};
    for (const key in filters) {
      if (
        JSON.stringify(filters[key]) !== JSON.stringify(defaultFilters[key])
      ) {
        diff[key] = filters[key];
      }
    }
    return LZString.compressToEncodedURIComponent(JSON.stringify(diff));
  } catch {
    return "";
  }
}

// 🔹 Restore with defaults
function decodeFilters(str) {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(str);
    const parsed = JSON.parse(decompressed);
    return { ...defaultFilters, ...parsed };
  } catch {
    return { ...defaultFilters };
  }
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(defaultFilters);

  // 1. Read filters from URL if present
  useEffect(() => {
    const f = searchParams.get("f");
    if (f) {
      const decoded = decodeFilters(f);
      setFilters(decoded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Update URL when filters change
  useEffect(() => {
    const f = encodeFilters(filters);
    const url = f ? `?f=${f}` : "";
    router.replace(url, { scroll: false });
  }, [filters, router]);

  // Debug
  useEffect(() => {
    console.log("🔎 Active filters:", filters);
  }, [filters]);

  // Filtering logic stays unchanged…
  const filtered = coursesData
    .filter((course) => {
      if (filters.wilaya.length > 0) {
        if (!filters.wilaya.includes(String(course.wilaya))) return false;
      }
      if (filters.type.length > 0) {
        const hasType = course.type.some((t) =>
          filters.type.includes(Number(t))
        );
        if (!hasType) return false;
      }
      if (
        filters.date.start &&
        new Date(course.date) < new Date(filters.date.start)
      )
        return false;
      if (
        filters.date.end &&
        new Date(course.date) > new Date(filters.date.end)
      )
        return false;

      const coursePrice = parseFloat(course.prix_inscription) || 0;
      if (coursePrice < filters.price[0] || coursePrice > filters.price[1])
        return false;

      if (
        course.distance < filters.distance[0] ||
        course.distance > filters.distance[1]
      )
        return false;

      if (
        course.denivele_plus < filters.denivele[0] ||
        course.denivele_plus > filters.denivele[1]
      )
        return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const haystack = [
          course.nom,
          course.description,
          course.organisateur_nom,
          course.commune,
          course.pays,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const [key, dir] = filters.orderBy.split("_");
      const multiplier = dir === "desc" ? -1 : 1;
      switch (key) {
        case "price": {
          const aPrice = parseFloat(a.prix_inscription) || 0;
          const bPrice = parseFloat(b.prix_inscription) || 0;
          return (aPrice - bPrice) * multiplier;
        }
        case "distance":
          return (a.distance - b.distance) * multiplier;
        case "denivele":
          return (a.denivele_plus - b.denivele_plus) * multiplier;
        case "date":
        default: {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (key === "date" && dir === "asc") {
            const now = new Date();
            const isPastA = dateA < now;
            const isPastB = dateB < now;
            if (isPastA && !isPastB) return 1;
            if (!isPastA && isPastB) return -1;
          }
          return (dateA - dateB) * multiplier;
        }
      }
    });

  return (
    <div className="p-4 md:p-8">
      <FilterBar filters={filters} setFilters={setFilters} />
      <ActiveFilters filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-2">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
