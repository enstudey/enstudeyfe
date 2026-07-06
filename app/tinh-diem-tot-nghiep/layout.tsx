import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Công cụ tính điểm tốt nghiệp THPT 2026 chính xác - EnStudey",
  description: "Tính điểm xét tuyển đại học các khối A00, A01, B00, D01 tự động, chính xác và nhanh chóng.",
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
