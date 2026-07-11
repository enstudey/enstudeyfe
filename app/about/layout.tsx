import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giới thiệu về EnStudey - Nền tảng học tập cá nhân hóa",
  description: "Tìm hiểu sứ mệnh của EnStudey trong việc bẻ gãy áp lực phòng thi và số hóa tiện ích học tập cho học sinh Việt Nam.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
