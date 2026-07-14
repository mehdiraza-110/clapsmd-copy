import { NextResponse } from "next/server";
import ActivityLog from "@/models/ActivityLog";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getAllActivityLogs(request) {
  try {
    requireAuth(request);

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? searchParams.get("pageSize"), 10) || 20, 1), 100);

    const { logs, total } = await ActivityLog.getAll({ page, limit });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      message: "Activity logs retrieved successfully",
      logs,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Activity Logs", getAllActivityLogs);
