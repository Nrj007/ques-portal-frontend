import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { Search, Trash2, Heart, Eye, Download, FileText } from "lucide-react";

const ManagePapers = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await api.get("/papers");
      setPapers(response.data);
    } catch (error) {
      console.error("Error fetching papers:", error);
    } finally {
      setLoading(false);
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
          p.id === id ? { ...p, is_favorite: response.data.isFavorite } : p,
        ),
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleView = async (id) => {
    try {
      const response = await api.get(`/papers/download/${id}?inline=true`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" }),
      );
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error viewing paper", error);
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const response = await api.get(`/papers/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Manage Papers
          </h1>
          <p className="text-gray-500">
            Select papers to edit or remove from the archive.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search papers to manage..."
            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-50 p-1.5 rounded text-blue-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase">
                    {paper.course_code || "Unknown Code"}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {paper.year}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {paper.title}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {(paper.exam_type || "Final Exam") +
                  " • Semester " +
                  (paper.semester || "N/A")}
              </p>

              <div className="flex items-center gap-2 mt-auto">
                <button
                  onClick={() => handleView(paper.id)}
                  className="flex-1 bg-gray-900 text-white text-xs font-medium py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-3 h-3" /> View
                </button>
                <button
                  onClick={() => handleDownload(paper.id, paper.title)}
                  className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(paper.id)}
                  className="p-2 border border-red-100 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFavorite(paper.id)}
                  className={`p-2 border rounded-lg transition-colors ${
                    paper.is_favorite
                      ? "bg-red-50 border-red-100 text-red-500"
                      : "border-gray-200 text-gray-400 hover:bg-gray-50"
                  }`}
                  title={paper.is_favorite ? "Unfavorite" : "Favorite"}
                >
                  <Heart
                    className={`w-4 h-4 ${paper.is_favorite ? "fill-current" : ""}`}
                  />
                </button>
              </div>
              <div className="flex justify-between mt-3 px-1 text-[10px] text-gray-400">
                <span>1.2KB</span>
                <span>900</span>
              </div>
            </div>
          ))}
        </div>

        {!loading && filteredPapers.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No papers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePapers;
