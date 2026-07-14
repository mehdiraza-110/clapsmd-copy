import { NextResponse } from "next/server";
import Document from "@/models/Document";
import { handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getPublicDocuments() {
  try {
    const documents = await Document.getAllDocuments({ visibilityStatus: true });

    return NextResponse.json({
      message: "Public documents retrieved successfully",
      document_types: Document.getDocumentTypes(),
      documents,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Public Documents", getPublicDocuments);
