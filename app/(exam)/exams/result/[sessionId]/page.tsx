import { Metadata } from "next";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-[#FAFAFA] bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.04),transparent_65%)] text-foreground flex flex-col justify-between">
      <Header />

      <main className="flex-1 w-full">
        <ExamResultView sessionId={sessionId} token={token} />
      </main>

      <Footer />
    </div>
  );
}
