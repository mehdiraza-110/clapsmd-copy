import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug } from "@/lib/blogPosts";
import { getSiteUrl } from "@/lib/siteUrl";
import { getAbsoluteUrl } from "@/lib/seoMetadata";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingButton from "@/components/BookingButton";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post not found | C.L.A.P.S. MD",
      description: "The requested blog post could not be found.",
    };
  }

  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/blog/${post.slug}`;
  const ogImage = getAbsoluteUrl(post.coverImage || "/images/clapsmd-logo-high-res.jpg");

  return {
    title: `${post.title} | C.L.A.P.S. MD`,
    description: post.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${post.title} | C.L.A.P.S. MD`,
      description: post.description,
      url: canonical,
      siteName: "C.L.A.P.S. MD",
      type: "article",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || post.publishedAt || undefined,
      images: [
        {
          url: ogImage,
          alt: post.title,
        },
      ],
    },
  };
}

export default function BlogPostPage({ params }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formatDate = (value) => {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        {/* Post Header */}
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
              {formatDate(post.publishedAt) && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  {formatDate(post.publishedAt)}
                </div>
              )}
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                {Math.ceil((post.content?.length || 0) * 0.5 + 1)} min read
              </div>
            </div>
          </header>

          {post.coverImage && (
            <div className="relative w-full h-[400px] mb-12 rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-slate-50">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-contain p-8"
                priority
              />
            </div>
          )}

          {post.description && (
            <div className="bg-primary/5 border-l-4 border-primary p-6 mb-12 rounded-r-lg">
              <p className="text-xl text-secondary font-medium leading-relaxed italic">
                {post.description}
              </p>
            </div>
          )}

          <div className="space-y-8 text-lg text-gray-700 leading-relaxed font-normal">
            {post.content?.length ? (
              <div className="blog-content">
                {post.content.map((block, index) => {
                  if (block.type === "list") {
                    return (
                      <ul
                        key={`list-${index}`}
                        className="list-disc pl-6 space-y-4 my-6"
                      >
                        {block.items.map((item, itemIndex) => (
                          <li
                            key={`list-${index}-${itemIndex}`}
                            className="text-gray-700"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  if (block.type === "image") {
                    return (
                      <figure key={`image-${index}`} className="my-12">
                        <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-md">
                          <Image
                            src={block.src}
                            alt={block.alt}
                            fill
                            className="object-contain bg-gray-50"
                          />
                        </div>
                        {block.alt && (
                          <figcaption className="text-center text-sm text-gray-500 mt-4 italic font-medium">
                            {block.alt}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  return (
                    <p key={`paragraph-${index}`} className="mb-6">
                      {block.text}
                    </p>
                  );
                })}
              </div>
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
