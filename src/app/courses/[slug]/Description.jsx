export default function DescriptionComponent({ text }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-3 text-blue-300">À propos</h2>
      <p className="text-gray-200 whitespace-pre-line leading-relaxed">
        {text}
      </p>
    </section>
  );
}
