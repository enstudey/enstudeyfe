import React from "react";
import { Metadata } from "next";
import { getAllPostsMetadata } from "@/lib/markdown";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Review Ngành học & Hướng nghiệp đại học 2026 - EnStudey",
  description: "Tổng hợp các bài viết review chi tiết các ngành công nghệ thông tin, kinh tế, cơ hội việc làm, mức lương thực tế và cách chọn ngành học phù hợp.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function parsePageParam(pageParam: string | string[] | undefined): number {
  if (typeof pageParam === "string") {
    const parsed = parseInt(pageParam, 10);
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }
  if (Array.isArray(pageParam) && pageParam.length > 0) {
    const first = pageParam[0];
    if (typeof first === "string") {
      const parsed = parseInt(first, 10);
      return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
    }
  }
  return 1;
}

export default async function NganhHocListPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const initialPage = parsePageParam(resolvedParams?.page);

  // Lọc lấy các bài viết thuộc danh mục nganh-hoc
  const posts = getAllPostsMetadata().filter((post) => post.category === "nganh-hoc");

  return <BlogListClient posts={posts} initialPage={initialPage} />;
}
