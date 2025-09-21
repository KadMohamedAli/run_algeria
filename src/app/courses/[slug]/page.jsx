import coursesData from "../../../data/courses.json";
import CourseClient from "./CourseClient";

// ✅ Tell Next.js which slugs to pre-render
export function generateStaticParams() {
  return coursesData.map((course) => ({
    slug: course.slug,
  }));
}

export default function CoursePage({ params }) {
  const { slug } = params;
  const course = coursesData.find((c) => c.slug === slug);

  if (!course) {
    return <p className="text-center text-red-500 mt-10">Course non trouvée</p>;
  }

  return <CourseClient course={course} />;
}
