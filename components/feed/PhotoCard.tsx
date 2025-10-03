import Image from "next/image";
import type { Photo } from "mars-photo-sdk";
import {
  formatSol,
  formatEarthDate,
  generatePhotoCaption,
  generateBlurDataUrl,
} from "@/lib/calculations/photo-utils";
import { ROVER_PROFILES } from "@/lib/constants/rovers";

interface PhotoCardProps {
  readonly photo: Photo;
}

export function PhotoCard({ photo }: PhotoCardProps) {
  const roverProfile = ROVER_PROFILES[photo.rover.name.toLowerCase()];

  return (
    <article className="bg-white border border-gray-200 mb-4">
      {/* Header with rover info */}
      <div className="flex items-center p-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          <span className="text-xs font-semibold">
            {photo.rover.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center">
            <span className="font-semibold text-sm">
              {roverProfile?.displayName || photo.rover.name}
            </span>
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

      {/* Photo */}
      <div className="relative aspect-square bg-gray-100">
        {photo.imgSrc && (
          <Image
            src={photo.imgSrc}
            alt={generatePhotoCaption(photo)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
            placeholder="blur"
            blurDataURL={generateBlurDataUrl()}
          />
        )}
      </div>

      {/* Action buttons */}
      <div className="p-3">
        <div className="flex items-center mb-2">
          <button className="mr-4 hover:text-gray-500" aria-label="Like">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button className="mr-4 hover:text-gray-500" aria-label="Share">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
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
