import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, getRelatedPosts } from "@/lib/markdown";
import { getCategoryFallbackImage } from "@/lib/images";
import TableOfContents from "@/components/TableOfContents";
import RelatedArticles from "@/components/RelatedArticles";

// Helper chèn quảng cáo vào giữa nội dung bài viết (chống CLS)
function insertInArticleAd(htmlContent: string): string {
  const adBlockHtml = `
    <div class="ad-container ad-in-article my-8 w-full min-h-[90px] sm:min-h-[250px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl" contenteditable="false">
      <span class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold block text-center py-6 w-full">Quảng cáo</span>
    </div>
  `;

  // Đếm số <p> để quyết định có đủ ngưỡng 3 đoạn không
  const paragraphCount = (htmlContent.match(/<\/p>/g) ?? []).length;

  if (paragraphCount >= 3) {
    // Tạo regex mới mỗi lần gọi (tránh bug lastIndex của global regex)
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

// Thiết lập Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === slug);

  return {
    title: post ? `${post.title} - Tin tức EnStudy` : "Bài viết không tồn tại - EnStudy",
    description: post ? post.description : "Đọc các bài viết chuyên sâu về luyện thi tiếng Anh.",
  };
}

export default async function BlogPostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
        <Header />

        <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-6 text-center">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white leading-tight">
            Bài viết không tồn tại rồi bạn ơi 🥺
          </h1>
          <p className="text-slate-500">Hình như bài viết bạn yêu cầu hiện không có trên hệ thống hoặc đã được di chuyển đi nơi khác.</p>
          <Link href="/tin-tuc" className="text-sm text-orange-600 dark:text-orange-500 hover:underline font-semibold">
            &larr; Quay lại danh sách tin tức
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(slug, post.category, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-6">
        <div>
          <Link href="/tin-tuc" className="text-sm text-orange-600 dark:text-orange-500 hover:underline inline-flex items-center gap-1 font-semibold">
            &larr; Quay lại danh sách tin tức
          </Link>
        </div>

        <article className="prose dark:prose-invert leading-relaxed text-slate-750 dark:text-zinc-300">
          <span className="text-xs font-bold text-orange-600 dark:text-orange-500 uppercase tracking-wider">
            #{post.category.toUpperCase()}
          </span>
          <h1 className="text-3xl font-extrabold mt-2 mb-4 text-slate-950 dark:text-white leading-tight">
            {post.title}
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mb-6">{post.date}</p>

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

          {/* Table of Contents */}
          <TableOfContents contentHtml={post.contentHtml} />

          {/* Under-title Ad: Dưới tiêu đề bài viết */}
          <div className="ad-container ad-under-title w-full min-h-[90px] sm:min-h-[250px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl mb-6">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
          </div>

          <div 
            className="text-base text-slate-700 dark:text-zinc-300 space-y-4 article-content"
            dangerouslySetInnerHTML={{ __html: insertInArticleAd(post.contentHtml) }}
          />
        </article>

        {/* End-of-article Ad: Cuối bài viết */}
        <div className="ad-container ad-end w-full min-h-[90px] sm:min-h-[250px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl mt-8">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
        </div>

        {/* Bài viết liên quan */}
        <RelatedArticles posts={relatedPosts} />

        {/* CTA Mini-Test */}
        <div className="mt-8 p-6 bg-orange-50 dark:bg-zinc-900/40 border border-orange-200 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-950 dark:text-white">Thực hành ngay với Mini-Test hôm nay</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Rèn luyện lý thuyết vừa đọc để nhớ lâu hơn nhé.</p>
          </div>
          <Link 
            href="/tinh-diem" 
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition duration-200 whitespace-nowrap"
          >
            Làm Test liền &rarr;
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
