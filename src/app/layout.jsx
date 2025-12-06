import "./globals.css";
import Navbar from "../components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

// ✅ Base URL from env
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://coursesalgerie.vercel.app";

export const metadata = {
  title: {
    default: "Courses Algérie",
    template: "%s – Courses Algérie",
  },
  description:
    "Courses Algérie est une plateforme gratuite créée par des passionnés pour les coureurs et organisateurs de courses à pied en Algérie. Découvrez, ajoutez ou mettez à jour vos événements facilement.",
  keywords: [
    "courses à pied",
    "Algérie",
    "marathon",
    "semi-marathon",
    "trail",
    "running",
    "événements sportifs",
    "calendrier running",
  ],
  authors: [{ name: "Kaddour Mohamed Ali" }, { name: "Amer El Khedoud Amir" }],
  creator: "Kaddour Mohamed Ali & Amer El Khedoud Amir",
  publisher: "Courses Algérie (projet communautaire)",
  category: "Sport / Communauté",

  // ✅ OpenGraph metadata
  openGraph: {
    title: "Courses Algérie",
    description:
      "Découvrez le calendrier complet des courses à pied en Algérie : marathons, semi-marathons, trails et plus encore.",
    url: baseUrl,
    siteName: "Courses Algérie",
    type: "website",
    locale: "fr_DZ",
    images: [
      {
        url: `${baseUrl}/ca_logo.jpg`,
        width: 1080,
        height: 1080,
        alt: "Courses Algérie – Courses à pied en Algérie",
      },
    ],
  },

  // ✅ Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Courses Algérie",
    description:
      "Courses Algérie — plateforme gratuite pour découvrir et partager les courses à pied en Algérie.",
    images: [`${baseUrl}/ca_logo.jpg`],
    creator: "@CoursesAlgerie", // optional if you ever create an account
  },

  // ✅ Robots & Googlebot config
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

  // ✅ Icons
  icons: {
    icon: "/favicon.ico",
    shortcut: "/ca_logo_32.jpg",
    apple: "/ca_logo.jpg",
  },

  // ✅ Canonical + base
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
