import { NextResponse } from "next/server";
import PricingItem from "@/models/PricingItem";
import { requireAuth, handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

const parseVisibilityStatus = (value, fallback = true) => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const validatePricingPayload = (body) => {
  const pricingItem = body.pricing_item;
  const amount = Number(body.amount);
  const displayOrder = Number(body.display_order);

  if (!pricingItem || String(pricingItem).trim() === "") {
    return { error: "Pricing item is required" };
  }

  if (
    body.amount === undefined ||
    body.amount === null ||
    body.amount === "" ||
    Number.isNaN(amount) ||
    !Number.isFinite(amount)
  ) {
    return { error: "Amount is required and must be a valid number" };
  }

  if (amount < 0) {
    return { error: "Amount cannot be negative" };
  }

  if (
    body.display_order === undefined ||
    body.display_order === null ||
    body.display_order === "" ||
    !Number.isInteger(displayOrder)
  ) {
    return { error: "Display order is required and must be an integer" };
  }

  if (displayOrder < 0) {
    return { error: "Display order cannot be negative" };
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
      pricingItem: String(pricingItem).trim(),
      amount,
      displayOrder,
      notes: body.notes ? String(body.notes).trim() : "",
      visibilityStatus: parseVisibilityStatus(body.visibility_status, true),
    },
  };
};

async function getPricingItemById(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Pricing item ID is required" }, { status: 400 });
    }

    const pricingItem = await PricingItem.getPricingItemById(id);
    if (!pricingItem) {
      return NextResponse.json({ message: "Pricing item does not exist" }, { status: 404 });
    }

    return NextResponse.json({ message: "Pricing item retrieved successfully", pricing_item: pricingItem });
  } catch (err) {
    return handleApiError(err);
  }
}

async function updatePricingItem(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Pricing item ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const validation = validatePricingPayload(body);
    if (validation.error) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }

    const existingPricingItem = await PricingItem.getPricingItemById(id);
    if (!existingPricingItem) {
      return NextResponse.json({ message: "Pricing item does not exist" }, { status: 404 });
    }

    const { pricingItem, amount, displayOrder, notes, visibilityStatus } = validation.data;
    const duplicatePricingItem = await PricingItem.getPricingItemByName(pricingItem);
    if (duplicatePricingItem && duplicatePricingItem.id !== parseInt(id, 10)) {
      return NextResponse.json({ message: "Pricing item with this name already exists" }, { status: 409 });
    }

    const updatedPricingItem = await PricingItem.updatePricingItem(
      id,
      pricingItem,
      amount,
      displayOrder,
      notes,
      visibilityStatus
    );

    if (!updatedPricingItem) {
      return NextResponse.json({ message: "Failed to update pricing item" }, { status: 400 });
    }

    return NextResponse.json({ message: "Pricing item updated successfully", pricing_item: updatedPricingItem });
  } catch (err) {
    return handleApiError(err);
  }
}

async function deletePricingItem(request, { params }) {
  try {
    requireAuth(request);

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "Pricing item ID is required" }, { status: 400 });
    }

    const existingPricingItem = await PricingItem.getPricingItemById(id);
    if (!existingPricingItem) {
      return NextResponse.json({ message: "Pricing item does not exist" }, { status: 404 });
    }

    const deletedPricingItem = await PricingItem.deletePricingItem(id);
    return NextResponse.json({ message: "Pricing item deleted successfully", pricing_item: deletedPricingItem });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Pricing Item", getPricingItemById);
export const PUT = withActivityLog("Updated Pricing Item", updatePricingItem);
export const DELETE = withActivityLog("Deleted Pricing Item", deletePricingItem);
