import coursesData from "../../../data/courses.json";
import CourseClient from "./CourseClient";

export default async function CoursePage({ params }) {
  const { slug } = await params; // côté serveur, OK
  const course = coursesData.find((c) => c.slug === slug);

  if (!course) {
    return (
      <p className="text-center text-red-500 mt-10">Course non trouvée</p>
    );
  }

  return <CourseClient course={course} />;
}
