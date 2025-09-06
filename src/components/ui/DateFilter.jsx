// ----- Date range -----
export default function DateRangeFilter({ label, value, onChange }) {
  const handleFrom = (e) => {
    onChange({ ...value, from: e.target.value });
  };
  const handleTo = (e) => {
    onChange({ ...value, to: e.target.value });
  };

  return (
    <div className="flex flex-col w-full sm:w-[250px]">
      <label className="text-sm font-medium mb-1 text-gray-200">{label}</label>
      <div className="flex gap-2">
        <input
          type="date"
          value={value.from || ""}
          onChange={handleFrom}
          className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full"
        />
        <input
          type="date"
          value={value.to || ""}
          onChange={handleTo}
          className="bg-gray-800 border border-gray-600 rounded p-1 text-white w-full"
        />
      </div>
    </div>
  );
}
