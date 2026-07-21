"use client";

import React from "react";
import { useBookmarks } from "@/hooks/use-bookmarks";

interface BookmarkButtonProps {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  className?: string;
}

export default function BookmarkButton({
  id,
  word,
  meaning,
  ipa,
  className = ""
}: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const active = isBookmarked(id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Chặn lật thẻ flashcard
    if (active) {
      removeBookmark(id);
    } else {
      addBookmark({ id, word, meaning, ipa, tags: ["Từ vựng"] });
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${active
        ? "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400"
        : "text-slate-450 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-450 dark:hover:text-slate-350 dark:hover:bg-slate-900"
        } ${className}`}
      title={active ? "Xóa khỏi Sổ tay" : "Lưu vào Sổ tay"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
