import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LyricsDecoderDetailClient from "./detail-client";

interface LyricLine {
  time: number;
  text: string;
  translation: string;
}

interface VocabularyWord {
  word: string;
  time: number;
  meaning: string;
  type: string;
  ipa: string;
  example: string;
}

interface SongData {
  songId: string;
  title: string;
  artist: string;
  youtubeVideoId: string;
  difficulty: string;
  lyricsLines: LyricLine[];
  vocabulary: VocabularyWord[];
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Hàm phụ đọc file dữ liệu bài hát từ public folder
async function getSongData(slug: string): Promise<SongData | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "english-data", "lyrics", `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents) as SongData;
  } catch (error) {
    console.error("Error reading song lyrics file:", error);
    return null;
  }
}

// Sinh metadata động cho từng bài hát để tối ưu SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const songData = await getSongData(slug);
  
  if (!songData) {
    return {
      title: "Không tìm thấy bài hát | EnStudey",
    };
  }

  return {
    title: `Dịch Lời & Học Từ Vựng: ${songData.title} - ${songData.artist} | EnStudey`,
    description: `Học tiếng Anh qua bài hát ${songData.title} của ${songData.artist}. Nghe nhạc, xem lời dịch song ngữ và tra cứu từ vựng hữu ích xuất hiện trong bài hát.`,
  };
}

// Xác định các slug bài hát có sẵn lúc build tĩnh (SSG)
export async function generateStaticParams() {
  return [
    { slug: "perfect" }
  ];
}

export default async function LyricDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const songData = await getSongData(slug);

  if (!songData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-slate-50 dark:bg-zinc-950 pt-24 pb-16">
        <LyricsDecoderDetailClient songData={songData} />
      </main>
      <Footer />
    </div>
  );
}
