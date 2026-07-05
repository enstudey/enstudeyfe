"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PostData } from "@/lib/markdown";
import { getCategoryFallbackImage } from "@/lib/images";

interface BlogListClientProps {
  posts: PostData[];
  initialPage: number;
}

export default function BlogListClient({ posts, initialPage }: BlogListClientProps) {
  const [selectedTab, setSelectedTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [prevInitialPage, setPrevInitialPage] = useState(initialPage);
  const POSTS_PER_PAGE = 6;

  // Render-phase derived state: đồng bộ currentPage khi initialPage từ Server Component thay đổi
  if (initialPage !== prevInitialPage) {
    setPrevInitialPage(initialPage);
    setCurrentPage(initialPage);
  }

  // Lọc bài viết theo category tab
  const filteredPosts = selectedTab === "all"
    ? posts
    : posts.filter(post => post.category === selectedTab);

  // Cuộn mượt lên đầu danh sách bài viết khi chuyển trang hoặc chuyển tab
  useEffect(() => {
    const feedElement = document.getElementById("posts-feed");
    if (feedElement) {
      const yOffset = -80; // Bù trừ chiều cao Header cố định
      const y = feedElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentPage, selectedTab]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    setCurrentPage(1);
    // Khi đổi tab, reset URL về trang 1
    const newUrl = `${window.location.pathname}?page=1`;
    window.history.pushState(null, "", newUrl);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">Tin tức học thuật 🚀</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">Cập nhật lộ trình học tập, cẩm nang ngữ pháp tiếng Anh tuyển sinh.</p>
          </div>
        </div>

        {/* 2. Leaderboard Ad: Ngay dưới tiêu đề trang, trên danh mục lọc */}
        <div className="ad-container ad-leaderboard w-full min-h-[90px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl py-2 mb-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
        </div>

        {/* Categories filters */}
        <div id="posts-feed" className="flex flex-wrap gap-3 scroll-mt-20">
          {[
            { id: "all", label: "Tất cả" },
            { id: "skills", label: "Phương pháp" },
            { id: "toeic", label: "TOEIC" },
            { id: "ielts", label: "IELTS" },
            { id: "grammar", label: "Ngữ pháp" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
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
          <div className="lg:col-span-9 space-y-8">
            {paginatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedPosts.map((post, idx) => (
                  <React.Fragment key={post.slug}>
                    <div className="relative group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl overflow-hidden hover:shadow-md transition duration-300 cursor-pointer flex flex-col justify-between">
                      <div className="h-44 overflow-hidden relative">


                        <Image
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          src={post.image || getCategoryFallbackImage(post.category)}
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <span className="inline-block px-2.5 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            #{post.category.toUpperCase()}
                          </span>
                          <h2 className="text-base font-bold text-slate-950 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors line-clamp-2">
                            <Link href={`/tin-tuc/${post.slug}`} className="after:absolute after:inset-0">
                              {post.title}
                            </Link>
                          </h2>
                          <p className="text-slate-500 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                            {post.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                            <span>{post.date}</span>
                          </div>
                          <span className="text-xs font-bold text-orange-600 dark:text-orange-500 group-hover:underline">
                            Đọc tiếp &rarr;
                          </span>
                        </div>
                      </div>
                    </div>

                    {(idx === 1 || idx === 3) && idx < paginatedPosts.length - 1 && (
                      <div className="col-span-full py-2">
                        {/* Khung trống giữ chỗ chống CLS, hiển thị nhãn Quảng cáo mờ */}
                        <div className="ad-container ad-in-feed w-full min-h-[90px] sm:min-h-[250px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-center">
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                Không tìm thấy bài viết nào.
              </div>
            )}

            {/* 3. Bottom Banner (Ngăn cách an toàn với thanh phân trang) */}
            {totalPages > 1 && (
              <div className="ad-container ad-bottom w-full min-h-[90px] sm:min-h-[250px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl mt-8 mb-6">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
              </div>
            )}

            {/* Pagination Controls - Tối ưu hóa SEO & AdSense (Crawlable) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Link
                  href={`/tin-tuc?page=${currentPage - 1}`}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-55 dark:hover:bg-zinc-800 transition ${
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  &larr; Trước
                </Link>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Link
                      key={pageNumber}
                      href={`/tin-tuc?page=${pageNumber}`}
                      className={`flex items-center justify-center w-8 h-8 text-xs font-bold rounded-lg transition ${
                        currentPage === pageNumber
                          ? "bg-orange-600 text-white"
                          : "border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}
                <Link
                  href={`/tin-tuc?page=${currentPage + 1}`}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-55 dark:hover:bg-zinc-800 transition ${
                    currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Sau &rarr;
                </Link>
              </div>
            )}
          </div>
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 ad-container ad-sidebar w-full min-h-[500px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
