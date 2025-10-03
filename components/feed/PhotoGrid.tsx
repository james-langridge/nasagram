import type { Photo } from "mars-photo-sdk";
import { PhotoCard } from "./PhotoCard";
import {
  getPhotoKey,
  generateBlurDataUrl,
} from "@/lib/calculations/photo-utils";
import Image from "next/image";
import Link from "next/link";

interface PhotoGridProps {
  readonly photos: readonly Photo[];
  readonly viewMode?: "feed" | "grid";
}

export function PhotoGrid({ photos, viewMode = "feed" }: PhotoGridProps) {
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
    const handlePhotoClick = (photo: Photo) => {
      // Cache photo in background when clicked
      fetch("/api/photos/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photo),
      }).catch((error) => {
        console.error("Failed to cache photo:", error);
      });
    };

    return (
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-1">
          {photos.map((photo) => {
            const photoUrl = `/photo/${photo.id}`;

            return (
              <Link
                key={getPhotoKey(photo)}
                href={photoUrl}
                onClick={() => handlePhotoClick(photo)}
                className="relative aspect-square bg-gray-100 hover:opacity-90 transition-opacity"
              >
                <Image
                  src={photo.imgSrc || photo.img_src || ""}
                  alt={`Mars photo from ${photo.rover.name} on sol ${photo.sol}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={generateBlurDataUrl()}
                />
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
