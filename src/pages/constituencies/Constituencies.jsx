import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getStates,
  getDistricts,
  getConstituencies,
} from "./locationData";

import {getConstituenciesAPI,getoneConstituencies,updateConstituencies,deleteConstituencies} from "./Constituenciess.js"
export default function Constituencies() {
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);

  const [formData, setFormData] = useState({
    constituency_name: "",
    state: "",
    district: "",
    country: "",
  });

  // ---------------- FETCH LIST ----------------
  useEffect(() => {
    const getConstituencies = async () => {
      try {
        const res = await getConstituenciesAPI()

        if (res.data.success) {
          setConstituencies(res.data.data);
        } else {
          toast.error(res.data.message || "Failed to fetch constituencies");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getConstituencies();
  }, []);

  // ---------------- VIEW ----------------
  const handleView = async (id) => {
    if (selectedConstituency?._id === id) {
      setSelectedConstituency(null);
      setIsEditing(false);
      return;
    }

    setViewLoading(true);

    try {
      const res = await getoneConstituencies(id)

      if (res.data.success) {
        setSelectedConstituency(res.data.data);
        setFormData({
          constituency_name: res.data.data.constituency_name,
          state: res.data.data.state,
          district: res.data.data.district,
          country: res.data.data.country,
        });
      } else {
        toast.error(res.data.message || "Failed to fetch details");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setViewLoading(false);
    }
  };

  // ---------------- FORM CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- UPDATE ----------------
  const handleUpdate = async () => {
    if (!selectedConstituency?._id) return;

    setUpdateLoading(true);
    try {
      const res = await updateConstituencies(selectedConstituency._id,formData)

      if (res.data.success) {
        toast.success(res.data.message || "Constituency updated successfully");

        setSelectedConstituency((prev) => ({ ...prev, ...formData }));
        setConstituencies((prev) =>
          prev.map((c) =>
            c._id === selectedConstituency._id ? { ...c, ...formData } : c
          )
        );

        setIsEditing(false);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this constituency?"))
      return;

    try {
      const res = await deleteConstituencies(id)

      if (res.data.success) {
        toast.success(res.data.message || "Constituency deleted successfully");

        setConstituencies((prev) => prev.filter((c) => c._id !== id));

        if (selectedConstituency?._id === id) {
          setSelectedConstituency(null);
          setIsEditing(false);
        }
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Constituencies</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">S.No</th>
            <th className="border p-2">Constituency</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {constituencies.map((item, index) => {
            const isSelected = selectedConstituency?._id === item._id;

            return (
              <React.Fragment key={item._id}>
                <tr className={isSelected ? "bg-blue-100" : ""}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{item.constituency_name}</td>
                  <td className="border p-2 flex gap-2">
                    <button
                      onClick={() => handleView(item._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      {viewLoading && isSelected ? "Loading..." : isSelected ? "Hide" : "View"}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                {isSelected && (
                  <tr>
                    <td colSpan={3} className="p-4 border bg-gray-50">
                      {!isEditing ? (
                        <>
                          <p><b>Constituency_Name:</b> {selectedConstituency.constituency_name}</p>
                          <p><b>Parliament:</b> {selectedConstituency.district}</p>
                          <p><b>State:</b> {selectedConstituency.state}</p>
                          <p><b>Country:</b> {selectedConstituency.country}</p>

                          <button
                            onClick={() => setIsEditing(true)}
                            className="mt-3 bg-green-600 text-white px-4 py-1 rounded"
                          >
                            Update
                          </button>
                        </>
                      ) : (
                        <>
{/* Country (readonly) */}
<div className="mb-2 flex items-center">
  <label className="w-40 font-medium">Country:</label>
  <input
    value={formData.country}
    readOnly
    className="border p-1 w-60 bg-gray-100"
  />
</div>

{/* State */}
<div className="mb-2 flex items-center">
  <label className="w-40 font-medium">State:</label>
  <select
    value={formData.state}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        state: e.target.value,
      }))
    }
    className="border p-1 w-60"
  >
    <option value="">Select State</option>
    {getStates().filter(s => s !== "all").map((s) => (
      <option key={s} value={s}>{s}</option>
    ))}
  </select>
</div>

{/* District */}
<div className="mb-2 flex items-center">
  <label className="w-40 font-medium">Parliament:</label>
  <select
    value={formData.district}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        district: e.target.value,
      }))
    }
    className="border p-1 w-60"
  >
    <option value="">Select District</option>
    {getDistricts(formData.state)
      .filter(d => d !== "all")
      .map((d) => (
        <option key={d} value={d}>{d}</option>
      ))}
  </select>
</div>

{/* Constituency */}
<div className="mb-2 flex items-center">
  <label className="w-40 font-medium">Constituency:</label>
  <select
    value={formData.constituency_name}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        constituency_name: e.target.value,
      }))
    }
    className="border p-1 w-60"
  >
    <option value="">Select Constituency</option>
    {getConstituencies(formData.state, formData.district).map((c) => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>
</div>
                          <button
                            onClick={handleUpdate}
                            disabled={updateLoading}
                            className="bg-blue-600 text-white px-4 py-1 rounded mr-2"
                          >
                            {updateLoading ? "Saving..." : "Save"}
                          </button>

                          <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-400 text-white px-4 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
