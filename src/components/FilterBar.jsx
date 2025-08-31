export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <input 
        type="text" 
        placeholder="Wilaya" 
        className="border border-gray-600 bg-gray-700 text-white p-1 rounded"
        onChange={e => setFilters({ ...filters, wilaya: e.target.value })}
      />
      <input 
        type="text" 
        placeholder="Type (trail/run)" 
        className="border border-gray-600 bg-gray-700 text-white p-1 rounded"
        onChange={e => setFilters({ ...filters, type: e.target.value })}
      />
      {/* Ajoute d'autres filtres si nécessaire */}
    </div>
  )
}
