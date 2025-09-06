"use client";

import React from "react";
import Image from "next/image";

// helper to convert hex to rgba
function hexToRgba(hex, alpha = 0.3) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function SolidBackground({
  color = "#2563eb", // hex color
  image = null, // URL or path to the image
  isPast = false,
  opacity = 0.8, // transparency for overlay
}) {
  const overlayColor = hexToRgba(color, opacity);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {image && (
        <Image
          src={image.startsWith("/") ? image : `/images/${image}`}
          alt="Background"
          fill
          style={{
            objectFit: "cover",
            filter: `blur(8px) brightness(0.7) ${
              isPast ? "saturate(0.3)" : ""
            }`, // less saturation if past
            transform: "scale(1.05)",
            transition: "filter 0.3s ease-in-out",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundColor: overlayColor,
          filter: isPast ? "saturate(0.4)" : "none", // also gray out overlay slightly
          transition: "filter 0.3s ease-in-out",
        }}
      />
    </div>
  );
}
