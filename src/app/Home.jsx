"use client";
import coursesData from "../data/courses.json";
import CourseCard from "../components/CourseCard";
import FilterBar from "../components/FilterBar";
import ActiveFilters from "@/components/ui/ActiveFilters";
import { useFilters } from "@/hooks/useFilters"; // adjust path

export default function HomeContent() {
  const [filters, setFilters] = useFilters();

  const filtered = coursesData
    .filter((course) => {
      if (
        filters.wilaya.length > 0 &&
        !filters.wilaya.includes(String(course.wilaya))
      )
        return false;

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
