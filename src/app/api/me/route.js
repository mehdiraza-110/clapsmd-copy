import { NextResponse } from "next/server";
import User from "@/models/User";
import { verifyToken } from "@/lib/server/jwt";
import { getBearerToken } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function handler(request) {
  const token = getBearerToken(request);

  if (!token || token.trim() === "" || token === "null" || token === "undefined") {
    return NextResponse.json({ message: "Token is required" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const user = await User.GetUserById(userId);
    if (!user) {
      return NextResponse.json({ message: "User does not exist" }, { status: 404 });
    }

    const roles = await User.GetRolesByUserId(userId);
    const allowedRoutes = await User.GetRoutesByRoles(roles);

    const userPayload = {
      id: user?.id,
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      phone: user?.phone,
      is_verified: user?.is_verified,
      is_admin_user: user?.is_admin_user,
      profile_image: user?.profile_image,
      created_at: user?.created_at,
      updated_at: user?.updated_at,
    };

    return NextResponse.json({
      user: {
        ...userPayload,
        roles,
        allowedRoutes,
      },
    });
  } catch (err) {
    console.error("/me error:", err);
    if (err.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Token has expired" }, { status: 401 });
    }
    if (err.name === "JsonWebTokenError") {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }
}

export const GET = withActivityLog("Fetched Current User", handler);
