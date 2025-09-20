"use client";
import { useState, useEffect } from "react";
import coursesData from "../data/courses.json";
import CourseCard from "../components/CourseCard";
import FilterBar from "../components/FilterBar";
import ActiveFilters from "@/components/ui/ActiveFilters";

export default function Home() {
  const [filters, setFilters] = useState({
    wilaya: [], // array of ids (numbers or strings)
    type: [], // array of ids
    date: { start: null, end: null },
    price: [0, 100000], // [min, max]
    distance: [0, 5000],
    denivele: [0, 10000],
    orderBy: "date_asc", // default sort
    search: "", // free text search
  });

  // Debug filters in console each time they change
  useEffect(() => {
    console.log("🔎 Active filters:", filters);
  }, [filters]);

  // Filtering
  const filtered = coursesData
    .filter((course) => {
      // Wilaya
      if (filters.wilaya.length > 0) {
        if (!filters.wilaya.includes(String(course.wilaya))) return false;
      }

      if (filters.type.length > 0) {
        const hasType = course.type.some((t) =>
          filters.type.includes(Number(t))
        );
        if (!hasType) return false;
      }

      // Date
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

      // Price (normalize string → number)
      const coursePrice = parseFloat(course.prix_inscription) || 0;
      if (coursePrice < filters.price[0] || coursePrice > filters.price[1])
        return false;

      // Distance
      if (
        course.distance < filters.distance[0] ||
        course.distance > filters.distance[1]
      )
        return false;

      // Dénivelé
      if (
        course.denivele_plus < filters.denivele[0] ||
        course.denivele_plus > filters.denivele[1]
      )
        return false;

      // Search (nom, description, organisateur)
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

          // Keep future events first by default
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
