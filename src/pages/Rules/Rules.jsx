import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function Rules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // track which row is editing
  const [editValues, setEditValues] = useState({}); // store temporary edit data

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await axiosInstance.get(
          "/work_tracking/auth/admin/get-all-rules"
        );
        if (res.data?.success) {
          setRules(res.data.data || []);
        } else {
          setError(res.data?.message || "Failed to fetch rules");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  const handleEdit = (rule) => {
    setEditingId(rule._id);
    setEditValues({
      upload_type: rule.upload_type,
      maxFileSizeMB: rule.maxFileSizeMB,
      maxFiles: rule.maxFiles,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

const handleSave = async (id) => {
  try {
    const res = await axiosInstance.patch(`/work_tracking/auth/admin/update-rule/${id}`, editValues);
    if (res.data?.success) {
      setRules((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...editValues } : r))
      );
      toast.success(res.data?.message || "Rule updated successfully");
    }
    setEditingId(null);
    setEditValues({});
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to update rule");
  }
};


 const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this rule?")) return;

  try {
    const res = await axiosInstance.delete(`/work_tracking/auth/admin/delete-rule/${id}`);
    if (res.data?.success) {
      // Remove rule from state
      setRules((prev) => prev.filter((r) => r._id !== id));
      // Show success toast
      toast.success(res.data?.message || "Rule deleted successfully");
    }
  } catch (err) {
    console.error(err);
    // Show error toast
    toast.error(err.response?.data?.message || "Failed to delete rule");
  }
};

  if (loading) return <div className="p-4">Loading rules...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Upload Rules</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium border">Upload Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium border">Max File Size (MB)</th>
              <th className="px-4 py-3 text-left text-sm font-medium border">Max Files</th>
              <th className="px-4 py-3 text-left text-sm font-medium border">Action</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  No rules found
                </td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr key={rule._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">
                    {editingId === rule._id ? (
                      <input
                        type="text"
                        value={editValues.upload_type}
                        disabled
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, upload_type: e.target.value }))
                        }
                        className=""
                      />
                    ) : (
                      rule.upload_type
                    )}
                  </td>
                  <td className="px-4 py-3 border">
                    {editingId === rule._id ? (
                      <input
                        type="number"
                        value={editValues.maxFileSizeMB}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, maxFileSizeMB: e.target.value }))
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      rule.maxFileSizeMB
                    )}
                  </td>
                  <td className="px-4 py-3 border">
                    {editingId === rule._id ? (
                      <input
                        type="number"
                        value={editValues.maxFiles}
                        onChange={(e) =>
                          setEditValues((prev) => ({ ...prev, maxFiles: e.target.value }))
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      rule.maxFiles
                    )}
                  </td>
                  <td className="px-4 py-3 border flex gap-2">
                    {editingId === rule._id ? (
                      <>
                        <button
                          onClick={() => handleSave(rule._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(rule)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rule._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
