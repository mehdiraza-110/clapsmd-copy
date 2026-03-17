"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, FileText, ShieldCheck, ArrowRight } from "lucide-react";
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
      <main className="bg-slate-50">
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr,0.85fr] gap-8 items-start">
              <div>
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
                    Go to Patient Portal
                  </a>
                  <a
                    href="tel:9739490270"
                    className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 font-medium text-secondary hover:bg-white transition-colors"
                  >
                    Billing Questions: (973) 949-0270
                  </a>
                </div>
              </div>

              <div className="rounded-3xl bg-secondary p-6 sm:p-8 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-black tracking-tight">Payment Policy</h2>
                </div>
                <ul className="mt-5 space-y-3 text-white/85 leading-7">
                  {paymentPolicyItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="rounded-[2rem] bg-white border border-slate-100 p-6 sm:p-8 lg:p-10 shadow-sm">
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
                  className="rounded-3xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 px-5 py-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all"
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
                        <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
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
            <div className="rounded-[2rem] bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
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
                View policies
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-[2rem] bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
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
                View self-pay pricing
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
            <div className="max-w-4xl">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Insurance Education
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                Understanding Copays, Deductibles, Coinsurance, and Out-of-Pocket Costs
              </h2>
              <p className="mt-4 text-gray-600 leading-8">
                These terms affect what you may owe before, during, and after a visit. If you are
                unsure about benefits, our team can help you understand the basics, but final
                benefit details come from your insurance carrier.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {insuranceTerms.map((term) => {
                const Icon = term.icon;
                return (
                  <div
                    key={term.title}
                    className="rounded-3xl border border-slate-100 bg-slate-50 p-6 sm:p-7"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-secondary">
                        <Icon className="w-5 h-5" />
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
        </section>
      </main>
      <Footer />
    </>
  );
}
