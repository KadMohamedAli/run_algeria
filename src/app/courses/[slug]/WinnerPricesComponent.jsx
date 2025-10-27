export default function WinnerPricesComponent({ prix_gagnants }) {
  const hasAny =
    prix_gagnants.premier?.length ||
    prix_gagnants.deuxieme?.length ||
    prix_gagnants.troisieme?.length ||
    prix_gagnants.finishers?.length;

  if (!hasAny) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-3 text-blue-300">
        Prix pour les gagnants
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-gray-200">
        {Object.entries(prix_gagnants).map(
          ([key, values]) =>
            Array.isArray(values) &&
            values.length > 0 && (
              <div key={key}>
                <h3 className="font-semibold capitalize mb-2 text-white">
                  {key}
                </h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {values.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )
        )}
      </div>
    </section>
  );
}
