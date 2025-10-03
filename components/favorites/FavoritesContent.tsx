"use client";

import { PhotoGrid } from "@/components/feed/PhotoGrid";
import { useViewMode } from "@/lib/providers/view-mode-provider";
import type { Photo } from "mars-photo-sdk";
import Link from "next/link";

interface FavoritesContentProps {
  photos: Photo[];
}

export function FavoritesContent({ photos }: FavoritesContentProps) {
  const { viewMode } = useViewMode();

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No favorites yet</p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Browse Mars photos
        </Link>
      </div>
    );
  }

  return <PhotoGrid photos={photos} viewMode={viewMode} />;
}
