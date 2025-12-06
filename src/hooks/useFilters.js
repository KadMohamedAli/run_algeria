"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LZString from "lz-string";

const today = new Date();
const yyyyMMdd = today.toISOString().slice(0, 10);

export const defaultFilters = {
  wilaya: [],
  type: [],
  date: { start: `${yyyyMMdd}T00:01:00`, end: null },
  price: [0, 100000],
  distance: [0, 5000],
  denivele: [0, 10000],
  orderBy: "date_asc",
  search: "",
};

// --- Helpers ---
function encodeFilters(filters) {
  try {
    const diff = {};
    for (const key in filters) {
      if (
        JSON.stringify(filters[key]) !== JSON.stringify(defaultFilters[key])
      ) {
        diff[key] = filters[key];
      }
    }
    return LZString.compressToEncodedURIComponent(JSON.stringify(diff));
  } catch {
    return "";
  }
}

function decodeFilters(str) {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(str);
    const parsed = JSON.parse(decompressed);
    return { ...defaultFilters, ...parsed };
  } catch {
    return { ...defaultFilters };
  }
}

// --- Main Hook ---
export function useFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize decoded filters from URL to avoid new object on each render
  const decodedFilters = useMemo(() => {
    const f = searchParams.get("f");
    return f ? decodeFilters(f) : defaultFilters;
  }, [searchParams]);

  // State initialization
  const [filters, setFilters] = useState(decodedFilters);

  // 1️⃣ Watch URL → update filters only if different
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(decodedFilters)) {
      setFilters(decodedFilters);
    }
  }, [decodedFilters]);

  // 2️⃣ Sync filters → URL
  const encodedFilters = useMemo(() => encodeFilters(filters), [filters]);

  useEffect(() => {
    const current = searchParams.get("f") || "";
    if (encodedFilters !== current) {
      router.replace(encodedFilters ? `?f=${encodedFilters}` : "", {
        scroll: false,
      });
    }
  }, [encodedFilters, router]);

  return [filters, setFilters];
}
