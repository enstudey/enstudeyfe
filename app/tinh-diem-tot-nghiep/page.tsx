"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubjectScoresInput from "./SubjectScoresInput";
import CertificateConverter from "./CertificateConverter";
import PrioritySelector from "./PrioritySelector";
import ResultDashboard from "./ResultDashboard";
import { calculateAllCombinations, GROUP_MAPPING } from "./utils";

export default function CalculatorPage() {
  const [scores, setScores] = useState({
    math: "",
    literature: "",
    english: "",
    otherLanguage: "",
    physics: "",
    chemistry: "",
    biology: "",
    history: "",
    geography: "",
    gdktpl: "",
    informatics: "",
    techIndustrial: "",
    techAgricultural: ""
  });

  const [otherLanguageType, setOtherLanguageType] = useState<"Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian">("Korean");
  const [certType, setCertType] = useState<"none" | "ielts" | "toeic">("none");
  const [certScore, setCertScore] = useState("");
  const [conversionTarget, setConversionTarget] = useState<"standard" | "neu" | "ftu" | "hust" | "hcmut">("standard");
  const [areaPriority, setAreaPriority] = useState<"KV3" | "KV2" | "KV2-NT" | "KV1">("KV3");
  const [objectPriority, setObjectPriority] = useState<"none" | "UT1" | "UT2">("none");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [computedScores, setComputedScores] = useState<Record<string, number> | null>(null);
  const [highestGroup, setHighestGroup] = useState<{ name: string; score: number } | null>(null);
  const [appliedEquivNote, setAppliedEquivNote] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "A" | "B" | "C" | "D" | "X_TH">("all");

  const handleScoreChange = (subject: keyof typeof scores, val: string) => {
    setScores(prev => ({ ...prev, [subject]: val }));
    if (val !== "") {
      const numVal = parseFloat(val);
      if (isNaN(numVal) || numVal < 0 || numVal > 10) {
        setErrors(prev => ({ ...prev, [subject]: "Điểm phải từ 0.0 - 10.0" }));
      } else {
        setErrors(prev => {
          const copy = { ...prev };
          delete copy[subject];
          return copy;
        });
      }
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
      if (val !== "") {
        const numVal = parseFloat(val);
        if (isNaN(numVal) || numVal < 0 || numVal > 10) {
          newErrors[subj] = "Điểm phải từ 0.0 - 10.0";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Vui lòng kiểm tra lại các điểm số đã nhập.");
      return;
    }

    const { results, highestGroup: bestGroup, equivEnglish } = calculateAllCombinations(
      scores,
      otherLanguageType,
      certType,
      certScore,
      conversionTarget,
      areaPriority,
      objectPriority
    );

    if (Object.keys(results).length === 0) {
      alert("Vui lòng nhập điểm thi các môn để tính toán tổ hợp.");
      return;
    }

    const rawEnglish = parseFloat(scores.english) || 0;
    if (equivEnglish > 0 && equivEnglish > rawEnglish) {
      setAppliedEquivNote(`Đã áp dụng mức điểm quy đổi tốt nhất (${equivEnglish.toFixed(1)} điểm) cho môn Tiếng Anh theo đề án trường.`);
    } else {
      setAppliedEquivNote(null);
    }

    setComputedScores(results);
    setHighestGroup(bestGroup);
    localStorage.setItem("user_scores", JSON.stringify(results));

    setTimeout(() => {
      const el = document.getElementById("result-area");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  const getVisibleScores = () => {
    if (!computedScores) return [];
    let list = Object.entries(computedScores);
    if (activeTab !== "all") {
      const allowed = GROUP_MAPPING[activeTab] || [];
      list = list.filter(([grp]) => allowed.includes(grp));
    }
    return list;
  };

  const visibleScores = getVisibleScores();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Công cụ tính điểm xét tuyển Đại học 2026 chính xác
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">
            Nhập điểm thi THPT quốc gia và thông tin ưu tiên để xem điểm tổ hợp xét tuyển tự động.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
          
          <SubjectScoresInput
            scores={scores}
            errors={errors}
            otherLanguageType={otherLanguageType}
            setOtherLanguageType={setOtherLanguageType}
            handleScoreChange={handleScoreChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100 dark:border-zinc-850">
            <CertificateConverter
              certType={certType}
              setCertType={setCertType}
              certScore={certScore}
              setCertScore={setCertScore}
              conversionTarget={conversionTarget}
              setConversionTarget={setConversionTarget}
            />

            <PrioritySelector
              areaPriority={areaPriority}
              setAreaPriority={setAreaPriority}
              objectPriority={objectPriority}
              setObjectPriority={setObjectPriority}
            />
          </div>

          <div className="pt-6 flex flex-col items-center border-t border-slate-100 dark:border-zinc-855">
            <button
              onClick={handleCalculate}
              data-testid="btn-calculate-scores"
              className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-650 text-white font-bold rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-98 transition duration-200 flex items-center gap-2 text-base cursor-pointer"
            >
              <span>Tính điểm xét tuyển</span>
              <span className="font-bold">⚡</span>
            </button>
          </div>

          <ResultDashboard
            computedScores={computedScores}
            highestGroup={highestGroup}
            appliedEquivNote={appliedEquivNote}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            visibleScores={visibleScores}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
