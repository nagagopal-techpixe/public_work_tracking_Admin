import WorkCard from "./WorkCard";
import { useWorks } from "./useWorks";
import { useNavigate } from "react-router-dom";

const Works = () => {
  const navigate = useNavigate();

  const {
    works,
    loading,
    page,
    totalPages,
    setPage,
    filterVerified,
    setFilterVerified,
    handleDeleteWork,
    handleToggleVerified,
  } = useWorks();

  if (loading) {
    return <div className="text-center py-10">Loading works...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Filter Dropdown */}
      <div className="flex justify-center mb-6">
        <select
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Cards */}
      {works.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {works.map((work) => (
            <WorkCard
              key={work._id}
              work={work}
              onView={() => navigate(`/admin/works/${work._id}`)}
              onDelete={() => handleDeleteWork(work._id)}
              onUpdateVerified={(id, status) =>
                handleToggleVerified(id, status)
              }
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-20 text-lg">
          No works found
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Works;
