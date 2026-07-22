import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getExams } from "@/lib/api/exam";
import { Exam } from "@/types/exam";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, GraduationCap, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Thi thử chuẩn hóa - EnStudey",
  description: "Hệ thống thi thử TOEIC / IELTS chuẩn hóa dưới áp lực thời gian thực tế, chấm điểm và giải thích chi tiết.",
};

export default async function ExamsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let exams: Exam[] = [];
  let errorMsg: string | null = null;

  try {
    const res = await getExams(0, 10, token);
    exams = res.data || [];
  } catch (err) {
    console.error("Failed to fetch exams list", err);
    errorMsg = "Không thể tải danh sách đề thi. Vui lòng thử lại sau.";
  }

  return (
    <main className="py-12 flex-grow w-full space-y-10">
      {/* Header Section */}
      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground flex items-center justify-center md:justify-start gap-3">
          <GraduationCap className="w-10 h-10 text-indigo-600 shrink-0" />
          <span>Hệ Thống Thi Thử Chuẩn Hóa</span>
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          Làm bài thi thử TOEIC (200 câu) hoặc IELTS dưới áp lực thời gian thực tế để đánh giá chính xác trình độ và nhận giải thích chi tiết.
        </p>
      </div>

      {errorMsg ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm text-center">
          {errorMsg}
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-card border border-border p-12 rounded-3xl text-center shadow-sm space-y-4">
          <p className="text-muted-foreground text-sm">Hiện tại chưa có đề thi thử nào được kích hoạt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-card border border-border hover:border-indigo-500/20 shadow-sm hover:shadow-md transition duration-300 rounded-3xl p-6 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider">
                    {exam.examType}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {exam.status === "ACTIVE" ? "Mở thi" : exam.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-2">
                  {exam.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>{Math.round(exam.durationSeconds / 60)} phút làm bài</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>{exam.totalQuestions} câu hỏi</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Thang điểm chuẩn quốc tế
                </span>
                <Button asChild size="sm" className="rounded-xl font-bold gap-1 shadow-sm hover:scale-[1.02] transition">
                  <Link href={`/exam/${exam.id}`}>
                    <span>Làm bài</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
