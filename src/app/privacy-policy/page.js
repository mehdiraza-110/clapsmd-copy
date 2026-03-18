"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { policySections } from "@/lib/policySections";

const privacySection = policySections.find((section) => section.title === "Privacy Policy");

export default function PrivacyPolicyPage() {
  const Icon = privacySection.icon;

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
              Privacy Policy
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl font-black text-secondary tracking-tight leading-tight">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg text-gray-700 leading-8 max-w-4xl">
              CLAPS MD and the PFT Lab respect your privacy and are committed to protecting your
              personal and medical information when you use our website or receive services at our
              facility.
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
                {privacySection.title}
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-gray-700 leading-8">
              {privacySection.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-black text-secondary">{privacySection.bulletLabel}</p>
              <ul className="mt-3 space-y-2 text-gray-700">
                {privacySection.bullets.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
