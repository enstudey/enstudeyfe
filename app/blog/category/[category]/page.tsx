import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import AdBanner from "@/components/ads/AdBanner";
import { getCategoryBySlug } from "@/lib/categories";
import CategoryIcon from "@/components/category-icon";

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

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const cat = getCategoryBySlug(resolvedParams.category);
  const filteredPosts = MOCK_POSTS.filter(post => post.category === resolvedParams.category);

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 bg-white text-slate-900 min-h-screen">
      <h1 className="inline-flex items-center gap-2.5 text-3xl font-bold mb-6 text-slate-950">
        {cat && <CategoryIcon icon={cat.icon} iconType={cat.iconType} size={30} />}
        Danh mục: {cat ? cat.name : resolvedParams.category}
      </h1>

      <div className="mb-8">
        <Link href="/blog" className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium">
          &larr; Tất cả bài viết nha
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredPosts.map((post, idx) => (
          <React.Fragment key={post.slug}>
            <div className="border border-slate-150 bg-slate-50/50 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-500/30 transition duration-300">
              <h2 className="text-xl font-bold mb-3 text-slate-955">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition duration-200">
                  {post.title}
                </Link>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {post.description}
              </p>
              <Link href={`/blog/${post.slug}`} className="text-sm text-blue-600 font-medium hover:underline inline-flex items-center gap-1">
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
