import { NextResponse } from "next/server";
import Route from "@/models/Route";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function createRoute(request) {
  try {
    requireAuth(request, { roles: ["admin"] });

    const { route } = await request.json();

    if (!route || route.trim() === "") {
      return NextResponse.json({ message: "Route path is required" }, { status: 400 });
    }

    const existingRoute = await Route.getRouteByPath(route.trim());
    if (existingRoute) {
      return NextResponse.json({ message: "Route with this path already exists" }, { status: 409 });
    }

    const newRoute = await Route.createRoute(route.trim());
    return NextResponse.json({ message: "Route created successfully", route: newRoute }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

async function getAllRoutes(request) {
  try {
    requireAuth(request, { roles: ["admin"] });

    const routes = await Route.getAllRoutes();
    return NextResponse.json({ message: "Routes retrieved successfully", routes });
  } catch (err) {
    return handleApiError(err);
  }
}

export const POST = withActivityLog("Created Route", createRoute);
export const GET = withActivityLog("Fetched Routes", getAllRoutes);
