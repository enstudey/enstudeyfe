import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách bảo mật thông tin người dùng - EnStudey",
  description: "Cam kết bảo mật thông tin, quy trình lưu trữ dữ liệu local và chính sách cookie quảng cáo Google AdSense tại EnStudey.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
