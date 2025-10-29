import coursesData from "@/data/courses.json";
import coursesType from "@/data/type.json";
import wilayas from "@/data/wilaya.json";
import CourseClient from "./CourseClient";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://run-algeria.vercel.app";

// ✅ Pre-generate all slugs for static export
export function generateStaticParams() {
  if (!coursesData || !Array.isArray(coursesData)) return [];
  return coursesData.map((course) => ({ slug: course.slug }));
}

// ✅ Generate metadata dynamically per course
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = coursesData.find((c) => c.slug === slug);
  if (!course) return { title: "Course non trouvée" };

  // Resolve type names and wilaya name
  const typeNames = course.type
    ?.map((t) => coursesType.find((ty) => ty.code === t)?.type || "Course")
    .join(", ");
  const wilayaName =
    typeof course.wilaya === "number" || /^\d+$/.test(course.wilaya)
      ? wilayas.find((w) => w.id === String(course.wilaya))?.name || "Algérie"
      : course.wilaya;

  const title = `${course.nom} – ${wilayaName}`;
  const description =
    course.description?.slice(0, 200).replace(/\n/g, " ") ||
    `Découvrez les détails de ${course.nom} à ${wilayaName}.`;

  const imageUrl = course.image?.startsWith("http")
    ? course.image
    : `${baseUrl}${course.image || "/og-image.jpg"}`;
  const url = `${baseUrl}/courses/${course.slug}`;

  return {
    title,
    description,
    keywords: [
      "course",
      "Algérie",
      course.nom,
      wilayaName,
      typeNames,
      "marathon",
      "trail",
      "running",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "Courses Algérie",
      type: "website",
      locale: "fr_DZ",
      images: [
        {
          url: imageUrl,
          alt: `${course.nom} – ${wilayaName}`,
        },
      ],
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

// ✅ Page component
export default async function CoursePage({ params }) {
  const { slug } = await params;
  const course = coursesData.find((c) => c.slug === slug);

  if (!course) {
    return (
      <p className="text-center text-red-500 mt-10">
        Course inexistante ou introuvable.
      </p>
    );
  }

  // Map type / wilaya
  const typeNames = course.type
    ?.map((t) => coursesType.find((ty) => ty.code === t)?.type || "Course")
    .join(", ");
  const wilayaName =
    typeof course.wilaya === "number" || /^\d+$/.test(course.wilaya)
      ? wilayas.find((w) => w.id === String(course.wilaya))?.name || "Algérie"
      : course.wilaya;

  // ✅ JSON-LD structured data for SEO (schema.org/Event)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: course.nom,
    description: course.description,
    startDate: course.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: wilayaName,
      address: {
        "@type": "PostalAddress",
        addressCountry: "DZ",
        addressRegion: wilayaName,
      },
    },
    organizer: {
      "@type": "Organization",
      name: course.organisateur_nom || "Organisateur non spécifié",
      email: course.contact_email || undefined,
      telephone: course.contact_numero || undefined,
      url: course.site_web || undefined,
    },
    image: course.image
      ? `${baseUrl}${course.image}`
      : `${baseUrl}/og-image.jpg`,
    offers: {
      "@type": "Offer",
      price: course.prix_inscription || "Gratuit",
      priceCurrency: "DZD",
      url: course.inscription_link || baseUrl,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main>
      {/* ✅ Inject JSON-LD for Google / Bing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <CourseClient course={course} />
    </main>
  );
}
