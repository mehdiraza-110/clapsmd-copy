import { NextResponse } from "next/server";
import Document from "@/models/Document";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getDocumentTypes(request) {
  try {
    requireAuth(request);

    return NextResponse.json({
      message: "Document types retrieved successfully",
      document_types: Document.getDocumentTypes(),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Document Types", getDocumentTypes);
