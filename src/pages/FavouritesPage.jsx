import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Heart,
  FileText,
  Download,
  Eye,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const iconColors = [
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-red-100", text: "text-red-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-yellow-100", text: "text-yellow-600" },
  { bg: "bg-pink-100", text: "text-pink-600" },
];

const FavouritesPage = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    setLoading(true);
    try {
      const response = await api.get("/papers/favorites");
      setPapers(response.data);
    } catch (error) {
      console.error("Error fetching favourites:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavourite = async (paperId) => {
    try {
      const response = await api.post(`/papers/favorite/${paperId}`);
      if (!response.data.isFavorite) {
        // Remove from list since it's no longer a favourite
        setPapers(papers.filter((p) => p.id !== paperId));
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  const handleView = async (paper) => {
    try {
      const response = await api.get(
        `/papers/download/${paper.id}?inline=true`,
      );

      const url = response.data.url;
      window.open(url, "_blank");

      // Update local state to increment views
      setPapers(
        papers.map((p) =>
          p.id === paper.id ? { ...p, views: (p.views || 0) + 1 } : p,
        ),
      );
    } catch (error) {
      console.error("Error viewing paper:", error);
    }
  };

  const handleDownload = async (paper) => {
    try {
      const response = await api.get(`/papers/download/${paper.id}`);
      const fileUrl = response.data.url;

      const fileRes = await fetch(fileUrl);
      const blob = await fileRes.blob();
      const localUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = localUrl;
      link.setAttribute("download", `${paper.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(localUrl);

      // Update local state to increment downloads
      setPapers(
        papers.map((p) =>
          p.id === paper.id ? { ...p, downloads: (p.downloads || 0) + 1 } : p,
        ),
      );
    } catch (error) {
      console.error("Error downloading paper:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 mt-8">
          <Link
            to="/"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              My Favourites
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Papers you've saved for quick access.
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm animate-pulse"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gray-100 rounded" />
                    <div className="w-16 h-3 bg-gray-100 rounded" />
                  </div>
                  <div className="w-10 h-4 bg-gray-100 rounded" />
                </div>
                <div className="w-3/4 h-4 bg-gray-100 rounded mb-2" />
                <div className="w-1/2 h-3 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : papers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {papers.map((paper, idx) => {
              const color = iconColors[idx % iconColors.length];
              return (
                <div
                  key={paper.id}
                  className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`${color.bg} ${color.text} p-1.5 rounded`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                        {paper.course_code || paper.course || "N/A"}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${color.bg} ${color.text}`}
                    >
                      {paper.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug group-hover:text-blue-600 transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mb-4">
                    {paper.exam_type || "Final Exam"} • Semester{" "}
                    {paper.semester || "N/A"}
                  </p>

                  {/* Tiny stats */}
                  <div className="flex justify-between mb-4 px-1 text-[11px] text-gray-400 font-medium">
                    <div className="flex gap-3">
                      <span>{paper.downloads || 0} DLs</span>
                      <span>{paper.views || 0} Views</span>
                    </div>
                    <span>{paper.favorites_count || 0} Favs</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(paper)}
                      className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-gray-800 transition-colors"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                    <button
                      onClick={() => handleDownload(paper)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFavourite(paper.id)}
                      className="p-2 bg-red-50 border border-red-100 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                      title="Remove from favourites"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              No favourites yet
            </h3>
            <p className="text-sm text-gray-400 max-w-xs">
              Start exploring papers and tap the heart icon to save them here
              for quick access.
            </p>
            <Link
              to="/search"
              className="mt-6 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Papers
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;
