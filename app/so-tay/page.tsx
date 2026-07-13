import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SoTayClient from "./so-tay-client";

export const metadata: Metadata = {
  title: "Sổ Tay Từ Vựng Tiếng Anh Cá Nhân | EnStudey",
  description: "Quản lý và ôn tập tất cả từ vựng tiếng Anh bạn đã đánh dấu khi học. Hỗ trợ nghe phát âm chuẩn, xuất nhập dữ liệu từ vựng cá nhân dễ dàng.",
};

export default function SoTayPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-foreground flex flex-col justify-between transition-colors duration-200">
      <Header />
      <SoTayClient />
      <Footer />
    </div>
  );
}
