"use client";

import React, { useState } from "react";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import SubjectScoresInput from "./SubjectScoresInput";
import CertificateConverter from "./CertificateConverter";
import AffiliateCertWidget from "@/components/affiliate/AffiliateCertWidget";
import FreshmanAffiliateCard from "@/components/affiliate/FreshmanAffiliateCard";
import PrioritySelector from "./PrioritySelector";
import ResultDashboard from "./ResultDashboard";
import TranscriptSelector from "./TranscriptSelector";
import TranscriptResultDashboard from "./TranscriptResultDashboard";
import TranscriptEligibilityList from "./TranscriptEligibilityList";
import {
  calculateAllCombinations,
  TranscriptSubjectKey,
  SubjectSemesterScores,
  TRANSCRIPT_SUBJECTS,
  TRANSCRIPT_SUBJECT_GROUPS,
  formatInputScore,
  calculateAllTranscriptCombinations
} from "./utils";
import { useScoreValidation } from "@/hooks/useScoreValidation";

import { notFound } from "next/navigation";

const INITIAL_SEMESTER_SCORES: SubjectSemesterScores = {
  grade10_hk1: "",
  grade10_hk2: "",
  grade11_hk1: "",
  grade11_hk2: "",
  grade12_hk1: "",
  grade12_hk2: ""
};

