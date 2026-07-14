import { NextResponse } from "next/server";
import User from "@/models/User";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function handler(request) {
  try {
    requireAuth(request);

    const { id, first_name, last_name, email, phone } = await request.json();
    if (!id || !first_name || !last_name || !email || !phone) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const userExists = await User.GetUserById(id);
    if (!userExists) {
      return NextResponse.json({ message: "User does not exist" }, { status: 404 });
    }

    const response = await User.UpdateUserProfile(id, first_name, last_name, email, phone);
    if (!response?.state) {
      return NextResponse.json({ message: "Failed to update profile" }, { status: 400 });
    }

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

export const POST = withActivityLog("Updated User Profile", handler);
