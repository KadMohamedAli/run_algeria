"use client";
import { useState, useEffect, useRef } from "react";
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

console.log(defaultFilters.date.start);

// --- Helpers ---
function encodeFilters(filters) {
  try {
    const diff = {};
    for (const key in filters) {
      if (JSON.stringify(filters[key]) !== JSON.stringify(defaultFilters[key])) {
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
  const initialized = useRef(false);

  // 1️⃣ Initialize from URL on first render
  const initialFilters = (() => {
    if (!initialized.current) {
      const f = searchParams.get("f");
      initialized.current = true;
      return f ? decodeFilters(f) : defaultFilters;
    }
    return defaultFilters;
  })();

  const [filters, setFilters] = useState(initialFilters);

  // 2️⃣ Watch for URL changes (e.g. paste URL, click back/forward, navigate home)
  useEffect(() => {
    const f = searchParams.get("f");
    const decoded = f ? decodeFilters(f) : defaultFilters;
    setFilters((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(decoded)) {
        return decoded;
      }
      return prev;
    });
  }, [searchParams]);

  // 3️⃣ Sync state → URL (only after initialization)
  useEffect(() => {
    if (!initialized.current) return; // avoid overwriting pasted URL before load
    const f = encodeFilters(filters);
    const current = searchParams.get("f") || "";
    if (f !== current) {
      const url = f ? `?f=${f}` : "";
      router.replace(url, { scroll: false });
    }
  }, [filters, router, searchParams]);

  return [filters, setFilters];
}
