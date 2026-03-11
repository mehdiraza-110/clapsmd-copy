"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import {
  BadgeDollarSign,
  CreditCard,
  FileText,
  Coins,
  Landmark,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const PATIENT_PORTAL_URL =
  "https://phr.charmtracker.com/login.sas?FACILITY_ID=3a3047be28b32bf95dac27bd660a2fb90a976cc644c8922b2e62fe42203ae47ddda3124f8ffc5ce6";

const insuranceCarriers = [
  {
    name: "Aetna (most commercial plans)",
    logo: "/logos/aetna.webp",
    logoAlt: "Aetna logo",
  },
  {
    name: "Horizon BCBS",
    logo: "/logos/HBCBS.webp",
    logoAlt: "Horizon BCBS logo",
  },
  {
    name: "Horizon NJ Health (Medicaid)",
    logo: "/logos/HNJH.webp",
    logoAlt: "Horizon NJ Health logo",
  },
  {
    name: "Cigna",
    logo: "/logos/cigna.webp",
    logoAlt: "Cigna logo",
  },
  {
    name: "United Healthcare (commercial)",
    logo: "/logos/united.webp",
    logoAlt: "United Healthcare logo",
  },
  {
    name: "Wellpoint / Amerigroup (Medicaid)",
    logo: "/logos/wellpoint.webp",
    logoAlt: "Wellpoint logo",
  },
  {
    name: "Magnacare",
    logo: "/logos/magnacare.webp",
    logoAlt: "Magnacare logo",
  },
  {
    name: "1199 SEIU Benefit and Pension Funds",
    logo: "/logos/1199seiu.webp",
    logoAlt: "1199 SEIU logo",
  },
  {
    name: "Meritain Health",
    logo: "/logos/meritain.webp",
    logoAlt: "Meritain Health logo",
  },
  {
    name: "AmeriHealth",
    logo: "/logos/amerihealth.webp",
    logoAlt: "AmeriHealth logo",
  },
  {
    name: "Tricare",
    logo: "/logos/tricare.webp",
    logoAlt: "Tricare logo",
  },
  {
    name: "Commercial plans accepted by contract",
  },
  {
    name: "Medicaid plans accepted by contract",
  },
  {
    name: "Additional participating plans may apply",
  },
];

const selfPayRows = [
  ["New Patient (Infants-Toddlers)", "$___"],
  ["New Patient (Older Kids-Adolescents)", "$___"],
  ["Follow-Up", "$___"],
  ["Telemedicine", "$___"],
  ["Spirometry", "$___"],
  ["Bronchospasm", "$___"],
  ["Lung Volumes", "$___"],
  ["Rapid Strep", "$___"],
  ["FeNO", "$___"],
  ["Oscillometry", "$___"],
  ["Methacholine Challenge", "$___"],
  ["Complete PFT", "$___"],
];

const insuranceTerms = [
  {
    title: "Copay",
    icon: WalletCards,
    description:
      "A fixed amount you pay at each visit, such as $20 or $30, based on your insurance plan.",
  },
  {
    title: "Deductible",
    icon: Landmark,
    description:
      "The amount you must pay out of pocket each year before your insurance begins sharing the cost of covered medical services.",
  },
  {
    title: "Coinsurance",
    icon: Coins,
    description:
      "After your deductible is met, coinsurance is the percentage split between you and your insurance plan, such as 20% from you and 80% from insurance.",
  },
  {
    title: "Out-of-Pocket Costs",
    icon: BadgeDollarSign,
    description:
      "This includes the total you pay in a year through deductible, copays, and coinsurance until you reach your out-of-pocket maximum.",
  },
];

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
                  Clear Billing Information for Families
                </h1>
                <p className="mt-6 text-lg text-gray-700 leading-8 max-w-3xl">
                  We want every family to understand insurance participation, self-pay options,
                  and financial responsibility before the visit. This page outlines accepted
                  carriers, payment expectations, and common insurance terms.
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
                  <li>Payment is due at the time of service for all self-pay visits and procedures.</li>
                  <li>We accept major credit cards, debit cards, and cash.</li>
                  <li>Rates are subject to change. Please confirm pricing at the time of visit.</li>
                  <li>For detailed estimates, call the office or send questions to info@clapsmd.org.</li>
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
                  Our self-pay options are for patients without insurance or those who choose not
                  to bill insurance. Placeholder pricing is shown below and will be finalized by
                  the client.
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

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr,1.05fr] gap-8">
            <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
              <h2 className="text-3xl font-black text-secondary tracking-tight">
                Price Transparency
              </h2>
              <p className="mt-4 text-gray-600 leading-8">
                We support transparent pricing for office visits, telehealth, and PFT Lab testing.
                Self-pay rates are listed here as placeholders and can be confirmed by our team
                before the visit.
              </p>
              <ul className="mt-6 space-y-3 text-gray-700">
                <li>Office visits</li>
                <li>Telehealth</li>
                <li>PFT Lab testing</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-secondary p-6 sm:p-8 text-white shadow-lg">
              <h2 className="text-3xl font-black tracking-tight">Billing Help</h2>
              <p className="mt-4 text-white/80 leading-8">
                If you have questions about your benefits, self-pay options, or billing
                responsibility, our office can help guide you before your appointment.
              </p>
              <div className="mt-6 space-y-3 text-white/90">
                <p>
                  <span className="font-black text-primary">Phone:</span> (973) 949-0270
                </p>
                <p>
                  <span className="font-black text-primary">Email:</span> info@clapsmd.org
                </p>
                <p>
                  <span className="font-black text-primary">Portal:</span>{" "}
                  <a href={PATIENT_PORTAL_URL} className="underline underline-offset-4">
                    Patient Portal Billing / Payments
                  </a>
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={PATIENT_PORTAL_URL}
                  className="btn-primary inline-flex items-center justify-center"
                >
                  Pay Through Patient Portal
                </a>
                <a
                  href="mailto:info@clapsmd.org"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Email Billing Team
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
            <div className="rounded-[2rem] bg-slate-50 border border-slate-200 px-6 py-10 sm:px-10 sm:py-12">
              <h2 className="text-3xl font-black text-secondary tracking-tight">
                Commitment to Clarity and Accessibility
              </h2>
              <p className="mt-4 max-w-4xl text-gray-700 leading-8">
                Our goal is to ensure every family understands financial responsibility before the
                visit. If you have questions about rates, insurance terminology, or payment
                options, our team is here to help.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
