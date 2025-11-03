const fs = require("fs");
const path = require("path");

// Detect environment (Next.js sets NODE_ENV automatically)
const env = process.env.NODE_ENV || "development";

// Choose the appropriate courses file
let coursesFile = "courses.json"; // default (production)
if (env === "development") coursesFile = "courses.dev.json";
else if (env === "test") coursesFile = "courses.test.json";

// Resolve the file path
const coursesPath = path.resolve(__dirname, `../src/data/${coursesFile}`);

// Load courses safely
let courses = [];
try {
  courses = require(coursesPath);
  console.log(`📘 Using course data from: ${coursesFile}`);
} catch (err) {
  console.warn(`⚠️ Could not load ${coursesFile}. Falling back to courses.json`);
  courses = require(path.resolve(__dirname, "../data/courses.json"));
}

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://run-algeria.vercel.app";

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

const outputPath = path.resolve(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outputPath, sitemapContent, "utf8");

console.log("✅ Sitemap generated successfully at:", outputPath);
