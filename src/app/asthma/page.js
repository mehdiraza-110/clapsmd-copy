import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingButton from "@/components/BookingButton";
import { ArrowRight, CheckCircle2, HelpCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seoMetadata";

export const metadata = buildPageMetadata({
  title: "Pediatric Asthma FAQs | Wayne, NJ (Serving NJ & NY) | C.L.A.P.S. MD",
  description:
    "Common pediatric asthma questions answered for families in Wayne, NJ and Northern New Jersey: diagnosis in young children, symptom differences, daily inhalers, inhaled steroids, and sports.",
  path: "/asthma",
  ogImage: "/images/hero-image.webp",
});

const faqs = [
  {
    question: "Is my child too young to have asthma?",
    answer:
      "Asthma can occur even in very young children. While diagnosing asthma in preschool-aged children can be more challenging, it can be done. Pediatric pulmonologists use a child's symptom history, risk factors, response to medication, and clinical criteria to assess asthma likelihood and recommend the right evaluation and treatment plan. If you're in New Jersey or New York and have concerns about recurrent coughing or wheezing, we're here to help.",
  },
  {
    question:
      "My child doesn't have the same symptoms as someone else with asthma. Could it still be asthma?",
    answer:
      "Yes. Asthma can look different from child to child. Some children mainly cough, others wheeze, and some have symptoms only with colds or exercise. Asthma severity and treatment needs can vary widely, which is why a personalized evaluation is important.",
  },
  {
    question: "There are no asthma symptoms today. Does my child still have asthma?",
    answer:
      "Possibly. Many children with asthma have symptoms that come and go. Even when symptoms are not present, there may still be underlying airway inflammation. Asthma does not disappear simply because a child feels better for a period of time. If your child has persistent asthma, your pulmonologist may recommend daily controller medication to help prevent flare-ups and reduce future risk.",
  },
  {
    question:
      "Do we need an inhaler or asthma medication if my child isn't having trouble breathing right now?",
    answer:
      "Often, yes. Many children with asthma have airway inflammation that requires daily controller medication, even when they feel well. Preventive treatment can reduce flare-ups, missed school days, ER visits, and the need for oral steroids. Quick-relief rescue inhalers should be used at the first sign of symptoms, based on the asthma action plan you review with your physician.",
  },
  {
    question: "Are inhaled steroids dangerous?",
    answer:
      "Inhaled corticosteroids are a safe and effective long-term treatment for asthma when used correctly and as prescribed. They work mainly in the lungs (locally) and are considered the standard of care for controlling inflammation and preventing asthma attacks. At follow-up visits, your pediatric pulmonologist will monitor symptoms, adjust doses as needed, and aim for the lowest effective medication plan to keep asthma well controlled.",
  },
  {
    question: "Can my child still play sports and be active with asthma?",
    answer:
      "Yes. With proper treatment and good asthma control, children can participate in sports and physical activity. Symptoms during exercise can be a sign that asthma needs better control or an updated plan. Many athletes manage asthma successfully and compete at the highest levels.",
  },
  {
    question: "Are pulmonary function tests painful?",
    answer:
      "No. Pulmonary function tests are non-invasive and generally not painful. Some patients may feel mildly tired after repeated breathing efforts, but the test is safe and well tolerated.",
  },
  {
    question: "Can I eat or drink before my PFT appointment?",
    answer:
      "Yes, but we recommend avoiding heavy meals right before testing. A lighter meal is usually more comfortable for deep breathing. It is also best to avoid smoking and alcohol before the test.",
  },
  {
    question: "Should I use my inhaler before pulmonary function testing?",
    answer:
      "Follow your doctor’s instructions. Some patients are asked to hold certain inhalers before testing so results are more accurate, while others may continue regular medications.",
  },
  {
    question: "What should I wear to my PFT appointment?",
    answer:
      "Wear loose, comfortable clothing that allows easy breathing. Avoid tight clothing around the chest or abdomen, as it may make deep breathing maneuvers less comfortable.",
  },
  {
    question: "Is pulmonary function testing safe for children and elderly patients?",
    answer:
      "Yes. PFT testing is safe when ordered appropriately and performed by trained staff. Modern equipment and coaching help make testing more comfortable for children and older adults.",
  },
  {
    question: "What if I cannot blow hard enough during the test?",
    answer:
      "Our respiratory team will guide you step by step and allow practice attempts. The goal is to capture your best effort, and maneuvers can be repeated to improve test quality when needed.",
  },
  {
    question: "Will I get pulmonary function test results the same day?",
    answer:
      "Most PFT reports are completed within 24-48 hours and sent to the referring physician after provider review. For urgent interpretation, please inform our team when scheduling.",
  },
  {
    question: "Can I do PFT testing without a doctor’s order?",
    answer:
      "No. Pulmonary function testing requires a referral or prescription from a licensed physician before scheduling and testing.",
  },
];

function FaqSchema({ items }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function AsthmaPage() {
  return (
    <>
      <Header />
      <main className="page-gradient-shell flex-grow overflow-hidden">
        <section className="relative overflow-hidden border-b border-gray-100/80 py-16 sm:py-20">
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.08fr,0.92fr] lg:items-start">
              <div className="site-surface rounded-[2.25rem] p-8 sm:p-10 lg:p-12">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Pediatric Asthma FAQ
                </p>
                <h1 className="mt-4 text-4xl md:text-6xl font-black text-secondary leading-tight uppercase tracking-tight">
                  Pediatric <span className="text-primary">Asthma</span> FAQ
                </h1>
                <p className="mt-6 text-xl text-gray-700 leading-relaxed">
                  Clear answers to common asthma questions from families in New Jersey and New York, including diagnosis, medication safety, and sports participation.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <BookingButton className="btn-primary text-lg px-8 py-4">
                    Request Appointment <ArrowRight className="ml-2 w-5 h-5 inline" />
                  </BookingButton>
                  <Link href="/about#conditions" className="btn-secondary text-lg px-8 py-4 text-center">
                    Explore Services
                  </Link>
                </div>
              </div>

              <div className="site-dark-panel rounded-[2rem] p-8 text-white">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-primary">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight">
                  Answers families can actually use.
                </h2>
                <p className="mt-4 text-white/80 leading-8">
                  These FAQs are designed to help parents better understand asthma symptoms, testing, treatment decisions, and what to expect from pediatric pulmonary care.
                </p>
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <p className="text-sm leading-7 text-white/80">
                      For urgent symptoms or severe breathing difficulty, seek immediate medical care rather than relying on website information alone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-secondary uppercase tracking-tight">
                Asthma FAQs
              </h2>
              <div className="w-20 h-2 bg-primary mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="site-surface group rounded-2xl p-6 transition-shadow hover:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <span className="text-lg font-black text-secondary tracking-tight">
                      {item.question}
                    </span>
                    <span className="text-primary text-xl font-black transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-gray-700 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>

            <div className="site-surface-muted mt-12 rounded-2xl p-6">
              <p className="text-gray-700 flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary mt-1 mr-3 flex-shrink-0" />
                Serving families in Wayne, NJ, Northern New Jersey, and the New York metro area.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FaqSchema items={faqs} />
    </>
  );
}
