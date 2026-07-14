import { NextResponse } from "next/server";
import Document from "@/models/Document";
import { uploadToS3, deleteFromS3 } from "@/lib/server/s3";
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

async function getDocumentById(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Document ID is required" }, { status: 400 });
    }

    const document = await Document.getDocumentById(id);
    if (!document) {
      return NextResponse.json({ message: "Document does not exist" }, { status: 404 });
    }

    return NextResponse.json({ message: "Document retrieved successfully", document });
  } catch (err) {
    return handleApiError(err);
  }
}

async function updateDocument(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Document ID is required" }, { status: 400 });
    }

    const existingDocument = await Document.getDocumentById(id);
    if (!existingDocument) {
      return NextResponse.json({ message: "Document does not exist" }, { status: 404 });
    }

    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());
    const file = await fileFromFormData(formData, "document_file");

    const validation = validateDocumentPayload(body, file, existingDocument);
    if (validation.error) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }

    const { documentName, documentType, notes, visibilityStatus } = validation.data;
    const duplicateDocument = await Document.getDocumentByName(documentName);
    if (duplicateDocument && duplicateDocument.id !== parseInt(id, 10)) {
      return NextResponse.json({ message: "Document with this name already exists" }, { status: 409 });
    }

    let documentUrl = validation.data.documentUrl;
    if (file) {
      documentUrl = await uploadToS3(file, "documents");

      if (existingDocument.document_url) {
        await deleteFromS3(existingDocument.document_url);
      }
    }

    const updatedDocument = await Document.updateDocument(id, {
      documentName,
      documentType,
      documentUrl,
      notes,
      visibilityStatus,
    });

    return NextResponse.json({ message: "Document updated successfully", document: updatedDocument });
  } catch (err) {
    return handleApiError(err);
  }
}

async function deleteDocument(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Document ID is required" }, { status: 400 });
    }

    const existingDocument = await Document.getDocumentById(id);
    if (!existingDocument) {
      return NextResponse.json({ message: "Document does not exist" }, { status: 404 });
    }

    const deletedDocument = await Document.deleteDocument(id);

    if (existingDocument.document_url) {
      await deleteFromS3(existingDocument.document_url);
    }

    return NextResponse.json({ message: "Document deleted successfully", document: deletedDocument });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Document", getDocumentById);
export const PUT = withActivityLog("Updated Document", updateDocument);
export const DELETE = withActivityLog("Deleted Document", deleteDocument);
