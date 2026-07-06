"use client";

import {
  Eye,
  EyeOff,
  GripVertical,
  ImageIcon,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  createGalleryImage,
  deleteGalleryImage,
  getGalleryImages,
  getGalleryPlacements,
  getToken,
  isAuthError,
  reorderGalleryImages,
  updateGalleryImage,
} from "@/lib/authClient";
import CircularLoader from "@/components/CircularLoader";

const PLACEMENT_UI = {
  hero_slideshow: { aspectClass: "aspect-video", fitClass: "object-cover" },
  meet_the_doctor: { aspectClass: "aspect-[4/5]", fitClass: "object-cover" },
  about_doctor: { aspectClass: "aspect-[4/5]", fitClass: "object-cover" },
  about_bio_photo: { aspectClass: "aspect-[4/5]", fitClass: "object-cover" },
  about_experience_photo: { aspectClass: "aspect-[4/5]", fitClass: "object-cover" },
  pft_lab_logo: { aspectClass: "aspect-[16/9]", fitClass: "object-contain p-4 bg-white" },
  pft_lab_hero_photo: { aspectClass: "aspect-[4/3]", fitClass: "object-cover" },
  pft_lab_gallery: { aspectClass: "aspect-[16/10]", fitClass: "object-cover" },
  insurance_logos: { aspectClass: "aspect-[3/2]", fitClass: "object-contain p-4 bg-white" },
};

function getPlacementUi(key) {
  return PLACEMENT_UI[key] || { aspectClass: "aspect-video", fitClass: "object-cover" };
}

