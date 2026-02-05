import React, { useState } from "react";
import { toast } from "react-toastify";
import { createConstituencies } from "./Constituenciess";

import {
  getStates,
  getDistricts,
  getConstituencies,
} from "./locationData";

export default function AddConstituency() {
  const [formData, setFormData] = useState({
    constituency_name: "",
    district: "",
    state: "",
    country: "India",
  });

  const [loading, setLoading] = useState(false);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData({
      ...formData,
      state,
      district: "",
      constituency_name: "",
    });
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setFormData({
      ...formData,
      district,
      constituency_name: "",
    });
  };

  const handleConstituencyChange = (e) => {
    setFormData({
      ...formData,
      constituency_name: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.state ||
      !formData.district ||
      !formData.constituency_name
    ) {
      toast.warn("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await createConstituencies(formData);

      if (res.data?.success) {
        toast.success(res.data.message || "Constituency added successfully");
        setFormData({
          constituency_name: "",
          district: "",
          state: "",
          country: "India",
        });
      } else {
        toast.error(res.data?.message || "Failed to add constituency");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Server error. Please try again"
      );
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

        {/* Country */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Country
          </label>
          <input
            value="India"
            readOnly
            className="border p-3 rounded w-full bg-gray-100"
          />
        </div>

        {/* State */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            State
          </label>
          <select
            value={formData.state}
            onChange={handleStateChange}
            className="border p-3 rounded w-full"
          >
            <option value="">Select State</option>
            {getStates()
              .filter((s) => s !== "all")
              .map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Parliament
          </label>
          <select
            value={formData.district}
            onChange={handleDistrictChange}
            disabled={!formData.state}
            className="border p-3 rounded w-full disabled:bg-gray-100"
          >
            <option value="">Select Parliament</option>
            {getDistricts(formData.state)
              .filter((d) => d !== "all")
              .map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
          </select>
        </div>

        {/* Constituency */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Constituency
          </label>
          <select
            value={formData.constituency_name}
            onChange={handleConstituencyChange}
            disabled={!formData.district}
            className="border p-3 rounded w-full disabled:bg-gray-100"
          >
            <option value="">Select Constituency</option>
            {getConstituencies(
              formData.state,
              formData.district
            ).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-[#A2CD48] text-white py-3 rounded font-semibold ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-[#92c148]"
          }`}
        >
          {loading ? "Adding..." : "Add Constituency"}
        </button>
      </form>
    </div>
  );
}