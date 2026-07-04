"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

const MOCK_POSTS = [
  {
    slug: "spaced-repetition-hoc-tu-vung",
    title: "Phương pháp Spaced Repetition (Lặp lại ngắt quãng) trong học từ vựng TOEIC",
    description: "Làm thế nào để nhớ hàng ngàn từ vựng TOEIC mà không bao giờ quên? Hãy tìm hiểu phương pháp lặp lại ngắt quãng.",
    category: "skills",
    readTime: "6 phút đọc",
    views: "1.2K lượt xem",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCy68J4o8dKl44S0VEuDO6Uw6yz7fEltv-vTcFQFEIYSKKEofQSjsD1o5uKdsIypOpMo5j7-nmNBxyDavkE3KjfLKNuGRXrFv6I0Sn5cveFI9AL4gb3FCa6i5S1fJz9937QelwGnW-FNlOxE1HHI4bhwS0Iz49TA3Sp30gs7vgu3lNfI0_xK5zax-D1qeuhUr6rgeWmv0zt6p5qMGgH8eS2W-O2CaElRHOPrWHHjFviy3frXKzVTI43nQ"
  },
  {
    slug: "5-meo-tranh-bay-part-1-toeic",
    title: "5 Mẹo tránh bẫy Part 1 TOEIC cực kỳ hiệu quả",
    description: "Part 1 TOEIC thường gài những bẫy âm thanh tương tự hoặc mô tả sai hành động. Xem ngay mẹo khắc phục.",
    category: "tips",
    readTime: "10 phút đọc",
    views: "2.5K lượt xem",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcbUCLlmHJpz1olxuK1bJhqBQ-3pQxo68NRwAc4up5scAw-CqHagJITXnfOIT9BYPgxnKDm6tLe93km7f9tL6QTPfHDggs-aOJwi7U-kxxiGJES1Y-_DI9wOg8WtrxAvgZ9IP_uL7vmnvFjP2_rzn7_syZIXKGHoQFAZjkIR09NE_Q0sRuObqf6UcnVnlIa2urKfqR7X6W2I_FNaFQi78zJmwWS7PBxpHqYgf3EGpgkPZa-BmgF0F1fg"
  },
  {
    slug: "cach-phan-bo-thoi-gian-reading-ielts",
    title: "Cách phân bổ thời gian làm bài Reading IELTS (Quy tắc 15-20-25)",
    description: "Làm thế nào để hoàn thành cả 3 đoạn văn Reading IELTS trong 60 phút mà vẫn đạt điểm tối đa?",
    category: "skills",
    readTime: "8 phút đọc",
    views: "1.8K lượt xem",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCy68J4o8dKl44S0VEuDO6Uw6yz7fEltv-vTcFQFEIYSKKEofQSjsD1o5uKdsIypOpMo5j7-nmNBxyDavkE3KjfLKNuGRXrFv6I0Sn5cveFI9AL4gb3FCa6i5S1fJz9937QelwGnW-FNlOxE1HHI4bhwS0Iz49TA3Sp30gs7vgu3lNfI0_xK5zax-D1qeuhUr6rgeWmv0zt6p5qMGgH8eS2W-O2CaElRHOPrWHHjFviy3frXKzVTI43nQ"
  }
];

export default function BlogListPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredPosts = selectedTab === "all"
    ? MOCK_POSTS
    : MOCK_POSTS.filter(post => post.category === selectedTab);

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
              <Link href="/tin-tuc" className="text-xs font-bold text-slate-950 dark:text-white border-b-2 border-orange-500 pb-1 uppercase tracking-wider">
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
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">Tin tức học thuật 🚀</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">Cập nhật lộ trình học tập, cẩm nang ngữ pháp tiếng Anh tuyển sinh.</p>
          </div>
        </div>

        {/* Categories filters */}
        <div className="flex gap-3">
          {[
            { id: "all", label: "Tất cả" },
            { id: "skills", label: "Kỹ năng" },
            { id: "tips", label: "Mẹo & Tips" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`text-xs font-bold px-4 py-2 rounded-full transition cursor-pointer ${
                selectedTab === tab.id
                  ? "bg-orange-600 text-white"
                  : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-55 dark:hover:bg-zinc-850"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-9 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post, idx) => (
                <React.Fragment key={post.slug}>
                  <div className="group bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-md transition duration-300 cursor-pointer flex flex-col">
                    <div className="h-44 overflow-hidden relative">
                      <Image
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        src={post.image}
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <span className="inline-block px-2.5 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                          {post.category === "skills" ? "#TOEIC GRAMMAR" : "#ADMISSIONS"}
                        </span>
                        <h2 className="text-base font-bold text-slate-950 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors line-clamp-2">
                          <Link href={`/tin-tuc/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>
                        <p className="text-slate-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                          {post.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                          <span>{post.readTime}</span>
                          <span>•</span>
                          <span>{post.views}</span>
                        </div>
                        <Link href={`/tin-tuc/${post.slug}`} className="text-xs font-bold text-orange-600 dark:text-orange-500 hover:underline">
                          Đọc tiếp &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                  {idx === 1 && (
                    <div className="col-span-full">
                      <div className="ad-container ad-h-banner w-full">
                        {/* Ads slots */}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 ad-container ad-sidebar w-full">
              {/* Ads slots */}
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
