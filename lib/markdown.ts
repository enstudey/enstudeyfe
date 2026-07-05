import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const CONTENT_DIRECTORY = path.join(process.cwd(), "content");

export interface PostData {
  slug: string;
  category: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  contentHtml: string;
  faq?: Array<{ question: string; answer: string }>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function injectHeadingIds(html: string): string {
  const usedIds = new Set<string>();
  // Dùng [\s\S]*? thay vì .*? để match heading có nội dung nhiều dòng
  return html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (match, level, text) => {
    const cleanText = text.replace(/<[^>]*>/g, "");
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

export function getPostBySlug(category: string, slug: string): PostData | null {
  try {
    const fullPath = path.join(CONTENT_DIRECTORY, category, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const contentHtmlRaw = marked(content) as string;
    const contentHtml = injectHeadingIds(contentHtmlRaw);

    return {
      slug,
      category,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      image: data.image || "",
      contentHtml,
      faq: data.faq || [],
    };
  } catch {
    return null;
  }
}


export function getAllPosts(): PostData[] {
  const categories = ["skills", "toeic", "ielts", "grammar"];
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
      const post = getPostBySlug(category, slug);
      if (post) {
        posts.push(post);
      }
    }
  }

  // Sort by date descending
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRelatedPosts(currentSlug: string, category: string, limit: number = 4): PostData[] {
  const allPosts = getAllPosts();
  return allPosts
    .filter(post => post.category === category && post.slug !== currentSlug)
    .slice(0, limit);
}
