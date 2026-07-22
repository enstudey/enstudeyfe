"use client";

import React, { useState, useMemo } from "react";
import transcriptData from "@/data/universities-transcript.json";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const thptComplete = useMemo(() => {
    return subjects.every(s => thptScores[s] && thptScores[s] !== "");
  }, [thptScores, subjects]);

  const thptSum = useMemo(() => {
    if (!thptComplete) return 0;
    return subjects.reduce((sum, s) => sum + parseFloat(thptScores[s] || "0"), 0);
  }, [thptComplete, thptScores, subjects]);

  const matchedUniversities = useMemo(() => {
    const list = transcriptData as UniversityItem[];
    const result: (UniversityItem & { eligible: boolean; reasons: string[] })[] = [];

    list.forEach(item => {
      if (item.subjectGroup !== selectedGroup) return;

      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        const matchesCode = item.universityCode.toLowerCase().includes(term);
        const matchesMajorName = item.majorName.toLowerCase().includes(term);
        const matchesUnivName = item.universityName.toLowerCase().includes(term);
        if (!matchesCode && !matchesMajorName && !matchesUnivName) return;
      }

      const reasons: string[] = [];
      let eligible = true;

      // 1. Đối sánh điểm học bạ tổ hợp
      if (userScore < item.benchmark) {
        eligible = false;
        reasons.push(`Điểm học bạ của bạn (${userScore.toFixed(2)}) thấp hơn điểm chuẩn (${item.benchmark.toFixed(2)})`);
      }

      // 2. Đối sánh điểm GPA học kỳ tối thiểu
      const avgGpa = gpaSum / 6;
      if (item.minYearlyGpa > 0 && avgGpa < item.minYearlyGpa) {
        eligible = false;
        reasons.push(`Điểm GPA học bạ trung bình (${avgGpa.toFixed(2)}) thấp hơn yêu cầu tối thiểu (${item.minYearlyGpa.toFixed(2)})`);
      }

      // 3. Đối sánh hạnh kiểm
      const userConductVal = CONDUCT_LEVELS[userConduct] || 0;
      const minConductVal = CONDUCT_LEVELS[item.minConduct] || 0;
      if (userConductVal < minConductVal) {
        eligible = false;
        reasons.push(`Hạnh kiểm tối thiểu yêu cầu: ${item.minConduct === "TOT" ? "Tốt" : "Khá"}`);
      }

      // 4. Đối sánh loại hình trường THPT
      if (item.requiredSchoolType === "HIGH_SCHOOL_FOR_GIFTED" && userSchoolType !== "HIGH_SCHOOL_FOR_GIFTED") {
        eligible = false;
        reasons.push(`Chỉ tuyển học sinh trường THPT Chuyên / Trọng điểm`);
      }

      // 5. Đối sánh điểm thi THPT quốc gia
      if (item.minThptExamScore > 0) {
        if (!thptComplete) {
          eligible = false;
          reasons.push(`Yêu cầu bổ sung điểm thi THPT quốc gia (Tổng ${subjects.join("+")} >= ${item.minThptExamScore})`);
        } else if (thptSum < item.minThptExamScore) {
          eligible = false;
          reasons.push(`Tổng điểm thi THPT của bạn (${thptSum.toFixed(2)}) thấp hơn ngưỡng yêu cầu (${item.minThptExamScore.toFixed(2)})`);
        }
      }

      // 6. Đối sánh IELTS
      if (item.requiresIelts) {
        const ieltsVal = parseFloat(userIelts || "0");
        if (ieltsVal < item.minIelts) {
          eligible = false;
          reasons.push(`Yêu cầu chứng chỉ IELTS tối thiểu từ ${item.minIelts.toFixed(1)} trở lên`);
        }
      }

      result.push({
        ...item,
        eligible,
        reasons
      });
    });

    return result.sort((a, b) => {
      if (a.eligible && !b.eligible) return -1;
      if (!a.eligible && b.eligible) return 1;
      return b.benchmark - a.benchmark;
    });
  }, [selectedGroup, userScore, gpaSum, thptSum, thptComplete, userConduct, userSchoolType, userIelts, searchTerm, subjects]);

  return (
    <div className="space-y-6 pt-6 border-t border-slate-100">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-indigo-600 pl-3">
        3. Khai báo thông tin phụ và Đối sánh điều kiện tuyển sinh các trường
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
            Hạnh kiểm cấp THPT
          </label>
          <Select value={userConduct} onValueChange={(val) => setUserConduct(val as "TOT" | "KHA" | "TRUNG_BINH")}>
            <SelectTrigger
              data-testid="select-user-conduct"
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-xs text-left"
            >
              <SelectValue placeholder="Chọn hạnh kiểm">
                {userConduct === "TOT" ? "Tốt" : userConduct === "KHA" ? "Khá" : "Trung bình"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TOT">Tốt</SelectItem>
              <SelectItem value="KHA">Khá</SelectItem>
              <SelectItem value="TRUNG_BINH">Trung bình</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
            Loại hình trường THPT học tập
          </label>
          <Select value={userSchoolType} onValueChange={(val) => setUserSchoolType(val as "ALL" | "HIGH_SCHOOL_FOR_GIFTED")}>
            <SelectTrigger
              data-testid="select-user-school-type"
              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl font-bold text-xs text-left"
            >
              <SelectValue placeholder="Chọn loại trường">
                {userSchoolType === "HIGH_SCHOOL_FOR_GIFTED" ? "Trường chuyên / Trọng điểm" : "Trường THPT thường"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SCHOOL_TYPES.map(t => (
                <SelectItem key={t.key} value={t.key}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block">
            Điểm IELTS (Nếu có)
          </label>
          <Input
            type="number"
            step="0.5"
            placeholder="0.0"
            value={userIelts}
            onChange={e => setUserIelts(e.target.value)}
            data-testid="input-user-ielts"
            className="font-bold text-sm h-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
            Danh sách đối sánh nguyện vọng xét học bạ
          </span>
          <Input
            type="text"
            placeholder="Tìm mã trường, tên ngành..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            data-testid="input-search-transcript-univ"
            className="text-xs font-semibold w-full sm:w-64 h-8"
          />
        </div>

        <div className="space-y-3">
          {matchedUniversities.map((item, idx) => (
            <div
              key={`${item.universityCode}-${item.majorCode}-${idx}`}
              data-testid={`transcript-univ-card-${item.universityCode}-${item.majorCode}`}
              className={`p-4 border rounded-2xl space-y-2 transition duration-200 ${item.eligible
                ? "bg-emerald-50/30 border-emerald-500/20"
                : "bg-red-50/30 border-red-500/20"
                }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-200 text-slate-700 rounded mr-2 uppercase">
                    {item.universityCode}
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {item.universityName}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Ngành: {item.majorName} ({item.majorCode}) | Tổ hợp: {item.subjectGroup}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Điểm chuẩn học bạ</span>
                    <span className="text-sm font-extrabold text-indigo-600">{item.benchmark.toFixed(2)}</span>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider ${item.eligible
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                    }`}>
                    {item.eligible ? "Đủ điều kiện" : "Không đủ"}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                <span className="font-semibold text-slate-600">Ghi chú tuyển sinh: </span>
                {item.description}
              </div>

              {!item.eligible && (
                <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-200/40 text-[11px] text-red-600 font-semibold space-y-1">
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
            <div className="text-center py-8 text-slate-400 text-sm font-semibold">
              Không tìm thấy trường đại học nào phù hợp với bộ lọc tìm kiếm.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
