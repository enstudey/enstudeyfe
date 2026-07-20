import { Metadata } from "next";
import { cookies } from "next/headers";
import StartExamCard from "@/components/exam/StartExamCard";
import { getExamDetail } from "@/lib/api/exam";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const res = await getExamDetail(id, token);
    return {
      title: `${res.data.title} - Chuẩn bị thi - EnStudey`,
      description: res.data.description,
    };
  } catch {
    return {
      title: "Chuẩn bị thi thử - EnStudey",
    };
  }
}

export default async function ExamPreparePage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let exam = null;
  let errorMsg = null;

  try {
    const res = await getExamDetail(id, token);
    exam = res.data;
  } catch (err) {
    console.error("Failed to load exam detail", err);
    errorMsg = "Không tìm thấy thông tin đề thi thử hoặc đề thi chưa được kích hoạt.";
  }

  return (
    <main className="py-12 flex-grow w-full flex flex-col justify-center space-y-6">
        {/* Back Link */}
        <div className="w-full max-w-xl mx-auto">
          <Link
            href="/exam"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-sky-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại danh sách đề thi</span>
          </Link>
        </div>

        {errorMsg || !exam ? (
          <div className="bg-card border border-border p-8 rounded-3xl text-center shadow-sm max-w-xl mx-auto w-full space-y-4">
            <p className="text-red-600 text-sm font-semibold">{errorMsg || "Không tìm thấy đề thi."}</p>
            <Link href="/exam" className="text-sky-600 hover:underline text-xs font-bold block">
              Quay lại danh sách đề thi &rarr;
            </Link>
          </div>
        ) : (
          <StartExamCard
            id={exam.id}
            title={exam.title}
            durationSeconds={exam.durationSeconds}
            totalQuestions={exam.totalQuestions}
            token={token}
          />
        )}
      </main>
  );
}
