import React from "react";
import Image from "next/image";
import { AffiliateProduct } from "@/lib/markdown";

interface AffiliateProductBoxProps {
  products: AffiliateProduct[];
}

export default function AffiliateProductBox({ products }: AffiliateProductBoxProps) {
  if (!products || products.length === 0) return null;

  // Giới hạn hiển thị tối đa 6 sản phẩm theo BR-302-1
  const displayedProducts = products.slice(0, 6);

  return (
    <section 
      className="mt-12 pt-8 border-t border-slate-150 dark:border-slate-800"
      data-testid="affiliate-box"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Gợi ý dành cho bạn
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
            Được tài trợ
          </span>
        </div>
      </div>

      {/* Lưới ngang trên Desktop, cuộn ngang trên Mobile */}
      <div className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x md:snap-none md:grid-cols-3 gap-4 pb-4 md:pb-0 scrollbar-none">
        {displayedProducts.map((product, idx) => (
          <div
            key={idx}
            className="snap-align-start shrink-0 w-[220px] md:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md hover:border-violet-500/25 transition-all duration-300"
          >
            <div className="space-y-3">
              {/* Ảnh sản phẩm với size cố định chống CLS */}
              <div className="relative w-[120px] h-[160px] mx-auto bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  width={120}
                  height={160}
                  loading="lazy"
                  className="object-contain"
                />
                {product.badge && (
                  <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 bg-violet-600 text-white rounded uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-2 h-8 leading-snug">
                  {product.title}
                </h4>
                <p className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                  {product.priceRange}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <a
                href={product.shopeeUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-extrabold rounded-xl transition duration-200 shadow-sm"
              >
                Mua trên Shopee &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
