"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  ColorSwatch,
  LabeledField,
  Section,
  StatusMessage,
  fieldClassName,
  textareaClassName,
} from "./BuilderUi";
import {
  DEFAULT_COLORS,
  DEFAULT_OFFSET,
  buildIsoDate,
  extractPalette,
  formatJson,
  parseDistance,
  parseJsonObject,
  parseOptionalNumber,
  slugify,
  splitLines,
} from "./builderUtils";

export default function RaceBuilderClient({
  nextId,
  existingSlugs,
  wilayas,
  raceTypes,
}) {
  const [isPending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(false);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [storedImageUrl, setStoredImageUrl] = useState("");
  const [form, setForm] = useState({
    id: nextId,
    nom: "",
    slug: "",
    date: "",
    time: "08:00",
    offset: DEFAULT_OFFSET,
    type: [],
    distanceMode: "single",
    distanceSingle: "",
    distanceSegments: "",
    distanceText: "",
    chrono: "",
    denivele_plus: "",
    wilaya: "",
    commune: "",
    pays: "Algerie",
    organisateur_nom: "",
    contact_numero: "",
    contact_email: "",
    site_web: "",
    inscription_link: "",
    prix_inscription: "",
    description: "",
    conditionsText: "",
    prixGagnantsText: "",
    colors: DEFAULT_COLORS,
  });

  useEffect(() => {
    if (!slugTouched) {
      setForm((current) => ({ ...current, slug: slugify(current.nom) }));
    }
  }, [form.nom, slugTouched]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    if (confirmPublish) {
      setConfirmPublish(false);
    }
  }, [form, selectedImageFile]);

  const generatedRace = useMemo(() => {
    const race = {
      id: Number(form.id) || nextId,
      slug: form.slug.trim(),
      nom: form.nom.trim(),
      description: form.description.trim(),
      date: buildIsoDate(form.date, form.time, form.offset),
      type: form.type.map(Number).sort((a, b) => a - b),
      distance: parseDistance(form),
      chrono: parseOptionalNumber(form.chrono),
      denivele_plus: parseOptionalNumber(form.denivele_plus),
      wilaya: form.wilaya ? Number(form.wilaya) : undefined,
      commune: form.commune.trim() || undefined,
      pays: form.pays.trim() || undefined,
      organisateur_nom: form.organisateur_nom.trim() || undefined,
      contact_numero: form.contact_numero.trim() || undefined,
      contact_email: form.contact_email.trim() || undefined,
      site_web: form.site_web.trim() || undefined,
      image: storedImageUrl || undefined,
      prix_inscription: form.prix_inscription.trim() || undefined,
      inscription_link: form.inscription_link.trim() || undefined,
      conditions: splitLines(form.conditionsText),
      colors: {
        background_color: form.colors.background_color.trim() || undefined,
        secondary_color: form.colors.secondary_color.trim() || undefined,
        accent_color: form.colors.accent_color.trim() || undefined,
      },
      prix_gagnants: parseJsonObject(form.prixGagnantsText),
    };

    return Object.fromEntries(
      Object.entries(race).filter(([, value]) => {
        if (value === undefined || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (
          value &&
          typeof value === "object" &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0
        ) {
          return false;
        }
        return true;
      })
    );
  }, [form, nextId, storedImageUrl]);

  const validation = useMemo(() => {
    const issues = [];

    if (!generatedRace.nom) issues.push("Nom manquant");
    if (!generatedRace.slug) issues.push("Slug manquant");
    if (!generatedRace.date) issues.push("Date manquante");
    if (!generatedRace.type?.length) issues.push("Selectionne au moins un type");
    if (!generatedRace.description) issues.push("Description manquante");
    if (!generatedRace.wilaya) issues.push("Wilaya manquante");
    if (!selectedImageFile && !storedImageUrl) {
      issues.push("Choisis une image depuis ton ordinateur");
    }
    if (generatedRace.slug && existingSlugs.includes(generatedRace.slug)) {
      issues.push("Ce slug existe deja dans les donnees");
    }
    if (form.prixGagnantsText.trim() && !generatedRace.prix_gagnants) {
      issues.push("Le JSON des prix gagnants est invalide");
    }

    return issues;
  }, [existingSlugs, form.prixGagnantsText, generatedRace, selectedImageFile, storedImageUrl]);

  function toggleType(code) {
    setForm((current) => {
      const alreadySelected = current.type.includes(code);
      return {
        ...current,
        type: alreadySelected
          ? current.type.filter((item) => item !== code)
          : [...current.type, code],
      };
    });
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedImageFile(null);
      setImagePreviewUrl("");
      setStoredImageUrl("");
      setConfirmPublish(false);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImageFile(file);
    setStoredImageUrl("");
    setConfirmPublish(false);
    setImagePreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return previewUrl;
    });
    setStatus({ type: "idle", message: "" });

    try {
      const palette = await extractPalette(file);
      setForm((current) => ({ ...current, colors: palette }));
    } catch {
      setStatus({
        type: "error",
        message:
          "Impossible de lire les couleurs de cette image. Tu peux encore les modifier a la main.",
      });
    }
  }

  async function handleSave() {
    if (validation.length > 0) {
      setConfirmPublish(false);
      setStatus({
        type: "error",
        message: "Le formulaire contient encore des champs a corriger.",
      });
      return;
    }

    if (!selectedImageFile) {
      setConfirmPublish(false);
      setStatus({
        type: "error",
        message: "Choisis d'abord une image depuis ton ordinateur.",
      });
      return;
    }

    if (!confirmPublish) {
      setConfirmPublish(true);
      setStatus({
        type: "idle",
        message:
          "Clique encore une fois pour confirmer l'envoi, le commit et le push sur prod.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("race", JSON.stringify(generatedRace));
    formData.append("image", selectedImageFile);

    startTransition(async () => {
      setStatus({ type: "saving", message: "Enregistrement en cours..." });

      try {
        const response = await fetch("/api/local/add-race", {
          method: "POST",
          body: formData,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Enregistrement impossible.");
        }

        setStoredImageUrl(payload.imagePath);
        setConfirmPublish(false);
        setStatus({
          type: "success",
          message: `Course ajoutee, committee et pushed sur ${payload.pushedBranch}. Image: ${payload.imagePath}.`,
        });
      } catch (error) {
        setConfirmPublish(false);
        setStatus({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Une erreur est survenue pendant l'enregistrement.",
        });
      }
    });
  }

  const jsonPreview = useMemo(() => formatJson(generatedRace), [generatedRace]);
  const displayImageUrl = imagePreviewUrl || storedImageUrl;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#334155_0%,#0f172a_48%,#020617_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 shadow-[0_30px_120px_rgba(2,6,23,0.45)] backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-orange-300">
            Local Tool
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Ajouter une course avec image locale
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Choisis une image depuis ton ordinateur. Les couleurs du bloc course
            seront derivees de cette image, puis l'outil enregistrera l'affiche
            dans <code className="rounded bg-white/10 px-1 py-0.5">public/images</code>
            {" "}et la course dans{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">
              src/data/courses.json
            </code>
            .
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <Section
              title="Identite"
              description="Base de la course et slug automatique."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField
                  label="Id"
                  hint="Pre-rempli avec le prochain id disponible."
                >
                  <input
                    className={fieldClassName()}
                    value={form.id}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        id: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField
                  label="Slug"
                  hint="Genere depuis le nom, mais tu peux le corriger."
                >
                  <input
                    className={fieldClassName()}
                    value={form.slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      setConfirmPublish(false);
                      setForm((current) => ({
                        ...current,
                        slug: slugify(event.target.value),
                      }));
                    }}
                  />
                </LabeledField>
              </div>
              <div className="mt-4">
                <LabeledField
                  label="Nom"
                  hint="Titre affiche sur la carte et la page detail."
                >
                  <input
                    className={fieldClassName()}
                    placeholder="Semi-marathon de ..."
                    value={form.nom}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        nom: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
              </div>
            </Section>

            <Section
              title="Image locale"
              description="Selectionne l'affiche depuis ton ordinateur. Les couleurs se mettent a jour automatiquement."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField
                  label="Image"
                  hint="JPG, PNG, WEBP, AVIF ou GIF."
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/avif,image/gif"
                    className={fieldClassName()}
                    onChange={handleImageChange}
                  />
                </LabeledField>
                <div className="grid gap-3 sm:grid-cols-3">
                  <ColorSwatch
                    label="Fond"
                    value={form.colors.background_color}
                  />
                  <ColorSwatch
                    label="Secondaire"
                    value={form.colors.secondary_color}
                  />
                  <ColorSwatch
                    label="Accent"
                    value={form.colors.accent_color}
                  />
                </div>
              </div>
            </Section>

            <Section
              title="Date et lieu"
              description="Ces champs servent pour la carte, les filtres et la page detail."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <LabeledField label="Date">
                  <input
                    type="date"
                    className={fieldClassName()}
                    value={form.date}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField label="Heure">
                  <input
                    type="time"
                    className={fieldClassName()}
                    value={form.time}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        time: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField label="Fuseau">
                  <input
                    className={fieldClassName()}
                    value={form.offset}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        offset: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <LabeledField label="Wilaya">
                  <select
                    className={fieldClassName()}
                    value={form.wilaya}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        wilaya: event.target.value,
                      }))
                    }
                  >
                    <option value="">Choisir une wilaya</option>
                    {wilayas.map((wilaya) => (
                      <option key={wilaya.id} value={wilaya.id}>
                        {wilaya.code.padStart(2, "0")} - {wilaya.name}
                      </option>
                    ))}
                  </select>
                </LabeledField>
                <LabeledField label="Commune">
                  <input
                    className={fieldClassName()}
                    value={form.commune}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        commune: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField label="Pays">
                  <input
                    className={fieldClassName()}
                    value={form.pays}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        pays: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
              </div>
            </Section>

            <Section
              title="Format de course"
              description="Choisis les types et la maniere de stocker la distance."
            >
              <div className="grid gap-4 md:grid-cols-3">
                <LabeledField label="Mode distance">
                  <select
                    className={fieldClassName()}
                    value={form.distanceMode}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        distanceMode: event.target.value,
                      }))
                    }
                  >
                    <option value="single">Distance simple</option>
                    <option value="segments">Distance en segments</option>
                    <option value="text">Distance libre</option>
                  </select>
                </LabeledField>
                {form.distanceMode === "single" ? (
                  <LabeledField label="Distance" hint="Ex: 21.1 ou 10">
                    <input
                      className={fieldClassName()}
                      value={form.distanceSingle}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          distanceSingle: event.target.value,
                        }))
                      }
                    />
                  </LabeledField>
                ) : null}
                {form.distanceMode === "segments" ? (
                  <LabeledField label="Segments" hint="Ex: 12, 12">
                    <input
                      className={fieldClassName()}
                      value={form.distanceSegments}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          distanceSegments: event.target.value,
                        }))
                      }
                    />
                  </LabeledField>
                ) : null}
                {form.distanceMode === "text" ? (
                  <LabeledField
                    label="Distance texte"
                    hint="Ex: 21,097 ou boucle 6,7 km/h"
                  >
                    <input
                      className={fieldClassName()}
                      value={form.distanceText}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          distanceText: event.target.value,
                        }))
                      }
                    />
                  </LabeledField>
                ) : null}
                <LabeledField
                  label="Chrono (secondes)"
                  hint="Laisse vide pour les courses classiques."
                >
                  <input
                    className={fieldClassName()}
                    value={form.chrono}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        chrono: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField label="Denivele positif" hint="En metres.">
                  <input
                    className={fieldClassName()}
                    value={form.denivele_plus}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        denivele_plus: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
              </div>
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium text-slate-100">Types</p>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {raceTypes.map((raceType) => {
                    const checked = form.type.includes(raceType.code);
                    return (
                      <button
                        key={raceType.code}
                        type="button"
                        onClick={() => toggleType(raceType.code)}
                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          checked
                            ? "border-orange-400 bg-orange-500/15 text-white shadow-[0_0_0_1px_rgba(251,146,60,0.35)]"
                            : "border-white/10 bg-slate-950/35 text-slate-300 hover:border-white/20 hover:bg-white/5"
                        }`}
                      >
                        <div className="font-semibold">
                          {String(raceType.code).padStart(2, "0")} -{" "}
                          {raceType.type}
                        </div>
                        <div className="mt-1 text-xs leading-5 text-slate-400">
                          {raceType.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Section>

            <Section
              title="Liens et contenu"
              description="Infos publiques, prix, organisateur et description markdown."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <LabeledField label="Lien inscription">
                  <input
                    className={fieldClassName()}
                    value={form.inscription_link}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        inscription_link: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField label="Site web organisateur">
                  <input
                    className={fieldClassName()}
                    value={form.site_web}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        site_web: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField label="Prix inscription">
                  <input
                    className={fieldClassName()}
                    value={form.prix_inscription}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        prix_inscription: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField label="Organisateur">
                  <input
                    className={fieldClassName()}
                    value={form.organisateur_nom}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        organisateur_nom: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField label="Telephone">
                  <input
                    className={fieldClassName()}
                    value={form.contact_numero}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        contact_numero: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField label="Email">
                  <input
                    className={fieldClassName()}
                    value={form.contact_email}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        contact_email: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
              </div>
              <div className="mt-4 space-y-4">
                <LabeledField label="Conditions" hint="Une condition par ligne.">
                  <textarea
                    className={textareaClassName()}
                    value={form.conditionsText}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        conditionsText: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField
                  label="Description"
                  hint="Markdown accepte, comme dans les donnees actuelles."
                >
                  <textarea
                    className={`${textareaClassName()} min-h-[260px]`}
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
                <LabeledField
                  label="Prix gagnants (JSON optionnel)"
                  hint='Exemple: {"Hommes":{"1er":["30000"]}}'
                >
                  <textarea
                    className={`${textareaClassName()} min-h-[180px] font-mono text-xs`}
                    value={form.prixGagnantsText}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        prixGagnantsText: event.target.value,
                      }))
                    }
                  />
                </LabeledField>
              </div>
            </Section>
          </div>

          <div className="space-y-6">
            <Section
              title="Apercu rapide"
              description="Controle avant ecriture dans le projet."
            >
              <div className="space-y-4">
                {displayImageUrl ? (
                  <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/60">
                    <img
                      src={displayImageUrl}
                      alt={form.nom || "Apercu course"}
                      className="h-56 w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-slate-950/35 text-sm text-slate-400">
                    Pas d'image selectionnee
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Slug
                    </div>
                    <div className="mt-2 break-all text-sm text-white">
                      {generatedRace.slug || "-"}
                    </div>
                  </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Image
                  </div>
                  <div className="mt-2 break-all text-sm text-white">
                    {storedImageUrl || "Sera creee a l'enregistrement"}
                  </div>
                </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Publication
                  </div>
                  <div className="mt-2 text-sm text-white">
                    Donnees committees puis pushed directement sur `prod`
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Validation
                  </div>
                  {validation.length === 0 ? (
                    <p className="mt-2 text-sm text-emerald-300">
                      Le formulaire est pret a etre enregistre.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-2 text-sm text-amber-300">
                      {validation.map((issue) => (
                        <li key={issue}>- {issue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Section>

            <Section
              title="Bloc JSON genere"
              description="Apercu du JSON qui sera ajoute dans courses.json."
            >
              <textarea
                readOnly
                className={`${textareaClassName()} min-h-[520px] font-mono text-xs`}
                value={jsonPreview}
              />
            </Section>

            <Section
              title="Enregistrement"
              description="L'image sera copiee dans public/images puis la course ajoutee au JSON."
            >
              <button
                type="button"
                disabled={isPending}
                onClick={handleSave}
                className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending
                  ? "Publication..."
                  : confirmPublish
                    ? "Confirmer l'envoi sur prod"
                    : "Publier la course"}
              </button>
              <StatusMessage status={status} />
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}
