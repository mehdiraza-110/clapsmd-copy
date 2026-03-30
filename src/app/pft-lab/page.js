"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  CalendarClock,
  ChevronDown,
  CheckCircle2,
  Clock3,
  Flame,
  HeartPulse,
  Landmark,
  MapPin,
  Building2,
  PlayCircle,
  Shirt,
  Stethoscope,
  TestTube2,
  Waves,
  Wind,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingButton from "@/components/BookingButton";

const testTypes = [
  {
    title: "Spirometry",
    icon: Wind,
    content:
      "Spirometry is the most common pulmonary function test. It measures airflow in the lungs by having the patient breathe into a mouthpiece connected to a spirometer. It tracks Forced Vital Capacity (FVC) and Forced Expiratory Volume in one second (FEV1) to help identify asthma, airway obstruction, and exercise-induced bronchospasm.",
    indications: [
      "Asthma diagnosis or follow-up",
      "Chronic cough, wheezing, or shortness of breath",
      "Monitoring response to inhaled treatment",
    ],
  },
  {
    title: "Lung Volumes",
    icon: Activity,
    content:
      "Lung volume testing helps measure the total amount of air the lungs can hold and how much air remains after breathing out. It gives a clearer picture when spirometry alone does not fully explain symptoms or suspected restriction.",
    indications: [
      "Possible restrictive lung disease",
      "Unexplained breathlessness with near-normal spirometry",
      "Pre-operative pulmonary risk assessment",
    ],
  },
  {
    title: "DLCO (Diffusion Capacity)",
    icon: TestTube2,
    content:
      "DLCO testing measures how efficiently the lungs transfer oxygen into the bloodstream. The patient breathes in a small, harmless gas mixture and we measure how much is absorbed. This helps evaluate the health of the air sacs and lung blood vessels in more complex or persistent respiratory concerns.",
    indications: [
      "Interstitial lung disease evaluation",
      "COPD/emphysema characterization",
      "Assessment of gas-exchange limitation",
    ],
  },
  {
    title: "Impulse Oscillometry",
    icon: Waves,
    content:
      "Impulse oscillometry measures blockages to airflow in the lungs and is especially helpful for very young children or anyone who has difficulty following the deeper breathing instructions required for standard spirometry.",
    indications: [
      "Younger children with limited spirometry effort",
      "Patients who struggle with forced breathing maneuvers",
      "Small-airway dysfunction assessment",
    ],
  },
  {
    title: "FeNO (Fractional Exhaled Nitric Oxide)",
    icon: Flame,
    content:
      "FeNO testing is a quick and easy way to measure inflammation in the bronchial tubes. It can help diagnose asthma, evaluate chronic cough, and assess how well inhaled corticosteroid treatment is working.",
    indications: [
      "Suspected eosinophilic airway inflammation",
      "Supportive testing for asthma diagnosis",
      "Checking steroid-response in ongoing asthma care",
    ],
  },
];

const pediatricSymptoms = [
  "Frequent cough",
  "Wheezing",
  "Shortness of breath",
  "Exercise intolerance",
  "Recurrent respiratory symptoms",
  "Poor response to asthma medication",
];

const adultSymptoms = [
  "Frequent cough",
  "Wheezing",
  "Shortness of breath",
  "Exercise intolerance",
  "Recurrent respiratory symptoms",
  "Poor response to asthma medication",
];

const prepTiers = [
  {
    label: "4 hours before",
    detail: "Avoid short-acting bronchodilators unless your doctor tells you otherwise.",
  },
  {
    label: "12 hours before",
    detail: "Avoid longer-acting inhalers if instructed for your specific testing plan.",
  },
  {
    label: "24 hours before",
    detail: "Avoid select extended respiratory medicines if the ordering clinician instructs you to hold them.",
  },
];

const ageGuidelines = [
  {
    label: "Typical pediatric testing age",
    detail:
      "Most children can perform standard spirometry reliably around age 5 and above with coaching.",
  },
  {
    label: "Younger children",
    detail:
      "For younger children, impulse oscillometry may be used when forced breathing maneuvers are difficult.",
  },
  {
    label: "Adults and seniors",
    detail:
      "Adults and elderly patients can be tested safely with guided, non-invasive breathing assessments.",
  },
];

