import { NextResponse } from "next/server";
import Announcement from "@/models/Announcement";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

const ALLOWED_STATUS = ["published", "scheduled", "expired"];

const parseDateTime = (value) => {
  if (!value) return null;
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
};

async function createAnnouncement(request) {
  try {
    requireAuth(request);

    const { title, message, status, scheduled_time, expiry_time } = await request.json();

    if (!title || String(title).trim() === "") {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    if (!message || String(message).trim() === "") {
      return NextResponse.json({ message: "Message is required" }, { status: 400 });
    }

    if (!status || !ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        { message: "Status must be one of 'published', 'scheduled', or 'expired'" },
        { status: 400 }
      );
    }

    const parsedScheduledTime = parseDateTime(scheduled_time);
    if (status === "scheduled" && !parsedScheduledTime) {
      return NextResponse.json(
        { message: "scheduled_time is required for scheduled announcements" },
        { status: 400 }
      );
    }

    const parsedExpiryTime = parseDateTime(expiry_time);
    if (expiry_time && !parsedExpiryTime) {
      return NextResponse.json({ message: "expiry_time must be a valid datetime" }, { status: 400 });
    }
    if (
      status === "scheduled" &&
      parsedScheduledTime &&
      parsedExpiryTime &&
      parsedExpiryTime <= parsedScheduledTime
    ) {
      return NextResponse.json({ message: "expiry_time must be later than scheduled_time" }, { status: 400 });
    }

    const announcement = await Announcement.createAnnouncement({
      title: String(title).trim(),
      message: String(message).trim(),
      status,
      scheduledTime: status === "scheduled" ? parsedScheduledTime : null,
      expiryTime: parsedExpiryTime,
    });

    return NextResponse.json({ message: "Announcement created successfully", announcement }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

async function getAllAnnouncements(request) {
  try {
    requireAuth(request);

    const announcements = await Announcement.getAllAnnouncements();
    return NextResponse.json({ message: "Announcements retrieved successfully", announcements });
  } catch (err) {
    return handleApiError(err);
  }
}

export const POST = withActivityLog("Created Announcement", createAnnouncement);
export const GET = withActivityLog("Fetched Announcements", getAllAnnouncements);
