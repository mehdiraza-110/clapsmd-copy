import { NextResponse } from "next/server";
import GalleryImage from "@/models/GalleryImage";
import { handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getPlacements() {
  try {
    return NextResponse.json({
      message: "Placements retrieved successfully",
      placements: GalleryImage.getPlacements(),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Placements", getPlacements);
