import { NextResponse } from "next/server";
import Route from "@/models/Route";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getRouteById(request, { params }) {
  try {
    requireAuth(request, { roles: ["admin"] });

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Route ID is required" }, { status: 400 });
    }

    const route = await Route.getRouteById(id);
    if (!route) {
      return NextResponse.json({ message: "Route does not exist" }, { status: 404 });
    }

    return NextResponse.json({ message: "Route retrieved successfully", route });
  } catch (err) {
    return handleApiError(err);
  }
}

async function updateRoute(request, { params }) {
  try {
    requireAuth(request, { roles: ["admin"] });

    const { id } = params;
    const { route } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Route ID is required" }, { status: 400 });
    }

    if (!route || route.trim() === "") {
      return NextResponse.json({ message: "Route path is required" }, { status: 400 });
    }

    const existingRoute = await Route.getRouteById(id);
    if (!existingRoute) {
      return NextResponse.json({ message: "Route does not exist" }, { status: 404 });
    }

    const routeWithSamePath = await Route.getRouteByPath(route.trim());
    if (routeWithSamePath && routeWithSamePath.id !== parseInt(id, 10)) {
      return NextResponse.json({ message: "Route with this path already exists" }, { status: 409 });
    }

    const updatedRoute = await Route.updateRoute(id, route.trim());
    if (!updatedRoute) {
      return NextResponse.json({ message: "Failed to update route" }, { status: 400 });
    }

    return NextResponse.json({ message: "Route updated successfully", route: updatedRoute });
  } catch (err) {
    return handleApiError(err);
  }
}

async function deleteRoute(request, { params }) {
  try {
    requireAuth(request, { roles: ["admin"] });

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Route ID is required" }, { status: 400 });
    }

    const existingRoute = await Route.getRouteById(id);
    if (!existingRoute) {
      return NextResponse.json({ message: "Route does not exist" }, { status: 404 });
    }

    const result = await Route.deleteRoute(id);
    if (!result.canDelete) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Route deleted successfully", route: result.route });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Route", getRouteById);
export const PUT = withActivityLog("Updated Route", updateRoute);
export const DELETE = withActivityLog("Deleted Route", deleteRoute);
