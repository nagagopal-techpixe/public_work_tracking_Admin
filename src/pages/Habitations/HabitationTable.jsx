export default function HabitationTable({
  habitations,
  editRowId,
  editValues,
  setEditRowId,
  setEditValues,
  updateLoadingId,
  deleteLoadingId,
  onUpdate,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">S.No</th>
            <th className="border px-4 py-2">Habitation Name</th>
            <th className="border px-4 py-2">Ward Number</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {habitations.map((h, index) => (
            <tr key={h._id}>
              <td className="border px-4 py-2">{index + 1}</td>

              <td className="border px-4 py-2">
                {editRowId === h._id ? (
                  <input
                    value={editValues.habitation_name}
                    onChange={(e) =>
                      setEditValues({ ...editValues, habitation_name: e.target.value })
                    }
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  h.habitation_name
                )}
              </td>

              <td className="border px-4 py-2">
                {editRowId === h._id ? (
                  <input
                    value={editValues.ward_number}
                    onChange={(e) =>
                      setEditValues({ ...editValues, ward_number: e.target.value })
                    }
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  h.ward_number
                )}
              </td>

              <td className="border px-4 py-2 flex gap-2">
                {editRowId === h._id ? (
                  <>
                    <button
                      onClick={() => onUpdate(h._id)}
                      disabled={updateLoadingId === h._id}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditRowId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditRowId(h._id);
                        setEditValues({
                          habitation_name: h.habitation_name,
                          ward_number: h.ward_number,
                        });
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(h._id)}
                      disabled={deleteLoadingId === h._id}
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
    </div>
  );
}
