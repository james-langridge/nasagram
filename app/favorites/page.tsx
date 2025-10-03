import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { generateBlurDataUrl } from "@/lib/calculations/photo-utils";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No favorites yet</p>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Browse Mars photos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="relative aspect-square bg-gray-100"
            >
              <Image
                src={favorite.photoUrl}
                alt={`Mars photo from ${favorite.roverId} on sol ${favorite.photoSol}`}
                fill
                sizes="(max-width: 768px) 33vw, 25vw"
                className="object-cover"
                loading="lazy"
                placeholder="blur"
                blurDataURL={generateBlurDataUrl()}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
