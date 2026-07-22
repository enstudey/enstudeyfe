"use client";

import React, { useState } from "react";
import {
  Trash2,
  Play,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import MistakePracticeSession from "./MistakePracticeSession";
import { fetchMistakes as apiFetchMistakes, deleteMistake as apiDeleteMistake } from "@/lib/api/mistake-bank";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface MistakeBankDashboardProps {
  token: string;
}

export default function MistakeBankDashboard({ token }: MistakeBankDashboardProps) {
  const [status, setStatus] = useState<string>("ALL");
  const [category] = useState<string>("ALL");
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);

  const [isPracticing, setIsPracticing] = useState<boolean>(false);

  const queryClient = useQueryClient();

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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiDeleteMistake(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mistakes"] });
    },
  });

  const handleDelete = (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này khỏi Sổ tay câu sai?")) return;
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <Card className="rounded-3xl bg-rose-600 text-white p-6 md:p-8 shadow-xl border-0 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 text-xs font-bold backdrop-blur-md px-3 py-1">
              <Bookmark className="w-3.5 h-3.5 mr-1 fill-white" />
              Sổ tay Phản xạ 2.0
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Ngân hàng Câu sai & Từ khó
          </h1>
          <p className="text-rose-100 text-xs md:text-sm max-w-xl leading-relaxed font-medium">
            Hệ thống tự động lưu trữ các câu bạn trả lời sai để luyện tập lại theo thuật toán lặp lại ngắt quãng (Spaced Repetition).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsPracticing(true)}
              disabled={items.length === 0}
              className="bg-white text-rose-600 hover:bg-rose-50 font-black rounded-2xl px-6 py-3 text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-0"
            >
              <Play className="w-4 h-4 fill-current mr-2" />
              Luyện tập ngay ({totalItems} câu)
            </Button>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <Card className="p-4 rounded-2xl border-slate-100 bg-white shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Bộ lọc:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {["ALL", "NEEDS_REVIEW", "MASTERED"].map((st) => (
              <Button
                key={st}
                variant={status === st ? "default" : "ghost"}
                size="xs"
                onClick={() => { setStatus(st); setPage(0); }}
                className={`text-[11px] font-bold rounded-lg ${status === st ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"}`}
              >
                {st === "ALL" && "Tất cả"}
                {st === "NEEDS_REVIEW" && "Cần ôn tập 🔴"}
                {st === "MASTERED" && "Đã thuộc 🟢"}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Content List */}
      {loading ? (
        <div className="text-center py-12 space-y-3">
          <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-medium">Đang tải danh sách câu sai...</p>
        </div>
      ) : error ? (
        <Card className="p-6 text-center text-rose-500 bg-rose-50 border-rose-100 rounded-2xl text-xs font-medium">
          {error}
        </Card>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center space-y-4 rounded-3xl bg-white border-slate-100 shadow-xs">
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto animate-pulse" />
          <h3 className="text-base font-bold text-slate-800">Không có câu hỏi nào!</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Tuyệt vời! Bạn chưa có câu hỏi nào bị sai hoặc chưa đến lịch ôn tập.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          <Accordion className="space-y-3">
            {items.map((item) => (
              <AccordionItem
                key={item.id}
                value={String(item.id)}
                className="bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-xs hover:border-slate-200 transition-all border-b-0"
              >
                <div className="flex items-center justify-between gap-4">
                  <AccordionTrigger className="hover:no-underline py-2 flex-1 text-left">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px] font-bold text-rose-600 bg-rose-50 border-rose-200">
                          {item.status}
                        </Badge>
                        <span className="text-xs font-extrabold text-slate-800 line-clamp-1">
                          {item.questionText}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                        <span>Lỗi: {item.mistakeCount} lần</span>
                        <span>Đáp án đúng: <strong className="text-emerald-600">{item.options?.[item.correctIndex] || "N/A"}</strong></span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <AccordionContent className="pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2">
                  <p className="font-semibold text-slate-700">Giải thích chi tiết:</p>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {item.explanation || "Chưa có lời giải thích chi tiết cho câu hỏi này."}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-slate-400 font-medium">
                Trang {page + 1} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  className="rounded-xl cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-xl cursor-pointer"
                >
                  Sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
