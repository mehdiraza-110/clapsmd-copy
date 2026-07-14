import { NextResponse } from "next/server";
import PricingItem from "@/models/PricingItem";
import { handleApiError } from "@/lib/server/auth";
import { withActivityLog } from "@/lib/server/activityLog";

async function getVisiblePricingItems() {
  try {
    const pricingItems = await PricingItem.getAllPricingItems({ visibilityStatus: true });
    return NextResponse.json({
      message: "Visible pricing items retrieved successfully",
      pricing_items: pricingItems,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export const GET = withActivityLog("Fetched Visible Pricing Items", getVisiblePricingItems);
