// ✅ Define SEO metadata using the new Next.js App Router system
import SocialLinks from "@/components/SocialLinks";

export const metadata = {
  title: "À propos et contact",
  description:
    "Courses Algérie est une plateforme gratuite et non lucrative dédiée aux coureurs et organisateurs de courses en Algérie. Découvrez, ajoutez ou mettez à jour vos événements facilement.",
  keywords: [
    "courses à pied",
    "Algérie",
    "course",
    "trail",
    "marathon",
    "semi-marathon",
    "organisateur",
    "contact",
    "ajouter une course",
    "calendrier running Algérie",
  ],
  openGraph: {
    title: "À propos et contact – Courses Algérie",
    description:
      "Plateforme gratuite pour les coureurs et organisateurs de courses en Algérie. Ajoutez ou mettez à jour vos événements facilement.",
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://coursesalgerie.vercel.app"
    }/contact`,
    siteName: "Courses Algérie",
    type: "website",
    locale: "fr_DZ",
    images: [
      {
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL ||
          "https://coursesalgerie.vercel.app"
        }/ca_logo.jpg`,
        width: 1080,
        height: 1080,
        alt: "Courses Algérie – À propos et contact",
      },
    ],
  },
  alternates: {
    canonical: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://coursesalgerie.vercel.app"
    }/contact`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ✅ Structured Data (JSON-LD)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "À propos et contact – Courses Algérie",
  description:
    "Plateforme gratuite pour les coureurs et organisateurs de courses en Algérie. Ajoutez ou mettez à jour vos événements facilement.",
  url: `${
    process.env.NEXT_PUBLIC_SITE_URL || "https://coursesalgerie.vercel.app"
  }/contact`,
  contactPoint: {
    "@type": "ContactPoint",
    email: "coursesalgerie@gmail.com",
    contactType: "support",
    areaServed: "DZ",
    availableLanguage: ["fr"],
  },
  creator: [
    {
      "@type": "Person",
      name: "KADDOUR Mohamed Ali",
    },
    {
      "@type": "Person",
      name: "AMER EL KHEDOUD AMIR",
    },
  ],
};

export default function InfoPage() {
  return (
    <main className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-6 md:py-10 space-y-8">
      {/* ✅ JSON-LD injected safely for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center sm:text-left">
          À propos de Courses Algérie
        </h1>
      </header>

      <article className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
        {/* Image */}
        <div className="w-full sm:w-[400px] shrink-0 flex justify-center pe-2 md:p-0">
          <img
            src="/ca_logo_fit.png"
            alt="Courses Algérie Logo"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="space-y-6">
          <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
            <strong>Courses Algérie</strong> est un projet personnel et{" "}
            <strong>non lucratif</strong> créé par des passionnés de course à
            pied. Notre objectif est d’offrir aux coureurs algériens une
            plateforme claire et gratuite pour découvrir toutes les{" "}
            <strong>courses organisées en Algérie</strong> — marathons, trails,
            semi-marathons et plus encore.
          </p>

          <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
            Nous essayons de publier le{" "}
            <strong>maximum de courses disponibles</strong> afin d’offrir une
            vue complète du calendrier running en Algérie. Nous faisons de notre
            mieux pour garantir la{" "}
            <strong>fiabilité et l’exactitude des informations</strong>. Si vous
            constatez <strong>une erreur</strong>, si une information doit être
            mise à jour ou si vous souhaitez que nous{" "}
            <strong>retirions un contenu</strong>, vous pouvez simplement nous
            contacter et nous corrigerons la page rapidement.
          </p>
        </div>
      </article>

      <section className="space-y-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Pour les organisateurs
        </h2>

        <p className="text-gray-200 text-base sm:text-lg leading-relaxed">
          Vous organisez une course&nbsp;? Ajoutez ou modifiez votre événement
          gratuitement sur notre site. Envoyez-nous simplement un email avec les
          informations nécessaires pour présenter votre course correctement.
        </p>

        <p className="text-gray-200 text-base sm:text-lg">
          Contactez-nous à{" "}
          <a
            href="mailto:coursesalgerie@gmail.com"
            className="text-orange-400 hover:text-orange-300 underline break-all"
          >
            coursesalgerie@gmail.com
          </a>{" "}
          en précisant les informations suivantes :
        </p>

        <ul className="list-disc ml-5 sm:ml-6 space-y-1 text-gray-200 text-base">
          <li>Nom de la course</li>
          <li>Date et lieu (wilaya)</li>
          <li>Distance et type de course (route, trail, chrono, etc.)</li>
          <li>Conditions de participation</li>
          <li>Tranche d’âge des participants</li>
          <li>Prix éventuels ou récompenses</li>
          <li>Nom de l’organisateur, email, téléphone, site web</li>
          <li>Logo ou affiche (facultatif)</li>
          <li>Preuve d’identité de l’organisateur (facultatif)</li>
        </ul>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Chaque demande est vérifiée manuellement avant publication. Vous
          pouvez aussi nous écrire pour <strong>corriger</strong> ou{" "}
          <strong>retirer</strong> une course existante.
        </p>

        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          En cas de question, contactez-nous à{" "}
          <a
            href="mailto:coursesalgerie@gmail.com"
            className="text-orange-400 hover:text-orange-300 underline break-all"
          >
            coursesalgerie@gmail.com
          </a>
          .
        </p>
      </section>

      <footer>
        <div className="flex flex-col items-center gap-4 pt-4">
          <p className="text-gray-400 italic text-center text-sm sm:text-base">
            Suivez-nous sur nos réseaux :
          </p>
          <SocialLinks iconClassName="h-7 w-7" />
          <p className="text-gray-400 italic text-center text-sm sm:text-base pt-2">
            Merci à tous les coureurs, clubs et bénévoles qui font vivre la
            course à pied en Algérie 🏃‍♂️🇩🇿
          </p>
        </div>
      </footer>
    </main>
  );
}
