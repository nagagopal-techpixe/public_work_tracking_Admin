import React, { useEffect, useState } from "react";
import {getAllConstituencies,getMandalsByConstituency,getVillagesByMandal,getHabitationsByVillage} from "../../api/worksApi"

/* ===================== Component ===================== */

const LocationEdit = ({ editWork, setEditWork, isOpen }) => {
  const [constituencies, setConstituencies] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [habitations, setHabitations] = useState([]);

  /* Load constituencies when modal opens */
  useEffect(() => {
    if (!isOpen) return;

    getAllConstituencies()
   
      .then(res => {
        // console.log("getAllConstituencies",res.data?.data)
        setConstituencies(res.data?.data || [])
      })
      .catch(err => console.error("Constituencies error:", err));
  }, [isOpen]);

  /* Load mandals */
  useEffect(() => {
    if (!isOpen || !editWork.constituency_id) {
      setMandals([]);
      return;
    }

    getMandalsByConstituency(editWork.constituency_id)
      .then(res => setMandals(res.data?.data || []))
      .catch(err => console.error("Mandals error:", err));
  }, [isOpen, editWork.constituency_id]);

  /* Load villages */
  useEffect(() => {
    if (!isOpen || !editWork.mandal_id) {
      setVillages([]);
      return;
    }

    getVillagesByMandal(editWork.mandal_id)
      .then(res => setVillages(res.data?.data || []))
      .catch(err => console.error("Villages error:", err));
  }, [isOpen, editWork.mandal_id]);

  /* Load habitations */
  useEffect(() => {
    if (!isOpen || !editWork.village_id) {
      setHabitations([]);
      return;
    }

    getHabitationsByVillage(editWork.village_id)
      .then(res => setHabitations(res.data?.data || []))
      .catch(err => console.error("Habitations error:", err));
  }, [isOpen, editWork.village_id]);

  return (
    <>
      {/* Constituency */}
      <label>Constituency</label>
      <select
        value={editWork.constituency_id || ""}
        onChange={e =>
          setEditWork(prev => ({
            ...prev,
            constituency_id: e.target.value,
            mandal_id: "",
            mandal_name: "",
            village_id: "",
            village_name: "",
            habitation_id: "",
            habitation_name: "",
          }))
        }
        className="w-full border rounded px-3 py-2 mt-1"
      >
        <option value="">Select Constituency</option>
     {constituencies.map(c => (
  <option key={c._id} value={c._id}>
    {c.constituency_name}
  </option>
))}

      </select>

      {/* Mandal */}
      <label className="mt-3">Mandal</label>
      <select
        value={editWork.mandal_id || ""}
        disabled={!mandals.length}
        onChange={e => {
          const selected = mandals.find(m => m._id === e.target.value);
          setEditWork(prev => ({
            ...prev,
            mandal_id: e.target.value,
            mandal_name: selected?.mandal_name || "",
            village_id: "",
            village_name: "",
            habitation_id: "",
            habitation_name: "",
          }));
        }}
        className="w-full border rounded px-3 py-2 mt-1 disabled:bg-gray-100"
      >
        <option value="">Select Mandal</option>
        {mandals.map(m => (
          <option key={m._id} value={m._id}>
            {m.mandal_name}
          </option>
        ))}
      </select>

      {/* Village */}
      <label className="mt-3">Village</label>
      <select
        value={editWork.village_id || ""}
        disabled={!villages.length}
        onChange={e => {
          const selected = villages.find(v => v._id === e.target.value);
          setEditWork(prev => ({
            ...prev,
            village_id: e.target.value,
            village_name: selected?.village_name || "",
            habitation_id: "",
            habitation_name: "",
          }));
        }}
        className="w-full border rounded px-3 py-2 mt-1 disabled:bg-gray-100"
      >
        <option value="">Select Village</option>
        {villages.map(v => (
          <option key={v._id} value={v._id}>
            {v.village_name}
          </option>
        ))}
      </select>

      {/* Habitation */}
      <label className="mt-3">Habitation</label>
      <select
        value={editWork.habitation_id || ""}
        disabled={!habitations.length}
        onChange={e => {
          const selected = habitations.find(h => h._id === e.target.value);
          setEditWork(prev => ({
            ...prev,
            habitation_id: e.target.value,
            habitation_name: selected?.habitation_name || "",
          }));
        }}
        className="w-full border rounded px-3 py-2 mt-1 disabled:bg-gray-100"
      >
        <option value="">Select Habitation</option>
        {habitations.map(h => (
          <option key={h._id} value={h._id}>
            {h.habitation_name}
          </option>
        ))}
      </select>
    </>
  );
};

export default LocationEdit;
