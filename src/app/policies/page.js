"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { policySections } from "@/lib/policySections";

const visiblePolicySections = policySections.filter(
  (section) =>
    section.title !== "Privacy Policy" &&
    section.title !== "Terms & Conditions" &&
    section.title !== "Website Disclaimer"
);

export default function PoliciesPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr,0.85fr] gap-8 items-start">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Legal & Compliance
                </p>
                <h1 className="mt-4 text-4xl sm:text-5xl font-black text-secondary tracking-tight leading-tight">
                  Policies, Privacy, and Patient Information Practices
                </h1>
                <p className="mt-6 text-lg text-gray-700 leading-8 max-w-3xl">
                  CLAPS MD and the Pulmonary Function Testing Lab are committed to maintaining
                  high standards of patient privacy, regulatory compliance, and ethical medical
                  practice. This page outlines our policies regarding accessibility, HIPAA,
                  pricing, data use, and website usage.
                </p>
              </div>

              <div className="rounded-3xl bg-secondary p-6 sm:p-8 text-white shadow-lg">
                <h2 className="text-2xl font-black tracking-tight">Need Help Accessing Information?</h2>
                <p className="mt-4 text-white/85 leading-8">
                  If you need policy information in another format or have questions about privacy,
                  referrals, or billing, our office can help.
                </p>
                <div className="mt-6 space-y-3 text-white/90">
                  <p>
                    <span className="font-black text-primary">Phone:</span> (973) 949-0270
                  </p>
                  <p>
                    <span className="font-black text-primary">Email:</span> info@clapsmd.org
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visiblePolicySections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.title}
                  className="rounded-[2rem] border border-slate-100 bg-white p-6 sm:p-8 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-secondary">
                      <Icon className="w-5 h-5 text-primary" />
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                      {section.title}
                    </h2>
                  </div>

                  <div className="mt-5 space-y-4 text-gray-700 leading-8">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="font-black text-secondary">{section.bulletLabel}</p>
                      <ul className="mt-3 space-y-2 text-gray-700">
                        {section.bullets.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.secondaryBullets && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="font-black text-secondary">{section.secondaryBulletLabel}</p>
                      <ul className="mt-3 space-y-2 text-gray-700">
                        {section.secondaryBullets.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
