import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Send, CheckCircle } from "lucide-react";

const RequestPaperPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    course_name: "",
    course_code: "",
    semester: "",
    exam_type: "",
    year: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.course_name.trim() || !form.course_code.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/papers/requests", form);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
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

        <div className="relative z-10 w-full max-w-2xl mx-auto px-4 pt-10 pb-16 flex-grow">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Request a Paper
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Can't find a question paper? Let us know and we'll try to add it.
            </p>
          </div>

          {submitted ? (
            /* Success state */
            <div className="bg-white rounded-4xl border border-gray-100 p-10 text-center">
              <div className="p-4 bg-emerald-50 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Request Submitted!
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                We've received your request and will try to make this paper
                available soon.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      course_name: "",
                      course_code: "",
                      semester: "",
                      exam_type: "",
                      year: "",
                    });
                  }}
                  className="px-6 py-3 border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Submit Another
                </button>
                <button
                  onClick={() => navigate("/search")}
                  className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm font-semibold"
                >
                  Browse Papers
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-4xl border border-gray-100 p-8 space-y-5"
            >
              {/* Course Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Course Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="course_name"
                  value={form.course_name}
                  onChange={handleChange}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300"
                  required
                />
              </div>

              {/* Course Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Course Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="course_code"
                  value={form.course_code}
                  onChange={handleChange}
                  placeholder="e.g. 22BCA3416"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 uppercase"
                  required
                />
              </div>

              {/* Semester + Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 bg-white"
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="e.g. 2024"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300"
                  />
                </div>
              </div>

              {/* Exam Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Exam Type
                </label>
                <select
                  name="exam_type"
                  value={form.exam_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 bg-white"
                >
                  <option value="">Select</option>
                  <option value="Mid Term">Mid Term</option>
                  <option value="End Semester">End Semester</option>
                  <option value="Supplementary">Supplementary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default RequestPaperPage;
