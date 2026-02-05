import React, { useEffect, useState } from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import SectionTitle from "./SectionTitle";
import { getAllNews, deleteNews } from "../../api/newsApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const News = () => {
  const navigate = useNavigate();

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await getAllNews();
      setNewsList(res.data.data || []);
    } catch (err) {
      console.error("News Fetch Error:", err);
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;

    try {
      await deleteNews(id);
      toast.success("News deleted successfully");
      fetchNews(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete news");
    }
  };

  return (
    <div className="py-12 bg-white container mx-auto px-4">
      <SectionTitle title="Latest News & Press" subtitle />

      {/* Loading */}
      {loading && <p className="text-center text-gray-500">Loading News...</p>}

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsList.map((item) => (
          <div
            key={item._id}
            className="border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <img
              src={item.newsimage}
              className="w-full h-48 object-cover"
              alt="news"
            />

            <div className="p-6">
              {/* Category + Date */}
              <div className="flex justify-between text-sm text-slate-500 mb-3">
                <span>{item.category}</span>
                <span>{new Date(item.newsdate).toLocaleDateString()}</span>
              </div>

              {/* Headline */}
              <h3 className="text-xl font-bold mb-3 hover:text-orange-600 cursor-pointer">
                {item.headlines}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {item.newsdescription}
              </p>

              {/* Buttons */}
              <div className="flex gap-30">
                {/* Read More */}
                <button
                  onClick={() => navigate(`/news/${item._id}`)}
                  className="text-orange-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Read More <ArrowRight size={14} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Delete <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Data */}
      {newsList.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-6">No News Found</p>
      )}
    </div>
  );
};

export default News;
