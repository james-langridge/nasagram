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
  } = useInfinitePhotos(null, null, null);

  // Flatten all pages into single array
  const allPhotos = data?.pages.flatMap((page) => page.photos) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <main className="pb-8">
        {isPending ? (
          <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading photos...</div>
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
