"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, Briefcase, GraduationCap, Globe, User } from "lucide-react";

const tabs = [
  { id: "bio",        label: "Bio",              icon: User },
  { id: "education",  label: "Education",         icon: GraduationCap },
  { id: "experience", label: "Experience",        icon: Briefcase },
  { id: "awards",     label: "Awards",            icon: Award },
  { id: "beyond",     label: "Beyond the Clinic", icon: Globe },
];

function BioTab() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,0.8fr] lg:items-start">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">Introduction</p>
          <h3 className="mt-3 text-2xl sm:text-3xl font-black text-secondary tracking-tight leading-tight">
            Dr. Folashade Farri, MD, MPH
          </h3>
        </div>
        <p className="text-lg text-gray-700 leading-8">
          Dr. Folashade Farri is a dedicated Pediatric Pulmonologist and the Specialty Practice Owner of
          Children&apos;s Lung, Asthma &amp; Pulmonary Specialists in Wayne, New Jersey. With a deep passion for
          helping children breathe easier and stay active, she combines extensive clinical expertise with a
          public health background to provide comprehensive, compassionate care to her patients and their families.
        </p>
        <p className="text-lg text-gray-700 leading-8">
          At CLAPS MD, families can expect thoughtful evaluation, clear communication, and care that
          balances medical excellence with genuine warmth. Dr. Farri believes that when parents understand
          what is happening, they feel more confident, children feel more supported, and outcomes improve.
        </p>
        <div className="site-surface-muted rounded-2xl p-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-4">Philosophy of Care</p>
          <p className="text-gray-700 leading-8">
            At CLAPS MD, our philosophy of care is simple, yet profound. We care sincerely, treating every
            family with respect, warmth, and attentiveness from the very first conversation. We prioritize
            health education because understanding leads to confidence, and confidence leads to better outcomes.
          </p>
          <p className="mt-4 text-gray-700 leading-8">
            Every child&apos;s story is different, so our approach is personalized, evidence-based, and
            family-centered in every interaction — whether guiding a new diagnosis, reviewing testing, or
            supporting long-term respiratory management.
          </p>
        </div>
      </div>
      <div className="glass-card rounded-[2rem] overflow-hidden shadow-lg">
        <div className="relative h-[400px] w-full lg:h-full lg:min-h-[540px]">
          <Image
            src="/images/Dr Farri_white coat.jpeg"
            alt="Dr. Folashade Farri"
            fill
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

const credentials = [
  { category: "Medical Degree",                      detail: "Obafemi Awolowo University",                     location: "Nigeria" },
  { category: "Master of Public Health (MPH)",        detail: "Columbia University",                            location: "New York, USA" },
  { category: "Pediatric Residency",                  detail: "Bronx Lebanon Hospital",                         location: "New York, USA" },
  { category: "Pulmonology Fellowship",               detail: "Westchester Medical Center",                     location: "New York, USA" },
  { category: "Board Certification",                  detail: "American Board of Pediatrics",                   location: "Dual Certified" },
  { category: "Board Certification",                  detail: "American Board of Pediatric Pulmonology",        location: "Dual Certified" },
  { category: "Medical Licenses",                     detail: "Active in New Jersey and New York",              location: "" },
];

