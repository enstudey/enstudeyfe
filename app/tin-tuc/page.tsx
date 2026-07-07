import React from "react";
import { Metadata } from "next";
import { getAllPostsMetadata } from "@/lib/markdown";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Tin tức học thuật & Lộ trình ôn thi tiếng Anh - EnStudy",
  description: "Tổng hợp các phương pháp tự học tiếng Anh khoa học, cẩm nang luyện thi TOEIC, tài liệu ôn thi IELTS và kho tra cứu ngữ pháp tiếng Anh đầy đủ nhất.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogListPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const initialPage = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;

  const posts = getAllPostsMetadata();
  return <BlogListClient posts={posts} initialPage={initialPage} />;
}
