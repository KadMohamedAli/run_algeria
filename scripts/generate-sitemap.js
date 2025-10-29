const fs = require("fs");
const path = require("path");
const courses = require("../src/data/courses.json");

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://run-algeria.vercel.app";

const staticPages = ["", "/contact"];
const pages = [
  ...staticPages.map((p) => `${baseUrl}${p}`),
  ...courses.map((c) => `${baseUrl}/courses/${c.slug}`),
];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.includes("/courses/") ? "0.8" : "1.0"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

const outputPath = path.resolve("public", "sitemap.xml");
fs.writeFileSync(outputPath, sitemapContent, "utf8");

console.log("✅ Sitemap generated successfully at:", outputPath);
