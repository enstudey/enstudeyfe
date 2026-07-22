"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Exam } from "@/types/exam";
import { Button } from "@/components/ui/button";
import {
  Search,
  Sparkles,
  Clock,
  BookOpen,
  Headphones,
  FileText,
  Zap,
  Star,
  ShieldAlert,
  Flame,
  ArrowRight,
  RotateCw,
  X,
  ExternalLink,
  BookMarked,
  PlayCircle,
  Award,
  Layers,
  Filter,
  WifiOff,
} from "lucide-react";

interface ExamCatalogueClientProps {
  exams: Exam[];
  errorMsg?: string | null;
}

// Preset metadata mapping for rich EdTech 2026 preview
const EXAM_META_PRESETS: Record<
  string,
  {
    plays: string;
    rating: string;
    topics: string[];
    traps: string[];
    bestScore?: string;
    recommendation: { title: string; desc: string; linkText: string };
  }
> = {
  exam_toeic_enstudey_01: {
    plays: "14.2k",
    rating: "4.9",
    topics: ["#CloudMigration", "#FinTech", "#CyberSecurity"],
    traps: [
      "3 bẫy Self-Correction (Sửa lời nửa chừng) ở Listening Part 3",
      "2 bẫy Từ tuyệt đối (Always/Never) ở Reading Part 7",
      "Paraphrase từ đồng nghĩa đa tầng ở Part 6",
    ],
    bestScore: "865 / 990",
    recommendation: {
      title: "Gợi ý tài liệu: Bộ sách ETS TOEIC 2026 Full Test",
      desc: "Tài liệu giải thích bẫy tự động & từ vựng chuyên ngành công nghệ số.",
      linkText: "Xem chi tiết tài liệu",
    },
  },
  exam_toeic_enstudey_02: {
    plays: "11.8k",
    rating: "4.8",
    topics: ["#AutonomousLogistics", "#HybridWork", "#SmartContract"],
    traps: [
      "4 bẫy Đồng âm trùng từ (Homophone Trap) ở Part 2",
      "Bẫy Suy luận ngầm định (Implicit Inference) ở Part 7 Triple Passage",
      "Biến đổi ngữ cảnh thời gian thì Tương lai bị động ở Part 5",
    ],
    bestScore: "810 / 990",
    recommendation: {
      title: "Gợi ý tài liệu: Cẩm nang Bẫy Ngữ pháp TOEIC 900+",
      desc: "Phân tích 50 dạng bẫy trần thuật và hội thoại gián tiếp.",
      linkText: "Xem chi tiết tài liệu",
    },
  },
  exam_toeic_enstudey_03: {
    plays: "8.5k",
    rating: "5.0",
    topics: ["#FinTechSecurity", "#WarehouseRobotics", "#ESGAudit"],
    traps: [
      "Bẫy dữ liệu hóa đơn đối chiếu chéo (Cross-check PO & Receipt) ở Part 7",
      "Bẫy đổi ý người nói ở Listening Part 3 & Part 4",
      "Từ vựng quản trị rủi ro thuật toán tài chính nâng cao",
    ],
    bestScore: "Chưa thi",
    recommendation: {
      title: "Gợi ý tài liệu: Bộ Đề Dự Đoán ETS 2026 Mới Nhất",
      desc: "Cập nhật 100% bối cảnh doanh nghiệp chuyển đổi số 2026.",
      linkText: "Xem chi tiết tài liệu",
    },
  },
};

