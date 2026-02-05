export default function HabitationDropdowns({
  constituencies,
  mandals,
  villages,
  selectedConstituency,
  selectedMandal,
  selectedVillage,
  onConstituencyChange,
  onMandalChange,
  onVillageChange,
}) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <label className="font-medium">Constituency:</label>
      <select
        value={selectedConstituency}
        onChange={onConstituencyChange}
        className="border px-3 py-2 rounded w-60"
      >
        <option value="">-- Select Constituency --</option>
        {constituencies.map((c) => (
          <option key={c._id} value={c._id}>
            {c.constituency_name}
          </option>
        ))}
      </select>
<label className="font-medium">Mandal:</label>
      <select
        value={selectedMandal}
        onChange={onMandalChange}
        disabled={!mandals.length}
        className="border px-3 py-2 rounded w-60"
      >
        <option value="">{mandals.length ? "-- Select Mandal --" : "No Mandals"}</option>
        {mandals.map((m) => (
          <option key={m._id} value={m._id}>
            {m.mandal_name}
          </option>
        ))}
      </select>
<label className="font-medium">Village:</label>

      <select
        value={selectedVillage}
        onChange={onVillageChange}
        disabled={!villages.length}
        className="border px-2 py-2 rounded w-60"
      >
        <option value="">{villages.length ? "-- Select Village --" : "No Villages"}</option>
        {villages.map((v) => (
          <option key={v._id} value={v._id}>
            {v.village_name}
          </option>
        ))}
      </select>
    </div>
  );
}
