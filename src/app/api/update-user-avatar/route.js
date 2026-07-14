import { NextResponse } from "next/server";
import User from "@/models/User";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";
import { fileFromFormData } from "@/lib/server/upload";

async function handler(request) {
  try {
    requireAuth(request);

    const formData = await request.formData();
    const id = formData.get("id");
    const imageFile = await fileFromFormData(formData, "user_pfp");

    if (!id || !imageFile) {
      return NextResponse.json({ message: "User ID and image file are required" }, { status: 400 });
    }

    const userExists = await User.GetUserById(id);
    if (!userExists) {
      return NextResponse.json({ message: "User does not exist" }, { status: 404 });
    }

    const response = await User.updateUserAvatar(id, imageFile);
    if (response.state === true) {
      return NextResponse.json({ message: response.message }, { status: 201 });
    }
    return NextResponse.json({ message: "Failed to update avatar" }, { status: 400 });
  } catch (err) {
    return handleApiError(err);
  }
}

export const POST = withActivityLog("Updated User Avatar", handler);
