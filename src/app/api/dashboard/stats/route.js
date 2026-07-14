import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getDashboardStats(request) {
  try {
    requireAuth(request);

    const sql = `
      SELECT
        (SELECT COUNT(*)::int FROM services WHERE visibility_status = TRUE) AS total_active_services,
        (SELECT COUNT(*)::int FROM announcements WHERE status = 'published') AS total_published_announcements,
        (SELECT COUNT(*)::int FROM blogs WHERE status = 'published') AS total_published_blog_posts
    `;

    const result = await query(sql);
    const stats = result.rows[0] || {
      total_active_services: 0,
      total_published_announcements: 0,
      total_published_blog_posts: 0,
    };

    return NextResponse.json({ message: "Dashboard stats retrieved successfully", stats });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Dashboard Stats", getDashboardStats);
