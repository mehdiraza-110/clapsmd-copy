import { NextResponse } from "next/server";
import ClinicHour from "@/models/ClinicHour";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

// Public: rendered on the marketing site (contact/homepage) with no token.
async function getAllClinicHours() {
  try {
    const hours = await ClinicHour.getAllClinicHours();
    return NextResponse.json({ message: "Clinic hours retrieved successfully", clinic_hours: hours });
  } catch (err) {
    return handleApiError(err);
  }
}

async function bulkUpdateClinicHours(request) {
  try {
    requireAuth(request);

    const { hours } = await request.json();

    if (!Array.isArray(hours) || hours.length === 0) {
      return NextResponse.json({ message: "hours must be a non-empty array" }, { status: 400 });
    }

    for (const [i, hour] of hours.entries()) {
      if (!hour.id) {
        return NextResponse.json({ message: `Missing id at index ${i}` }, { status: 400 });
      }
      if (typeof hour.is_closed !== "boolean") {
        return NextResponse.json({ message: `is_closed must be a boolean at index ${i}` }, { status: 400 });
      }
      if (!hour.is_closed && (!hour.open_time || !hour.close_time)) {
        return NextResponse.json(
          { message: `open_time and close_time are required when is_closed is false (index ${i})` },
          { status: 400 }
        );
      }
    }

    const normalizedHours = hours.map((h) => ({
      id: h.id,
      open_time: h.is_closed ? null : String(h.open_time).trim(),
      close_time: h.is_closed ? null : String(h.close_time).trim(),
      is_closed: h.is_closed,
    }));

    const updated = await ClinicHour.bulkUpdateClinicHours(normalizedHours);

    return NextResponse.json({ message: "Clinic hours updated successfully", clinic_hours: updated });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Clinic Hours", getAllClinicHours);
export const PUT = withActivityLog("Bulk Updated Clinic Hours", bulkUpdateClinicHours);
