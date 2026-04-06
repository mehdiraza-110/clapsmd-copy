import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogIndexSection from "@/components/BlogIndexSection";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "Health Resources & Blog | C.L.A.P.S. MD",
  description:
    "Educational articles and updates on pediatric respiratory health from our specialists serving Wayne, NJ and Northern New Jersey.",
  path: "/blog",
  ogImage: "/images/hero-image.webp",
});

export default function BlogIndexPage() {
  return (
    <>
      <Header />
      <main className="page-gradient-shell flex-grow overflow-hidden">
        <section className="relative overflow-hidden border-b border-slate-100/80 py-16 sm:py-20">
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="site-surface mx-auto max-w-4xl rounded-[2.25rem] p-8 sm:p-10 lg:p-12">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Health Resources
              </p>
              <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-primary-darker uppercase tracking-tight">
                Blog
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                Expert advice, educational guides, and the latest updates from our pediatric pulmonology specialists.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogIndexSection />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
