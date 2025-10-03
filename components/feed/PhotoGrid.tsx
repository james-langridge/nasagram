import type { Photo } from "mars-photo-sdk";
import { PhotoCard } from "./PhotoCard";
import { getPhotoKey } from "@/lib/calculations/photo-utils";

interface PhotoGridProps {
  readonly photos: readonly Photo[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <p className="text-lg">No photos found</p>
        <p className="text-sm mt-2">Try a different rover or date</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {photos.map((photo) => (
        <PhotoCard key={getPhotoKey(photo)} photo={photo} />
      ))}
    </div>
  );
}
