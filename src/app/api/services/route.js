import { NextResponse } from "next/server";
import Service from "@/models/Service";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function createService(request) {
  try {
    requireAuth(request);

    const { service_name, service_description, visibility_status } = await request.json();

    if (!service_name || String(service_name).trim() === "") {
      return NextResponse.json({ message: "Service name is required" }, { status: 400 });
    }

    const existingService = await Service.getServiceByName(String(service_name).trim());
    if (existingService) {
      return NextResponse.json({ message: "Service with this name already exists" }, { status: 409 });
    }

    const newService = await Service.createService(
      String(service_name).trim(),
      service_description ? String(service_description).trim() : "",
      typeof visibility_status === "boolean" ? visibility_status : true
    );

    return NextResponse.json({ message: "Service created successfully", service: newService }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

// Public: rendered on the marketing site's "Conditions We Treat" section with no auth.
async function getAllServices() {
  try {
    const services = await Service.getAllServices();
    return NextResponse.json({ message: "Services retrieved successfully", services });
  } catch (err) {
    return handleApiError(err);
  }
}

export const POST = withActivityLog("Created Service", createService);
export const GET = withActivityLog("Fetched Services", getAllServices);