const referralDetails = [
  "A referral/order from a licensed physician is required before scheduling.",
  "The order should include the reason for testing and the requested study when available.",
  "Please bring the referral/prescription at the time of the visit.",
];

const contraindications = [
  "Recent heart attack",
  "Recent eye, chest, or abdominal surgery",
  "Active chest pain or severe shortness of breath at rest",
  "Recent pneumothorax (collapsed lung)",
  "Uncontrolled high blood pressure",
  "Severe active respiratory infection",
  "Inability to follow breathing instructions safely",
];

const testimonials = [
  {
    quote:
      "The office explained every step clearly and made the test feel much less stressful for our family.",
    author: "Parent of pediatric patient",
  },
  {
    quote:
      "Having testing done in the clinic instead of the hospital made the process much easier and more comfortable.",
    author: "Adult patient",
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-secondary">
            <Icon className="w-5 h-5" />
          </span>
          <span className="text-lg font-black text-secondary tracking-tight">{item.title}</span>
        </span>
        <ChevronDown
          className={`w-5 h-5 text-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-gray-600 leading-7">{item.content}</p>
          {item.indications?.length ? (
            <div className="mt-4">
              <p className="text-sm font-black uppercase tracking-wide text-secondary">
                Common indications
              </p>
              <ul className="mt-2 space-y-2">
                {item.indications.map((indication) => (
                  <li key={indication} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                    <span>{indication}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function PlaceholderCard({ title, description }) {
  return (
    <div className="rounded-3xl border border-dashed border-primary/35 bg-white p-6 sm:p-8">
      <div className="aspect-[4/3] rounded-2xl bg-[linear-gradient(135deg,rgba(148,209,44,0.12),rgba(0,61,91,0.06))] border border-slate-200 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-secondary font-black text-lg">{title}</p>
          <p className="text-gray-500 mt-2 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ImageCard({ images, title, contain = false, stacked = false, banner = false }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div
        className={`grid gap-4 ${
          images.length === 1
            ? "grid-cols-1"
            : stacked
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {images.map((image) => (
          <div
            key={image.src}
            className={`relative overflow-hidden rounded-2xl bg-white ${
              images.length === 1
                ? banner
                  ? "aspect-[1014/384] w-full"
                  : contain
                  ? "aspect-[4/3]"
                  : "aspect-[4/3]"
                : stacked
                  ? "aspect-[16/10]"
                  : "aspect-[4/5]"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className={
                banner ? "object-cover" : contain ? "object-contain p-6" : "object-cover"
              }
            />
          </div>
        ))}
      </div>
      <p className="mt-4 text-secondary font-black text-lg">{title}</p>
    </div>
  );
}

export default function PftLabPage() {
  const [openTest, setOpenTest] = useState(testTypes[0].title);
  const [isPrepOpen, setIsPrepOpen] = useState(false);

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        <section className="relative overflow-hidden bg-white border-b border-slate-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,209,44,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(0,61,91,0.08),transparent_38%)]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-secondary font-bold text-sm">
                  <HeartPulse className="w-4 h-4 text-primary" />
                  PFT Lab in Wayne, NJ
                </div>
                <div className="mt-6">
                  <Image
                    src="/images/PFT Lab Logo-4-transparent.png"
                    alt="PFT Lab logo"
                    width={300}
                    height={167}
                    className="h-auto w-[180px] sm:w-[240px] lg:w-[300px]"
                    priority
                  />
                </div>
                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black text-secondary tracking-tight leading-tight">
                  Pulmonary Function Testing for Children and Adults
                </h1>
                <p className="mt-6 text-lg text-gray-700 leading-8 max-w-3xl">
                  Pulmonary Function Testing (PFT) is a safe, non-invasive way to measure how
                  well your lungs are working, including airflow, breathing capacity, and gas
                  exchange. Our PFT Lab helps diagnose and monitor asthma, chronic cough,
                  wheezing, shortness of breath, and other respiratory conditions without hospital
                  facility fees.
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white border border-slate-200 p-5">
                    <p className="font-black text-secondary">Why it matters</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Faster diagnosis, clearer treatment decisions, and better tracking of how
                      the lungs respond over time.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-secondary p-5 text-white">
                    <p className="font-black">Convenient outpatient testing</p>
                    <p className="mt-2 text-sm text-white/80">
                      Local pulmonary testing in Wayne, serving Northern New Jersey and the New
                      York metro region.
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <BookingButton className="btn-primary inline-flex items-center justify-center">
                    Schedule PFT Testing
                  </BookingButton>
                  <Link
                    href="#prepare"
                    className="btn-secondary inline-flex items-center justify-center"
                  >
                    How to Prepare
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <ImageCard
                  title=""
                  images={[
                    {
                      src: "/images/breathing.png",
                      alt: "Breathing illustration",
                    },
                  ]}
                />
                <div className="rounded-3xl bg-secondary text-white p-6 sm:p-8 shadow-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <p className="font-black tracking-tight">Wayne, NJ</p>
                  </div>
                  <p className="mt-3 text-white/80 leading-7">
                    Serving patients across Northern New Jersey and the New York metro area.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-2xl font-black text-primary">15-45</p>
                      <p className="text-xs uppercase tracking-widest text-white/70">
                        Minutes for most tests
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-2xl font-black text-primary">No</p>
                      <p className="text-xs uppercase tracking-widest text-white/70">
                        Hospital facility fees
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-black text-secondary tracking-tight">
                  What Is Pulmonary Function Testing?
                </h2>
              </div>
              <p className="mt-5 text-gray-700 leading-8">
                Pulmonary Function Testing is a group of non-invasive breathing tests used to
                measure how well the lungs are working. These tests evaluate lung volume,
                airflow, lung capacity, and gas exchange for both pediatric and adult patients.
              </p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Lung volume",
                  "Airflow",
                  "Lung capacity",
                  "Gas exchange",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-black text-secondary tracking-tight">
                  Why These Tests Matter
                </h2>
              </div>
              <ul className="mt-5 space-y-4">
                {[
                  "Confirm or rule out asthma",
                  "Determine the severity of airway inflammation",
                  "Monitor response to treatment",
                  "Reduce unnecessary medications",
                  "Help prevent emergency visits",
                  "Support referring physicians with clearer respiratory data",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-18">
          <ImageCard
            title="MiniBox+ pulmonary testing equipment"
            banner
            images={[
              {
                src: "/images/equipment.png",
                alt: "MiniBox+ pulmonary function testing equipment",
              },
            ]}
          />
        </section>

        <section className="bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <TestTube2 className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-black text-secondary tracking-tight">
                    Equipment and Testing Comfort
                  </h2>
                </div>
                <p className="mt-5 text-gray-700 leading-8">
                  Testing is performed using the MiniBox+ system, designed to provide reliable
                  pulmonary measurements in a more comfortable, patient-friendly way. Many
                  patients find it easier than older methods that can feel more physically
                  demanding.
                </p>
                <p className="mt-4 text-gray-700 leading-8">
                  This approach is especially helpful for pediatric patients, older adults, and
                  anyone who has trouble with forceful breathing maneuvers.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-8">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Age Guidelines
                </p>
                <div className="mt-4 space-y-4">
                  {ageGuidelines.map((item) => (
                    <div key={item.label} className="rounded-2xl bg-white border border-slate-200 p-5">
                      <p className="font-black text-secondary">{item.label}</p>
                      <p className="mt-2 text-sm text-gray-600 leading-6">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Types of Tests
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-black text-secondary tracking-tight">
                Pulmonary Function Testing Options
              </h2>
              <p className="mt-4 text-gray-600 leading-8">
                Expand each test below to see what it measures and why it may be recommended.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4">
              {testTypes.map((item) => (
                <AccordionItem
                  key={item.title}
                  item={item}
                  isOpen={openTest === item.title}
                  onToggle={() =>
                    setOpenTest((previous) => (previous === item.title ? "" : item.title))
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Pediatric PFT
              </p>
              <h2 className="mt-3 text-3xl font-black text-secondary tracking-tight">
                When Should My Child Have PFT?
              </h2>
              <p className="mt-4 text-gray-600 leading-8">
                Your child may benefit from pulmonary function testing if they experience:
              </p>
              <ul className="mt-6 space-y-3">
                {pediatricSymptoms.map((item) => (
                  <li key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-secondary p-6 sm:p-8 shadow-sm text-white">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Adult PFT
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Adult Pulmonary Function Testing
              </h2>
              <p className="mt-4 text-white/80 leading-8">
                Adults also benefit from full pulmonary function testing when symptoms are
                persistent, unexplained, or not improving as expected.
              </p>
              <ul className="mt-6 space-y-3">
                {adultSymptoms.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 border border-white/10"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="prepare" className="bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr,0.9fr] gap-8">
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-8">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  How to Prepare
                </p>
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left"
                  onClick={() => setIsPrepOpen((open) => !open)}
                  aria-expanded={isPrepOpen}
                  aria-controls="before-your-test-content"
                >
                  <div>
                    <h2 className="text-3xl font-black text-secondary tracking-tight">
                      Before Your Test
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Expand for medication timing, day-of-test preparation, and family tips.
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-secondary transition-transform ${isPrepOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isPrepOpen && (
                  <div id="before-your-test-content">
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {prepTiers.map((tier) => (
                        <div key={tier.label} className="rounded-2xl bg-white border border-slate-200 p-5">
                          <p className="font-black text-secondary">{tier.label}</p>
                          <p className="mt-2 text-sm text-gray-600 leading-6">{tier.detail}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white border border-slate-200 p-5">
                        <div className="flex items-center gap-3">
                          <Shirt className="w-5 h-5 text-primary" />
                          <p className="font-black text-secondary">Wear comfortable clothing</p>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          Choose clothing that allows easy breathing and comfortable movement.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white border border-slate-200 p-5">
                        <div className="flex items-center gap-3">
                          <Clock3 className="w-5 h-5 text-primary" />
                          <p className="font-black text-secondary">Arrive early</p>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          Plan to arrive a little early so you can settle in and ask any questions
                          before testing begins.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white border border-slate-200 p-5">
                        <div className="flex items-center gap-3">
                          <Landmark className="w-5 h-5 text-primary" />
                          <p className="font-black text-secondary">Eat lightly</p>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          A light meal is usually best before testing to avoid discomfort with deep
                          breathing efforts.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white border border-slate-200 p-5">
                        <div className="flex items-center gap-3">
                          <CalendarClock className="w-5 h-5 text-primary" />
                          <p className="font-black text-secondary">Parents and guardians</p>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          Helping your child stay calm and relaxed is one of the most important parts
                          of a successful test.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl bg-secondary p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-3">
                    <Clock3 className="w-5 h-5 text-primary" />
                    <h3 className="text-2xl font-black tracking-tight">Test Duration</h3>
                  </div>
                  <p className="mt-4 text-4xl font-black text-primary">15-45 minutes</p>
                  <p className="mt-3 text-white/80 leading-7">
                    Most tests are completed within this range, depending on the type of study
                    ordered and the patient’s age and ability to follow instructions.
                  </p>
                </div>

                <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
                  <h3 className="text-2xl font-black text-secondary tracking-tight">
                    After the Test
                  </h3>
                  <p className="mt-4 text-gray-600 leading-8">
                    Most patients can resume normal activities immediately after the test unless
                    the doctor provides different instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-black text-secondary tracking-tight">
                  Referral Requirements
                </h2>
              </div>
              <ul className="mt-5 space-y-3">
                {referralDetails.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-secondary p-6 sm:p-8 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <CalendarClock className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-black tracking-tight">Report Turnaround</h2>
              </div>
              <p className="mt-4 text-white/85 leading-8">
                Most pulmonary function test reports are completed within 24-48 hours after
                testing and sent promptly to the referring physician.
              </p>
              <p className="mt-3 text-white/80 leading-7">
                If an urgent interpretation is needed, please inform our staff when scheduling.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
            <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 sm:p-8">
              <h2 className="text-3xl font-black text-secondary tracking-tight">
                Contraindications and Safety Screening
              </h2>
              <p className="mt-4 text-gray-700 leading-8">
                Some patients may need to delay pulmonary function testing until medically safe.
                Our clinical team reviews health history before testing to protect patient safety.
              </p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contraindications.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-2xl bg-white border border-rose-100 p-4">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                    <span className="text-gray-700 leading-7">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr,1.1fr] gap-8 items-start">
            <div className="space-y-6">
              <PlaceholderCard
                title="Mid-page Video Placeholder"
                description="Clinic introduction, services overview, doctor speaking to families, and behind-the-scenes PFT lab footage."
              />
              <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-black text-secondary tracking-tight">
                    Visual Engagement
                  </h3>
                </div>
                <ul className="mt-5 space-y-3 text-gray-700">
                  {[
                    "Who you are",
                    "Clinic introduction",
                    "Services overview",
                    "Doctor speaking directly to families",
                    "Behind-the-scenes of the PFT lab",
                    "Office interior, staff, equipment, and patient-friendly environment",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <span className="leading-7">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-slate-100 p-6 sm:p-8 shadow-sm">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                Provider Credibility
              </p>
              <h2 className="mt-3 text-3xl font-black text-secondary tracking-tight">
                Dr. Folashade Farri
              </h2>
              <div className="mt-6 space-y-5 text-gray-700 leading-8">
                <p>
                  Dr. Folashade Farri is a double board-certified Pediatric Pulmonologist and the
                  founder of Children&apos;s Lung, Asthma & Pulmonary Specialists in Wayne, NJ.
                </p>
                <p>
                  Before establishing private practice, she served as an Assistant Professor of
                  Pediatric Pulmonology at Montefiore Medical Center and directed the Technology
                  Dependent Children&apos;s Program. She has also served as Clinical Assistant
                  Professor at Rutgers NJMS and Director of the Cystic Fibrosis Foundation
                  affiliate center at RWJ-Barnabas Health.
                </p>
                <p>
                  Her care philosophy is rooted in making sure families feel heard and understood.
                  She also holds a Master of Public Health from Columbia University and serves as
                  Chief Medical Advisor for AIRnyc.
                </p>
                <p>
                  Dr. Farri is a Board Member of the Asthma & Allergy Foundation of America and a
                  recipient of the RWJ Barnabas Department of Pediatrics Best Faculty Award in
                  2021 and 2022.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ImageCard
                title=""
                stacked
                images={[
                  {
                    src: "/images/generated-image-2026-02-17-3.png",
                    alt: "PFT testing room photo 1",
                  },
                  {
                    src: "/images/generated-image-2026-02-17-4.png",
                    alt: "PFT testing room photo 2",
                  },
                ]}
              />
              <ImageCard
                title=""
                stacked
                images={[
                  {
                    src: "/images/generated-image-2026-02-17.png",
                    alt: "PFT equipment or staff photo 1",
                  },
                  {
                    src: "/images/generated-image-2026-02-17-2.png",
                    alt: "PFT equipment or staff photo 2",
                  },
                ]}
              />
              <div className="rounded-3xl bg-secondary p-6 sm:p-8 text-white">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Testimonials
                </p>
                <div className="mt-5 space-y-5">
                  {testimonials.map((item) => (
                    <blockquote
                      key={item.author}
                      className="rounded-2xl border border-white/10 bg-white/10 p-5"
                    >
                      <p className="text-white/90 leading-7">&ldquo;{item.quote}&rdquo;</p>
                      <footer className="mt-3 text-sm font-bold text-primary">
                        {item.author}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="rounded-[2rem] bg-secondary px-6 py-10 sm:px-10 sm:py-12 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8 items-center">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Schedule Pulmonary Function Testing
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
                  Pulmonary Function Testing in Wayne, NJ
                </h2>
                <p className="mt-4 text-white/80 leading-8 max-w-3xl">
                  Our PFT Lab serves pediatric and adult patients throughout Wayne, Northern New
                  Jersey, and the New York metro region. Testing is performed in a convenient
                  outpatient setting with a patient-focused experience.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <BookingButton className="btn-primary inline-flex items-center justify-center">
                  Schedule PFT Testing
                </BookingButton>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Contact the Office
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
