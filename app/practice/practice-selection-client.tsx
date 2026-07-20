"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, BookOpen, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface PracticeSelectionClientProps {
  isGuest: boolean;
  googleLoginUrl: string;
}

export default function PracticeSelectionClient({ isGuest, googleLoginUrl }: PracticeSelectionClientProps) {
  const router = useRouter();
  const [examType, setExamType] = useState<"TOEIC" | "IELTS">("TOEIC");
  const [selectedPart, setSelectedPart] = useState<string>("Part5");
  const [limit, setLimit] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [mode, setMode] = useState<"PRACTICE" | "TEST">("PRACTICE");

  const toeicParts = [
    { value: "Part1", label: "Part 1: Mô tả tranh (Photos)", type: "Listening" },
    { value: "Part2", label: "Part 2: Hỏi & Đáp (Question-Response)", type: "Listening" },
    { value: "Part3", label: "Part 3: Hội thoại ngắn (Short Conversations)", type: "Listening" },
    { value: "Part4", label: "Part 4: Bài nói ngắn (Short Talks)", type: "Listening" },
    { value: "Part5", label: "Part 5: Điền vào chỗ trống (Incomplete Sentences)", type: "Reading" },
    { value: "Part6", label: "Part 6: Điền vào đoạn văn (Text Completion)", type: "Reading" },
    { value: "Part7", label: "Part 7: Đọc hiểu văn bản (Reading Comprehension)", type: "Reading" }
  ];

  const ieltsParts = [
    { value: "Part1", label: "Listening Part 1: Đàm thoại đời sống", type: "Listening" },
    { value: "Part2", label: "Listening Part 2: Độc thoại đời sống", type: "Listening" },
    { value: "Part3", label: "Listening Part 3: Thảo luận giáo dục", type: "Listening" },
    { value: "Part4", label: "Listening Part 4: Bài giảng học thuật", type: "Listening" },
    { value: "Passage1", label: "Reading Passage 1: Bài đọc mô tả đơn giản", type: "Reading" },
    { value: "Passage2", label: "Reading Passage 2: Bài đọc nghị luận phức tạp", type: "Reading" },
    { value: "Passage3", label: "Reading Passage 3: Văn bản học thuật nâng cao", type: "Reading" }
  ];

  const handleExamTypeChange = (type: "TOEIC" | "IELTS") => {
    setExamType(type);
    setSelectedPart(type === "TOEIC" ? "Part5" : "Part1");
  };


  const handleStart = () => {
    const query = new URLSearchParams({
      examType,
      part: selectedPart,
      difficulty,
      limit: limit.toString(),
      mode
    });
    router.push(`/practice/session?${query.toString()}`);
  };

  const currentParts = examType === "TOEIC" ? toeicParts : ieltsParts;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-10">
      {/* Header Info */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950/30 border border-sky-200/50 px-4 py-1.5 rounded-full text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
          <span>Luyện tập tập trung - Nâng cao phản xạ</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Luyện Tập Theo Phần
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
          Lựa chọn Part/Section bạn muốn ôn tập, cấu hình số câu hỏi và độ khó để bắt đầu phiên luyện tập thích ứng thông minh.
        </p>
      </div>

      {/* Guest Mode Alert */}
      {isGuest && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-300 rounded-2xl p-4 flex items-start gap-3 text-left max-w-2xl mx-auto text-xs md:text-sm font-medium">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            Bạn đang sử dụng hệ thống với tư cách khách vãng lai. Lịch sử luyện tập sẽ chỉ được lưu tạm tại trình duyệt và <strong>không đồng bộ sang Mistake Bank</strong>. Để lưu vết tiến độ bền vững, hãy{" "}
            <a href={googleLoginUrl} className="underline font-bold text-sky-600 dark:text-sky-400 hover:opacity-90">
              Đăng nhập Google ngay
            </a>.
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 md:p-8 shadow-sm space-y-8 max-w-3xl mx-auto">
        {/* 1. Chọn loại chứng chỉ (Tabs) */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            1. Chọn chứng chỉ mục tiêu
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleExamTypeChange("TOEIC")}
              className={`py-4 px-6 rounded-2xl border text-center transition font-bold text-sm cursor-pointer ${examType === "TOEIC"
                  ? "bg-sky-55/10 border-sky-600 text-sky-650 dark:bg-sky-950/20 dark:text-sky-400"
                  : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300"
                }`}
            >
              TOEIC Reading / Listening
            </button>
            <button
              onClick={() => handleExamTypeChange("IELTS")}
              className={`py-4 px-6 rounded-2xl border text-center transition font-bold text-sm cursor-pointer ${examType === "IELTS"
                  ? "bg-emerald-55/10 border-emerald-600 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400"
                  : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:border-emerald-300"
                }`}
            >
              IELTS Academic Prep
            </button>
          </div>
        </div>

        {/* 2. Chọn Part / Section */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            2. Chọn phần luyện tập cụ thể
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {currentParts.map((p) => (
              <button
                key={p.value}
                onClick={() => setSelectedPart(p.value)}
                className={`py-3 px-4 rounded-xl border text-left transition flex items-center justify-between text-xs cursor-pointer ${selectedPart === p.value
                    ? "bg-sky-50/50 dark:bg-sky-950/10 border-sky-500 text-sky-750 dark:text-sky-400 font-bold"
                    : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  }`}
              >
                <span>{p.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.type === "Listening"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                  }`}>
                  {p.type === "Listening" ? "Nghe" : "Đọc"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Cấu hình tham số (Độ khó & Số câu) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Độ khó */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              3. Chọn độ khó
            </label>
            <div className="flex gap-2">
              {(["EASY", "MEDIUM", "HARD"] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${difficulty === diff
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-150"
                      : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    }`}
                >
                  {diff === "EASY" ? "Dễ" : diff === "MEDIUM" ? "Trung bình" : "Khó"}
                </button>
              ))}
            </div>
          </div>

          {/* Số lượng câu */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              4. Số lượng câu hỏi
            </label>
            <div className="flex gap-2">
              {([10, 20, 30] as const).map((num) => (
                <button
                  key={num}
                  onClick={() => setLimit(num)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition text-center cursor-pointer ${limit === num
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-150"
                      : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Chọn chế độ ôn tập */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            5. Chế độ luyện tập
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chế độ ôn luyện */}
            <button
              onClick={() => setMode("PRACTICE")}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer space-y-2 ${mode === "PRACTICE"
                  ? "bg-sky-50/30 border-sky-500 text-sky-750 dark:text-sky-400"
                  : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
            >
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 shrink-0" />
                <span className="font-bold text-xs">Chế độ ôn luyện</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Xem ngay đáp án đúng/sai và lời giải thích chi tiết ngay sau khi chọn đáp án cho từng câu hỏi. Tốc độ thoải mái.
              </p>
            </button>

            {/* Chế độ thi thử */}
            <button
              onClick={() => setMode("TEST")}
              className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer space-y-2 ${mode === "TEST"
                  ? "bg-sky-50/30 border-sky-500 text-sky-750 dark:text-sky-400"
                  : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 shrink-0" />
                <span className="font-bold text-xs">Chế độ thi thử ngắn</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Ẩn đáp án trong suốt phiên làm bài, có đồng hồ đếm ngược (2 phút/câu) và hiển thị điểm số, giải thích sau khi nộp bài.
              </p>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/dashboard" className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline font-medium">
            Quay lại Dashboard
          </Link>
          <Button
            onClick={handleStart}
            size="lg"
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold py-6 px-8 rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] transition"
          >
            <span>Bắt đầu phiên học</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Button>
        </div>
      </div>

      {/* Gamification Grammar Swipe card */}
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-sky-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="space-y-3 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Game học tập thú vị
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">Grammar Swipe (Vuốt Ngữ Pháp)</h2>
          <p className="text-white/80 text-xs md:text-sm max-w-md leading-relaxed font-medium">
            Luyện phản xạ nhận diện lỗi ngữ pháp tức thì bằng thao tác vuốt thẻ Tinder-style Đúng/Sai cực kỳ gây nghiện. Luyện nhanh 15 câu, tích lũy XP và làm chủ Sổ tay câu sai.
          </p>
        </div>
        <Button
          onClick={() => router.push("/practice/grammar-swipe")}
          className="w-full md:w-auto bg-white text-sky-600 hover:bg-slate-100 font-bold py-6 px-8 rounded-2xl cursor-pointer shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] transition"
        >
          <span>Trải nghiệm ngay</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Button>
      </div>
    </main>
  );
}
