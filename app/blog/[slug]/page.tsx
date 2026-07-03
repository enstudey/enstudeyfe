import { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "Đọc bài viết - Blog EnStudey",
  description: "Các bài viết chuyên sâu về luyện thi tiếng Anh.",
};

const MOCK_POSTS: Record<string, { title: string; category: string; content: string }> = {
  "spaced-repetition-hoc-tu-vung": {
    title: "Phương pháp Spaced Repetition (Lặp lại ngắt quãng) trong học từ vựng TOEIC",
    category: "skills",
    content: "Spaced Repetition (Lặp lại ngắt quãng) là kỹ thuật gia tăng thời gian giãn cách giữa các lần ôn tập thông tin nhằm tận dụng hiệu ứng tâm lý học về sự giãn cách. Bằng cách ôn tập từ vựng đúng thời điểm chuẩn bị quên, não bộ sẽ buộc phải phục hồi thông tin một cách chủ động, giúp ghi khắc từ vựng vào trí nhớ dài hạn hiệu quả gấp nhiều lần so với học vẹt thông thường..."
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

export default function BlogPostDetail({ params }: { params: { slug: string } }) {
  const post = MOCK_POSTS[params.slug] || {
    title: "Bài viết không tồn tại",
    category: "system",
    content: "Xin lỗi, bài viết bạn yêu cầu hiện không có trên hệ thống hoặc đã bị xóa."
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-6">
        <Link href="/blog" className="text-sm text-blue-600 hover:underline">
          &larr; Quay lại Blog
        </Link>
      </div>

      <article className="prose leading-relaxed text-gray-700">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          {post.category === "skills" ? "Kỹ năng học thuật" : "Mẹo làm đề"}
        </span>
        <h1 className="text-3xl font-extrabold mt-2 mb-6 text-gray-900 leading-tight">
          {post.title}
        </h1>
        <div className="text-base text-gray-700 space-y-4">
          <p>{post.content}</p>
        </div>
      </article>

      <AdBanner />
    </main>
  );
}
