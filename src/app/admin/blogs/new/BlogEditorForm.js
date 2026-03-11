"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ImageIcon, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  createBlog,
  getBlogById,
  getToken,
  isAuthError,
  updateBlog,
} from "@/lib/authClient";
import CircularLoader from "@/components/CircularLoader";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const STATUS_OPTIONS = ["draft", "published", "scheduled", "archived"];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildFormData(values) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("slug", values.slug);
  formData.append("meta_description", values.meta_description);
  formData.append("content", values.content);
  formData.append("status", values.status);

  if (values.status === "scheduled" && values.scheduled_publish_time) {
    formData.append("scheduled_publish_time", values.scheduled_publish_time);
  }

  if (values.featured_image) {
    formData.append("featured_image", values.featured_image);
  }

  return formData;
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

export default function BlogEditorForm({ blogId = null }) {
  const router = useRouter();
  const token = getToken();
  const isEditing = Boolean(blogId);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    meta_description: "",
    content: "",
    status: "draft",
    scheduled_publish_time: "",
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [imageName, setImageName] = useState("No file selected");
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const slugPreview = useMemo(() => {
    return form.slug.trim().length > 0 ? form.slug : "your-blog-slug";
  }, [form.slug]);

  const editorConfig = useMemo(() => {
    return {
      readonly: false,
      height: 420,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultMode: "1",
      toolbarAdaptive: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "paragraph",
        "|",
        "image",
        "link",
        "table",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
      uploader: {
        insertImageAsBase64URI: true,
      },
    };
  }, []);

  const handleAuthFailure = () => {
    clearSession();
    router.replace("/admin/login");
  };

  useEffect(() => {
    if (!isEditing) return undefined;
    if (!token) {
      handleAuthFailure();
      return undefined;
    }

    let active = true;

    const loadBlog = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getBlogById(token, blogId);
        const blog = response?.blog;

        if (!active) return;

        if (!blog) {
          setError("Blog details were not returned by the API.");
          return;
        }

        setForm({
          title: blog.title || "",
          slug: blog.slug || "",
          meta_description: blog.meta_description || "",
          content: blog.content || "",
          status: blog.status || "draft",
          scheduled_publish_time: toDatetimeLocalValue(blog.scheduled_publish_time),
        });
        setCurrentImageUrl(blog.featured_image || "");
        setImageName(blog.featured_image ? "Current image on file" : "No file selected");
        setSlugTouched(Boolean(blog.slug));
      } catch (requestError) {
        if (isAuthError(requestError)) {
          handleAuthFailure();
          return;
        }
        if (active) {
          setError(requestError?.message || "Failed to load blog");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBlog();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId, isEditing]);

  const handleFormChange = (field, value) => {
    setForm((previous) => {
      if (field === "status" && value !== "scheduled") {
        return {
          ...previous,
          status: value,
          scheduled_publish_time: "",
        };
      }

      return { ...previous, [field]: value };
    });
  };

  const handleTitleChange = (value) => {
    setForm((previous) => {
      const nextSlug = slugTouched ? previous.slug : slugify(value);
      return {
        ...previous,
        title: value,
        slug: nextSlug,
      };
    });
  };

  const handleSlugChange = (value) => {
    setSlugTouched(true);
    handleFormChange("slug", slugify(value));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setFeaturedImageFile(file);
    setImageName(file?.name || (currentImageUrl ? "Current image on file" : "No file selected"));
  };

  const validateForm = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.slug.trim()) return "Slug is required.";
    if (!form.meta_description.trim()) return "Meta description is required.";
    if (!form.content.trim()) return "Content is required.";
    if (!form.status.trim()) return "Status is required.";
    if (form.status === "scheduled" && !form.scheduled_publish_time) {
      return "Scheduled publish time is required when status is scheduled.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      handleAuthFailure();
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = buildFormData({
      ...form,
      title: form.title.trim(),
      slug: slugify(form.slug),
      meta_description: form.meta_description.trim(),
      content: form.content.trim(),
      status: form.status.trim(),
      scheduled_publish_time:
        form.status === "scheduled"
          ? toIsoFromLocal(form.scheduled_publish_time)
          : "",
      featured_image: featuredImageFile,
    });

    setSubmitting(true);

    try {
      if (isEditing) {
        await updateBlog(token, blogId, payload);
      } else {
        await createBlog(token, payload);
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (requestError) {
      if (isAuthError(requestError)) {
        handleAuthFailure();
        return;
      }
      setError(requestError?.message || "Failed to save blog");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <CircularLoader label="Loading blog editor..." />
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-black text-secondary tracking-tight">
          {isEditing ? "Update Blog" : "Create New Blog"}
        </h1>
        <p className="text-gray-600 mt-2">
          Manage title, slug, SEO description, featured image, content, status, and scheduling.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-secondary mb-2">
            Blog Title
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="Enter blog title"
            className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),220px] gap-5">
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">
              Slug
            </label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(event) => handleSlugChange(event.target.value)}
              placeholder="your-blog-slug"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            <p className="mt-2 text-xs text-gray-500">
              Preview URL: <span className="font-semibold">/blog/{slugPreview}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(event) => handleFormChange("status", event.target.value)}
              className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {form.status === "scheduled" ? (
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2">
              Scheduled Publish Time
            </label>
            <input
              type="datetime-local"
              required
              value={form.scheduled_publish_time}
              onChange={(event) =>
                handleFormChange("scheduled_publish_time", event.target.value)
              }
              className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
        ) : null}

        <div>
          <label className="block text-sm font-semibold text-secondary mb-2">
            Meta Description
          </label>
          <textarea
            rows={3}
            required
            value={form.meta_description}
            onChange={(event) => handleFormChange("meta_description", event.target.value)}
            placeholder="Write a concise summary of this blog post."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-secondary mb-2">
            Featured Image
          </label>
          <label className="block cursor-pointer">
            <div className="rounded-2xl border-2 border-dashed border-primary/35 bg-primary/5 hover:bg-primary/10 transition-colors p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-secondary font-black tracking-tight text-lg">
                      Upload Featured Image
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Recommended: JPG/PNG, landscape orientation, under 5MB.
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-secondary text-white font-semibold text-sm whitespace-nowrap">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-700 font-medium break-all">
                {imageName}
              </div>

              {currentImageUrl && !featuredImageFile ? (
                <div className="mt-5 rounded-2xl overflow-hidden border border-gray-200 bg-white">
                  <img
                    src={currentImageUrl}
                    alt={form.title || "Current featured image"}
                    className="w-full max-h-64 object-cover"
                  />
                </div>
              ) : null}
            </div>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
        <label className="block text-sm font-semibold text-secondary mb-3">
          Blog Content (Rich Text Editor)
        </label>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <JoditEditor
            value={form.content}
            config={editorConfig}
            onChange={(newContent) => handleFormChange("content", newContent)}
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm font-semibold text-red-600">{error}</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : isEditing ? "Update Blog" : "Save Blog"}
        </button>
        <Link href="/admin/blogs" className="btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
