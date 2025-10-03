import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { photoId, roverId, photoUrl, photoSol, photoEarthDate, cameraName } =
    body;

  if (
    !photoId ||
    !roverId ||
    !photoUrl ||
    photoSol === undefined ||
    !photoEarthDate ||
    !cameraName
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_photoId: {
        userId: session.user.id,
        photoId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ favorited: false });
  } else {
    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        photoId,
        roverId,
        photoUrl,
        photoSol,
        photoEarthDate,
        cameraName,
      },
    });
    return NextResponse.json({ favorited: true });
  }
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favorites);
}
