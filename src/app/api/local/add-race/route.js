import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
]);
const execFileAsync = promisify(execFile);

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function sanitizeRacePayload(payload) {
  const race = {
    ...payload,
    id: Number(payload.id),
    slug: slugify(payload.slug || payload.nom),
    type: Array.isArray(payload.type) ? payload.type.map(Number) : [],
  };

  if (Array.isArray(race.conditions) && race.conditions.length === 0) {
    delete race.conditions;
  }

  if (!race.prix_gagnants) {
    delete race.prix_gagnants;
  }

  if (!race.colors) {
    delete race.colors;
  }

  return race;
}

export async function POST(request) {
  try {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "Cette route est disponible seulement en local." },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const raceRaw = formData.get("race");
    const imageFile = formData.get("image");

    if (typeof raceRaw !== "string") {
      return NextResponse.json(
        { error: "Les donnees de la course sont manquantes." },
        { status: 400 }
      );
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Choisis une image valide." },
        { status: 400 }
      );
    }

    const racePayload = sanitizeRacePayload(JSON.parse(raceRaw));
    const repoRoot = process.cwd();
    const dataDir = path.join(repoRoot, "src", "data");
    const coursesPath = path.join(dataDir, "courses.json");
    const coursesDevPath = path.join(dataDir, "courses.dev.json");
    const coursesTestPath = path.join(dataDir, "courses.test.json");
    const imagesDir = path.join(repoRoot, "public", "images");

    const imageExtension =
      path.extname(imageFile.name).toLowerCase() || ".jpg";

    if (!ALLOWED_EXTENSIONS.has(imageExtension)) {
      return NextResponse.json(
        { error: "Format d'image non supporte." },
        { status: 400 }
      );
    }

    const [coursesContent, coursesDevContent, coursesTestContent] =
      await Promise.all([
        readFile(coursesPath, "utf8"),
        readFile(coursesDevPath, "utf8"),
        readFile(coursesTestPath, "utf8"),
      ]);

    const courses = JSON.parse(coursesContent);
    const coursesDev = JSON.parse(coursesDevContent);
    const coursesTest = JSON.parse(coursesTestContent);

    if (courses.some((course) => course.slug === racePayload.slug)) {
      return NextResponse.json(
        { error: "Ce slug existe deja dans courses.json." },
        { status: 409 }
      );
    }

    const finalId =
      Number(racePayload.id) ||
      courses.reduce(
        (maxId, course) => Math.max(maxId, Number(course.id) || 0),
        0
      ) + 1;

    const finalSlug = racePayload.slug || slugify(racePayload.nom);
    const imageFileName = `${finalSlug}${imageExtension}`;
    const imagePath = `/images/${imageFileName}`;
    const imageDiskPath = path.join(imagesDir, imageFileName);
    const imageBytes = Buffer.from(await imageFile.arrayBuffer());

    await mkdir(imagesDir, { recursive: true });
    await writeFile(imageDiskPath, imageBytes);

    const newRace = {
      ...racePayload,
      id: finalId,
      slug: finalSlug,
      image: imagePath,
    };

    courses.push(newRace);
    coursesDev.push(newRace);
    coursesTest.push(newRace);

    await Promise.all([
      writeFile(coursesPath, JSON.stringify(courses, null, 2), "utf8"),
      writeFile(coursesDevPath, JSON.stringify(coursesDev, null, 2), "utf8"),
      writeFile(coursesTestPath, JSON.stringify(coursesTest, null, 2), "utf8"),
    ]);

    const imageRepoPath = `public/images/${imageFileName}`;
    const dataRepoPath = "src/data/courses.json";
    const dataDevRepoPath = "src/data/courses.dev.json";
    const dataTestRepoPath = "src/data/courses.test.json";
    const commitMessage = `add race data: ${finalSlug}`;

    await execFileAsync(
      "git",
      [
        "add",
        "--",
        dataRepoPath,
        dataDevRepoPath,
        dataTestRepoPath,
        imageRepoPath,
      ],
      { cwd: repoRoot }
    );
    await execFileAsync("git", ["commit", "-m", commitMessage], {
      cwd: repoRoot,
    });
    await execFileAsync("git", ["push", "origin", "prod"], {
      cwd: repoRoot,
    });

    return NextResponse.json({
      ok: true,
      id: finalId,
      slug: finalSlug,
      imagePath,
      race: newRace,
      pushedBranch: "prod",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue pendant l'ajout de la course.",
      },
      { status: 500 }
    );
  }
}
