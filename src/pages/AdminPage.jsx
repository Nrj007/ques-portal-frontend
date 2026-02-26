import React, { useState, useRef } from "react";
import api from "../services/api";
import {
  Upload,
  FileText,
  Check,
  AlertCircle,
  X,
  CloudUpload,
} from "lucide-react";
import Navbar from "../components/Navbar";

const AdminPage = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [year, setYear] = useState(currentYear.toString());
  const [semester, setSemester] = useState("Semester 1");
  const [examType, setExamType] = useState("Mid Term");
  const [educationType, setEducationType] = useState("UG");
  const [discipline, setDiscipline] = useState("Computer Science");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

const handleSubmit = async () => {
  if (!file || !courseCode || !courseTitle) {
    setMessage({ type: "error", text: "Please fill all required fields and upload a file." });
    return;
  }
  setLoading(true);
  setMessage({ type: "", text: "" });
  try {
    // Step 1: Get a presigned S3 PUT URL from the backend
    const { data } = await api.get("/papers/upload-url", {
      params: {
        filename: file.name,
        contentType: file.type,
      },
    });
    const { uploadUrl, fileUrl } = data;
    // Step 2: PUT the file DIRECTLY to S3 (bypasses your proxy entirely)
    await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    // Step 3: Confirm with backend to save DB record
    await api.post("/papers/confirm", {
      title: courseTitle,
      course_code: courseCode,
      course: courseTitle,
      year,
      semester: semester.replace("Semester ", ""),
      exam_type: examType,
      education_type: educationType,
      discipline,
      fileUrl,
    });
    setMessage({ type: "success", text: "Paper published successfully!" });
    setCourseCode("");
    setCourseTitle("");
    setEducationType("UG");
    setDiscipline("Computer Science");
    setFile(null);
  } catch (error) {
    console.error(error);
    setMessage({ type: "error", text: "Failed to upload paper." });
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16 mt-14">
          <h1 className="text-3xl font-bold mb-2">Upload New Paper</h1>
          <p className="text-gray-400 text-sm">
            Create a digital record for a new semester examination paper.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
          {/* Left Column: Metadata */}
          <div className="w-full max-w-md bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
            {/* Course Code */}
            <div className="mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Course Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. 22BCLA12"
                  className="w-full bg-white border-none rounded-xl py-4 px-4 text-gray-600 placeholder-gray-300 focus:ring-2 focus:ring-indigo-100 shadow-sm font-medium"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Course Title */}
            <div className="mb-8">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Course Title
              </label>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Enter full course name.."
                className="w-full bg-transparent border-none p-0 text-2xl font-bold placeholder-gray-200 focus:ring-0 text-gray-800"
              />
            </div>

            {/* Dropdowns Row */}
            <div className="flex flex-wrap gap-3">
              {/* Year */}
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-white border-none rounded-lg py-2 px-3 text-xs font-semibold text-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              {/* Semester */}
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="bg-indigo-50 border-none rounded-lg py-2 px-3 text-xs font-semibold text-indigo-600 shadow-sm focus:ring-2 focus:ring-indigo-200 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={`Semester ${s}`}>
                    Semester {s}
                  </option>
                ))}
              </select>

              {/* Exam Type */}
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="bg-blue-50 border-none rounded-lg py-2 px-3 text-xs font-semibold text-blue-600 shadow-sm focus:ring-2 focus:ring-blue-200 cursor-pointer"
              >
                {["Mid Term", "End Semester", "Supplementary"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Education Type */}
              <select
                value={educationType}
                onChange={(e) => {
                  setEducationType(e.target.value);
                  setDiscipline(
                    e.target.value === "PG"
                      ? "Computer Science"
                      : "Computer Science",
                  );
                }}
                className="bg-purple-50 border-none rounded-lg py-2 px-3 text-xs font-semibold text-purple-600 shadow-sm focus:ring-2 focus:ring-purple-200 cursor-pointer"
              >
                {["UG", "PG"].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {/* Discipline */}
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="bg-green-50 border-none rounded-lg py-2 px-3 text-xs font-semibold text-green-600 shadow-sm focus:ring-2 focus:ring-green-200 cursor-pointer"
              >
                {educationType === "UG"
                  ? [
                      "Biochemistry",
                      "Biotechnology",
                      "Chemistry",
                      "Commerce",
                      "Computer Science",
                      "Economics",
                      "Electronics",
                      "English",
                      "Forensic Science",
                      "Genetics",
                      "Hindi",
                      "Journalism & Mass Communication",
                      "Kannada",
                      "Law",
                      "Management",
                      "Mathematics",
                      "Microbiology",
                      "Physics",
                      "Psychology",
                      "Social Work",
                      "Sociology",
                      "Statistics",
                      "Visual Communication",
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))
                  : [
                      "Commerce",
                      "Computer Science",
                      "Data Science",
                      "Economics",
                      "English",
                      "Forensic Science",
                      "Journalism & Mass Communication",
                      "Law",
                      "Life Sciences",
                      "Management",
                      "Mathematics",
                      "Physical Sciences",
                      "Psychology",
                      "Social Work",
                      "Statistics",
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          {/* Right Column: File Upload & Submit */}
          <div className="w-full max-w-sm flex flex-col gap-6">
            {/* Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current.click()}
              className={`
                                h-[220px] bg-white rounded-3xl border-2 border-dashed border-gray-100 
                                flex flex-col items-center justify-center cursor-pointer transition-all group hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50
                                ${file ? "border-green-200 bg-green-50/10" : ""}
                            `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="application/pdf,image/*"
              />

              {file ? (
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Ready to upload</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-4 text-[10px] text-gray-400 hover:text-red-500 uppercase font-bold tracking-wide"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center p-6 group-hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                    <CloudUpload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    Drop PDF here
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    or click to browse
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`
                                w-full py-4 rounded-xl flex items-center justify-center text-sm font-bold tracking-wide transition-all shadow-xl shadow-gray-200
                                ${
                                  loading
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-900 text-white hover:bg-black hover:shadow-2xl hover:-translate-y-0.5"
                                }
                            `}
            >
              {loading ? "Publishing..." : "Publish Paper"}
            </button>

            {/* Feedback Message */}
            {message.text && (
              <div
                className={`flex items-center gap-2 text-xs font-medium justify-center ${message.type === "error" ? "text-red-500" : "text-green-600"}`}
              >
                {message.type === "error" ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
