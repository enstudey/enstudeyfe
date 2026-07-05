"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PostData } from "@/lib/markdown";

interface BlogListClientProps {
  posts: PostData[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [selectedTab, setSelectedTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 6;

  // Lọc bài viết theo category tab
  const filteredPosts = selectedTab === "all"
    ? posts
    : posts.filter(post => post.category === selectedTab);

  // Chỉ đọc URL search params khi component đã mounted ở client (Hydration Safety)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const pageVal = parseInt(params.get("page") || "1", 10);
      if (!isNaN(pageVal) && pageVal > 0) {
        setCurrentPage(pageVal);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  // Chuyển trang kết hợp cập nhật URL và smooth scroll lên đầu danh sách bài viết
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    
    // Cập nhật URL ngầm
    const newUrl = `${window.location.pathname}?page=${page}`;
    window.history.pushState(null, "", newUrl);

    // Đợi DOM cập nhật rồi mới cuộn mượt
    setTimeout(() => {
      const feedElement = document.getElementById("posts-feed");
      if (feedElement) {
        const yOffset = -80; // Bù trừ chiều cao Header cố định
        const y = feedElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50);
  };

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    setCurrentPage(1);
    const newUrl = window.location.pathname;
    window.history.pushState(null, "", newUrl);

    // Cuộn mượt khi đổi tab
    setTimeout(() => {
      const feedElement = document.getElementById("posts-feed");
      if (feedElement) {
        const yOffset = -80;
        const y = feedElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50);
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
                    <div className="group bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-md transition duration-300 cursor-pointer flex flex-col justify-between">
                      <div className="h-44 overflow-hidden relative">
                        <Image
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy68J4o8dKl44S0VEuDO6Uw6yz7fEltv-vTcFQFEIYSKKEofQSjsD1o5uKdsIypOpMo5j7-nmNBxyDavkE3KjfLKNuGRXrFv6I0Sn5cveFI9AL4gb3FCa6i5S1fJz9937QelwGnW-FNlOxE1HHI4bhwS0Iz49TA3Sp30gs7vgu3lNfI0_xK5zax-D1qeuhUr6rgeWmv0zt6p5qMGgH8eS2W-O2CaElRHOPrWHHjFviy3frXKzVTI43nQ"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <span className="inline-block px-2.5 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            #{post.category.toUpperCase()}
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
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                            <span>{post.date}</span>
                          </div>
                          <Link href={`/tin-tuc/${post.slug}`} className="text-xs font-bold text-orange-600 dark:text-orange-500 hover:underline">
                            Đọc tiếp &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                    {(idx === 1 || idx === 3) && idx < paginatedPosts.length - 1 && (
                      <div className="col-span-full py-2">
                        {/* Khung trống giữ chỗ chống CLS, Google AdSense Dashboard sẽ tự động chèn nhãn Quảng cáo đẹp mắt */}
                        <div className="ad-container ad-in-feed w-full min-h-[90px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl" />
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
              <div className="ad-container ad-bottom w-full min-h-[90px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl mt-8 mb-6">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
              </div>
            )}

            {/* Pagination Controls - Tối ưu hóa SEO & AdSense */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Link
                  href={`/tin-tuc?page=${currentPage - 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
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
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNumber);
                      }}
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
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
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
