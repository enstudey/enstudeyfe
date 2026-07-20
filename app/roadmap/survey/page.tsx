import { Metadata } from "next";
import { getAllRoadmaps } from "@/lib/api/roadmap";
import { SurveyForm } from "@/components/roadmap/SurveyForm";

export const metadata: Metadata = {
  title: "Khảo Sát Chọn Lộ Trình Học Tập — EnStudey",
  description: "Lựa chọn đối tượng và mục tiêu học tập để nhận lộ trình cá nhân hóa.",
};

export default async function RoadmapSurveyPage() {
  const roadmaps = await getAllRoadmaps();

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 md:py-12">
      <SurveyForm roadmaps={roadmaps} />
    </main>
  );
}
