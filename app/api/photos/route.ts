import { NextRequest, NextResponse } from "next/server";
import { fetchLatestPhotos, fetchMixedFeed } from "@/lib/actions/mars-photos";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rover = searchParams.get("rover");
    const camera = searchParams.get("camera");
    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page") || "1");

    console.log('[API /api/photos] Request:', { rover, camera, date, page });

    // Fetch photos based on rover, camera, and date parameters
    let result;
    if (rover) {
      result = await fetchLatestPhotos(rover, page, camera, date);
    } else {
      // Mixed feed (no camera or date filter support for mixed feed)
      result = await fetchMixedFeed(page);
    }

    console.log('[API /api/photos] Success:', { photoCount: result.photos.length, hasNextPage: !!result.nextPage });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API /api/photos] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch photos";
    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 },
    );
  }
}
