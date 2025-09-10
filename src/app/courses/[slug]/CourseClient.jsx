"use client";

import { useState } from "react";
import Image from "next/image";

export default function CourseClient({ course }) {
    const [isOpen, setIsOpen] = useState(false);

    // Helper générique pour valeurs manquantes
    const getValue = (val) => {
        if (!val || (Array.isArray(val) && val.length === 0)) {
            return "❌ Non communiqué";
        }
        return val;
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Image bannière cliquable */}
            <div
                className="relative w-full h-72 md:h-96 mb-6 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <Image
                    src={getValue(course.image)}
                    alt={getValue(course.nom || course.name)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white px-4 py-2 rounded-lg">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        {getValue(course.nom || course.name)}
                    </h1>
                    <p className="text-sm">{getValue(course.date)}</p>
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
                            src={getValue(course.image)}
                            alt={getValue(course.nom || course.name)}
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Infos principales */}
            <h2 className="text-xl font-bold mb-4">📍 Informations principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <p>🏙️ <span className="font-semibold">Wilaya:</span> {getValue(course.wilaya)}</p>
                    <p>📌 <span className="font-semibold">Commune:</span> {getValue(course.commune)}</p>
                    <p>🌍 <span className="font-semibold">Pays:</span> {getValue(course.pays)}</p>
                    <p>📅 <span className="font-semibold">Date:</span> {getValue(course.date)}</p>
                    <p>🏃 <span className="font-semibold">Distance:</span> {getValue(course.distance)} km</p>
                    <p>⛰️ <span className="font-semibold">D+:</span> {getValue(course.denivele_plus)} m</p>
                    <p>🏞️ <span className="font-semibold">Type:</span> {getValue(course.type)}</p>
                </div>
                <div className="space-y-2">
                    <p>👥 <span className="font-semibold">Tranche d'âge:</span> {getValue(course.age_range)}</p>
                    <p>💰 <span className="font-semibold">Prix d'inscription:</span> {getValue(course.prix_inscription)} DA</p>
                    <p className="font-semibold">📜 Conditions:</p>
                    <ul className="space-y-1 pl-5 text-gray-700">
                        {Array.isArray(course.conditions) && course.conditions.length > 0 ? (
                            course.conditions.map((c, i) => (
                                <li key={i} className="before:content-['✅'] before:mr-2">
                                    {c}
                                </li>
                            ))
                        ) : (
                            <li className="before:content-['❌'] before:mr-2">{getValue(course.conditions)}</li>
                        )}
                    </ul>
                    <p>🏢 <span className="font-semibold">Organisateur:</span> {getValue(course.organisateur_nom)}</p>
                </div>
            </div>

            {/* Description */}
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-2">ℹ️ À propos de la course</h2>
                <p className="leading-relaxed text-gray-700">{getValue(course.description)}</p>
            </div>

            {/* Contacts (séparés) */}
            <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: "#9fafedff" }}>
                {/* m3lblich 3lach la couleur mahabtch tmchi b tilwind forcitha b css, ou les couleurs apres ystgmo */}
                <h2 className="text-xl font-bold mb-4">📞 Contacts</h2>
                <div className="space-y-3">
                    <p>
                        📧 <span className="font-semibold">Email:</span>{" "}
                        {course.contact_email ? (
                            <a href={`mailto:${course.contact_email}`} className="text-blue-600 hover:underline">
                                {course.contact_email}
                            </a>
                        ) : (
                            "❌ Non communiqué"
                        )}
                    </p>
                    <p>
                        📞 <span className="font-semibold">Téléphone:</span>{" "}
                        {course.contact_numero ? (
                            <a href={`tel:${course.contact_numero}`} className="text-blue-600 hover:underline">
                                {course.contact_numero}
                            </a>
                        ) : (
                            "❌ Non communiqué"
                        )}
                    </p>
                    <p>
                        🌐 <span className="font-semibold">Site:</span>{" "}
                        {course.site_web ? (
                            <a href={course.site_web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {course.site_web}
                            </a>
                        ) : (
                            "❌ Non communiqué"
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
