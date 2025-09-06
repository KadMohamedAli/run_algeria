// ----- Multi-select dropdown with checkboxes -----
export default function MultiSelect({ label, options, value = [], onChange }) {
  const toggle = (opt) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div className="flex flex-col w-full sm:w-[200px]">
      <label className="text-sm font-medium mb-1 text-gray-200">{label}</label>
      <div className="border border-gray-600 bg-gray-800 rounded p-2 text-sm text-white">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={value.includes(opt)}
              onChange={() => toggle(opt)}
              className="accent-blue-500"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
