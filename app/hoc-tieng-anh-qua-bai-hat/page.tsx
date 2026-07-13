import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LyricsListClient from "./lyrics-list-client";

export const metadata: Metadata = {
  title: "Học Tiếng Anh Qua Lời Bài Hát - Contextual Lyrics Decoder | EnStudey",
  description: "Học từ vựng, ngữ pháp và phát âm tiếng Anh qua lời bài hát yêu thích. Đồng bộ video ca nhạc YouTube cùng lời dịch chi tiết, highlight từ vựng.",
};

export default function LyricsDecoderPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-zinc-950 pt-24 pb-16">
        <LyricsListClient />
      </main>
      <Footer />
    </div>
  );
}
