"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Photo } from "mars-photo-sdk";
import {
  formatSol,
  formatEarthDate,
  generatePhotoCaption,
  generateBlurDataUrl,
} from "@/lib/calculations/photo-utils";
import { ROVER_PROFILES } from "@/lib/constants/rovers";
import { FavoriteButton } from "./FavoriteButton";
import { ShareButton } from "@/components/common/ShareButton";

interface PhotoCardProps {
  readonly photo: Photo;
}

export function PhotoCard({ photo }: PhotoCardProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const roverProfile = ROVER_PROFILES[photo.rover.name.toLowerCase()];

  // Cache photo before navigation to ensure it's available
  const handlePhotoClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent immediate navigation

    if (isNavigating) return; // Prevent double-clicks

    setIsNavigating(true);

    try {
      // Cache photo and wait for completion
      await fetch("/api/photos/cache", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photo),
      });

      // Navigate after caching completes
      router.push(`/photo/${photo.id}`);
    } catch (error) {
      console.error("Failed to cache photo:", error);
      setIsNavigating(false);
      // Still navigate even if cache fails
      router.push(`/photo/${photo.id}`);
    }
  };

  // Clean photo detail URL
  const photoDetailUrl = `/photo/${photo.id}`;

  return (
    <article className="bg-white border border-gray-200 mb-4">
      {/* Header with rover info */}
      <div className="flex items-center p-3">
        <Link
          href={`/${photo.rover.name.toLowerCase()}`}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 hover:bg-gray-300"
        >
          <span className="text-xs font-semibold">
            {photo.rover.name.charAt(0)}
          </span>
        </Link>
        <div className="flex-1">
          <div className="flex items-center">
            <Link
              href={`/${photo.rover.name.toLowerCase()}`}
              className="font-semibold text-sm hover:text-gray-600"
            >
              {roverProfile?.displayName || photo.rover.name}
            </Link>
            {roverProfile?.verified && (
              <svg
                className="w-4 h-4 ml-1 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {roverProfile?.location || "Mars"}
          </span>
        </div>
      </div>

      {/* Photo - clickable to detail page */}
      <Link href={photoDetailUrl} className="block" onClick={handlePhotoClick}>
        <div className="relative aspect-square bg-gray-100">
          {photo.imgSrc && (
            <Image
              src={photo.imgSrc}
              alt={generatePhotoCaption(photo)}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover hover:opacity-95 transition-opacity"
              loading="lazy"
              placeholder="blur"
              blurDataURL={generateBlurDataUrl()}
            />
          )}
          {/* Loading overlay */}
          {isNavigating && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </Link>

      {/* Action buttons */}
      <div className="p-3">
        <div className="flex items-center mb-2">
          <div className="mr-4">
            <FavoriteButton photo={photo} />
          </div>
          <div className="mr-4">
            <ShareButton photo={photo} />
          </div>
        </div>

        {/* Caption */}
        <div className="text-sm">
          <span className="font-semibold mr-2">
            {roverProfile?.displayName || photo.rover.name}
          </span>
          <span className="text-gray-700">{generatePhotoCaption(photo)}</span>
        </div>

        {/* Date */}
        <div className="text-xs text-gray-400 mt-1">
          {formatSol(photo.sol)}
          {photo.earthDate && <> • {formatEarthDate(photo.earthDate)}</>}
        </div>
      </div>
    </article>
  );
}
