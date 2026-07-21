import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PostData } from "@/lib/markdown";
import { getCategoryFallbackImage } from "@/lib/images";
import { getCategoryBySlug } from "@/lib/categories";
import CategoryIcon from "@/components/category-icon";

interface RelatedArticlesProps {
  posts: PostData[];
}

export default function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <div className="space-y-6 mt-12 pt-8 border-t border-border">
      <h3 className="text-xl font-bold text-foreground">Bài viết liên quan</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post, idx) => (
          <React.Fragment key={post.slug}>
            <Link
              href={`/tin-tuc/${post.slug}`}
              scroll={false}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col h-full"
            >
              <div className="h-32 overflow-hidden relative">
                <Image
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  src={post.image || getCategoryFallbackImage(post.category)}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div className="space-y-1">
                  {(() => {
                    const cat = getCategoryBySlug(post.category);
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-800 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                        {cat && <CategoryIcon icon={cat.icon} iconType={cat.iconType} size={10} />}
                        {cat ? cat.name : post.category}
                      </span>
                    );
                  })()}
                  <h4 className="text-sm font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground">{post.date}</p>
              </div>
            </Link>
            {posts.length >= 3 && idx === 1 && (
              <div className="col-span-full py-2">
                {/* Khung trống giữ chỗ chống CLS, hiển thị nhãn Quảng cáo mờ */}
                <div className="ad-container ad-in-feed w-full min-h-[90px] sm:min-h-[250px] bg-slate-100/50 border border-dashed border-border rounded-xl flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 select-none font-semibold">Quảng cáo</span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
