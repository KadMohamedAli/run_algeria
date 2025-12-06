import "./globals.css";
import Navbar from "../components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

// ✅ Base URL from env
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://coursesalgerie.vercel.app";

export const metadata = {
  title: {
    default: "Courses Algérie – Run & Running en Algérie",
    template: "%s – Courses Algérie | Run & Running Algeria",
  },
  description:
    "Courses Algérie est la plateforme gratuite pour tous les passionnés de course à pied en Algérie. Découvrez le calendrier complet des marathons, semi-marathons, trails et événements running à travers le pays, ajoutez vos courses ou mettez-les à jour facilement.",
  keywords: [
    "courses à pied",
    "running",
    "Algérie",
    "marathon Algérie",
    "semi-marathon Algérie",
    "trail Algérie",
    "événements running",
    "course à pied Algérie",
    "calendrier running Algérie",
    "run Algeria",
    "running Algeria",
    "marathons Algeria",
    "races Algeria",
  ],
  authors: [{ name: "Kaddour Mohamed Ali" }, { name: "Amer El Khedoud Amir" }],
  creator: "Kaddour Mohamed Ali & Amer El Khedoud Amir",
  publisher: "Courses Algérie (projet communautaire)",
  category: "Sport / Communauté",

  // OpenGraph metadata
  openGraph: {
    title: "Courses Algérie – Run & Running en Algérie",
    description:
      "Découvrez le calendrier complet des courses à pied en Algérie : marathons, semi-marathons, trails et événements running à travers le pays.",
    url: baseUrl,
    siteName: "Courses Algérie",
    type: "website",
    locale: "fr_DZ",
    images: [
      {
        url: `${baseUrl}/ca_logo.jpg`,
        width: 1080,
        height: 1080,
        alt: "Courses Algérie – Courses à pied, Running & Marathons en Algérie",
      },
    ],
  },

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Courses Algérie – Run & Running en Algérie",
    description:
      "Courses Algérie : calendrier complet et gratuit des courses à pied, marathons et trails en Algérie. Partagez et découvrez vos événements running favoris.",
    images: [`${baseUrl}/ca_logo.jpg`],
    creator: "@CoursesAlgerie",
  },

  // Robots & Googlebot config
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/ca_logo_32.jpg",
    apple: "/ca_logo.jpg",
  },

  // Canonical + base
  metadataBase: new URL(baseUrl),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className="bg-slate-800 text-slate-200 min-h-screen"
        style={{
          backgroundColor: "#1e293b",
          color: "#e2e8f0",
        }}
      >
        <SpeedInsights />
        <Analytics />
        <Navbar />
        <main className="container mx-auto">{children}</main>
      </body>
    </html>
  );
}
