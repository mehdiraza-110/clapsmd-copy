"use client";

import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  deleteBlog,
  getBlogs,
  getToken,
  isAuthError,
  updateBlogStatus,
} from "@/lib/authClient";
import CircularLoader from "@/components/CircularLoader";

const STATUS_OPTIONS = ["draft", "published", "scheduled", "archived"];

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
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function toIsoFromLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
}

function buildStatusClasses(status) {
  if (status === "published") return "bg-primary/15 text-secondary";
  if (status === "archived") return "bg-slate-200 text-slate-700";
  return "bg-amber-100 text-amber-700";
}

export default function BlogsClient() {
  const router = useRouter();
  const token = getToken();

  const [blogs, setBlogs] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [pendingScheduleTimes, setPendingScheduleTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredBlogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return blogs.filter((blog) => {
      const currentStatus = (blog.status || "").toLowerCase();
      const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;
      if (!matchesStatus) return false;

      if (!normalizedQuery) return true;
      return (
        String(blog.id).toLowerCase().includes(normalizedQuery) ||
        (blog.title || "").toLowerCase().includes(normalizedQuery) ||
        (blog.slug || "").toLowerCase().includes(normalizedQuery) ||
        (blog.meta_description || "").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [blogs, query, statusFilter]);

  const handleAuthFailure = () => {
    clearSession();
    router.replace("/admin/login");
  };

  const loadBlogs = async () => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await getBlogs(token);
      const nextBlogs = Array.isArray(response?.blogs) ? response.blogs : [];
      setBlogs(nextBlogs);
      setPendingStatuses(
        nextBlogs.reduce((accumulator, blog) => {
          accumulator[blog.id] = blog.status || "draft";
          return accumulator;
        }, {}),
      );
      setPendingScheduleTimes(
        nextBlogs.reduce((accumulator, blog) => {
          accumulator[blog.id] = toDatetimeLocalValue(blog.scheduled_publish_time);
          return accumulator;
        }, {}),
      );
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusSelection = (id, value) => {
    setPendingStatuses((previous) => ({
      ...previous,
      [id]: value,
    }));
  };

  const handleScheduleTimeChange = (id, value) => {
    setPendingScheduleTimes((previous) => ({
      ...previous,
      [id]: value,
    }));
  };

  const handleStatusUpdate = async (blog, nextStatus, scheduleValue = "") => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    const payload = { status: nextStatus };
    if (nextStatus === "scheduled") {
      const scheduledPublishTime = toIsoFromLocal(scheduleValue);
      if (!scheduledPublishTime) {
        setError("Scheduled publish time is required when status is scheduled.");
        return;
      }
      payload.scheduled_publish_time = scheduledPublishTime;
    }

    setStatusUpdatingId(blog.id);
    setError("");
    try {
      const response = await updateBlogStatus(token, blog.id, payload);
      const updated = response?.blog;
      if (updated) {
        setBlogs((previous) =>
          previous.map((item) => (item.id === blog.id ? updated : item)),
        );
        setPendingStatuses((previous) => ({
          ...previous,
          [blog.id]: updated.status || nextStatus,
        }));
        setPendingScheduleTimes((previous) => ({
          ...previous,
          [blog.id]: toDatetimeLocalValue(updated.scheduled_publish_time),
        }));
      } else {
        await loadBlogs();
      }
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to update blog status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDelete = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}"?`)) return;

    if (!token) {
      handleAuthFailure();
      return;
    }

    setDeletingId(blog.id);
    setError("");
    try {
      await deleteBlog(token, blog.id);
      setBlogs((previous) => previous.filter((item) => item.id !== blog.id));
      setPendingStatuses((previous) => {
        const next = { ...previous };
        delete next[blog.id];
        return next;
      });
      setPendingScheduleTimes((previous) => {
        const next = { ...previous };
        delete next[blog.id];
        return next;
      });
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
              Blogs
            </h1>
            <p className="text-gray-600 mt-2">
              Manage blog content, publishing status, and featured images.
            </p>
          </div>

          <Link
            href="/admin/blogs/new"
            className="btn-primary inline-flex items-center justify-center whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Blog
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <h2 className="text-2xl font-black text-secondary tracking-tight">Existing Blogs</h2>
          <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, slug, or description"
                className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
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
                <th className="px-4 py-3 font-bold text-secondary">Post</th>
                <th className="px-4 py-3 font-bold text-secondary">Slug</th>
                <th className="px-4 py-3 font-bold text-secondary">Status</th>
                <th className="px-4 py-3 font-bold text-secondary">Update Status</th>
                <th className="px-4 py-3 font-bold text-secondary">Publish / Schedule Time</th>
                <th className="px-4 py-3 font-bold text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    <CircularLoader label="Loading blogs..." />
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    No blogs found.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => {
                  const selectedStatus = pendingStatuses[blog.id] || blog.status || "draft";
                  const pendingScheduleTime =
                    pendingScheduleTimes[blog.id] || toDatetimeLocalValue(blog.scheduled_publish_time);
                  return (
                    <tr key={blog.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                            {blog.featured_image ? (
                              <img
                                src={blog.featured_image}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-100" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-secondary leading-tight">{blog.title}</p>
                            <p className="text-gray-500 mt-1 line-clamp-2">
                              {blog.meta_description || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-medium">{blog.slug}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-bold ${buildStatusClasses(
                            blog.status,
                          )}`}
                        >
                          {blog.status || "draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-40">
                          <select
                            value={selectedStatus}
                            onChange={(event) => {
                              const nextStatus = event.target.value;
                              handleStatusSelection(blog.id, nextStatus);
                              if (nextStatus === "scheduled") {
                                const nextScheduleValue =
                                  pendingScheduleTime || toDatetimeLocalValue(blog.scheduled_publish_time);
                                if (nextScheduleValue) {
                                  handleStatusUpdate(blog, nextStatus, nextScheduleValue);
                                } else {
                                  setError(
                                    "Choose a scheduled publish time to move a blog into scheduled status.",
                                  );
                                }
                                return;
                              }

                              handleStatusUpdate(blog, nextStatus);
                            }}
                            disabled={statusUpdatingId === blog.id}
                            className="h-9 w-full px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-52 space-y-2">
                          {selectedStatus === "scheduled" ? (
                            <input
                              type="datetime-local"
                              value={pendingScheduleTime}
                              onChange={(event) => {
                                const nextValue = event.target.value;
                                handleScheduleTimeChange(blog.id, nextValue);
                                if (nextValue) {
                                  handleStatusUpdate(blog, "scheduled", nextValue);
                                }
                              }}
                              disabled={statusUpdatingId === blog.id}
                              className="h-9 w-full px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          ) : (
                            <p className="text-gray-600">
                              {blog.publish_time
                                ? formatDateTime(blog.publish_time)
                                : blog.scheduled_publish_time
                                  ? formatDateTime(blog.scheduled_publish_time)
                                  : "-"}
                            </p>
                          )}
                          {blog.status === "scheduled" && blog.scheduled_publish_time ? (
                            <p className="text-xs text-gray-500">
                              Scheduled for {formatDateTime(blog.scheduled_publish_time)}
                            </p>
                          ) : null}
                          {blog.status === "published" && blog.publish_time ? (
                            <p className="text-xs text-gray-500">
                              Published at {formatDateTime(blog.publish_time)}
                            </p>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className="sr-only"
                            aria-live="polite"
                          >
                            {statusUpdatingId === blog.id ? "Saving status" : ""}
                          </span>
                          <Link
                            href={`/admin/blogs/${blog.id}`}
                            className="w-8 h-8 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                            aria-label={`Edit ${blog.title}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(blog)}
                            disabled={deletingId === blog.id}
                            className="w-8 h-8 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 disabled:opacity-50 flex items-center justify-center"
                            aria-label={`Delete ${blog.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
