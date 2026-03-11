import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConditionsWeTreatSection from "@/components/ConditionsWeTreatSection";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "About Us | C.L.A.P.S. MD",
  description:
    "Learn about CLAPS MD's mission, philosophy of care, and Dr. Farri's background in pediatric pulmonology in Wayne, NJ and Northern New Jersey.",
  path: "/about",
  ogImage: "/images/SHADE_FARRI.jpg",
});

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-grow bg-white">
        <div className="bg-secondary py-8 shadow-xl border-b-4 border-primary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex flex-col border-l-4 border-primary pl-6">
                <h2 className="text-white font-black tracking-tight text-xl md:text-3xl leading-tight max-w-xl">
                  Children's Lung Asthma <br className="hidden lg:block" /> & Pulmonary Specialists
                </h2>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <p className="text-primary font-black tracking-tight text-4xl md:text-6xl leading-none">
                  CLAPS MD
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-black text-primary-darker uppercase tracking-tight mb-10">
              About Us
            </h1>
            <div className="max-w-5xl space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                At CLAPS MD, we provide high-quality pediatric pulmonology care while ensuring every child and family feels truly seen, heard, and supported.
              </p>
              <p>
                Our team is committed to clinical excellence, wrapped in compassion. We take a clear, step-by-step approach to care, with a strong focus on health education, so parents feel confident and informed at every stage.
              </p>
              <p>
                We also harness modern technology to support testing, monitoring, and ongoing care, helping families breathe easier knowing CLAPS MD stays closely connected to their child&apos;s health and progress.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight mb-6">
                Philosophy of Care
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At CLAPS MD, our philosophy of care is simple, yet profound:
              </p>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-primary mt-3 mr-3 flex-shrink-0" />
                  We care sincerely.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-primary mt-3 mr-3 flex-shrink-0" />
                  We prioritize health education as a core part of prevention and treatment.
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-primary mt-3 mr-3 flex-shrink-0" />
                  We blend medical excellence, empathy, and personalized care in every interaction.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <div className="rounded-3xl border border-primary/20 bg-slate-50 p-3 shadow-sm">
                  <div className="relative h-[420px] w-full overflow-hidden rounded-2xl bg-white">
                    <Image
                      src="/images/Dr Farri_blazer.jpeg"
                      alt="Dr. Folashade Farri"
                      fill
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight mb-4">
                    Dr. Farri Bio
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Dr. Farri is the founder of CLAPS MD and a double board-certified Pediatric Pulmonologist dedicated to compassionate, evidence-based respiratory care for children.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-xl font-black text-secondary mb-4">Career</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0" />
                        Assistant Professor at Montefiore
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0" />
                        Clinical Assistant Professor at Rutgers NJMS
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0" />
                        Director of CF Foundation affiliate center at RWJ-Barnabas
                      </li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-xl font-black text-secondary mb-4">Education</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0" />
                        MPH from Columbia University
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0" />
                        Residency at Bronx Lebanon
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0" />
                        Fellowship at Westchester Medical Center
                      </li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-xl font-black text-secondary mb-4">Awards</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0" />
                        Best Faculty Award 2021 from RWJ Barnabas Dept of Pediatrics
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0" />
                        Best Faculty Award 2022 from RWJ Barnabas Dept of Pediatrics
                      </li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-xl font-black text-secondary mb-4">Current Roles</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0" />
                        Board Member of Asthma &amp; Allergy Foundation of America
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2.5 mr-3 flex-shrink-0" />
                        Chief Medical Advisor for AIRnyc
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-secondary text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <blockquote className="text-2xl md:text-4xl font-black leading-tight tracking-tight">
              “The first, second, and third steps in the management of children&apos;s breathing is health education.”
            </blockquote>
            <p className="mt-6 text-lg text-primary font-bold">— Dr. Farri</p>
          </div>
        </section>

        <ConditionsWeTreatSection />
      </main>
      <Footer />
    </>
  );
}
