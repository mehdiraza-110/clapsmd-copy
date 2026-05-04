"use client";

import { Clock, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  bulkUpdateClinicHours,
  clearSession,
  getClinicHours,
  getToken,
  isAuthError,
} from "@/lib/authClient";
import CircularLoader from "@/components/CircularLoader";

const DEFAULT_DAYS = [
  { id: 1, day_of_week: "Monday",    day_order: 1, open_time: "9:00 AM", close_time: "4:00 PM", is_closed: false },
  { id: 2, day_of_week: "Tuesday",   day_order: 2, open_time: "9:00 AM", close_time: "4:00 PM", is_closed: false },
  { id: 3, day_of_week: "Wednesday", day_order: 3, open_time: null,      close_time: null,      is_closed: true  },
  { id: 4, day_of_week: "Thursday",  day_order: 4, open_time: "9:00 AM", close_time: "4:00 PM", is_closed: false },
  { id: 5, day_of_week: "Friday",    day_order: 5, open_time: "9:00 AM", close_time: "4:00 PM", is_closed: false },
  { id: 6, day_of_week: "Saturday",  day_order: 6, open_time: null,      close_time: null,      is_closed: true  },
  { id: 7, day_of_week: "Sunday",    day_order: 7, open_time: null,      close_time: null,      is_closed: true  },
];

export default function ClinicHoursClient() {
  const router = useRouter();
  const [rows, setRows] = useState(DEFAULT_DAYS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = getToken();

  const handleAuthFailure = () => {
    clearSession();
    router.replace("/admin/login");
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getClinicHours();
        const hours = Array.isArray(response?.clinic_hours) ? response.clinic_hours : [];
        if (hours.length > 0) {
          setRows(hours.slice().sort((a, b) => a.day_order - b.day_order));
        }
      } catch (err) {
        if (isAuthError(err)) {
          handleAuthFailure();
          return;
        }
        setError(err?.message || "Failed to load clinic hours.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        if (field === "is_closed" && value === true) {
          return { ...row, is_closed: true, open_time: null, close_time: null };
        }
        return { ...row, [field]: value };
      })
    );
  };

  const handleSave = async () => {
    setError("");
    setSuccess(false);

    for (const row of rows) {
      if (!row.is_closed && (!row.open_time?.trim() || !row.close_time?.trim())) {
        setError(`Please enter open and close times for ${row.day_of_week}, or mark it as closed.`);
        return;
      }
    }

    if (!token) {
      handleAuthFailure();
      return;
    }

    setSaving(true);
    try {
      const payload = rows.map(({ id, open_time, close_time, is_closed }) => ({
        id,
        open_time: is_closed ? null : open_time?.trim() || null,
        close_time: is_closed ? null : close_time?.trim() || null,
        is_closed,
      }));
      await bulkUpdateClinicHours(token, payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      if (isAuthError(err)) {
        handleAuthFailure();
        return;
      }
      setError(err?.message || "Failed to save clinic hours.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
              Clinic Hours
            </h1>
            <p className="text-gray-600 mt-2">
              Set the hours displayed on the public website footer.
            </p>
          </div>
          <button
            type="button"
            disabled={saving || loading}
            onClick={handleSave}
            className="btn-primary inline-flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        {error ? (
          <p className="mb-4 text-sm font-semibold text-red-600">{error}</p>
        ) : null}
        {success ? (
          <p className="mb-4 text-sm font-semibold text-green-600">
            Clinic hours saved successfully.
          </p>
        ) : null}

        {loading ? (
          <div className="py-16 flex justify-center">
            <CircularLoader label="Loading clinic hours..." />
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => (
              <div
                key={row.id}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border p-4 transition-colors ${
                  row.is_closed ? "border-gray-100 bg-slate-50" : "border-primary/20 bg-primary/5"
                }`}
              >
                <div className="flex items-center gap-3 w-36 flex-shrink-0">
                  <Clock className={`w-4 h-4 flex-shrink-0 ${row.is_closed ? "text-gray-400" : "text-primary"}`} />
                  <span className={`font-bold text-sm ${row.is_closed ? "text-gray-400" : "text-secondary"}`}>
                    {row.day_of_week}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <input
                    type="text"
                    disabled={row.is_closed}
                    value={row.open_time ?? ""}
                    onChange={(e) => updateRow(row.id, "open_time", e.target.value)}
                    placeholder="9:00 AM"
                    className="h-10 w-32 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <span className="text-gray-400 text-sm font-medium">to</span>
                  <input
                    type="text"
                    disabled={row.is_closed}
                    value={row.close_time ?? ""}
                    onChange={(e) => updateRow(row.id, "close_time", e.target.value)}
                    placeholder="4:00 PM"
                    className="h-10 w-32 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => updateRow(row.id, "is_closed", !row.is_closed)}
                  className={`flex-shrink-0 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                    row.is_closed
                      ? "border-gray-200 bg-white text-slate-500 hover:border-primary/30 hover:text-secondary"
                      : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                  aria-pressed={row.is_closed}
                >
                  <span
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      row.is_closed ? "bg-slate-300" : "bg-red-400"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                        row.is_closed ? "translate-x-1" : "translate-x-4.5"
                      }`}
                    />
                  </span>
                  {row.is_closed ? "Closed" : "Mark Closed"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
