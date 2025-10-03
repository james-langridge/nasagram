import type { Photo } from "mars-photo-sdk";
import { PhotoCard } from "./PhotoCard";
import { getPhotoKey, generateBlurDataUrl } from "@/lib/calculations/photo-utils";
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
    return (
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-1">
          {photos.map((photo) => {
            const photoUrl = `/photo/${photo.id}?img=${encodeURIComponent(photo.imgSrc || photo.img_src || "")}&rover=${photo.rover.name}&camera=${photo.camera.name}&sol=${photo.sol}&earthDate=${photo.earthDate || photo.earth_date || ""}`;

            return (
              <Link
                key={getPhotoKey(photo)}
                href={photoUrl}
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
