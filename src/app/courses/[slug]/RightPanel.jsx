/* ===== RIGHT PANEL ===== */
import {
  BuildingOffice2Icon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";
import { formatPhoneNumber, formatWebsite } from "@/utils/formatters";

function RightPanel({ course }) {
  const org = course.organisateur_nom
    ? {
        name: course.organisateur_nom,
        phone: course.contact_numero,
        email: course.contact_email,
        website: course.site_web,
      }
    : null;

  const hasValidInscriptionLink =
    course.inscription_link && course.inscription_link.startsWith("http");

  const hasConditions =
    Array.isArray(course.conditions) && course.conditions.length > 0;

  if (!org) return null;

  return (
    <aside className="sticky top-24 bg-white/5 rounded-xl p-6 shadow-md">
      <h3 className="text-2xl font-semibold text-white mb-4">Organisateur</h3>

      <div className="space-y-3 text-gray-200 text-sm">
        {org.name && (
          <div className="flex items-center gap-2">
            <BuildingOffice2Icon className="h-5 w-5 text-white flex-shrink-0" />
            <span>{org.name}</span>
          </div>
        )}

        {org.phone && (
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-5 w-5 text-white flex-shrink-0" />
            <a
              href={`tel:${org.phone}`}
              className="hover:text-white/50 text-white font-black transition-all duration-600 ease-in-out"
            >
              {formatPhoneNumber(org.phone)}
            </a>
          </div>
        )}

        {org.email && (
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="h-5 w-5 text-white flex-shrink-0" />
            <a
              href={`mailto:${org.email}`}
              className="hover:text-white/50 text-white font-black transition-all duration-600 ease-in-out break-words"
            >
              {org.email}
            </a>
          </div>
        )}

        {org.website && (
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="h-5 w-5 text-white flex-shrink-0" />
            <a
              href={org.website}
              className="hover:text-white/50 text-white font-black transition-all duration-600 ease-in-out break-words"
              target="_blank"
              rel="noopener noreferrer"
            >
              {formatWebsite(org.website)}
            </a>
          </div>
        )}

        {/* --- Inscription button --- */}
        {hasValidInscriptionLink && (
          <div className="pt-4 hidden sm:block">
            <a
              href={course.inscription_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full bg-[#ab3300] text-white uppercase text-xl font-black py-2 rounded-lg shadow-md hover:bg-[#c33b00] transition-all duration-300 ease-in-out"
            >
              S’inscrire
            </a>
          </div>
        )}

        {/* --- Conditions section --- */}
        {hasConditions && (
          <div className="pt-3 border-t border-white/10 mt-5 text-start">
            <h4 className="text-2xl font-semibold text-white mb-2">
              Condition{course.conditions.length > 1 ? "s" : ""}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm inline-block text-start">
              {course.conditions.map((cond, idx) => (
                <li key={idx} className="leading-snug">
                  {cond}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}

export default RightPanel;
