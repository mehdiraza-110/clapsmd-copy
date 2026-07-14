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

async function createPricingItem(request) {
  try {
    requireAuth(request);

    const body = await request.json();
    const validation = validatePricingPayload(body);
    if (validation.error) {
      return NextResponse.json({ message: validation.error }, { status: 400 });
    }

    const { pricingItem, amount, displayOrder, notes, visibilityStatus } = validation.data;
    const existingPricingItem = await PricingItem.getPricingItemByName(pricingItem);
    if (existingPricingItem) {
      return NextResponse.json({ message: "Pricing item with this name already exists" }, { status: 409 });
    }

    const newPricingItem = await PricingItem.createPricingItem(
      pricingItem,
      amount,
      displayOrder,
      notes,
      visibilityStatus
    );

    return NextResponse.json(
      { message: "Pricing item created successfully", pricing_item: newPricingItem },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}

async function getAllPricingItems(request) {
  try {
    requireAuth(request);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const visibilityStatusParam = searchParams.get("visibility_status");
    const visibilityStatus =
      visibilityStatusParam === null ? undefined : parseVisibilityStatus(visibilityStatusParam, undefined);

    if (visibilityStatusParam !== null && typeof visibilityStatus !== "boolean") {
      return NextResponse.json({ message: "Visibility status must be boolean" }, { status: 400 });
    }

    const pricingItems = await PricingItem.getAllPricingItems({ search, visibilityStatus });
    return NextResponse.json({ message: "Pricing items retrieved successfully", pricing_items: pricingItems });
  } catch (err) {
    return handleApiError(err);
  }
}

export const POST = withActivityLog("Created Pricing Item", createPricingItem);
export const GET = withActivityLog("Fetched Pricing Items", getAllPricingItems);
