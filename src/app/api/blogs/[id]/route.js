import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { uploadToS3, deleteFromS3 } from "@/lib/server/s3";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";
import { fileFromFormData } from "@/lib/server/upload";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");
const parseScheduledPublishTime = (value) => {
  if (!value) return null;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
};

// Public: the blog detail page calls this with no token to resolve a slug.
async function getBlogById(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
    }

    const blog = await Blog.getBlogById(id);
    if (!blog) {
      return NextResponse.json({ message: "Blog does not exist" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog retrieved successfully", blog });
  } catch (err) {
    return handleApiError(err);
  }
}

async function updateBlog(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
    }

    const formData = await request.formData();
    const { title, slug, meta_description, content, status, scheduled_publish_time } = Object.fromEntries(
      formData.entries()
    );
    const featuredImageFile = await fileFromFormData(formData, "featured_image");

    if (!normalizeString(title)) {
      return NextResponse.json({ message: "Blog title is required" }, { status: 400 });
    }

    if (!normalizeString(slug)) {
      return NextResponse.json({ message: "Blog slug is required" }, { status: 400 });
    }

    if (!normalizeString(meta_description)) {
      return NextResponse.json({ message: "Meta description is required" }, { status: 400 });
    }

    if (!normalizeString(content)) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }

    if (!normalizeString(status)) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }

    const parsedScheduledPublishTime = parseScheduledPublishTime(scheduled_publish_time);
    if (normalizeString(status) === "scheduled" && !parsedScheduledPublishTime) {
      return NextResponse.json(
        { message: "scheduled_publish_time is required for scheduled blog posts" },
        { status: 400 }
      );
    }

    const existingBlog = await Blog.getBlogById(id);
    if (!existingBlog) {
      return NextResponse.json({ message: "Blog does not exist" }, { status: 404 });
    }

    const duplicateBlog = await Blog.getBlogBySlug(normalizeString(slug));
    if (duplicateBlog && duplicateBlog.id !== Number(id)) {
      return NextResponse.json({ message: "Blog with this slug already exists" }, { status: 409 });
    }

    let featuredImageUrl = existingBlog.featured_image;
    if (featuredImageFile) {
      featuredImageUrl = await uploadToS3(featuredImageFile, "blogs");

      if (existingBlog.featured_image) {
        await deleteFromS3(existingBlog.featured_image);
      }
    }

    const updatedBlog = await Blog.updateBlog(id, {
      title: normalizeString(title),
      slug: normalizeString(slug),
      metaDescription: normalizeString(meta_description),
      featuredImage: featuredImageUrl,
      content: String(content),
      status: normalizeString(status),
      scheduledPublishTime: normalizeString(status) === "scheduled" ? parsedScheduledPublishTime : null,
    });

    return NextResponse.json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (err) {
    return handleApiError(err);
  }
}

async function deleteBlog(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
    }

    const existingBlog = await Blog.getBlogById(id);
    if (!existingBlog) {
      return NextResponse.json({ message: "Blog does not exist" }, { status: 404 });
    }

    const deletedBlog = await Blog.deleteBlog(id);

    if (existingBlog.featured_image) {
      await deleteFromS3(existingBlog.featured_image);
    }

    return NextResponse.json({ message: "Blog deleted successfully", blog: deletedBlog });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Blog", getBlogById);
export const PUT = withActivityLog("Updated Blog", updateBlog);
export const DELETE = withActivityLog("Deleted Blog", deleteBlog);
