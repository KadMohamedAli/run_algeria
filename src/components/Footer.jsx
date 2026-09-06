import Link from "next/link";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="mt-12 w-full bg-gray-900 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-white font-extrabold text-xl">
            Courses Algérie
          </Link>

          <SocialLinks iconClassName="h-6 w-6" />

          <nav className="flex space-x-6 text-sm">
            <Link
              href="/"
              className="text-gray-300 hover:text-gray-100 transition-colors duration-200"
            >
              Accueil
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-gray-100 transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Courses Algérie – Run &amp; Running en
          Algérie. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}