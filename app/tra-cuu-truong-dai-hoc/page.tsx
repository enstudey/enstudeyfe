"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import universitiesData from "@/data/universities-benchmark.json";

interface UniversityBenchmark {
  majorCode: string;
  majorName: string;
  universityCode: string;
  universityName: string;
  subjectGroup: string;
  benchmark: number;
  location: string;
  category: string;
}

export default function FinderPage() {
  const [computedScores, setComputedScores] = useState<Record<string, number> | null>(null);

  // Bộ lọc nguyện vọng
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("Tất cả tổ hợp");
  const [scoreRange, setScoreRange] = useState<number>(30);
  const [filteredResults, setFilteredResults] = useState<UniversityBenchmark[]>([]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Đọc điểm đã lưu từ localStorage khi Component được mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem("user_scores");
        if (stored) {
          setComputedScores(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Lỗi khi đọc điểm từ localStorage", e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Thực hiện lọc dữ liệu
  const applyFilters = useCallback(() => {
    let list = (universitiesData as UniversityBenchmark[]);

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      list = list.filter(item => 
        item.universityName.toLowerCase().includes(term) ||
        item.universityCode.toLowerCase().includes(term) ||
        item.majorName.toLowerCase().includes(term) ||
        item.majorCode.includes(term)
      );
    }

    if (selectedGroup !== "Tất cả tổ hợp") {
      list = list.filter(item => item.subjectGroup.includes(selectedGroup));
    }

    list = list.filter(item => item.benchmark <= scoreRange);

    setFilteredResults(list);
    setCurrentPage(1);
  }, [searchTerm, selectedGroup, scoreRange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 0);
    return () => clearTimeout(timer);
  }, [applyFilters]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getZoneClass = (item: UniversityBenchmark) => {
    if (!computedScores) return "";
    
    const groups = item.subjectGroup.split(",").map(g => g.trim());
    let userScore = 0;
    
    groups.forEach(g => {
      if (computedScores[g] && computedScores[g] > userScore) {
        userScore = computedScores[g];
      }
    });

    if (userScore === 0) return "";

    const diff = userScore - item.benchmark;
    if (diff >= 1.5) return "safe-zone";
    if (diff <= -1.5) return "risk-zone";
    return "fight-zone";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">Tra cứu trường đại học 🔍</h1>
            <p className="text-slate-500 dark:text-zinc-400 text-sm">Gợi ý và sắp xếp các nguyện vọng phù hợp với khoảng điểm và tổ hợp của bạn.</p>
          </div>
          <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-zinc-900 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span> An toàn
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-zinc-900 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span> Cọ xát
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-zinc-900 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span> Rủi ro
            </div>
          </div>
        </div>

        {computedScores ? (
          <div className="bg-orange-50/50 dark:bg-zinc-900 border border-orange-500/20 rounded-2xl p-4 text-xs font-semibold text-slate-800 dark:text-zinc-350 flex justify-between items-center">
            <span>
              Hệ thống đang đối sánh tự động dựa trên điểm số đã tính: A00: {computedScores.A00} | A01: {computedScores.A01} | B00: {computedScores.B00} | D01: {computedScores.D01}
            </span>
            <Link href="/tinh-diem" className="text-orange-600 dark:text-orange-500 hover:underline">
              Tính điểm lại &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 text-xs font-semibold text-slate-600 dark:text-zinc-400 flex justify-between items-center">
            <span>Bạn chưa tính điểm thi THPT? Tính ngay để xem gợi ý các phân vùng an toàn/rủi ro.</span>
            <Link href="/tinh-diem" className="text-orange-600 dark:text-orange-500 hover:underline">
              Tính điểm thi &rarr;
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Bộ lọc bên trái */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-slate-150 dark:border-zinc-800 rounded-2xl p-5 space-y-5 sticky top-24">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">Tìm kiếm trường / ngành</label>
              <input
                type="text"
                placeholder="Nhập mã trường, tên ngành..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-sm font-semibold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">Tổ hợp môn</label>
              <select
                value={selectedGroup}
                onChange={e => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 text-sm font-semibold"
              >
                <option>Tất cả tổ hợp</option>
                <option>A00</option>
                <option>A01</option>
                <option>B00</option>
                <option>D01</option>
              </select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
                <span>Khoảng điểm sàn</span>
                <span className="text-orange-600 dark:text-orange-500">{scoreRange} Điểm</span>
              </div>
              <input
                type="range"
                min="15"
                max="30"
                step="0.1"
                value={scoreRange}
                onChange={e => setScoreRange(parseFloat(e.target.value))}
                className="w-full accent-orange-600 dark:accent-orange-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Bảng kết quả bên phải */}
          <div className="lg:col-span-9 overflow-hidden border border-slate-150 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-150 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    <th className="px-6 py-4">Mã ngành</th>
                    <th className="px-6 py-4">Tên ngành / Trường</th>
                    <th className="px-6 py-4">Tổ hợp</th>
                    <th className="px-6 py-4 text-right">Điểm chuẩn năm trước</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-zinc-800">
                  {paginatedResults.length > 0 ? (
                    paginatedResults.map((item, idx) => (
                      <React.Fragment key={`${item.universityCode}-${item.majorCode}`}>
                        <tr className={`group hover:bg-slate-50/50 dark:hover:bg-zinc-850/30 transition duration-200 cursor-pointer ${getZoneClass(item)}`}>
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{item.majorCode}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900 dark:text-white">{item.majorName}</p>
                            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{item.universityName} ({item.universityCode})</p>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-600 dark:text-zinc-400 text-xs">{item.subjectGroup}</td>
                          <td className="px-6 py-4 text-right font-extrabold text-orange-600 dark:text-orange-500 text-base">{item.benchmark}</td>
                        </tr>
                        {idx === 1 && (
                          <tr className="bg-slate-50/20 dark:bg-zinc-950/20">
                            <td className="p-0" colSpan={4}>
                              <div className="ad-container ad-h-banner w-full flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-slate-200 dark:bg-zinc-850 rounded-xl flex items-center justify-center font-bold">🏫</div>
                                  <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">Thông tin học bổng học phí 2026</p>
                                    <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">Nhận ngay học bổng tài trợ 50% dành cho các tân sinh viên.</p>
                                  </div>
                                </div>
                                <button className="px-4 py-2 border-2 border-orange-600 hover:bg-orange-600 hover:text-white text-orange-600 text-xs font-extrabold rounded-full transition duration-200 cursor-pointer">
                                  XEM CHI TIẾT
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400 dark:text-zinc-500 font-semibold">
                        Không tìm thấy trường nào phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="p-5 bg-slate-50 dark:bg-zinc-950 border-t border-slate-100 dark:border-zinc-800 flex justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  &larr;
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                      currentPage === i + 1
                        ? "bg-slate-900 dark:bg-zinc-800 text-white"
                        : "border border-slate-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-800 flex items-center justify-center hover:bg-white dark:hover:bg-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
