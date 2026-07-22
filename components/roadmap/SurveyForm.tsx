"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoadmapItem, TargetAudience } from "@/types/roadmap";
import { Sprout, GraduationCap, Briefcase, BookOpen } from "lucide-react";

interface SurveyFormProps {
  roadmaps: RoadmapItem[];
}

export function SurveyForm({ roadmaps }: SurveyFormProps) {
  const router = useRouter();
  const [selectedAudience, setSelectedAudience] = useState<TargetAudience>("SINH_VIEN");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const audienceOptions: { key: TargetAudience; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: "MAT_GOC",
      title: "Người Mất Gốc",
      desc: "Bắt đầu lại từ con số 0, lấy lại nền tảng từ vựng & ngữ pháp căn bản.",
      icon: <Sprout className="w-8 h-8 text-emerald-500 shrink-0" />
    },
    {
      key: "SINH_VIEN",
      title: "Sinh Viên (TOEIC 500+ / 750+)",
      desc: "Luyện thi chứng chỉ đáp ứng chuẩn đầu ra đại học và nâng cao phản xạ.",
      icon: <GraduationCap className="w-8 h-8 text-indigo-500 shrink-0" />
    },
    {
      key: "NGUOI_DI_LAM",
      title: "Người Đi Làm (Giao Tiếp & IELTS)",
      desc: "Nâng cao vốn từ vựng chuyên ngành, nói lưu khoát phục vụ công việc.",
      icon: <Briefcase className="w-8 h-8 text-indigo-500 shrink-0" />
    },
    {
      key: "HOC_SINH",
      title: "Học Sinh THPT",
      desc: "Ôn thi tốt nghiệp THPT Quốc Gia và đánh giá năng lực.",
      icon: <BookOpen className="w-8 h-8 text-rose-500 shrink-0" />
    }
  ];

  const handleSelect = async () => {
    setIsSubmitting(true);
    try {
      // Find matching roadmap or pick default
      const matched = roadmaps.find((r) => r.targetAudience === selectedAudience) || roadmaps[0];
      const targetId = matched ? matched.roadmapId : "rd-toeic-750";

      const res = await fetch("/api/roadmaps/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId: targetId })
      });

      if (res.ok) {
        router.push("/lo-trinh");
        router.refresh();
      } else {
        alert("Không thể thiết lập lộ trình. Vui lòng thử lại sau.");
      }
    } catch {
      alert("Đã xảy ra lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-card border border-border p-6 md:p-10 shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
          Khảo Sát Khởi Đầu Lộ Trình Học Tập
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Hãy chọn đối tượng và mục tiêu của bạn để EnStudey đề xuất bản đồ học tập phù hợp nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {audienceOptions.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setSelectedAudience(item.key)}
            className={`flex items-start gap-4 p-5 rounded-card border text-left transition-all ${selectedAudience === item.key
              ? "bg-indigo-50/30 border-primary dark:bg-indigo-950/20 dark:border-primary ring-2 ring-primary/10"
              : "bg-white border-border hover:border-zinc-300 dark:bg-zinc-800/40 dark:border-zinc-700/60"
              }`}
          >
            <div className="p-1 bg-slate-50 dark:bg-zinc-800 rounded-xl">
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSelect}
          className="px-8 py-3.5 bg-primary hover:bg-indigo-600 text-white font-semibold rounded-btn shadow-md transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Đang Khởi Tạo Lộ Trình..." : "Kích Hoạt Lộ Trình Ngay →"}
        </button>
      </div>
    </div>
  );
}
