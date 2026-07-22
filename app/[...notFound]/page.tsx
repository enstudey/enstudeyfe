import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang | EnStudey",
  description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển trên hệ thống EnStudey.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CatchAllNotFoundPage() {
  notFound();
}
