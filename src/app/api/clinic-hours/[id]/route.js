import { NextResponse } from "next/server";
import ClinicHour from "@/models/ClinicHour";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getClinicHourById(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    const hour = await ClinicHour.getClinicHourById(id);
    if (!hour) {
      return NextResponse.json({ message: "Clinic hour entry does not exist" }, { status: 404 });
    }

    return NextResponse.json({ message: "Clinic hour retrieved successfully", clinic_hour: hour });
  } catch (err) {
    return handleApiError(err);
  }
}

async function updateClinicHour(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    const { open_time, close_time, is_closed } = await request.json();

    if (typeof is_closed !== "boolean") {
      return NextResponse.json({ message: "is_closed must be a boolean" }, { status: 400 });
    }

    if (!is_closed && (!open_time || !close_time)) {
      return NextResponse.json(
        { message: "open_time and close_time are required when is_closed is false" },
        { status: 400 }
      );
    }

    const existing = await ClinicHour.getClinicHourById(id);
    if (!existing) {
      return NextResponse.json({ message: "Clinic hour entry does not exist" }, { status: 404 });
    }

    const updated = await ClinicHour.updateClinicHour(
      id,
      is_closed ? null : String(open_time).trim(),
      is_closed ? null : String(close_time).trim(),
      is_closed
    );

    return NextResponse.json({ message: "Clinic hour updated successfully", clinic_hour: updated });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Clinic Hour", getClinicHourById);
export const PUT = withActivityLog("Updated Clinic Hour", updateClinicHour);
