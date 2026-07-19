import type { Metadata } from "next";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PracticeSelectionClient from "./practice-selection-client";

export const metadata: Metadata = {
  title: "Luyện tập theo phần TOEIC / IELTS | EnStudey",
  description: "Cấu hình phiên luyện tập tập trung theo từng Part đề thi TOEIC và Section đề thi IELTS có độ khó phù hợp.",
};

export default async function PracticePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  const googleLoginUrl =
    process.env.NEXT_PUBLIC_BE_OAUTH2_GOOGLE_URL ||
    "http://localhost:8080/oauth2/authorization/google";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-foreground flex flex-col justify-between transition-colors duration-200">
      <Header />
      <PracticeSelectionClient isGuest={isGuest} googleLoginUrl={googleLoginUrl} />
      <Footer />
    </div>
  );
}
