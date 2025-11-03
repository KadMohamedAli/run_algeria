"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// === Helper: format ordinals (1er → 1ᵉʳ, 5e → 5ᵉ, etc.)
const formatOrdinals = (text) => {
  if (!text) return "";
  return text
    .replace(/(\d+)\s?er(?![a-zA-Z])/g, "$1<sup>ᵉʳ</sup>") // 1er
    .replace(/(\d+)\s?e(?![a-zA-Z])/g, "$1<sup>ᵉ</sup>"); // 2e, 5e
};

export default function CourseTitle({ text, seed = 0 }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;

      if (textWidth > containerWidth) {
        setOffset(containerWidth - textWidth); // how far we need to slide left
      } else {
        setOffset(0); // no scroll needed
      }
    }
  }, [text]);

  // Random delay so not all cards scroll at once
  const randomDelay = (seed % 5) * 2;

  return (
    <div
      ref={containerRef}
      className="relative w-full text-start overflow-hidden"
    >
      <motion.h3
        ref={textRef}
        className="text-white text-2xl md:text-3xl font-black whitespace-nowrap"
        initial={{ x: 0 }}
        animate={
          offset === 0 ? { x: 0 } : { x: [0, offset, offset, 0] } // go → pause → back
        }
        transition={
          offset === 0
            ? { duration: 0 }
            : {
                duration: 12,
                times: [0, 0.4, 0.6, 1],
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 4,
                delay: randomDelay,
              }
        }
        dangerouslySetInnerHTML={{ __html: formatOrdinals(text) }}
      />
    </div>
  );
}
