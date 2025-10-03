import { NextRequest, NextResponse } from "next/server";
import { getCachedPhoto } from "@/lib/actions/photo-cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const photoId = parseInt(id);

    if (isNaN(photoId)) {
      return NextResponse.json({ error: "Invalid photo ID" }, { status: 400 });
    }

    const photo = await getCachedPhoto(photoId);

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error("[API /api/photos/[id]] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 },
    );
  }
}
