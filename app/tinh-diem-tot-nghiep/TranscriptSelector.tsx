"use client";

import React, { useState, useEffect } from "react";
import {
  TRANSCRIPT_SUBJECTS,
  TRANSCRIPT_SUBJECT_GROUPS,
  TranscriptSubjectKey,
  SubjectSemesterScores
} from "./utils";

interface Props {
  selectedGroup: string;
  setSelectedGroup: (g: string) => void;
  semesterScores: Record<TranscriptSubjectKey, SubjectSemesterScores>;
  errors: Record<string, string>;
  handleScoreChange: (subKey: TranscriptSubjectKey, semKey: keyof SubjectSemesterScores, val: string) => void;
  thptScores: Record<string, string>;
  handleThptChange: (sub: string, val: string) => void;
  subjectAvgs: Record<TranscriptSubjectKey, number>;
  gpaSum: number;
  priorityScore: number;
  totalScore: number;
  isCalculated: boolean;
  onCalculate: () => void;
}

const SEMESTERS: { key: keyof SubjectSemesterScores; name: string }[] = [
  { key: "grade10_hk1", name: "Lớp 10 HK1" },
  { key: "grade10_hk2", name: "Lớp 10 HK2" },
  { key: "grade11_hk1", name: "Lớp 11 HK1" },
  { key: "grade11_hk2", name: "Lớp 11 HK2" },
  { key: "grade12_hk1", name: "Lớp 12 HK1" },
  { key: "grade12_hk2", name: "Lớp 12 HK2" }
];

