"use client";

import { Pencil, Trash2, Upload, VideoIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  deleteHomepageVideo,
  getHomepageVideo,
  getToken,
  isAuthError,
  updateHomepageVideo,
  uploadHomepageVideo,
} from "@/lib/authClient";
import CircularLoader from "@/components/CircularLoader";

const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;

function formatBytes(bytes) {
  if (!bytes) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VideoManagementClient() {
  const router = useRouter();
  const token = getToken();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", visibility_status: true, file: null });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAuthFailure = () => {
    clearSession();
    router.replace("/admin/login");
  };

  const loadVideo = async () => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await getHomepageVideo(token);
      setVideo(response?.video || null);
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to load homepage video");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = () => {
    setForm({
      title: video?.title || "",
      visibility_status: video ? Boolean(video.visibility_status) : true,
      file: null,
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError("");
  };

  const handleFileChange = (file) => {
    if (file && file.size > MAX_VIDEO_SIZE_BYTES) {
      setFormError(`That file is ${formatBytes(file.size)} — the max upload size is 50 MB.`);
      setForm((previous) => ({ ...previous, file: null }));
      return;
    }
    setFormError("");
    setForm((previous) => ({ ...previous, file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!video && !form.file) {
      setFormError("A video file is required.");
      return;
    }

    if (!token) {
      handleAuthFailure();
      return;
    }

    setSubmitting(true);

    try {
      if (form.file) {
        const formData = new FormData();
        formData.append("title", form.title.trim());
        formData.append("visibility_status", String(Boolean(form.visibility_status)));
        formData.append("video", form.file);
        const response = await uploadHomepageVideo(token, formData);
        setVideo(response?.video || null);
      } else if (video) {
        const response = await updateHomepageVideo(token, video.id, {
          title: form.title.trim(),
          visibility_status: Boolean(form.visibility_status),
        });
        setVideo(response?.video || null);
      }
      closeModal();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setFormError(requestError?.message || "Failed to save video");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!video) return;
    if (!window.confirm("Delete the homepage video? This cannot be undone.")) return;
    if (!token) {
      handleAuthFailure();
      return;
    }

    try {
      await deleteHomepageVideo(token, video.id);
      setVideo(null);
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to delete video");
    }
  };

  if (loading) {
    return (
      <section className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <CircularLoader label="Loading homepage video..." />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
          Homepage Video
        </h1>
        <p className="text-gray-600 mt-2">
          Manage the video shown on the homepage. Max upload size: 50 MB.
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-black text-secondary tracking-tight">Current Video</h2>
            <p className="text-gray-600 mt-1">
              {video
                ? video.visibility_status
                  ? "Visible on the homepage."
                  : "Hidden from the homepage."
                : "No video uploaded yet — the homepage shows a placeholder."}
            </p>
          </div>
        </div>

        {video ? (
          <div className="max-w-2xl">
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-black aspect-video">
              <video src={video.video_url} controls className="h-full w-full" />
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-secondary">{video.title || "Untitled"}</p>
                <span
                  className={`mt-1 inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                    video.visibility_status
                      ? "bg-primary/15 text-secondary"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {video.visibility_status ? "Visible" : "Hidden"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openModal}
                  className="w-9 h-9 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                  aria-label="Edit video"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-9 h-9 rounded-lg border border-gray-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                  aria-label="Delete video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openModal}
            className="flex max-w-2xl aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/35 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <VideoIcon className="w-8 h-8 text-primary" />
            <span className="text-sm font-bold text-secondary">Upload Video</span>
          </button>
        )}
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/55"
            onClick={closeModal}
            aria-label="Close video modal overlay"
          />
          <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-black text-secondary tracking-tight">
                {video ? "Edit Video" : "Upload Video"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                aria-label="Close video modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Video File{video ? " (optional — leave blank to keep current)" : ""}
                </label>
                <label className="block cursor-pointer">
                  <div className="rounded-2xl border-2 border-dashed border-primary/35 bg-primary/5 hover:bg-primary/10 transition-colors p-6 text-center">
                    <VideoIcon className="w-6 h-6 text-primary mx-auto" />
                    <p className="mt-2 text-sm font-semibold text-secondary">
                      {form.file ? `${form.file.name} (${formatBytes(form.file.size)})` : "Choose a video file"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">MP4, WebM, or MOV. Max 50 MB.</p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    className="sr-only"
                    onChange={(event) => handleFileChange(event.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                  placeholder="e.g. Practice Introduction"
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm((previous) => ({ ...previous, visibility_status: !previous.visibility_status }))
                }
                className={`w-full rounded-2xl border px-4 py-4 transition-colors ${
                  form.visibility_status ? "border-primary/40 bg-primary/10" : "border-gray-200 bg-slate-50"
                }`}
                aria-pressed={form.visibility_status}
              >
                <span className="flex items-center justify-between gap-4">
                  <span className="text-left">
                    <span className="block text-sm font-semibold text-secondary">
                      {form.visibility_status ? "Visible on site" : "Hidden from site"}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      Toggle to control whether the video appears on the homepage.
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

              {formError ? <p className="text-sm font-semibold text-red-600">{formError}</p> : null}

              <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary inline-flex items-center justify-center disabled:opacity-60"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {submitting ? "Saving..." : video ? "Save Changes" : "Upload Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
