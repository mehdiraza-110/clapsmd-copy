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

async function createImage(request) {
  try {
    requireAuth(request);

    const formData = await request.formData();
    const { placement, alt_text, caption, visibility_status } = Object.fromEntries(formData.entries());
    const file = await fileFromFormData(formData, "image");

    const normalizedPlacement = normalizeString(placement);
    const altText = normalizeString(alt_text);

    if (!normalizedPlacement || !GalleryImage.isValidPlacement(normalizedPlacement)) {
      return NextResponse.json({ message: "A valid placement is required" }, { status: 400 });
    }

    if (!altText) {
      return NextResponse.json({ message: "Alt text is required" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    }

    const placementConfig = GalleryImage.getPlacementConfig(normalizedPlacement);
    const existingCount = await GalleryImage.countByPlacement(normalizedPlacement);

    if (!placementConfig.multiple && existingCount > 0) {
      const existingImages = await GalleryImage.getAllImages({ placement: normalizedPlacement });
      for (const existingImage of existingImages) {
        await GalleryImage.deleteImage(existingImage.id);
        if (existingImage.image_url) {
          await deleteFromS3(existingImage.image_url);
        }
      }
    } else if (placementConfig.multiple && existingCount >= placementConfig.maxImages) {
      return NextResponse.json(
        {
          message: `This placement supports a maximum of ${placementConfig.maxImages} images. Remove one before adding another.`,
        },
        { status: 409 }
      );
    }

    const imageUrl = await uploadToS3(file, "gallery");
    const nextDisplayOrder = (await GalleryImage.getMaxDisplayOrder(normalizedPlacement)) + 1;

    const image = await GalleryImage.createImage({
      placement: normalizedPlacement,
      imageUrl,
      altText,
      caption: placementConfig.hasCaption ? normalizeString(caption) : null,
      displayOrder: placementConfig.multiple ? nextDisplayOrder : 0,
      visibilityStatus: parseVisibilityStatus(visibility_status, true),
    });

    return NextResponse.json({ message: "Image created successfully", image }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

async function getAllImages(request) {
  try {
    requireAuth(request);

    const { searchParams } = new URL(request.url);
    const placement = searchParams.get("placement")?.trim() || "";

    if (placement && !GalleryImage.isValidPlacement(placement)) {
      return NextResponse.json({ message: "Placement is invalid" }, { status: 400 });
    }

    const images = await GalleryImage.getAllImages({ placement });
    return NextResponse.json({ message: "Images retrieved successfully", images });
  } catch (err) {
    return handleApiError(err);
  }
}

export const POST = withActivityLog("Created Gallery Image", createImage);
export const GET = withActivityLog("Fetched Gallery Images", getAllImages);
