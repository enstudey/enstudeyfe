import type { Metadata } from "next";
import { cookies } from "next/headers";
import PracticeSelectionClient from "./practice-selection-client";

export const metadata: Metadata = {
  title: "Luyện tập theo phần TOEIC / IELTS | EnStudey",
  description: "Cấu hình phiên luyện tập tập trung theo từng Part đề thi TOEIC và Section đề thi IELTS có độ khó phù hợp.",
};

export default async function PracticePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isGuest = !token;
  return (
    <PracticeSelectionClient isGuest={isGuest} />
  );
}
