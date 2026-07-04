import { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";

// Định nghĩa Metadata SEO
export const metadata: Metadata = {
  title: "Đọc bài viết - Tin tức EnStudy",
  description: "Các bài viết chuyên sâu về luyện thi tiếng Anh.",
};

const MOCK_POSTS: Record<string, { title: string; category: string; content: string }> = {
  "spaced-repetition-hoc-tu-vung": {
    title: "Phương pháp Spaced Repetition (Lặp lại ngắt quãng) trong học từ vựng TOEIC",
    category: "skills",
    content: "Spaced Repetition (Lặp lại ngắt quãng) là kỹ thuật gia tăng thời gian giảng cách giữa các lần ôn tập thông tin nhằm tận dụng hiệu ứng tâm lý học về sự giãn cách. Bằng cách ôn tập từ vựng đúng thời điểm chuẩn bị quên, não bộ sẽ buộc phải phục hồi thông tin một cách chủ động, giúp ghi khắc từ vựng vào trí nhớ dài hạn hiệu quả gấp nhiều lần so với học vẹt thông thường..."
  },
  "5-meo-tranh-bay-part-1-toeic": {
    title: "5 Mẹo tránh bẫy Part 1 TOEIC cực kỳ hiệu quả",
    category: "tips",
    content: "Part 1 TOEIC kiểm tra khả năng nghe hiểu mô tả tranh. Tuy nhiên, đề thi thường gài bẫy bằng cách sử dụng các từ đồng âm gây nhiễu, hoặc mô tả hành động sai của các nhân vật phụ. Để đạt điểm tối đa, hãy lưu ý: 1) Tập trung vào động từ chính, 2) Loại trừ các đáp án có từ đồng âm khác nghĩa, 3) Chú ý đến bối cảnh chung của bức tranh..."
  },
  "cach-phan-bo-thoi-gian-reading-ielts": {
    title: "Cách phân bổ thời gian làm bài Reading IELTS (Quy tắc 15-20-25)",
    category: "skills",
    content: "Với 60 phút và 3 đoạn văn dài, IELTS Reading là thử thách cực đại về quản lý thời gian. Quy tắc 15-20-25 khuyên bạn nên hoàn thành Passage 1 trong 15 phút (do đây là phần dễ nhất), Passage 2 trong 20 phút, và Passage 3 trong 25 phút. Thời gian còn lại dùng để kiểm tra và chuyển đáp án sang Answer Sheet. Hãy thực hành thường xuyên để tối ưu tốc độ làm bài..."
  }
};

// Next.js 15+ nhận params bất đồng bộ (Promise)
export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = MOCK_POSTS[slug] || {
    title: "Bài viết không tồn tại rồi bạn ơi 🥺",
    category: "system",
    content: "Hình như bài viết bạn yêu cầu hiện không có trên hệ thống hoặc đã được di chuyển đi nơi khác rồi nè."
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-2xl text-slate-950 dark:text-white tracking-tight">
              EnStudy
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/tin-tuc" className="text-xs font-bold text-slate-950 dark:text-white border-b-2 border-orange-500 pb-1 uppercase tracking-wider">
                Tin tức học thuật
              </Link>
              <Link href="/tinh-diem" className="text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors uppercase tracking-wider">
                Công cụ tính điểm
              </Link>
              <Link href="/tra-cuu-truong-dai-hoc" className="text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors uppercase tracking-wider">
                Tra cứu trường đại học
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-6">
        <div>
          <Link href="/tin-tuc" className="text-sm text-orange-600 dark:text-orange-500 hover:underline inline-flex items-center gap-1 font-semibold">
            &larr; Quay lại danh sách tin tức
          </Link>
        </div>

        <article className="prose dark:prose-invert leading-relaxed text-slate-750 dark:text-zinc-300">
          <span className="text-xs font-bold text-orange-600 dark:text-orange-500 uppercase tracking-wider">
            {post.category === "skills" ? "Kỹ năng học thuật" : post.category === "tips" ? "Mẹo làm đề" : "Hệ thống"}
          </span>
          <h1 className="text-3xl font-extrabold mt-2 mb-6 text-slate-950 dark:text-white leading-tight">
            {post.title}
          </h1>
          <div className="text-base text-slate-700 dark:text-zinc-300 space-y-4">
            <p>{post.content}</p>
          </div>
        </article>

        {/* In-content Anti-CLS Ad Container */}
        <div className="ad-container ad-v-block w-full">
          {/* AdSlot */}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
