"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const FAQ_ITEMS = [
  {
    q: "Làm thế nào để tính điểm xét tuyển đại học chính xác nhất?",
    a: "Điểm xét tuyển đại học thường bằng tổng điểm 3 môn thi THPT thuộc tổ hợp xét tuyển (ví dụ Toán - Lý - Hóa đối với khối A00) cộng với điểm ưu tiên đối tượng và điểm ưu tiên khu vực nếu có. Bạn có thể sử dụng trực tiếp công cụ tính điểm tại trang '/tinh-diem' để tính điểm nhanh chóng và chính xác."
  },
  {
    q: "Quy chế cộng điểm ưu tiên khu vực năm nay như thế nào?",
    a: "Theo quy chế của Bộ Giáo dục và Đào tạo, mức cộng điểm ưu tiên đối với các khu vực như sau: Khu vực 1 (KV1) được cộng 0.75 điểm; Khu vực 2 nông thôn (KV2-NT) được cộng 0.5 điểm; Khu vực 2 (KV2) được cộng 0.25 điểm; Khu vực 3 (KV3) không được cộng điểm ưu tiên."
  },
  {
    q: "Cách sắp xếp thứ tự các nguyện vọng đại học thông minh để tránh bị trượt?",
    a: "Bạn nên sắp xếp nguyện vọng yêu thích nhất lên đầu (Nguyện vọng 1). Hệ thống tuyển sinh sẽ xét tuyển lần lượt từ trên xuống dưới. Nếu bạn đã đỗ ở nguyện vọng trên, các nguyện vọng dưới sẽ tự động bị hủy bỏ. Hãy sử dụng bộ lọc tại trang '/tra-cuu-truong-dai-hoc' để phân tích và rải đều các nguyện vọng vào Vùng an toàn (Safe) và Vùng cọ xát (Fight)."
  },
  {
    q: "Tôi có thể thay đổi nguyện vọng sau khi biết điểm thi không?",
    a: "Có, sau khi có điểm thi tốt nghiệp THPT, Bộ Giáo dục và Đào tạo sẽ mở hệ thống cổng thông tin tuyển sinh quốc gia để thí sinh điều chỉnh, bổ sung và sắp xếp lại các nguyện vọng xét tuyển đại học trong thời gian quy định."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-2xl text-slate-950 dark:text-white tracking-tight">
              EnStudy
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/tin-tuc" className="text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors uppercase tracking-wider">
                Tin tức học thuật
              </Link>
              <Link href="/tinh-diem" className="text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors uppercase tracking-wider">
                Công cụ tính điểm
              </Link>
              <Link href="/tra-cuu-truong-dai-hoc" className="text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors uppercase tracking-wider">
                Tra cứu trường đại học
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-zinc-700 relative">
              <Image
                alt="Student avatar"
                fill
                sizes="32px"
                className="object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjghjyecPinfjIHMict2_kkli8HFkdKMaDr8VbTZGtaddaraGLrRiCkdV8QyB31wpQ9ezCMUTmPsl2UTMeWYFNZhm2knAWrGxu1F1jcp5h3m325xEViW3RF7NzHMEmcJeKngME5eug8vubbBgqlY7yx1PbIblqunhE1xNI4U0npKdg6FajzjUgBD1gkPaHydLxssd7BEWnkVIbmpnAz0srU9xBcDf0kAz06rDdw6HDHpSEk7O0oWwSaw"
              />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">Hỏi đáp thường gặp về chọn ngành & chọn trường 💬</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">
            Giải đáp toàn bộ thắc mắc phổ biến của thí sinh lớp 12 về quy chế tuyển sinh đại học.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-sm transition cursor-pointer"
              onClick={() => toggleFAQ(idx)}
            >
              <div className="flex justify-between items-center gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{item.q}</h3>
                <span className="text-xl text-slate-400">{openIndex === idx ? "−" : "+"}</span>
              </div>
              {openIndex === idx && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800 text-sm text-slate-650 dark:text-zinc-400 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Anti-CLS Ad Container */}
        <div className="ad-container ad-v-block w-full">
          {/* AdSlot */}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
