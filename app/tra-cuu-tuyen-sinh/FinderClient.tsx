"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DonateModal, DonateBarMinimal } from "@/components/donate";
import AffiliateNativeRow from "@/components/affiliate/AffiliateNativeRow";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MajorBenchmark {
  code: string;
  name: string;
  groups: string[];
  scores: Record<string, Record<string, number>>;
  scale: number;
  note: string;
}

interface UniversityData {
  name: string;
  majors: MajorBenchmark[];
}

type ScoresData = Record<string, UniversityData>;

interface FlatBenchmarkItem {
  universityCode: string;
  universityName: string;
  majorCode: string;
  majorName: string;
  groups: string[];
  score: number | null;
  scale: number;
  note: string;
}

const YEAR_OPTIONS = ["2025", "2024", "2022", "2020", "2019", "2018"];
const METHOD_OPTIONS = [
  { value: "THPT", label: "Xét điểm thi THPT" },
  { value: "HOC_BA", label: "Xét học bạ" },
  { value: "DGNL", label: "Đánh giá năng lực" },
  { value: "DGTD", label: "Đánh giá tư duy" }
];

interface FinderClientProps {
  scoresData: ScoresData;
  initialPage: number;
}

export default function FinderClient({ scoresData, initialPage }: FinderClientProps) {
  // Trạng thái modal donate
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  // Bộ lọc nguyện vọng
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Tất cả tổ hợp");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMethod, setSelectedMethod] = useState("THPT");
  const [scoreRange, setScoreRange] = useState<number>(30);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [prevInitialPage, setPrevInitialPage] = useState(initialPage);
  const itemsPerPage = 10;

  if (initialPage !== prevInitialPage) {
    setPrevInitialPage(initialPage);
    setCurrentPage(initialPage);
  }

  // Cuộn mượt lên đầu danh sách bài viết khi chuyển trang
  useEffect(() => {
    const section = document.getElementById("search-results-section");
    if (section && currentPage !== initialPage) {
      const yOffset = -80; // Bù trừ chiều cao Header cố định
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [currentPage, initialPage]);

  // Trạng thái key quảng cáo để kích hoạt auto-refresh
  const [adKey, setAdKey] = useState(0);
  const [computedScores, setComputedScores] = useState<Record<string, number> | null>(null);

  // Đọc điểm đã lưu từ localStorage khi Component được mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem("user_scores");
        if (stored) {
          const parsed = JSON.parse(stored);
          setComputedScores(parsed);
          
          // Tính điểm tốt nghiệp cao nhất và set làm scoreRange ban đầu (max + 1)
          const validScores = Object.values(parsed).filter((s): s is number => typeof s === "number");
          if (validScores.length > 0) {
            const maxScore = Math.max(...validScores);
            setScoreRange(maxScore + 1);
          }
        }
      } catch (e) {
        console.error("Lỗi khi đọc điểm từ localStorage", e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Thiết lập làm mới quảng cáo tự động sau mỗi 45 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setAdKey((prev) => prev + 1);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  // Lấy 3 tổ hợp môn có điểm số cao nhất của học viên
  const topThreeScores = useMemo(() => {
    if (!computedScores) return [];
    return Object.entries(computedScores)
      .filter(([, val]) => typeof val === "number")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [computedScores]);

  // Thực hiện chuyển đổi và lọc dữ liệu đa chiều bằng useMemo để tối ưu hóa hiệu năng
  const filteredResults = useMemo(() => {
    if (!scoresData) return [];
    
    const flatList: FlatBenchmarkItem[] = [];

    Object.entries(scoresData).forEach(([uniCode, uniData]) => {
      uniData.majors.forEach((major) => {
        const methodScores = major.scores[selectedMethod] || {};
        const score = methodScores[selectedYear] !== undefined ? methodScores[selectedYear] : null;

        flatList.push({
          universityCode: uniCode,
          universityName: uniData.name,
          majorCode: major.code,
          majorName: major.name,
          groups: major.groups,
          score,
          scale: major.scale,
          note: major.note
        });
      });
    });

    let list = flatList;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      list = list.filter((item) =>
        item.universityName.toLowerCase().includes(term) ||
        item.universityCode.toLowerCase().includes(term) ||
        item.majorName.toLowerCase().includes(term) ||
        item.majorCode.toLowerCase().includes(term)
      );
    }

    if (selectedGroup !== "Tất cả tổ hợp") {
      list = list.filter((item) => item.groups.includes(selectedGroup));
    }

    // Bộ lọc theo khoảng điểm sàn (chỉ lọc nếu ngành có điểm chuẩn hợp lệ)
    list = list.filter((item) => item.score === null || item.score <= scoreRange);

    // Sắp xếp:
    // 1. Ưu tiên có mã ngành lên trước, không có mã ngành ra sau cùng
    // 2. Điểm chuẩn từ cao tới thấp, không có điểm ném ra sau
    // 3. Ưu tiên có nhiều tổ hợp môn hơn
    list.sort((a, b) => {
      const hasCodeA = a.majorCode && a.majorCode.trim() !== "";
      const hasCodeB = b.majorCode && b.majorCode.trim() !== "";

      if (hasCodeA && !hasCodeB) return -1;
      if (!hasCodeA && hasCodeB) return 1;

      if (a.score !== null && b.score === null) return -1;
      if (a.score === null && b.score !== null) return 1;

      if (a.score !== null && b.score !== null) {
        if (a.score !== b.score) {
          return b.score - a.score;
        }
      }

      return b.groups.length - a.groups.length;
    });

    return list;
  }, [scoresData, searchTerm, selectedGroup, selectedYear, selectedMethod, scoreRange]);

  // Reset trang về 1 khi tiêu chí lọc thay đổi bằng setTimeout để tránh cascading renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      const newUrl = `${window.location.pathname}?page=1`;
      window.history.pushState(null, "", newUrl);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedGroup, selectedYear, selectedMethod, scoreRange]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getScoreColorClass = (item: FlatBenchmarkItem) => {
    if (!computedScores || item.score === null) return "text-slate-600 font-bold";
    
    let userScore = 0;
    if (selectedGroup !== "Tất cả tổ hợp") {
      userScore = computedScores[selectedGroup] || 0;
    } else {
      const validScores = item.groups
        .map((g) => computedScores[g])
        .filter((s): s is number => s !== undefined && s !== null);
      if (validScores.length > 0) {
        userScore = Math.max(...validScores);
      }
    }

    if (userScore === 0) return "text-slate-600 font-bold";

    if (item.score >= userScore - 2 && item.score <= userScore + 2) {
      return "text-amber-500 font-extrabold";
    } else if (item.score < userScore - 2) {
      return "text-emerald-600 font-extrabold";
    } else {
      return "text-rose-600 font-extrabold";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-foreground flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Hệ thống tra cứu nguyện vọng thông minh 🔍
            </h1>
            <div className="flex items-center gap-3 flex-wrap mt-1">
              <p className="text-muted-foreground text-sm">Gợi ý và sắp xếp các nguyện vọng phù hợp với khoảng điểm và tổ hợp của bạn.</p>
            </div>
          </div>
          <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span> An toàn
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span> Cọ xát
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span> Rủi ro
            </div>
          </div>
        </div>

        {computedScores ? (
          <div className="space-y-4">
            <div className="bg-violet-50 border border-violet-500/20 rounded-2xl p-4 text-xs font-semibold text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="leading-relaxed">
                Hệ thống đang đối sánh tự động dựa trên điểm số đã tính:{" "}
                <span className="inline-flex flex-wrap gap-x-2 gap-y-1 mt-1.5 sm:mt-0 sm:ml-1 align-middle">
                  {topThreeScores.map(([group, score]) => (
                    <span key={group} className="inline-block bg-white px-2 py-0.5 rounded border border-violet-500/10 whitespace-nowrap text-[11px]">
                      <span className="font-bold text-violet-600">{group}</span>: {score.toFixed(2)}
                    </span>
                  ))}
                </span>
              </span>
              <Link href="/tinh-diem-tot-nghiep" className="text-violet-600 hover:underline whitespace-nowrap font-bold flex-shrink-0 self-start sm:self-auto">
                Tính điểm lại &rarr;
              </Link>
            </div>
            
            {/* Anti-CLS In-feed AdSlot dưới phần điểm tổng */}
            <div 
              key={`infeed-${adKey}`}
              className="ad-container ad-v-block w-full min-h-[250px] bg-slate-100/50 flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 rounded-2xl transition duration-300"
              data-testid="ad-infeed-points"
            >
              <div className="text-center space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Liên kết tài trợ</span>
                <p className="font-bold text-sm text-slate-700">Lộ trình học IELTS 7.5+ cấp tốc cho học sinh lớp 12</p>
                <p className="text-xs text-slate-400">Đăng ký ngay hôm nay để nhận học bổng giảm giá 30% học phí tại EnStudey.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs font-semibold text-slate-650 flex justify-between items-center">
            <span>Bạn chưa tính điểm thi THPT? Tính ngay để xem gợi ý các phân vùng an toàn/rủi ro.</span>
            <Link href="/tinh-diem-tot-nghiep" className="text-violet-600 hover:underline">
              Tính điểm thi &rarr;
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {/* Bộ lọc ở trên chiếm full-width */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
              <div className="lg:col-span-4 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Tìm kiếm trường / ngành</label>
                <Input
                  type="text"
                  placeholder="Nhập mã trường, tên ngành..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-600 text-sm font-semibold"
                />
              </div>
              <div className="lg:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Năm tuyển sinh</label>
                <Select value={selectedYear} onValueChange={(val) => setSelectedYear(val || "")}>
                  <SelectTrigger
                    data-testid="select-year"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-left"
                  >
                    <SelectValue placeholder="Năm tuyển sinh" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map((year) => (
                      <SelectItem key={year} value={year}>Năm {year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Phương thức tuyển sinh</label>
                <Select value={selectedMethod} onValueChange={(val) => setSelectedMethod(val || "")}>
                  <SelectTrigger
                    data-testid="select-method"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-left"
                  >
                    <SelectValue placeholder="Phương thức" />
                  </SelectTrigger>
                  <SelectContent>
                    {METHOD_OPTIONS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-2 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Tổ hợp môn</label>
                <Select value={selectedGroup} onValueChange={(val) => setSelectedGroup(val || "")}>
                  <SelectTrigger
                    data-testid="select-group"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-left"
                  >
                    <SelectValue placeholder="Tổ hợp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tất cả tổ hợp">Tất cả tổ hợp</SelectItem>
                    <SelectItem value="A00">A00</SelectItem>
                    <SelectItem value="A01">A01</SelectItem>
                    <SelectItem value="B00">B00</SelectItem>
                    <SelectItem value="C00">C00</SelectItem>
                    <SelectItem value="D01">D01</SelectItem>
                    <SelectItem value="D07">D07</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                <span>Khoảng điểm sàn</span>
                <span className="text-violet-600">{scoreRange} Điểm</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="0.1"
                value={scoreRange}
                onChange={(e) => setScoreRange(parseFloat(e.target.value))}
                data-testid="input-score-range"
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Điểm neo cho hành vi cuộn phân trang */}
          <div id="search-results-section" className="scroll-mt-20" />

          {/* Bảng kết quả ở dưới */}
          <div className="w-full overflow-hidden border border-border rounded-2xl bg-white shadow-sm flex flex-col justify-between min-h-[400px]">
            {/* Phiên bản Desktop: Dạng bảng (Table) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-border text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">Mã ngành</th>
                    <th className="px-6 py-4">Tên ngành / Trường</th>
                    <th className="px-6 py-4">Tổ hợp</th>
                    <th className="px-6 py-4 text-right">Điểm chuẩn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedResults.length > 0 ? (
                    paginatedResults.map((item, idx) => (
                      <React.Fragment key={`desktop-${item.universityCode}-${item.majorCode}-${item.majorName}`}>
                        <tr className="group hover:bg-slate-50 transition duration-200 cursor-pointer">
                          <td className="px-6 py-4 font-bold text-slate-900">{item.majorCode}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">
                              {item.majorName}
                              {item.scale === 40 && (
                                <span className="ml-2 text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap">Thang 40</span>
                              )}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {item.universityName} ({item.universityCode})
                            </p>
                            {item.note && (
                              <p className="text-[10px] text-violet-600 italic mt-0.5">{item.note}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-650 text-xs">
                            <div className="flex flex-wrap gap-1">
                              {item.groups.map((g, gIdx) => (
                                <span key={`${g}-${gIdx}`} className="px-1.5 py-0.5 bg-slate-100 text-slate-650 rounded text-[10px] font-semibold">
                                  {g}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className={`px-6 py-4 text-right text-base ${getScoreColorClass(item)}`}>
                            {item.score !== null ? item.score : "-"}
                          </td>
                        </tr>
                        
                        {/* Native Ads xen kẽ sau mỗi 5 kết quả trên desktop */}
                        {(idx + 1) % 5 === 0 && paginatedResults.length >= 5 && (
                          <AffiliateNativeRow rowIndex={idx} currentPage={currentPage} />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400 font-semibold">
                        Không tìm thấy ngành học nào khớp với bộ lọc của bạn 🥺
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Phiên bản Mobile: Dạng thẻ (Cards list) */}
            <div className="block md:hidden divide-y divide-border">
              {paginatedResults.length > 0 ? (
                paginatedResults.map((item, idx) => (
                  <React.Fragment key={`mobile-${item.universityCode}-${item.majorCode}-${item.majorName}`}>
                    <div className="p-5 flex flex-col gap-3 hover:bg-slate-50 transition duration-200 cursor-pointer">
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">
                            {item.majorName}
                            {item.scale === 40 && (
                              <span className="ml-2 text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap">Thang 40</span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {item.universityName} ({item.universityCode})
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Điểm chuẩn</span>
                          <span className={`text-lg block mt-0.5 ${getScoreColorClass(item)}`}>
                            {item.score !== null ? item.score : "-"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        <div className="flex flex-wrap gap-1">
                          {item.groups.map((g, gIdx) => (
                            <span key={`${g}-${gIdx}`} className="px-1.5 py-0.5 bg-slate-100 text-slate-650 rounded text-[10px] font-semibold">
                              {g}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Mã ngành: <span className="font-bold text-slate-700">{item.majorCode}</span>
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-[10px] text-violet-600 italic leading-relaxed bg-violet-50 p-2 rounded-lg border border-violet-500/10 mt-1">{item.note}</p>
                      )}
                    </div>

                    {/* Native Ads xen kẽ sau mỗi 5 kết quả trên mobile */}
                    {(idx + 1) % 5 === 0 && paginatedResults.length >= 5 && (
                      <AffiliateNativeRow rowIndex={idx} currentPage={currentPage} isCard={true} />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 font-semibold">
                  Không tìm thấy ngành học nào khớp với bộ lọc của bạn 🥺
                </div>
              )}
          </div>
          {totalPages > 1 && (
            <div className="p-5 bg-slate-50 border-t border-border">
                {/* Mobile version */}
                <div className="flex md:hidden items-center justify-center gap-1">
                  <Link
                    href={`/tra-cuu-tuyen-sinh?page=${Math.max(currentPage - 1, 1)}`}
                    className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex-shrink-0 ${
                      currentPage === 1 ? "pointer-events-none opacity-40" : ""
                    }`}
                  >
                    &larr;
                  </Link>

                  {(() => {
                    const range: (number | { label: string; page: number })[] = [];
                    if (totalPages <= 4) {
                      for (let i = 1; i <= totalPages; i++) {
                        range.push(i);
                      }
                    } else {
                      range.push(1);
                      range.push(2);
                      range.push(3);
                      if (currentPage > 3 && currentPage < totalPages) {
                        if (currentPage > 4) {
                          range.push({ label: "...", page: currentPage - 1 });
                        }
                        range.push(currentPage);
                      }
                      if (currentPage < totalPages - 1) {
                        range.push({ label: "...", page: currentPage + 1 });
                      }
                      range.push(totalPages);
                    }

                    return range.map((item, idx) => {
                      if (typeof item === "object") {
                        return (
                          <Link
                            key={`mobile-dots-${idx}`}
                            href={`/tra-cuu-tuyen-sinh?page=${item.page}`}
                            className="w-8 h-8 text-xs font-bold text-slate-400 hover:text-violet-600 hover:bg-slate-100 rounded-full transition cursor-pointer flex-shrink-0 text-center flex items-center justify-center"
                          >
                            {item.label}
                          </Link>
                        );
                      }
                      return (
                        <Link
                          key={`mobile-page-${item}`}
                          href={`/tra-cuu-tuyen-sinh?page=${item}`}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition cursor-pointer flex-shrink-0 ${
                            currentPage === item
                              ? "bg-violet-600 text-white font-extrabold"
                              : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-650"
                          }`}
                        >
                          {item}
                        </Link>
                      );
                    });
                  })()}

                  <Link
                    href={`/tra-cuu-tuyen-sinh?page=${Math.min(currentPage + 1, totalPages)}`}
                    className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex-shrink-0 ${
                      currentPage === totalPages ? "pointer-events-none opacity-40" : ""
                    }`}
                  >
                    &rarr;
                  </Link>
                </div>

                {/* Desktop version */}
                <div className="hidden md:flex items-center justify-center gap-2">
                  <Link
                    href={`/tra-cuu-tuyen-sinh?page=${Math.max(currentPage - 1, 1)}`}
                    className={`px-4 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-bold text-slate-650 cursor-pointer flex items-center justify-center ${
                      currentPage === 1 ? "pointer-events-none opacity-40" : ""
                    }`}
                  >
                    &larr; Trước
                  </Link>

                  {(() => {
                    const range: (number | { label: string; page: number })[] = [];
                    const left = Math.max(currentPage - 2, 1);
                    const right = Math.min(currentPage + 2, totalPages);

                    range.push(1);
                    if (left > 2) {
                      if (left === 3) {
                        range.push(2);
                      } else {
                        range.push({ label: "...", page: Math.max(currentPage - 5, 1) });
                      }
                    }
                    for (let i = left; i <= right; i++) {
                      if (i !== 1 && i !== totalPages) {
                        range.push(i);
                      }
                    }
                    if (right < totalPages - 1) {
                      if (right === totalPages - 2) {
                        range.push(totalPages - 1);
                      } else {
                        range.push({ label: "...", page: Math.min(currentPage + 5, totalPages) });
                      }
                    }
                    if (totalPages > 1) {
                      range.push(totalPages);
                    }

                    return range.map((item, idx) => {
                      if (typeof item === "object") {
                        return (
                          <Link
                            key={`desktop-dots-${idx}`}
                            href={`/tra-cuu-tuyen-sinh?page=${item.page}`}
                            className="w-8 h-8 text-xs font-bold text-slate-400 hover:text-violet-600 hover:bg-slate-100 rounded-full transition cursor-pointer flex items-center justify-center"
                          >
                            {item.label}
                          </Link>
                        );
                      }
                      return (
                        <Link
                          key={`desktop-page-${item}`}
                          href={`/tra-cuu-tuyen-sinh?page=${item}`}
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition cursor-pointer ${
                            currentPage === item
                              ? "bg-violet-600 text-white font-extrabold"
                              : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-650"
                          }`}
                        >
                          {item}
                        </Link>
                      );
                    });
                  })()}

                  <Link
                    href={`/tra-cuu-tuyen-sinh?page=${Math.min(currentPage + 1, totalPages)}`}
                    className={`px-4 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition text-xs font-bold text-slate-650 cursor-pointer flex items-center justify-center ${
                      currentPage === totalPages ? "pointer-events-none opacity-40" : ""
                    }`}
                  >
                    Sau &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          <DonateBarMinimal />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal Donate */}
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} />
    </div>
  );
}
