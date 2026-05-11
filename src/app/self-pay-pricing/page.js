"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Download, FileText, LogIn, Phone, ShieldCheck } from "lucide-react";
import { PATIENT_PORTAL_URL } from "@/lib/billingContent";
import { getPublicDocuments, getVisibleSelfPayPricing } from "@/lib/authClient";

const SELF_PAY_AGREEMENT_DOCUMENT_TYPE = "self_pay_agreement_doc";

function getPricingItems(payload) {
  if (Array.isArray(payload?.pricing_items)) return payload.pricing_items;
  if (Array.isArray(payload?.pricing)) return payload.pricing;
  if (Array.isArray(payload?.prices)) return payload.prices;
  if (Array.isArray(payload?.selfPayPricing)) return payload.selfPayPricing;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function formatAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return String(value || "");
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function normalizePricingItem(item) {
  return {
    id: item?.id,
    label: String(
      item?.pricing_item ||
        item?.label ||
        item?.item_name ||
        item?.service_name ||
        item?.category ||
        item?.name ||
        "",
    ),
    amount: formatAmount(item?.amount || item?.price || item?.rate || ""),
    display_order: Number(item?.display_order ?? item?.sort_order ?? item?.id ?? 0),
    visibility_status: item?.visibility_status ?? item?.is_active ?? true,
  };
}

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
  const [managedRows, setManagedRows] = useState([]);
  const [pricingLoaded, setPricingLoaded] = useState(false);
  const [pricingError, setPricingError] = useState("");
  const [publicDocuments, setPublicDocuments] = useState([]);
  const [documentsLoaded, setDocumentsLoaded] = useState(false);
  const [documentsError, setDocumentsError] = useState("");
  const selfPayAgreementDocument = getDocumentByType(
    publicDocuments,
    SELF_PAY_AGREEMENT_DOCUMENT_TYPE,
  );

  useEffect(() => {
    let active = true;

    async function loadManagedPricing() {
      try {
        setPricingError("");
        const response = await getVisibleSelfPayPricing();
        if (!active) return;
        const visibleRows = getPricingItems(response)
          .map(normalizePricingItem)
          .filter((item) => item.label && item.visibility_status)
          .sort((left, right) => left.display_order - right.display_order);
        setManagedRows(visibleRows);
      } catch (requestError) {
        if (active) setManagedRows([]);
        if (active) {
          setPricingError(requestError?.message || "Unable to load self-pay pricing right now.");
        }
      } finally {
        if (active) setPricingLoaded(true);
      }
    }

    loadManagedPricing();

    return () => {
      active = false;
    };
  }, []);

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
                {/* <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">
                  Self Pay Pricing
                </p> */}
                <h1 className="mt-4 text-4xl sm:text-5xl font-black text-secondary tracking-tight leading-tight">
                  Self-Pay Fee Schedule for Visits and Testing
                </h1>
                <p className="mt-6 text-lg text-gray-700 leading-8 max-w-3xl">
                  Our self-pay options are available for patients without insurance or those who
                  choose not to bill insurance. Please review the pricing information first, then
                  review the Self-Pay Agreement if you decide to proceed with booking.
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
                    <p>First review the self-pay pricing information on this page.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <p>If you decide to proceed with booking, review the separate Self-Pay Agreement document below.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="site-surface rounded-[2rem] p-6 sm:p-8 lg:p-10">
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
                  Rates are provided for transparency and should be confirmed with the office at
                  the time of scheduling or check-in.
                </p>
              </div>

              <div className="site-surface-muted rounded-2xl px-4 py-3 text-sm font-medium text-slate-600">
                Rates are subject to confirmation at the time of visit.
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/80 shadow-sm">
              <table className="min-w-full text-sm sm:text-base">
                <thead className="bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.96))]">
                  <tr>
                    <th className="px-5 py-4 text-left font-black text-secondary">Category</th>
                    <th className="px-5 py-4 text-left font-black text-secondary">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white/95">
                  {!pricingLoaded ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-gray-500" colSpan={2}>
                        Loading self-pay pricing...
                      </td>
                    </tr>
                  ) : null}

                  {pricingLoaded && pricingError ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-gray-500" colSpan={2}>
                        {pricingError}
                      </td>
                    </tr>
                  ) : null}

                  {pricingLoaded && !pricingError && managedRows.length === 0 ? (
                    <tr>
                      <td className="px-5 py-8 text-center text-gray-500" colSpan={2}>
                        No self-pay pricing is available right now.
                      </td>
                    </tr>
                  ) : null}

                  {pricingLoaded && !pricingError
                    ? managedRows.map((row) => (
                        <tr key={row.id ?? row.label} className="transition-colors hover:bg-slate-50/80">
                          <td className="px-5 py-4 text-gray-700">{row.label}</td>
                          <td className="px-5 py-4 font-black text-secondary">{row.amount}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="site-surface-muted rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-secondary">
                    <FileText className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    {/* <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                      Document 1
                    </p> */}
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-secondary">
                      Self-Pay Pricing Information
                    </h3>
                    <p className="mt-3 leading-7 text-gray-700">
                      Review the current self-pay fee schedule above before deciding whether to
                      proceed with booking an appointment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="site-surface-muted rounded-3xl p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-secondary">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    {/* <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                      Document 2
                    </p> */}
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
