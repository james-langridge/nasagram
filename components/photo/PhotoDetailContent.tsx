"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ShareButton } from "@/components/common/ShareButton";
import { FavoriteButton } from "@/components/feed/FavoriteButton";
import { generateBlurDataUrl } from "@/lib/calculations/photo-utils";
import type { Photo } from "mars-photo-sdk";
import { ROVER_PROFILES } from "@/lib/constants/rovers";

interface PhotoDetailContentProps {
  photo: Photo;
  initialFavorited?: boolean;
}

export function PhotoDetailContent({
  photo,
  initialFavorited = false,
}: PhotoDetailContentProps) {
  const roverProfile = ROVER_PROFILES[photo.rover.name.toLowerCase()];

  return (
    <div className="min-h-screen bg-black">
      {/* Header with back button and actions */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-white">
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-4">
              <FavoriteButton
                photo={photo}
                initialFavorited={initialFavorited}
              />
              <ShareButton
                photo={photo}
                dropdownPosition="below"
                dropdownAlign="right"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Photo */}
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <div className="relative w-full max-w-4xl aspect-square">
          <Image
            src={photo.imgSrc || photo.img_src || ""}
            alt={`Mars photo from ${photo.rover.name} on sol ${photo.sol}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
            placeholder="blur"
            blurDataURL={generateBlurDataUrl()}
          />
        </div>
      </div>

      {/* Metadata footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-white space-y-3">
            {/* Rover info */}
            <div className="flex items-center gap-3">
              <Link
                href={`/${photo.rover.name.toLowerCase()}`}
                className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
              >
                <span className="text-sm font-semibold">
                  {photo.rover.name.charAt(0)}
                </span>
              </Link>
              <div>
                <Link
                  href={`/${photo.rover.name.toLowerCase()}`}
                  className="font-semibold hover:text-gray-300"
                >
                  {roverProfile?.displayName || photo.rover.name}
                </Link>
                <p className="text-sm text-gray-400">
                  {photo.camera.fullName ||
                    photo.camera.full_name ||
                    photo.camera.name}
                </p>
              </div>
            </div>

            {/* Photo details */}
            <div className="text-sm text-gray-300 space-y-1">
              <p>
                Sol {photo.sol} • {photo.earthDate || photo.earth_date}
              </p>
              <p className="text-xs text-gray-400">Photo ID: {photo.id}</p>
            </div>

            {/* View full resolution */}
            <a
              href={photo.imgSrc || photo.img_src || ""}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              View Full Resolution
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
