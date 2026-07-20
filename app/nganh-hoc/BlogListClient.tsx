"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PostData } from "@/lib/markdown";
import { getCategoryFallbackImage } from "@/lib/images";
import AffiliateSidebarWidget from "@/components/affiliate/AffiliateSidebarWidget";

interface BlogListClientProps {
  posts: PostData[];
  initialPage: number;
}

export default function BlogListClient({ posts, initialPage }: BlogListClientProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [prevInitialPage, setPrevInitialPage] = useState(initialPage);
  const POSTS_PER_PAGE = 6;

  if (initialPage !== prevInitialPage) {
    setPrevInitialPage(initialPage);
    setCurrentPage(initialPage);
  }

  useEffect(() => {
    const feedElement = document.getElementById("posts-feed");
    if (feedElement) {
      const yOffset = -80;
      const y = feedElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentPage]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <main className="py-12 flex-grow w-full space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Review Ngành học & Hướng nghiệp 🎓</h1>
          <p className="text-slate-500 text-sm mt-1">
            Tổng hợp các bài viết review chi tiết về ngành học, cơ hội việc làm, mức lương thực tế và định hướng tương lai.
          </p>
        </div>

        {/* Banner Ad Slot */}
        <div className="ad-container ad-leaderboard w-full min-h-[90px] bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center rounded-xl py-2 mb-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 select-none font-semibold">Quảng cáo</span>
        </div>

        <div id="posts-feed" className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col h-full"
                >
                  <div className="relative w-full h-48 overflow-hidden bg-slate-50">
                    <Image
                      src={post.image || getCategoryFallbackImage(post.category)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 350px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest">
                        Ngành học
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug hover:text-sky-600 transition">
                        <Link href={`/nganh-hoc/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-400 font-semibold">
                      <span>{post.date}</span>
                      <Link href={`/nganh-hoc/${post.slug}`} className="text-sky-600 hover:underline">
                        Đọc chi tiết &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6 border-t border-slate-200">
                <Link
                  href={`/nganh-hoc?page=${currentPage - 1}`}
                  className={`px-3 py-2 text-xs font-bold rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                >
                  &larr;&nbsp;<span className="hidden sm:inline">Trước</span>
                </Link>

                {(() => {
                  const range = [];
                  for (let i = 1; i <= totalPages; i++) {
                    range.push(i);
                  }
                  return range.map((item) => (
                    <Link
                      key={item}
                      href={`/nganh-hoc?page=${item}`}
                      className={`flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full transition ${currentPage === item
                          ? "bg-sky-600 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-55"
                        }`}
                    >
                      {item}
                    </Link>
                  ));
                })()}

                <Link
                  href={`/nganh-hoc?page=${currentPage + 1}`}
                  className={`px-3 py-2 text-xs font-bold rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                    }`}
                >
                  <span className="hidden sm:inline">Sau&nbsp;</span>&rarr;
                </Link>
              </div>
            )}
          </div>

          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <AffiliateSidebarWidget currentPage={currentPage} />
              {/* Sidebar Ad Slot */}
              <div className="ad-container ad-sidebar w-full min-h-[500px] bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center rounded-xl">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 select-none font-semibold">Quảng cáo</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
  );
}
