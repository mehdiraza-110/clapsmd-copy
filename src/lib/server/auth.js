import { NextResponse } from "next/server";
import { verifyToken } from "./jwt";

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function getBearerToken(request) {
  const authHeader = request.headers.get("authorization");
  return authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
}

// Throws ApiError(401/403) on failure. Pass roles to additionally require the
// caller's JWT to include at least one of them (e.g. { roles: ["admin"] }).
export function requireAuth(request, { roles } = {}) {
  const token = getBearerToken(request);
  if (!token) throw new ApiError(401, "Unauthorized: No token");

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") throw new ApiError(401, "Token has expired");
    if (err.name === "JsonWebTokenError") throw new ApiError(401, "Invalid token");
    throw new ApiError(401, "Invalid or expired token");
  }

  const userRoles = Array.isArray(decoded.roles)
    ? decoded.roles.map((r) => (typeof r === "string" ? r : r.name))
    : [];

  if (roles && roles.length > 0 && !roles.some((r) => userRoles.includes(r))) {
    throw new ApiError(403, "Forbidden: No access to this route");
  }

  return { id: decoded.id, roles: userRoles };
}

export function handleApiError(err) {
  if (err instanceof ApiError) {
    return NextResponse.json({ message: err.message }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}
