import coursesData from "../../../data/courses.json";
import CourseClient from "./CourseClient";

// ⚡ Pré-générer les pages pour chaque slug
export function generateStaticParams() {
  return coursesData.map((course) => ({
    slug: course.slug,
  }));
}

// ⚡ Composant page
export default async function CoursePage({ params }) {
  // params est async → on attend
  const { slug } = await params;

  const course = coursesData.find((c) => c.slug === slug);

  if (!course) {
    return (
      <p className="text-center text-red-500 mt-10">
        Course non trouvée
      </p>
    );
  }

  return <CourseClient course={course} />;
}

