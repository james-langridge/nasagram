import { NextRequest, NextResponse } from "next/server";
import { fetchLatestPhotos, fetchMixedFeed } from "@/lib/actions/mars-photos";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rover = searchParams.get("rover");
    const camera = searchParams.get("camera");
    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page") || "1");

    // Fetch photos based on rover, camera, and date parameters
    let result;
    if (rover) {
      result = await fetchLatestPhotos(rover, page, camera, date);
    } else {
      // Mixed feed (no camera or date filter support for mixed feed)
      result = await fetchMixedFeed(page);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 },
    );
  }
}
