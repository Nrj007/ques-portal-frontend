import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { Search, Trash2, Heart, Eye, Download, BookOpen } from "lucide-react";

const ManagePapers = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
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
    fetchPapers(page);
  }, [page]);

  const fetchPapers = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    try {
      const response = await api.get(`/papers?page=${pageNum}`);
      if (pageNum === 1) {
        setPapers(response.data);
      } else {
        setPapers((prev) => [...prev, ...response.data]);
      }
      setHasMore(response.data.length === 20);
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      if (pageNum === 1) setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this paper?")) return;
    try {
      await api.delete(`/papers/${id}`);
      setPapers(papers.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting paper:", error);
      alert("Failed to delete paper");
    }
  };

  const handleFavorite = async (id) => {
    try {
      const response = await api.post(`/papers/favorite/${id}`);
      setPapers(
        papers.map((p) =>
          p.id === id
            ? {
                ...p,
                is_favorite: response.data.isFavorite,
                favorites_count: response.data.isFavorite
                  ? Math.max(0, parseInt(p.favorites_count || 0)) + 1
                  : Math.max(0, parseInt(p.favorites_count || 0)) - 1,
              }
            : p,
        ),
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await api.get(`/papers/download/${id}?inline=true`);
      window.open(response.data.url, "_blank");
    } catch (error) {
      console.error("Error viewing paper", error);
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const response = await api.get(`/papers/download/${id}`);
      const fileUrl = response.data.url;
      const fileRes = await fetch(fileUrl);
      const blob = await fileRes.blob();
      const localUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = localUrl;
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(localUrl);
    } catch (error) {
      console.error("Error downloading paper", error);
    }
  };

  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paper.course_code &&
        paper.course_code.toLowerCase().includes(searchTerm.toLowerCase())),
  );

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
        {/* Gradient blob background */}
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

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-8 pb-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Papers</h1>
            <p className="text-sm text-gray-400 mt-1">
              Select papers to edit or remove from the archive.
            </p>
          </div>

          {/* Search Bar */}
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
                      placeholder="Search papers to manage..."
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

          {/* Papers Grid */}
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
          ) : filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper, index, arr) => {
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
                          handleView(paper.id);
                        }}
                        className="flex-1 bg-[#141414] hover:bg-black text-white py-3.5 rounded-full text-[15px] font-semibold flex items-center justify-center gap-2.5 transition-colors"
                      >
                        <Eye className="w-5 h-5 text-gray-300" /> View
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(paper.id, paper.title);
                          }}
                          className="w-[48px] h-[48px] bg-gray-50/80 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite(paper.id);
                          }}
                          className={`w-[46px] h-[46px] rounded-[16px] flex items-center justify-center transition-colors ${
                            paper.is_favorite
                              ? "bg-red-50 text-red-500 hover:bg-red-100"
                              : "bg-gray-50/80 text-gray-400 hover:bg-gray-100"
                          }`}
                          title={paper.is_favorite ? "Unfavorite" : "Favorite"}
                        >
                          <Heart
                            className={`w-4 h-4 ${paper.is_favorite ? "fill-current" : ""}`}
                          />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(paper.id);
                          }}
                          className="w-[46px] h-[46px] bg-red-50 hover:bg-red-100 text-red-400 rounded-[16px] flex items-center justify-center transition-colors border border-red-100/50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="p-5 bg-gray-50 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No papers found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term.
              </p>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ManagePapers;
