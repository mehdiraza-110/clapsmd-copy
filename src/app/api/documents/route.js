import { NextResponse } from "next/server";
import Document from "@/models/Document";
import { uploadToS3 } from "@/lib/server/s3";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";
import { fileFromFormData } from "@/lib/server/upload";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const parseVisibilityStatus = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const isValidDocumentType = (value) => Document.getDocumentTypes().includes(value);

const validateDocumentPayload = (body, file, existingDocument = null) => {
  const documentName = normalizeString(body.document_name);
  const documentType = normalizeString(body.document_type);
  const documentUrl = file ? null : normalizeString(body.document_url) || existingDocument?.document_url || "";

  if (!documentName) {
    return { error: "Document name is required" };
  }

  if (!documentType) {
    return { error: "Document type is required" };
  }

  if (!isValidDocumentType(documentType)) {
    return { error: "Document type is invalid" };
  }

  if (!file && !documentUrl) {
    return { error: "Document file or document_url is required" };
  }

  if (
    body.visibility_status !== undefined &&
    typeof body.visibility_status !== "boolean" &&
    body.visibility_status !== "true" &&
    body.visibility_status !== "false"
  ) {
    return { error: "Visibility status must be boolean" };
  }

  return {
    data: {
      documentName,
      documentType,
      documentUrl,
      notes: body.notes ? String(body.notes).trim() : "",
      visibilityStatus: parseVisibilityStatus(body.visibility_status, existingDocument?.visibility_status ?? true),
    },
  };
};

async function createDocument(request) {
  try {
    requireAuth(request);

    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());
    const file = await fileFromFormData(formData, "document_file");

    const validation = validateDocumentPayload(body, file);
    if (validation.error) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }

    const { documentName, documentType, notes, visibilityStatus } = validation.data;
    const existingDocument = await Document.getDocumentByName(documentName);
    if (existingDocument) {
      return NextResponse.json({ message: "Document with this name already exists" }, { status: 409 });
    }

    const documentUrl = file ? await uploadToS3(file, "documents") : validation.data.documentUrl;
    const document = await Document.createDocument({
      documentName,
      documentType,
      documentUrl,
      notes,
      visibilityStatus,
    });

    return NextResponse.json({ message: "Document created successfully", document }, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}

async function getAllDocuments(request) {
  try {
    requireAuth(request);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const documentType = searchParams.get("document_type")?.trim() || "";
    const visibilityStatusParam = searchParams.get("visibility_status");
    const visibilityStatus =
      visibilityStatusParam === null ? undefined : parseVisibilityStatus(visibilityStatusParam, undefined);

    if (documentType && !isValidDocumentType(documentType)) {
      return NextResponse.json({ message: "Document type is invalid" }, { status: 400 });
    }

    if (visibilityStatusParam !== null && typeof visibilityStatus !== "boolean") {
      return NextResponse.json({ message: "Visibility status must be boolean" }, { status: 400 });
    }

    const documents = await Document.getAllDocuments({ search, documentType, visibilityStatus });
    return NextResponse.json({ message: "Documents retrieved successfully", documents });
  } catch (err) {
    return handleApiError(err);
  }
}

export const POST = withActivityLog("Created Document", createDocument);
export const GET = withActivityLog("Fetched Documents", getAllDocuments);
