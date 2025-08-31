import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, ClockIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

export default function CourseCard({ course }) {
  // Format the date intelligently
  const formatCourseDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const isTomorrow =
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear();

    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    if (isToday) {
      return `Aujourd'hui ${new Intl.DateTimeFormat('fr-FR', timeOptions).format(date)}`;
    } else if (isTomorrow) {
      return `Demain ${new Intl.DateTimeFormat('fr-FR', timeOptions).format(date)}`;
    } else {
      const options = { day: 'numeric', month: 'short', ...timeOptions };
      if (date.getFullYear() !== now.getFullYear()) {
        options.year = 'numeric';
      }
      return new Intl.DateTimeFormat('fr-FR', options).format(date);
    }
  };

  const isPast = new Date(course.date) < new Date();

  return (
    <Link href={`/courses/${course.slug}`} className="group block w-full relative">
      <div
        className={`relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-36 md:h-42
          ${isPast ? '' : ''}`}
      >
        {/* Background Image */}
        {course.image && (
          <Image
            src={course.image.startsWith('/') ? course.image : `/images/${course.image}`}
            alt={course.name}
            fill
            className="object-cover brightness-65 blur-xs"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-900/60"></div>

        {/* Fini badge */}
        {isPast && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            FINI
          </div>
        )}

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-around items-center text-center py-2 px-4">
          {/* Title */}
          <h3 className="text-white text-2xl md:text-3xl font-black truncate">{course.name}</h3>

          {/* Distance & Wilaya */}
          <div className="w-full flex justify-between mt-0 text-gray-200 text-lg items-center">
            <span className="flex items-center gap-1">
              <ArrowsRightLeftIcon className="h-5 w-5 text-white" />
              {course.distance}
            </span>
            <span className="flex items-center gap-1">
              {course.wilaya}
              <MapPinIcon className="h-5 w-5 text-white" />
            </span>
          </div>

          {/* Date */}
          <p className="flex items-center gap-1 text-white text-xl">
            <ClockIcon className="h-5 w-5 text-white" />
            {formatCourseDate(course.date)}
          </p>
        </div>
      </div>
    </Link>
  );
}
