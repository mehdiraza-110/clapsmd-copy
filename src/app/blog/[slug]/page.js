import { notFound } from "next/navigation";
import { cache } from "react";
import { getAbsoluteUrl } from "@/lib/seoMetadata";
import { getSiteUrl } from "@/lib/siteUrl";
import { getBlogById, getBlogs } from "@/lib/authClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingButton from "@/components/BookingButton";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export const revalidate = 300;

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function estimateReadMinutes(html) {
  const plainText = String(html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!plainText) return 1;
  return Math.max(1, Math.ceil(plainText.split(" ").length / 200));
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripDuplicateLeadingTitle(html, title) {
  if (!html || !title) return html;

  const normalizedTitle = escapeRegExp(String(title).trim());
  if (!normalizedTitle) return html;

  const leadingTitlePattern = new RegExp(
    `^\\s*<h[1-6][^>]*>\\s*${normalizedTitle}\\s*<\\/h[1-6]>\\s*`,
    "i",
  );

  return String(html).replace(leadingTitlePattern, "");
}

const getPublishedBlogBySlug = cache(async (slug) => {
  const response = await getBlogs(undefined, { cache: "no-store" });
  const blogs = Array.isArray(response?.blogs) ? response.blogs : [];
  const matchedBlog = blogs.find((blog) => {
    return (
      (blog?.status || "").toLowerCase() === "published" &&
      String(blog?.slug || "").toLowerCase() === String(slug || "").toLowerCase()
    );
  });

  if (!matchedBlog) {
    return null;
  }

  try {
    const detailResponse = await getBlogById(undefined, matchedBlog.id, { cache: "no-store" });
    const detailedBlog = detailResponse?.blog;

    if (!detailedBlog) {
      return matchedBlog;
    }

    if (
      (detailedBlog?.status || "").toLowerCase() !== "published" ||
      String(detailedBlog?.slug || "").toLowerCase() !== String(slug || "").toLowerCase()
    ) {
      return null;
    }

    return detailedBlog;
  } catch (_error) {
    return matchedBlog;
  }
});

export async function generateMetadata({ params }) {
  const post = await getPublishedBlogBySlug(params.slug);

  if (!post) {
    return {
      title: "Post not found | C.L.A.P.S. MD",
      description: "The requested blog post could not be found.",
    };
  }

  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/blog/${post.slug}`;
  const ogImage = getAbsoluteUrl(post.featured_image || "/images/clapsmd-logo-high-res.jpg");
  const description =
    post.meta_description || "Educational article from the CLAPS MD pediatric pulmonology team.";

  return {
    title: `${post.title} | C.L.A.P.S. MD`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${post.title} | C.L.A.P.S. MD`,
      description,
      url: canonical,
      siteName: "C.L.A.P.S. MD",
      type: "article",
      publishedTime: post.publish_time || undefined,
      modifiedTime: post.updated_at || post.publish_time || undefined,
      images: [
        {
          url: ogImage,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPublishedBlogBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const renderedContent = stripDuplicateLeadingTitle(post.content, post.title);

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary hover:text-primary-dark mb-8 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-secondary leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-500 font-medium">
              {formatDate(post.publish_time || post.created_at) ? (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  {formatDate(post.publish_time || post.created_at)}
                </div>
              ) : null}
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                {estimateReadMinutes(post.content)} min read
              </div>
            </div>
          </header>

          {post.featured_image ? (
            <div className="relative w-full h-[400px] mb-12 rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-slate-50">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-contain p-8"
                priority
              />
            </div>
          ) : null}

          {/* {post.meta_description ? (
            <div className="bg-primary/5 border-l-4 border-primary p-6 mb-12 rounded-r-lg">
              <p className="text-xl text-secondary font-medium leading-relaxed italic">
                {post.meta_description}
              </p>
            </div>
          ) : null} */}

          <div className="blog-content text-lg text-gray-700 leading-relaxed font-normal">
            {renderedContent ? (
              <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
            ) : (
              <p className="text-gray-600">Content coming soon.</p>
            )}
          </div>

          <footer className="mt-16 pt-8 border-t border-gray-100">
            <div className="bg-secondary rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Need a Specialist?</h2>
              <p className="text-white/80 mb-6 max-w-2xl">
                Children's Lung Asthma & Pulmonary Specialists are here to help
                your child breathe easier. Schedule an evaluation today.
              </p>
              <BookingButton className="btn-primary" />
            </div>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}
