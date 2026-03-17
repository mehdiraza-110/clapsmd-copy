"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreditCard, FileText } from "lucide-react";
import {
  PATIENT_PORTAL_URL,
  paymentPolicyItems,
  selfPayRows,
} from "@/lib/billingContent";

export default function SelfPayPricingPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-8 items-start">
              <div>
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
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="tel:9739490270"
                    className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 font-medium text-secondary hover:bg-white transition-colors"
                  >
                    Confirm Pricing by Phone
                  </a>
                  <a
                    href={PATIENT_PORTAL_URL}
                    className="btn-primary inline-flex items-center justify-center"
                  >
                    Go to Patient Portal
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

              <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600">
                Rates are subject to confirmation at the time of visit.
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
              <table className="min-w-full text-sm sm:text-base">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left font-black text-secondary">Category</th>
                    <th className="px-5 py-4 text-left font-black text-secondary">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selfPayRows.map(([label, amount]) => (
                    <tr key={label} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 text-gray-700">{label}</td>
                      <td className="px-5 py-4 font-black text-secondary">{amount}</td>
                    </tr>
                  ))}
                  <tr className="hover:bg-slate-50/80 transition-colors">
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
