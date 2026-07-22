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

export default async function FinderPage({ searchParams }: PageProps) {
  notFound();
  const resolvedParams = await searchParams;
  const initialPage = parsePageParam(resolvedParams?.page);

  // Đọc file JSON đồng bộ trên server (RSC-First)
  const dataPath = path.join(process.cwd(), "data", "diem_chuan_optimized.json");
  const fileContents = fs.readFileSync(dataPath, "utf8");
  const scoresData = JSON.parse(fileContents);

  return <FinderClient scoresData={scoresData} initialPage={initialPage} />;
}
