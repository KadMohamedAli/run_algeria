import { Stethoscope } from "lucide-react";

const DOCTOR_MAPS_URL = "https://maps.app.goo.gl/cbSVBWmpAGhVPydX9";

export default function MedicalCertificateBanner() {
  return (
    <section
      aria-labelledby="medical-certificate-title"
      className="my-2 flex w-full max-w-2xl items-start gap-2 rounded-lg border border-slate-600/70 border-l-3 border-l-orange-400 bg-slate-700/60 px-3 py-2 not-italic sm:my-5 sm:gap-3 sm:px-4 sm:py-3"
    >
      <Stethoscope
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-orange-300 sm:size-5"
        strokeWidth={1.75}
      />

      <div className="min-w-0">
        <h2
          id="medical-certificate-title"
          className="text-sm font-semibold leading-snug text-white sm:text-base"
        >
          Il vous manque un certificat médical ?
        </h2>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-200 sm:mt-1 sm:text-sm">
          <span className="sm:hidden">
            Médecin du sport assermenté, priorité et tarif réduit.
          </span>
          <span className="hidden sm:inline">
            Nous collaborons avec un médecin du sport assermenté : priorité et
            réduction sur la consultation du certificat d&apos;aptitude.
          </span>
        </p>
        <a
          href={DOCTOR_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Voir l’adresse du cabinet sur Google Maps (nouvel onglet)"
          className="inline-flex min-h-11 items-center rounded-sm text-sm font-medium text-orange-300 underline decoration-orange-300/50 underline-offset-4 transition-colors hover:text-orange-200 hover:decoration-orange-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-300 sm:mt-1 sm:min-h-0 sm:py-1"
        >
          Voir le médecin
        </a>
      </div>
    </section>
  );
}
