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
  contentHtml: string;
  faq?: Array<{ question: string; answer: string }>;
}

export function getPostBySlug(category: string, slug: string): PostData | null {
  try {
    const fullPath = path.join(CONTENT_DIRECTORY, category, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const contentHtml = marked(content) as string;

    return {
      slug,
      category,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
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
