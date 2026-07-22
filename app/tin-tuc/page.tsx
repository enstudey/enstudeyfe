import React from "react";
import { Metadata } from "next";
import { getAllPostsMetadata } from "@/lib/markdown";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Tin tức học thuật & Lộ trình ôn thi tiếng Anh - EnStudy",
  description: "Tổng hợp các phương pháp tự học tiếng Anh khoa học, cẩm nang luyện thi TOEIC, tài liệu ôn thi IELTS và kho tra cứu ngữ pháp tiếng Anh đầy đủ.",
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

export default async function BlogListPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const initialPage = parsePageParam(resolvedParams?.page);

  const posts = getAllPostsMetadata();
  return <BlogListClient posts={posts} initialPage={initialPage} />;
}
