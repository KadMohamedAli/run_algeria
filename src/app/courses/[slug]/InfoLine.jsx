export default function InfoLine({
  icon: Icon,
  label,
  value,
  bgColor,
  className = "",
}) {
  const backgroundClass = bgColor ? bgColor : "#ffffff0d"; // default if no custom color

  return (
    <div
      className={`flex items-center space-x-2 p-3 rounded-lg shadow-md ${className}`}
      style={{ backgroundColor: backgroundClass }}
    >
      <Icon className="h-5 w-5 text-white flex-shrink-0" />
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-white font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}
