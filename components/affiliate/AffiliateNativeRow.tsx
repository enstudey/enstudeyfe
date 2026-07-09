"use client";

import Image from "next/image";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/shopee-affiliate-products.json";

interface Props {
  rowIndex: number;
  currentPage: number;
  isCard?: boolean;
}

export default function AffiliateNativeRow({ rowIndex, currentPage, isCard = false }: Props) {
  let dormProducts: AffiliateProduct[] = [];
  try {
    dormProducts = (productsData as AffiliateProduct[]).filter(p => p.category === "dorm");
  } catch (error) {
    console.error("Error loading affiliate products:", error);
    return null;
  }

  if (dormProducts.length === 0) return null;

  // Tính chỉ số dòng toàn cục để đổi sản phẩm khác nhau trên từng trang phân trang
  const globalIndex = (currentPage - 1) + rowIndex;
  const product = dormProducts[globalIndex % dormProducts.length];

  if (isCard) {
    return (
      <div className="bg-slate-50/30 dark:bg-zinc-950/20 border-b border-slate-200 dark:border-zinc-800">
        <a
          href={`/go/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-100/30 dark:hover:bg-zinc-900/30 transition duration-200 group"
          data-testid={`affiliate-native-card-${rowIndex}`}
        >
          <div className="flex items-center gap-3">
            <Image
              src={product.imagePath}
              alt={product.title}
              width={40}
              height={40}
              className="rounded-xl object-cover flex-shrink-0"
            />
            <div>
              <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition line-clamp-1">
                {product.title}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5 line-clamp-1">
                Gợi ý dành cho bạn: {product.description}
              </p>
            </div>
          </div>
          <span className="text-[8px] text-slate-400 dark:text-zinc-600 font-bold border border-slate-200 dark:border-zinc-800 rounded px-1.5 py-0.5 flex-shrink-0 whitespace-nowrap">
            GỢI Ý CHO BẠN
          </span>
        </a>
      </div>
    );
  }

  return (
    <tr className="bg-slate-50/20 dark:bg-zinc-950/20">
      <td className="p-0" colSpan={4}>
        <a
          href={`/go/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-slate-100/30 dark:hover:bg-zinc-900/30 transition duration-200 group"
          data-testid={`affiliate-native-row-${rowIndex}`}
        >
          <div className="flex items-center gap-3">
            <Image
              src={product.imagePath}
              alt={product.title}
              width={44}
              height={44}
              className="rounded-xl object-cover flex-shrink-0"
            />
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-500 transition">
                {product.title}
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
                Gợi ý dành cho bạn: {product.description}
              </p>
            </div>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-zinc-650 font-bold border border-slate-200 dark:border-zinc-800 rounded px-1.5 py-0.5 flex-shrink-0 whitespace-nowrap">
            LIÊN KẾT TÀI TRỢ
          </span>
        </a>
      </td>
    </tr>
  );
}
