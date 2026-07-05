"use client";

import React, { useState, useMemo } from "react";
import transcriptData from "@/data/universities-transcript.json";

interface UniversityItem {
  universityCode: string;
  universityName: string;
  majorCode: string;
  majorName: string;
  subjectGroup: string;
  benchmark: number;
  requiredSchoolType: string;
  minYearlyGpa: number;
  minConduct: string;
  minThptExamScore: number;
  requiresIelts: boolean;
  minIelts: number;
  description: string;
}

interface Props {
  selectedGroup: string;
  userScore: number;
  gpaSum: number;
  thptScores: Record<string, string>;
  subjects: string[];
}

const CONDUCT_LEVELS: Record<string, number> = {
  "TRUNG_BINH": 1,
  "KHA": 2,
  "TOT": 3
};

const SCHOOL_TYPES = [
  { key: "ALL", name: "Trường THPT thường" },
  { key: "HIGH_SCHOOL_FOR_GIFTED", name: "Trường chuyên / Trọng điểm" }
];

export default function TranscriptEligibilityList({
  selectedGroup,
  userScore,
  gpaSum,
  thptScores,
  subjects
}: Props) {
  const [userConduct, setUserConduct] = useState<"TOT" | "KHA" | "TRUNG_BINH">("TOT");
  const [userSchoolType, setUserSchoolType] = useState<"ALL" | "HIGH_SCHOOL_FOR_GIFTED">("ALL");
  const [userIelts, setUserIelts] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const getThptSum = () => {
    let sum = 0;
    let complete = true;
    subjects.forEach(sub => {
      const score = parseFloat(thptScores[sub]);
      if (isNaN(score)) {
        complete = false;
      } else {
        sum += score;
      }
    });
    return { sum, complete };
  };

  const { sum: thptSum, complete: thptComplete } = getThptSum();

  const matchedUniversities = useMemo(() => {
    const list = transcriptData as UniversityItem[];

    return list.map(item => {
      const reasons: string[] = [];

      const groups = item.subjectGroup.split(",").map(g => g.trim());
      if (!groups.includes(selectedGroup)) {
        reasons.push(`Không xét tổ hợp ${selectedGroup} (chỉ nhận: ${item.subjectGroup})`);
      }

      if (item.requiredSchoolType === "HIGH_SCHOOL_FOR_GIFTED" && userSchoolType !== "HIGH_SCHOOL_FOR_GIFTED") {
        reasons.push("Yêu cầu hệ chuyên THPT chuyên / Trọng điểm");
      }

      const avgSubjectScore = gpaSum / 3;
      if (avgSubjectScore < item.minYearlyGpa) {
        reasons.push(`Điểm TB học bạ môn (${avgSubjectScore.toFixed(2)}) nhỏ hơn yêu cầu của trường (${item.minYearlyGpa.toFixed(2)})`);
      }

      const minCondVal = CONDUCT_LEVELS[item.minConduct] || 0;
      const userCondVal = CONDUCT_LEVELS[userConduct] || 0;
      if (userCondVal < minCondVal) {
        const conductName = item.minConduct === "TOT" ? "Tốt" : item.minConduct === "KHA" ? "Khá" : "Trung bình";
        reasons.push(`Yêu cầu hạnh kiểm tối thiểu từ loại ${conductName}`);
      }

      if (thptComplete && thptSum < item.minThptExamScore) {
        reasons.push(`Tổng điểm thi tốt nghiệp THPT (${thptSum.toFixed(2)}) chưa đạt sàn riêng của trường (${item.minThptExamScore.toFixed(2)})`);
      }

      if (item.requiresIelts) {
        const ieltsVal = parseFloat(userIelts) || 0;
        if (ieltsVal < item.minIelts) {
          reasons.push(`Yêu cầu IELTS tối thiểu ${item.minIelts}`);
        }
      }

      if (userScore < item.benchmark) {
        reasons.push(`Điểm của bạn (${userScore.toFixed(4)}) chưa đạt điểm chuẩn học bạ dự kiến (${item.benchmark.toFixed(2)})`);
      }

      return {
        ...item,
        eligible: reasons.length === 0,
        reasons
      };
    }).filter(item => {
      if (searchTerm.trim() === "") return true;
      const term = searchTerm.toLowerCase();
      return (
        item.universityName.toLowerCase().includes(term) ||
        item.universityCode.toLowerCase().includes(term) ||
        item.majorName.toLowerCase().includes(term) ||
        item.majorCode.includes(term)
      );
    });
  }, [selectedGroup, userScore, gpaSum, thptSum, thptComplete, userConduct, userSchoolType, userIelts, searchTerm]);

  return (
    <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-zinc-800/80">
      <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-l-4 border-orange-500 pl-3">
        3. Khai báo thông tin phụ và Đối sánh điều kiện tuyển sinh các trường
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 dark:bg-zinc-900/40 p-4 border border-slate-100 dark:border-zinc-800/80 rounded-2xl">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase block">
            Hạnh kiểm cấp THPT
          </label>
          <select
            value={userConduct}
            onChange={e => setUserConduct(e.target.value as "TOT" | "KHA" | "TRUNG_BINH")}
            data-testid="select-user-conduct"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 font-bold text-xs"
          >
            <option value="TOT">Tốt</option>
            <option value="KHA">Khá</option>
            <option value="TRUNG_BINH">Trung bình</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase block">
            Loại hình trường THPT học tập
          </label>
          <select
            value={userSchoolType}
            onChange={e => setUserSchoolType(e.target.value as "ALL" | "HIGH_SCHOOL_FOR_GIFTED")}
            data-testid="select-user-school-type"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 font-bold text-xs"
          >
            {SCHOOL_TYPES.map(t => (
              <option key={t.key} value={t.key}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase block">
            Điểm IELTS (Nếu có)
          </label>
          <input
            type="number"
            step="0.5"
            placeholder="0.0"
            value={userIelts}
            onChange={e => setUserIelts(e.target.value)}
            data-testid="input-user-ielts"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 font-bold text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 tracking-wider uppercase">
            Danh sách đối sánh nguyện vọng xét học bạ
          </span>
          <input
            type="text"
            placeholder="Tìm mã trường, tên ngành..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            data-testid="input-search-transcript-univ"
            className="px-3 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 text-xs font-semibold w-full sm:w-64"
          />
        </div>

        <div className="space-y-3">
          {matchedUniversities.map((item, idx) => (
            <div
              key={`${item.universityCode}-${item.majorCode}-${idx}`}
              data-testid={`transcript-univ-card-${item.universityCode}-${item.majorCode}`}
              className={`p-4 border rounded-2xl space-y-2 transition duration-200 ${
                item.eligible
                  ? "bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-500/20 dark:border-emerald-900/30"
                  : "bg-red-50/30 dark:bg-red-950/10 border-red-500/20 dark:border-red-900/30"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded mr-2 uppercase">
                    {item.universityCode}
                  </span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {item.universityName}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                    Ngành: {item.majorName} ({item.majorCode}) | Tổ hợp: {item.subjectGroup}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Điểm chuẩn học bạ</span>
                    <span className="text-sm font-extrabold text-orange-600 dark:text-orange-500">{item.benchmark.toFixed(2)}</span>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${
                    item.eligible
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                      : "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300"
                  }`}>
                    {item.eligible ? "Đủ điều kiện" : "Không đủ"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-zinc-400 border-t border-slate-100 dark:border-zinc-800/80 pt-2">
                <span className="font-semibold text-slate-600 dark:text-zinc-300">Ghi chú tuyển sinh: </span>
                {item.description}
              </div>

              {!item.eligible && (
                <div className="bg-red-50/50 dark:bg-red-950/10 p-2.5 rounded-xl border border-red-200/40 dark:border-red-950 text-[11px] text-red-600 dark:text-red-400 font-semibold space-y-1">
                  <span className="block font-bold">Lý do chưa thỏa mãn:</span>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {item.reasons.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {matchedUniversities.length === 0 && (
            <div className="text-center py-8 text-slate-400 dark:text-zinc-500 text-sm font-semibold">
              Không tìm thấy trường đại học nào phù hợp với bộ lọc tìm kiếm.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
