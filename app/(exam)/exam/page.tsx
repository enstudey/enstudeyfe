import { Metadata } from "next";
import { cookies } from "next/headers";
import { getExams } from "@/lib/api/exam";
import { Exam } from "@/types/exam";
import ExamCatalogueClient from "./exam-catalogue-client";

export const metadata: Metadata = {
  title: "Trang Danh Sách Đề Thi (Exam Catalogue / Test Hub) | EnStudey",
  description: "Thi thử TOEIC 200 câu & IELTS chuẩn hóa theo cấu trúc ETS 2026 dưới áp lực thời gian thực tế, chấm điểm tự động và giải thích chi tiết bẫy đề thi.",
};

export default async function ExamsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let exams: Exam[] = [];
  let errorMsg: string | null = null;

  try {
    const res = await getExams(0, 50, token);
    exams = res.data || [];
  } catch (err) {
    console.error("Failed to fetch exams list", err);
    errorMsg = "Kết nối đến hệ thống đề thi tạm thời bị gián đoạn. Vui lòng làm mới trang hoặc thử lại sau ít phút.";
  }

  return (
    <main className="w-full py-8 flex-grow">
      <ExamCatalogueClient exams={exams} errorMsg={errorMsg} />
    </main>
  );
}
