import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
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
    notFound();
  }
}

export default async function ExamPreparePage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let exam = null;

  try {
    const res = await getExamDetail(id, token);
    exam = res.data;
  } catch (err) {
    console.error("Failed to load exam detail", err);
    notFound();
  }

  if (!exam) {
    notFound();
  }

  return (
    <main className="py-12 flex-grow w-full flex flex-col justify-center space-y-6">
      {/* Back Link */}
      <div className="w-full max-w-xl mx-auto">
        <Link
          href="/exam"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-indigo-600 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Quay lại danh sách đề thi</span>
        </Link>
      </div>

      <StartExamCard
        id={exam.id}
        title={exam.title}
        durationSeconds={exam.durationSeconds}
        totalQuestions={exam.totalQuestions}
        token={token}
      />
    </main>
  );
}
