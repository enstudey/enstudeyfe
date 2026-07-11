import fs from "fs";
import path from "path";
import { Metadata } from "next";
import FinderClient from "./FinderClient";

export const metadata: Metadata = {
  title: "Hệ thống tra cứu nguyện vọng thông minh 2026 - EnStudey",
  description: "Gợi ý các trường Đại học, ngành học và phân tích tổ hợp môn xét tuyển tối ưu theo khoảng điểm thi tốt nghiệp THPT.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FinderPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const pageParam = resolvedSearchParams.page;
  const initialPage = typeof pageParam === "string" ? parseInt(pageParam, 10) : 1;

  // Đọc file JSON đồng bộ trên server (RSC-First)
  const dataPath = path.join(process.cwd(), "data", "diem_chuan_optimized.json");
  const fileContents = fs.readFileSync(dataPath, "utf8");
  const scoresData = JSON.parse(fileContents);

  return <FinderClient scoresData={scoresData} initialPage={initialPage} />;
}
