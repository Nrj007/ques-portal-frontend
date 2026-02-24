import React, { useEffect } from "react";
import { X, Sparkles } from "lucide-react";

const teamMembers = [
  {
    name: "Aaron Aji",
    course: "BCA Cloud Computing A",
    id: "23BCLA02",
    bg: "bg-blue-50",
  },
  {
    name: "Joseph Mathew",
    course: "BCA Cloud Computing A",
    id: "23BCLA30",
    bg: "bg-fuchsia-50",
  },
  {
    name: "Matthew Panachamoottil Eapen",
    course: "BCA General",
    id: "23BCAF36",
    bg: "bg-orange-50",
  },
  {
    name: "Chandana V P",
    course: "BCA General",
    id: "23BCAF19",
    bg: "bg-emerald-50",
  },
  {
    name: "Jerin Thomas Joji",
    course: "BCA Cloud Computing A",
    id: "23BCLA26",
    bg: "bg-red-50",
  },
  {
    name: "Megha Rose Tom",
    course: "BCA General",
    id: "23BCAA32",
    bg: "bg-sky-50",
  },
  {
    name: "Jerom Manoj",
    course: "BCA Cloud Computing A",
    id: "23BCLA27",
    bg: "bg-amber-50",
  },
];

const TeamModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-4xl max-h-[75vh] rounded-[32px] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {" "}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="overflow-y-auto p-8 md:p-12 flex-grow overflow-x-hidden rounded-[32px] scrollbar-hide">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#111] text-white px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Sparked by Students
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111] mb-4 tracking-tight">
              The Minds Behind
            </h2>
            <p className="text-gray-500 text-[15px] max-w-md mx-auto leading-relaxed">
              What started as a student idea is now a reality. Meet the team
              behind the spark.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className={`${member.bg} rounded-[24px] p-6 lg:p-7 flex flex-col transition-all hover:scale-[1.02] hover:shadow-md cursor-default`}
              >
                <h3 className="text-[19px] font-bold text-gray-900 mb-1.5 leading-tight">
                  {member.name}
                </h3>
                <p className="text-[14px] text-gray-600 font-medium mb-8">
                  {member.course}
                </p>

                <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-black/30 tracking-[0.15em] uppercase">
                    ID : {member.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