export default function TranscriptSelector({
  selectedGroup,
  setSelectedGroup,
  semesterScores,
  errors,
  handleScoreChange,
  thptScores,
  handleThptChange,
  subjectAvgs,
  gpaSum,
  priorityScore,
  totalScore,
  isCalculated,
  onCalculate
}: Props) {
  const [adKey, setAdKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdKey(prev => prev + 1);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const subjects = TRANSCRIPT_SUBJECT_GROUPS[selectedGroup] || [];

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
  const hasThptFloorViolation = thptComplete && thptSum < 15.0;
  const hasRequiredSubjects = subjects.includes("math") || subjects.includes("literature");

  return (
    <div className="space-y-6">
      {/* Chọn tổ hợp xét học bạ */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
          Chọn tổ hợp môn xét tuyển học bạ:
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(TRANSCRIPT_SUBJECT_GROUPS).map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              data-testid={`btn-select-group-${group}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedGroup === group
                  ? "bg-orange-600 text-white shadow-md shadow-orange-500/20"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300"
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Form nhập điểm 6 học kỳ */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-l-4 border-orange-500 pl-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            1. Nhập điểm học bạ 6 học kỳ (Thang điểm 10)
          </h3>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 font-bold text-xs rounded-full">
            Tổ hợp {selectedGroup}
          </span>
        </div>

        <div className="space-y-6">
          {subjects.map(subKey => {
            const subjectName = TRANSCRIPT_SUBJECTS[subKey];
            return (
              <div key={subKey} className="space-y-3 bg-slate-50/50 dark:bg-zinc-900/40 p-4 border border-slate-100 dark:border-zinc-800/80 rounded-2xl">
                <span className="text-sm font-bold text-slate-700 dark:text-zinc-300 block">
                  Môn {subjectName}
                </span>
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
                          value={semesterScores[subKey][sem.key] || ""}
                          onChange={e => handleScoreChange(subKey, sem.key, e.target.value)}
                          data-testid={`input-transcript-${subKey}-${sem.key}`}
                          className={`w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border rounded-xl focus:outline-none focus:ring-0 transition font-bold text-sm ${
                            isErr
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
          })}
        </div>
      </div>

      {/* Button tính điểm */}
      <div className="pt-6 flex flex-col items-center border-t border-slate-100 dark:border-zinc-800/80">
        <button
          onClick={onCalculate}
          data-testid="btn-calculate-transcript"
          className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-650 text-white font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-98 transition duration-200 flex items-center gap-2 text-base cursor-pointer"
        >
          <span>Tính điểm & Đối sánh học bạ</span>
          <span className="font-bold">⚡</span>
        </button>
      </div>

      {/* Hiển thị kết quả tính toán */}
      {isCalculated && (
        <div id="result-area" className="space-y-6 pt-6 border-t border-slate-100 dark:border-zinc-800/80">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider border-l-4 border-orange-500 pl-3">
            2. Kết quả tính điểm học bạ và Đối sánh quy chế
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-slate-50/50 dark:bg-zinc-900/40 p-5 border border-slate-100 dark:border-zinc-800/80 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 tracking-wider uppercase block">
                Điểm trung bình 6 học kỳ từng môn
              </span>
              <div className="space-y-2">
                {subjects.map(sub => (
                  <div key={sub} className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-600 dark:text-zinc-400">{TRANSCRIPT_SUBJECTS[sub]}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{subjectAvgs[sub]?.toFixed(2) || "0.00"}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200/55 dark:border-zinc-800 space-y-2 text-sm font-bold">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-zinc-400">Tổng điểm 3 môn:</span>
                  <span className="text-slate-900 dark:text-white">{gpaSum.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-zinc-400">Điểm ưu tiên thực tế:</span>
                  <span className="text-orange-600 dark:text-orange-400">+{priorityScore.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center text-base pt-2 border-t border-dashed border-slate-200 dark:border-zinc-800">
                  <span className="text-slate-800 dark:text-zinc-200">ĐIỂM XÉT TUYỂN HỌC BẠ:</span>
                  <span className="text-xl text-orange-600 dark:text-orange-500 font-extrabold">{totalScore.toFixed(4)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-slate-50/50 dark:bg-zinc-900/40 p-5 border border-slate-100 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 dark:text-zinc-500 tracking-wider uppercase block">
                  Xác thực điểm thi tốt nghiệp THPT tương ứng (Ngưỡng sàn 15đ)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {subjects.map(sub => (
                    <div key={sub} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase block">
                        Thi {TRANSCRIPT_SUBJECTS[sub]}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={thptScores[sub] || ""}
                        onChange={e => handleThptChange(sub, e.target.value)}
                        data-testid={`input-thpt-${sub}`}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 font-bold text-sm"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2 space-y-2 text-xs font-semibold">
                  {!hasRequiredSubjects && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/50 rounded-xl">
                      ⚠️ Tổ hợp xét tuyển học bạ bắt buộc phải chứa môn Toán hoặc môn Ngữ văn theo Quy chế 2026.
                    </div>
                  )}

                  {hasThptFloorViolation && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/50 rounded-xl" data-testid="warning-thpt-floor">
                      ⚠️ Kết quả xét học bạ không hợp lệ do tổng điểm thi tốt nghiệp THPT 3 môn tương ứng nhỏ hơn 15.0 điểm.
                    </div>
                  )}

                  {!thptComplete && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50 rounded-xl">
                      ℹ️ Nhập điểm thi tốt nghiệp THPT tương ứng để kiểm tra điều kiện sàn 15 điểm bắt buộc.
                    </div>
                  )}

                  {thptComplete && !hasThptFloorViolation && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50 rounded-xl">
                      ✓ Đạt điều kiện sàn thi tốt nghiệp THPT (tổng = {thptSum.toFixed(2)} &ge; 15.0).
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold italic">
                * Kết quả tính toán chỉ mang tính tham khảo và đối sánh.
              </div>
            </div>
          </div>

          {/* Anti-CLS In-feed AdSlot */}
          <div 
            key={`infeed-${adKey}`}
            className="ad-container ad-v-block w-full min-h-[250px] bg-slate-100/50 dark:bg-zinc-900/50 flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl transition duration-300"
            data-testid="ad-infeed-transcript"
          >
            <div className="text-center space-y-2">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Liên kết tài trợ</span>
              <p className="font-bold text-sm text-slate-700 dark:text-zinc-350">Lộ trình học IELTS 7.5+ cấp tốc cho xét tuyển Đại học học bạ</p>
              <p className="text-xs text-slate-400 dark:text-zinc-500">Đăng ký ôn tập tại EnStudey để tối ưu hóa điểm số và chứng chỉ xét tuyển.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
