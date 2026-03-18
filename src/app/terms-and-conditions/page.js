"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { policySections } from "@/lib/policySections";

const termsSection = policySections.find((section) => section.title === "Terms & Conditions");

export default function TermsAndConditionsPage() {
  const Icon = termsSection.icon;

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
              Terms & Conditions
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-black text-secondary tracking-tight leading-tight">
              Terms & Conditions
            </h1>
            <p className="mt-6 text-lg text-gray-700 leading-8 max-w-4xl">
              By accessing or using the CLAPS MD and PFT Lab website, you agree to the terms and
              conditions that govern website use, informational content, and testing-related
              expectations.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <article className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-secondary">
                <Icon className="w-5 h-5 text-primary" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                {termsSection.title}
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-gray-700 leading-8">
              {termsSection.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
