import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { getAllConstituencies,getMandalsByConstituency,getVillagesByMandal ,createVillage,updateVillage,deletevillage} from "../../api/villageApi";

export default function Villages() {
  const [constituencies, setConstituencies] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedMandal, setSelectedMandal] = useState("");

  const [loading, setLoading] = useState(true);
  const [mandalLoading, setMandalLoading] = useState(false);
  const [villageLoading, setVillageLoading] = useState(false);

  const [newVillageName, setNewVillageName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoadingId, setUpdateLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const [editVillages, setEditVillages] = useState({});
  const [editedValues, setEditedValues] = useState({});


    //  LOAD SAVED DROPDOWN VALUES
  useEffect(() => {
    const savedConstituency = localStorage.getItem("selectedConstituency");
    const savedMandal = localStorage.getItem("selectedMandal");

    if (savedConstituency) setSelectedConstituency(savedConstituency);
    if (savedMandal) setSelectedMandal(savedMandal);
  }, []);
const handleEditClick = (v) => {
  setEditVillages((prev) => ({ ...prev, [v._id]: true }));
  setEditedValues((prev) => ({ ...prev, [v._id]: v.village_name }));
};
    const handleCancelEdit = (id) => {
  // Hide the edit input
  setEditVillages((prev) => ({ ...prev, [id]: false }));

  // Optionally, reset the edited value to the original village name
  const originalVillage = villages.find((v) => v._id === id);
  if (originalVillage) {
    setEditedValues((prev) => ({ ...prev, [id]: originalVillage.village_name }));
  }
};

    //  FETCH CONSTITUENCIES
  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const res = await getAllConstituencies();
        if (res.data.success) {
          setConstituencies(res.data.data);
        } else {
          toast.error(res.data.message || "Failed to load constituencies");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchConstituencies();
  }, []);

    //  FETCH MANDALS
  useEffect(() => {
    if (!selectedConstituency) {
      setMandals([]);
      return;
    }

    const fetchMandals = async () => {
      setMandalLoading(true);
      try {
        const res = await getMandalsByConstituency(selectedConstituency)

        if (res.data.success) {
          setMandals(res.data.data || []);
        } else {
          toast.error(res.data.message || "Failed to load mandals");
          setMandals([]);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch mandals");
        setMandals([]);
      } finally {
        setMandalLoading(false);
      }
    };

    fetchMandals();
  }, [selectedConstituency]);

    //  FETCH VILLAGES
  useEffect(() => {
    if (!selectedMandal) return;

    const fetchVillages = async () => {
      setVillageLoading(true);
      try {
        const res = await getVillagesByMandal(selectedMandal);

        if (res.data.success) {
          setVillages(res.data.data || []);
        } else {
          toast.error(res.data.message || "Failed to load villages");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch villages");
      } finally {
        setVillageLoading(false);
      }
    };

    fetchVillages();
  }, [selectedMandal]);

    //  HANDLERS
  const handleConstituencyChange = (e) => {
    const id = e.target.value;
    setSelectedConstituency(id);
    localStorage.setItem("selectedConstituency", id);

    setSelectedMandal("");
    localStorage.removeItem("selectedMandal");

    setMandals([]);
    setVillages([]);
  };

  const handleMandalChange = (e) => {
    const id = e.target.value;
    setSelectedMandal(id);
    localStorage.setItem("selectedMandal", id);
    setVillages([]);
  };


    //  CREATE VILLAGE
  const handleCreateVillage = async () => {
    if (!selectedMandal || !newVillageName.trim()) {
      toast.warn("Please enter village name");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await createVillage(selectedMandal, newVillageName);

      if (res.data.success) {
        toast.success(res.data.message || "Village created successfully");
        setNewVillageName("");

        const refresh = await getVillagesByMandal(selectedMandal)
        setVillages(refresh.data.data || []);
      } else {
        toast.error(res.data.message || "Failed to create village");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Create failed");
    } finally {
      setCreateLoading(false);
    }
  };

    //  UPDATE VILLAGE
  const handleUpdateVillage = async (v) => {
    if (!editedValues[v._id]?.trim()) {
      toast.warn("Village name cannot be empty");
      return;
    }

    setUpdateLoadingId(v._id);
    try {
    const res = await updateVillage(
  v._id,
  selectedMandal,
  editedValues[v._id]
);


      if (res.data.success) {
        toast.success(res.data.message || "Village updated successfully");

        const refresh = await getVillagesByMandal(selectedMandal)
        setVillages(refresh.data.data || []);
        setEditVillages((p) => ({ ...p, [v._id]: false }));
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoadingId(null);
    }
  };

    //  DELETE VILLAGE
  const handleDeleteVillage = async (v) => {
    if (!window.confirm(`Delete "${v.village_name}"?`)) return;

    setDeleteLoadingId(v._id);
    try {
      const res = await deletevillage(v)
      if (res.data.success) {
        toast.success(res.data.message || "Village deleted successfully");
        setVillages((p) => p.filter((x) => x._id !== v._id));
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
     <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Villages</h1>

     <div className="flex gap-4 mb-6 items-center">
  {/* Constituency Dropdown */}
  <label className="font-medium">Constituency:</label>
  <select
    value={selectedConstituency}
    onChange={handleConstituencyChange}
    className="border px-3 py-2 rounded"
  >
    <option value="">Select Constituency</option>
    {constituencies.map((c) => (
      <option key={c._id} value={c._id}>
        {c.constituency_name}
      </option>
    ))}
  </select>

  {/* Mandal Dropdown */}
  <label className="font-medium">Mandal:</label>
  <select
    value={selectedMandal}
    onChange={handleMandalChange}
    disabled={!selectedConstituency || mandalLoading || mandals.length === 0}
    className="border px-3 py-2 rounded"
  >
    <option value="">
      {mandalLoading
        ? "Loading mandals..."
        : mandals.length === 0
        ? "No mandals found"
        : "Select Mandal"}
    </option>
    {mandals.map((m) => (
      <option key={m._id} value={m._id}>
        {m.mandal_name}
      </option>
    ))}
  </select>

  {/* New Village Input + Button */}
  {selectedMandal && (
    <>
      <label className="font-semibold">New Village:</label>
      <input
        value={newVillageName}
        onChange={(e) => setNewVillageName(e.target.value)}
        placeholder="Village name"
        className="border px-2 py-1 rounded w-48"
      />
      <button
        onClick={handleCreateVillage}
        disabled={createLoading}
        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
      >
        {createLoading ? "Creating..." : "Create"}
      </button>
    </>
  )}
</div>


      {/* Table */}
      {!villageLoading && villages.length > 0 && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Village</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {villages.map((v, i) => (
              <tr key={v._id}>
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">
                  {editVillages[v._id] ? (
                    <input
                      value={editedValues[v._id]}
                      onChange={(e) =>
                        setEditedValues((p) => ({
                          ...p,
                          [v._id]: e.target.value,
                        }))
                      }
                      className="border px-2 py-1"
                    />
                  ) : (
                    v.village_name
                  )}
                </td>
                <td className="border p-2 flex gap-2">
                  {editVillages[v._id] ? (
                    <>
                      <button
                        onClick={() => handleUpdateVillage(v)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancelEdit(v._id)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(v)}
className="bg-green-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-green-700"

                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVillage(v)}
                       className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-700"

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

      {!villageLoading && selectedMandal && villages.length === 0 && (
        <p>No villages found.</p>
      )}
    </div>
  );
}
