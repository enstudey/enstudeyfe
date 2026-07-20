import type { Metadata } from "next";
import SoTayClient from "./so-tay-client";

export const metadata: Metadata = {
  title: "Sổ Tay Từ Vựng Tiếng Anh Cá Nhân | EnStudey",
  description: "Quản lý và ôn tập tất cả từ vựng tiếng Anh bạn đã đánh dấu khi học. Hỗ trợ nghe phát âm chuẩn, xuất nhập dữ liệu từ vựng cá nhân dễ dàng.",
};

export default function SoTayPage() {
  return (
    <SoTayClient />
  );
}
