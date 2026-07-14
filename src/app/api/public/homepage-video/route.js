import { NextResponse } from "next/server";
import HomepageVideo from "@/models/HomepageVideo";
import { handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getPublicVideo() {
  try {
    const video = await HomepageVideo.getPublicVideo();
    return NextResponse.json({ message: "Public homepage video retrieved successfully", video });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Public Homepage Video", getPublicVideo);
