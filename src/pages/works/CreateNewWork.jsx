import React, { useState,useRef } from "react";
import LocationDropdowns from "./LocationDropdowns";
import { toast } from "react-toastify";

import {createWork} from "../../api/worksApi"
export default function CreateWorkPage() {
    
const imageRef = useRef(null);
const videoRef = useRef(null);
const documentRef = useRef(null);

  const [selectedIds, setSelectedIds] = useState({
    constituency_id: "",
    mandal_id: "",
    village_id: "",
    habitation_id: "",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    responsibleDepartment: "",
    budgetAmount: "",
    fundSource: "",
    workimages: [],
    documents: [],
    videos: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [previews, setPreviews] = useState({
    workimages: [],
    videos: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({ ...prev, [name]: fileArray }));

      // Preview images/videos
      if (name === "workimages" || name === "videos") {
        const urls = fileArray.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => ({ ...prev, [name]: urls }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { constituency_id, mandal_id, village_id, habitation_id } = selectedIds;

  if (!constituency_id || !mandal_id || !village_id || !habitation_id) {
    alert("Please select all location fields!");
    toast.error("Please select all location fields!");
    return;
  }

  setLoading(true);
  try {
    const data = new FormData();
    Object.entries(selectedIds).forEach(([key, val]) =>
      data.append(key, val)
    );

    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file) => data.append(key, file));
      } else {
        data.append(key, formData[key] || "");
      }
    });

    await createWork(data)

    setMessage("Work created successfully!");
    toast.success("Work created successfully!");
    // clear file inputs (IMPORTANT)
if (imageRef.current) imageRef.current.value = "";
if (videoRef.current) videoRef.current.value = "";
if (documentRef.current) documentRef.current.value = "";


    setFormData({
      title: "",
      description: "",
      status: "",
      responsibleDepartment: "",
      budgetAmount: "",
      fundSource: "",
      workimages: [],
      documents: [],
      videos: [],
    });
    setPreviews({ workimages: [], videos: [] });

  } catch (err) {
    console.error(err);
    setMessage("Failed to create work.");
    toast.error("Failed to create work.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create New Work</h1>

      {/* Location Dropdowns */}
      <LocationDropdowns
        onChange={(ids) => setSelectedIds((prev) => ({ ...prev, ...ids }))}
      />

      {/* Form */}
      {selectedIds.habitation_id && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Title</label>
            <input
            
              type="text"
              name="title"
              placeholder="Enter work title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Enter work description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 h-28 resize-none"
            />
          </div>

          {/* Status & Responsible */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Status</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Responsible Department</label>
              <input
                type="text"
                name="responsibleDepartment"
                placeholder="Enter department"
                value={formData.responsibleDepartment}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Budget & Fund */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Budget Amount</label>
              <input
                type="number"
                name="budgetAmount"
                placeholder="Enter budget"
                value={formData.budgetAmount}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">Fund Source</label>
              <input
                type="text"
                name="fundSource"
                placeholder="Enter fund source"
                value={formData.fundSource}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Multimedia Uploads */}
 <div className="space-y-6">

  {/* Work Images */}
  <div>
    <label className="font-semibold text-gray-700 mb-2 block">Work Images</label>
    <input
     ref={imageRef}
      type="file"
      name="workimages"
      multiple
      accept="image/*"
      onChange={handleChange}
      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#34658C] transition-colors bg-gray-50 text-gray-600 text-sm"
    />
    {previews.workimages.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-3">
        {previews.workimages.map((src, idx) => (
          <div key={idx} className="relative w-[120px] h-[120px]">
            <img
              src={src}
              alt="preview"
              className="w-full h-full object-cover rounded-lg shadow-md border"
            />
            <button
              type="button"
              onClick={() => {
                setPreviews((prev) => ({
                  ...prev,
                  workimages: prev.workimages.filter((_, i) => i !== idx),
                }));
                setFormData((prev) => ({
                  ...prev,
                  workimages: prev.workimages.filter((_, i) => i !== idx),
                }));
              }}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Videos */}
  <div>
    <label className="font-semibold text-gray-700 mb-2 block">Videos</label>
    <input
      type="file"
       ref={videoRef}
      name="videos"
      multiple
      accept="video/*"
      onChange={handleChange}
      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#34658C] transition-colors bg-gray-50 text-gray-600 text-sm"
    />
    {previews.videos.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-3">
        {previews.videos.map((src, idx) => (
          <div key={idx} className="relative w-[160px] h-[120px]">
            <video
              src={src}
              className="w-full h-full rounded-lg shadow-md border object-cover"
              controls
            />
            <button
              type="button"
              onClick={() => {
                setPreviews((prev) => ({
                  ...prev,
                  videos: prev.videos.filter((_, i) => i !== idx),
                }));
                setFormData((prev) => ({
                  ...prev,
                  videos: prev.videos.filter((_, i) => i !== idx),
                }));
              }}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Documents */}
  <div>
    <label className="font-semibold text-gray-700 mb-2 block">Documents</label>
    <input
     ref={documentRef}
      type="file"
      name="documents"
      multiple
      onChange={handleChange}
      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#34658C] transition-colors bg-gray-50 text-gray-600 text-sm"
    />
    {formData.documents.length > 0 && (
      <ul className="mt-2 space-y-1">
        {formData.documents.map((file, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between bg-gray-100 p-2 rounded"
          >
            <span className="truncate">{file.name}</span>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  documents: prev.documents.filter((_, i) => i !== idx),
                }))
              }
              className="text-red-600 font-bold hover:text-red-800"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
          >
            {loading ? "Creating..." : "Create Work"}
          </button>
        </form>
      )}
    </div>
  );
}
