"use client";

import React, { useState } from "react";
import {
  TRANSCRIPT_SUBJECTS,
  TranscriptSubjectKey,
  SubjectSemesterScores
} from "./utils";

interface Props {
  selectedGroup: string;
  setSelectedGroup: (g: string) => void;
  semesterScores: Record<TranscriptSubjectKey, SubjectSemesterScores>;
  errors: Record<string, string>;
  handleScoreChange: (subKey: TranscriptSubjectKey, semKey: keyof SubjectSemesterScores, val: string) => void;
  onCalculate: () => void;
  onReset: () => void;
  otherLanguageType: "Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian";
  setOtherLanguageType: (val: "Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian") => void;
}

const SEMESTERS: { key: keyof SubjectSemesterScores; name: string }[] = [
  { key: "grade10_hk1", name: "Lớp 10 HK1" },
  { key: "grade10_hk2", name: "Lớp 10 HK2" },
  { key: "grade11_hk1", name: "Lớp 11 HK1" },
  { key: "grade11_hk2", name: "Lớp 11 HK2" },
  { key: "grade12_hk1", name: "Lớp 12 HK1" },
  { key: "grade12_hk2", name: "Lớp 12 HK2" }
];

const LANGUAGE_LABEL_MAPPING: Record<string, string> = {
  Korean: "Tiếng Hàn",
  Chinese: "Tiếng Trung",
  Japanese: "Tiếng Nhật",
  French: "Tiếng Pháp",
  German: "Tiếng Đức",
  Russian: "Tiếng Nga"
};

// Phân nhóm môn học bạ để hiển thị co giãn
const SUBJECT_GROUPS: {
  id: "required" | "natural" | "social" | "other";
  name: string;
  subjects: TranscriptSubjectKey[];
}[] = [
  {
    id: "required",
    name: "Nhóm môn bắt buộc",
    subjects: ["math", "literature", "english"]
  },
  {
    id: "natural",
    name: "Tổ hợp Khoa học Tự nhiên",
    subjects: ["physics", "chemistry", "biology"]
  },
  {
    id: "social",
    name: "Tổ hợp Khoa học Xã hội",
    subjects: ["history", "geography", "gdktpl"]
  },
  {
    id: "other",
    name: "Môn Công nghệ & Ngoại ngữ phụ",
    subjects: ["informatics", "techIndustrial", "techAgricultural", "otherLanguage"]
  }
];

export default function TranscriptSelector({
  semesterScores,
  errors,
  handleScoreChange,
  onCalculate,
  onReset,
  otherLanguageType,
  setOtherLanguageType
}: Props) {
  // Trạng thái mở rộng của các nhóm môn học
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    required: true, // Luôn mở
    natural: false,
    social: false,
    other: false
  });

  const toggleGroup = (groupId: string) => {
    if (groupId === "required") return; // Bắt buộc luôn mở
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const renderSubjectInput = (subKey: TranscriptSubjectKey) => {
    const rawName = TRANSCRIPT_SUBJECTS[subKey];
    const subjectName = subKey === "otherLanguage" ? `Ngoại ngữ phụ (${LANGUAGE_LABEL_MAPPING[otherLanguageType]})` : rawName;

    return (
      <div key={subKey} className="space-y-3 bg-slate-50/50 dark:bg-zinc-900/40 p-4 border border-slate-100 dark:border-zinc-800/80 rounded-2xl animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-sm font-bold text-slate-700 dark:text-zinc-300">
            Môn {subjectName}
          </span>
          {subKey === "otherLanguage" && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">
                Loại ngoại ngữ:
              </label>
              <select
                value={otherLanguageType}
                onChange={e => setOtherLanguageType(e.target.value as "Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian")}
                data-testid="select-transcript-other-lang"
                className="px-2.5 py-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg focus:outline-none focus:border-orange-500 text-[11px] font-bold"
              >
                <option value="Korean">Tiếng Hàn</option>
                <option value="Chinese">Tiếng Trung</option>
                <option value="Japanese">Tiếng Nhật</option>
                <option value="French">Tiếng Pháp</option>
                <option value="German">Tiếng Đức</option>
                <option value="Russian">Tiếng Nga</option>
              </select>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {SEMESTERS.map(sem => {
            const errorKey = `${subKey}_${sem.key}`;
            const isErr = !!errors[errorKey];
            return (
              <div key={sem.key} className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase block">
                  {sem.name}
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={semesterScores[subKey]?.[sem.key] || ""}
                  onChange={e => handleScoreChange(subKey, sem.key, e.target.value)}
                  data-testid={`input-transcript-${subKey}-${sem.key}`}
                  className={`w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl focus:outline-none focus:ring-0 transition font-bold text-sm ${isErr
                    ? "border-red-500 focus:border-red-500 text-red-500"
                    : "border-slate-200 dark:border-zinc-850 focus:border-orange-500"
                    }`}
                />
                {isErr && (
                  <p className="text-red-500 text-[9px] font-semibold">{errors[errorKey]}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 pt-2">
        <div className="border-l-4 border-orange-500 pl-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            1. Nhập điểm học bạ 6 học kỳ (Thang điểm 10)
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 italic font-medium">
            * Mẹo gõ nhanh: Chỉ cần gõ liền số (ví dụ gõ 85 tự ra 8.5, gõ 775 tự ra 7.75) mà không cần gõ dấu chấm.
          </p>
        </div>

        <div className="space-y-4">
          {SUBJECT_GROUPS.map(group => {
            const isExpanded = expandedGroups[group.id];
            return (
              <div key={group.id} className="border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/10">
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full px-5 py-4 flex items-center justify-between text-left transition ${
                    group.id !== "required" ? "hover:bg-slate-50 dark:hover:bg-zinc-900/50 cursor-pointer" : ""
                  }`}
                >
                  <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-2">
                    {group.name}
                    {group.id === "required" && (
                      <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-955/40 text-orange-700 dark:text-orange-400 text-[9px] font-bold rounded-full normal-case">
                        Bắt buộc
                      </span>
                    )}
                  </span>
                  {group.id !== "required" && (
                    <span className="text-slate-400 dark:text-zinc-500 font-extrabold text-xs transition duration-200">
                      {isExpanded ? "▲ Thu gọn" : "▼ Mở rộng"}
                    </span>
                  )}
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 dark:border-zinc-800/60 space-y-4">
                    {group.subjects.map(sub => renderSubjectInput(sub))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Button tính điểm */}
      <div className="pt-6 flex flex-wrap gap-4 items-center justify-center border-t border-slate-100 dark:border-zinc-855">
        <button
          onClick={onReset}
          data-testid="btn-reset-transcript"
          className="px-6 py-3.5 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-650 dark:text-zinc-400 font-bold rounded-2xl transition duration-200 text-sm sm:text-base cursor-pointer"
        >
          Xóa nhập lại 🔄
        </button>
        <button
          onClick={onCalculate}
          data-testid="btn-calculate-transcript"
          className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-650 text-white font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-98 transition duration-200 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
        >
          <span>Tính điểm & Đối sánh học bạ</span>
          <span className="font-bold">⚡</span>
        </button>
      </div>
    </div>
  );
}
