import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/markdown";

// Helper chèn quảng cáo vào giữa nội dung bài viết (chống CLS)
function insertInArticleAd(htmlContent: string): string {
  const adBlockHtml = `
    <div class="ad-container ad-in-article my-8 w-full min-h-[90px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl" contenteditable="false">
      <span class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold block text-center py-6 w-full">Quảng cáo</span>
    </div>
  `;
  
  if (htmlContent.includes("</h2>")) {
    return htmlContent.replace("</h2>", "</h2>" + adBlockHtml);
  } else {
    let count = 0;
    return htmlContent.replace(/<\/p>/g, (match) => {
      count++;
      if (count === 3) {
        return match + adBlockHtml;
      }
      return match;
    });
  }
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

          {/* Under-title Ad: Dưới tiêu đề bài viết */}
          <div className="ad-container ad-under-title w-full min-h-[90px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl mb-6">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
          </div>

          <div 
            className="text-base text-slate-700 dark:text-zinc-300 space-y-4 article-content"
            dangerouslySetInnerHTML={{ __html: insertInArticleAd(post.contentHtml) }}
          />
        </article>

        {/* End-of-article Ad: Cuối bài viết */}
        <div className="ad-container ad-end w-full min-h-[90px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl mt-8">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 select-none font-semibold">Quảng cáo</span>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
