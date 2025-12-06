"use client";
import coursesData from "@/data/loadCourses"; // ✅ now uses correct dataset
import CourseCard from "../components/CourseCard";
import FilterBar from "../components/FilterBar";
import ActiveFilters from "@/components/ui/ActiveFilters";
import { useFilters } from "@/hooks/useFilters"; // adjust path
import { filterCourses, sortCourses } from "@/utils/CourseUtils";

export default function HomeContent() {
  const [filters, setFilters] = useFilters();

  const filtered = sortCourses(
    filterCourses(coursesData, filters),
    filters.orderBy
  );

  return (
    <div className="p-4 md:p-8">
      <FilterBar filters={filters} setFilters={setFilters} />
      <ActiveFilters filters={filters} setFilters={setFilters} />

      {/* Result Counter */}
      <div className="mt-6 mb-4">
        <p className="text-2xl md:text-3xl font-bold">
          <span className="bg-linear-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">
            {filtered.length} {filtered.length === 1 ? "course" : "courses"}{" "}
            trouvée{filtered.length !== 1 ? "s" : ""}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
