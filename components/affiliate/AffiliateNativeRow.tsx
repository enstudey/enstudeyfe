import Image from "next/image";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/affiliate-products.json";
import AdSenseSlot from "@/components/ads/AdSenseSlot";

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
  const globalIndex = (currentPage - 1) * 5 + rowIndex; // Đảm bảo index tăng dần
  const product = dormProducts[globalIndex % dormProducts.length];

  if (globalIndex % 2 === 0) {
    if (isCard) {
      return (
        <div className="p-4 border-b border-border bg-slate-50/50">
          <AdSenseSlot slotId="search-list-mobile-ad" minHeight="90px" format="horizontal" />
        </div>
      );
    }
    return (
      <tr className="bg-slate-50/10 hover:bg-slate-50 transition duration-200">
        <td className="px-6 py-4" colSpan={4}>
          <AdSenseSlot slotId="search-list-desktop-ad" minHeight="90px" format="horizontal" />
        </td>
      </tr>
    );
  }

  if (isCard) {
    return (
      <div className="hover:bg-slate-50 transition duration-200">
        <a
          href={`/redirect?url=${encodeURIComponent(`/go/${product.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="flex items-center justify-between gap-3 px-5 py-5 group"
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
              <p className="font-bold text-xs text-foreground group-hover:text-blue-600 transition line-clamp-1">
                {product.title}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                Gợi ý dành cho bạn: {product.description}
              </p>
            </div>
          </div>
          <span className="text-[8px] text-slate-400 font-bold border border-border rounded px-1.5 py-0.5 flex-shrink-0 whitespace-nowrap">
            GỢI Ý CHO BẠN
          </span>
        </a>
      </div>
    );
  }

  return (
    <tr className="bg-slate-50/10 hover:bg-slate-50 transition duration-200">
      <td className="p-0" colSpan={4}>
        <a
          href={`/redirect?url=${encodeURIComponent(`/go/${product.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer nofollow sponsored"
          className="flex items-center justify-between gap-3 px-6 py-4 group"
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
              <p className="font-bold text-sm text-foreground group-hover:text-blue-600 transition">
                {product.title}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Gợi ý dành cho bạn: {product.description}
              </p>
            </div>
          </div>
          <span className="text-[9px] text-slate-400 font-bold border border-border rounded px-1.5 py-0.5 flex-shrink-0 whitespace-nowrap">
            LIÊN KẾT TÀI TRỢ
          </span>
        </a>
      </td>
    </tr>
  );
}
