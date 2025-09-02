"use client";
import { useState } from "react";
import coursesData from "../data/courses.json";
import CourseCard from "../components/CourseCard";
import FilterBar from "../components/FilterBar";

export default function Home() {
  const [filters, setFilters] = useState({ wilaya: "", type: "" });

  // Filter courses
  const filtered = coursesData
    .filter((course) => {
      return (
        (!filters.wilaya ||
          course.wilaya.toLowerCase().includes(filters.wilaya.toLowerCase())) &&
        (!filters.type ||
          course.type.toLowerCase().includes(filters.type.toLowerCase()))
      );
    })
    .sort((a, b) => {
      const now = new Date();
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Upcoming events first
      const isPastA = dateA < now;
      const isPastB = dateB < now;

      if (isPastA && !isPastB) return 1; // a is past → push to end
      if (!isPastA && isPastB) return -1; // b is past → push to end

      // Both upcoming or both past → sort by date ascending
      return dateA - dateB;
    });

  return (
    <div className="p-4 md:p-8">
      {/* <FilterBar filters={filters} setFilters={setFilters} /> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
