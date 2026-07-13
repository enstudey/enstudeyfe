"use client";

import { useState, useCallback } from "react";

export interface BookmarkItem {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  savedAt: string;
  tags?: string[];
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("user_bookmarks");
      if (data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error("Failed to parse user_bookmarks", e);
          return [];
        }
      }
    }
    return [];
  });

  const addBookmark = useCallback((item: Omit<BookmarkItem, "savedAt">) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === item.id)) return prev;
      const newItem: BookmarkItem = {
        ...item,
        savedAt: new Date().toISOString(),
        tags: item.tags || ["Từ vựng"]
      };
      const updated = [...prev, newItem];
      localStorage.setItem("user_bookmarks", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      localStorage.setItem("user_bookmarks", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => {
    return bookmarks.some((b) => b.id === id);
  }, [bookmarks]);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
