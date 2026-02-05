import React, { useState } from "react";
import { createNews } from "../../api/newsApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateNews = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    headlines: "",
    newsdate: "",
    newsdescription: "",
    newsimage: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "newsimage") {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, newsimage: file });
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const { category, headlines, newsdate, newsdescription, newsimage } = formData;
    if (!category || !headlines || !newsdate || !newsdescription || !newsimage) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("category", category);
      data.append("headlines", headlines);
      data.append("newsdate", newsdate);
      data.append("newsdescription", newsdescription);
      data.append("newsimage", newsimage);

      await createNews(data);

      toast.success("News Created Successfully!");
      navigate("/News/list");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Create News</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Image Upload */}
      <div className="mb-4">
  {/* Preview Image */}
  {previewImage && (
    <div className="relative w-full h-64 mb-2 rounded overflow-hidden border border-gray-300 shadow-sm">
      <img
        src={previewImage}
        alt="Preview"
        className="w-full h-full object-cover"
      />
    </div>
  )}

  {/* File Input */}
  <label className="flex items-center justify-center border border-gray-300 rounded cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
    <span className="text-gray-600 font-medium">Choose Image</span>
    <input
      type="file"
      name="newsimage"
      onChange={handleChange}
      accept="image/*"
      required
      className="hidden"
    />
  </label>

  <p className="text-sm text-gray-500 mt-1">
    Supported formats: JPG, PNG, GIF. Max size: 5MB.
  </p>
</div>


        {/* Category */}
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        {/* Headlines */}
        <input
          type="text"
          name="headlines"
          placeholder="Headlines"
          value={formData.headlines}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        {/* Date */}
        <input
          type="date"
          name="newsdate"
          value={formData.newsdate}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        {/* Description */}
        <textarea
          name="newsdescription"
          placeholder="Description"
          rows="5"
          value={formData.newsdescription}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create News"}
        </button>
      </form>
    </div>
  );
};

export default CreateNews;
