import { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "Blog Kinh nghiệm & Mẹo học tiếng Anh - EnStudey",
  description: "Chia sẻ phương pháp học từ vựng, mẹo làm đề thi TOEIC và IELTS thực chiến.",
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

export default function BlogListPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Blog Học Tiếng Anh</h1>
      <div className="flex gap-4 mb-8">
        <Link href="/blog" className="text-sm font-semibold bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200">
          Tất cả
        </Link>
        <Link href="/blog/category/skills" className="text-sm font-semibold bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200">
          Kỹ năng
        </Link>
        <Link href="/blog/category/tips" className="text-sm font-semibold bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200">
          Mẹo & Tips
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {MOCK_POSTS.map((post, idx) => (
          <React.Fragment key={post.slug}>
            <div className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                {post.category === "skills" ? "Kỹ năng" : "Mẹo & Tips"}
              </span>
              <h2 className="text-xl font-bold mt-2 mb-3">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {post.description}
              </p>
              <Link href={`/blog/${post.slug}`} className="text-sm text-blue-600 font-medium hover:underline">
                Đọc tiếp &rarr;
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

import React from "react";
