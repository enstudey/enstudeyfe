import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getRelatedPosts } from "@/lib/markdown";
import { getCategoryFallbackImage } from "@/lib/images";
import TableOfContents from "@/components/TableOfContents";
import RelatedArticles from "@/components/RelatedArticles";
import AffiliateSidebarWidget from "@/components/affiliate/AffiliateSidebarWidget";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/affiliate-products.json";
import AdSenseSlot from "@/components/ads/AdSenseSlot";
import ArticleAdTrigger from "@/components/ads/ArticleAdTrigger";

function insertInArticleAd(htmlContent: string): string {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-XXXXXXXXXXXXXX";
  const slotId = "in-article-slot-id";

  const adBlockHtml = `
    <div class="ad-container ad-in-article my-8 w-full min-h-[90px] sm:min-h-[250px] bg-slate-50/50 dark:bg-zinc-900/30 border border-dashed border-slate-200/50 dark:border-zinc-800/40 rounded-2xl flex items-center justify-center relative" contenteditable="false">
      <span class="absolute top-2 right-2 text-[8px] uppercase tracking-wider text-slate-400 font-semibold select-none z-0">Liên kết tài trợ</span>
      <ins class="adsbygoogle w-full h-full z-10"
           style="display:block"
           data-ad-client="${pubId}"
           data-ad-slot="${slotId}"
           data-ad-format="fluid"
           data-ad-layout-key="-gw-3+1f-3d+2z"></ins>
    </div>
  `;

  const paragraphCount = (htmlContent.match(/<\/p>/g) ?? []).length;
  if (paragraphCount >= 3) {
    let count = 0;
    return htmlContent.replace(/<\/p>/g, (match) => {
      count++;
      return count === 3 ? match + adBlockHtml : match;
    });
  } else if (htmlContent.includes("</h2>")) {
    return htmlContent.replace("</h2>", "</h2>" + adBlockHtml);
  }
  return htmlContent;
}

function insertAffiliateTextLink(htmlContent: string): string {
  let affiliateProduct: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    affiliateProduct = products.find(p => p.category === "study") ?? null;
  } catch (error) {
    console.error("Error loading affiliate text link product:", error);
    return htmlContent;
  }

  if (!affiliateProduct) return htmlContent;

  const affiliateHtml = `
    <div class="affiliate-text-block my-6 p-4 bg-slate-100 border border-slate-200/50 rounded-xl" contenteditable="false">
      <span class="text-[10px] uppercase tracking-wider text-indigo-600 font-bold block mb-1">Gợi ý dành cho bạn</span>
      <p class="text-sm text-slate-700 m-0 leading-relaxed">
        Bạn có thể tham khảo thêm tài liệu trong cuốn 
        <a href="/redirect?url=${encodeURIComponent(`/go/${affiliateProduct.slug}`)}" target="_blank" rel="noopener noreferrer nofollow sponsored" class="text-indigo-600 hover:underline font-bold">${affiliateProduct.title}</a> 
        để học tập và định hướng nghề nghiệp tốt hơn.
      </p>
    </div>
  `;

  const paragraphCount = (htmlContent.match(/<\/p>/g) ?? []).length;
  if (paragraphCount >= 6) {
    let count = 0;
    return htmlContent.replace(/<\/p>/g, (match) => {
      count++;
      return count === 5 ? match + affiliateHtml : match;
    });
  }
  return htmlContent;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = getAllPosts(true);
  const post = posts.find(p => p.slug === slug && p.category === "nganh-hoc");

  if (!post) {
    return {
      title: "Ngành học không tồn tại - EnStudey",
      description: "Xem review các ngành học Đại học chi tiết.",
    };
  }

  return {
    title: `${post.title} - EnStudey Hướng nghiệp`,
    description: post.description,
  };
}

export default async function NganhHocDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getAllPosts(true);
  const post = posts.find(p => p.slug === slug && p.category === "nganh-hoc");

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto py-12 w-full flex-grow space-y-6 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
          Ngành học không tồn tại rồi bạn ơi 🥺
        </h1>
        <p className="text-slate-500">Hình như bài viết review ngành học bạn yêu cầu hiện không có trên hệ thống.</p>
        <Link href="/nganh-hoc" className="text-sm text-indigo-600 hover:underline font-semibold">
          &larr; Quay lại danh sách ngành học
        </Link>
      </main>
    );
  }

  const relatedPosts = getRelatedPosts(slug, "nganh-hoc", 4);

  // Sinh Schema FAQPage
  const faqSchema = post.faq && post.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="py-12 flex-grow w-full space-y-6">
        <div>
          <Link href="/nganh-hoc" className="text-sm text-indigo-600 hover:underline inline-flex items-center gap-1 font-semibold">
            &larr; Quay lại danh sách ngành học
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          <article className="lg:col-span-7 prose leading-relaxed text-slate-700">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              #NGANH-HOC
            </span>
            <h1 className="text-3xl font-extrabold mt-2 mb-4 text-slate-900 leading-tight">
              {post.title}
            </h1>
            <p className="text-xs text-slate-600 mb-6">{post.date}</p>

            <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden mb-6">
              <Image
                src={post.image || getCategoryFallbackImage(post.category)}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>

            <TableOfContents contentHtml={post.contentHtml ?? ""} />

            {/* Under-title Ad: Dưới tiêu đề bài viết */}
            <AdSenseSlot slotId="under-title-slot-id" minHeight="250px" className="mb-6" />

            <div
              className="text-base text-slate-700 space-y-4 article-content"
              dangerouslySetInnerHTML={{ __html: insertAffiliateTextLink(insertInArticleAd(post.contentHtml ?? "")) }}
            />
            <ArticleAdTrigger triggerKey={post.slug} />


            {/* End-of-article Ad Slot */}
            {/* End-of-article Ad: Cuối bài viết */}
            <AdSenseSlot slotId="end-article-slot-id" minHeight="250px" className="mt-8" />

            <RelatedArticles posts={relatedPosts} />
          </article>

          {/* Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <AffiliateSidebarWidget seed={post.slug} />
              {/* Khung quảng cáo dọc */}
              <AdSenseSlot slotId="sidebar-vertical-slot-id" format="vertical" minHeight="600px" />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
