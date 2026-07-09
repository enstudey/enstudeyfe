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

export default async function NganhHocListPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const initialPage = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;

  // Lọc lấy các bài viết thuộc danh mục nganh-hoc
  const posts = getAllPostsMetadata().filter((post) => post.category === "nganh-hoc");

  return <BlogListClient posts={posts} initialPage={initialPage} />;
}
