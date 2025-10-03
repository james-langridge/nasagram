"use client";

// Photo detail page - Full view of a single Mars photo
// Shows photo metadata and share options

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { generateBlurDataUrl } from "@/lib/calculations/photo-utils";
import { ROVER_PROFILES } from "@/lib/constants/rovers";
import { ShareButton } from "@/components/common/ShareButton";
import type { Photo } from "mars-photo-sdk";

interface PhotoDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

export default function PhotoDetailPage({ params }: PhotoDetailPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();

  // For now, we'll get photo data from URL search params
  // This is a simple approach for Phase 3 MVP
  const photoData = {
    id: parseInt(resolvedParams.id),
    imgSrc: searchParams.get("img") || "",
    rover: {
      name: searchParams.get("rover") || "Unknown",
    },
    camera: {
      name: searchParams.get("camera") || "Unknown",
      fullName: searchParams.get("cameraFull") || "Unknown Camera",
    },
    sol: parseInt(searchParams.get("sol") || "0"),
    earthDate: searchParams.get("earthDate") || "",
  };

  if (!photoData.imgSrc) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Photo not found</h1>
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const roverProfile =
    ROVER_PROFILES[
      photoData.rover.name.toLowerCase() as keyof typeof ROVER_PROFILES
    ];

  // Create a Photo object for the ShareButton
  const photo: Photo = {
    id: photoData.id,
    imgSrc: photoData.imgSrc,
    rover: {
      name: photoData.rover.name,
    } as Photo["rover"],
    camera: {
      name: photoData.camera.name,
      fullName: photoData.camera.fullName,
    } as Photo["camera"],
    sol: photoData.sol,
    earthDate: photoData.earthDate,
  } as Photo;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-white hover:text-gray-300 flex items-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-white">
              <ShareButton
                photo={photo}
                className="text-white"
                dropdownPosition="below"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Photo */}
            <div className="lg:col-span-2">
              <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
                <Image
                  src={photoData.imgSrc}
                  alt={`Mars photo ${photoData.id}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-contain"
                  priority
                  placeholder="blur"
                  blurDataURL={generateBlurDataUrl()}
                />
              </div>
            </div>

            {/* Metadata sidebar */}
            <div className="bg-gray-900 rounded-lg p-6 text-white">
              {/* Rover info */}
              <div className="flex items-center mb-6 pb-6 border-b border-gray-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mr-3">
                  <span className="text-lg font-bold">
                    {photoData.rover.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center">
                    <Link
                      href={`/${photoData.rover.name.toLowerCase()}`}
                      className="font-semibold hover:text-gray-300"
                    >
                      {roverProfile?.displayName || photoData.rover.name}
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
                  <div className="text-sm text-gray-400">
                    {roverProfile?.location || "Mars"}
                  </div>
                </div>
              </div>

              {/* Photo metadata */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Photo Details</h2>

                <div>
                  <div className="text-sm text-gray-400 mb-1">Sol</div>
                  <div className="font-medium">{photoData.sol}</div>
                </div>

                {photoData.earthDate && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Earth Date</div>
                    <div className="font-medium">
                      {new Date(photoData.earthDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm text-gray-400 mb-1">Camera</div>
                  <div className="font-medium">{photoData.camera.fullName}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    ({photoData.camera.name})
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-1">Photo ID</div>
                  <div className="font-mono text-sm">{photoData.id}</div>
                </div>

                {/* Download button */}
                <a
                  href={photoData.imgSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors"
                >
                  View Full Resolution
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
