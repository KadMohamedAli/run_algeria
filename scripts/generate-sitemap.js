const fs = require("fs");
const path = require("path");

// ✅ Determine which JSON file to load, mimicking coursesData behavior
const env = process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || "production";

let coursesFile = "courses.json";
if (env === "development") coursesFile = "courses.dev.json";
else if (env === "test") coursesFile = "courses.test.json";

// ✅ Resolve absolute path and safely read JSON
const coursesPath = path.resolve(__dirname, `../src/data/${coursesFile}`);

let courses = [];
try {
  const fileContent = fs.readFileSync(coursesPath, "utf8");
  courses = JSON.parse(fileContent);
  console.log(`📘 Loaded courses from ${coursesFile} (${courses.length} items)`);
} catch (err) {
  console.warn(`⚠️ Could not load ${coursesFile}:`, err.message);
  console.warn("⚠️ Falling back to empty course list.");
}

// ✅ Base URL (for sitemap links)
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://coursesalgerie.vercel.app";

// ✅ Static and dynamic pages
const staticPages = ["", "/contact"];
const pages = [
  ...staticPages.map((p) => `${baseUrl}${p}`),
  ...courses.map((c) => `${baseUrl}/courses/${c.slug}`),
];

// ✅ Generate sitemap XML
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

// ✅ Save sitemap
const outputPath = path.resolve(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outputPath, sitemapContent, "utf8");

console.log("✅ Sitemap generated successfully at:", outputPath);
