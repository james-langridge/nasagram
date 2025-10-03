"use client";

import type { Photo } from "mars-photo-sdk";
import { PhotoCard } from "./PhotoCard";
import {
  getPhotoKey,
  generateBlurDataUrl,
  normalizeImageUrl,
} from "@/lib/calculations/photo-utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PhotoGridProps {
  readonly photos: readonly Photo[];
  readonly viewMode?: "feed" | "grid";
}

export function PhotoGrid({ photos, viewMode = "feed" }: PhotoGridProps) {
  const router = useRouter();
  const [cachingPhotoId, setCachingPhotoId] = useState<number | null>(null);
  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <p className="text-lg">No photos found</p>
        <p className="text-sm mt-2">Try a different rover or date</p>
      </div>
    );
  }

  // Grid view: 3-column grid of square images
  if (viewMode === "grid") {
    const handlePhotoClick = async (e: React.MouseEvent, photo: Photo) => {
      e.preventDefault(); // Prevent immediate navigation

      if (cachingPhotoId === photo.id) return; // Prevent double-clicks

      try {
        // Check if photo is already cached
        const checkResponse = await fetch(`/api/photos/${photo.id}`);

        if (checkResponse.ok) {
          // Already cached - navigate immediately without spinner
          router.push(`/photo/${photo.id}`);
          return;
        }

        // Not cached - show spinner and cache it
        setCachingPhotoId(photo.id);

        await fetch("/api/photos/cache", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(photo),
        });

        // Navigate after caching completes
        router.push(`/photo/${photo.id}`);
      } catch (error) {
        console.error("Failed to handle photo click:", error);
        setCachingPhotoId(null);
        // Still navigate even if cache fails
        router.push(`/photo/${photo.id}`);
      }
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-1">
          {photos.map((photo) => {
            const photoUrl = `/photo/${photo.id}`;
            const isCaching = cachingPhotoId === photo.id;

            return (
              <Link
                key={getPhotoKey(photo)}
                href={photoUrl}
                onClick={(e) => handlePhotoClick(e, photo)}
                className="relative aspect-square bg-gray-100 hover:opacity-90 transition-opacity"
              >
                <Image
                  src={normalizeImageUrl(photo.imgSrc || photo.img_src)}
                  alt={`Mars photo from ${photo.rover.name} on sol ${photo.sol}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={generateBlurDataUrl()}
                />
                {/* Loading overlay */}
                {isCaching && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Feed view: single column with full photo cards
  return (
    <div className="max-w-2xl mx-auto">
      {photos.map((photo) => (
        <PhotoCard key={getPhotoKey(photo)} photo={photo} />
      ))}
    </div>
  );
}
