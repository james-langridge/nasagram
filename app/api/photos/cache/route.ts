import { NextRequest, NextResponse } from "next/server";
import { cachePhoto } from "@/lib/actions/photo-cache";
import type { Photo } from "mars-photo-sdk";

export async function POST(request: NextRequest) {
  try {
    const photo: Photo = await request.json();

    await cachePhoto(photo);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API /api/photos/cache] Error:", error);
    return NextResponse.json(
      { error: "Failed to cache photo" },
      { status: 500 },
    );
  }
}
