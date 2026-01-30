import React, { useState } from "react";
import { toast } from "react-toastify";
import {createConstituencies} from "./Constituenciess"
export default function AddConstituency() {
  const [formData, setFormData] = useState({
    constituency_name: "",
    district: "",
    state: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔔 Validation Toast
    if (
      !formData.constituency_name.trim() ||
      !formData.district.trim() ||
      !formData.state.trim() ||
      !formData.country.trim()
    ) {
      toast.warn("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await createConstituencies(formData)

      // ✅ Success Toast (from backend)
      if (res.data?.success) {
        toast.success(res.data.message || "Constituency added successfully");
        setFormData({
          constituency_name: "",
          district: "",
          state: "",
          country: "",
        });
      } else {
        // ❌ API responded but failed
        toast.error(res.data?.message || "Failed to add constituency");
      }
    } catch (err) {
      // ❌ Error Toast (backend or network)
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Server error. Please try again";

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Add Constituency
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Constituency Name */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Constituency Name
          </label>
          <input
            name="constituency_name"
            value={formData.constituency_name}
            onChange={handleChange}
            placeholder="Enter constituency name"
            className="border p-3 rounded w-full focus:ring-2 focus:ring-[#A2CD48]"
          />
        </div>

        {/* District */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            District
          </label>
          <input
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="Enter district"
            className="border p-3 rounded w-full focus:ring-2 focus:ring-[#A2CD48]"
          />
        </div>

        {/* State */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            State
          </label>
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter state"
            className="border p-3 rounded w-full focus:ring-2 focus:ring-[#A2CD48]"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Country
          </label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter country"
            className="border p-3 rounded w-full focus:ring-2 focus:ring-[#A2CD48]"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#A2CD48] text-white py-3 rounded font-semibold transition ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#92c148]"
          }`}
        >
          {loading ? "Adding..." : "Add Constituency"}
        </button>
      </form>
    </div>
  );
}
