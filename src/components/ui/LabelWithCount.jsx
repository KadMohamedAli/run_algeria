"use client";

export default function LabelWithCount({ label, count = 0 }) {
  return (
    <span
      className={`truncate ${
        count > 0 ? "font-semibold text-white" : "font-normal text-white"
      }`}
    >
      {label}
      {count > 0 && <span className="ml-1 text-orange-600">({count})</span>}
    </span>
  );
}
