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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
              <div className="site-surface rounded-[2.25rem] p-8 sm:p-10 lg:p-12">
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

              <div className="relative">
                <div className="glass-card rounded-[2.25rem] p-3 shadow-2xl">
                  <div className="relative h-[360px] overflow-hidden rounded-[1.75rem] sm:h-[520px]">
                    <Image
                      src="/images/Dr Farri_indoor blazer.jpeg"
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

        <section className="border-b border-slate-100/80 py-14 sm:py-16">
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

        <section className="border-b border-slate-100/80 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr,0.95fr] gap-10 items-start">
              <div className="site-surface rounded-[2rem] p-8 sm:p-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Meet Dr. Farri
                </p>
                <h1 className="mt-4 text-4xl sm:text-5xl font-black text-secondary tracking-tight leading-tight">
                  Dr. Folashade Farri, MD, MPH
                </h1>
                <p className="mt-6 text-lg text-gray-700 leading-8">
                  Dr. Folashade Farri is a dedicated Pediatric Pulmonologist and the Specialty
                  Practice Owner of Children&apos;s Lung, Asthma & Pulmonary Specialists in Wayne,
                  New Jersey. With a deep passion for helping children breathe easier and stay
                  active, she combines extensive clinical expertise with a public health
                  background to provide comprehensive, compassionate care to her patients and
                  their families.
                </p>
                <p className="mt-5 text-lg text-gray-700 leading-8">
                  At CLAPS MD, families can expect thoughtful evaluation, clear communication, and
                  care that balances medical excellence with genuine warmth. Dr. Farri believes
                  that when parents understand what is happening, they feel more confident,
                  children feel more supported, and outcomes improve.
                </p>
              </div>

              <div className="glass-card rounded-[2rem] p-4 shadow-xl">
                <div className="relative h-[420px] sm:h-[520px] w-full overflow-hidden rounded-[1.5rem] bg-white">
                  <Image
                    src="/images/Dr Farri_white coat.jpeg"
                    alt="Dr. Folashade Farri"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100/80 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-6 lg:gap-8">
              <div className="site-surface rounded-[2rem] p-8 sm:p-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Our Philosophy of Care
                </p>
                <p className="mt-6 text-lg text-gray-700 leading-8">
                  At CLAPS MD, our philosophy of care is simple, yet profound. We care sincerely,
                  treating every family with respect, warmth, and attentiveness from the very first
                  conversation. We prioritize health education because understanding leads to
                  confidence, and confidence leads to better outcomes for children and their
                  caregivers.
                </p>
                <p className="mt-5 text-lg text-gray-700 leading-8">
                  We also believe the best pediatric pulmonology care blends medical excellence with
                  empathy. Every child&apos;s story is different, so our approach is personalized,
                  evidence-based, and family-centered in every interaction, whether we are guiding a
                  new diagnosis, reviewing testing, or supporting long-term respiratory management.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="site-dark-panel rounded-[2rem] p-6 text-white">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
                    How We Care
                  </p>
                  <p className="mt-4 text-2xl font-black leading-tight">
                    Evidence-based care delivered with warmth and clarity.
                  </p>
                </div>
                <div className="glass-card rounded-[2rem] overflow-hidden shadow-sm">
                  <div className="relative h-full min-h-[220px]">
                    <Image
                      src="/images/blog/pediatrician-with-child-and-parent.png"
                      alt="Pediatric pulmonologist with child and parent"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="glass-card rounded-[2rem] overflow-hidden shadow-sm">
                  <div className="relative h-full min-h-[220px]">
                    <Image
                      src="/images/blog/Cartoon pediatric pulmonologist examining a child with a parent in the room.jpg"
                      alt="Pediatric pulmonologist examining a child with parent present"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="site-surface-muted rounded-[2rem] p-6">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
                    Family Focus
                  </p>
                  <p className="mt-4 text-base leading-7 text-gray-700">
                    We combine careful diagnosis, parent education, and long-term respiratory
                    support so families feel informed, equipped, and genuinely cared for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100/80 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="site-surface rounded-[2rem] p-8 sm:p-10">
                <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                  Clinical Leadership & Experience
                </h2>
                <p className="mt-5 text-lg text-gray-700 leading-8">
                  Throughout her career, Dr. Farri has held several prominent leadership roles in
                  pediatric respiratory care. She previously served as the Director of the Cystic
                  Fibrosis Foundation affiliate center at RWJ-Barnabas Health, where she helped lead
                  advanced respiratory care for children with complex chronic needs.
                </p>
                <p className="mt-5 text-lg text-gray-700 leading-8">
                  Prior to that, she was the Director of the Technology Dependent Children&apos;s
                  Program at Montefiore Medical Center, leading a multidisciplinary outpatient
                  program for medically complex patients. Today, she continues to extend her impact
                  beyond the walls of the clinic as the Chief Medical Advisor for AIRnyc, bringing
                  her expertise to broader asthma and respiratory health initiatives.
                </p>
              </div>

                <div className="glass-card rounded-[2rem] overflow-hidden shadow-sm">
                  <div className="relative h-full min-h-[320px]">
                    <Image
                      src="/images/Dr Farri_blazer.jpeg"
                      alt="Dr. Farri portrait"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

              <div className="glass-card rounded-[2rem] overflow-hidden shadow-sm">
                <div className="relative h-full min-h-[320px]">
                  <Image
                    src="/images/hero-image.webp"
                    alt="CLAPS MD family care"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="site-surface-muted rounded-[2rem] p-8 sm:p-10">
                <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                  Education & Credentials
                </h2>
                <p className="mt-5 text-lg text-gray-700 leading-8">
                  Dr. Farri&apos;s medical training reflects both international depth and elite public
                  health and specialty preparation in the United States. She earned her medical
                  degree from Obafemi Awolowo University in Nigeria and later completed a Master of
                  Public Health at Columbia University in New York, strengthening her ability to
                  care not only for individual patients, but also to think broadly about systems,
                  prevention, and long-term outcomes.
                </p>
                <p className="mt-5 text-lg text-gray-700 leading-8">
                  She completed her Pediatric Residency at Bronx Lebanon Hospital in New York,
                  followed by a Pediatric Pulmonology Fellowship at Westchester Medical Center. Dr.
                  Farri is a dual board-certified Fellow of the American Board of Pediatrics and the
                  American Board of Pediatric Pulmonology, and she holds active professional medical
                  licenses in both New Jersey and New York.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr,0.95fr] gap-6">
              <div className="site-surface rounded-[2rem] p-8 sm:p-10">
                <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                  Awards & Professional Recognition
                </h2>
                <p className="mt-5 text-lg text-gray-700 leading-8">
                  Dr. Farri is highly regarded by her peers and the broader medical community. She
                  is a Fellow of the American Academy of Pediatrics and is professionally connected
                  with the American Thoracic Society, the New Jersey chapter of the American Academy
                  of Pediatrics, and the American Academy of Asthma, Allergy & Immunology. She also
                  serves as a Board Member of the Asthma & Allergy Foundation of America, reflecting
                  her continued leadership in respiratory advocacy and education.
                </p>
                <p className="mt-5 text-lg text-gray-700 leading-8">
                  Her dedication to academic medicine and trainee development has also been
                  recognized through the Best Faculty Award from the RWJ Barnabas Department of
                  Pediatrics in both 2021 and 2022, a meaningful reflection of the respect she has
                  earned as both a clinician and mentor.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="site-dark-panel rounded-[2rem] p-8 text-white">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">
                    Recognition
                  </p>
                  <p className="mt-4 text-3xl font-black leading-tight">
                    Respected clinician, educator, advisor, and advocate in pediatric respiratory care.
                  </p>
                </div>

                <div className="site-surface-muted rounded-[2rem] p-8 sm:p-10">
                  <h2 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                    Beyond the Clinic
                  </h2>
                  <p className="mt-5 text-lg text-gray-700 leading-8">
                    Dr. Farri believes deeply in community health and meaningful engagement beyond the
                    exam room. In addition to treating patients and helping scale asthma quality
                    improvement efforts across healthcare systems, she volunteers her time locally with
                    the Bethany Community Center in Washington Township and the Special Olympics of
                    New Jersey.
                  </p>
                  <p className="mt-5 text-lg text-gray-700 leading-8">
                    Her commitment to service also extends internationally through medical missions.
                    That same spirit of outreach, compassion, and advocacy shapes the way she cares
                    for families at CLAPS MD every day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 text-white">
          <div className="site-hero-band absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,209,44,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 px-6 py-10 backdrop-blur-sm sm:px-10">
              <blockquote className="text-2xl md:text-4xl font-black leading-tight tracking-tight">
                “The first, second, and third steps in the management of children&apos;s breathing is health education.”
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
