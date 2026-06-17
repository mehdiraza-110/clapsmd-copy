"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const PAGE_SIZE = 6;

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

export default function NewsletterGrid({ topics, newsletterUrl }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = topics.slice(0, visibleCount);
  const hasMore = visibleCount < topics.length;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((topic) => (
          <a
            key={topic.title}
            href={topic.href || newsletterUrl}
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

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-8 py-3.5 text-sm font-black uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-white/[0.14] hover:text-primary"
          >
            Load More
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}
