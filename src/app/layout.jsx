import Navbar from "../components/Navbar";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Courses à pied Algérie",
  description:
    "Recensement complet et à jour des courses à pied en Algérie, calendriers, résultats et informations pratiques.",
  keywords: [
    "courses à pied",
    "Algérie",
    "marathons",
    "semi-marathons",
    "trail",
    "course locale",
  ],
  authors: [{ name: "Mohamed Ali Kaddour" }],
  creator: "Mohamed Ali Kaddour",
  publisher: "Courses à pied Algérie",
  openGraph: {
    title: "Courses à pied Algérie",
    description: "Recensement complet et à jour des courses à pied en Algérie.",
    url: "https://coursesapied.dz",
    siteName: "Courses à pied Algérie",
    type: "website",
    images: [
      {
        url: "https://coursesapied.dz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Courses à pied Algérie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Courses à pied Algérie",
    description: "Recensement complet et à jour des courses à pied en Algérie.",
    site: "@YourTwitterHandle",
    creator: "@YourTwitterHandle",
    images: ["https://coursesapied.dz/og-image.jpg"],
  },
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

// ✅ viewport séparé
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className="bg-slate-800 text-slate-200 min-h-screen"
        style={{
          backgroundColor: "#1e293b", // softer dark
          color: "#e2e8f0", // not pure white
        }}
      >
        <SpeedInsights />
        <Navbar />
        <main className="container mx-auto">{children}</main>
      </body>
    </html>
  );
}
