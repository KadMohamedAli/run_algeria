'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-gray-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="text-white font-extrabold text-2xl">
              Courses Algérie
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Accueil
              </Link>
              <Link
                href="/info"
                className="text-white hover:text-gray-300 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white focus:outline-none"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-700">
          <Link href="/" className="text-white font-bold text-xl">
            Courses Algérie
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-4 flex flex-col space-y-2 px-4">
          <Link
            href="/"
            className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Accueil
          </Link>
          <Link
            href="/info"
            className="text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>

      {/* Overlay for sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
