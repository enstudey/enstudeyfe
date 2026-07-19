import { Metadata } from "next";
import { cookies } from "next/headers";
import QuizContainer from "@/components/quiz/QuizContainer";

export const metadata: Metadata = {
  title: "Luyện đề - EnStudey",
  description: "Trang luyện đề TOEIC / IELTS với bộ câu hỏi chọn lọc.",
};

export default async function QuizPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  const googleLoginUrl = process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL || "http://localhost:8080/oauth2/authorization/google";

  return (
    <main className="min-h-screen bg-[#FAFAFA] bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.03),transparent_60%)]">
      <QuizContainer isGuest={isGuest} googleLoginUrl={googleLoginUrl} token={token} />
    </main>
  );
}

