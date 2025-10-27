import coursesData from "../../../data/courses.json";
import CourseClient from "./CourseClient";

// ⚡ Pré-générer les pages pour chaque slug
export function generateStaticParams() {
  if (!coursesData || !Array.isArray(coursesData)) return [];
  return coursesData.map((course) => ({
    slug: course.slug,
  }));
}

// ⚡ Composant page
export default async function CoursePage({ params }) {
  // params peut être indéfini ou vide selon le mode de build
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Sécurité : si pas de slug, ou non trouvé
  if (!slug) {
    return (
      <p className="text-center text-red-500 mt-10">Course n'existe pas</p>
    );
  }

  const course = coursesData.find((c) => c.slug === slug);

  if (!course) {
    return (
      <p className="text-center text-red-500 mt-10">Course n'existe pas</p>
    );
  }

  return <CourseClient course={course} />;
}
