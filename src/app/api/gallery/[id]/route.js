import { NextResponse } from "next/server";
import GalleryImage from "@/models/GalleryImage";
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

async function getImageById(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Image ID is required" }, { status: 400 });
    }

    const image = await GalleryImage.getImageById(id);
    if (!image) {
      return NextResponse.json({ message: "Image does not exist" }, { status: 404 });
    }

    return NextResponse.json({ message: "Image retrieved successfully", image });
  } catch (err) {
    return handleApiError(err);
  }
}

async function updateImage(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Image ID is required" }, { status: 400 });
    }

    const existingImage = await GalleryImage.getImageById(id);
    if (!existingImage) {
      return NextResponse.json({ message: "Image does not exist" }, { status: 404 });
    }

    const formData = await request.formData();
    const { alt_text, caption, visibility_status } = Object.fromEntries(formData.entries());
    const file = await fileFromFormData(formData, "image");

    const altText = normalizeString(alt_text);
    if (!altText) {
      return NextResponse.json({ message: "Alt text is required" }, { status: 400 });
    }

    const placementConfig = GalleryImage.getPlacementConfig(existingImage.placement);

    let imageUrl = existingImage.image_url;
    if (file) {
      imageUrl = await uploadToS3(file, "gallery");
      if (existingImage.image_url) {
        await deleteFromS3(existingImage.image_url);
      }
    }

    const updatedImage = await GalleryImage.updateImage(id, {
      imageUrl,
      altText,
      caption: placementConfig?.hasCaption ? normalizeString(caption) : null,
      visibilityStatus: parseVisibilityStatus(visibility_status, existingImage.visibility_status),
    });

    return NextResponse.json({ message: "Image updated successfully", image: updatedImage });
  } catch (err) {
    return handleApiError(err);
  }
}

async function deleteImage(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Image ID is required" }, { status: 400 });
    }

    const existingImage = await GalleryImage.getImageById(id);
    if (!existingImage) {
      return NextResponse.json({ message: "Image does not exist" }, { status: 404 });
    }

    const deletedImage = await GalleryImage.deleteImage(id);

    if (existingImage.image_url) {
      await deleteFromS3(existingImage.image_url);
    }

    return NextResponse.json({ message: "Image deleted successfully", image: deletedImage });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Gallery Image", getImageById);
export const PUT = withActivityLog("Updated Gallery Image", updateImage);
export const DELETE = withActivityLog("Deleted Gallery Image", deleteImage);
