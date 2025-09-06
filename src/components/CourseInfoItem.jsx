import React from "react";

export default function CourseInfoItem({ value, suffix, className = "" }) {
  if (!value) return null;

  return (
    <span className={`flex items-center text-md gap-1 ${className}`}>
      <span className="">{value}</span>
      {typeof suffix === "string" ? (
        <span className="font-black text-white">{suffix}</span>
      ) : (
        suffix // can be an icon component
      )}
    </span>
  );
}
