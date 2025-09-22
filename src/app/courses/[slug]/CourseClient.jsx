"use client";

import { useState } from "react";
import Image from "next/image";

export default function CourseClient({ course }) {
    const [isOpen, setIsOpen] = useState(false);

    const getValue = (val) => {
        if (!val || (Array.isArray(val) && val.length === 0)) {
            return "❌ Non communiqué";
        }
        return val;
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Header avec infos clés */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{getValue(course.nom || course.name)}</h1>
                <p className="text-gray-800 text-lg text-white">{getValue(course.date)} • {getValue(course.wilaya)}, {getValue(course.commune)}</p>
                <p className="text-gray-800 text-lg text-white">Distance: {getValue(course.distance)} km • D+: {getValue(course.denivele_plus)} m</p>
            </div>


            {/* Image du parcours */}
            <div
                className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-transform duration-500 hover:scale-105"
                onClick={() => setIsOpen(true)}
            >
                {course.image ? (
                    <Image
                        src={course.image}
                        alt={getValue(course.nom || course.name)}
                        fill
                        className="object-cover w-full h-full"
                        priority
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                        Image non disponible
                    </div>
                )}
            </div>

            {/* Modal pour agrandir l'image */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 md:p-0"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 bg-black/70 rounded-full w-10 h-10 flex items-center justify-center text-white text-2xl font-bold cursor-pointer hover:bg-red-500 transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    >
                        ×
                    </button>
                    <div className="relative w-full md:w-[80%] h-[60%] md:h-[80%] rounded-xl overflow-hidden">
                        {course.image ? (
                            <Image
                                src={course.image}
                                alt={getValue(course.nom || course.name)}
                                fill
                                className="object-contain"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                                Image non disponible
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Infos principales */}
            <div className="bg-blue-50 p-6 rounded-xl shadow-md space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
                    Informations principales
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">

                    {/* Colonne 1 */}
                    <div className="space-y-2 pr-6 border-r border-gray-300">
                        {[
                            { label: "Wilaya:", value: getValue(course.wilaya) },
                            { label: "Commune:", value: getValue(course.commune) },
                            { label: "Pays:", value: getValue(course.pays) },
                            { label: "Date:", value: getValue(course.date) },
                            { label: "Distance:", value: `${getValue(course.distance)} km` },
                            { label: "D+:", value: `${getValue(course.denivele_plus)} m` },
                            { label: "Type:", value: getValue(course.type) },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center">
                                <span className="inline-block font-semibold bg-blue-100/50 px-2 rounded-md mr-2">
                                    {item.label}
                                </span>
                                <span>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Colonne 2 */}
                    <div className="space-y-2 pl-6">
                        {[
                            { label: "Tranche d'âge:", value: getValue(course.age_range) },
                            { label: "Prix d'inscription:", value: `${getValue(course.prix_inscription)} DA` },
                            { label: "Conditions:", value: course.conditions },
                            { label: "Organisateur:", value: getValue(course.organisateur_nom) },
                        ].map((item, i) => (
                            item.label === "Conditions:" ? (
                                <div key={i} className="flex items-start">
                                    <span className="inline-block font-semibold bg-blue-100/50 px-2 rounded-md mr-2">
                                        {item.label}
                                    </span>
                                    <ul className="space-y-2 pl-0">
                                        {Array.isArray(item.value) && item.value.length > 0
                                            ? item.value.map((c, idx) => (
                                                <li key={idx} className="before:content-['-'] before:mr-2">{c}</li>
                                            ))
                                            : <li className="before:content-['❌'] before:mr-2">{getValue(item.value)}</li>
                                        }
                                    </ul>
                                </div>
                            ) : (
                                <div key={i} className="flex items-center">
                                    <span className="inline-block font-semibold bg-blue-100/50 px-2 rounded-md mr-2">
                                        {item.label}
                                    </span>
                                    <span>{item.value}</span>
                                </div>
                            )
                        ))}
                    </div>

                </div>
            </div>


            {/* Description */}
            <div className="bg-blue-50 p-6 rounded-xl shadow-md text-gray-900">
                <h2 className="text-2xl font-bold text-blue-800 mb-2"> À propos de la course</h2>
                <p className="leading-relaxed">{getValue(course.description)}</p>
            </div>

            {/* Contacts */}
            <div className="bg-blue-50 p-6 rounded-xl shadow-md space-y-3 text-gray-900">
                <h2 className="text-2xl font-bold text-blue-800"> Contacts</h2>
                <p><span className="font-semibold">Email:</span>{" "} {course.contact_email ? <a href={`mailto:${course.contact_email}`} className="text-blue-600 hover:underline">{course.contact_email}</a> : "❌ Non communiqué"}</p>
                <p><span className="font-semibold">Téléphone:</span>{" "} {course.contact_numero ? <a href={`tel:${course.contact_numero}`} className="text-blue-600 hover:underline">{course.contact_numero}</a> : "❌ Non communiqué"}</p>
                <p><span className="font-semibold">Site:</span>{" "} {course.site_web ? <a href={course.site_web} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{course.site_web}</a> : "❌ Non communiqué"}</p>
            </div>
        </div>
    );
}
