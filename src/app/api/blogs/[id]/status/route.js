import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");
const parseScheduledPublishTime = (value) => {
  if (!value) return null;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
};

async function updateBlogStatus(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    const { status, scheduled_publish_time } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Blog ID is required" }, { status: 400 });
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

    const updatedBlog = await Blog.updateBlogStatus(
      id,
      normalizeString(status),
      normalizeString(status) === "scheduled" ? parsedScheduledPublishTime : null
    );

    return NextResponse.json({ message: "Blog status updated successfully", blog: updatedBlog });
  } catch (err) {
    return handleApiError(err);
  }
}

export const PATCH = withActivityLog("Updated Blog Status", updateBlogStatus);