export default function CalculatorPage() {
  notFound();
  const { validateScore, sanitizeInput } = useScoreValidation();

  // Lựa chọn phương thức xét tuyển
  const [calculationMethod, setCalculationMethod] = useState<"THPT_EXAM" | "TRANSCRIPT">("THPT_EXAM");

  // State phương thức 100 (Thi THPT) - Khôi phục từ LocalStorage
  const [scores, setScores] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user_raw_scores");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return {
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
    };
  });

  const [otherLanguageType, setOtherLanguageType] = useState<"Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian">("Korean");
  const [certType, setCertType] = useState<"none" | "ielts" | "toeic">("none");
  const [certScore, setCertScore] = useState("");
  const [conversionTarget, setConversionTarget] = useState<"standard" | "neu" | "ftu" | "hust" | "hcmut">("standard");
  const [areaPriority, setAreaPriority] = useState<"KV3" | "KV2" | "KV2-NT" | "KV1">("KV3");
  const [objectPriority, setObjectPriority] = useState<"none" | "UT1" | "UT2">("none");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // KHÔNG tự động hiển thị kết quả cũ khi tải trang (Đặt mặc định là null để bắt tính toán lại)
  const [computedScores, setComputedScores] = useState<Record<string, number> | null>(null);

  const [highestGroup, setHighestGroup] = useState<{ name: string; score: number } | null>(null);
  const [appliedEquivNote, setAppliedEquivNote] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "A" | "B" | "C" | "D" | "X_TH">("all");

  // State phương thức 200 (Xét học bạ)
  const [selectedTranscriptGroup, setSelectedTranscriptGroup] = useState<string>("A00");

  const [semesterScores, setSemesterScores] = useState<Record<TranscriptSubjectKey, SubjectSemesterScores>>(() => {
    const keys = Object.keys(TRANSCRIPT_SUBJECTS) as TranscriptSubjectKey[];
    const init = {} as Record<TranscriptSubjectKey, SubjectSemesterScores>;
    keys.forEach(k => {
      init[k] = { ...INITIAL_SEMESTER_SCORES };
    });
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("user_transcript_scores");
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...init, ...parsed };
        }
      } catch (e) {
        console.error(e);
      }
    }
    return init;
  });

  const [transcriptOtherLanguageType, setTranscriptOtherLanguageType] = useState<"Korean" | "Chinese" | "Japanese" | "French" | "German" | "Russian">("Korean");
  const [isTranscriptCalculated, setIsTranscriptCalculated] = useState(false);
  const [computedTranscriptData, setComputedTranscriptData] = useState<{
    results: Record<string, number>;
    highestGroup: { name: string; score: number } | null;
    subjectAvgs: Record<TranscriptSubjectKey, number>;
  } | null>(null);

  // Quản lý trạng thái mở rộng accordion của các nhóm môn học bạ ở cấp trang
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    required: true,
    natural: false,
    social: false,
    other: false
  });

  const handleScoreChange = (subject: keyof typeof scores, val: string) => {
    // Làm sạch và giới hạn 2 chữ số thập phân khi gõ
    const cleaned = sanitizeInput(val);
    const newScores = { ...scores, [subject]: cleaned };
    setScores(newScores);
    localStorage.setItem("user_raw_scores", JSON.stringify(newScores));

    if (errors[subject as string]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[subject as string];
        return copy;
      });
    }
  };

  const handleScoreBlur = (subject: keyof typeof scores, val: string) => {
    let formattedVal = val;
    if (/^\d+$/.test(val)) {
      formattedVal = formatInputScore(val);
    }

    const res = validateScore(formattedVal, "subject", false);
    const newScores = { ...scores, [subject]: res.cleanedVal };
    setScores(newScores);
    localStorage.setItem("user_raw_scores", JSON.stringify(newScores));

    if (res.isValid && errors[subject as string]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[subject as string];
        return copy;
      });
    }
  };

  // Thay đổi điểm học bạ
  const handleTranscriptScoreChange = (subKey: TranscriptSubjectKey, semKey: keyof SubjectSemesterScores, val: string) => {
    // Làm sạch và giới hạn 2 chữ số thập phân khi gõ
    const cleaned = sanitizeInput(val);
    const newSemesterScores = {
      ...semesterScores,
      [subKey]: {
        ...semesterScores[subKey],
        [semKey]: cleaned
      }
    };
    setSemesterScores(newSemesterScores);
    localStorage.setItem("user_transcript_scores", JSON.stringify(newSemesterScores));

    const errorKey = `${subKey}_${semKey}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[errorKey];
        return copy;
      });
    }
  };

  const handleTranscriptScoreBlur = (subKey: TranscriptSubjectKey, semKey: keyof SubjectSemesterScores, val: string) => {
    let formattedVal = val;
    if (/^\d+$/.test(val)) {
      formattedVal = formatInputScore(val);
    }

    const res = validateScore(formattedVal, "subject", false);
    const newSemesterScores = {
      ...semesterScores,
      [subKey]: {
        ...semesterScores[subKey],
        [semKey]: res.cleanedVal
      }
    };
    setSemesterScores(newSemesterScores);
    localStorage.setItem("user_transcript_scores", JSON.stringify(newSemesterScores));

    const errorKey = `${subKey}_${semKey}`;
    if (res.isValid && errors[errorKey]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[errorKey];
        return copy;
      });
    }
  };

  const handleReset = () => {
    if (calculationMethod === "THPT_EXAM") {
      const resetScores = {
        math: "", literature: "", english: "", otherLanguage: "",
        physics: "", chemistry: "", biology: "", history: "",
        geography: "", gdktpl: "", informatics: "", techIndustrial: "", techAgricultural: ""
      };
      setScores(resetScores);
      localStorage.removeItem("user_raw_scores");
      setComputedScores(null);
      setHighestGroup(null);
      setAppliedEquivNote(null);
    } else {
      const resetTranscript = {} as Record<TranscriptSubjectKey, SubjectSemesterScores>;
      (Object.keys(TRANSCRIPT_SUBJECTS) as TranscriptSubjectKey[]).forEach(key => {
        resetTranscript[key] = { ...INITIAL_SEMESTER_SCORES };
      });
      setSemesterScores(resetTranscript);
      localStorage.removeItem("user_transcript_scores");
      setIsTranscriptCalculated(false);
      setComputedTranscriptData(null);
      setExpandedGroups({
        required: true,
        natural: false,
        social: false,
        other: false
      });
    }
    setErrors({});
  };

  // Tính điểm thi tốt nghiệp THPT
  const handleCalculate = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(scores).forEach(([subj, val]) => {
      const valStr = val as string;
      const isRequired = subj === "math" || subj === "literature";
      const res = validateScore(valStr, "subject", isRequired);
      if (!res.isValid) {
        newErrors[subj] = res.error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Vui lòng kiểm tra lại các điểm số đã nhập.");

      // Tìm ô lỗi đầu tiên và cuộn màn hình tới
      const firstErrKey = Object.keys(newErrors)[0];
      if (firstErrKey) {
        setTimeout(() => {
          const el = document.getElementById(`input-score-${firstErrKey}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.focus();
          }
        }, 100);
      }
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
      toast.error("Vui lòng nhập điểm thi các môn để tính toán tổ hợp.");
      return;
    }

    const rawEnglish = parseFloat(scores.english) || 0;
    if (equivEnglish > 0 && equivEnglish > rawEnglish) {
      setAppliedEquivNote(`Đã áp dụng mức điểm quy đổi tối ưu (${equivEnglish.toFixed(1)} điểm) cho môn Tiếng Anh theo đề án trường.`);
    } else {
      setAppliedEquivNote(null);
    }

    setComputedScores(results);
    setHighestGroup(bestGroup);

    localStorage.setItem("user_raw_scores", JSON.stringify(scores));
    localStorage.setItem("user_scores", JSON.stringify(results));

    setTimeout(() => {
      const el = document.getElementById("result-area");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  // Tính điểm học bạ (toàn bộ tổ hợp)
  const handleCalculateTranscript = () => {
    const newErrors: Record<string, string> = {};
    const formattedSemesterScores = JSON.parse(JSON.stringify(semesterScores)) as Record<TranscriptSubjectKey, SubjectSemesterScores>;
    let hasAnyScore = false;

    Object.entries(semesterScores).forEach(([subKey, semObj]) => {
      const hasSomeScore = Object.values(semObj).some(val => val !== "");
      if (hasSomeScore) {
        hasAnyScore = true;
        Object.entries(semObj).forEach(([semKey, val]) => {
          let valStr = val as string;
          if (/^\d+$/.test(valStr)) {
            valStr = formatInputScore(valStr);
            formattedSemesterScores[subKey as TranscriptSubjectKey][semKey as keyof SubjectSemesterScores] = valStr;
          }

          const res = validateScore(valStr, "subject", true);
          if (!res.isValid) {
            newErrors[`${subKey}_${semKey}`] = res.error;
          } else {
            formattedSemesterScores[subKey as TranscriptSubjectKey][semKey as keyof SubjectSemesterScores] = res.cleanedVal;
          }
        });
      }
    });

    if (!hasAnyScore) {
      toast.error("Vui lòng nhập điểm học bạ các học kỳ để tính toán.");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSemesterScores(formattedSemesterScores);
      toast.error("Vui lòng kiểm tra lại các điểm số đã nhập.");

      // Tìm môn đầu tiên bị lỗi, tự động mở rộng accordion và cuộn tới ô input đó
      const firstErrKey = Object.keys(newErrors)[0]; // Định dạng: "physics_grade10_hk1"
      if (firstErrKey) {
        const [subKey] = firstErrKey.split("_");

        let groupId = "required";
        if (["physics", "chemistry", "biology"].includes(subKey)) {
          groupId = "natural";
        } else if (["history", "geography", "gdktpl"].includes(subKey)) {
          groupId = "social";
        } else if (["informatics", "techIndustrial", "techAgricultural", "otherLanguage"].includes(subKey)) {
          groupId = "other";
        }

        // Tự động mở rộng accordion
        setExpandedGroups(prev => ({ ...prev, [groupId]: true }));

        setTimeout(() => {
          const el = document.getElementById(`input-transcript-${firstErrKey}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.focus();
          }
        }, 150);
      }
      return;
    }

    const { results, highestGroup: bestGroup, subjectAvgs } = calculateAllTranscriptCombinations(
      formattedSemesterScores,
      transcriptOtherLanguageType,
      areaPriority,
      objectPriority
    );

    if (Object.keys(results).length === 0) {
      toast.error("Không tìm thấy tổ hợp hợp lệ nào. Vui lòng nhập điểm đầy đủ cho ít nhất một tổ hợp môn.");
      return;
    }

    setSemesterScores(formattedSemesterScores);
    setComputedTranscriptData({
      results,
      highestGroup: bestGroup,
      subjectAvgs
    });
    setIsTranscriptCalculated(true);

    if (bestGroup) {
      setSelectedTranscriptGroup(bestGroup.name);
    }

    localStorage.setItem("user_transcript_scores", JSON.stringify(formattedSemesterScores));
    localStorage.setItem("user_transcript_group", bestGroup ? bestGroup.name : "A00");

    setTimeout(() => {
      const el = document.getElementById("result-area");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  const getVisibleScores = () => {
    const scoresData = computedScores;
    if (!scoresData) return [];
    let list = Object.entries(scoresData);
    if (activeTab !== "all") {
      const testMapping: Record<string, string[]> = {
        A: ["A00", "A01", "A02", "A0T", "A0C", "A09", "A10", "A08", "AH2", "AH3", "AH4"],
        B: ["B00", "B08", "B03", "B01", "B02", "B04", "B0C"],
        C: ["C00", "C01", "C02", "C03", "C04", "C14", "C19", "C20", "C16", "C17", "C05", "C06", "C08"],
        D: ["D01", "D07", "D08", "D09", "D10", "D11", "D14", "D15", "D02", "D03", "D04", "D05", "D06", "DD2", "D66", "D84", "D85", "D87", "D0C", "DK"],
        X_TH: ["X01", "X21", "X25", "X70", "X74", "X02", "X06", "X10", "X26", "X46", "X03", "X07", "X12", "X27", "X28", "TH1", "TH3", "TH5", "TH6"]
      };
      const allowedList = testMapping[activeTab] || [];
      list = list.filter(([grp]) => allowedList.includes(grp));
    }
    return list;
  };

  const visibleScores = getVisibleScores();
  const subjectsInTranscriptGroup = TRANSCRIPT_SUBJECT_GROUPS[selectedTranscriptGroup] || [];
  const transcriptUserScore = computedTranscriptData?.results[selectedTranscriptGroup] ?? 0;
  const transcriptGpaSum = subjectsInTranscriptGroup.reduce((sum, sub) => sum + (computedTranscriptData?.subjectAvgs[sub] ?? 0), 0);

  return (
    <main className="py-12 w-full space-y-8 flex-grow">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Công cụ tính điểm xét tuyển Đại học 2026 chính xác
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Hỗ trợ tính điểm thi tốt nghiệp THPT hoặc điểm học bạ 6 học kỳ và đối sánh với điều kiện của các trường Đại học.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-8">

        {/* Lựa chọn phương thức tính điểm */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase block">
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
                className={`px-4 py-3 rounded-xl border text-center font-bold text-xs transition duration-150 cursor-pointer ${calculationMethod === item.id
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                  : "border-slate-200 hover:bg-slate-50 text-slate-650"
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
              handleScoreBlur={handleScoreBlur}
            />

            <div className="space-y-8 pt-6 border-t border-border">
              <CertificateConverter
                certType={certType}
                setCertType={setCertType}
                certScore={certScore}
                setCertScore={setCertScore}
                conversionTarget={conversionTarget}
                setConversionTarget={setConversionTarget}
              />

              <AffiliateCertWidget certType={certType} certScore={certScore} />

              <PrioritySelector
                areaPriority={areaPriority}
                setAreaPriority={setAreaPriority}
                objectPriority={objectPriority}
                setObjectPriority={setObjectPriority}
              />
            </div>

            <div className="pt-6 flex flex-wrap gap-4 items-center justify-center border-t border-border">
              <Button
                onClick={handleReset}
                data-testid="btn-reset-scores"
                variant="outline"
                className="px-6 py-5.5 font-bold rounded-2xl transition duration-200 text-sm sm:text-base"
              >
                Xóa nhập lại 🔄
              </Button>
              <Button
                onClick={handleCalculate}
                data-testid="btn-calculate-scores"
                className="px-8 py-5.5 font-bold rounded-2xl shadow-md hover:scale-[1.01] active:scale-98 transition duration-200 flex items-center gap-2 text-sm sm:text-base"
              >
                <span>Tính điểm xét tuyển</span>
                <span className="font-bold">⚡</span>
              </Button>
            </div>

            <ResultDashboard
              computedScores={computedScores}
              highestGroup={highestGroup}
              appliedEquivNote={appliedEquivNote}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              visibleScores={visibleScores}
            />

            {computedScores && <FreshmanAffiliateCard />}
          </>
        ) : (
          <>
            <TranscriptSelector
              selectedGroup={selectedTranscriptGroup}
              setSelectedGroup={setSelectedTranscriptGroup}
              semesterScores={semesterScores}
              errors={errors}
              handleScoreChange={handleTranscriptScoreChange}
              handleScoreBlur={handleTranscriptScoreBlur}
              onCalculate={handleCalculateTranscript}
              onReset={handleReset}
              otherLanguageType={transcriptOtherLanguageType}
              setOtherLanguageType={setTranscriptOtherLanguageType}
              expandedGroups={expandedGroups}
              setExpandedGroups={setExpandedGroups}
            />

            <div className="space-y-8 pt-6 border-t border-border">
              <PrioritySelector
                areaPriority={areaPriority}
                setAreaPriority={setAreaPriority}
                objectPriority={objectPriority}
                setObjectPriority={setObjectPriority}
              />
            </div>

            {isTranscriptCalculated && computedTranscriptData && (
              <>
                <TranscriptResultDashboard
                  computedScores={computedTranscriptData?.results ?? null}
                  highestGroup={computedTranscriptData?.highestGroup ?? null}
                  selectedGroup={selectedTranscriptGroup}
                  setSelectedGroup={setSelectedTranscriptGroup}
                />

                <TranscriptEligibilityList
                  selectedGroup={selectedTranscriptGroup}
                  userScore={transcriptUserScore}
                  gpaSum={transcriptGpaSum}
                  thptScores={{}}
                  subjects={subjectsInTranscriptGroup}
                />
              </>
            )}
          </>
        )}

      </div>
    </main>
  );
}
