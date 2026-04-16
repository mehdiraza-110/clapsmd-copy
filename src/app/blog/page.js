import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogIndexSection from "@/components/BlogIndexSection";
import { buildPageMetadata } from "@/lib/seoMetadata";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getNewsletterTopics, NEWSLETTER_URL } from "@/lib/newsletterTopics";

export const metadata = buildPageMetadata({
  title: "Health Resources & Blog | C.L.A.P.S. MD",
  description:
    "Educational articles and updates on pediatric respiratory health from our specialists serving Wayne, NJ and Northern New Jersey.",
  path: "/blog",
  ogImage: "/images/hero-image.webp",
});

export const revalidate = 21600;

function formatNewsletterDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

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

        <section className="py-12 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogIndexSection />
          </div>
        </section>

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

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {newsletterTopics.map((topic) => (
                      <a
                        key={topic.title}
                        href={topic.href || NEWSLETTER_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex h-full min-h-[31rem] flex-col overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.08] shadow-[0_14px_36px_rgba(2,33,49,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-white/[0.12] hover:shadow-[0_18px_42px_rgba(2,33,49,0.28)]"
                      >
                        {topic.image ? (
                          <div className="relative h-52 w-full overflow-hidden bg-white/90">
                            <Image
                              src={topic.image}
                              alt={topic.title}
                              fill
                              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 48vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : null}

                        <div className="flex flex-1 flex-col p-6">
                          {topic.publishedAt || topic.readTime ? (
                            <p className="text-xs font-bold tracking-[0.08em] text-white/55">
                              {[formatNewsletterDate(topic.publishedAt), topic.readTime]
                                .filter(Boolean)
                                .join(" • ")}
                            </p>
                          ) : null}

                          <p className="mt-1 text-[11px] font-black uppercase tracking-[0.2em] text-primary/95">
                            {topic.eyebrow || "Breathing Room"}
                          </p>
                          <h3 className="mt-3 text-xl font-black leading-tight text-white sm:text-xl">
                            {topic.title}
                          </h3>
                          {topic.description ? (
                            <p className="mt-3 text-sm leading-relaxed text-slate-100/80 sm:text-[0.95rem]">
                              {topic.description}
                            </p>
                          ) : null}
                        </div>
                      </a>
                    ))}
                  </div>
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
