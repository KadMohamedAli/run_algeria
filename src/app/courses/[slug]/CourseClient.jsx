"use client";

import { useState } from "react";
import Image from "next/image";

export default function CourseClient({ course }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Image cliquable */}
            <div
                className="relative w-full h-72 md:h-96 mb-6 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={course.image || 'image indisponible'}
                    alt={course.nom}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white px-4 py-2 rounded-lg">
                    <h1 className="text-2xl md:text-3xl font-bold">{course.name}</h1>
                    <p className="text-sm">{course.date}</p>
                </div>
            </div>

            {/* Modal plein écran */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-bold cursor-pointer
                        transition-transform duration-300 hover:scale-110 hover:text-red-400"
                        onClick={() => setIsOpen(false)}
                    >
                        ×
                    </button>
                    <div className="relative w-[90%] h-[90%]">
                        <Image
                            src={course.image}
                            alt={course.nom}
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Infos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <p><span className="font-semibold">📍 Wilaya:</span> {course.wilaya}</p>
                    <p><span className="font-semibold">📅 Date:</span> {course.date}</p>
                    <p><span className="font-semibold">🏃 Distance:</span> {course.distance}</p>
                    <p><span className="font-semibold">⛰️ D+:</span> {course.elevation_gain}</p>
                    <p><span className="font-semibold">⚡ Type:</span> {course.type}</p>
                </div>
                <div className="space-y-2">
                    <p><span className="font-semibold">👥 Tranche d'âge:</span> {course.age_range}</p>
                    <p><span className="font-semibold">💰 Prix:</span> {course.price}</p>
                    <p><span className="font-semibold">📋 Conditions:</span> {course.conditions}</p>
                    <p><span className="font-semibold">🏢 Organisateur:</span> {course.organizer}</p>
                    <p>
                        <span className="font-semibold">📧 Email:</span>{" "}
                        <a href={`mailto:${course.email}`} className="text-blue-500 hover:underline">{course.email}</a>
                    </p>
                    <p>
                        <span className="font-semibold">📞 Téléphone:</span>{" "}
                        <a href={`tel:${course.phone}`} className="text-blue-500 hover:underline">{course.phone}</a>
                    </p>
                    {course.website && (
                        <p>
                            <span className="font-semibold">🌐 Site:</span>{" "}
                            <a href={course.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {course.website}
                            </a>
                        </p>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-2">À propos de la course</h2>
                <p className="leading-relaxed text-gray-700">{course.description}</p>
            </div>
        </div>
    );
}
