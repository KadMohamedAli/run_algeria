export default function DescriptionComponent({ text }) {
  // Basic Markdown → HTML conversion
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // **bold**
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // *italic*
    .replace(/`(.*?)`/g, "<code>$1</code>") // `inline code`
    .replace(/\n/g, "<br />"); // line breaks

  return (
    <section>
      <h2 className="text-3xl font-bold mb-3 text-white">À propos</h2>
      <p
        className="text-gray-200 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    </section>
  );
}
