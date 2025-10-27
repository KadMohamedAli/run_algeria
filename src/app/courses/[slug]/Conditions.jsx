export default function ConditionsComponent({ conditions }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-3 text-blue-300">Conditions</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-200">
        {conditions.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </section>
  );
}
