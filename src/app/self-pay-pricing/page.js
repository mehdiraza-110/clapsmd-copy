"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BadgeCheck, CreditCard, FileText, LogIn, Phone } from "lucide-react";
import {
  PATIENT_PORTAL_URL,
  paymentPolicyItems,
  selfPayRows,
} from "@/lib/billingContent";

export default function SelfPayPricingPage() {
  return (
    <>
      <Header />
      <main className="page-gradient-shell bg-slate-50">
        <section className="relative overflow-hidden border-b border-slate-100/80">
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-stretch">
              <div className="site-surface flex h-full flex-col rounded-[2.25rem] p-8 sm:p-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Self Pay Pricing
                </p>
                <h1 className="mt-4 text-4xl sm:text-5xl font-black text-secondary tracking-tight leading-tight">
                  Self-Pay Fee Schedule for Visits and Testing
                </h1>
                <p className="mt-6 text-lg text-gray-700 leading-8 max-w-3xl">
                  Our self-pay options are available for patients without insurance or those who
                  choose not to bill insurance. Placeholder pricing is shown below and can be
                  confirmed by our team before the visit.
                </p>
                <div className="mt-auto flex flex-wrap gap-4 pt-8">
                  <a
                    href="tel:9739490270"
                    className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 font-medium text-secondary hover:bg-white transition-colors"
                  >
                    <Phone className="mr-2 h-5 w-5 text-primary" />
                    Confirm Pricing by Phone
                  </a>
                  <a
                    href={PATIENT_PORTAL_URL}
                    className="btn-primary inline-flex items-center justify-center"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Go to Patient Portal
                  </a>
                </div>
              </div>

              <div className="site-dark-panel h-full rounded-3xl p-6 sm:p-8 text-white shadow-lg">
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
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-secondary">
                    <FileText className="w-5 h-5 text-primary" />
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                    Self-Pay Fee Schedule
                  </h2>
                </div>
                <p className="mt-4 text-gray-600 leading-8">
                  Rates are provided for transparency and should be confirmed with the office at
                  the time of scheduling or check-in.
                </p>
              </div>

              <div className="site-surface-muted rounded-2xl px-4 py-3 text-sm font-medium text-slate-600">
                Rates are subject to confirmation at the time of visit.
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 shadow-sm">
              <table className="min-w-full text-sm sm:text-base">
                <thead className="bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.96))]">
                  <tr>
                    <th className="px-5 py-4 text-left font-black text-secondary">Category</th>
                    <th className="px-5 py-4 text-left font-black text-secondary">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/95">
                  {selfPayRows.map(([label, amount]) => (
                    <tr key={label} className="transition-colors hover:bg-slate-50/80">
                      <td className="px-5 py-4 text-gray-700">{label}</td>
                      <td className="px-5 py-4 font-black text-secondary">{amount}</td>
                    </tr>
                  ))}
                  <tr className="transition-colors hover:bg-slate-50/80">
                    <td className="px-5 py-4 text-gray-700">Other Diagnostic Procedures</td>
                    <td className="px-5 py-4 font-semibold text-secondary">Please inquire</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
