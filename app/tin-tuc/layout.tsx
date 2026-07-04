import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức học thuật & Cẩm nang ôn thi - EnStudy",
  description: "Chia sẻ các phương pháp học từ vựng, mẹo tránh bẫy đề thi TOEIC và kinh nghiệm phân bổ thời gian thi IELTS Reading.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
