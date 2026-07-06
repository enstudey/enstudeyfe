import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdBanner from "@/components/ads/AdBanner";
import { getPostBySlug, getAllPosts } from "@/lib/markdown";

interface BlogPostPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.category, resolvedParams.slug);
  if (!post) {
    return {
      title: "Bài viết không tồn tại - EnStudey",
    };
  }

  return {
    title: `${post.title} - Blog EnStudey`,
    description: post.description,
    robots: post.isDraft ? { index: false, follow: false } : undefined,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostDetail({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.category, resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Schema Markup JSON-LD (Article & FAQ)
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "EnStudey",
      "url": "https://enstudey.com",
    },
  };

  if (post.faq && post.faq.length > 0) {
    jsonLd.mainEntity = post.faq.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    }));
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "skills":
        return "Kỹ năng học thuật";
      case "toeic":
        return "Mẹo thi TOEIC";
      case "ielts":
        return "Tư liệu IELTS";
      case "grammar":
        return "Ngữ pháp & Bổ trợ";
      default:
        return category;
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-3xl mx-auto py-12 px-4 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 min-h-screen">
        <div className="mb-6">
          <Link
            href="/blog"
            className="text-sm text-orange-600 dark:text-orange-500 hover:underline inline-flex items-center gap-1 font-medium"
          >
            &larr; Quay lại Blog
          </Link>
        </div>

        <article className="prose dark:prose-invert leading-relaxed text-slate-750 dark:text-zinc-300">
          <span className="text-xs font-semibold text-orange-600 dark:text-orange-500 uppercase tracking-wider">
            {getCategoryLabel(post.category)}
          </span>
          <h1 className="text-3xl font-extrabold mt-2 mb-6 text-slate-950 dark:text-white leading-tight">
            {post.title}
          </h1>
          <div
            className="text-base text-slate-700 dark:text-zinc-300 space-y-4 md-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        {post.faq && post.faq.length > 0 && (
          <section className="mt-12 border-t border-slate-150 dark:border-zinc-800 pt-8">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-4">Câu hỏi thường gặp</h2>
            <div className="space-y-4">
              {post.faq.map((item, index) => (
                <div key={index} className="bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.question}</h3>
                  <p className="mt-2 text-slate-650 dark:text-zinc-400 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 min-h-[250px] w-full bg-slate-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center">
          <AdBanner />
        </div>
      </main>
    </>
  );
}
