import React, { useState } from "react";
import { toast } from "react-toastify";
import {addMember} from "../../api/membersApi";

const AddMember = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [aadharCard, setAadharCard] = useState("");
  const [aadharImages, setAadharImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file input
  const handleFileChange = (e) => {
    setAadharImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !password || !aadharCard) {
      toast.error("Please fill all required fields");
      return;
    }

    const token = sessionStorage.getItem("token");

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("aadhar_card_number", aadharCard);

    aadharImages.forEach((file) => formData.append("aadharimages", file));

    setLoading(true);
    try {
      const res = await addMember(formData);

      if (res.data.success) {
        toast.success(res.data.message || "Member added successfully!");
        toast.info("Confirmation sent to the Volunteer. They should check their email or phone.");
        setFullName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setAadharCard("");
        setAadharImages([]);
      } else {
        toast.error(res.data.message || "Failed to add member");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-[rgba(234,88,12,1)]">
          Add New Volunteers
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Phone</label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">
              Aadhar Card Number
            </label>
            <input
              type="text"
              value={aadharCard}
              onChange={(e) => setAadharCard(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              required
            />
          </div>

          <div className="mb-4">
  <label className="block mb-2 text-sm font-medium text-gray-700">
    Aadhar Image
  </label>

  {/* Styled File Input */}
  <label
    htmlFor="aadharInput"
    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#34658C] transition-colors bg-gray-50 text-gray-600 text-sm"
  >
    Select Images
  </label>
  <input
    id="aadharInput"
    type="file"
    multiple
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />

  {/* Preview Selected Images */}
  {aadharImages.length > 0 && (
    <div className="mt-3 grid grid-cols-4 gap-2">
      {aadharImages.map((file, index) => (
        <div
          key={index}
          className="relative border rounded overflow-hidden w-full h-24 flex items-center justify-center bg-gray-50"
        >
          {/* Image Preview */}
          <img
            src={URL.createObjectURL(file)}
            alt={`aadhar-${index}`}
            className="object-cover w-full h-full"
          />

          {/* Remove Button */}
          <button
            type="button"
            onClick={() =>
              setAadharImages((prev) => prev.filter((_, i) => i !== index))
            }
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A2CD48] text-white font-semibold p-3 rounded text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Member"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMember;
