"use client";

import { useInfinitePhotos } from "@/lib/hooks/useMarsPhotos";
import { PhotoGrid } from "@/components/feed/PhotoGrid";

export default function Home() {
  // Home page shows mixed feed, no camera or date filter
  const {
    data,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    failureReason,
  } = useInfinitePhotos(null, null, null);

  // Flatten all pages into single array
  const allPhotos = data?.pages.flatMap((page) => page.photos) || [];

  // Debug info for production
  console.log('[Home] Query state:', {
    isPending,
    isError,
    hasData: !!data,
    photoCount: allPhotos.length,
    error: error?.message || error,
    failureReason,
  });

  if (error || isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p className="font-semibold">Error loading photos</p>
            <p className="text-sm mt-2">
              {error instanceof Error ? error.message : 'Please try again later'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              No photos available. Please try refreshing the page.
            </div>
          </div>
        ) : (
          <>
            <PhotoGrid photos={allPhotos} />

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
