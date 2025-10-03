// Action layer: Check if photo is favorited by current user

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function isPhotoFavorited(photoId: number): Promise<boolean> {
  const session = await auth();

  if (!session?.user?.id) {
    return false;
  }

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_photoId: {
        userId: session.user.id,
        photoId,
      },
    },
  });

  return !!favorite;
}
