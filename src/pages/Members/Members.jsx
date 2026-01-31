import React, { useEffect, useState } from "react";
import { getAllMembers, updateMemberStatus } from "../../api/membersApi";
import MemberDetailModal from "./MemberDetailModal";

const STATUS_OPTIONS = ["active", "inactive", "blocked"];
const APPROVED_OPTIONS = [
  { label: "Approved", value: "true" },
  { label: "Not Approved", value: "false" },
];

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvedFilter, setApprovedFilter] = useState("true");
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [viewMember, setViewMember] = useState(null);

  /* ================= FETCH MEMBERS ================= */
  const fetchMembers = async (approved) => {
    setLoading(true);
    setMembers([]);

    try {
      const res = await getAllMembers(approved);
      if (res.data.success) {
        setMembers(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(approvedFilter);
  }, [approvedFilter]);

  /* ================= UPDATE MEMBER ================= */
  const handleUpdateMember = async (id, payload) => {
    setStatusLoadingId(id);
    try {
      await updateMemberStatus(id, payload);
      setMembers((prev) =>
        prev.map((m) => (m._id === id ? { ...m, ...payload } : m))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setStatusLoadingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Volunteers</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setApprovedFilter("true")}
          className={`px-4 py-2 rounded font-medium ${
            approvedFilter === "true"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Approved
        </button>

        <button
          onClick={() => setApprovedFilter("false")}
          className={`px-4 py-2 rounded font-medium ${
            approvedFilter === "false"
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Not Approved
        </button>
      </div>

      {loading && <p className="text-blue-600 font-medium">Loading members...</p>}

      {!loading && members.length === 0 && (
        <p className="text-gray-500">No members found.</p>
      )}

      {!loading && members.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">S.No</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Approved</th>
                <th className="border px-4 py-2">View</th>
              </tr>
            </thead>

            <tbody>
              {members.map((m, i) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{i + 1}</td>
                  <td className="border px-4 py-2 font-medium">
                    {m.full_name}
                  </td>
                  <td className="border px-4 py-2">{m.email}</td>
                  <td className="border px-4 py-2">{m.phone}</td>

                  {/* STATUS */}
                  <td className="border px-4 py-2">
                    <select
                      value={m.status}
                      disabled={statusLoadingId === m._id}
                      onChange={(e) =>
                        handleUpdateMember(m._id, {
                          status: e.target.value,
                          approved: m.approved,
                        })
                      }
                      className={`border px-2 py-1 rounded w-full
                        ${m.status === "active" ? "bg-green-100" : ""}
                        ${m.status === "inactive" ? "bg-yellow-100" : ""}
                        ${m.status === "blocked" ? "bg-red-100" : ""}
                      `}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* APPROVED */}
                  <td className="border px-4 py-2">
                    <select
                      value={String(m.approved)}
                      disabled={statusLoadingId === m._id}
                      onChange={(e) =>
                        handleUpdateMember(m._id, {
                          status: m.status,
                          approved: e.target.value,
                        })
                      }
                      className={`border px-2 py-1 rounded w-full
                        ${m.approved ? "bg-green-100" : "bg-red-100"}
                      `}
                    >
                      {APPROVED_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>

                    {statusLoadingId === m._id && (
                      <span className="ml-2 text-xs text-blue-600">
                        Updating...
                      </span>
                    )}
                  </td>

                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => setViewMember(m)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MemberDetailModal
        member={viewMember}
        onClose={() => setViewMember(null)}
      />
    </div>
  );
};

export default Members;
