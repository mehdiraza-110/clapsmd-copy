import { NextResponse } from "next/server";
import { publishDueAnnouncements } from "@/lib/server/jobs/announcementPublisher";

// Vercel Cron always invokes with GET, sending `Authorization: Bearer $CRON_SECRET`.
export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await publishDueAnnouncements();
    return NextResponse.json({ message: "Announcement publish job completed", ...results });
  } catch (err) {
    console.error("[announcement-cron] Failed to process due announcements:", err.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
