import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { cache } from "react";

const CONTENT_DIRECTORY = path.join(process.cwd(), "content");

export interface AffiliateProduct {
  title: string;
  imageUrl: string;
  shopeeUrl: string;
  priceRange: string;
  badge?: string;
}

export interface PostData {
  slug: string;
  category: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  contentHtml?: string;
  faq?: Array<{ question: string; answer: string }>;
  isDraft?: boolean;
  contentType?: string;
  affiliateProducts?: AffiliateProduct[];
}

// Đăng ký marked extension cho highlight ==text==
marked.use({
  extensions: [
    {
      name: "highlight",
      level: "inline",
      start(src: string) {
        return src.indexOf("==");
      },
      tokenizer(src: string) {
        const rule = /^==([^=]+)==/;
        const match = rule.exec(src);
        if (match) {
          return {
            type: "highlight",
            raw: match[0],
            text: match[1].trim(),
          };
        }
      },
      renderer(token) {
        const text = (token as { text?: string }).text ?? "";
        return `<span class="glossary-term cursor-help border-b border-dashed border-sky-500 bg-sky-50/50 px-1 font-semibold text-sky-750" data-term="${text}">${text}</span>`;
      },
    },
  ],
});

const ANSWER_BLOCK_REGEX = /:::answer\s*\n([\s\S]*?)\n:::/g;
const HEADING_TAG_REGEX = /<h([23])>([\s\S]*?)<\/h\1>/g;
const HTML_TAG_REGEX = /<[^>]*>/g;

const NORMALIZE_UNICODE_REGEX = /[\u0300-\u036f]/g;
const VIETNAMESE_D_REGEX = /[đĐ]/g;
const NON_ALPHANUMERIC_REGEX = /[^a-z0-9\s-]/g;
const WHITESPACE_REGEX = /\s+/g;
const REPEATED_DASH_REGEX = /-+/g;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(NORMALIZE_UNICODE_REGEX, "")
    .replace(VIETNAMESE_D_REGEX, "d")
    .replace(NON_ALPHANUMERIC_REGEX, "")
    .trim()
    .replace(WHITESPACE_REGEX, "-")
    .replace(REPEATED_DASH_REGEX, "-");
}

function injectHeadingIds(html: string): string {
  const usedIds = new Set<string>();
  // Dùng [\s\S]*? thay vì .*? để match heading có nội dung nhiều dòng
  return html.replace(HEADING_TAG_REGEX, (match, level, text) => {
    const cleanText = text.replace(HTML_TAG_REGEX, "");
    let slug = slugify(cleanText);
    if (!slug) slug = `section-${level}`;
    if (usedIds.has(slug)) {
      let suffix = 1;
      while (usedIds.has(`${slug}-${suffix}`)) {
        suffix++;
      }
      slug = `${slug}-${suffix}`;
    }
    usedIds.add(slug);
    return `<h${level} id="${slug}">${text}</h${level}>`;
  });
}

function injectInFeedAds(html: string): string {
  const parts = html.split(/(?=<h2)/);
  if (parts.length <= 3) return html;

  let newHtml = "";
  let h2Count = 0;
  for (let i = 0; i < parts.length; i++) {
    newHtml += parts[i];
    if (parts[i].startsWith("<h2")) {
      h2Count++;
      if (h2Count % 3 === 0 && i < parts.length - 1) {
        newHtml += `<div class="ad-container my-6 w-full min-h-[250px] bg-slate-100/50 border border-dashed border-slate-200 flex items-center justify-center rounded-xl relative" data-testid="in-feed-ad">
          <span class="absolute top-2 right-2 text-[8px] uppercase tracking-wider text-slate-400 font-semibold select-none">Liên kết tài trợ</span>
          <div class="w-full flex items-center justify-center">
            <span class="text-[10px] text-slate-400 font-medium">Quảng cáo tài trợ</span>
          </div>
        </div>`;
      }
    }
  }
  return newHtml;
}

