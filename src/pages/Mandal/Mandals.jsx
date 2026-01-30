import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAllConstituencies } from "../../api/constituencyApi";
import {
  getMandalsByConstituency,
  createMandal,
  updateMandal,
  deleteMandal,
} from "../../api/mandalApi";

export default function Mandals() {
  const [constituencies, setConstituencies] = useState([]);
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [mandals, setMandals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [mandalLoading, setMandalLoading] = useState(false);
  const [error, setError] = useState("");
  const [mandalError, setMandalError] = useState("");

  const [newMandalName, setNewMandalName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoadingId, setUpdateLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [editMandals, setEditMandals] = useState({});
  const [editedValues, setEditedValues] = useState({});

  /* ===============================
     LOAD SAVED CONSTITUENCY
  ================================ */
  useEffect(() => {
    const saved = localStorage.getItem("selectedConstituency");
    if (saved) setSelectedConstituency(saved);
  }, []);

  /* ===============================
     FETCH CONSTITUENCIES
  ================================ */
  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const res = await getAllConstituencies();
        if (res.data?.success) {
          setConstituencies(res.data.data || []);
        } else {
          toast.error("Failed to fetch constituencies");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while fetching constituencies");
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchConstituencies();
  }, []);

  /* ===============================
     FETCH MANDALS
  ================================ */
  useEffect(() => {
    if (!selectedConstituency) return;

    const fetchMandals = async () => {
      setMandalLoading(true);
      setMandalError("");

      try {
        const res = await getMandalsByConstituency(selectedConstituency);
        if (res.data?.success) {
          setMandals(res.data.data || []);
        } else {
          toast.error("Failed to fetch mandals");
          setMandalError("Failed to fetch mandals");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while fetching mandals");
        setMandalError("Something went wrong");
      } finally {
        setMandalLoading(false);
      }
    };

    fetchMandals();
  }, [selectedConstituency]);

  /* ===============================
     HANDLERS
  ================================ */
  const handleConstituencyChange = (e) => {
    const id = e.target.value;
    setSelectedConstituency(id);
    localStorage.setItem("selectedConstituency", id);

    setMandals([]);
    setNewMandalName("");
    setEditMandals({});
    setEditedValues({});
  };

  const handleCreateMandal = async () => {
    if (!selectedConstituency || !newMandalName.trim()) {
      toast.warn("Please select a constituency and enter a mandal name");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await createMandal({
        constituency_id: selectedConstituency,
        mandal_name: newMandalName.trim(),
      });

      if (res.data?.success) {
        toast.success("Mandal created successfully");
        setNewMandalName("");

        const refresh = await getMandalsByConstituency(selectedConstituency);
        setMandals(refresh.data.data || []);
      } else {
        toast.error("Failed to create mandal");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating mandal");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditClick = (mandal) => {
    setEditMandals((p) => ({ ...p, [mandal._id]: true }));
    setEditedValues((p) => ({ ...p, [mandal._id]: mandal.mandal_name }));
  };

  const handleCancelEdit = (id) => {
    setEditMandals((p) => ({ ...p, [id]: false }));
  };

  const handleUpdateMandal = async (mandal) => {
    if (!editedValues[mandal._id]?.trim()) {
      toast.warn("Mandal name cannot be empty");
      return;
    }

    setUpdateLoadingId(mandal._id);
    try {
      const res = await updateMandal(mandal._id, {
        constituency_id: selectedConstituency,
        mandal_name: editedValues[mandal._id].trim(),
      });

      if (res.data?.success) {
        toast.success("Mandal updated successfully");

        const refresh = await getMandalsByConstituency(selectedConstituency);
        setMandals(refresh.data.data || []);

        setEditMandals((p) => ({ ...p, [mandal._id]: false }));
      } else {
        toast.error("Failed to update mandal");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating mandal");
    } finally {
      setUpdateLoadingId(null);
    }
  };

  const handleDeleteMandal = async (mandal) => {
    if (!window.confirm(`Delete "${mandal.mandal_name}"?`)) return;

    setDeleteLoadingId(mandal._id);
    try {
      const res = await deleteMandal(mandal._id);
      if (res.data?.success) {
        toast.success("Mandal deleted successfully");
        setMandals((p) => p.filter((m) => m._id !== mandal._id));
      } else {
        toast.error("Failed to delete mandal");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting mandal");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mandals</h1>

      {/* Dropdown + Create */}
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-2">
            Select Constituency:
          </label>
          <select
            value={selectedConstituency}
            onChange={handleConstituencyChange}
            className="border px-3 py-2 rounded w-60"
          >
            <option value="">-- Select Constituency --</option>
            {constituencies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.constituency_name}
              </option>
            ))}
          </select>
        </div>

        {selectedConstituency && (
          <div>
            <label className="block font-semibold mb-2">New Mandal:</label>
            <div className="flex gap-2">
              <input
                value={newMandalName}
                onChange={(e) => setNewMandalName(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <button
                onClick={handleCreateMandal}
                disabled={createLoading}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                {createLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}
      </div>

      {mandalLoading && <p>Loading mandals...</p>}
      {mandalError && <p className="text-red-500">{mandalError}</p>}

      {!mandalLoading && mandals.length > 0 && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Mandal</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {mandals.map((m, i) => (
              <tr key={m._id}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">
                  {editMandals[m._id] ? (
                    <input
                      value={editedValues[m._id]}
                      onChange={(e) =>
                        setEditedValues((p) => ({
                          ...p,
                          [m._id]: e.target.value,
                        }))
                      }
                      className="border px-2 py-1"
                    />
                  ) : (
                    m.mandal_name
                  )}
                </td>
                <td className="border p-2 flex gap-2">
                  {editMandals[m._id] ? (
                    <>
                      <button
                        onClick={() => handleUpdateMandal(m)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancelEdit(m._id)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(m)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMandal(m)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!mandalLoading && mandals.length === 0 && selectedConstituency && (
        <p className="mt-4 text-gray-600">
          No mandals found for this constituency.
        </p>
      )}
    </div>
  );
}
