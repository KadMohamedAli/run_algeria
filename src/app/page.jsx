"use client";
import { Suspense } from "react";
import Home from "./Home";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Chargement...</div>}>
      <Home />
    </Suspense>
  );
}
