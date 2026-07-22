"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { TextHighlight } from "@/types/exam";
import { Highlighter, X } from "lucide-react";

interface ExamReadingPassageProps {
  passageText: string;
  highlights: TextHighlight[];
  onAddHighlight: (highlight: TextHighlight) => void;
  onRemoveHighlight: (id: string) => void;
}

export default function ExamReadingPassage({
  passageText,
  highlights,
  onAddHighlight,
  onRemoveHighlight,
}: ExamReadingPassageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");

  // Bắt sự kiện bôi đen văn bản
  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setTooltipPos(null);
      setSelectedText("");
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 2) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (containerRef.current && containerRef.current.contains(range.commonAncestorContainer)) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 42,
      });
      setSelectedText(text);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelection);
    return () => {
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, [handleSelection]);

  const applyHighlight = (color: "yellow" | "cyan" | "green") => {
    if (!selectedText) return;
    const newHighlight: TextHighlight = {
      id: `hl-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: selectedText,
      color,
    };
    onAddHighlight(newHighlight);
    setTooltipPos(null);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  };

  // Render đoạn văn bản kèm bôi đen highlight
  const renderHighlightedPassage = () => {
    if (!highlights || highlights.length === 0) {
      return passageText;
    }

    let formattedText = passageText;

    highlights.forEach((hl) => {
      if (!hl.text) return;
      const colorClass =
        hl.color === "yellow"
          ? "bg-amber-200 text-slate-900"
          : hl.color === "cyan"
          ? "bg-sky-200 text-slate-900"
          : "bg-emerald-200 text-slate-900";

      const escaped = hl.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "g");
      formattedText = formattedText.replace(
        regex,
        `<mark class="${colorClass} px-0.5 rounded font-medium cursor-pointer" data-hl-id="${hl.id}">${hl.text}</mark>`
      );
    });

    return (
      <span
        dangerouslySetInnerHTML={{ __html: formattedText }}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === "MARK" && target.dataset.hlId) {
            onRemoveHighlight(target.dataset.hlId);
          }
        }}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-xs select-text h-full overflow-y-auto"
    >
      {/* Header chỉ báo */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3 select-none">
        <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
          <Highlighter className="w-3 h-3" />
          Reading Passage • Hỗ trợ bôi đen Highlight
        </span>

        {highlights.length > 0 && (
          <span className="text-[10px] text-slate-400 font-medium">
            Đã highlight {highlights.length} cụm từ
          </span>
        )}
      </div>

      {/* Floating Highlight Tooltip Bar */}
      {tooltipPos && (
        <div
          style={{
            left: `${tooltipPos.x}px`,
            top: `${Math.max(10, tooltipPos.y)}px`,
            transform: "translateX(-50%)",
          }}
          className="absolute z-30 flex items-center gap-1 bg-slate-900 text-white p-1 rounded-xl shadow-lg border border-slate-700 animate-in fade-in zoom-in duration-150 select-none"
        >
          <button
            onClick={() => applyHighlight("yellow")}
            data-testid="btn-highlight-yellow"
            title="Highlight Vàng"
            className="w-6 h-6 rounded-lg bg-amber-300 text-slate-900 hover:scale-105 transition-transform flex items-center justify-center font-bold text-xs"
          >
            Y
          </button>
          <button
            onClick={() => applyHighlight("cyan")}
            title="Highlight Xanh Dương"
            className="w-6 h-6 rounded-lg bg-sky-300 text-slate-900 hover:scale-105 transition-transform flex items-center justify-center font-bold text-xs"
          >
            C
          </button>
          <button
            onClick={() => applyHighlight("green")}
            title="Highlight Xanh Lá"
            className="w-6 h-6 rounded-lg bg-emerald-300 text-slate-900 hover:scale-105 transition-transform flex items-center justify-center font-bold text-xs"
          >
            G
          </button>
          <span className="w-px h-3.5 bg-slate-700 mx-0.5" />
          <button
            onClick={() => {
              setTooltipPos(null);
              setSelectedText("");
            }}
            className="w-5 h-5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Nội dung bài đọc */}
      <div className="exam-passage-container whitespace-pre-wrap text-slate-800 leading-relaxed text-xs sm:text-sm selection:bg-amber-200">
        {renderHighlightedPassage()}
      </div>
    </div>
  );
}
