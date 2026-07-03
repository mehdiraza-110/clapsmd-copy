import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import BlogIndexSection from "@/components/BlogIndexSection";
import { buildPageMetadata } from "@/lib/seoMetadata";
import { ArrowRight } from "lucide-react";
import { getNewsletterTopics, NEWSLETTER_URL } from "@/lib/newsletterTopics";
import NewsletterGrid from "@/components/NewsletterGrid";

export const metadata = buildPageMetadata({
  title: "Health Resources & Blog | C.L.A.P.S. MD",
  description:
    "Educational articles and updates on pediatric respiratory health from our specialists serving Wayne, NJ and Northern New Jersey.",
  path: "/blog",
  ogImage: "/images/hero-image.webp",
});
    
export const revalidate = 21600;

export default async function BlogIndexPage() {
  const newsletterTopics = await getNewsletterTopics();

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
                Breathing Room : The CLAPS Family Health Guide
              </p>
              {/* <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-primary-darker uppercase tracking-tight">
                Blog
              </h1> */}
              <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                Insights from Dr. Farri, "The Breathing Dr." to help keep your child active, healthy, and breathing easy.
              </p>
            </div>
          </div>
        </section>

        {/* <section className="py-12 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogIndexSection />
          </div>
        </section> */}

        <section className="pb-8 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="site-dark-panel relative overflow-hidden rounded-[2.25rem] px-8 py-10 sm:px-10 sm:py-12">
              <div className="absolute -right-16 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-primary/90">
                    Stay Connected
                  </p>
                  <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                    Subscribe to our newsletter
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-100/90 sm:text-lg">
                    Get pediatric pulmonology tips, family-focused health guidance, and new blog updates delivered straight to your inbox.
                  </p>
                </div>

                <div className="relative">
                  <a
                    href={NEWSLETTER_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-black uppercase tracking-[0.16em] text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a7e13f] hover:shadow-[0_18px_36px_rgba(148,209,44,0.28)]"
                  >
                    Subscribe Now
                  </a>
                </div>
              </div>

              {newsletterTopics.length ? (
                <div className="relative mt-10 border-t border-white/10 pt-8">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-white/70">
                      From Breathing Room
                    </p>
                    <a
                      href={NEWSLETTER_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-sm font-black uppercase tracking-[0.16em] text-primary transition-colors hover:text-[#a7e13f]"
                    >
                      View Newsletter
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </div>

                  <NewsletterGrid topics={newsletterTopics} newsletterUrl={NEWSLETTER_URL} />
                </div>
              ) : null}
            </div>
          </div>
        </section>
        
      </main>
      <Footer />
    </>
  );
}
