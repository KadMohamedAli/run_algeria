import coursesData from "@/data/loadCourses";
import coursesType from "@/data/type.json";
import wilayas from "@/data/wilaya.json";
import CourseClient from "./CourseClient";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://coursesalgerie.vercel.app";

export function generateStaticParams() {
  if (!coursesData || !Array.isArray(coursesData) || coursesData.length === 0) {
    console.warn("⚠️ No course data found — generating a placeholder page.");
    return [{ slug: "placeholder" }];
  }
  return coursesData.map((course) => ({ slug: course.slug }));
}

// ✅ Generate metadata dynamically per course
export function generateMetadata({ params }) {
  const { slug } = params;
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
    course.description?.replace(/\n/g, " ").slice(0, 155).trim() ||
    `Participez à ${course.nom} à ${wilayaName}.`;

  const imageUrl = course.image?.startsWith("http")
    ? course.image
    : `${baseUrl}${course.image || "/og-image.jpg"}`;
  const url = `${baseUrl}/courses/${course.slug}`;

  return {
    title: {
      default: `${course.nom} – ${wilayaName}`,
      template: "%s | Courses Algérie",
    },
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

// ✅ Page component
export default function CoursePage({ params }) {
  const { slug } = params;
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
    description: course.description?.replace(/\n/g, " ").trim(),
    url: `${baseUrl}/courses/${course.slug}`,
    category: typeNames,
    startDate: course.date,
    endDate: course.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    sport: "Running",
    location: {
      "@type": "Place",
      name: course.commune || wilayaName,
      address: {
        "@type": "PostalAddress",
        addressLocality: course.commune,
        addressRegion: wilayaName,
        addressCountry: "DZ",
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
    offers: parsedPrice
      ? {
          "@type": "Offer",
          price: parsedPrice,
          priceCurrency: "DZD",
          url: course.inscription_link || baseUrl,
          availability: "https://schema.org/InStock",
        }
      : undefined,
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
