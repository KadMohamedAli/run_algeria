"use client";
import { formatDateRange, formatPrice } from "@/utils/formatters"; // helpers
import { motion, AnimatePresence } from "framer-motion";
import wilayas from "@/data/wilaya.json";
import types from "@/data/type.json";
import { defaultFilters } from "@/hooks/useFilters";

// Helpers internes
const getWilayaName = (wilaya) => {
  if (wilaya === null || wilaya === undefined) return "—";
  const code = String(wilaya).trim();
  if (/^\d+$/.test(code)) {
    const found = wilayas.find((w) => w.code === code || w.id === code);
    if (found) return found.name;
  }
  return wilaya;
};

const getTypeName = (typeId) => {
  const found = types.find((t) => String(t.code) === String(typeId));
  return found ? found.type : `Type ${typeId}`;
};

// Helper format distance / denivele
const formatNumber = (val) =>
  Number.isInteger(val) ? val.toString() : val.toFixed(1);

export default function ActiveFilters({ filters, setFilters }) {
  const tags = [];

  // Wilaya
  if (filters.wilaya.length > 0) {
    filters.wilaya.forEach((id) => {
      tags.push({
        key: `wilaya-${id}`,
        label: getWilayaName(id),
        onRemove: () =>
          setFilters((f) => ({
            ...f,
            wilaya: f.wilaya.filter((w) => w !== id),
          })),
      });
    });
  }

  // Type
  if (filters.type.length > 0) {
    filters.type.forEach((id) => {
      tags.push({
        key: `type-${id}`,
        label: getTypeName(id),
        onRemove: () =>
          setFilters((f) => ({ ...f, type: f.type.filter((t) => t !== id) })),
      });
    });
  }

  // Date
  if (filters.date.start || filters.date.end) {
    tags.push({
      key: "date",
      label: formatDateRange(filters.date.start, filters.date.end),
      onRemove: () =>
        setFilters((f) => ({ ...f, date: { start: null, end: null } })),
    });
  }

  // Prix
  if (filters.price[0] !== 0 || filters.price[1] !== 100000) {
    if (filters.price[0] === 0 && filters.price[1] === 0) {
      tags.push({
        key: "price",
        label: "Gratuit",
        onRemove: () => setFilters((f) => ({ ...f, price: [0, 100000] })),
      });
    } else if (filters.price[0] === filters.price[1]) {
      tags.push({
        key: "price",
        label: `${formatPrice(filters.price[0])} DA`,
        onRemove: () => setFilters((f) => ({ ...f, price: [0, 100000] })),
      });
    } else {
      tags.push({
        key: "price",
        label: `${formatPrice(filters.price[0])} – ${formatPrice(
          filters.price[1]
        )} DA`,
        onRemove: () => setFilters((f) => ({ ...f, price: [0, 100000] })),
      });
    }
  }

  // Distance
  if (filters.distance[0] > 0 || filters.distance[1] < 5000) {
    if (filters.distance[0] === filters.distance[1]) {
      tags.push({
        key: "distance",
        label: `${formatNumber(filters.distance[0])} KM`,
        onRemove: () => setFilters((f) => ({ ...f, distance: [0, 5000] })),
      });
    } else {
      tags.push({
        key: "distance",
        label: `${formatNumber(filters.distance[0])}–${formatNumber(
          filters.distance[1]
        )} KM`,
        onRemove: () => setFilters((f) => ({ ...f, distance: [0, 5000] })),
      });
    }
  }

  // Dénivelé
  if (filters.denivele[0] > 0 || filters.denivele[1] < 10000) {
    if (filters.denivele[0] === filters.denivele[1]) {
      tags.push({
        key: "denivele",
        label: `${filters.denivele[0]} m D+`,
        onRemove: () => setFilters((f) => ({ ...f, denivele: [0, 10000] })),
      });
    } else {
      tags.push({
        key: "denivele",
        label: `${filters.denivele[0]}–${filters.denivele[1]} m D+`,
        onRemove: () => setFilters((f) => ({ ...f, denivele: [0, 10000] })),
      });
    }
  }

  if (tags.length === 0) return null;

  return (
    <div className="relative mt-4 flex items-start gap-2 flex-wrap sm:flex-nowrap">
      {/* Zone scrollable pour les tags */}
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide cursor-w-resize pb-2 flex-1">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.span
              key={tag.key}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-orange-600 text-white font-medium rounded-full shadow-sm shrink-0 cursor-default"
            >
              {tag.label}
              <button
                onClick={tag.onRemove}
                className="ml-1 text-white/80 hover:text-white cursor-pointer"
              >
                ×
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Bouton Réinitialiser */}
      <button
        onClick={() => setFilters(defaultFilters)}
        className="px-4 py-2 text-sm font-semibold bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors flex items-center justify-center shrink-0 w-full sm:w-auto sm:mb-0 mb-2"
      >
        Réinitialiser
      </button>
    </div>
  );
}
