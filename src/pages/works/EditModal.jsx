import React from "react";

const EditModal = ({
  showModal,
  onClose,
  editWork,
  setEditWork,
  onSave,
  children, // 👈 IMPORTANT
}) => {
  if (!showModal) return null;

  return (
 <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
{/* <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"> */}

      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">

        {/* Modal Title */}
        <h3 className="text-lg font-semibold mb-2">
          {showModal === "titleDesc" && "Edit Title & Description"}
          {showModal === "status" && "Edit Status & Verified"}
          {showModal === "financial" && "Edit Financial Info"}
          {showModal === "location" && "Edit Location"}
        </h3>

        {/* ---------- TITLE & DESCRIPTION ---------- */}
        {showModal === "titleDesc" && (
          <>
            <input
              type="text"
              placeholder="Title"
              value={editWork.title || ""}
              onChange={e =>
                setEditWork({ ...editWork, title: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />

            <textarea
              placeholder="Description"
              value={editWork.description || ""}
              onChange={e =>
                setEditWork({ ...editWork, description: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </>
        )}

        {/* ---------- STATUS ---------- */}
       {/* ---------- STATUS ---------- */}
{showModal === "status" && (
  <>
    <select
      value={editWork.status || ""}
      onChange={e =>
        setEditWork({ ...editWork, status: e.target.value })
      }
      className="w-full border rounded px-3 py-2 mb-2"
    >
      <option value="planned">Planned</option>
      <option value="in_progress">In Progress</option>
      <option value="completed">Approved</option>
    </select>

    <select
      value={editWork.verified === undefined ? "" : editWork.verified ? "verified" : "unverified"}
      onChange={e =>
        setEditWork({ ...editWork, verified: e.target.value === "verified" })
      }
      className="w-full border rounded px-3 py-2"
    >
      <option value="">Select Verification</option>
      <option value="verified">Verified</option>
      <option value="unverified">Unverified</option>
    </select>
  </>
)}


        {/* ---------- FINANCIAL ---------- */}
        {showModal === "financial" && (
          <>
            <input
              type="number"
              placeholder="Budget Amount"
              value={editWork.budgetAmount || ""}
              onChange={e =>
                setEditWork({
                  ...editWork,
                  budgetAmount: Number(e.target.value),
                })
              }
              className="w-full border rounded px-3 py-2"
            />

            <input
              type="text"
              placeholder="Fund Source"
              value={editWork.fundSource || ""}
              onChange={e =>
                setEditWork({ ...editWork, fundSource: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </>
        )}

        {/* ---------- LOCATION (FROM SEPARATE FILE) ---------- */}
        {showModal === "location" && children}

        {/* ---------- ACTIONS ---------- */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
