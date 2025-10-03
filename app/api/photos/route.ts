import { NextRequest, NextResponse } from "next/server";
import { fetchLatestPhotos, fetchMixedFeed } from "@/lib/actions/mars-photos";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rover = searchParams.get("rover");
    const page = parseInt(searchParams.get("page") || "1");

    // Fetch photos based on rover parameter
    const result = rover
      ? await fetchLatestPhotos(rover, page)
      : await fetchMixedFeed(page);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 },
    );
  }
}
