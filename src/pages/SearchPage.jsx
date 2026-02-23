import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { Search, BookOpen, Download, Heart, Eye, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";

const SearchPage = () => {
  const { user, openLoginModal } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState({
    year: searchParams.get("year") || "",
    semester: searchParams.get("semester") || "",
    exam_type: searchParams.get("exam_type") || "",
  });
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false); // controls the animation state
  const debounceRef = useRef(null);

  // Is "active" when there's a search term
  const showResults = isActive && searchTerm.trim().length > 0;

  // On mount: if URL has ?q= or filters, fetch immediately
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const y = searchParams.get("year") || "";
    const s = searchParams.get("semester") || "";
    const e = searchParams.get("exam_type") || "";

    if (q || y || s || e) {
      if (q) setSearchTerm(q);
      const initFilters = { year: y, semester: s, exam_type: e };
      setFilters(initFilters);
      setIsActive(true);
      fetchPapers(q, initFilters);
    }
  }, []);

  // Debounced live search as user types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const term = searchTerm.trim();
    const hasFilters = filters.year || filters.semester || filters.exam_type;

    if (!term && !hasFilters) {
      setPapers([]);
      setSearchParams({});
      return;
    }

    setIsActive(true);

    debounceRef.current = setTimeout(() => {
      const newParams = { ...filters };
      if (term) newParams.q = term;

      // Remove empty params for URL clarity
      Object.keys(newParams).forEach(
        (key) => !newParams[key] && delete newParams[key],
      );

      setSearchParams(newParams);
      fetchPapers(term, filters);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, filters]);

  const fetchPapers = async (term = "", currentFilters = filters) => {
    setLoading(true);
    try {
      const params = { ...currentFilters };
      if (term) params.q = term;

      // Clean empty filters
      Object.keys(params).forEach((key) => {
        if (!params[key]) delete params[key];
      });

      const response = await api.get("/papers", { params });
      setPapers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilters({ year: "", semester: "", exam_type: "" });
    setSearchParams({});
    setIsActive(false);
    setPapers([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (
      !searchTerm.trim() &&
      !filters.year &&
      !filters.semester &&
      !filters.exam_type
    )
      return;
    fetchPapers(searchTerm.trim(), filters);
  };

  /* ─── Action handlers ─── */
  const handleViewPaper = async (paper) => {
    if (!user) {
      openLoginModal();
      return;
    }
    try {
      const response = await api.get(
        `/papers/download/${paper.id}?inline=true`,
      );

      // The backend now returns { url: "cloudinary_url" }
      const fileUrl = response.data.url;
      window.open(fileUrl, "_blank");

      // Update local state to increment views
      setPapers(
        papers.map((p) =>
          p.id === paper.id ? { ...p, views: (p.views || 0) + 1 } : p,
        ),
      );
    } catch (error) {
      console.error("Error viewing paper", error);
    }
  };

  const handleDownloadPaper = async (paper) => {
    if (!user) {
      openLoginModal();
      return;
    }
    try {
      const response = await api.get(`/papers/download/${paper.id}`);

      // The backend now returns { url: "cloudinary_url" }
      const fileUrl = response.data.url;

      // Since it's a cross-origin Cloudinary URL, standard <a download> might just navigate.
      // To force download, we can either fetch it as a blob here, or simply open it.
      // Let's try downloading it via fetch:
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
      console.error("Error downloading paper", error);
    }
  };

  const handleToggleFavorite = async (paper) => {
    if (!user) {
      openLoginModal();
      return;
    }
    try {
      const response = await api.post(`/papers/favorite/${paper.id}`);
      setPapers(
        papers.map((p) =>
          p.id === paper.id
            ? { ...p, is_favorite: response.data.isFavorite }
            : p,
        ),
      );
    } catch (error) {
      console.error("Error toggling favorite", error);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#ffffff", fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />
      <LoginModal />

      <div
        className="relative flex flex-col items-center"
        style={{ paddingTop: "72px", minHeight: "100vh" }}
      >
        {/* Radial gradient blob */}
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

        {/* ─── LANDING STATE (no search yet) ─── */}
        {!isActive && (
          <div
            className="relative z-10 flex flex-col items-center justify-center w-full px-4 pb-32 md:pb-48"
            style={{ flex: 1, minHeight: "calc(100vh - 72px)" }}
          >
            <h1
              className="text-4xl md:text-5xl font-semibold text-[#9B9B9B] tracking-tight mb-8"
              style={{ letterSpacing: "-0.02em" }}
            >
              Search in{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #4f46e5 0%, #e11d48 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Q-Vault
              </span>
            </h1>

            {/* Search bar with gradient border */}
            <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl">
              <div
                className="rounded-full p-[1.5px]"
                style={{
                  background:
                    "linear-gradient(90deg, #4f46e5 0%, #e11d48 100%)",
                }}
              >
                <div className="relative bg-white rounded-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    className="w-full pl-12 pr-14 py-4 rounded-full bg-transparent placeholder-gray-400 focus:outline-none text-base cursor-text"
                    placeholder="Search by course code or course name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onClick={() => setIsActive(true)}
                    onFocus={() => setIsActive(true)}
                  />
                </div>
              </div>
            </form>

            {/* Tabs */}
            <div className="flex gap-3 mt-6">
              {["Quick", "Organized", "Unified", "Accessible"].map((tab) => (
                <button
                  key={tab}
                  className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  style={{
                    borderRadius: "14px",
                    border: "1px solid #FFF",
                    background: "rgba(255, 255, 255, 0.40)",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── SEARCH RESULTS STATE ─── */}
        {isActive && (
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-8 pb-16">
            {/* Compact search bar + filter card */}
            <div
              className="bg-white rounded-3xl max-w-2xl mx-auto  px-6 py-5 mb-8"
              style={{
                boxShadow:
                  "0 0 0 2.236px rgba(173, 70, 255, 0.06), 0 14.708px 41.18px -6.708px rgba(0, 0, 0, 0.08)",
              }}
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  className="w-full pl-8 pr-10 py-2 bg-transparent placeholder-gray-400 focus:outline-none text-base text-gray-800 border-b border-gray-100 focus:border-gray-300"
                  placeholder="Search by course code or course name"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  autoFocus
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-1 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </form>

              {/* Filter Dropdowns */}
              <div className="flex gap-3 mt-4">
                <select
                  className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 outline-none hover:bg-gray-50 focus:border-gray-300 appearance-none pr-8 relative cursor-pointer transition-colors"
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.7rem center",
                    backgroundSize: "1em",
                  }}
                >
                  <option value="">Year</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>

                <select
                  className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 outline-none hover:bg-gray-50 focus:border-gray-300 appearance-none pr-8 relative cursor-pointer transition-colors"
                  value={filters.semester}
                  onChange={(e) =>
                    handleFilterChange("semester", e.target.value)
                  }
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.7rem center",
                    backgroundSize: "1em",
                  }}
                >
                  <option value="">Sem</option>
                  <option value="1">1st Sem</option>
                  <option value="2">2nd Sem</option>
                  <option value="3">3rd Sem</option>
                  <option value="4">4th Sem</option>
                  <option value="5">5th Sem</option>
                  <option value="6">6th Sem</option>
                  <option value="7">7th Sem</option>
                  <option value="8">8th Sem</option>
                </select>

                <select
                  className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 outline-none hover:bg-gray-50 focus:border-gray-300 appearance-none pr-8 relative cursor-pointer transition-colors"
                  value={filters.exam_type}
                  onChange={(e) =>
                    handleFilterChange("exam_type", e.target.value)
                  }
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.7rem center",
                    backgroundSize: "1em",
                  }}
                >
                  <option value="">Exam Type</option>
                  <option value="Mid Sem">Mid Sem</option>
                  <option value="End Sem">End Sem</option>
                  <option value="CAT 1">CAT 1</option>
                  <option value="CAT 2">CAT 2</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-4xl p-6 border border-gray-100 animate-pulse"
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
                {papers.map((paper) => (
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
                        onClick={() => handleViewPaper(paper)}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button
                        onClick={() => handleDownloadPaper(paper)}
                        className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleFavorite(paper)}
                        title={
                          user
                            ? paper.is_favorite
                              ? "Remove favourite"
                              : "Add favourite"
                            : "Login to favourite"
                        }
                        className={`p-3 border rounded-full ${
                          paper.is_favorite
                            ? "bg-red-50 border-red-100 text-red-500"
                            : "border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-400 hover:border-red-100"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${paper.is_favorite ? "fill-current" : ""}`}
                        />
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
              searchTerm.trim() &&
              !loading && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="p-5 bg-gray-50 rounded-full mb-4">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No papers found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try a different course name or code
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
