"use client";

import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementById,
  getAnnouncements,
  getToken,
  isAuthError,
  updateAnnouncement,
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

function toDatetimeLocalValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  const local = new Date(date.getTime() - offsetMs);
  return local.toISOString().slice(0, 16);
}

function toIsoFromLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

const statusStyles = {
  publish: "bg-primary/15 text-secondary",
  scheduled: "bg-blue-100 text-blue-700",
};

export default function NoticesClient() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    title: "",
    message: "",
    status: "published",
    scheduled_time: "",
  });

  const token = getToken();

  const filteredAnnouncements = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return announcements.filter((item) => {
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      if (!statusMatch) return false;

      if (!normalized) return true;
      return (
        String(item.id).toLowerCase().includes(normalized) ||
        (item.title || "").toLowerCase().includes(normalized) ||
        (item.message || "").toLowerCase().includes(normalized)
      );
    });
  }, [announcements, query, statusFilter]);

  const handleAuthFailure = () => {
    clearSession();
    router.replace("/admin/login");
  };

  const loadAnnouncements = async () => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await getAnnouncements(token);
      setAnnouncements(Array.isArray(response?.announcements) ? response.announcements : []);
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      message: "",
      status: "published",
      scheduled_time: "",
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

  const handleFormChange = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const buildPayload = () => {
    const payload = {
      title: form.title.trim(),
      message: form.message.trim(),
      status: form.status,
    };

    if (payload.status === "scheduled") {
      payload.scheduled_time = toIsoFromLocal(form.scheduled_time);
    }

    return payload;
  };

  const validatePayload = (payload) => {
    if (!payload.title) return "Title is required.";
    if (!payload.message) return "Message is required.";
    if (!payload.status) return "Status is required.";
    if (!["published", "scheduled"].includes(payload.status)) {
      return "Status must be either published or scheduled.";
    }

    if (payload.status === "scheduled" && !payload.scheduled_time) {
      return "Scheduled time is required when status is Schedule.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!token) {
      handleAuthFailure();
      return;
    }

    const payload = buildPayload();
    const validationError = validatePayload(payload);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        const response = await updateAnnouncement(token, editingId, payload);
        setAnnouncements((previous) =>
          previous.map((item) =>
            item.id === editingId ? response?.announcement || item : item,
          ),
        );
      } else {
        const response = await createAnnouncement(token, payload);
        const created = response?.announcement;
        if (created) {
          setAnnouncements((previous) => [created, ...previous]);
        } else {
          await loadAnnouncements();
        }
      }

      closeModal();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setFormError(requestError?.message || "Failed to save announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (announcement) => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    setFormError("");
    setEditingId(announcement.id);
    setModalOpen(true);

    try {
      const response = await getAnnouncementById(token, announcement.id);
      const target = response?.announcement || announcement;
      setForm({
        title: target.title || "",
        message: target.message || "",
        status: target.status || "published",
        scheduled_time: toDatetimeLocalValue(target.scheduled_time),
      });
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setForm({
        title: announcement.title || "",
        message: announcement.message || "",
        status: announcement.status || "published",
        scheduled_time: toDatetimeLocalValue(announcement.scheduled_time),
      });
      setFormError(requestError?.message || "Unable to refresh announcement details");
    }
  };

  const handleDelete = async (announcement) => {
    if (!window.confirm(`Delete "${announcement.title}"?`)) return;

    if (!token) {
      handleAuthFailure();
      return;
    }

    try {
      await deleteAnnouncement(token, announcement.id);
      setAnnouncements((previous) => previous.filter((item) => item.id !== announcement.id));
      if (editingId === announcement.id) closeModal();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to delete announcement");
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
              Announcements
            </h1>
            <p className="text-gray-600 mt-2">
              Publish now or schedule announcements for later publishing.
            </p>
          </div>
          <button
            type="button"
            className="btn-primary inline-flex items-center justify-center"
            onClick={openAddModal}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-2xl font-black text-secondary tracking-tight">Existing Announcements</h2>
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search announcements..."
                className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            >
              <option value="all">All</option>
              <option value="publish">Publish</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-bold text-secondary">Announcement</th>
                <th className="px-4 py-3 font-bold text-secondary">Status</th>
                <th className="px-4 py-3 font-bold text-secondary">Scheduled Time</th>
                <th className="px-4 py-3 font-bold text-secondary">Publish Time</th>
                <th className="px-4 py-3 font-bold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                    <CircularLoader label="Loading announcements..." />
                  </td>
                </tr>
              ) : filteredAnnouncements.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                    No announcements found.
                  </td>
                </tr>
              ) : (
                filteredAnnouncements.map((announcement) => (
                  <tr key={announcement.id}>
                    <td className="px-4 py-3">
                      <p className="font-bold text-secondary">{announcement.title}</p>
                      <p className="text-gray-500 mt-1 line-clamp-1">{announcement.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          statusStyles[announcement.status] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {announcement.status || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDateTime(announcement.scheduled_time)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDateTime(announcement.publish_time)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(announcement)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                          aria-label={`Edit ${announcement.title}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(announcement)}
                          className="w-8 h-8 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                          aria-label={`Delete ${announcement.title}`}
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
            aria-label="Close announcement modal overlay"
          />
          <div className="relative w-full max-w-3xl bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black text-secondary tracking-tight">
                {editingId ? "Update Announcement" : "Create Announcement"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                aria-label="Close announcement modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5" onSubmit={handleSubmit}>
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-secondary mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(event) => handleFormChange("title", event.target.value)}
                  placeholder="Enter announcement title"
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-secondary mb-2">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(event) => handleFormChange("message", event.target.value)}
                  placeholder="Write announcement details here..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(event) => handleFormChange("status", event.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                >
                  <option value="published">Publish now</option>
                  <option value="scheduled">Schedule</option>
                </select>
              </div>

              {form.status === "scheduled" ? (
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">Scheduled Time</label>
                  <input
                    type="datetime-local"
                    value={form.scheduled_time}
                    onChange={(event) => handleFormChange("scheduled_time", event.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
              ) : null}

              <div className="lg:col-span-2 flex flex-wrap gap-3 justify-end">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? "Saving..." : editingId ? "Update Announcement" : "Create Announcement"}
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
