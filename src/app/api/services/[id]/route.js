import { NextResponse } from "next/server";
import Service from "@/models/Service";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getServiceById(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Service ID is required" }, { status: 400 });
    }

    const service = await Service.getServiceById(id);
    if (!service) {
      return NextResponse.json({ message: "Service does not exist" }, { status: 404 });
    }

    return NextResponse.json({ message: "Service retrieved successfully", service });
  } catch (err) {
    return handleApiError(err);
  }
}

async function updateService(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    const { service_name, service_description, visibility_status } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Service ID is required" }, { status: 400 });
    }

    if (!service_name || String(service_name).trim() === "") {
      return NextResponse.json({ message: "Service name is required" }, { status: 400 });
    }

    if (typeof visibility_status !== "boolean") {
      return NextResponse.json({ message: "Visibility status must be boolean" }, { status: 400 });
    }

    const existingService = await Service.getServiceById(id);
    if (!existingService) {
      return NextResponse.json({ message: "Service does not exist" }, { status: 404 });
    }

    const duplicateService = await Service.getServiceByName(String(service_name).trim());
    if (duplicateService && duplicateService.id !== parseInt(id, 10)) {
      return NextResponse.json({ message: "Service with this name already exists" }, { status: 409 });
    }

    const updatedService = await Service.updateService(
      id,
      String(service_name).trim(),
      service_description ? String(service_description).trim() : "",
      visibility_status
    );

    if (!updatedService) {
      return NextResponse.json({ message: "Failed to update service" }, { status: 400 });
    }

    return NextResponse.json({ message: "Service updated successfully", service: updatedService });
  } catch (err) {
    return handleApiError(err);
  }
}

async function deleteService(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Service ID is required" }, { status: 400 });
    }

    const existingService = await Service.getServiceById(id);
    if (!existingService) {
      return NextResponse.json({ message: "Service does not exist" }, { status: 404 });
    }

    const deletedService = await Service.deleteService(id);
    return NextResponse.json({ message: "Service deleted successfully", service: deletedService });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Service", getServiceById);
export const PUT = withActivityLog("Updated Service", updateService);
export const DELETE = withActivityLog("Deleted Service", deleteService);
