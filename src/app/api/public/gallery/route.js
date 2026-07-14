import { NextResponse } from "next/server";
import GalleryImage from "@/models/GalleryImage";
import { handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getPublicImages() {
  try {
    const images = await GalleryImage.getPublicImages();
    const placements = {};
    for (const placementConfig of GalleryImage.getPlacements()) {
      placements[placementConfig.key] = [];
    }
    for (const image of images) {
      if (!placements[image.placement]) placements[image.placement] = [];
      placements[image.placement].push(image);
    }

    return NextResponse.json({ message: "Public gallery images retrieved successfully", placements });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Public Gallery Images", getPublicImages);
