"use client";

import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  GripVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  createSelfPayPricing,
  deleteSelfPayPricing,
  getSelfPayPricing,
  getSelfPayPricingById,
  getToken,
  isAuthError,
  updateSelfPayPricing,
} from "@/lib/authClient";
import CircularLoader from "@/components/CircularLoader";

const PAGE_SIZE = 10;

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getPricingItems(payload) {
  if (Array.isArray(payload?.pricing_items)) return payload.pricing_items;
  if (Array.isArray(payload?.pricing)) return payload.pricing;
  if (Array.isArray(payload?.prices)) return payload.prices;
  if (Array.isArray(payload?.selfPayPricing)) return payload.selfPayPricing;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function getPricingItem(payload, fallback) {
  return (
    payload?.pricing_item ||
    payload?.pricing ||
    payload?.price ||
    payload?.selfPayPricing ||
    payload?.item ||
    fallback
  );
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

function normalizePricing(item) {
  return {
    ...item,
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
    amount: String(item?.amount || item?.price || item?.rate || ""),
    display_amount: formatAmount(item?.amount || item?.price || item?.rate || ""),
    notes: String(item?.notes || item?.description || ""),
    display_order: Number(item?.display_order ?? item?.sort_order ?? item?.id ?? 0),
    visibility_status: item?.visibility_status ?? item?.is_active ?? true,
    updated_at: item?.updated_at || item?.updatedAt || item?.modified_at || "",
  };
}

export default function SelfPayPricingCrudClient() {
  const router = useRouter();
  const token = getToken();
  const [pricingItems, setPricingItems] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    label: "",
    amount: "",
    display_order: "",
    notes: "",
    visibility_status: true,
  });

  const filteredPricingItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const sortedItems = [...pricingItems].sort((left, right) => {
      const orderDifference = Number(left.display_order || 0) - Number(right.display_order || 0);
      if (orderDifference !== 0) return orderDifference;
      return Number(left.id || 0) - Number(right.id || 0);
    });

    if (!normalizedQuery) return sortedItems;

    return sortedItems.filter((item) => {
      return (
        String(item.id).toLowerCase().includes(normalizedQuery) ||
        item.label.toLowerCase().includes(normalizedQuery) ||
        item.amount.toLowerCase().includes(normalizedQuery) ||
        item.display_amount.toLowerCase().includes(normalizedQuery) ||
        item.notes.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [pricingItems, query]);
  const totalPages = Math.max(1, Math.ceil(filteredPricingItems.length / PAGE_SIZE));
  const paginatedPricingItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredPricingItems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredPricingItems]);
  const paginationStart =
    filteredPricingItems.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const paginationEnd = Math.min(currentPage * PAGE_SIZE, filteredPricingItems.length);

  const handleAuthFailure = () => {
    clearSession();
    router.replace("/admin/login");
  };

  const loadPricing = async () => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getSelfPayPricing(token);
      setPricingItems(getPricingItems(response).map(normalizePricing));
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to load self-pay pricing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetForm = () => {
    setForm({
      label: "",
      amount: "",
      display_order: "",
      notes: "",
      visibility_status: true,
    });
    setEditingId(null);
    setFormError("");
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setForm((current) => ({
      ...current,
      display_order: String((pricingItems.length + 1) * 10),
    }));
    setModalOpen(true);
  };

  const handleChange = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const buildPayload = () => ({
    pricing_item: form.label.trim(),
    amount: form.amount === "" ? "" : Number(form.amount),
    display_order: form.display_order === "" ? 0 : Number(form.display_order),
    notes: form.notes.trim(),
    visibility_status: Boolean(form.visibility_status),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const payload = buildPayload();

    if (!payload.pricing_item) {
      setFormError("Pricing item name is required.");
      return;
    }

    if (payload.amount === "" || !Number.isFinite(payload.amount)) {
      setFormError("Amount is required.");
      return;
    }

    if (payload.amount < 0) {
      setFormError("Amount cannot be negative.");
      return;
    }

    if (!Number.isFinite(payload.display_order)) {
      setFormError("Display order must be a valid number.");
      return;
    }

    if (payload.display_order < 0 || !Number.isInteger(payload.display_order)) {
      setFormError("Display order must be a non-negative integer.");
      return;
    }

    if (!token) {
      handleAuthFailure();
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        const response = await updateSelfPayPricing(token, editingId, payload);
        const updated = normalizePricing(
          getPricingItem(response, {
            id: editingId,
            ...payload,
          }),
        );
        setPricingItems((previous) =>
          previous.map((item) => (String(item.id) === String(editingId) ? updated : item)),
        );
      } else {
        const response = await createSelfPayPricing(token, payload);
        const created = getPricingItem(response, null);
        if (created) {
          setPricingItems((previous) => [normalizePricing(created), ...previous]);
        } else {
          await loadPricing();
        }
      }

      closeModal();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setFormError(requestError?.message || "Failed to save self-pay pricing");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (item) => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    setFormError("");
    setEditingId(item.id);
    setModalOpen(true);

    try {
      const response = await getSelfPayPricingById(token, item.id);
      const target = normalizePricing(getPricingItem(response, item));
      setForm({
        label: target.label,
        amount: target.amount,
        display_order: String(target.display_order || ""),
        notes: target.notes,
        visibility_status: Boolean(target.visibility_status),
      });
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setForm({
        label: item.label,
        amount: item.amount,
        display_order: String(item.display_order || ""),
        notes: item.notes,
        visibility_status: Boolean(item.visibility_status),
      });
      setFormError(requestError?.message || "Unable to refresh pricing details");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.label}"?`)) return;
    if (!token) {
      handleAuthFailure();
      return;
    }

    try {
      await deleteSelfPayPricing(token, item.id);
      setPricingItems((previous) =>
        previous.filter((current) => String(current.id) !== String(item.id)),
      );
      if (editingId === item.id) closeModal();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to delete self-pay pricing");
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
              Self Pay Pricing
            </h1>
            <p className="text-gray-600 mt-2">
              Manage the fee schedule shown on the public self-pay pricing page.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary inline-flex items-center justify-center"
            onClick={openAddModal}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pricing Item
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-2xl font-black text-secondary tracking-tight">Existing Pricing</h2>
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pricing..."
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

        <p className="mt-6 mb-2 text-xs font-semibold text-gray-500 sm:hidden">
          Swipe horizontally to view the full table.
        </p>

        <div className="overflow-x-auto overscroll-x-contain rounded-2xl border border-gray-100 touch-pan-x">
          <table className="min-w-[980px] w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-bold text-secondary">Order</th>
                <th className="px-4 py-3 font-bold text-secondary">Item</th>
                <th className="px-4 py-3 font-bold text-secondary">Amount</th>
                <th className="px-4 py-3 font-bold text-secondary">Notes</th>
                <th className="px-4 py-3 font-bold text-secondary">Visibility</th>
                <th className="px-4 py-3 font-bold text-secondary">Updated</th>
                <th className="px-4 py-3 font-bold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                    <CircularLoader label="Loading self-pay pricing..." />
                  </td>
                </tr>
              ) : filteredPricingItems.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                    No pricing items found.
                  </td>
                </tr>
              ) : (
                paginatedPricingItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-gray-700">
                      <span className="inline-flex items-center gap-2 font-medium">
                        <GripVertical className="h-4 w-4 text-gray-300" />
                        {item.display_order}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{item.label}</td>
                    <td className="px-4 py-3 text-secondary font-black">{item.display_amount}</td>
                    <td className="px-4 py-3 text-gray-600">{item.notes || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.visibility_status
                            ? "bg-primary/15 text-secondary"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.visibility_status ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDateTime(item.updated_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                          aria-label={`Edit ${item.label}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                          aria-label={`Delete ${item.label}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredPricingItems.length > 0 ? (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-secondary">{paginationStart}</span> to{" "}
              <span className="font-semibold text-secondary">{paginationEnd}</span> of{" "}
              <span className="font-semibold text-secondary">{filteredPricingItems.length}</span>{" "}
              pricing items
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-secondary transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm font-semibold text-secondary transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/55"
            onClick={closeModal}
            aria-label="Close pricing modal overlay"
          />
          <div className="relative w-full max-w-2xl bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black text-secondary tracking-tight">
                {editingId ? "Update Pricing Item" : "Add Pricing Item"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                aria-label="Close pricing modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5" onSubmit={handleSubmit}>
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Pricing Item
                </label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(event) => handleChange("label", event.target.value)}
                  placeholder="Example: New Patient Visit"
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.amount}
                    onChange={(event) => handleChange("amount", event.target.value)}
                    placeholder="$150"
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.display_order}
                  onChange={(event) => handleChange("display_order", event.target.value)}
                  placeholder="10"
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(event) => handleChange("notes", event.target.value)}
                  placeholder="Optional internal or public note..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Visibility Status
                </label>
                <button
                  type="button"
                  onClick={() => handleChange("visibility_status", !form.visibility_status)}
                  className={`w-full rounded-2xl border px-4 py-4 transition-colors ${
                    form.visibility_status
                      ? "border-primary/40 bg-primary/10"
                      : "border-gray-200 bg-slate-50"
                  }`}
                  aria-pressed={form.visibility_status}
                >
                  <span className="flex items-center justify-between gap-4">
                    <span className="text-left">
                      <span className="block text-sm font-semibold text-secondary">
                        {form.visibility_status ? "Visible on site" : "Hidden from site"}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        Toggle to control whether this price appears publicly.
                      </span>
                    </span>
                    <span
                      className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${
                        form.visibility_status ? "bg-primary" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                          form.visibility_status ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </span>
                  </span>
                </button>
              </div>

              <div className="flex items-end ml-auto gap-3">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {submitting ? "Saving..." : editingId ? "Update" : "Submit"}
                </button>
              </div>

              {formError ? (
                <p className="lg:col-span-2 text-sm font-semibold text-red-600">{formError}</p>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
