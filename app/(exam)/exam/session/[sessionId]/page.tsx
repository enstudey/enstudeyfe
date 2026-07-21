import { Metadata } from "next";
import { cookies } from "next/headers";
import ExamWorkspace from "@/components/exam/ExamWorkspace";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export const metadata: Metadata = {
  title: "Đang làm bài thi thử - EnStudey",
  description: "Trang làm bài thi thử TOEIC/IELTS trọn vẹn dưới áp lực thời gian thực tế.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ExamSessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <ExamWorkspace sessionId={sessionId} token={token} />
    </main>
  );
}
