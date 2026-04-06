"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  FileText,
  LogIn,
  Phone,
  ShieldCheck,
} from "lucide-react";
import {
  PATIENT_PORTAL_URL,
  insuranceCarriers,
  insuranceTerms,
  paymentPolicyItems,
} from "@/lib/billingContent";

export default function InsuranceBillingPage() {
  return (
    <>
      <Header />
      <main className="page-gradient-shell bg-slate-50">
        <section className="relative overflow-hidden border-b border-slate-100/80">
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr,0.85fr] gap-8 items-start">
              <div className="site-surface rounded-[2.25rem] p-8 sm:p-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Insurance & Billing
                </p>
                <h1 className="mt-4 text-4xl sm:text-5xl font-black text-secondary tracking-tight leading-tight">
                  Insurance Coverage and Billing Basics for Families
                </h1>
                <p className="mt-6 text-lg text-gray-700 leading-8 max-w-3xl">
                  We want every family to understand insurance participation and financial
                  responsibility before the visit. This page outlines accepted carriers, billing
                  basics, and common insurance terms in one easy place.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={PATIENT_PORTAL_URL}
                    className="btn-primary inline-flex items-center justify-center"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Go to Patient Portal
                  </a>
                  <a
                    href="tel:9739490270"
                    className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 font-medium text-secondary hover:bg-white transition-colors"
                  >
                    <Phone className="mr-2 h-5 w-5 text-primary" />
                    Billing Questions: (973) 949-0270
                  </a>
                </div>
              </div>

              <div className="site-dark-panel rounded-3xl p-6 sm:p-8 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-black tracking-tight">Payment Policy</h2>
                </div>
                <ul className="mt-5 space-y-3 text-white/85 leading-7">
                  {paymentPolicyItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <BadgeCheck className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="site-surface rounded-[2rem] p-6 sm:p-8 lg:p-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-secondary">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                  Accepted Insurance Carriers
                </h2>
              </div>
              <p className="mt-4 text-gray-600 leading-8">
                Coverage varies by plan and product. Please verify your benefits directly with
                your insurance carrier before the visit.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {insuranceCarriers.map((carrier) => (
                <div
                  key={carrier.name}
                  className="site-surface-muted rounded-3xl px-5 py-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col items-center text-center min-h-[180px]">
                    {carrier.logo ? (
                      <div className="relative h-16 w-full max-w-[168px] overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <Image
                          src={carrier.logo}
                          alt={carrier.logoAlt || `${carrier.name} logo`}
                          fill
                          className="object-contain p-3"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-full max-w-[168px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4">
                        <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          Insurance
                        </span>
                      </div>
                    )}

                    <span className="mt-4 text-lg font-black leading-snug text-secondary">
                      {carrier.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-18">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="site-surface rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-secondary">
                  <FileText className="w-5 h-5 text-primary" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                  Office Policies
                </h2>
              </div>
              <p className="mt-4 text-gray-600 leading-8">
                Review payment expectations, transparency notes, and how our team helps families
                understand billing responsibilities before their visit.
              </p>
              <Link
                href="/policies"
                className="mt-6 inline-flex items-center gap-2 font-black text-secondary hover:text-primary transition-colors"
              >
                <FileText className="h-4 w-4" />
                View policies
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="site-surface rounded-[2rem] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-secondary">
                  <CreditCard className="w-5 h-5 text-primary" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                  Self Pay Pricing
                </h2>
              </div>
              <p className="mt-4 text-gray-600 leading-8">
                See the current self-pay fee schedule for office visits, telemedicine, and
                respiratory testing in a separate pricing page.
              </p>
              <Link
                href="/self-pay-pricing"
                className="mt-6 inline-flex items-center gap-2 font-black text-secondary hover:text-primary transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                View self-pay pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-100/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
            <div className="grid gap-8 lg:grid-cols-[0.36fr,0.64fr] lg:items-start">
              <div className="site-dark-panel rounded-[2rem] p-8 text-white">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Insurance Education
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
                  Understanding Copays, Deductibles, Coinsurance, and Out-of-Pocket Costs
                </h2>
                <p className="mt-4 text-white/80 leading-8">
                  These terms affect what you may owe before, during, and after a visit. If you are
                  unsure about benefits, our team can help you understand the basics, but final
                  benefit details come from your insurance carrier.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {insuranceTerms.map((term) => {
                  const Icon = term.icon;
                  return (
                    <div
                      key={term.title}
                      className="site-surface-muted rounded-3xl p-6 sm:p-7"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-secondary shadow-sm">
                          <Icon className="w-5 h-5 text-primary" />
                        </span>
                        <h3 className="text-xl font-black text-secondary tracking-tight">
                          {term.title}
                        </h3>
                      </div>
                      <p className="mt-4 text-gray-700 leading-7">{term.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
