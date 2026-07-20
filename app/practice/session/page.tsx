import type { Metadata } from "next";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PracticeSession from "@/components/practice/PracticeSession";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Phiên luyện tập theo phần | EnStudey",
  description: "Trang thực hiện làm bài luyện tập theo phần thi TOEIC/IELTS.",
};

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
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black text-foreground flex flex-col justify-between transition-colors duration-200">
        <Header />
        <main className="max-w-md mx-auto px-6 py-16 flex-1 flex flex-col justify-center space-y-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Lỗi tham số cấu hình</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Các tham số truyền vào phiên học không hợp lệ. Vui lòng quay lại màn hình cấu hình.
          </p>
          <Link href="/practice" className="text-xs text-sky-600 hover:underline font-bold">
            Quay lại trang cấu hình &rarr;
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-foreground flex flex-col justify-between transition-colors duration-200">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <PracticeSession
          token={token}
          examType={examType}
          part={part}
          difficulty={difficulty}
          limit={limit}
          mode={mode}
        />
      </main>
      <Footer />
    </div>
  );
}
