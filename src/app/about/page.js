import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConditionsWeTreatSection from "@/components/ConditionsWeTreatSection";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/seoMetadata";
import {
  HeartHandshake,
  Award,
  ClipboardCheck,
  ShieldCheck,
  Users,
  Microscope,
} from "lucide-react";
import DrFarriTabs from "./DrFarriTabs";

export const metadata = buildPageMetadata({
  title: "About Us | C.L.A.P.S. MD",
  description:
    "Learn about CLAPS MD's mission, philosophy of care, and Dr. Farri's background in pediatric pulmonology in Wayne, NJ and Northern New Jersey.",
  path: "/about",
  ogImage: "/images/SHADE_FARRI.jpg",
});

export default function AboutPage() {
  const values = [
    {
      title: "Compassion",
      icon: HeartHandshake,
      description:
        "We treat every patient with respect, understanding, and kindness, ensuring a comfortable and supportive healthcare experience.",
    },
    {
      title: "Excellence",
      icon: Award,
      description:
        "We strive to deliver the highest standard of medical care through precise diagnostic testing, up-to-date treatments, and continuous improvement.",
    },
    {
      title: "Integrity",
      icon: ShieldCheck,
      description:
        "We believe in honest communication, ethical practice, and putting the patient's health and safety first in every decision we make.",
    },
    {
      title: "Patient-Centered Care",
      icon: Users,
      description:
        "Every patient is unique. We focus on individualized care plans tailored to each patient's needs, symptoms, and medical history.",
    },
    {
      title: "Innovation & Technology",
      icon: Microscope,
      description:
        "We utilize modern pulmonary function testing and advanced diagnostic tools to provide accurate results and effective treatment.",
    },
    {
      title: "Collaboration",
      icon: ClipboardCheck,
      description:
        "We work closely with specialists, primary care providers, and ENT physicians to ensure coordinated and complete care for our patients.",
    },
  ];

  return (
    <>
      <Header />
      <main className="page-gradient-shell flex-grow overflow-hidden">
        <section className="relative overflow-hidden border-b border-slate-100/80 pb-10 pt-12 sm:pt-16">
          <div className="absolute -left-12 top-0 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute right-0 top-8 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-stretch">
              <div className="site-surface h-full rounded-[2.25rem] p-8 sm:p-10 lg:p-12">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  About CLAPS MD
                </p>
                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-tight">
                  Children&apos;s Lung, Asthma & Pulmonary Specialists
                </h1>
                <p className="mt-6 text-lg text-gray-700 leading-8">
                  CLAPS MD is a specialty practice focused on pulmonary and allergy care for
                  children and families in Wayne, New Jersey and surrounding communities. We combine
                  thoughtful clinical evaluation with modern diagnostic testing to identify the root
                  cause of respiratory symptoms and build practical, personalized treatment plans.
                </p>
                <p className="mt-5 text-lg text-gray-700 leading-8">
                  Our team is committed to making specialty care feel clear, supportive, and
                  accessible, so patients and caregivers feel informed at every step.
                </p>
              </div>

              <div className="relative h-full">
                <div className="glass-card h-full rounded-[2.25rem] p-3 shadow-2xl">
                  <div className="relative h-[360px] overflow-hidden rounded-[1.75rem] sm:h-[520px] lg:h-full lg:min-h-[520px]">
                    <Image
                      src="/images/generated-image-2026-02-17-2.png"
                      alt="Dr. Folashade Farri"
                      fill
                      className="object-cover object-top"
                      priority
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,61,91,0.06),transparent_30%,rgba(0,61,91,0.14))]" />
                  </div>
                </div>

                <div className="site-dark-panel absolute bottom-4 left-4 max-w-xs rounded-[1.75rem] p-5 text-white shadow-xl sm:bottom-8 sm:left-8">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
                    Pediatric Pulmonology
                  </p>
                  <p className="mt-3 text-base leading-7 text-white/85">
                    Thoughtful evaluation, advanced testing, and family-centered long-term care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100/80 py-12 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="site-surface rounded-[2rem] p-8 sm:p-10">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Mission & Values
              </p>
              <div className="soft-gradient-panel mt-6 rounded-[1.5rem] border border-primary/20 p-6 sm:p-8">
                <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                  Our Mission
                </h2>
                <p className="mt-4 text-lg text-gray-700 leading-8 max-w-5xl">
                  At CLAPS MD, our mission is to provide high-quality, compassionate, and
                  patient-centered care through accurate diagnosis, advanced pulmonary and allergy
                  testing, and personalized treatment plans. We are committed to helping every
                  patient breathe easier, feel better, and live healthier by using modern medical
                  technology and evidence-based care.
                </p>
              </div>

              <h3 className="mt-8 text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                Our Values
              </h3>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {values.map((value) => {
                  const Icon = value.icon;

                  return (
                    <div key={value.title} className="site-surface-muted rounded-2xl p-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-4 font-black text-secondary">{value.title}</p>
                      <p className="mt-2 text-gray-700 leading-7">{value.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <DrFarriTabs />

        <section className="relative overflow-hidden py-20 text-white">
          <div className="site-hero-band absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,209,44,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur-sm sm:px-10">
              <blockquote className="text-2xl md:text-4xl font-black leading-tight tracking-tight">
                &ldquo;The first, second, and third steps in the management of children&apos;s breathing is health education.&rdquo;
              </blockquote>
              <p className="mt-6 text-lg text-primary font-bold">— Dr. Farri</p>
            </div>
          </div>
        </section>

        <ConditionsWeTreatSection />
      </main>
      <Footer />
    </>
  );
}
