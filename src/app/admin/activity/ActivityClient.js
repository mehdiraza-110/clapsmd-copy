"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  getActivityLogs,
  getToken,
  isAuthError,
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

const statusStyles = {
  Success: "bg-primary/15 text-secondary",
  Failed: "bg-red-100 text-red-700",
};

export default function ActivityClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 20,
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      clearSession();
      router.replace("/admin/login");
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getActivityLogs(token, { page, pageSize: 20 });
        if (!active) return;
        setLogs(Array.isArray(response?.logs) ? response.logs : []);
        setPagination(
          response?.pagination || {
            total: 0,
            totalPages: 1,
            currentPage: 1,
            pageSize: 20,
          },
        );
      } catch (requestError) {
        if (!active) return;
        if (isAuthError(requestError)) {
          clearSession();
          router.replace("/admin/login");
          return;
        }
        setError(requestError?.message || "Failed to load activity logs");
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [page, router]);

  const filteredLogs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return logs;
    return logs.filter((log) => {
      return (
        String(log.id).toLowerCase().includes(normalized) ||
        (log.action || "").toLowerCase().includes(normalized) ||
        (log.actor || "").toLowerCase().includes(normalized) ||
        (log.endpoint || "").toLowerCase().includes(normalized) ||
        (log.http_method || "").toLowerCase().includes(normalized)
      );
    });
  }, [logs, query]);

  return (
    <section>
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
              Recent Activity
            </h1>
            <p className="text-gray-600 mt-2">
              Live activity logs from the backend audit trail.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <label className="text-sm font-semibold text-secondary">Search Activity</label>
          <div className="mt-2 relative max-w-xl">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by action, actor, method, endpoint, or ID"
              className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3 font-bold text-secondary">ID</th>
                <th className="px-4 py-3 font-bold text-secondary">Action</th>
                <th className="px-4 py-3 font-bold text-secondary">Actor</th>
                <th className="px-4 py-3 font-bold text-secondary">Method</th>
                <th className="px-4 py-3 font-bold text-secondary">Endpoint</th>
                <th className="px-4 py-3 font-bold text-secondary">Status Code</th>
                <th className="px-4 py-3 font-bold text-secondary">Result</th>
                <th className="px-4 py-3 font-bold text-secondary">Performed At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={8}>
                    <CircularLoader label="Loading activity logs..." />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-4 py-8 text-center text-red-600 font-semibold" colSpan={8}>
                    {error}
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={8}>
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const resultLabel = log.is_successful ? "Success" : "Failed";
                  return (
                    <tr key={log.id}>
                      <td className="px-4 py-3 text-gray-700 font-medium">{log.id}</td>
                      <td className="px-4 py-3 text-gray-700">{log.action || "-"}</td>
                      <td className="px-4 py-3 text-gray-700">{log.actor || "-"}</td>
                      <td className="px-4 py-3 text-gray-700">{log.http_method || "-"}</td>
                      <td className="px-4 py-3 text-gray-700">{log.endpoint || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">{log.status_code ?? "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                            statusStyles[resultLabel]
                          }`}
                        >
                          {resultLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDateTime(log.performed_at)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-gray-600">
            Total: {pagination.total} logs · Page {pagination.currentPage} of{" "}
            {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              disabled={page <= 1 || loading}
              className="px-3 py-2 rounded-lg border border-gray-200 text-secondary font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((previous) => previous + 1)}
              disabled={page >= pagination.totalPages || loading}
              className="px-3 py-2 rounded-lg border border-gray-200 text-secondary font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
