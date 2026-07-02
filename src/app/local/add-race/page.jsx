import coursesData from "@/data/loadCourses";
import wilayas from "@/data/wilaya.json";
import raceTypes from "@/data/type.json";
import RaceBuilderClient from "./RaceBuilderClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Ajouter une course",
  description:
    "Outil local pour ajouter une course et son image dans le projet.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AddRacePage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const nextId =
    coursesData.reduce(
      (maxId, course) => Math.max(maxId, Number(course.id) || 0),
      0
    ) + 1;

  const existingSlugs = coursesData
    .map((course) => course.slug)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return (
    <RaceBuilderClient
      nextId={nextId}
      existingSlugs={existingSlugs}
      wilayas={wilayas}
      raceTypes={raceTypes}
    />
  );
}
