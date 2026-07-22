import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AffiliateBox from "@/components/affiliate/AffiliateBox";
import AdSenseSlot from "@/components/ads/AdSenseSlot";
import TikiAffiliateWidget from "@/components/affiliate/TikiAffiliateWidget";

interface Major {
  code: string;
  name: string;
  groups: string[];
  scores: Record<string, Record<string, number>>;
  scale?: number;
  note?: string;
}

interface University {
  name: string;
  majors: Major[];
}

type UniversityData = Record<string, University>;

interface RecommendedMajor {
  uniCode: string;
  uniName: string;
  majorCode: string;
  majorName: string;
  benchmark: number;
  year: string;
  diff: number;
  groups: string[];
}

interface Props {
  computedScores: Record<string, number> | null;
  highestGroup: { name: string; score: number } | null;
  appliedEquivNote: string | null;
  activeTab: "all" | "A" | "B" | "C" | "D" | "X_TH";
  setActiveTab: (val: "all" | "A" | "B" | "C" | "D" | "X_TH") => void;
  visibleScores: [string, number][];
}

export default function ResultDashboard({
  computedScores,
  highestGroup,
  appliedEquivNote,
  activeTab,
  setActiveTab,
  visibleScores
}: Props) {
  const [recommendations, setRecommendations] = useState<RecommendedMajor[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  useEffect(() => {
    if (!highestGroup || highestGroup.score < 18.0) {
      setTimeout(() => {
        setRecommendations((prev) => (prev.length > 0 ? [] : prev));
      }, 0);
      return;
    }

    setTimeout(() => {
      setIsLoadingRecs(true);
    }, 0);
    fetch("/university-scores-data/university_data.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load university database");
        return res.json();
      })
      .then((data: UniversityData) => {
        const method = "THPT";
        const threshold = -2.0;

        const getMatches = (t: number) => {
          const list: RecommendedMajor[] = [];
          for (const [uniCode, uni] of Object.entries(data)) {
            for (const major of uni.majors) {
              if (major.scale && major.scale !== 30) continue;
              if (!major.groups.includes(highestGroup.name)) continue;

              const scores = major.scores?.[method];
              if (!scores) continue;

              const year = scores["2025"] ? "2025" : (scores["2024"] ? "2024" : null);
              if (!year) continue;

              const benchmark = scores[year];
              const diff = highestGroup.score - benchmark;
              if (diff >= t) {
                list.push({
                  uniCode,
                  uniName: uni.name,
                  majorCode: major.code,
                  majorName: major.name,
                  benchmark,
                  year,
                  diff,
                  groups: major.groups,
                });
              }
            }
          }
          return list;
        };

        let matched = getMatches(threshold);
        if (matched.length < 8) {
          matched = getMatches(-4.0);
        }

        matched.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff));
        setRecommendations(matched.slice(0, 6));
      })
      .catch((err) => {
        console.error("Error loading university data:", err);
      })
      .finally(() => {
        setIsLoadingRecs(false);
      });
  }, [highestGroup]);

  if (!computedScores || !highestGroup) return null;

  return (
    <div id="result-area" className="space-y-6 pt-4 border-t border-slate-100 animate-fade-in">

      {appliedEquivNote && (
        <div className="bg-emerald-50 border border-emerald-500/20 text-emerald-700 text-xs px-4 py-2.5 rounded-xl font-medium">
          {appliedEquivNote}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900 p-6 rounded-2xl text-white">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Tổ hợp tối ưu của bạn
          </p>
          <h3 className="text-3xl font-extrabold mt-1">
            {highestGroup.name}: {highestGroup.score.toFixed(2)} Điểm
          </h3>
        </div>
        <Button asChild size="sm" className="font-bold uppercase tracking-wider rounded-xl transition duration-200">
          <Link href="/tra-cuu-tuyen-sinh">
            Tra cứu trường &rarr;
          </Link>
        </Button>
      </div>

      {highestGroup.score >= 24.0 && (
        <TikiAffiliateWidget
          productId="tiki-casio-calculator"
          title="Máy tính khoa học CASIO FX-880BTG - Hàng chính hãng"
          priceRange="780.000đ - 850.000đ"
          description="Công cụ đắc lực hỗ trợ phòng thi THPT Quốc gia với nhiều tính năng vượt trội, chuẩn chính hãng Tiki Trading 100%."
          imageUrl="https://salt.tikicdn.com/cache/280x280/ts/product/f4/18/76/1947ab5d18d41ff175d7cd426c117b4c.jpg"
          rawProductUrl="https://tiki.vn/may-tinh-khoa-hoc-casio-fx-880btg-pink-hang-chinh-hang-p211116260.html"
          trackingPage="tinh-diem-tot-nghiep-high-score"
          badge="Đề xuất thi"
        />
      )}

      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3 text-xs font-bold">
        {[
          { id: "all", name: "Tất cả tổ hợp" },
          { id: "A", name: "Khối A" },
          { id: "B", name: "Khối B" },
          { id: "C", name: "Khối C" },
          { id: "D", name: "Khối D" },
          { id: "X_TH", name: "Khối X & TH" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "all" | "A" | "B" | "C" | "D" | "X_TH")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === tab.id
              ? "bg-indigo-500 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {visibleScores.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {visibleScores.map(([grp, val]) => (
            <div
              key={grp}
              className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center gap-1"
            >
              <span className="font-bold text-xs text-slate-500">{grp}</span>
              <span className="font-extrabold text-lg text-indigo-600 font-mono">
                {val.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-slate-400 font-semibold">
          Không có tổ hợp nào thuộc nhóm này có đủ điểm thi thành phần.
        </div>
      )}

      {highestGroup.score >= 18.0 && (
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                🎓 Gợi ý trường Đại học phù hợp
                {recommendations.length > 0 && (
                  <span className="text-xs px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-bold">
                    {recommendations.length} trường
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Dựa trên tổ hợp cao nhất {highestGroup.name} ({highestGroup.score.toFixed(2)} điểm) và điểm chuẩn năm 2025/2024.
              </p>
            </div>
          </div>

          {isLoadingRecs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-50 border border-slate-150 rounded-2xl p-5 h-44 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-slate-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec, idx) => {
                  const isSafe = rec.diff >= 0;
                  return (
                    <div
                      key={`${rec.uniCode}-${rec.majorCode}-${idx}`}
                      className="group relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md uppercase">
                            {rec.uniCode}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isSafe
                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400"
                            }`}>
                            {isSafe ? `An toàn (+${rec.diff.toFixed(2)})` : `Thử thách (${rec.diff.toFixed(2)})`}
                          </span>
                        </div>

                        <h5 className="font-extrabold text-sm text-slate-950 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {rec.uniName}
                        </h5>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                            {rec.majorName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Mã ngành: {rec.majorCode}
                          </p>
                        </div>

                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 pt-1">
                          Điểm chuẩn {rec.year}: <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{rec.benchmark.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-900">
                        <Button asChild variant="outline" className="w-full text-xs font-bold rounded-xl h-9 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition duration-200">
                          <Link href={`/tra-cuu-tuyen-sinh?score=${highestGroup.score.toFixed(2)}&block=${highestGroup.name}`}>
                            Xem chi tiết xét tuyển &rarr;
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center pt-2">
                <Button asChild className="font-bold text-xs rounded-xl shadow-md transition duration-200 h-10 px-6 cursor-pointer">
                  <Link href={`/tra-cuu-tuyen-sinh?score=${highestGroup.score.toFixed(2)}&block=${highestGroup.name}`}>
                    Xem toàn bộ trường phù hợp &rarr;
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 px-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-250 dark:border-slate-800 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Không tìm thấy trường Đại học nào phù hợp với điểm số và tổ hợp môn của bạn. Vui lòng thử lại với tổ hợp khác.
              </p>
              <div className="flex justify-center">
                <Button asChild variant="outline" className="text-xs font-bold rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition duration-200 h-9 px-4">
                  <Link href="/tra-cuu-tuyen-sinh">
                    Tra cứu toàn bộ điểm chuẩn &rarr;
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}


      <div className="text-[11px] text-slate-400 italic text-center">
        * Kết quả tính điểm chỉ mang tính chất tham khảo và định hướng cá nhân. Vui lòng đối chiếu với đề án tuyển sinh chính thức của các trường Đại học.
      </div>

      <AffiliateBox />

      <AdSenseSlot slotId="calculator-result-slot-id" minHeight="250px" className="my-6" />


    </div>
  );
}
