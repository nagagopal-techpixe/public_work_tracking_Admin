import { useState } from "react";

const STATUS_COLORS = {
  planned: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const WorkCard = ({ work, onView, onDelete, onUpdateVerified }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition flex flex-col">
      <img
        src={
          work.images?.length
            ? work.images[0]
            : "https://via.placeholder.com/400x250?text=No+Image"
        }
        alt={work.title}
        className="h-56 w-full object-cover rounded-t-2xl"
      />

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between mb-3">
          <h3 className="font-semibold text-xl line-clamp-2">{work.title}</h3>
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold ${
              STATUS_COLORS[work.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {work.status?.replace("_", " ")}
          </span>
        </div>

        <p className={`text-sm text-gray-600 ${showMore ? "" : "line-clamp-1"}`}>
          {work.description || "No description available"}
        </p>

        {work.description?.split(" ").length > 20 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-blue-500 text-sm mt-1"
          >
            {showMore ? "Show less" : "Read more"}
          </button>
        )}

        <div className="flex justify-between items-center mt-5">
          <div className="flex gap-3">
            <button
              onClick={onView}
              className="px-4 py-2 text-sm text-white bg-[#34658C] rounded-lg"
            >
              View
            </button>

            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg"
            >
              Delete
            </button>
          </div>

          {/* Dropdown for Verified */}
          <select
            value={work.verified ? "verified" : "unverified"}
            onChange={(e) => onUpdateVerified(work._id, e.target.value === "verified")}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default WorkCard;
