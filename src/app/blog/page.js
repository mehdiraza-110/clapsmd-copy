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
            <BlogIndexSection />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
