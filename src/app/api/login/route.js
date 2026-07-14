import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { createToken } from "@/lib/server/jwt";
import { withActivityLog } from "@/lib/server/activityLog";

async function handler(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const user = await User.GetUserByEmail(email);

    if (!user) {
      return NextResponse.json({ message: "User does not exist" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
    }

    const rolesResult = await User.GetRolesByUserId(user?.id);

    const token = await createToken({
      id: user.id,
      roles: rolesResult,
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          roles: rolesResult,
          is_verified: user.is_verified,
          is_admin_user: user.is_admin_user,
          profile_image: user.profile_image,
        },
        token,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}

export const POST = withActivityLog("Logged In", handler);
