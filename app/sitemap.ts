import { MetadataRoute } from "next";
import { getAllPostsMetadata } from "@/lib/markdown";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostsMetadata();
  const blogUrls = posts
    .filter((p) => !p.isDraft)
    .map((p) => ({
      url: `https://enstudey.com/blog/${p.category}/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    { url: "https://enstudey.com", priority: 1.0 },
    { url: "https://enstudey.com/blog", priority: 0.9 },
    { url: "https://enstudey.com/tra-cuu-tuyen-sinh", priority: 0.8 },
    { url: "https://enstudey.com/nganh-hoc", priority: 0.8 },
    { url: "https://enstudey.com/gioi-thieu", priority: 0.5 },
    { url: "https://enstudey.com/privacy-policy", priority: 0.3 },
    { url: "https://enstudey.com/terms-of-service", priority: 0.3 },
    ...blogUrls,
  ];
}
