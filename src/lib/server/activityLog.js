import { verifyToken } from "./jwt";
import ActivityLog from "@/models/ActivityLog";

async function resolveActor(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded?.id) return `User#${decoded.id}`;
    } catch (_error) {
      // Ignore token errors for logging actor fallback.
    }
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.clone().json();
      if (body?.email) return String(body.email);
      if (body?.id) return `User#${body.id}`;
    }
  } catch (_error) {
    // Ignore body parse errors for logging actor fallback.
  }

  return "Anonymous";
}

// Wraps a route handler so every call is recorded in activity_logs, mirroring
// the old Express `res.on("finish", ...)` middleware but per-route since Next
// route handlers don't share a middleware chain. The write is awaited (rather
// than fire-and-forget) because Vercel serverless functions can freeze
// execution as soon as the response is returned.
export function withActivityLog(actionLabel, handler) {
  return async (request, context) => {
    const actorPromise = resolveActor(request);
    const response = await handler(request, context);

    try {
      const actor = await actorPromise;
      const statusCode = response.status;
      await ActivityLog.create({
        action: actionLabel,
        actor,
        isSuccessful: statusCode >= 200 && statusCode < 400,
        statusCode,
        method: request.method.toUpperCase(),
        path: new URL(request.url).pathname,
      });
    } catch (err) {
      console.error("Failed to write activity log:", err.message);
    }

    return response;
  };
}
