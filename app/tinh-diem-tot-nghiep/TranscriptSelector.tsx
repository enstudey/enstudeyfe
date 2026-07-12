"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  handleScoreBlur?: (subKey: TranscriptSubjectKey, semKey: keyof SubjectSemesterScores, val: string) => void;
  onCalculate: () => void;
  onReset: () => void;
  otherLanguageType: "Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian";
  setOtherLanguageType: (val: "Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian") => void;
  expandedGroups: Record<string, boolean>;
  setExpandedGroups: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
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
  handleScoreBlur,
  onCalculate,
  onReset,
  otherLanguageType,
  setOtherLanguageType,
  expandedGroups,
  setExpandedGroups
}: Props) {
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
      <div key={subKey} className="space-y-3 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-sm font-bold text-slate-700">
            Môn {subjectName}
          </span>
          {subKey === "otherLanguage" && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-500">
                Loại ngoại ngữ:
              </label>
              <Select
                value={otherLanguageType}
                onValueChange={(val) => setOtherLanguageType(val as "Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian")}
              >
                <SelectTrigger
                  data-testid="select-transcript-other-lang"
                  aria-label="Chọn loại ngoại ngữ học bạ"
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold h-7 w-28"
                >
                  <SelectValue placeholder="Chọn tiếng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Korean">Tiếng Hàn</SelectItem>
                  <SelectItem value="Chinese">Tiếng Trung</SelectItem>
                  <SelectItem value="Japanese">Tiếng Nhật</SelectItem>
                  <SelectItem value="French">Tiếng Pháp</SelectItem>
                  <SelectItem value="German">Tiếng Đức</SelectItem>
                  <SelectItem value="Russian">Tiếng Nga</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {SEMESTERS.map(sem => {
            const errorKey = `${subKey}_${sem.key}`;
            const isErr = !!errors[errorKey];
            return (
              <div key={sem.key} className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
                  {sem.name}
                </label>
                <Input
                  type="text"
                  placeholder="0.0"
                  value={semesterScores[subKey]?.[sem.key] || ""}
                  onChange={e => handleScoreChange(subKey, sem.key, e.target.value)}
                  onBlur={e => handleScoreBlur && handleScoreBlur(subKey, sem.key, e.target.value)}
                  id={`input-transcript-${subKey}_${sem.key}`}
                  data-testid={`input-transcript-${subKey}_${sem.key}`}
                  className={`font-bold text-sm h-10 ${isErr
                    ? "border-red-500 focus-visible:border-red-500 text-red-500"
                    : "border-slate-200"
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
        <div className="border-l-4 border-violet-600 pl-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            1. Nhập điểm học bạ 6 học kỳ (Thang điểm 10)
          </h2>
          <p className="text-[11px] text-slate-500 mt-1 italic font-medium">
            * Mẹo gõ nhanh: Chỉ cần gõ liền số (ví dụ gõ 85 tự ra 8.5, gõ 775 tự ra 7.75) mà không cần gõ dấu chấm.
          </p>
        </div>

        <div className="space-y-4">
          {SUBJECT_GROUPS.map(group => {
            const isExpanded = expandedGroups[group.id];
            return (
              <div key={group.id} className="border border-slate-200/60 rounded-2xl overflow-hidden bg-white">
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full px-5 py-4 flex items-center justify-between text-left transition ${
                    group.id !== "required" ? "hover:bg-slate-50 cursor-pointer" : ""
                  }`}
                >
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    {group.name}
                    {group.id === "required" && (
                      <span className="px-2 py-0.5 bg-violet-100 text-violet-750 text-[9px] font-bold rounded-full normal-case">
                        Bắt buộc
                      </span>
                    )}
                  </span>
                  {group.id !== "required" && (
                    <span className="text-slate-600 font-extrabold text-xs transition duration-200">
                      {isExpanded ? "▲ Thu gọn" : "▼ Mở rộng"}
                    </span>
                  )}
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 space-y-4">
                    {group.subjects.map(sub => renderSubjectInput(sub))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Button tính điểm */}
      <div className="pt-6 flex flex-wrap gap-4 items-center justify-center border-t border-border">
        <Button
          onClick={onReset}
          data-testid="btn-reset-transcript"
          variant="outline"
          className="px-6 py-5.5 font-bold rounded-2xl transition duration-200 text-sm sm:text-base"
        >
          Xóa nhập lại 🔄
        </Button>
        <Button
          onClick={onCalculate}
          data-testid="btn-calculate-transcript"
          className="px-8 py-5.5 font-bold rounded-2xl shadow-md hover:scale-[1.01] active:scale-98 transition duration-200 flex items-center gap-2 text-sm sm:text-base"
        >
          <span>Tính điểm & Đối sánh học bạ</span>
          <span className="font-bold">⚡</span>
        </Button>
      </div>
    </div>
  );
}
