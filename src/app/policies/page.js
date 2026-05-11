"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublicDocuments } from "@/lib/authClient";
import { policySections } from "@/lib/policySections";

const visiblePolicySections = policySections.filter(
  (section) =>
    section.title !== "Privacy Policy" &&
    section.title !== "Terms & Conditions" &&
    section.title !== "Website Disclaimer"
);

function getDocumentsList(payload) {
  if (Array.isArray(payload?.documents)) return payload.documents;
  return [];
}

function getDocumentByType(documents, documentType) {
  if (!documentType) return null;
  return (
    documents.find(
      (document) => document?.document_type === documentType && document?.document_url,
    ) || null
  );
}

function getDocumentFileName(document) {
  if (!document?.document_name && !document?.document_url) return "document";
  if (document?.document_name) return document.document_name;
  try {
    const path = new URL(document.document_url).pathname;
    return decodeURIComponent(path.split("/").filter(Boolean).pop() || "document");
  } catch (_error) {
    return document.document_url.split("/").filter(Boolean).pop() || "document";
  }
}

export default function PoliciesPage() {
  const [activePolicy, setActivePolicy] = useState(visiblePolicySections[0]?.title ?? "");
  const [publicDocuments, setPublicDocuments] = useState([]);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);
  const [documentsError, setDocumentsError] = useState("");
  const currentPolicy =
    visiblePolicySections.find((section) => section.title === activePolicy) ?? visiblePolicySections[0];
  const CurrentIcon = currentPolicy.icon;
  const currentDocument = getDocumentByType(publicDocuments, currentPolicy.document?.type);

  useEffect(() => {
    let active = true;

    async function loadPublicDocuments() {
      try {
        setDocumentsError("");
        const response = await getPublicDocuments();
        if (!active) return;
        setPublicDocuments(getDocumentsList(response));
      } catch (requestError) {
        if (active) {
          setPublicDocuments([]);
          setDocumentsError(requestError?.message || "Unable to load documents right now.");
        }
      } finally {
        if (active) setDocumentsLoaded(true);
      }
    }

    loadPublicDocuments();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Header />
      <main className="page-gradient-shell bg-slate-50">
        <section className="relative overflow-hidden border-b border-slate-200">
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr,0.85fr] gap-8 items-start">
              <div className="site-surface rounded-[2.25rem] p-8 sm:p-10">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Legal & Compliance
                </p>
                <h1 className="mt-4 text-4xl sm:text-5xl font-black text-secondary tracking-tight leading-tight">
                  Policies, Privacy, and Patient Information Practices
                </h1>
                <p className="mt-6 text-lg text-gray-700 leading-8 max-w-3xl">
                  CLAPS MD and the Pulmonary Function Testing Lab are committed to maintaining
                  high standards of patient privacy, regulatory compliance, and ethical medical
                  practice. This page outlines our policies regarding accessibility, HIPAA,
                  pricing, data use, and website usage.
                </p>
              </div>

              <div className="site-dark-panel rounded-3xl p-6 sm:p-8 text-white shadow-lg">
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
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(0,61,91,0.98)_0%,rgba(8,79,101,0.94)_56%,rgba(255,255,255,0)_56%)] px-4 pb-4 pt-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)] sm:px-6 sm:pb-6 lg:px-8 lg:pt-10">
            <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(148,209,44,0.16),transparent_36%)]" />
            <div className="relative">
              <div className="mx-auto max-w-3xl text-center text-white">
                <p className="inline-flex rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-secondary shadow-sm">
                  Policy Library
                </p>
                <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Explore CLAPS MD Policies and Patient Information Practices
                </h2>
              </div>

              <div className="mt-10">
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {visiblePolicySections.map((section) => {
                    const isActive = section.title === currentPolicy.title;
                    const TabIcon = section.icon;

                    return (
                      <button
                        key={section.title}
                        type="button"
                        onClick={() => setActivePolicy(section.title)}
                        className={`group flex min-h-[76px] items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all ${
                          isActive
                            ? "border-white bg-white text-secondary shadow-[0_18px_38px_rgba(15,23,42,0.18)]"
                            : "border-white/15 bg-white/8 text-white/90 hover:border-white/35 hover:bg-white/14"
                        }`}
                      >
                        <span
                          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                            isActive
                              ? "bg-primary/12 text-primary"
                              : "bg-white/10 text-primary group-hover:bg-white/15"
                          }`}
                        >
                          <TabIcon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 text-sm font-black leading-snug tracking-tight">
                          {section.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <article className="site-surface relative mt-8 rounded-[2.2rem] p-6 sm:p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[0.34fr,0.66fr] lg:items-start">
                  <div className="site-surface-muted rounded-[1.8rem] p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-secondary shadow-sm">
                      <CurrentIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-5 text-2xl font-black tracking-tight text-secondary">
                      {currentPolicy.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-gray-600">
                      Review the policy details below for current patient information, privacy, accessibility, pricing, and compliance practices.
                    </p>
                  </div>

                  <div className="site-surface-muted rounded-[1.8rem] p-6">
                    <div className="space-y-4 text-gray-700 leading-8">
                      {currentPolicy.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    {currentPolicy.bullets && (
                      <div className="site-surface mt-6 rounded-2xl p-5">
                        <p className="font-black text-secondary">{currentPolicy.bulletLabel}</p>
                        <ul className="mt-3 space-y-2 text-gray-700">
                          {currentPolicy.bullets.map((item) => (
                            <li key={item} className="flex gap-3">
                              <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentPolicy.secondaryBullets && (
                      <div className="site-surface mt-6 rounded-2xl p-5">
                        <p className="font-black text-secondary">{currentPolicy.secondaryBulletLabel}</p>
                        <ul className="mt-3 space-y-2 text-gray-700">
                          {currentPolicy.secondaryBullets.map((item) => (
                            <li key={item} className="flex gap-3">
                              <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentPolicy.document && (
                      <div className="site-surface mt-6 rounded-2xl p-5">
                        <p className="font-black text-secondary">Downloadable document</p>
                        {!documentsLoaded ? (
                          <p className="mt-2 text-sm leading-7 text-gray-600">
                            Loading document...
                          </p>
                        ) : null}
                        {documentsLoaded && documentsError ? (
                          <p className="mt-2 text-sm leading-7 text-gray-600">
                            {documentsError}
                          </p>
                        ) : null}
                        {documentsLoaded && !documentsError && currentDocument ? (
                          <>
                            <p className="mt-2 text-sm leading-7 text-gray-600">
                              {getDocumentFileName(currentDocument)}
                            </p>
                            <a
                              href={currentDocument.document_url}
                              download={getDocumentFileName(currentDocument)}
                              className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-sm font-black text-white transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                              <Download className="h-4 w-4" />
                              {currentPolicy.document.label}
                            </a>
                          </>
                        ) : null}
                        {documentsLoaded && !documentsError && !currentDocument ? (
                          <p className="mt-2 text-sm leading-7 text-gray-600">
                            This document is not available right now.
                          </p>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
