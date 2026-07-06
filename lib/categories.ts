export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  iconType: "EMOJI" | "SVG";
}

export const CATEGORIES: Category[] = [
  { id: "skills", name: "Kỹ năng học thuật", slug: "skills", icon: "lucide:lightbulb", iconType: "SVG" },
  { id: "toeic", name: "Mẹo thi TOEIC", slug: "toeic", icon: "lucide:graduation-cap", iconType: "SVG" },
  { id: "ielts", name: "Tư liệu IELTS", slug: "ielts", icon: "lucide:book-open", iconType: "SVG" },
  { id: "grammar", name: "Ngữ pháp & Bổ trợ", slug: "grammar", icon: "lucide:pen-tool", iconType: "SVG" }
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}
