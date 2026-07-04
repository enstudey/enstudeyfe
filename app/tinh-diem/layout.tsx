import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Công cụ tính điểm xét tuyển Đại học THPT quốc gia - EnStudy",
  description: "Tính điểm xét tuyển các khối A00, A01, B00, D01 chính xác. Tự động đề xuất tổ hợp môn tối ưu dựa trên điểm số của bạn.",
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
