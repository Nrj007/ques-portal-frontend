import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ClipboardList, Check, X, Clock, Search } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: Clock,
  },
  fulfilled: {
    label: "Fulfilled",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: Check,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-50",
    text: "text-red-500",
    icon: X,
  },
};

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/papers/requests");
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/papers/requests/${id}/status`, { status });
      setRequests(
        requests.map((r) =>
          r.id === id ? { ...r, status: res.data.status } : r,
        ),
      );
    } catch (err) {
      console.error("Error updating status:", err);
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
        {/* Gradient blob */}
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

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-8 pb-16 flex-grow">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ClipboardList className="w-7 h-7 text-gray-700" />
              Paper Requests
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              View and manage paper requests from students.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6 relative">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300"
                placeholder="Search by course, code, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <div className="bg-white rounded-4xl border border-gray-100 p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded-2xl" />
                ))}
              </div>
            </div>
          ) : requests.length > 0 ? (
            <div className="bg-white rounded-4xl border border-gray-100 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <div className="col-span-3">Course</div>
                <div className="col-span-1">Code</div>
                <div className="col-span-1">Sem</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-1">Year</div>
                <div className="col-span-2">Requested By (Email)</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Table rows */}
              {requests
                .filter((req) => {
                  if (filterStatus !== "all" && req.status !== filterStatus)
                    return false;
                  if (!searchTerm.trim()) return true;
                  const q = searchTerm.toLowerCase();
                  return (
                    (req.course_name &&
                      req.course_name.toLowerCase().includes(q)) ||
                    (req.course_code &&
                      req.course_code.toLowerCase().includes(q)) ||
                    (req.requested_email &&
                      req.requested_email.toLowerCase().includes(q)) ||
                    (req.requested_by &&
                      req.requested_by.toLowerCase().includes(q))
                  );
                })
                .map((req) => {
                  const s = statusConfig[req.status] || statusConfig.pending;
                  const StatusIcon = s.icon;
                  return (
                    <div
                      key={req.id}
                      className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 items-center hover:bg-gray-50/50 text-sm"
                    >
                      <div className="col-span-3 font-semibold text-gray-900 truncate">
                        {req.course_name}
                      </div>
                      <div className="col-span-1 text-gray-500 uppercase text-xs font-semibold">
                        {req.course_code}
                      </div>
                      <div className="col-span-1 text-gray-500">
                        {req.semester || "—"}
                      </div>
                      <div className="col-span-2 text-gray-500">
                        {req.exam_type || "—"}
                      </div>
                      <div className="col-span-1 text-gray-500">
                        {req.year || "—"}
                      </div>
                      <div
                        className="col-span-2 text-gray-400 text-xs truncate"
                        title={req.requested_email}
                      >
                        {req.requested_email || req.requested_by || "—"}
                      </div>
                      <div className="col-span-1 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${s.bg} ${s.text}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span className="hidden lg:inline">{s.label}</span>
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-end gap-2">
                        {req.status !== "fulfilled" && (
                          <button
                            onClick={() => updateStatus(req.id, "fulfilled")}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full hover:bg-emerald-100"
                          >
                            Fulfill
                          </button>
                        )}
                        {req.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(req.id, "rejected")}
                            className="px-3 py-1.5 bg-red-50 text-red-500 text-xs font-bold rounded-full hover:bg-red-100"
                          >
                            Reject
                          </button>
                        )}
                        {req.status !== "pending" && (
                          <button
                            onClick={() => updateStatus(req.id, "pending")}
                            className="px-3 py-1.5 bg-gray-50 text-gray-500 text-xs font-bold rounded-full hover:bg-gray-100"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="p-5 bg-gray-50 rounded-full mb-4">
                <ClipboardList className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No requests yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Students haven't submitted any paper requests yet.
              </p>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AdminRequestsPage;
