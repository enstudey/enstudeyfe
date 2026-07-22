import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import AdBanner from "@/components/ads/AdBanner";
import { getPostBySlug, getAllPostsMetadata } from "@/lib/markdown";
import CheatSheetInteractiveWrapper from "@/components/materials/CheatSheetInteractiveWrapper";
import AffiliateProductBox from "@/components/materials/AffiliateProductBox";

interface BlogPostPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPostsMetadata();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.category, resolvedParams.slug);
  if (!post) {
    notFound();
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

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": "https://enstudey.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://enstudey.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://enstudey.com/blog/${resolvedParams.category}/${resolvedParams.slug}`
      }
    ]
  };

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

  // Load glossary JSON on server side to prevent client fetch lag
  let glossary: Record<string, string> = {};
  try {
    const glossaryPath = path.join(process.cwd(), "public", "data", "glossary", `${resolvedParams.slug}.json`);
    if (fs.existsSync(glossaryPath)) {
      const fileContent = fs.readFileSync(glossaryPath, "utf8");
      glossary = JSON.parse(fileContent);
    }
  } catch {
    // Ignore and fallback
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="max-w-3xl mx-auto py-12 px-4 bg-white text-slate-900 min-h-screen">
        <div className="mb-6">
          <Link
            href="/blog"
            className="text-sm text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium"
          >
            &larr; Quay lại Blog
          </Link>
        </div>

        <article className="prose leading-relaxed text-slate-700">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            {getCategoryLabel(post.category)}
          </span>
          <h1 className="text-3xl font-extrabold mt-2 mb-6 text-slate-955 leading-tight">
            {post.title}
          </h1>
          {post.contentType === "cheat-sheet" ? (
            <CheatSheetInteractiveWrapper topic={resolvedParams.slug} initialGlossary={glossary}>
              <div
                className="text-base text-slate-700 space-y-4 md-content"
                dangerouslySetInnerHTML={{ __html: post.contentHtml ?? "" }}
              />
            </CheatSheetInteractiveWrapper>
          ) : (
            <div
              className="text-base text-slate-700 space-y-4 md-content"
              dangerouslySetInnerHTML={{ __html: post.contentHtml ?? "" }}
            />
          )}
        </article>

        {post.affiliateProducts && post.affiliateProducts.length > 0 && (
          <AffiliateProductBox products={post.affiliateProducts} />
        )}

        {post.faq && post.faq.length > 0 && (
          <section className="mt-12 border-t border-slate-150 pt-8">
            <h2 className="text-xl font-bold text-slate-950 mb-4">Câu hỏi thường gặp</h2>
            <div className="space-y-4">
              {post.faq.map((item, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-slate-900">{item.question}</h3>
                  <p className="mt-2 text-slate-650 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 min-h-[250px] w-full bg-slate-50 rounded-2xl flex items-center justify-center">
          <AdBanner />
        </div>
      </main>
    </>
  );
}
