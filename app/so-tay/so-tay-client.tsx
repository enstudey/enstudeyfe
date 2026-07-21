"use client";

import React, { useState } from "react";
import SpeechButton from "@/components/ui/speech-button";
import { useBookmarks, BookmarkItem } from "@/hooks/use-bookmarks";

export default function SoTayClient() {
  const { bookmarks, removeBookmark, addBookmark } = useBookmarks();
  const [searchTerm, setSearchTerm] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  // Tìm kiếm từ vựng hoặc nghĩa
  const filteredBookmarks = bookmarks.filter(
    (b) =>
      b.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xuất file JSON
  const handleExport = () => {
    if (bookmarks.length === 0) {
      alert("Không có từ vựng nào để xuất!");
      return;
    }
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `enstudey-so-tay-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Nhập file JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!Array.isArray(json)) {
          throw new Error("Dữ liệu không phải là một danh sách hợp lệ!");
        }

        // Validate cấu trúc
        let importCount = 0;
        json.forEach((item: Partial<BookmarkItem>) => {
          if (item.id && item.word && item.meaning && item.ipa) {
            addBookmark({
              id: item.id,
              word: item.word,
              meaning: item.meaning,
              ipa: item.ipa,
              tags: item.tags || ["Từ vựng"]
            });
            importCount++;
          }
        });

        alert(`Nhập thành công ${importCount} từ vựng vào Sổ tay!`);
        window.location.reload(); // Reload trang để tải lại local storage
      } catch (err: unknown) {
        setImportError(err instanceof Error ? err.message : "Tệp tin không đúng định dạng JSON!");
      }
    };
    reader.readAsText(file);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">
          Kho lưu trữ từ vựng cá nhân 📖✨
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Sổ Tay Từ Vựng
        </h1>
        <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
          Nơi lưu trữ tất cả từ vựng bạn đã đánh dấu khi học. Ôn tập phát âm và quản lý dễ dàng bất cứ lúc nào.
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm kiếm từ hoặc nghĩa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 bg-transparent"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-250 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition duration-200 cursor-pointer text-center flex items-center justify-center">
            Nhập JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition duration-200 cursor-pointer text-center flex items-center justify-center shadow"
          >
            Xuất JSON
          </button>
        </div>
      </div>

      {importError && (
        <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
          Lỗi nhập file: {importError}
        </div>
      )}

      {/* List content */}
      {filteredBookmarks.length === 0 ? (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-12 rounded-3xl text-center space-y-4 shadow-sm">
          <div className="text-4xl">📚</div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            Sổ tay hiện tại trống!
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Bấm biểu tượng Bookmark trên các thẻ từ vựng khi đang ôn tập flashcard để lưu trữ từ vựng vào đây.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-5">Từ vựng / Phiên âm</th>
                  <th className="py-3 px-5">Giải nghĩa</th>
                  <th className="py-3 px-5">Ngày lưu</th>
                  <th className="py-3 px-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                {filteredBookmarks.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                  >
                    <td className="py-4 px-5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {item.word}
                        </span>
                        <SpeechButton text={item.word} id={item.id} size="sm" />
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {item.ipa}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-xs text-slate-650 dark:text-slate-300 font-medium">
                      {item.meaning}
                    </td>
                    <td className="py-4 px-5 text-xs text-slate-400">
                      {new Date(item.savedAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => removeBookmark(item.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition duration-200 cursor-pointer inline-flex items-center justify-center"
                        title="Xóa từ"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          viewBox="0 0 24 24"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
