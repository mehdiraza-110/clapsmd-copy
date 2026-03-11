import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blogPosts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "Health Resources & Blog | C.L.A.P.S. MD",
  description:
    "Educational articles and updates on pediatric respiratory health from our specialists serving Wayne, NJ and Northern New Jersey.",
  path: "/blog",
  ogImage: "/images/hero-image.webp",
});

export default function BlogIndexPage() {
  const formatDate = (value) => {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getExcerpt = (post) => {
    if (post.description) {
      return post.description;
    }
    const firstParagraph = post.content?.find((block) => block.type === "paragraph");
    return firstParagraph?.text || null;
  };

  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        {/* Modern Branding Bar */}
        <div className="bg-secondary py-8 shadow-xl border-b-4 border-primary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex flex-col border-l-4 border-primary pl-6">
                <h2 className="text-white font-black tracking-tight text-xl md:text-3xl leading-tight max-w-xl">
                  Children's Lung Asthma <br className="hidden lg:block" /> & Pulmonary Specialists
                </h2>
              </div>
              
              <div className="flex flex-col items-start md:items-end">
                <p className="text-primary font-black tracking-tight text-4xl md:text-6xl leading-none">
                  CLAPS MD
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Hero */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-primary-darker mb-8 uppercase tracking-tight">
              Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Expert advice, educational guides, and the latest updates from our pediatric pulmonology specialists.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {blogPosts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
                <p className="text-gray-500 text-lg">No resources available at the moment. Please check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {blogPosts.map((post) => (
                  <article 
                    key={post.slug} 
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {post.coverImage && (
                      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center text-primary-darker/50 text-xs font-black uppercase tracking-widest mb-6">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(post.publishedAt) || "Recently Published"}
                      </div>
                      
                      <h2 className="text-2xl font-black text-secondary mb-4 leading-tight group-hover:text-primary transition-colors">
                        <Link href={`/blog/${post.slug.toLowerCase()}`}>
                          {post.title}
                        </Link>
                      </h2>
                      
                      {getExcerpt(post) ? (
                        <p className="text-gray-600 mb-8 flex-grow leading-relaxed font-medium line-clamp-3">
                          {getExcerpt(post)}
                        </p>
                      ) : null}
                      
                      <Link
                        href={`/blog/${post.slug.toLowerCase()}`}
                        className="inline-flex items-center text-primary font-black hover:gap-3 transition-all group/link mt-auto text-lg"
                      >
                        Read Full Article 
                        <ArrowRight className="ml-2 w-5 h-5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
