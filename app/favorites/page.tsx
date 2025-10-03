import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import type { Photo } from "mars-photo-sdk";
import { FavoritesContent } from "@/components/favorites/FavoritesContent";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Transform Favorite records into Photo objects for PhotoGrid
  // Note: Using type assertion since Favorite schema stores strings
  // but Photo type expects specific union types
  const photos: Photo[] = favorites.map((favorite) => ({
    id: favorite.photoId,
    sol: favorite.photoSol,
    camera: {
      id: 0,
      name: favorite.cameraName as unknown as Photo["camera"]["name"],
      fullName: favorite.cameraName,
      rover_id: 0,
    },
    imgSrc: favorite.photoUrl,
    earthDate: favorite.photoEarthDate,
    rover: {
      id: 0,
      name: favorite.roverId as unknown as Photo["rover"]["name"],
      landing_date: "",
      launch_date: "",
      status: "active",
    },
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
        <FavoritesContent photos={photos} />
      </div>
    </div>
  );
}
