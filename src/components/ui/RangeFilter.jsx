// ----- Range slider (dual) -----
export default function RangeFilter({
  label,
  min,
  max,
  step,
  value,
  onChange,
}) {
  const [minVal, maxVal] = value;

  return (
    <div className="flex flex-col w-full sm:w-[250px]">
      <label className="text-sm font-medium mb-1 text-gray-200">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={(e) => onChange([Number(e.target.value), maxVal])}
          className="w-full accent-blue-500"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={(e) => onChange([minVal, Number(e.target.value)])}
          className="w-full accent-blue-500"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{minVal}</span>
        <span>{maxVal}</span>
      </div>
    </div>
  );
}
