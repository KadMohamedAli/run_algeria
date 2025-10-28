export default function DescriptionComponent({ text }) {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-3 text-white">À propos</h2>
      <p className="text-gray-200 whitespace-pre-line leading-relaxed">
        {text}
      </p>
    </section>
  );
}
