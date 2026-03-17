"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accessibility,
  FileCheck2,
  FileText,
  Globe,
  Lock,
  Scale,
  ShieldCheck,
} from "lucide-react";

const policySections = [
  {
    title: "Privacy Policy",
    icon: Lock,
    paragraphs: [
      "CLAPS MD and the PFT Lab respect your privacy and are committed to protecting your personal and medical information. This Privacy Policy explains how we collect, use, store, and safeguard the information you provide when using our website or receiving services at our facility.",
      "We may collect personal information including your name, date of birth, contact information, insurance details, and medical information when necessary for scheduling, referral processing, Pulmonary Function Testing (PFT), billing, and communication with your Primary Care Provider (PCP) or referring physician.",
      "Information submitted through our website, referral pages, or communication forms is used only for healthcare-related purposes. We do not sell, rent, or share personal information with unauthorized third parties.",
      "We maintain secure systems and procedures to protect all patient information from unauthorized access or disclosure.",
    ],
    bullets: [
      "Treatment coordination with your PCP or referring provider",
      "Insurance verification and billing",
      "Healthcare operations and documentation",
      "Legal or regulatory requirements",
    ],
    bulletLabel: "Your information may be shared only when necessary for:",
  },
  {
    title: "HIPAA Notice",
    icon: ShieldCheck,
    paragraphs: [
      "CLAPS MD and the PFT Lab comply with the Health Insurance Portability and Accountability Act (HIPAA) and all applicable federal and state privacy regulations.",
      "We will not release your medical information without your authorization except as permitted by law.",
      "We take all reasonable precautions to keep your medical information secure and confidential.",
    ],
    bullets: [
      "Providing medical care and Pulmonary Function Testing",
      "Communicating with your Primary Care Provider (PCP) or referring provider",
      "Insurance billing and payment processing",
      "Healthcare operations such as quality review and record keeping",
      "Legal reporting requirements when required by law",
    ],
    bulletLabel: "Your Protected Health Information (PHI) may be used for:",
    secondaryBullets: [
      "Request access to your medical records",
      "Request corrections to your records",
      "Request restrictions on certain uses of your information",
      "Receive a copy of our full HIPAA Notice of Privacy Practices",
    ],
    secondaryBulletLabel: "You have the right to:",
  },
  {
    title: "Terms & Conditions",
    icon: FileText,
    paragraphs: [
      "By accessing or using the CLAPS MD and PFT Lab website, you agree to the terms and conditions described below.",
      "The information provided on this website is for informational purposes only and should not be considered medical advice. Use of this website does not establish a provider-patient relationship.",
      "Pulmonary Function Testing and related diagnostic services require a valid referral from a licensed healthcare provider, usually your Primary Care Provider (PCP) or specialist. Testing cannot be performed without proper medical authorization when required.",
      "Users agree not to submit false information, attempt unauthorized access, or misuse the website in any way.",
      "CLAPS MD reserves the right to update or modify website content, policies, and procedures at any time without prior notice.",
    ],
  },
  {
    title: "Accessibility Statement",
    icon: Accessibility,
    paragraphs: [
      "CLAPS MD and the PFT Lab are committed to making our website accessible to all individuals, including those with disabilities.",
      "We aim to provide content that is easy to read, navigate, and understand for all users. If you have difficulty accessing any part of this website, please contact our office and we will make reasonable efforts to provide the information in another format.",
      "Our goal is to ensure equal access to information for patients, providers, and visitors.",
    ],
    bullets: [
      "Phone assistance",
      "Email communication",
      "Printed documents",
      "Direct office support",
    ],
    bulletLabel: "Alternative access may include:",
  },
  {
    title: "Website Disclaimer",
    icon: Scale,
    paragraphs: [
      "The information provided on this website is for general informational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment.",
      "Pulmonary Function Testing (PFT) services provided by CLAPS MD require a valid referral from a licensed healthcare provider when required by law or insurance policy.",
      "Use of this website does not create a doctor-patient relationship.",
      "While we make every effort to keep website information accurate and up to date, CLAPS MD does not guarantee that all content is complete, current, or free from errors.",
      "Use of this website is at your own risk.",
    ],
  },
  {
    title: "Price Transparency",
    icon: FileCheck2,
    paragraphs: [
      "CLAPS MD and the PFT Lab support healthcare price transparency and believe patients should have clear information about the cost of their testing.",
      "Patients are encouraged to contact our office before their appointment to request an estimate of charges.",
      "Final costs are determined after insurance verification and completion of the ordered services.",
      "We will make reasonable efforts to provide accurate pricing information whenever possible.",
    ],
    bullets: [
      "The type of test ordered by the referring provider",
      "Insurance coverage and benefits",
      "Deductibles, copayments, or coinsurance",
      "Additional testing required during the visit",
    ],
    bulletLabel: "The cost of Pulmonary Function Testing may vary depending on:",
  },
  {
    title: "Data Use Statement",
    icon: Globe,
    paragraphs: [
      "Information submitted through the CLAPS MD website, referral page, or contact forms is used only for legitimate healthcare and administrative purposes.",
      "Patient information is stored in secure systems that follow healthcare privacy regulations.",
      "CLAPS MD does not sell personal data and does not use patient information for marketing without consent.",
      "By using this website, you acknowledge and agree that information submitted may be used for these purposes in accordance with our privacy and compliance policies.",
    ],
    bullets: [
      "Appointment scheduling",
      "Provider referral processing",
      "Pulmonary Function Testing documentation",
      "Insurance verification and billing",
      "Communication with patients and referring providers",
      "Maintaining medical records as required by law",
    ],
    bulletLabel: "Data may be used for:",
  },
];

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
                  practice. This page outlines our policies regarding privacy, data use, referrals,
                  pricing, and website usage.
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
            {policySections.map((section) => {
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
