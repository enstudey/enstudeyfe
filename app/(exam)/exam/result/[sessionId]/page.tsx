import { Metadata } from "next";
import { cookies } from "next/headers";
import ExamResultView from "@/components/exam/ExamResultView";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export const metadata: Metadata = {
  title: "Kết quả thi thử - EnStudey",
  description: "Báo cáo điểm số chi tiết và lời giải thích bài thi thử TOEIC/IELTS.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ExamResultPage({ params }: PageProps) {
  const { sessionId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return (
    <main className="py-6 flex-grow w-full">
      <ExamResultView sessionId={sessionId} token={token} />
    </main>
  );
}
