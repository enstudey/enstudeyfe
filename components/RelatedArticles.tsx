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
    <div className="space-y-6 mt-12 pt-8 border-t border-slate-200 dark:border-zinc-700">
      <h3 className="text-xl font-bold text-slate-950 dark:text-white">Bài viết liên quan</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post, idx) => (
          <React.Fragment key={post.slug}>
            <Link 
              href={`/tin-tuc/${post.slug}`} 
              className="group relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col h-full"
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
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                        {cat && <CategoryIcon icon={cat.icon} iconType={cat.iconType} size={10} />}
                        {cat ? cat.name : post.category}
                      </span>
                    );
                  })()}
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 dark:text-zinc-500">{post.date}</p>
              </div>
            </Link>
            {posts.length >= 3 && idx === 1 && (
              <div className="col-span-full py-2">
                {/* Khung trống giữ chỗ chống CLS, hiển thị nhãn Quảng cáo mờ */}
                <div className="ad-container ad-in-feed w-full min-h-[90px] sm:min-h-[250px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
