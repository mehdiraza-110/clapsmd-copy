import { NextResponse } from "next/server";
import { publishDueBlogs } from "@/lib/server/jobs/blogPublisher";

// Vercel Cron always invokes with GET, sending `Authorization: Bearer $CRON_SECRET`.
export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await publishDueBlogs();
    return NextResponse.json({ message: "Blog publish job completed", ...results });
  } catch (err) {
    console.error("[blog-cron] Failed to process due blogs:", err.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
