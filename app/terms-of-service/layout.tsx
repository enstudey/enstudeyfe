import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ sử dụng EnStudey",
  description: "Quy định và điều khoản sử dụng nền tảng EnStudey, điều kiện sử dụng công cụ tính điểm và miễn trừ trách nhiệm tuyển sinh.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
