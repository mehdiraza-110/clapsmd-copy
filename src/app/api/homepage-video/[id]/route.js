import { NextResponse } from "next/server";
import HomepageVideo from "@/models/HomepageVideo";
import { deleteFromS3 } from "@/lib/server/s3";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const parseVisibilityStatus = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

async function updateVideo(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Video ID is required" }, { status: 400 });
    }

    const existingVideo = await HomepageVideo.getVideo();
    if (!existingVideo || String(existingVideo.id) !== String(id)) {
      return NextResponse.json({ message: "Homepage video does not exist" }, { status: 404 });
    }

    const { title, visibility_status } = await request.json();
    const videoTitle = normalizeString(title);
    const visibilityStatus = parseVisibilityStatus(visibility_status, existingVideo.visibility_status);

    const updatedVideo = await HomepageVideo.updateVideo(id, { title: videoTitle, visibilityStatus });

    return NextResponse.json({ message: "Homepage video updated successfully", video: updatedVideo });
  } catch (err) {
    return handleApiError(err);
  }
}

async function deleteVideo(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Video ID is required" }, { status: 400 });
    }

    const existingVideo = await HomepageVideo.getVideo();
    if (!existingVideo || String(existingVideo.id) !== String(id)) {
      return NextResponse.json({ message: "Homepage video does not exist" }, { status: 404 });
    }

    const deletedVideo = await HomepageVideo.deleteVideo(id);

    if (existingVideo.video_url) {
      await deleteFromS3(existingVideo.video_url);
    }

    return NextResponse.json({ message: "Homepage video deleted successfully", video: deletedVideo });
  } catch (err) {
    return handleApiError(err);
  }
}

export const PUT = withActivityLog("Updated Homepage Video", updateVideo);
export const DELETE = withActivityLog("Deleted Homepage Video", deleteVideo);
