import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Heart, Download, Eye, BookOpen, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FavouritesPage = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      window.open(response.data.url, "_blank");
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
      className="min-h-screen flex flex-col"
      style={{ background: "#ffffff", fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />

      <div
        className="relative w-full flex flex-col flex-grow"
        style={{ paddingTop: "72px" }}
      >
        {/* Radial gradient blob — matches SearchPage */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "500px",
            borderRadius: "16777200px",
            opacity: 0.5173,
            background:
              "linear-gradient(90deg, rgba(162, 244, 253, 0.40) 0%, rgba(233, 212, 255, 0.40) 50%, rgba(252, 206, 232, 0.40) 100%)",
            filter: "blur(52.92px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-8 pb-16">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              My Favourites
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Papers you've saved for quick access.
            </p>
          </div>

          {/* Search Bar */}
          {!loading && papers.length > 0 && (
            <div className="max-w-md mb-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your favourites..."
                className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          {/* Skeleton loaders */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-4xl p-6 border border-gray-100"
                >
                  <div className="h-4 bg-gray-100 rounded-full w-1/2 mb-4" />
                  <div className="h-5 bg-gray-100 rounded-full w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/3 mb-6" />
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-100 rounded-full flex-1" />
                    <div className="h-10 w-10 bg-gray-100 rounded-full" />
                    <div className="h-10 w-10 bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : papers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {papers
                .filter((paper) => {
                  if (!searchTerm.trim()) return true;
                  const q = searchTerm.toLowerCase();
                  return (
                    (paper.title && paper.title.toLowerCase().includes(q)) ||
                    (paper.course_code &&
                      paper.course_code.toLowerCase().includes(q)) ||
                    (paper.course && paper.course.toLowerCase().includes(q))
                  );
                })
                .map((paper) => (
                  <div
                    key={paper.id}
                    className="group bg-white rounded-4xl px-6 py-5 border border-gray-100 hover:shadow-md flex flex-col"
                  >
                    {/* Top: course code + year */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-emerald-50 rounded-lg">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                        </span>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {paper.course_code || paper.course || "—"}
                        </span>
                      </div>
                      {paper.year && (
                        <span className="text-sm font-bold text-emerald-500">
                          {paper.year}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug group-hover:text-gray-700 line-clamp-2">
                      {paper.title}
                    </h3>

                    {/* Exam type + semester */}
                    <p className="text-xs text-gray-400 mb-6">
                      {paper.exam_type || "Exam"} • Semester{" "}
                      {paper.semester || "—"}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-auto mb-4">
                      <button
                        onClick={() => handleView(paper)}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button
                        onClick={() => handleDownload(paper)}
                        className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleFavourite(paper.id)}
                        className="p-3 bg-red-50 border border-red-100 text-red-500 rounded-full hover:bg-red-100"
                        title="Remove from favourites"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Tiny stats */}
                    <div className="flex justify-between px-2 text-[11px] text-gray-400 font-medium">
                      <div className="flex gap-4">
                        <span>{paper.downloads || 0} DLs</span>
                        <span>{paper.views || 0} Views</span>
                      </div>
                      <span>{paper.favorites_count || 0} Favs</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="p-5 bg-gray-50 rounded-full mb-4">
                <Heart className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No favourites yet</p>
              <p className="text-sm text-gray-400 mt-1 mb-6 max-w-xs">
                Start exploring papers and tap the heart icon to save them here.
              </p>
              <Link
                to="/search"
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-full"
              >
                Browse Papers
              </Link>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FavouritesPage;
