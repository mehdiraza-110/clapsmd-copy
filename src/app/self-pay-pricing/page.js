"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Download, FileText, LogIn, Phone, ShieldCheck } from "lucide-react";
import { PATIENT_PORTAL_URL } from "@/lib/billingContent";
import { getPublicDocuments } from "@/lib/authClient";

const SELF_PAY_AGREEMENT_DOCUMENT_TYPE = "self_pay_agreement_doc";
const SELF_PAY_PRICING_DOCUMENT_TYPE = "self_pay_pricing_doc";

function getDocumentsList(payload) {
  if (Array.isArray(payload?.documents)) return payload.documents;
  return [];
}

function getDocumentByType(documents, documentType) {
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

export default function SelfPayPricingPage() {
  const [publicDocuments, setPublicDocuments] = useState([]);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);
  const [documentsError, setDocumentsError] = useState("");

  const selfPayPricingDocument = getDocumentByType(publicDocuments, SELF_PAY_PRICING_DOCUMENT_TYPE);
  const selfPayAgreementDocument = getDocumentByType(publicDocuments, SELF_PAY_AGREEMENT_DOCUMENT_TYPE);

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
        <section className="relative overflow-hidden border-b border-slate-100/80">
          <div className="absolute -left-10 top-0 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute right-0 top-10 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-stretch">
              <div className="site-surface flex h-full flex-col rounded-[2.25rem] p-8 sm:p-10">
                <h1 className="mt-4 text-4xl sm:text-5xl font-black text-secondary tracking-tight leading-tight">
                  Self-Pay Fee Schedule for Visits and Testing
                </h1>
                <p className="mt-6 text-lg text-gray-700 leading-8 max-w-3xl">
                  Our self-pay options are available for patients without insurance or those who
                  choose not to bill insurance. Download the fee schedule to review current pricing,
                  then download the Self-Pay Agreement if you decide to proceed with booking.
                </p>
                <div className="mt-auto flex flex-wrap gap-4 pt-8">
                  <a
                    href="tel:9739490270"
                    className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 font-medium text-secondary hover:bg-white transition-colors"
                  >
                    <Phone className="mr-2 h-5 w-5 text-primary" />
                    Confirm Pricing by Phone
                  </a>
                  <a
                    href={PATIENT_PORTAL_URL}
                    className="btn-primary inline-flex items-center justify-center"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Go to Patient Portal
                  </a>
                </div>
              </div>

              <div className="site-dark-panel h-full rounded-3xl p-6 sm:p-8 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-black tracking-tight">Self-Pay Review Steps</h2>
                </div>
                <div className="mt-5 space-y-4 text-white/85 leading-7">
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <p>Download and review the self-pay fee schedule to see current pricing.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <p>If you decide to proceed with booking, download and review the Self-Pay Agreement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="site-surface rounded-[2rem] p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="site-surface-muted rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-secondary">
                    <FileText className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-secondary">
                      Self-Pay Fee Schedule
                    </h3>
                    <p className="mt-3 leading-7 text-gray-700">
                      Download the current self-pay fee schedule to review pricing for visits and
                      testing before deciding to book an appointment.
                    </p>
                    {!documentsLoaded ? (
                      <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading fee schedule...
                      </p>
                    ) : null}
                    {documentsLoaded && documentsError ? (
                      <p className="mt-4 text-sm font-medium text-gray-500">
                        {documentsError}
                      </p>
                    ) : null}
                    {documentsLoaded && !documentsError && selfPayPricingDocument ? (
                      <a
                        href={selfPayPricingDocument.document_url}
                        download={getDocumentFileName(selfPayPricingDocument)}
                        className="mt-5 inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-secondary transition-colors hover:bg-slate-50"
                      >
                        <Download className="mr-2 h-4 w-4 text-primary" />
                        Download Fee Schedule
                      </a>
                    ) : null}
                    {documentsLoaded && !documentsError && !selfPayPricingDocument ? (
                      <p className="mt-4 text-sm font-medium text-gray-500">
                        The fee schedule is not available right now. Please call us to confirm pricing.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="site-surface-muted rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-secondary">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-secondary">
                      Self-Pay Agreement
                    </h3>
                    <p className="mt-3 leading-7 text-gray-700">
                      After reviewing pricing, patients who want to proceed may download and review
                      the separate Self-Pay Agreement.
                    </p>
                    {!documentsLoaded ? (
                      <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading agreement document...
                      </p>
                    ) : null}
                    {documentsLoaded && documentsError ? (
                      <p className="mt-4 text-sm font-medium text-gray-500">
                        {documentsError}
                      </p>
                    ) : null}
                    {documentsLoaded && !documentsError && selfPayAgreementDocument ? (
                      <a
                        href={selfPayAgreementDocument.document_url}
                        download={getDocumentFileName(selfPayAgreementDocument)}
                        className="mt-5 inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-secondary transition-colors hover:bg-slate-50"
                      >
                        <Download className="mr-2 h-4 w-4 text-primary" />
                        Download Agreement
                      </a>
                    ) : null}
                    {documentsLoaded && !documentsError && !selfPayAgreementDocument ? (
                      <p className="mt-4 text-sm font-medium text-gray-500">
                        The Self-Pay Agreement is not available right now.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
