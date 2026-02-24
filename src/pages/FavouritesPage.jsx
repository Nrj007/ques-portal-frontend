import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api";
import { Heart, Download, Eye, BookOpen, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FavouritesPage = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Icon colors for paper cards — cycles through a set
  const iconColors = [
    { bg: "bg-blue-50/80", text: "text-blue-500" },
    { bg: "bg-purple-50/80", text: "text-purple-500" },
    { bg: "bg-pink-50/80", text: "text-pink-500" },
    { bg: "bg-orange-50/80", text: "text-orange-500" },
    { bg: "bg-emerald-50/80", text: "text-emerald-500" },
  ];

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    fetchFavourites(page);
  }, [page]);

  const fetchFavourites = async (pageNum = 1) => {
    // Only set full loading state on first load, so we don't hide the list while appending
    if (pageNum === 1) setLoading(true);
    try {
      const response = await api.get(`/papers/favorites?page=${pageNum}`);
      if (pageNum === 1) {
        setPapers(response.data);
      } else {
        setPapers((prev) => [...prev, ...response.data]);
      }
      setHasMore(response.data.length === 20);
    } catch (error) {
      console.error("Error fetching favourites:", error);
    } finally {
      if (pageNum === 1) setLoading(false);
    }
  };

  const toggleFavourite = async (paperId) => {
    try {
      const response = await api.post(`/papers/favorite/${paperId}`);
      if (!response.data.isFavorite) {
        setPapers(papers.filter((p) => p.id !== paperId));
      } else {
        setPapers(
          papers.map((p) =>
            p.id === paperId
              ? {
                  ...p,
                  favorites_count:
                    Math.max(0, parseInt(p.favorites_count || 0)) + 1,
                }
              : p,
          ),
        );
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
            <div className="w-full mb-8 relative z-10">
              <div
                className={`bg-white rounded-3xl max-w-2xl px-6 py-5 transition-shadow duration-300 hover:shadow-[0_0_0_2.236px_rgba(173,70,255,0.08),0_14.708px_41.18px_-6.708px_rgba(0,0,0,0.12)]`}
                style={{
                  boxShadow:
                    "0 0 0 2.236px rgba(173, 70, 255, 0.06), 0 14.708px 41.18px -6.708px rgba(0, 0, 0, 0.08)",
                }}
              >
                <form onSubmit={(e) => e.preventDefault()} className="relative">
                  <div
                    className="rounded-full p-[1.5px]"
                    style={{
                      background:
                        "linear-gradient(90deg, #4f46e5 0%, #e11d48 100%)",
                    }}
                  >
                    <div className="relative bg-white rounded-full transition-shadow duration-300 shadow-sm focus-within:shadow-lg focus-within:shadow-indigo-500/20">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </span>
                      <input
                        type="text"
                        className="w-full pl-12 pr-14 py-4 rounded-full bg-transparent placeholder-gray-400 focus:outline-none text-base text-gray-800 cursor-text"
                        placeholder="Search your favourites..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm("")}
                          className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors group"
                          title="Clear search"
                        >
                          <div className="bg-gray-100 rounded-full p-1 group-hover:bg-gray-200 transition-colors">
                            <X className="h-4 w-4" />
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
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
                .map((paper, index, arr) => {
                  const isLast = index === arr.length - 1;
                  const color = iconColors[index % iconColors.length];
                  return (
                    <div
                      ref={isLast ? lastElementRef : null}
                      key={paper.id}
                      className="group bg-white rounded-[2rem] p-6 border border-gray-100/80 hover:shadow-xl hover:shadow-gray-200/50 flex flex-col transition-all"
                    >
                      {/* Top: course code + year */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 ${color.bg} rounded-2xl flex items-center justify-center`}
                          >
                            <BookOpen className={`w-5 h-5 ${color.text}`} />
                          </div>
                          <span className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {paper.course_code || paper.course || "—"}
                          </span>
                        </div>
                        {paper.year && (
                          <div
                            className={`px-3.5 py-1.5 ${color.bg} rounded-full`}
                          >
                            <span
                              className={`text-[13px] font-bold ${color.text}`}
                            >
                              {paper.year}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-[20px] font-bold text-gray-900 mb-2 leading-tight group-hover:text-gray-800 line-clamp-2">
                        {paper.title}
                      </h3>

                      {/* Exam type + semester */}
                      <p className="text-[14px] font-medium text-gray-500 mb-0.5">
                        {paper.exam_type || "Exam"} • Semester{" "}
                        {paper.semester || "—"}
                      </p>
                      <p className="text-[12px] font-medium text-gray-400 mb-5 uppercase tracking-wider">
                        {paper.education_type && `${paper.education_type} • `}
                        {paper.discipline || "Discipline"}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleView(paper);
                          }}
                          className="flex-1 bg-[#141414] hover:bg-black text-white py-3.5 rounded-full text-[15px] font-semibold flex items-center justify-center gap-2.5 transition-colors"
                        >
                          <Eye className="w-5 h-5 text-gray-300" /> View
                        </button>

                        <div className="flex flex-col items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(paper);
                            }}
                            className="w-[48px] h-[48px] bg-gray-50/80 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                            title="Download"
                          >
                            <Download className="w-5 h-5 text-gray-500" />
                          </button>
                          <span className="text-[10px] font-bold text-gray-400">
                            {paper.downloads || 0}
                          </span>
                        </div>

                        <div className="flex flex-col items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavourite(paper.id);
                            }}
                            className="w-[48px] h-[48px] bg-red-50 text-red-500 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors"
                            title="Remove from favourites"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                          <span className="text-[10px] font-bold text-gray-400">
                            {paper.favorites_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
