"use client";
import { motion, AnimatePresence } from "framer-motion";
import typesData from "@/data/type.json";

export default function CourseTags({ typeCodes }) {
  // Ensure array and map numeric IDs to type objects
  const typeObjects = Array.isArray(typeCodes)
    ? typeCodes
        .map((id) => typesData.find((t) => t.code === id))
        .filter(Boolean)
    : [];

  if (typeObjects.length === 0) return null;

  return (
    <div className="relative mt-4 flex items-start gap-2 flex-wrap">
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <AnimatePresence>
          {typeObjects.map((type) => (
            <motion.span
              key={type.code}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-3 py-1 text-sm font-medium rounded-full bg-orange-600/80 text-white shadow-sm cursor-default"
            >
              {type.type}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
