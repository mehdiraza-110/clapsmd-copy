import { NextResponse } from "next/server";
import HomepageVideo from "@/models/HomepageVideo";
import { uploadToS3, deleteFromS3 } from "@/lib/server/s3";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";
import { fileFromFormData } from "@/lib/server/upload";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const parseVisibilityStatus = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

async function getVideo(request) {
  try {
    requireAuth(request);

    const video = await HomepageVideo.getVideo();
    return NextResponse.json({ message: "Homepage video retrieved successfully", video });
  } catch (err) {
    return handleApiError(err);
  }
}

async function uploadVideo(request) {
  try {
    requireAuth(request);

    const formData = await request.formData();
    const { title, visibility_status } = Object.fromEntries(formData.entries());
    const file = await fileFromFormData(formData, "video");

    if (!file) {
      return NextResponse.json({ message: "Video file is required" }, { status: 400 });
    }

    if (!file.mimetype.startsWith("video/")) {
      return NextResponse.json({ message: "Only video files are allowed" }, { status: 400 });
    }

    if (file.buffer.length > 50 * 1024 * 1024) {
      return NextResponse.json({ message: "Video file exceeds the 50MB limit" }, { status: 400 });
    }

    const videoTitle = normalizeString(title);
    const visibilityStatus = parseVisibilityStatus(visibility_status, true);

    const existingVideo = await HomepageVideo.getVideo();
    if (existingVideo) {
      await HomepageVideo.deleteVideo(existingVideo.id);
      if (existingVideo.video_url) {
        await deleteFromS3(existingVideo.video_url);
      }
    }

    const videoUrl = await uploadToS3(file, "homepage-video");
    const video = await HomepageVideo.createVideo({
      videoUrl,
      title: videoTitle,
      visibilityStatus,
    });

    return NextResponse.json({ message: "Homepage video uploaded successfully", video }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Homepage Video", getVideo);
export const POST = withActivityLog("Uploaded Homepage Video", uploadVideo);