export default function ExamCatalogueClient({ exams, errorMsg }: ExamCatalogueClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCert, setSelectedCert] = useState<string>("ALL");
  const [selectedSkill, setSelectedSkill] = useState<string>("ALL");
  const [activePreviewId, setActivePreviewId] = useState<string | null>(
    exams.length > 0 ? exams[0].id : null
  );

  const previewDrawerRef = useRef<HTMLDivElement>(null);

  const handleSelectExam = (id: string) => {
    setActivePreviewId(id);
  };

  // Filtered Exam List
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      // Search text match
      const queryLower = searchQuery.toLowerCase().trim();
      const titleMatch = exam.title.toLowerCase().includes(queryLower);
      const typeMatch = exam.examType.toLowerCase().includes(queryLower);
      const meta = EXAM_META_PRESETS[exam.id];
      const topicMatch = meta?.topics.some((t) => t.toLowerCase().includes(queryLower));

      const isSearchMatched = !queryLower || titleMatch || typeMatch || topicMatch;

      // Cert match
      let isCertMatched = true;
      if (selectedCert === "TOEIC") isCertMatched = exam.examType === "TOEIC";
      if (selectedCert === "IELTS_ACADEMIC" || selectedCert === "IELTS_GENERAL") {
        isCertMatched = exam.examType === "IELTS";
      }

      // Skill match
      let isSkillMatched = true;
      if (selectedSkill === "LISTENING") isSkillMatched = exam.totalQuestions < 100;
      if (selectedSkill === "READING") isSkillMatched = exam.totalQuestions < 100;
      if (selectedSkill === "FULL_TEST") isSkillMatched = exam.totalQuestions >= 100;

      return isSearchMatched && isCertMatched && isSkillMatched;
    });
  }, [exams, searchQuery, selectedCert, selectedSkill]);

  // Active Preview Exam Details
  const activeExam = useMemo(() => {
    return exams.find((e) => e.id === activePreviewId) || exams[0] || null;
  }, [exams, activePreviewId]);

  const activeMeta = activeExam ? EXAM_META_PRESETS[activeExam.id] || {
    plays: "5.0k",
    rating: "4.8",
    topics: ["#ETS2026", "#FullTest"],
    traps: ["Bẫy từ đồng âm & từ tuyệt đối", "Paraphrase từ vựng đa nghĩa"],
    bestScore: "Chưa thi",
    recommendation: {
      title: "Gợi ý tài liệu: Sách Ôn Luyện Chuẩn ETS 2026",
      desc: "Tổng hợp bộ đề và lời giải chi tiết từ EnStudey AI.",
      linkText: "Xem chi tiết tài liệu",
    },
  } : null;

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* 1. Header Eyebrow & Spotlight Search Bar */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-5">
        {/* Top Eyebrow Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse shrink-0" />
          <span className="truncate">Hệ Thống Thi Thử Chuẩn Hóa ETS 2026</span>
        </div>

        {/* Top Row: Search & Cert Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Spotlight Search Input */}
          <div className="relative flex-grow max-w-xl">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm đề thi hoặc từ khóa (#FinTech, #TOEIC)..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 sm:py-3 text-xs md:text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Certificate Filter Pills */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl inline-flex items-center gap-1 border border-slate-200/80 dark:border-slate-800 overflow-x-auto no-scrollbar w-full lg:w-auto">
            {[
              { id: "ALL", label: "TẤT CẢ" },
              { id: "TOEIC", label: "TOEIC" },
              { id: "IELTS_ACADEMIC", label: "IELTS ACADEMIC" },
              { id: "IELTS_GENERAL", label: "IELTS GENERAL" },
            ].map((tab) => {
              const isActive = selectedCert === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCert(tab.id)}
                  className={`h-8 px-3.5 text-xs font-extrabold rounded-full transition whitespace-nowrap cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: Skill Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-850 pt-4 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] shrink-0 whitespace-nowrap">
              Kỹ năng:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {[
                { id: "ALL", label: "Tất cả dạng đề", icon: Layers },
                { id: "FULL_TEST", label: "Full-Test", icon: FileText },
                { id: "LISTENING", label: "Listening", icon: Headphones },
                { id: "READING", label: "Reading", icon: BookOpen },
              ].map((skill) => {
                const IconComp = skill.icon;
                const isActive = selectedSkill === skill.id;
                return (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill.id)}
                    className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition shrink-0 ${
                      isActive
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs"
                        : "bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5 shrink-0" />
                    <span>{skill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-slate-400 text-[11px] font-medium hidden sm:block">
            Hiển thị <strong className="text-slate-900 dark:text-white font-bold">{filteredExams.length}</strong> đề thi phù hợp
          </div>
        </div>
      </div>

      {/* 2. Main Layout: Bento Grid (Left) + Contextual Drawer (Right Sticky) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Bento Exam Grid (8 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {errorMsg ? (
            <div className="bg-white dark:bg-slate-950 border border-amber-200 dark:border-amber-900/40 p-8 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
                <WifiOff className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Không thể kết nối dữ liệu đề thi</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto">{errorMsg}</p>
              </div>
              <Button asChild size="sm" variant="outline" className="btn-sm rounded-xl font-bold">
                <Link href="/exam" className="inline-flex items-center justify-center gap-1.5 w-full h-full">
                  <RotateCw className="w-3.5 h-3.5 shrink-0" />
                  <span>Thử lại</span>
                </Link>
              </Button>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center shadow-sm space-y-4">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Chưa tìm thấy đề thi phù hợp</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục đề thi khác.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {filteredExams.map((exam) => {
                const meta = EXAM_META_PRESETS[exam.id] || {
                  plays: "5.2k",
                  rating: "4.8",
                  topics: ["#ETS2026", "#FullTest"],
                };
                const isSelected = activePreviewId === exam.id;
                const isTOEIC = exam.examType === "TOEIC";

                return (
                  <div
                    key={exam.id}
                    onClick={() => handleSelectExam(exam.id)}
                    className={`bg-white dark:bg-slate-950 border rounded-3xl p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full space-y-5 cursor-pointer group relative ${
                      isSelected
                        ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Header Thẻ: Badge & Social Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider text-white shadow-xs ${
                            isTOEIC ? "bg-slate-900 dark:bg-indigo-600" : "bg-orange-500"
                          }`}
                        >
                          {exam.examType}
                        </span>

                        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-lg">
                            <Flame className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>{meta.plays} lượt</span>
                          </span>
                          <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-lg font-bold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                            <span>{meta.rating}</span>
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {exam.title}
                      </h3>

                      {/* Topic Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {meta.topics.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Duration & Specs */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate leading-none">{Math.round(exam.durationSeconds / 60)} phút</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate leading-none">{exam.totalQuestions} câu</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Thẻ: Dual-Mode Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex flex-col sm:flex-row items-center gap-2">
                      {/* Nút 1: Luyện tập tự do */}
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-1/2 h-10 sm:h-9 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-95 transition-all p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href="/luyen-de" className="inline-flex items-center justify-center gap-1.5 w-full h-full px-3">
                          <PlayCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="whitespace-nowrap">Luyện tự do</span>
                        </Link>
                      </Button>

                      {/* Nút 2: Thi thử áp lực thật */}
                      <Button
                        asChild
                        size="sm"
                        className="w-full sm:w-1/2 h-10 sm:h-9 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95 transition-all p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/exam/${exam.id}`} className="inline-flex items-center justify-center gap-1.5 w-full h-full px-3">
                          <span className="whitespace-nowrap">Thi áp lực</span>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Contextual Preview Drawer (5 cols on lg - Sticky on Desktop, Bottom Drawer on Mobile) */}
        <div
          ref={previewDrawerRef}
          className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6 space-y-5"
        >
          {activeExam && activeMeta ? (
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
              {/* Drawer Header */}
              <div className="space-y-2 border-b border-slate-100 dark:border-slate-850 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900">
                    Khung xem nhanh bẫy đề
                  </span>
                  <span className="text-xs font-bold text-slate-400">ID: {activeExam.id}</span>
                </div>

                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                  {activeExam.title}
                </h2>
              </div>

              {/* 1. Chỉ số Bẫy Đề Thi (Trap Specs) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-slate-900 dark:text-white tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Chỉ số Bẫy Đề Thi (Trap Specs)</span>
                </div>

                <ul className="space-y-2">
                  {activeMeta.traps.map((trap, idx) => (
                    <li
                      key={idx}
                      className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 p-2.5 rounded-xl text-xs text-amber-900 dark:text-amber-300 font-medium flex items-start gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{trap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Bảng Lịch Sử Cá Nhân (Personal Best) */}
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Award className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Lịch sử cá nhân:</span>
                  </div>
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900">
                    {activeMeta.bestScore}
                  </span>
                </div>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full btn-sm rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-200/50 p-0"
                >
                  <Link href="/ngan-hang-cau-sai" className="inline-flex items-center justify-center gap-1.5 w-full h-full px-3">
                    <BookMarked className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="whitespace-nowrap">[ Ôn câu sai ] trong Mistake Bank</span>
                  </Link>
                </Button>
              </div>

              {/* 3. Native Recommendation Card (Shopee/Book Affiliate Safe-Zone per Compliance Rules 2026) */}
              <div className="bg-gradient-to-br from-indigo-50/70 to-slate-50 dark:from-indigo-950/30 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Gợi ý tài liệu ôn thi
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {activeMeta.recommendation.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {activeMeta.recommendation.desc}
                </p>
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer inline-flex items-center gap-1">
                    <span>{activeMeta.recommendation.linkText}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </span>
                </div>
              </div>

              {/* Drawer Primary Start Button */}
              <div className="pt-2">
                <Button
                  asChild
                  size="lg"
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-extrabold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none active:scale-95 transition-all p-0"
                >
                  <Link href={`/exam/${activeExam.id}`} className="inline-flex items-center justify-center gap-2 w-full h-full px-4">
                    <span>Bắt đầu bài thi ngay</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs">
              Chọn 1 đề thi từ danh sách bên trái để xem bẫy đề & lịch sử cá nhân.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
