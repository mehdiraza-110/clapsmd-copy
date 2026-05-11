"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileUp,
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
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  getDocumentTypes,
  getToken,
  isAuthError,
  updateDocument,
} from "@/lib/authClient";
import CircularLoader from "@/components/CircularLoader";

const PAGE_SIZE = 10;
const DEFAULT_DOCUMENT_TYPES = ["consent_doc", "coinsurance_doc", "self_pay_agreement_doc"];

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

function formatDocumentType(value) {
  return String(value || "")
    .replace(/_doc$/, "")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDocumentsList(payload) {
  if (Array.isArray(payload?.documents)) return payload.documents;
  if (Array.isArray(payload?.docs)) return payload.docs;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function getDocumentItem(payload, fallback) {
  return payload?.document || payload?.doc || payload?.item || fallback;
}

function normalizeDocument(item) {
  return {
    ...item,
    id: item?.id,
    document_name: String(item?.document_name || item?.name || item?.title || ""),
    document_type: String(item?.document_type || item?.type || ""),
    document_url: String(item?.document_url || item?.url || ""),
    notes: String(item?.notes || item?.description || ""),
    visibility_status: item?.visibility_status ?? item?.is_active ?? true,
    updated_at: item?.updated_at || item?.updatedAt || item?.modified_at || "",
    created_at: item?.created_at || item?.createdAt || "",
  };
}

function buildDocumentPayload(form, includeFile) {
  const hasFile = includeFile && form.document_file;
  const hasUrl = form.document_url.trim();

  if (hasFile) {
    const data = new FormData();
    data.append("document_name", form.document_name.trim());
    data.append("document_type", form.document_type);
    data.append("document_file", form.document_file);
    data.append("notes", form.notes.trim());
    data.append("visibility_status", String(Boolean(form.visibility_status)));
    return data;
  }

  const payload = {
    document_name: form.document_name.trim(),
    document_type: form.document_type,
    notes: form.notes.trim(),
    visibility_status: Boolean(form.visibility_status),
  };

  if (hasUrl) {
    payload.document_url = form.document_url.trim();
  }

  return payload;
}

export default function DocumentsClient() {
  const router = useRouter();
  const token = getToken();
  const [documents, setDocuments] = useState([]);
  const [documentTypes, setDocumentTypes] = useState(DEFAULT_DOCUMENT_TYPES);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    document_name: "",
    document_type: DEFAULT_DOCUMENT_TYPES[0],
    document_url: "",
    document_file: null,
    notes: "",
    visibility_status: true,
  });

  const filteredDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const sortedDocuments = [...documents].sort((left, right) => {
      const leftDate = new Date(left.updated_at || left.created_at || 0).getTime();
      const rightDate = new Date(right.updated_at || right.created_at || 0).getTime();
      return rightDate - leftDate;
    });

    return sortedDocuments.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        String(item.id).toLowerCase().includes(normalizedQuery) ||
        item.document_name.toLowerCase().includes(normalizedQuery) ||
        item.document_type.toLowerCase().includes(normalizedQuery) ||
        item.notes.toLowerCase().includes(normalizedQuery) ||
        item.document_url.toLowerCase().includes(normalizedQuery);
      const matchesType = !typeFilter || item.document_type === typeFilter;
      const matchesVisibility =
        visibilityFilter === "" || String(Boolean(item.visibility_status)) === visibilityFilter;

      return matchesQuery && matchesType && matchesVisibility;
    });
  }, [documents, query, typeFilter, visibilityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / PAGE_SIZE));
  const paginatedDocuments = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredDocuments.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredDocuments]);
  const paginationStart =
    filteredDocuments.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const paginationEnd = Math.min(currentPage * PAGE_SIZE, filteredDocuments.length);

  const handleAuthFailure = () => {
    clearSession();
    router.replace("/admin/login");
  };

  const loadDocumentTypes = async () => {
    try {
      const response = await getDocumentTypes(token);
      if (Array.isArray(response?.document_types) && response.document_types.length) {
        setDocumentTypes(response.document_types);
      }
    } catch (_requestError) {
      setDocumentTypes(DEFAULT_DOCUMENT_TYPES);
    }
  };

  const loadDocuments = async () => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getDocuments(token);
      setDocuments(getDocumentsList(response).map(normalizeDocument));
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocumentTypes();
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, typeFilter, visibilityFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetForm = () => {
    setForm({
      document_name: "",
      document_type: documentTypes[0] || DEFAULT_DOCUMENT_TYPES[0],
      document_url: "",
      document_file: null,
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
    setModalOpen(true);
  };

  const handleChange = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const validateForm = () => {
    if (!form.document_name.trim()) return "Document name is required.";
    if (!form.document_type) return "Document type is required.";
    if (!documentTypes.includes(form.document_type)) return "Choose a valid document type.";
    if (!editingId && !form.document_file && !form.document_url.trim()) {
      return "Create requires either a file upload or an existing URL.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    if (!token) {
      handleAuthFailure();
      return;
    }

    const payload = buildDocumentPayload(form, true);
    setSubmitting(true);

    try {
      if (editingId) {
        const response = await updateDocument(token, editingId, payload);
        const updated = normalizeDocument(
          getDocumentItem(response, {
            id: editingId,
            document_name: form.document_name,
            document_type: form.document_type,
            document_url: form.document_url,
            notes: form.notes,
            visibility_status: form.visibility_status,
          }),
        );
        setDocuments((previous) =>
          previous.map((item) => (String(item.id) === String(editingId) ? updated : item)),
        );
      } else {
        const response = await createDocument(token, payload);
        const created = getDocumentItem(response, null);
        if (created) {
          setDocuments((previous) => [normalizeDocument(created), ...previous]);
        } else {
          await loadDocuments();
        }
      }

      closeModal();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setFormError(requestError?.message || "Failed to save document");
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
      const response = await getDocumentById(token, item.id);
      const target = normalizeDocument(getDocumentItem(response, item));
      setForm({
        document_name: target.document_name,
        document_type: target.document_type || documentTypes[0] || DEFAULT_DOCUMENT_TYPES[0],
        document_url: target.document_url,
        document_file: null,
        notes: target.notes,
        visibility_status: Boolean(target.visibility_status),
      });
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setForm({
        document_name: item.document_name,
        document_type: item.document_type || documentTypes[0] || DEFAULT_DOCUMENT_TYPES[0],
        document_url: item.document_url,
        document_file: null,
        notes: item.notes,
        visibility_status: Boolean(item.visibility_status),
      });
      setFormError(requestError?.message || "Unable to refresh document details");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.document_name}"?`)) return;
    if (!token) {
      handleAuthFailure();
      return;
    }

    try {
      await deleteDocument(token, item.id);
      setDocuments((previous) =>
        previous.filter((current) => String(current.id) !== String(item.id)),
      );
      if (editingId === item.id) closeModal();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to delete document");
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
              Documents
            </h1>
            <p className="text-gray-600 mt-2">
              Manage consent, coinsurance, and self-pay agreement documents.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary inline-flex items-center justify-center"
            onClick={openAddModal}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <h2 className="text-2xl font-black text-secondary tracking-tight">Existing Documents</h2>
          <div className="grid w-full gap-3 sm:grid-cols-3 xl:max-w-4xl">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search documents..."
                className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            >
              <option value="">All document types</option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {formatDocumentType(type)}
                </option>
              ))}
            </select>
            <select
              value={visibilityFilter}
              onChange={(event) => setVisibilityFilter(event.target.value)}
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            >
              <option value="">All visibility</option>
              <option value="true">Visible</option>
              <option value="false">Hidden</option>
            </select>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

        <p className="mt-6 mb-2 text-xs font-semibold text-gray-500 sm:hidden">
          Swipe horizontally to view the full table.
        </p>

        <div className="overflow-x-auto overscroll-x-contain rounded-2xl border border-gray-100 touch-pan-x">
          <table className="min-w-[1120px] w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-bold text-secondary">Document</th>
                <th className="px-4 py-3 font-bold text-secondary">Type</th>
                <th className="px-4 py-3 font-bold text-secondary">URL</th>
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
                    <CircularLoader label="Loading documents..." />
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                    No documents found.
                  </td>
                </tr>
              ) : (
                paginatedDocuments.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-gray-700 font-medium">
                      {item.document_name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDocumentType(item.document_type)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.document_url ? (
                        <a
                          href={item.document_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex max-w-[220px] items-center gap-1 truncate font-semibold text-secondary hover:text-primary"
                        >
                          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{item.document_url}</span>
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
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
                        {item.document_url ? (
                          <a
                            href={item.document_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                            aria-label={`Open ${item.document_name}`}
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                          aria-label={`Edit ${item.document_name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                          aria-label={`Delete ${item.document_name}`}
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

        {!loading && filteredDocuments.length > 0 ? (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-secondary">{paginationStart}</span> to{" "}
              <span className="font-semibold text-secondary">{paginationEnd}</span> of{" "}
              <span className="font-semibold text-secondary">{filteredDocuments.length}</span>{" "}
              documents
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
            aria-label="Close document modal overlay"
          />
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black text-secondary tracking-tight">
                {editingId ? "Update Document" : "Add Document"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                aria-label="Close document modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5" onSubmit={handleSubmit}>
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  required
                  value={form.document_name}
                  onChange={(event) => handleChange("document_name", event.target.value)}
                  placeholder="Example: Consent Form"
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Document Type
                </label>
                <select
                  required
                  value={form.document_type}
                  onChange={(event) => handleChange("document_type", event.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                >
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatDocumentType(type)}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.visibility_status}
                  onChange={(event) => handleChange("visibility_status", event.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm font-semibold text-secondary">Visible on site</span>
              </label>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Upload File
                </label>
                <label className="flex min-h-[96px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-slate-50 px-4 py-5 text-center transition-colors hover:bg-slate-100">
                  <FileUp className="h-6 w-6 text-primary" />
                  <span className="mt-2 text-sm font-semibold text-secondary">
                    {form.document_file ? form.document_file.name : "Choose a document file"}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    Field name sent to API: document_file
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    onChange={(event) =>
                      handleChange("document_file", event.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Existing URL
                </label>
                <input
                  type="url"
                  value={form.document_url}
                  onChange={(event) => handleChange("document_url", event.target.value)}
                  placeholder="https://example.com/document.pdf"
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Uploading a file takes priority. On update, leave both file and URL unchanged to
                  keep the current document URL.
                </p>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-secondary mb-2">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(event) => handleChange("notes", event.target.value)}
                  rows={4}
                  placeholder="Optional internal notes"
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              {formError ? (
                <p className="lg:col-span-2 text-sm font-semibold text-red-600">{formError}</p>
              ) : null}

              <div className="lg:col-span-2 flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 font-semibold text-secondary hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary inline-flex items-center justify-center disabled:opacity-60"
                >
                  {submitting ? "Saving..." : editingId ? "Update Document" : "Create Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
