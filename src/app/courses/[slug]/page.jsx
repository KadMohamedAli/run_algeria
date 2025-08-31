import coursesData from '../../../data/courses.json'

export default function CoursePage({ params }) {
  const course = coursesData.find(c => c.slug === params.slug)
  if (!course) return <p>Course non trouvée</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{course.name}</h1>
      <img src={course.image} alt={course.name} className="w-full h-60 object-cover rounded mb-4"/>
      <div className="space-y-1">
        <p><strong>Wilaya:</strong> {course.wilaya}</p>
        <p><strong>Date:</strong> {course.date}</p>
        <p><strong>Distance:</strong> {course.distance}</p>
        <p><strong>Type:</strong> {course.type}</p>
        <p><strong>D+:</strong> {course.elevation_gain}</p>
        <p><strong>Conditions:</strong> {course.conditions}</p>
        <p><strong>Tranche d'âge:</strong> {course.age_range}</p>
        <p><strong>Prix:</strong> {course.price}</p>
        <p><strong>Organisateur:</strong> {course.organizer}</p>
        <p><strong>Email:</strong> <a href={`mailto:${course.email}`} className="text-blue-400">{course.email}</a></p>
        <p><strong>Téléphone:</strong> <a href={`tel:${course.phone}`} className="text-blue-400">{course.phone}</a></p>
        {course.website && <p><strong>Site:</strong> <a href={course.website} target="_blank" className="text-blue-400">{course.website}</a></p>}
      </div>
      <p className="mt-4">{course.description}</p>
    </div>
  )
}
