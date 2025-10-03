"use client";

// Rover profile page - Instagram-like profile for individual rovers
// Shows rover information and their photo feed

import { use, useState } from "react";
import { useInfinitePhotos } from "@/lib/hooks/useMarsPhotos";
import { PhotoGrid } from "@/components/feed/PhotoGrid";
import { RoverHeader } from "@/components/rover/RoverHeader";
import { CameraFilter } from "@/components/common/CameraFilter";
import { DateNavigation } from "@/components/common/DateNavigation";
import { ViewToggle } from "@/components/common/ViewToggle";
import { ROVER_PROFILES, isValidRoverId } from "@/lib/constants/rovers";
import { notFound } from "next/navigation";
import { useViewMode } from "@/lib/providers/view-mode-provider";

interface RoverPageProps {
  readonly params: Promise<{ rover: string }>;
}

export default function RoverPage({ params }: RoverPageProps) {
  const resolvedParams = use(params);
  const roverId = resolvedParams.rover;
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { viewMode } = useViewMode();

  // Validate rover ID
  if (!isValidRoverId(roverId)) {
    notFound();
  }

  const profile = ROVER_PROFILES[roverId];

  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePhotos(roverId, selectedCamera, selectedDate);

  const allPhotos = data?.pages.flatMap((page) => page.photos) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <RoverHeader profile={profile} />
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Error loading photos. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RoverHeader profile={profile} />

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex gap-3 flex-wrap">
          <CameraFilter
            roverId={roverId}
            selectedCamera={selectedCamera}
            onCameraChange={setSelectedCamera}
          />
          <DateNavigation
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>

      <main className="pb-8">
        {isPending ? (
          <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading photos...</div>
            </div>
          </div>
        ) : allPhotos.length === 0 ? (
          <div className="max-w-2xl mx-auto p-4">
            <div className="text-center py-12 text-gray-500">
              No photos available for this rover.
            </div>
          </div>
        ) : (
          <>
            {/* View toggle - Instagram style positioning */}
            <div className="border-b border-gray-200 bg-white">
              <div className="max-w-2xl mx-auto px-4 py-3 flex justify-center">
                <ViewToggle />
              </div>
            </div>

            <PhotoGrid photos={allPhotos} viewMode={viewMode} />

            {hasNextPage && (
              <div className="max-w-2xl mx-auto px-4 mt-4">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  {isFetchingNextPage ? "Loading more..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
