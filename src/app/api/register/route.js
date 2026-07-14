import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { createToken } from "@/lib/server/jwt";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function handler(request) {
  try {
    requireAuth(request, { roles: ["admin"] });

    const payload = await request.json();
    if (!payload || Object.keys(payload).length === 0) {
      return NextResponse.json({ message: "Invalid data sent to server" }, { status: 400 });
    }

    if (
      payload?.first_name === undefined ||
      payload.first_name.trim() === "" ||
      payload?.last_name === undefined ||
      payload.last_name.trim() === "" ||
      payload?.email === undefined ||
      payload.email.trim() === "" ||
      payload?.phone === undefined ||
      payload.phone.trim() === "" ||
      payload?.password === undefined ||
      payload.password.trim() === ""
    ) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const { first_name, last_name, email, phone, password } = payload;

    const isUserExists = await User.GetUserByEmail(email.trim());
    if (isUserExists) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const { id, roles, is_verified, is_admin_user } = await User.createUser(
      first_name.trim(),
      last_name.trim(),
      email.trim(),
      phone.trim(),
      passwordHash,
      null,
      false,
      true
    );

    const token = await createToken({ id, roles });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id,
          first_name,
          last_name,
          email,
          phone,
          isVerified: is_verified,
          isAdminUser: is_admin_user,
          roles,
        },
        token,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}

export const POST = withActivityLog("Registered User", handler);
