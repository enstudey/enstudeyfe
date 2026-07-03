import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "Danh mục bài viết - Blog EnStudey",
  description: "Lọc các bài viết chia sẻ theo danh mục kỹ năng hoặc mẹo học tiếng Anh.",
};

const MOCK_POSTS = [
  {
    slug: "spaced-repetition-hoc-tu-vung",
    title: "Phương pháp Spaced Repetition (Lặp lại ngắt quãng) trong học từ vựng TOEIC",
    description: "Làm thế nào để nhớ hàng ngàn từ vựng TOEIC mà không bao giờ quên? Hãy tìm hiểu phương pháp lặp lại ngắt quãng.",
    category: "skills",
  },
  {
    slug: "5-meo-tranh-bay-part-1-toeic",
    title: "5 Mẹo tránh bẫy Part 1 TOEIC cực kỳ hiệu quả",
    description: "Part 1 TOEIC thường gài những bẫy âm thanh tương tự hoặc mô tả sai hành động. Xem ngay mẹo khắc phục.",
    category: "tips",
  },
  {
    slug: "cach-phan-bo-thoi-gian-reading-ielts",
    title: "Cách phân bổ thời gian làm bài Reading IELTS (Quy tắc 15-20-25)",
    description: "Làm thế nào để hoàn thành cả 3 đoạn văn Reading IELTS trong 60 phút mà vẫn đạt điểm tối đa?",
    category: "skills",
  },
];

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  const filteredPosts = MOCK_POSTS.filter(post => post.category === params.category);

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-slate-950 dark:text-white uppercase">
        Danh mục: {params.category === "skills" ? "Kỹ năng học thuật" : "Mẹo làm đề thi"}
      </h1>

      <div className="mb-8">
        <Link href="/blog" className="text-orange-600 dark:text-orange-500 hover:underline inline-flex items-center gap-1 font-medium">
          &larr; Tất cả bài viết nha
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredPosts.map((post, idx) => (
          <React.Fragment key={post.slug}>
            <div className="border border-slate-150 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-orange-500/30 dark:hover:border-orange-500/30 transition duration-300">
              <h2 className="text-xl font-bold mb-3 text-slate-950 dark:text-white">
                <Link href={`/blog/${post.slug}`} className="hover:text-orange-600 dark:hover:text-orange-500 transition duration-200">
                  {post.title}
                </Link>
              </h2>
              <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                {post.description}
              </p>
              <Link href={`/blog/${post.slug}`} className="text-sm text-orange-600 dark:text-orange-500 font-medium hover:underline inline-flex items-center gap-1">
                Đọc tiếp nha &rarr;
              </Link>
            </div>
            {idx === 1 && (
              <div className="col-span-full">
                <AdBanner />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </main>
  );
}

