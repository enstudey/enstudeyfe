import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/ads/AdBanner";
import { getAllPosts } from "@/lib/markdown";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import CategoryIcon from "@/components/category-icon";

export const metadata: Metadata = {
  title: "Blog Kinh nghiệm & Mẹo học tiếng Anh - EnStudey",
  description: "Chia sẻ phương pháp học từ vựng, mẹo làm đề thi TOEIC và IELTS thực chiến.",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-950 dark:text-white">Blog Học Tiếng Anh</h1>
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/blog" className="text-sm font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 px-4 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700 transition">
          Tất cả
        </Link>
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.slug}
            href={`/blog/category/${cat.slug}`} 
            className="inline-flex items-center gap-1.5 text-sm font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 px-4 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700 transition"
          >
            <CategoryIcon icon={cat.icon} iconType={cat.iconType} size={14} />
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post, idx) => {
          const cat = getCategoryBySlug(post.category);
          return (
            <React.Fragment key={post.slug}>
              <div className="border border-slate-150 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/30 dark:hover:border-orange-500/30 transition duration-300">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-500 uppercase tracking-wider">
                  {cat && <CategoryIcon icon={cat.icon} iconType={cat.iconType} size={12} />}
                  {cat ? cat.name : post.category}
                </span>
                <h2 className="text-xl font-bold mt-2 mb-3 text-slate-950 dark:text-white">
                  <Link href={`/blog/${post.category}/${post.slug}`} className="hover:text-orange-600 dark:hover:text-orange-500 transition duration-200">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-slate-650 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                  {post.description}
                </p>
                <Link href={`/blog/${post.category}/${post.slug}`} className="text-sm text-orange-600 dark:text-orange-500 font-medium hover:underline inline-flex items-center gap-1">
                  Đọc tiếp &rarr;
                </Link>
              </div>
              {idx === 1 && (
                <div className="col-span-full">
                  <AdBanner />
                </div>
              )}
            </React.Fragment>
          );
        })}
        {posts.length === 0 && (
          <p className="text-slate-500 col-span-full">Không tìm thấy bài viết nào.</p>
        )}
      </div>
    </main>
  );
}


