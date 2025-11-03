"use client";

import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export default function DescriptionComponent({ text }) {
  // Configure the markdown parser for better formatting
  marked.setOptions({
    breaks: true, // allow single line breaks
    gfm: true, // GitHub-flavored markdown (tables, lists, etc.)
  });

  // Convert Markdown → sanitized HTML
  const rawHtml = marked.parse(text || "");
  const cleanHtml = DOMPurify.sanitize(rawHtml);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-3 text-white">À propos</h2>
      <div
        className="prose prose-invert max-w-none text-gray-200 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </section>
  );
}
