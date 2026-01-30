import React, { useEffect, useState } from "react";
import {
  getAllConstituencies,
  getMandalsByConstituency,
  getVillagesByMandal,
  getHabitationsByVillage,
  createHabitation,
  updateHabitation,
  deleteHabitation,
} from "../../api/habitationApis";
import { toast } from "react-toastify";

import HabitationDropdowns from "./HabitationDropdowns";
import HabitationTable from "./HabitationTable";

export default function Habitations() {
  // -------------------- STATES --------------------
  const [constituencies, setConstituencies] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [habitations, setHabitations] = useState([]);

  const [selectedConstituency, setSelectedConstituency] = useState(
    localStorage.getItem("habitation_constituency") || ""
  );
  const [selectedMandal, setSelectedMandal] = useState(
    localStorage.getItem("habitation_mandal") || ""
  );
  const [selectedVillage, setSelectedVillage] = useState(
    localStorage.getItem("habitation_village") || ""
  );

  const [loading, setLoading] = useState(false);
  const [newHabitationName, setNewHabitationName] = useState("");
  const [newWardNumber, setNewWardNumber] = useState("");

  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState({
    habitation_name: "",
    ward_number: "",
  });

  const [updateLoadingId, setUpdateLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // -------------------- PERSIST SELECTION --------------------
  useEffect(() => {
    localStorage.setItem("habitation_constituency", selectedConstituency);
  }, [selectedConstituency]);

  useEffect(() => {
    localStorage.setItem("habitation_mandal", selectedMandal);
  }, [selectedMandal]);

  useEffect(() => {
    localStorage.setItem("habitation_village", selectedVillage);
  }, [selectedVillage]);

  // -------------------- INITIAL LOAD --------------------
  useEffect(() => {
    const initialize = async () => {
      try {
        const cRes = await getAllConstituencies();
        setConstituencies(cRes.data.data || []);

        if (selectedConstituency) {
          const mRes = await getMandalsByConstituency(selectedConstituency);
          setMandals(mRes.data.data || []);
        }

        if (selectedMandal) {
          const vRes = await getVillagesByMandal(selectedMandal);
          setVillages(vRes.data.data || []);
        }

        if (selectedVillage) {
          const hRes = await getHabitationsByVillage(selectedVillage);
          setHabitations(hRes.data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    initialize();
  }, []);

  // -------------------- DROPDOWN HANDLERS --------------------
  const handleConstituencyChange = async (e) => {
    const id = e.target.value;
    setSelectedConstituency(id);

    setMandals([]);
    setSelectedMandal("");
    setVillages([]);
    setSelectedVillage("");
    setHabitations([]);

    if (!id) return;

    setLoading(true);
    try {
      const res = await getMandalsByConstituency(id);
      setMandals(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMandalChange = async (e) => {
    const id = e.target.value;
    setSelectedMandal(id);

    setVillages([]);
    setSelectedVillage("");
    setHabitations([]);

    if (!id) return;

    setLoading(true);
    try {
      const res = await getVillagesByMandal(id);
      setVillages(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVillageChange = async (e) => {
    const id = e.target.value;
    setSelectedVillage(id);

    setHabitations([]);

    if (!id) return;

    setLoading(true);
    try {
      const res = await getHabitationsByVillage(id);
      setHabitations(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- CREATE HABITATION --------------------
  const handleCreate = async () => {
    if (!newHabitationName.trim() || !newWardNumber.trim() || !selectedVillage)
      return;

    try {
      await createHabitation({
        habitation_name: newHabitationName.trim(),
        ward_number: newWardNumber.trim(),
        village_id: selectedVillage,
      });

      setNewHabitationName("");
      setNewWardNumber("");
      refreshHabitations();
      toast.success("Habitation created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create habitation");

    }
  };

  // -------------------- UPDATE HABITATION --------------------
  const handleUpdate = async (id) => {
    if (!editValues.habitation_name.trim() || !editValues.ward_number.trim())
      return;

    setUpdateLoadingId(id);
    try {
      await updateHabitation(id, editValues);
      setEditRowId(null);
      refreshHabitations();
      toast.success("Habitation updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update habitation");
    } finally {
      setUpdateLoadingId(null);
    }
  };

  // -------------------- DELETE HABITATION --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    setDeleteLoadingId(id);
    try {
      await deleteHabitation(id);
      setHabitations((prev) => prev.filter((h) => h._id !== id));
      toast.success("Habitation deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete habitation");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const refreshHabitations = async () => {
    if (!selectedVillage) return;
    try {
      const res = await getHabitationsByVillage(selectedVillage);
      setHabitations(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Habitations</h1>

      <HabitationDropdowns
        constituencies={constituencies}
        mandals={mandals}
        villages={villages}
        selectedConstituency={selectedConstituency}
        selectedMandal={selectedMandal}
        selectedVillage={selectedVillage}
        onConstituencyChange={handleConstituencyChange}
        onMandalChange={handleMandalChange}
        onVillageChange={handleVillageChange}
      />

      {selectedVillage && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Habitation Name"
            value={newHabitationName}
            onChange={(e) => setNewHabitationName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="text"
            placeholder="Ward Number"
            value={newWardNumber}
            onChange={(e) => setNewWardNumber(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            Create
          </button>
        </div>
      )}

      {loading && <p className="text-blue-600">Loading...</p>}

      {!loading && habitations.length > 0 && (
        <HabitationTable
          habitations={habitations}
          editRowId={editRowId}
          editValues={editValues}
          setEditRowId={setEditRowId}
          setEditValues={setEditValues}
          updateLoadingId={updateLoadingId}
          deleteLoadingId={deleteLoadingId}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      {!loading && habitations.length === 0 && selectedVillage && (
        <p className="mt-4">No habitations found for this village.</p>
      )}
    </div>
  );
}
