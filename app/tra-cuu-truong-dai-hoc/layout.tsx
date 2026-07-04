import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tra cứu điểm chuẩn & Gợi ý nguyện vọng Đại học - EnStudy",
  description: "Tìm kiếm trường đại học, ngành học theo tổ hợp môn và khoảng điểm. Phân tích vùng an toàn/rủi ro thông minh.",
};

export default function FinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
