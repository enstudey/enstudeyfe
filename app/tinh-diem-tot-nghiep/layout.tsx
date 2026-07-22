import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang | EnStudey",
  description: "Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển trên hệ thống EnStudey.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