export default function GalleryCrudClient() {
  const router = useRouter();
  const token = getToken();

  const [placements, setPlacements] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalState, setModalState] = useState(null);
  const [form, setForm] = useState({ alt_text: "", caption: "", visibility_status: true, file: null });
  const [filePreviewUrl, setFilePreviewUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [draggedId, setDraggedId] = useState(null);

  const handleAuthFailure = () => {
    clearSession();
    router.replace("/admin/login");
  };

  const loadData = async () => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [placementsResponse, imagesResponse] = await Promise.all([
        getGalleryPlacements(),
        getGalleryImages(token),
      ]);
      setPlacements(Array.isArray(placementsResponse?.placements) ? placementsResponse.placements : []);
      setImages(Array.isArray(imagesResponse?.images) ? imagesResponse.images : []);
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  const imagesByPlacement = useMemo(() => {
    const map = {};
    for (const placementConfig of placements) {
      map[placementConfig.key] = [];
    }
    for (const image of images) {
      if (!map[image.placement]) map[image.placement] = [];
      map[image.placement].push(image);
    }
    for (const key of Object.keys(map)) {
      map[key] = [...map[key]].sort((a, b) => a.display_order - b.display_order);
    }
    return map;
  }, [images, placements]);

  const closeModal = () => {
    setModalState(null);
    setForm({ alt_text: "", caption: "", visibility_status: true, file: null });
    setFilePreviewUrl("");
    setFormError("");
  };

  const openCreateModal = (placementConfig) => {
    setModalState({ mode: "create", placement: placementConfig, image: null });
    setForm({ alt_text: "", caption: "", visibility_status: true, file: null });
    setFilePreviewUrl("");
    setFormError("");
  };

  const openEditModal = (placementConfig, image) => {
    setModalState({ mode: "edit", placement: placementConfig, image });
    setForm({
      alt_text: image.alt_text || "",
      caption: image.caption || "",
      visibility_status: Boolean(image.visibility_status),
      file: null,
    });
    setFilePreviewUrl("");
    setFormError("");
  };

  const handleFileChange = (file) => {
    setForm((previous) => ({ ...previous, file: file || null }));
    setFilePreviewUrl((previousUrl) => {
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return file ? URL.createObjectURL(file) : "";
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.alt_text.trim()) {
      setFormError("Alt text is required.");
      return;
    }

    if (modalState.mode === "create" && !form.file) {
      setFormError("An image file is required.");
      return;
    }

    if (!token) {
      handleAuthFailure();
      return;
    }

    const formData = new FormData();
    formData.append("alt_text", form.alt_text.trim());
    if (modalState.placement.hasCaption) {
      formData.append("caption", form.caption.trim());
    }
    formData.append("visibility_status", String(Boolean(form.visibility_status)));
    if (form.file) {
      formData.append("image", form.file);
    }

    setSubmitting(true);

    try {
      if (modalState.mode === "edit") {
        const response = await updateGalleryImage(token, modalState.image.id, formData);
        const updated = response?.image;
        if (updated) {
          setImages((previous) =>
            previous.map((item) => (item.id === updated.id ? updated : item)),
          );
        }
      } else {
        formData.append("placement", modalState.placement.key);
        const response = await createGalleryImage(token, formData);
        const created = response?.image;
        if (created) {
          setImages((previous) => [...previous, created]);
        } else {
          await loadData();
        }
      }
      closeModal();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setFormError(requestError?.message || "Failed to save image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (image) => {
    if (!window.confirm("Delete this image? This cannot be undone.")) return;
    if (!token) {
      handleAuthFailure();
      return;
    }

    try {
      await deleteGalleryImage(token, image.id);
      setImages((previous) => previous.filter((item) => item.id !== image.id));
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to delete image");
    }
  };

  const handleToggleVisibility = async (image) => {
    if (!token) {
      handleAuthFailure();
      return;
    }

    const formData = new FormData();
    formData.append("alt_text", image.alt_text || "");
    formData.append("caption", image.caption || "");
    formData.append("visibility_status", String(!image.visibility_status));

    try {
      const response = await updateGalleryImage(token, image.id, formData);
      const updated = response?.image;
      if (updated) {
        setImages((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
      }
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to update visibility");
    }
  };

  const commitReorder = async (placementKey, orderedIds) => {
    setImages((previous) =>
      previous.map((image) => {
        if (image.placement !== placementKey) return image;
        const index = orderedIds.indexOf(image.id);
        return index >= 0 ? { ...image, display_order: index } : image;
      }),
    );

    if (!token) {
      handleAuthFailure();
      return;
    }

    try {
      await reorderGalleryImages(token, placementKey, orderedIds);
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to save new order");
      loadData();
    }
  };

  const handleDrop = (placementKey, targetImage) => {
    if (draggedId == null || draggedId === targetImage.id) {
      setDraggedId(null);
      return;
    }

    const list = [...(imagesByPlacement[placementKey] || [])];
    const fromIndex = list.findIndex((item) => item.id === draggedId);
    const toIndex = list.findIndex((item) => item.id === targetImage.id);
    setDraggedId(null);

    if (fromIndex < 0 || toIndex < 0) return;

    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    commitReorder(placementKey, list.map((item) => item.id));
  };

  if (loading) {
    return (
      <section className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <CircularLoader label="Loading gallery..." />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">Gallery</h1>
        <p className="text-gray-600 mt-2">
          Manage the images shown on the public website — the homepage hero slideshow, doctor
          photos, and accepted insurance logos. Changes here appear on the site immediately.
        </p>
      </div>

      {error ? (
        <p className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}

      {placements.map((placementConfig) => {
        const placementImages = imagesByPlacement[placementConfig.key] || [];
        const ui = getPlacementUi(placementConfig.key);
        const atMax = placementConfig.multiple && placementImages.length >= placementConfig.maxImages;

        return (
          <div key={placementConfig.key} className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-secondary tracking-tight">
                  {placementConfig.label}
                </h2>
                <p className="text-gray-600 mt-1">{placementConfig.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-secondary">
                  Recommended: {placementConfig.recommendedDimensions}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                  {placementConfig.multiple
                    ? `${placementImages.length} of ${placementConfig.maxImages} images`
                    : placementImages.length
                    ? "Image set"
                    : "No image set"}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {placementImages.map((image) => (
                <div
                  key={image.id}
                  draggable={placementConfig.multiple}
                  onDragStart={() => setDraggedId(image.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(placementConfig.key, image)}
                  className={`group relative rounded-2xl border border-gray-200 overflow-hidden bg-slate-50 ${
                    draggedId === image.id ? "opacity-50" : ""
                  }`}
                >
                  <div className={`relative w-full ${ui.aspectClass}`}>
                    <img
                      src={image.image_url}
                      alt={image.alt_text}
                      className={`h-full w-full ${ui.fitClass}`}
                    />
                    {!image.visibility_status ? (
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700">
                          Hidden
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {placementConfig.multiple ? (
                    <div className="absolute left-2 top-2 w-7 h-7 rounded-lg bg-white/90 text-secondary flex items-center justify-center cursor-grab active:cursor-grabbing shadow-sm">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  ) : null}

                  <div className="absolute right-2 top-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(image)}
                      className="w-7 h-7 rounded-lg bg-white/90 text-secondary hover:bg-white flex items-center justify-center shadow-sm"
                      aria-label={image.visibility_status ? "Hide image" : "Show image"}
                      title={image.visibility_status ? "Hide from site" : "Show on site"}
                    >
                      {image.visibility_status ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(placementConfig, image)}
                      className="w-7 h-7 rounded-lg bg-white/90 text-secondary hover:bg-white flex items-center justify-center shadow-sm"
                      aria-label="Edit image"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(image)}
                      className="w-7 h-7 rounded-lg bg-white/90 text-red-500 hover:bg-white flex items-center justify-center shadow-sm"
                      aria-label="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="px-3 py-2.5 bg-white">
                    <p className="text-sm font-semibold text-secondary truncate" title={image.alt_text}>
                      {image.alt_text}
                    </p>
                    {placementConfig.hasCaption && image.caption ? (
                      <p className="text-xs text-gray-500 truncate" title={image.caption}>
                        {image.caption}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}

              {(!placementConfig.multiple && placementImages.length > 0) || atMax ? null : (
                <button
                  type="button"
                  onClick={() => openCreateModal(placementConfig)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/35 bg-primary/5 hover:bg-primary/10 transition-colors ${ui.aspectClass}`}
                >
                  <Plus className="w-6 h-6 text-primary" />
                  <span className="text-sm font-bold text-secondary">Add Image</span>
                </button>
              )}
            </div>

            {!placementConfig.multiple && placementImages.length > 0 ? (
              <button
                type="button"
                onClick={() => openEditModal(placementConfig, placementImages[0])}
                className="mt-4 btn-secondary inline-flex items-center justify-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Replace Image
              </button>
            ) : null}
          </div>
        );
      })}

      {modalState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/55"
            onClick={closeModal}
            aria-label="Close image modal overlay"
          />
          <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto bg-white border border-gray-100 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-secondary tracking-tight">
                  {modalState.mode === "edit" ? "Edit Image" : "Add Image"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{modalState.placement.label}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="w-9 h-9 rounded-lg border border-gray-200 text-secondary hover:bg-slate-50 flex items-center justify-center"
                aria-label="Close image modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">
                  Image{modalState.mode === "edit" ? " (optional — leave blank to keep current)" : ""}
                </label>
                <label className="block cursor-pointer">
                  <div className="rounded-2xl border-2 border-dashed border-primary/35 bg-primary/5 hover:bg-primary/10 transition-colors p-6 text-center">
                    <ImageIcon className="w-6 h-6 text-primary mx-auto" />
                    <p className="mt-2 text-sm font-semibold text-secondary">
                      {form.file ? form.file.name : "Choose an image file"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended: {modalState.placement.recommendedDimensions}
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handleFileChange(event.target.files?.[0] || null)}
                  />
                </label>

                {filePreviewUrl || modalState.image?.image_url ? (
                  <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 bg-slate-50">
                    <img
                      src={filePreviewUrl || modalState.image.image_url}
                      alt="Preview"
                      className="w-full max-h-56 object-contain"
                    />
                  </div>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-secondary mb-2">Alt Text</label>
                <input
                  type="text"
                  required
                  value={form.alt_text}
                  onChange={(event) => setForm((previous) => ({ ...previous, alt_text: event.target.value }))}
                  placeholder="Describe the image for accessibility and SEO"
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>

              {modalState.placement.hasCaption ? (
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-2">
                    {modalState.placement.captionLabel || "Caption"}
                  </label>
                  <input
                    type="text"
                    value={form.caption}
                    onChange={(event) => setForm((previous) => ({ ...previous, caption: event.target.value }))}
                    placeholder={modalState.placement.captionLabel || "Optional caption"}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
              ) : null}

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
                      Toggle to control whether this image appears publicly.
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
                  {submitting ? "Saving..." : modalState.mode === "edit" ? "Save Changes" : "Add Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
