import { NextResponse } from "next/server";
import Announcement from "@/models/Announcement";
import { handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getActiveAnnouncements() {
  try {
    const announcements = await Announcement.getActiveAnnouncements();
    return NextResponse.json({ message: "Active announcements retrieved successfully", announcements });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Active Announcements", getActiveAnnouncements);
