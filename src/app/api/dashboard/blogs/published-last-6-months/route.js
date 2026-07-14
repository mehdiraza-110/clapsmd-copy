import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getPublishedBlogsLastSixMonths(request) {
  try {
    requireAuth(request);

    const sql = `
      WITH months AS (
        SELECT generate_series(
          date_trunc('month', CURRENT_DATE) - interval '5 months',
          date_trunc('month', CURRENT_DATE),
          interval '1 month'
        ) AS month_start
      ),
      blog_counts AS (
        SELECT
          date_trunc('month', publish_time) AS month_start,
          COUNT(*)::int AS total_published_blog_posts
        FROM blogs
        WHERE status = 'published'
          AND publish_time IS NOT NULL
          AND publish_time >= date_trunc('month', CURRENT_DATE) - interval '5 months'
          AND publish_time < date_trunc('month', CURRENT_DATE) + interval '1 month'
        GROUP BY 1
      )
      SELECT
        to_char(months.month_start, 'Mon YYYY') AS month_label,
        to_char(months.month_start, 'YYYY-MM') AS month_key,
        COALESCE(blog_counts.total_published_blog_posts, 0) AS total_published_blog_posts
      FROM months
      LEFT JOIN blog_counts ON blog_counts.month_start = months.month_start
      ORDER BY months.month_start ASC
    `;

    const result = await query(sql);

    return NextResponse.json({ message: "Published blog stats retrieved successfully", stats: result.rows });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Published Blog Stats", getPublishedBlogsLastSixMonths);
