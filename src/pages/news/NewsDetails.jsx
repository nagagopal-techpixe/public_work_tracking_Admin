import React, { useEffect, useState } from "react";
import { getNewsById, updateNews } from "../../api/newsApi";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "react-toastify";

const NewsDetails = () => {
  const { id: newsId } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  // Edit state
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (newsId) fetchNews();
  }, [newsId]);

  // Fetch news by ID
  const fetchNews = async () => {
    try {
      const res = await getNewsById(newsId);
      setNews(res.data.news);
      setFormData(res.data.news);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "newsimage") {
      const file = files[0];
      setFormData({ ...formData, newsimage: file });
      setPreviewImage(URL.createObjectURL(file));
      setEditField("newsimage"); // show save/cancel buttons
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Save single field
  const handleSave = async () => {
    try {
      const data = new FormData();

      // Text fields
      data.append("category", formData.category || "");
      data.append("headlines", formData.headlines || "");
      data.append("newsdate", formData.newsdate || "");
      data.append("newsdescription", formData.newsdescription || "");

      // Image only if new file selected
      if (formData.newsimage instanceof File) {
        data.append("newsimage", formData.newsimage);
      }

      await updateNews(newsId, data);

      toast.success("Updated Successfully");
      setPreviewImage(null);
      setEditField(null);
      fetchNews(); // reload latest data
    } catch (err) {
      console.error(err);
      toast.error("Update Failed");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditField(null);
    setFormData({ ...news, newsimage: null });
    setPreviewImage(null);
  };

  if (!newsId) return <p className="text-center p-10">No News Selected</p>;
  if (loading) return <p className="text-center p-10">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-12">

      {/* Back */}
      <button
        onClick={() => navigate("/News/list")}
        className="text-orange-600 mb-6 font-semibold"
      >
        ← Back to News
      </button>

      {/* Image */}
      {news?.newsimage && (
        <div className="relative mb-6">
          <img
            src={previewImage ? previewImage : `${news.newsimage}?t=${Date.now()}`}
            alt="news"
            className="w-full h-96 object-cover rounded-xl"
          />

          {/* Image edit buttons */}
          <div className="absolute top-3 right-3 flex gap-1">
            {editField === "newsimage" ? (
              <>
                <Check
                  size={18}
                  className="text-green-600 cursor-pointer"
                  onClick={handleSave}
                />
                <X
                  size={18}
                  className="text-red-600 cursor-pointer"
                  onClick={handleCancel}
                />
              </>
            ) : (
              <label className="cursor-pointer bg-white p-2 rounded-full shadow">
                <Pencil size={16} />
                <input
                  type="file"
                  name="newsimage"
                  hidden
                  onChange={handleChange}
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        {editField === "headlines" ? (
          <input
            type="text"
            name="headlines"
            value={formData.headlines || ""}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        ) : (
          <h1 className="text-3xl font-bold flex-1">{news.headlines}</h1>
        )}
        <EditButtons field="headlines" />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-4 text-gray-500">
        {/* Category */}
        {editField === "category" ? (
          <input
            type="text"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            className="border p-1 rounded"
          />
        ) : (
          <span>{news.category}</span>
        )}
        <EditButtons field="category" />

        •

        {/* Date */}
        {editField === "newsdate" ? (
          <input
            type="date"
            name="newsdate"
            value={formData.newsdate?.split("T")[0] || ""}
            onChange={handleChange}
            className="border p-1 rounded"
          />
        ) : (
          <span>{new Date(news.newsdate).toLocaleDateString()}</span>
        )}
        <EditButtons field="newsdate" />
      </div>

      {/* Description */}
      <div className="flex gap-2 items-start">
        {editField === "newsdescription" ? (
          <textarea
            name="newsdescription"
            value={formData.newsdescription || ""}
            onChange={handleChange}
            rows="5"
            className="border p-2 rounded flex-1"
          />
        ) : (
          <p className="text-slate-700 text-lg flex-1">{news.newsdescription}</p>
        )}
        <EditButtons field="newsdescription" />
      </div>
    </div>
  );

  // ------------------------------
  // Reusable Edit Buttons
  // ------------------------------
  function EditButtons({ field }) {
    return editField === field ? (
      <div className="flex gap-2">
        <Check
          size={18}
          className="text-green-600 cursor-pointer"
          onClick={handleSave}
        />
        <X
          size={18}
          className="text-red-600 cursor-pointer"
          onClick={handleCancel}
        />
      </div>
    ) : (
      <Pencil
        size={16}
        className="cursor-pointer text-gray-500 hover:text-black"
        onClick={() => setEditField(field)}
      />
    );
  }
};

export default NewsDetails;
