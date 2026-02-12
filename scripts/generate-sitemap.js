const fs = require("fs");
const path = require("path");

// ✅ Determine which JSON file to load
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
  console.log(
    `📘 Loaded courses from ${coursesFile} (${courses.length} items)`,
  );
} catch (err) {
  console.warn(`⚠️ Could not load ${coursesFile}:`, err.message);
  console.warn("⚠️ Falling back to empty course list.");
}

// ✅ Base URL (for sitemap links)
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.coursealgerie.com";

// ✅ Static pages
const staticPages = ["", "/contact"];

// ✅ Generate sitemap entries
const staticUrls = staticPages.map(
  (p) => `
  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`,
);

const now = new Date();

const courseUrls = courses.map((c) => {
  // Parse course date
  const courseDate = c.date ? new Date(c.date) : null;

  // Use course date if it's in the past, otherwise use current date
  const lastmodDate =
    courseDate && courseDate < now
      ? courseDate.toISOString()
      : now.toISOString();

  return `
  <url>
    <loc>${baseUrl}/courses/${c.slug}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>weekly</changefreq>
    ${
      c.image
        ? `
    <image:image>
      <image:loc>${baseUrl}${c.image}</image:loc>
      <image:title>${c.nom}</image:title>
    </image:image>`
        : ""
    }
    <priority>0.8</priority>
  </url>
  `;
});

// ✅ Combine all URLs
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...staticUrls, ...courseUrls].join("\n")}
</urlset>`;

// ✅ Save sitemap
const outputPath = path.resolve(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outputPath, sitemapContent, "utf8");

console.log("✅ Sitemap generated successfully at:", outputPath);