export const getPostBySlug = cache((
  category: string,
  slug: string,
  options: { includeContent?: boolean } = { includeContent: true }
): PostData | null => {
  try {
    const fullPath = path.join(CONTENT_DIRECTORY, category, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    let contentHtml = "";
    if (options.includeContent !== false) {
      // Thay thế block :::answer trước khi parse
      const parsedContent = content.replace(ANSWER_BLOCK_REGEX, (match, body) => {
        const lines = body.trim().split("\n");
        let question = "";
        let optionsList: string[] = [];
        let correct = "";
        let explanation = "";

        lines.forEach((line: string) => {
          const trimmed = line.trim();
          if (trimmed.startsWith("question:")) {
            question = trimmed.replace("question:", "").trim();
          } else if (trimmed.startsWith("options:")) {
            optionsList = trimmed
              .replace("options:", "")
              .split(",")
              .map((o) => o.trim());
          } else if (trimmed.startsWith("correct:")) {
            correct = trimmed.replace("correct:", "").trim();
          } else if (trimmed.startsWith("explanation:")) {
            explanation = trimmed.replace("explanation:", "").trim();
          }
        });

        if (question && optionsList.length > 0 && correct && explanation) {
          return `<div class="interactive-quiz-block my-6 p-5 bg-sky-50/50 border border-sky-100 rounded-2xl" 
            data-question="${encodeURIComponent(question)}"
            data-options="${encodeURIComponent(JSON.stringify(optionsList))}"
            data-correct="${encodeURIComponent(correct)}"
            data-explanation="${encodeURIComponent(explanation)}">
          </div>`;
        }

        const htmlBody = marked(body.trim()) as string;
        return `<div class="interactive-answer my-4" data-testid="interactive-answer">
          <button class="toggle-answer-btn px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-extrabold rounded-xl transition duration-200 cursor-pointer">Xem đáp án</button>
          <div class="answer-content hidden border-l-2 border-sky-500 pl-4 py-2 my-2 bg-slate-50 dark:bg-slate-900 rounded-r-xl">${htmlBody}</div>
        </div>`;
      });

      const contentHtmlRaw = marked(parsedContent) as string;
      contentHtml = injectHeadingIds(contentHtmlRaw);

      if (data.contentType === "cheat-sheet") {
        contentHtml = injectInFeedAds(contentHtml);
      }
    }

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const contentLower = content.toLowerCase();
    const isDraft = data.draft === true ||
      contentLower.includes("[đang cập nhật...]") ||
      contentLower.includes("sẽ được cập nhật sau") ||
      contentLower.includes("chưa hoàn thiện") ||
      (wordCount < 800 && !data.forceIndex);

    return {
      slug,
      category,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      image: data.image || "",
      contentHtml,
      faq: data.faq || [],
      isDraft,
      contentType: data.contentType || "blog",
      affiliateProducts: data.affiliateProducts || [],
    };
  } catch {
    return null;
  }
});

export const getAllPostsMetadata = cache((includeDraft: boolean = false): PostData[] => {
  const categories = ["skills", "toeic", "ielts", "grammar", "nganh-hoc"];
  const posts: PostData[] = [];

  for (const category of categories) {
    const categoryPath = path.join(CONTENT_DIRECTORY, category);
    if (!fs.existsSync(categoryPath)) {
      continue;
    }

    const fileNames = fs.readdirSync(categoryPath);
    for (const fileName of fileNames) {
      if (!fileName.endsWith(".md")) {
        continue;
      }
      const slug = fileName.replace(/\.md$/, "");
      const post = getPostBySlug(category, slug, { includeContent: false });
      if (post && (includeDraft || !post.isDraft)) {
        posts.push(post);
      }
    }
  }

  // Sort by date descending
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
});

export const getAllPosts = cache((includeDraft: boolean = false): PostData[] => {
  const categories = ["skills", "toeic", "ielts", "grammar", "nganh-hoc"];
  const posts: PostData[] = [];

  for (const category of categories) {
    const categoryPath = path.join(CONTENT_DIRECTORY, category);
    if (!fs.existsSync(categoryPath)) {
      continue;
    }

    const fileNames = fs.readdirSync(categoryPath);
    for (const fileName of fileNames) {
      if (!fileName.endsWith(".md")) {
        continue;
      }
      const slug = fileName.replace(/\.md$/, "");
      const post = getPostBySlug(category, slug, { includeContent: true });
      if (post && (includeDraft || !post.isDraft)) {
        posts.push(post);
      }
    }
  }

  // Sort by date descending
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
});

export const getRelatedPosts = cache((currentSlug: string, category: string, limit: number = 4): PostData[] => {
  const allPosts = getAllPostsMetadata(false);
  return allPosts
    .filter(post => post.category === category && post.slug !== currentSlug)
    .slice(0, limit);
});
