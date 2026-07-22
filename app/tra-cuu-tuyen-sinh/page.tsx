import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import FinderClient from "./FinderClient";

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang | EnStudey",
  description: "Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển trên hệ thống EnStudey.",
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FinderPage({ searchParams }: PageProps) {
  notFound();
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const initialPage = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;

  // Đọc file JSON đồng bộ trên server (RSC-First)
  const dataPath = path.join(process.cwd(), "data", "diem_chuan_optimized.json");
  const fileContents = fs.readFileSync(dataPath, "utf8");
  const scoresData = JSON.parse(fileContents);

  return <FinderClient scoresData={scoresData} initialPage={initialPage} />;
}
