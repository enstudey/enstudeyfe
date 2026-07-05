import React from "react";
import { Metadata } from "next";
import { getAllPosts } from "@/lib/markdown";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Tin tức học thuật & Lộ trình ôn thi tiếng Anh - EnStudy",
  description: "Tổng hợp các phương pháp tự học tiếng Anh khoa học, cẩm nang luyện thi TOEIC, tài liệu ôn thi IELTS và kho tra cứu ngữ pháp tiếng Anh đầy đủ nhất.",
};

export default function BlogListPage() {
  const posts = getAllPosts();
  return <BlogListClient posts={posts} />;
}