function EducationTab() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">Academic Background</p>
        <h3 className="mt-3 text-2xl sm:text-3xl font-black text-secondary tracking-tight">
          Education &amp; Credentials
        </h3>
        <p className="mt-4 text-lg text-gray-700 leading-8 max-w-3xl">
          Dr. Farri&apos;s medical training reflects both international depth and elite public health and
          specialty preparation in the United States. She is a dual board-certified Fellow of the American
          Board of Pediatrics and the American Board of Pediatric Pulmonology, with active medical licenses
          in both New Jersey and New York.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {credentials.map((c, i) => (
          <div key={i} className="site-surface-muted rounded-2xl p-5 flex flex-col gap-1">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-primary">{c.category}</span>
            <span className="mt-1 text-base font-bold text-secondary leading-tight">{c.detail}</span>
            {c.location && <span className="text-sm text-gray-500">{c.location}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

const roles = [
  {
    title: "Director",
    org: "Cystic Fibrosis Foundation Affiliate Center",
    employer: "RWJ-Barnabas Health",
    description: "Led advanced respiratory care for children with complex chronic needs at a nationally recognized CF program.",
  },
  {
    title: "Director",
    org: "Technology Dependent Children's Program",
    employer: "Montefiore Medical Center",
    description: "Led a multidisciplinary outpatient program serving medically complex pediatric patients.",
  },
  {
    title: "Chief Medical Advisor",
    org: "AIRnyc",
    employer: "",
    description: "Extends clinical impact through asthma quality improvement efforts and respiratory health initiatives across healthcare systems.",
  },
];

function ExperienceTab() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,0.55fr] lg:items-start">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">Career</p>
          <h3 className="mt-3 text-2xl sm:text-3xl font-black text-secondary tracking-tight">
            Clinical Leadership &amp; Experience
          </h3>
          <p className="mt-4 text-lg text-gray-700 leading-8">
            Throughout her career, Dr. Farri has held several prominent leadership roles in pediatric
            respiratory care across premier healthcare institutions in the New York metro area.
          </p>
        </div>
        <div className="space-y-4">
          {roles.map((role, i) => (
            <div key={i} className="site-surface-muted rounded-2xl p-5 border-l-4 border-primary">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{role.title}</p>
              <p className="mt-1 text-base font-bold text-secondary">{role.org}</p>
              {role.employer && <p className="text-sm text-gray-500 mt-0.5">{role.employer}</p>}
              <p className="mt-3 text-sm text-gray-700 leading-7">{role.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card rounded-[2rem] overflow-hidden shadow-lg">
        <div className="relative h-[360px] w-full lg:h-full lg:min-h-[420px]">
          <Image
            src="/images/Dr Farri_blazer.jpeg"
            alt="Dr. Farri"
            fill
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

const affiliations = [
  "Fellow of the American Academy of Pediatrics",
  "American Thoracic Society",
  "New Jersey Chapter — American Academy of Pediatrics",
  "American Academy of Asthma, Allergy & Immunology",
  "Board Member — Asthma & Allergy Foundation of America",
];

function AwardsTab() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,0.6fr] lg:items-start">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">Recognition</p>
          <h3 className="mt-3 text-2xl sm:text-3xl font-black text-secondary tracking-tight">
            Awards &amp; Professional Recognition
          </h3>
          <p className="mt-4 text-lg text-gray-700 leading-8">
            Dr. Farri is highly regarded by her peers and the broader medical community, with continued
            leadership in respiratory advocacy, education, and research.
          </p>
        </div>
        <div>
          <p className="text-sm font-black text-secondary mb-4">Professional Affiliations</p>
          <ul className="space-y-3">
            {affiliations.map((a) => (
              <li key={a} className="flex items-start gap-3 site-surface-muted rounded-xl px-4 py-3">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <span className="text-gray-700">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-4">
        <div className="site-dark-panel rounded-[2rem] p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Faculty Award</p>
          <p className="mt-4 text-xl font-black leading-snug">Best Faculty Award</p>
          <p className="mt-3 text-white/80 leading-7 text-sm">
            Awarded by the RWJ Barnabas Department of Pediatrics in both{" "}
            <span className="text-primary font-black">2021</span> and{" "}
            <span className="text-primary font-black">2022</span> — a meaningful reflection of the
            respect she has earned as both a clinician and mentor.
          </p>
        </div>
        <div className="site-surface-muted rounded-[2rem] p-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Standing</p>
          <p className="text-base font-bold text-secondary leading-snug">
            Respected clinician, educator, advisor, and advocate in pediatric respiratory care.
          </p>
          <p className="mt-3 text-sm text-gray-600 leading-7">
            Her dedication to academic medicine and trainee development continues to shape the next
            generation of pediatric pulmonologists.
          </p>
        </div>
      </div>
    </div>
  );
}

const communityItems = [
  { label: "Local Volunteer",  detail: "Bethany Community Center, Washington Township, NJ" },
  { label: "Special Olympics", detail: "Special Olympics of New Jersey" },
  { label: "International",    detail: "International medical missions" },
  { label: "Health Systems",   detail: "Asthma quality improvement across healthcare systems" },
];

function BeyondTab() {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-primary">Community</p>
          <h3 className="mt-3 text-2xl sm:text-3xl font-black text-secondary tracking-tight">
            Beyond the Clinic
          </h3>
        </div>
        <p className="text-lg text-gray-700 leading-8">
          Dr. Farri believes deeply in community health and meaningful engagement beyond the exam room.
          In addition to treating patients and helping scale asthma quality improvement efforts across
          healthcare systems, she volunteers her time locally with the Bethany Community Center in
          Washington Township and the Special Olympics of New Jersey.
        </p>
        <p className="text-lg text-gray-700 leading-8">
          Her commitment to service also extends internationally through medical missions. That same
          spirit of outreach, compassion, and advocacy shapes the way she cares for families at CLAPS
          MD every day.
        </p>
      </div>
      <div className="space-y-4">
        {communityItems.map((item) => (
          <div key={item.label} className="site-surface-muted rounded-2xl p-5 border-l-4 border-primary">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{item.label}</p>
            <p className="mt-1 text-base text-secondary leading-snug">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DrFarriTabs() {
  const [activeTab, setActiveTab] = useState("bio");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(0,61,91,0.98)_0%,rgba(8,79,101,0.94)_46%,rgba(255,255,255,0)_46%)] px-4 pb-4 pt-10 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:px-6 sm:pb-6 lg:px-8 lg:pt-12">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(148,209,44,0.16),transparent_38%)]" />

        <div className="relative">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center text-white">
            <span className="inline-flex rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-secondary shadow-sm">
              Meet Dr. Farri
            </span>
            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Dr. Folashade Farri, MD, MPH
            </h2>
            <p className="mt-4 text-white/70 text-base sm:text-lg">
              Pediatric Pulmonologist &middot; Children&apos;s Lung, Asthma &amp; Pulmonary Specialists
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-10 overflow-x-auto pb-2">
            <div className="mx-auto flex min-w-max justify-center gap-2 sm:gap-3">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 rounded-t-[1.75rem] px-4 py-4 text-sm font-black tracking-tight transition-all sm:min-w-[148px] sm:px-6 ${
                      isActive
                        ? "bg-white text-secondary shadow-[0_-6px_18px_rgba(255,255,255,0.12)]"
                        : "bg-white/[0.08] text-white/85 hover:bg-white/[0.14] hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-xs">{tab.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content panel */}
          <article className="site-surface relative rounded-[2.2rem] p-6 sm:p-8 lg:p-10">
            {activeTab === "bio"        && <BioTab />}
            {activeTab === "education"  && <EducationTab />}
            {activeTab === "experience" && <ExperienceTab />}
            {activeTab === "awards"     && <AwardsTab />}
            {activeTab === "beyond"     && <BeyondTab />}
          </article>
        </div>
      </div>
    </section>
  );
}
