import React from "react";

interface HeadingItem {
  level: number;
  text: string;
  id: string;
}

export default function TableOfContents({ contentHtml }: { contentHtml: string }) {
  const headings: HeadingItem[] = [];
  const regex = /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h\1>/g;
  let match;
  
  // Trích xuất các tiêu đề H2, H3 đã được gắn ID
  while ((match = regex.exec(contentHtml)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, ""); // Loại bỏ tag nested bên trong text
    headings.push({ level, text, id });
  }

  if (headings.length === 0) return null;

  return (
    <nav className="p-5 bg-slate-100/60 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-2xl mb-6">
      <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-3">Mục lục bài viết</p>
      <ul className="space-y-2 text-xs font-medium">
        {headings.map((h, i) => (
          <li
            key={i}
            className={`${
              h.level === 3 
                ? "pl-4 text-slate-500 dark:text-zinc-400" 
                : "text-orange-600 dark:text-orange-500 hover:underline"
            }`}
          >
            <a href={`#${h.id}`} className="hover:underline transition duration-150">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
