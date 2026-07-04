import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hỏi đáp thường gặp về kỳ thi THPT & Chọn nguyện vọng - EnStudy",
  description: "Giải đáp toàn bộ thắc mắc về cách tính điểm xét tuyển, quy chế ưu tiên và mẹo đăng ký nguyện vọng đại học tránh trượt.",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
