import { NextResponse } from "next/server";
import GalleryImage from "@/models/GalleryImage";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

async function reorderImages(request) {
  try {
    requireAuth(request);

    const { placement, ordered_ids } = await request.json();
    const normalizedPlacement = normalizeString(placement);

    if (!normalizedPlacement || !GalleryImage.isValidPlacement(normalizedPlacement)) {
      return NextResponse.json({ message: "A valid placement is required" }, { status: 400 });
    }

    if (!Array.isArray(ordered_ids) || ordered_ids.length === 0) {
      return NextResponse.json({ message: "ordered_ids must be a non-empty array" }, { status: 400 });
    }

    const updatedImages = await GalleryImage.reorderImages(normalizedPlacement, ordered_ids);

    return NextResponse.json({ message: "Images reordered successfully", images: updatedImages });
  } catch (err) {
    return handleApiError(err);
  }
}

export const PUT = withActivityLog("Reordered Gallery Images", reorderImages);
