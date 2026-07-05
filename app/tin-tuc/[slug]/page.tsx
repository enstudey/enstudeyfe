import { Metadata } from "next";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/markdown";

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
        <header className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
          <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-2xl text-slate-950 dark:text-white tracking-tight">
              EnStudy
            </Link>
            <ThemeToggle />
          </nav>
        </header>

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
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-2xl text-slate-950 dark:text-white tracking-tight">
              EnStudy
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/tin-tuc" className="text-xs font-bold text-slate-950 dark:text-white border-b-2 border-orange-500 pb-1 uppercase tracking-wider">
                Tin tức học thuật
              </Link>
              <Link href="/tinh-diem" className="text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors uppercase tracking-wider">
                Công cụ tính điểm
              </Link>
              <Link href="/tra-cuu-truong-dai-hoc" className="text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-white transition-colors uppercase tracking-wider">
                Tra cứu trường đại học
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </nav>
      </header>

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
          <div 
            className="text-base text-slate-700 dark:text-zinc-300 space-y-4 article-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        {/* In-content Anti-CLS Ad Container */}
        <div className="ad-container ad-v-block w-full min-h-[90px] bg-slate-100/50 dark:bg-zinc-900/50 border border-dashed border-slate-200 dark:border-zinc-800 flex items-center justify-center rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Quảng cáo AdSense</span>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
