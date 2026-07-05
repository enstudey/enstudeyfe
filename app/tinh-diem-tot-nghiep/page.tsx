"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubjectScoresInput from "./SubjectScoresInput";
import CertificateConverter from "./CertificateConverter";
import PrioritySelector from "./PrioritySelector";
import ResultDashboard from "./ResultDashboard";
import TranscriptSelector from "./TranscriptSelector";
import TranscriptEligibilityList from "./TranscriptEligibilityList";
import {
  calculateAllCombinations,
  GROUP_MAPPING,
  TranscriptSubjectKey,
  SubjectSemesterScores,
  TRANSCRIPT_SUBJECTS,
  TRANSCRIPT_SUBJECT_GROUPS,
  calculateSubjectAverage,
  calculateTranscriptScore
} from "./utils";

const INITIAL_SEMESTER_SCORES: SubjectSemesterScores = {
  grade10_hk1: "",
  grade10_hk2: "",
  grade11_hk1: "",
  grade11_hk2: "",
  grade12_hk1: "",
  grade12_hk2: ""
};

export default function CalculatorPage() {
  // Lựa chọn phương thức xét tuyển
  const [calculationMethod, setCalculationMethod] = useState<"THPT_EXAM" | "TRANSCRIPT">("THPT_EXAM");

  // State phương thức 100 (Thi THPT) - Sử dụng Lazy Initializer để tránh warning linter cascading renders
  const [scores, setScores] = useState(() => ({
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
  }));

  const [otherLanguageType, setOtherLanguageType] = useState<"Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian" >("Korean");
  const [certType, setCertType] = useState<"none" | "ielts" | "toeic">("none");
  const [certScore, setCertScore] = useState("");
  const [conversionTarget, setConversionTarget] = useState<"standard" | "neu" | "ftu" | "hust" | "hcmut">("standard");
  const [areaPriority, setAreaPriority] = useState<"KV3" | "KV2" | "KV2-NT" | "KV1">("KV3");
  const [objectPriority, setObjectPriority] = useState<"none" | "UT1" | "UT2">("none");

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [computedScores, setComputedScores] = useState<Record<string, number> | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user_scores");
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  const [highestGroup, setHighestGroup] = useState<{ name: string; score: number } | null>(null);
  const [appliedEquivNote, setAppliedEquivNote] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "A" | "B" | "C" | "D" | "X_TH">("all");

  // State phương thức 200 (Xét học bạ)
  const [selectedTranscriptGroup, setSelectedTranscriptGroup] = useState<string>("A00");
  
  const [semesterScores, setSemesterScores] = useState<Record<TranscriptSubjectKey, SubjectSemesterScores>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user_transcript_scores");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    const keys = Object.keys(TRANSCRIPT_SUBJECTS) as TranscriptSubjectKey[];
    const init: Partial<Record<TranscriptSubjectKey, SubjectSemesterScores>> = {};
    keys.forEach(k => {
      init[k] = { ...INITIAL_SEMESTER_SCORES };
    });
    return init as Record<TranscriptSubjectKey, SubjectSemesterScores>;
  });

  const [transcriptThptScores, setTranscriptThptScores] = useState<Record<string, string>>({});
  const [isTranscriptCalculated, setIsTranscriptCalculated] = useState(false);
  const [computedTranscriptData, setComputedTranscriptData] = useState<{
    totalScore: number;
    gpaSum: number;
    priorityScore: number;
    subjectAvgs: Record<TranscriptSubjectKey, number>;
  } | null>(null);

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

  // Thay đổi điểm học bạ
  const handleTranscriptScoreChange = (subKey: TranscriptSubjectKey, semKey: keyof SubjectSemesterScores, val: string) => {
    setSemesterScores(prev => ({
      ...prev,
      [subKey]: {
        ...prev[subKey],
        [semKey]: val
      }
    }));

    const errorKey = `${subKey}_${semKey}`;
    if (val !== "") {
      const numVal = parseFloat(val);
      if (isNaN(numVal) || numVal < 0 || numVal > 10) {
        setErrors(prev => ({ ...prev, [errorKey]: "Điểm từ 0 - 10" }));
      } else {
        setErrors(prev => {
          const copy = { ...prev };
          delete copy[errorKey];
          return copy;
        });
      }
    } else {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[errorKey];
        return copy;
      });
    }
  };

  const handleTranscriptThptChange = (subject: string, val: string) => {
    setTranscriptThptScores(prev => ({ ...prev, [subject]: val }));
  };

  // Tính điểm thi tốt nghiệp THPT
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

  // Tính điểm học bạ
  const handleCalculateTranscript = () => {
    const subjects = TRANSCRIPT_SUBJECT_GROUPS[selectedTranscriptGroup] || [];
    const newErrors: Record<string, string> = {};
    let hasEmptyField = false;

    subjects.forEach(sub => {
      const semObj = semesterScores[sub];
      Object.entries(semObj).forEach(([semKey, val]) => {
        const errorKey = `${sub}_${semKey}`;
        if (val === "") {
          newErrors[errorKey] = "Bắt buộc";
          hasEmptyField = true;
        } else {
          const num = parseFloat(val);
          if (isNaN(num) || num < 0 || num > 10) {
            newErrors[errorKey] = "Điểm từ 0 - 10";
          }
        }
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert(hasEmptyField ? "Vui lòng nhập đầy đủ điểm các học kỳ." : "Vui lòng kiểm tra lại điểm số.");
      return;
    }

    const subjectAvgs = {} as Record<TranscriptSubjectKey, number>;
    const keys = Object.keys(TRANSCRIPT_SUBJECTS) as TranscriptSubjectKey[];
    keys.forEach(k => {
      subjectAvgs[k] = calculateSubjectAverage(semesterScores[k]);
    });

    let areaScore = 0;
    if (areaPriority === "KV1") areaScore = 0.75;
    if (areaPriority === "KV2-NT") areaScore = 0.5;
    if (areaPriority === "KV2") areaScore = 0.25;

    let objectScore = 0;
    if (objectPriority === "UT1") objectScore = 2.0;
    if (objectPriority === "UT2") objectScore = 1.0;

    const basePriority = areaScore + objectScore;

    const result = calculateTranscriptScore(
      subjectAvgs,
      selectedTranscriptGroup,
      basePriority
    );

    setComputedTranscriptData({
      ...result,
      subjectAvgs
    });
    setIsTranscriptCalculated(true);

    localStorage.setItem("user_transcript_scores", JSON.stringify(semesterScores));
    localStorage.setItem("user_transcript_group", selectedTranscriptGroup);

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
  const subjectsInTranscriptGroup = TRANSCRIPT_SUBJECT_GROUPS[selectedTranscriptGroup] || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Công cụ tính điểm xét tuyển Đại học 2026 chính xác
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">
            Hỗ trợ tính điểm thi tốt nghiệp THPT hoặc điểm học bạ 6 học kỳ và đối sánh với điều kiện của các trường Đại học.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
          
          {/* Lựa chọn phương thức tính điểm */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase block">
              Phương thức tính điểm xét tuyển
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "THPT_EXAM", name: "Điểm thi tốt nghiệp THPT" },
                { id: "TRANSCRIPT", name: "Điểm học bạ THPT" }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCalculationMethod(item.id as "THPT_EXAM" | "TRANSCRIPT")}
                  className={`px-4 py-3 rounded-xl border text-center font-bold text-xs transition duration-150 cursor-pointer ${
                    calculationMethod === item.id
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-955/20 text-orange-600 dark:text-orange-500 shadow-sm"
                      : "border-slate-200 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          
          {calculationMethod === "THPT_EXAM" ? (
            <>
              <SubjectScoresInput
                scores={scores}
                errors={errors}
                otherLanguageType={otherLanguageType}
                setOtherLanguageType={setOtherLanguageType}
                handleScoreChange={handleScoreChange}
              />

              <div className="space-y-8 pt-6 border-t border-slate-100 dark:border-zinc-850">
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
            </>
          ) : (
            <>
              <TranscriptSelector
                selectedGroup={selectedTranscriptGroup}
                setSelectedGroup={setSelectedTranscriptGroup}
                semesterScores={semesterScores}
                errors={errors}
                handleScoreChange={handleTranscriptScoreChange}
                thptScores={transcriptThptScores}
                handleThptChange={handleTranscriptThptChange}
                subjectAvgs={computedTranscriptData?.subjectAvgs || {} as Record<TranscriptSubjectKey, number>}
                gpaSum={computedTranscriptData?.gpaSum || 0}
                priorityScore={computedTranscriptData?.priorityScore || 0}
                totalScore={computedTranscriptData?.totalScore || 0}
                isCalculated={isTranscriptCalculated}
                onCalculate={handleCalculateTranscript}
              />

              <div className="space-y-8 pt-6 border-t border-slate-100 dark:border-zinc-850">
                <PrioritySelector
                  areaPriority={areaPriority}
                  setAreaPriority={setAreaPriority}
                  objectPriority={objectPriority}
                  setObjectPriority={setObjectPriority}
                />
              </div>

              {isTranscriptCalculated && computedTranscriptData && (
                <TranscriptEligibilityList
                  selectedGroup={selectedTranscriptGroup}
                  userScore={computedTranscriptData.totalScore}
                  gpaSum={computedTranscriptData.gpaSum}
                  thptScores={transcriptThptScores}
                  subjects={subjectsInTranscriptGroup}
                />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
