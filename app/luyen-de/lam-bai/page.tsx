import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PracticeSession from "@/components/practice/PracticeSession";

export async function generateMetadata({ searchParams }: SessionPageProps): Promise<Metadata> {
  const params = await searchParams;
  const examType = params.examType || "TOEIC";
  const limit = parseInt(params.limit || "10", 10);
  const mode = (params.mode === "TEST" ? "TEST" : "PRACTICE") as "PRACTICE" | "TEST";
  const isValidExamType = ["TOEIC", "IELTS"].includes(examType.toUpperCase());
  const isValidMode = ["PRACTICE", "TEST"].includes(mode);

  if (!isValidExamType || !isValidMode || isNaN(limit)) {
    return {
      title: "404 - Không tìm thấy trang | EnStudey",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: "Phiên luyện tập theo phần | EnStudey",
    description: "Trang thực hiện làm bài luyện tập theo phần thi TOEIC/IELTS.",
  };
}

interface SessionPageProps {
  searchParams: Promise<{
    examType?: string;
    part?: string;
    difficulty?: string;
    limit?: string;
    mode?: string;
  }>;
}

export default async function PracticeSessionPage({ searchParams }: SessionPageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const params = await searchParams;
  const examType = params.examType || "TOEIC";
  const part = params.part || "Part5";
  const difficulty = params.difficulty || "MEDIUM";
  const limit = parseInt(params.limit || "10", 10);
  const mode = (params.mode === "TEST" ? "TEST" : "PRACTICE") as "PRACTICE" | "TEST";

  // Validate các tham số đầu vào sơ bộ
  const isValidExamType = ["TOEIC", "IELTS"].includes(examType.toUpperCase());
  const isValidMode = ["PRACTICE", "TEST"].includes(mode);

  if (!isValidExamType || !isValidMode || isNaN(limit)) {
    notFound();
  }

  return (
    <main className="py-12 flex-grow w-full">
      <PracticeSession
        token={token}
        examType={examType}
        part={part}
        difficulty={difficulty}
        limit={limit}
        mode={mode}
      />
    </main>
  );
}
