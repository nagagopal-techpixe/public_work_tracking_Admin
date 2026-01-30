import React, { useEffect, useState } from "react";
import {getAllConstituencies,getMandalsByConstituency,getVillagesByMandal,getHabitationsByVillage} from "../../api/worksApi"

export default function LocationDropdowns({ onChange }) {
  const [constituencies, setConstituencies] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [habitations, setHabitations] = useState([]);

  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedHabitation, setSelectedHabitation] = useState("");

  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const res = await getAllConstituencies();
        setConstituencies(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConstituencies();
  }, []);

  const handleConstituencyChange = async (e) => {
    const id = e.target.value;
    setSelectedConstituency(id);
    setSelectedMandal("");
    setSelectedVillage("");
    setSelectedHabitation("");
    setMandals([]);
    setVillages([]);
    setHabitations([]);
    onChange({ constituency_id: id, mandal_id: "", village_id: "", habitation_id: "" });

    if (!id) return;
    try {
      const res = await getMandalsByConstituency(id);
      setMandals(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMandalChange = async (e) => {
    const id = e.target.value;
    setSelectedMandal(id);
    setSelectedVillage("");
    setSelectedHabitation("");
    setVillages([]);
    setHabitations([]);
    onChange({ constituency_id: selectedConstituency, mandal_id: id, village_id: "", habitation_id: "" });

    if (!id) return;
    try {
      const res = await getVillagesByMandal(id);
      setVillages(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVillageChange = async (e) => {
    const id = e.target.value;
    setSelectedVillage(id);
    setSelectedHabitation("");
    setHabitations([]);
    onChange({ constituency_id: selectedConstituency, mandal_id: selectedMandal, village_id: id, habitation_id: "" });

    if (!id) return;
    try {
      const res = await getHabitationsByVillage(id);
      setHabitations(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleHabitationChange = (e) => {
    const id = e.target.value;
    setSelectedHabitation(id);
    onChange({ constituency_id: selectedConstituency, mandal_id: selectedMandal, village_id: selectedVillage, habitation_id: id });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <select value={selectedConstituency} onChange={handleConstituencyChange} className="border px-3 py-2 rounded w-full md:w-60">
        <option value="">-- Select Constituency --</option>
        {constituencies.map((c) => (
          <option key={c._id} value={c._id}>{c.constituency_name}</option>
        ))}
      </select>

      <select value={selectedMandal} onChange={handleMandalChange} disabled={!mandals.length} className="border px-3 py-2 rounded w-full md:w-60">
        <option value="">{mandals.length ? "-- Select Mandal --" : "No Mandals"}</option>
        {mandals.map((m) => <option key={m._id} value={m._id}>{m.mandal_name}</option>)}
      </select>

      <select value={selectedVillage} onChange={handleVillageChange} disabled={!villages.length} className="border px-3 py-2 rounded w-full md:w-60">
        <option value="">{villages.length ? "-- Select Village --" : "No Villages"}</option>
        {villages.map((v) => <option key={v._id} value={v._id}>{v.village_name}</option>)}
      </select>

      <select value={selectedHabitation} onChange={handleHabitationChange} disabled={!habitations.length} className="border px-3 py-2 rounded w-full md:w-60">
        <option value="">{habitations.length ? "-- Select Habitation --" : "No Habitations"}</option>
        {habitations.map((h) => <option key={h._id} value={h._id}>{h.habitation_name}</option>)}
      </select>
    </div>
  );
}
