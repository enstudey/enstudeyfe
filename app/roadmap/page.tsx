import { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getCurrentRoadmap } from "@/lib/api/roadmap";
import { RoadmapHeader } from "@/components/roadmap/RoadmapHeader";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";

export const metadata: Metadata = {
  title: "Lộ Trình Học Tập Cá Nhân Hóa — EnStudey",
  description: "Bản đồ học tập cá nhân hóa dành cho các nhóm đối tượng mất gốc, sinh viên, người đi làm.",
};

export default async function RoadmapPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const roadmap = await getCurrentRoadmap(token);

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 md:py-12">
      {roadmap ? (
        <>
          <RoadmapHeader roadmap={roadmap} />
          <RoadmapTimeline milestones={roadmap.milestones || []} />
        </>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-lg max-w-xl mx-auto">
          <div className="text-5xl mb-4">🗺️</div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Chưa Chọn Lộ Trình Học Tập
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
            Bạn chưa kích hoạt bản đồ học tập cá nhân hóa nào. Hãy thực hiện khảo sát nhanh 1 phút để chọn mục tiêu điểm số và trình độ xuất phát!
          </p>
          <Link
            href="/roadmap/survey"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
          >
            Bắt Đầu Khảo Sát Ngay →
          </Link>
        </div>
      )}
    </main>
  );
}
