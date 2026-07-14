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

async function getAnnouncementById(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Announcement ID is required" }, { status: 400 });
    }

    const announcement = await Announcement.getAnnouncementById(id);
    if (!announcement) {
      return NextResponse.json({ message: "Announcement does not exist" }, { status: 404 });
    }

    return NextResponse.json({ message: "Announcement retrieved successfully", announcement });
  } catch (err) {
    return handleApiError(err);
  }
}

async function updateAnnouncement(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    const { title, message, status, scheduled_time, expiry_time } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Announcement ID is required" }, { status: 400 });
    }

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

    const existingAnnouncement = await Announcement.getAnnouncementById(id);
    if (!existingAnnouncement) {
      return NextResponse.json({ message: "Announcement does not exist" }, { status: 404 });
    }

    const updatedAnnouncement = await Announcement.updateAnnouncement(id, {
      title: String(title).trim(),
      message: String(message).trim(),
      status,
      scheduledTime: status === "scheduled" ? parsedScheduledTime : null,
      expiryTime: parsedExpiryTime,
    });

    return NextResponse.json({ message: "Announcement updated successfully", announcement: updatedAnnouncement });
  } catch (err) {
    return handleApiError(err);
  }
}

async function deleteAnnouncement(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Announcement ID is required" }, { status: 400 });
    }

    const existingAnnouncement = await Announcement.getAnnouncementById(id);
    if (!existingAnnouncement) {
      return NextResponse.json({ message: "Announcement does not exist" }, { status: 404 });
    }

    const deletedAnnouncement = await Announcement.deleteAnnouncement(id);

    return NextResponse.json({ message: "Announcement deleted successfully", announcement: deletedAnnouncement });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Announcement", getAnnouncementById);
export const PUT = withActivityLog("Updated Announcement", updateAnnouncement);
export const DELETE = withActivityLog("Deleted Announcement", deleteAnnouncement);
