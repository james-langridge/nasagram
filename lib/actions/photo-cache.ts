// Action layer: Photo cache operations for deep linking
// Stores and retrieves photo metadata from database

import prisma from "@/lib/prisma";
import type { Photo } from "mars-photo-sdk";
import { normalizeImageUrl } from "@/lib/calculations/photo-utils";

export interface CachedPhoto {
  readonly photoId: number;
  readonly roverId: string;
  readonly photoUrl: string;
  readonly photoSol: number;
  readonly photoEarthDate: string;
  readonly cameraName: string;
  readonly cameraFullName: string | null;
}

/**
 * Save photo metadata to cache for deep linking support
 * Uses upsert to update if already exists
 */
export async function cachePhoto(photo: Photo): Promise<void> {
  const photoUrl = normalizeImageUrl(photo.imgSrc || photo.img_src);

  await prisma.photoCache.upsert({
    where: { photoId: photo.id },
    update: {
      roverId: photo.rover.name,
      photoUrl,
      photoSol: photo.sol,
      photoEarthDate: photo.earthDate || photo.earth_date || "",
      cameraName: photo.camera.name,
      cameraFullName: photo.camera.fullName || photo.camera.full_name || null,
      updatedAt: new Date(),
    },
    create: {
      photoId: photo.id,
      roverId: photo.rover.name,
      photoUrl,
      photoSol: photo.sol,
      photoEarthDate: photo.earthDate || photo.earth_date || "",
      cameraName: photo.camera.name,
      cameraFullName: photo.camera.fullName || photo.camera.full_name || null,
    },
  });
}

/**
 * Retrieve photo metadata from cache
 * Returns null if not found
 */
export async function getCachedPhoto(
  photoId: number,
): Promise<CachedPhoto | null> {
  const cached = await prisma.photoCache.findUnique({
    where: { photoId },
  });

  if (!cached) {
    return null;
  }

  return {
    photoId: cached.photoId,
    roverId: cached.roverId,
    photoUrl: cached.photoUrl,
    photoSol: cached.photoSol,
    photoEarthDate: cached.photoEarthDate,
    cameraName: cached.cameraName,
    cameraFullName: cached.cameraFullName,
  };
}

/**
 * Transform cached photo data to SDK Photo type
 * For use in components that expect Photo objects
 */
export function cachedPhotoToPhoto(cached: CachedPhoto): Photo {
  return {
    id: cached.photoId,
    sol: cached.photoSol,
    camera: {
      id: 0,
      name: cached.cameraName as Photo["camera"]["name"],
      fullName: cached.cameraFullName || cached.cameraName,
      rover_id: 0,
    },
    imgSrc: cached.photoUrl,
    earthDate: cached.photoEarthDate,
    rover: {
      id: 0,
      name: cached.roverId as Photo["rover"]["name"],
      landing_date: "",
      launch_date: "",
      status: "active",
    },
  };
}
