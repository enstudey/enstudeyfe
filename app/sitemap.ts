import { MetadataRoute } from "next";
import { getAllPostsMetadata } from "@/lib/markdown";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostsMetadata();
  const blogUrls = posts
    .filter((p) => !p.isDraft)
    .map((p) => ({
      url: `https://enstudey.com/tin-tuc/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    { url: "https://enstudey.com", priority: 1.0 },
    { url: "https://enstudey.com/tin-tuc", priority: 0.9 },
    { url: "https://enstudey.com/tinh-diem-tot-nghiep", priority: 0.9 },
    { url: "https://enstudey.com/tra-cuu-tuyen-sinh", priority: 0.8 },
    { url: "https://enstudey.com/nganh-hoc", priority: 0.8 },
    { url: "https://enstudey.com/so-tay", priority: 0.8 },
    { url: "https://enstudey.com/luyen-noi", priority: 0.8 },
    { url: "https://enstudey.com/the-ghi-nho", priority: 0.8 },
    { url: "https://enstudey.com/thong-ke", priority: 0.8 },
    { url: "https://enstudey.com/lo-trinh", priority: 0.8 },
    { url: "https://enstudey.com/ngan-hang-cau-sai", priority: 0.8 },
    { url: "https://enstudey.com/luyen-de", priority: 0.8 },
    { url: "https://enstudey.com/about", priority: 0.5 },
    { url: "https://enstudey.com/privacy-policy", priority: 0.3 },
    { url: "https://enstudey.com/terms-of-service", priority: 0.3 },
    ...blogUrls,
  ];
}
