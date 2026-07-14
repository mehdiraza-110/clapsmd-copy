import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { uploadToS3 } from "@/lib/server/s3";
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

async function createBlog(request) {
  try {
    requireAuth(request);

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

    const existingBlog = await Blog.getBlogBySlug(normalizeString(slug));
    if (existingBlog) {
      return NextResponse.json({ message: "Blog with this slug already exists" }, { status: 409 });
    }

    let featuredImageUrl = null;
    if (featuredImageFile) {
      featuredImageUrl = await uploadToS3(featuredImageFile, "blogs");
    }

    const blog = await Blog.createBlog({
      title: normalizeString(title),
      slug: normalizeString(slug),
      metaDescription: normalizeString(meta_description),
      featuredImage: featuredImageUrl,
      content: String(content),
      status: normalizeString(status),
      scheduledPublishTime: normalizeString(status) === "scheduled" ? parsedScheduledPublishTime : null,
    });

    return NextResponse.json({ message: "Blog created successfully", blog }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

// Public: the marketing blog index and blog detail pages call this with no token.
async function getAllBlogs() {
  try {
    const blogs = await Blog.getAllBlogs();
    return NextResponse.json({ message: "Blogs retrieved successfully", blogs });
  } catch (err) {
    return handleApiError(err);
  }
}

export const POST = withActivityLog("Created Blog", createBlog);
export const GET = withActivityLog("Fetched Blogs", getAllBlogs);
