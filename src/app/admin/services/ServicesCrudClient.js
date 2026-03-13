"use client";

import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  createService,
  deleteService,
  getServiceById,
  getServices,
  getToken,
  isAuthError,
  updateService,
} from "@/lib/authClient";
import CircularLoader from "@/components/CircularLoader";

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

export default function ServicesCrudClient() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    service_name: "",
    service_description: "",
    visibility_status: true,
  });

  const token = getToken();

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return services;

    return services.filter((service) => {
      return (
        String(service.id).toLowerCase().includes(normalizedQuery) ||
        (service.service_name || "").toLowerCase().includes(normalizedQuery) ||
        (service.service_description || "").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query, services]);

  const handleAuthFailure = () => {
    clearSession();
    router.replace("/admin/login");
  };

  const loadServices = async () => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await getServices(token);
      setServices(Array.isArray(response?.services) ? response.services : []);
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({
      service_name: "",
      service_description: "",
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const payload = {
      service_name: form.service_name.trim(),
      service_description: form.service_description.trim(),
      visibility_status: Boolean(form.visibility_status),
    };

    if (!payload.service_name) {
      setFormError("Service name is required.");
      return;
    }

    if (!token) {
      handleAuthFailure();
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        const response = await updateService(token, editingId, payload);
        setServices((previous) =>
          previous.map((service) =>
            service.id === editingId ? response?.service || service : service,
          ),
        );
      } else {
        const response = await createService(token, payload);
        const created = response?.service;
        if (created) {
          setServices((previous) => [created, ...previous]);
        } else {
          await loadServices();
        }
      }

      closeModal();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setFormError(requestError?.message || "Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (service) => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    setFormError("");
    setEditingId(service.id);
    setModalOpen(true);

    try {
      const response = await getServiceById(token, service.id);
      const target = response?.service || service;
      setForm({
        service_name: target.service_name || "",
        service_description: target.service_description || "",
        visibility_status: Boolean(target.visibility_status),
      });
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setForm({
        service_name: service.service_name || "",
        service_description: service.service_description || "",
        visibility_status: Boolean(service.visibility_status),
      });
      setFormError(requestError?.message || "Unable to refresh service details");
    }
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete "${service.service_name}"?`)) return;
    if (!token) {
      handleAuthFailure();
      return;
    }

    try {
      await deleteService(token, service.id);
      setServices((previous) => previous.filter((item) => item.id !== service.id));
      if (editingId === service.id) closeModal();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to delete service");
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
              Services
            </h1>
            <p className="text-gray-600 mt-2">Manage services offered at C.L.A.P.S. MD.</p>
          </div>

          <button
            type="button"
            className="btn-primary inline-flex items-center justify-center"
            onClick={openAddModal}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-2xl font-black text-secondary tracking-tight">Existing Services</h2>
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search services..."
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

        <p className="mt-6 mb-2 text-xs font-semibold text-gray-500 sm:hidden">
          Swipe horizontally to view the full table.
        </p>

        <div className="overflow-x-auto overscroll-x-contain rounded-2xl border border-gray-100 touch-pan-x">
          <table className="min-w-[920px] w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-bold text-secondary">ID</th>
                <th className="px-4 py-3 font-bold text-secondary">Service Name</th>
                <th className="px-4 py-3 font-bold text-secondary">Description</th>
                <th className="px-4 py-3 font-bold text-secondary">Visibility</th>
                <th className="px-4 py-3 font-bold text-secondary">Updated</th>
                <th className="px-4 py-3 font-bold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    <CircularLoader label="Loading services..." />
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    No services found.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td className="px-4 py-3 text-gray-700 font-medium">{service.id}</td>
                    <td className="px-4 py-3 text-gray-700">{service.service_name}</td>
                    <td className="px-4 py-3 text-gray-600">{service.service_description || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          service.visibility_status
                            ? "bg-primary/15 text-secondary"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {service.visibility_status ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDateTime(service.updated_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(service)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                          aria-label={`Edit ${service.service_name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(service)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                          aria-label={`Delete ${service.service_name}`}
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
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/55"
            onClick={closeModal}
            aria-label="Close service modal overlay"
          />
          <div className="relative w-full max-w-2xl bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black text-secondary tracking-tight">
                {editingId ? "Update Service" : "Add Service"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                aria-label="Close service modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5" onSubmit={handleSubmit}>
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-secondary mb-2">Service Name</label>
                <input
                  type="text"
                  required
                  value={form.service_name}
                  onChange={(event) => handleChange("service_name", event.target.value)}
                  placeholder="Enter service name"
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-secondary mb-2">Description</label>
                <textarea
                  rows={4}
                  value={form.service_description}
                  onChange={(event) => handleChange("service_description", event.target.value)}
                  placeholder="Write service description (optional)..."
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
                        Toggle to control whether this service appears publicly.
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
