"use client";

import React, { useState } from "react";
import { 
  Trash2, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Sparkles, 
  Bookmark, 
  Calendar, 
  Flame,
  CheckCircle2
} from "lucide-react";
import MistakePracticeSession from "./MistakePracticeSession";
import { fetchMistakes as apiFetchMistakes, deleteMistake as apiDeleteMistake } from "@/lib/api/mistake-bank";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface MistakeBankDashboardProps {
  token: string;
}

export default function MistakeBankDashboard({ token }: MistakeBankDashboardProps) {
  // Bộ lọc & phân trang
  const [status, setStatus] = useState<string>("ALL");
  const [category, setCategory] = useState<string>("ALL");
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);
  
  // Trạng thái làm bài ôn tập
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  // Lấy danh sách câu sai từ Backend bằng useQuery
  const {
    data,
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: ["mistakes", token, page, size, status, category],
    queryFn: () => apiFetchMistakes(token, { page, size, status, category }),
  });

  const error = queryError instanceof Error ? queryError.message : null;
  const items = data?.data || [];
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / size);

  // Xóa câu sai khỏi sổ tay bằng useMutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiDeleteMistake(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mistakes"] });
      setExpandedId(null);
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : "Xóa câu hỏi thất bại.");
    }
  });

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này khỏi sổ tay câu sai?")) {
      return;
    }
    deleteMutation.mutate(id);
  };

  if (isPracticing) {
    return (
      <MistakePracticeSession 
        token={token} 
        onClose={() => {
          setIsPracticing(false);
          queryClient.invalidateQueries({ queryKey: ["mistakes"] });
        }} 
      />
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Khung Header Banner & Quick Action */}
      <div className="bg-gradient-to-r from-violet-650 to-indigo-650 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center justify-center md:justify-start gap-2">
            <Sparkles className="w-8 h-8 text-yellow-300" />
            Luyện Tập Gột Rửa Sai Lầm
          </h2>
          <p className="text-violet-100 text-sm max-w-xl">
            Tự động lưu và bốc ngẫu nhiên tối đa 10 câu hỏi bạn đã làm sai để tiến hành ôn luyện, gia tăng chuỗi trả lời đúng để đánh dấu thành thạo!
          </p>
        </div>
        <button
          onClick={() => setIsPracticing(true)}
          className="bg-yellow-450 hover:bg-yellow-500 text-slate-900 font-bold px-8 py-4 rounded-2xl shadow-lg flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition cursor-pointer text-sm shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          Bắt đầu Ôn tập ngay
        </button>
      </div>

      {/* Thanh Điều Hướng Bộ Lọc */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase mr-2">
            <Filter className="w-3.5 h-3.5" /> Trạng thái:
          </span>
          {["ALL", "UNSEEN", "REVIEWED", "MASTERED"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatus(st);
                setPage(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                status === st
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-650"
              }`}
            >
              {st === "ALL" ? "Tất cả" : st === "UNSEEN" ? "Chưa ôn" : st === "REVIEWED" ? "Đang ôn" : "Thành thạo 💎"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase mr-2">
            <Bookmark className="w-3.5 h-3.5" /> Loại câu:
          </span>
          {["ALL", "GRAMMAR", "VOCABULARY", "READING"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                category === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-650"
              }`}
            >
              {cat === "ALL" ? "Tất cả" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hiển thị lỗi */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-750 p-4 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[250px] space-y-3">
          <div className="w-10 h-10 border-4 border-violet-650 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-400">Đang đồng bộ sổ tay câu sai...</span>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
          <div className="text-5xl">🎉</div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Sổ tay sạch bóng lỗi sai!</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              {status !== "ALL" || category !== "ALL" 
                ? "Không tìm thấy câu hỏi sai nào phù hợp với bộ lọc bạn chọn. Hãy thử thay đổi bộ lọc nhé!"
                : "Không có câu sai nào trong hệ thống. Bạn đang làm cực tốt! Hãy tiếp tục phát huy ở các đề thi thật nhé!"
              }
            </p>
          </div>
        </div>
      ) : (
        /* Danh sách câu sai */
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 px-2 uppercase">
            <span>Danh sách câu hỏi ({totalItems})</span>
            <span>Click để xem đáp án giải thích</span>
          </div>

          <div className="grid gap-3">
            {items.map((item) => {
              const isExpanded = expandedId === item.id;
              const formattedDate = new Date(item.lastFailedAt).toLocaleDateString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
              });

              return (
                <div 
                  key={item.id}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className={`bg-white border rounded-2xl p-5 shadow-sm transition hover:shadow cursor-pointer text-left space-y-4 overflow-hidden border-l-4 ${
                    item.status === "MASTERED" 
                      ? "border-l-emerald-500 border-slate-200" 
                      : item.status === "REVIEWED" 
                      ? "border-l-yellow-500 border-slate-200" 
                      : "border-l-red-500 border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Tag trạng thái */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === "MASTERED" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : item.status === "REVIEWED"
                            ? "bg-yellow-50 text-yellow-800 border border-yellow-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                          {item.status === "MASTERED" ? "Thành thạo" : item.status === "REVIEWED" ? "Đang ôn tập" : "Chưa làm"}
                        </span>
                        
                        {/* Streak */}
                        {item.correctStreak > 0 && (
                          <span className="text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Flame className="w-3 h-3 text-orange-500 fill-current" />
                            Streak: {item.correctStreak}
                          </span>
                        )}
                        
                        {/* Lần sai */}
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Lần sai: {item.mistakeCount}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm sm:text-base leading-relaxed pr-6">
                        {item.questionText}
                      </h4>
                    </div>
                    
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition cursor-pointer"
                      title="Xóa khỏi sổ tay"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Chi tiết đáp án và giải thích */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-100 space-y-4 animate-slideDown">
                      <div className="grid gap-2 sm:grid-cols-2">
                        {item.options.map((opt, oIdx) => {
                          const isCorrect = oIdx === item.correctIndex;
                          return (
                            <div 
                              key={oIdx}
                              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                                isCorrect 
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                                  : "bg-slate-50 text-slate-600 border-slate-100"
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                              }`}>
                                {["A", "B", "C", "D"][oIdx]}
                              </span>
                              {opt}
                            </div>
                          );
                        })}
                      </div>

                      {item.explanation && (
                        <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-xs space-y-1">
                          <div className="font-bold text-violet-850 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Giải thích chi tiết:
                          </div>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {item.explanation}
                          </p>
                        </div>
                      )}

                      <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 justify-end">
                        <Calendar className="w-3.5 h-3.5" />
                        Lần sai cuối: {formattedDate}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-6 max-w-sm mx-auto text-xs font-bold text-slate-500">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-1 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Trang trước
              </button>
              
              <span>Trang {page + 1} / {totalPages}</span>

              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-1 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer"
              >
                Trang sau <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
