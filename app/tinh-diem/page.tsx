"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function CalculatorPage() {
  const [scores, setScores] = useState({
    math: "",
    literature: "",
    english: "",
    physics: "",
    chemistry: "",
    biology: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [computedScores, setComputedScores] = useState<Record<string, number> | null>(null);
  const [highestGroup, setHighestGroup] = useState<{ name: string; score: number } | null>(null);

  const handleScoreChange = (subject: keyof typeof scores, val: string) => {
    setScores(prev => ({ ...prev, [subject]: val }));
    const numVal = parseFloat(val);
    if (val !== "" && (isNaN(numVal) || numVal < 0 || numVal > 10)) {
      setErrors(prev => ({ ...prev, [subject]: "Điểm phải nằm trong khoảng 0 - 10" }));
    } else {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[subject];
        return copy;
      });
    }
  };

  const handleCalculate = () => {
    const newErrors: Record<string, string> = {};
    Object.entries(scores).forEach(([subj, val]) => {
      if (val === "") {
        newErrors[subj] = "Vui lòng nhập điểm";
      } else {
        const numVal = parseFloat(val);
        if (isNaN(numVal) || numVal < 0 || numVal > 10) {
          newErrors[subj] = "Điểm phải nằm trong khoảng 0 - 10";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Vui lòng kiểm tra lại điểm số đã nhập.");
      return;
    }

    const m = parseFloat(scores.math) || 0;
    const l = parseFloat(scores.literature) || 0;
    const e = parseFloat(scores.english) || 0;
    const p = parseFloat(scores.physics) || 0;
    const c = parseFloat(scores.chemistry) || 0;
    const b = parseFloat(scores.biology) || 0;

    const results = {
      A00: parseFloat((m + p + c).toFixed(2)),
      A01: parseFloat((m + p + e).toFixed(2)),
      B00: parseFloat((m + c + b).toFixed(2)),
      D01: parseFloat((m + l + e).toFixed(2))
    };

    setComputedScores(results);

    // Lưu vào localStorage dưới dạng chuỗi JSON
    localStorage.setItem("user_scores", JSON.stringify(results));

    let maxGroup = "A00";
    let maxVal = results.A00;
    Object.entries(results).forEach(([grp, val]) => {
      if (val > maxVal) {
        maxVal = val;
        maxGroup = grp;
      }
    });

    setHighestGroup({ name: maxGroup, score: maxVal });

    setTimeout(() => {
      const el = document.getElementById("result-area");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">Công cụ tính điểm xét tuyển ✨</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">
            Hệ thống tự động đề xuất điểm tổ hợp môn tối ưu dựa trên điểm số cá nhân của bạn.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { id: "math", name: "TOÁN HỌC" },
              { id: "literature", name: "NGỮ VĂN" },
              { id: "english", name: "TIẾNG ANH" },
              { id: "physics", name: "VẬT LÝ" },
              { id: "chemistry", name: "HÓA HỌC" },
              { id: "biology", name: "SINH HỌC" }
            ].map(sub => (
              <div key={sub.id} className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">{sub.name}</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={scores[sub.id as keyof typeof scores]}
                  onChange={e => handleScoreChange(sub.id as keyof typeof scores, e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border rounded-xl focus:outline-none focus:ring-0 transition font-bold text-lg ${
                    errors[sub.id]
                      ? "border-red-500 focus:border-red-500 text-red-500"
                      : "border-slate-200 dark:border-zinc-850 focus:border-orange-500 dark:focus:border-orange-500"
                  }`}
                />
                {errors[sub.id] && (
                  <p className="text-red-500 text-[10px] font-semibold">{errors[sub.id]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={handleCalculate}
              className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-650 text-white font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-98 transition duration-200 flex items-center gap-2 text-base cursor-pointer"
            >
              <span>Tính điểm tổ hợp</span>
              <span className="font-bold">⚡</span>
            </button>
          </div>

          {/* Result Area */}
          {computedScores && highestGroup && (
            <div id="result-area" className="mt-8 space-y-6 border-t border-slate-100 dark:border-zinc-800 pt-8 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900 dark:bg-zinc-950 p-6 rounded-2xl text-white">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổ hợp cao nhất của bạn</p>
                  <h3 className="text-3xl font-extrabold mt-1">{highestGroup.name}: {highestGroup.score} Điểm</h3>
                </div>
                <Link
                  href="/tra-cuu-truong-dai-hoc"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition"
                >
                  Tra cứu trường &rarr;
                </Link>
              </div>

              {/* Anti-CLS Ad Slot */}
              <div className="ad-container ad-v-block w-full">
                {/* AdSlot */}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(computedScores).map(([grp, val]) => (
                  <div key={grp} className="p-4 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-900/30 flex justify-between items-center">
                    <span className="font-bold text-sm text-slate-700 dark:text-zinc-300">{grp}</span>
                    <span className="font-extrabold text-base text-orange-600 dark:text-orange-500">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
