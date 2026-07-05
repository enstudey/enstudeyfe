import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hệ thống tra cứu nguyện vọng thông minh - EnStudey",
  description: "Gợi ý các trường Đại học, ngành học và phân tích tổ hợp môn xét tuyển tối ưu theo khoảng điểm thi tốt nghiệp THPT.",
};

export default function FinderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
