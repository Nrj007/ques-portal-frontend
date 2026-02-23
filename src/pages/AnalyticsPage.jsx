import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Download, Users, Search, FileText, Heart } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const iconColors = [
  "#A78BFA", // Purple
  "#818CF8", // Indigo
  "#F472B6", // Pink
  "#FCD34D", // Yellow
  "#6EE7B7", // Green
];

// Custom Tooltip for Area Chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-lg shadow-gray-200/50">
        <p className="text-sm font-bold text-gray-800 mb-1">{label}</p>
        <p className="text-xs font-semibold text-indigo-500">
          Activity: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const [data, setData] = useState({
    totals: { downloads: 0, activeUsers: 0, searchQueries: 0, papers: 0 },
    activityData: [],
    popularCourses: [],
    trendingPapers: [],
    mostFavorited: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/papers/analytics");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans tracking-tight">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans text-gray-900 tracking-tight">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl lg:text-[40px] font-bold text-gray-900 tracking-[-0.03em]">
            Analytics
          </h1>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50/50 text-indigo-600 rounded-full border border-indigo-100/50">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-wider">
              Live Updates
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Download Stat */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <Download className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                12.5%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
              {formatNumber(data.totals.downloads)}
            </h3>
            <p className="text-[13px] font-semibold text-gray-400">
              Total Downloads
            </p>
          </div>

          {/* Users Stat */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl">
                <Users className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                4.2%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
              {formatNumber(data.totals.activeUsers)}
            </h3>
            <p className="text-[13px] font-semibold text-gray-400">
              Active Users
            </p>
          </div>

          {/* Searches Stat */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl">
                <Search className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                18.1%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
              {formatNumber(data.totals.searchQueries)}
            </h3>
            <p className="text-[13px] font-semibold text-gray-400">
              Search Queries
            </p>
          </div>

          {/* Papers Stat */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                <FileText className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                2.4%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">
              {formatNumber(data.totals.papers)}
            </h3>
            <p className="text-[13px] font-semibold text-gray-400">
              Total Papers
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Line Chart */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                Activity
              </h3>
              <div className="flex bg-gray-50/80 p-1.5 rounded-full border border-gray-100/50">
                <button className="px-5 py-2 text-xs font-bold text-gray-400 hover:text-gray-900 rounded-full transition-colors">
                  Daily
                </button>
                <button className="px-5 py-2 text-xs font-bold text-indigo-600 bg-white shadow-sm rounded-full transition-colors">
                  Weekly
                </button>
                <button className="px-5 py-2 text-xs font-bold text-gray-400 hover:text-gray-900 rounded-full transition-colors">
                  Monthly
                </button>
              </div>
            </div>

            <div className="h-[280px] w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.activityData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 600 }}
                    dx={-10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#6366f1" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Popular Bar Chart */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-8">
              Popular
            </h3>
            <div className="flex-1 h-[280px] w-full -ml-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={data.popularCourses}
                  margin={{ top: 0, right: 0, left: 20, bottom: 0 }}
                  barSize={16}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="course"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
                    width={40}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {data.popularCourses.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={iconColors[index % iconColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trending Papers List */}
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                Trending Papers
              </h3>
              <Link
                to="/admin/manage"
                className="text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {data.trendingPapers.length > 0 ? (
                data.trendingPapers.map((paper, idx) => (
                  <div
                    key={paper.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 text-xs font-bold group-hover:bg-gray-100 transition-colors">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 leading-snug">
                          {paper.title}
                        </h4>
                        <p className="text-xs font-semibold text-gray-400 mt-0.5 uppercase tracking-wider">
                          {paper.course_code || "N/A"}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">
                      {formatNumber(paper.views)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No trending papers yet.
                </p>
              )}
            </div>
          </div>

          {/* Most Favorited List (Dark Themed) */}
          <div className="bg-[#1C1A22] rounded-[2rem] p-8 shadow-xl shadow-red-900/5 relative overflow-hidden flex flex-col">
            {/* Subtle gradient background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Most Favorited
                </h3>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              {data.mostFavorited.length > 0 ? (
                data.mostFavorited.map((paper, idx) => (
                  <div
                    key={paper.id}
                    className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-colors border border-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white/50 text-[11px] font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-100 leading-snug">
                          {paper.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-gray-500 mt-0.5 line-clamp-1">
                          {paper.course}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-red-500/10 px-2 py-1 rounded-lg">
                      <Heart className="w-3 h-3 text-red-400 fill-current" />
                      <span className="text-[11px] font-bold text-red-400">
                        {formatNumber(paper.fav_count)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No favorited papers yet.
                </p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AnalyticsPage;
