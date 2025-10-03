"use client";

// React hook for fetching Mars photos with infinite scroll
// Orchestrates API calls with React Query

import { useInfiniteQuery } from "@tanstack/react-query";
import type { Photo } from "mars-photo-sdk";

interface PhotosResponse {
  readonly photos: readonly Photo[];
  readonly nextPage: number | null;
}

async function fetchPhotosFromAPI(
  rover: string | null,
  page: number,
  camera: string | null = null,
  date: string | null = null,
): Promise<PhotosResponse> {
  const params = new URLSearchParams();
  if (rover) params.append("rover", rover);
  if (camera) params.append("camera", camera);
  if (date) params.append("date", date);
  params.append("page", page.toString());

  const url = `/api/photos?${params.toString()}`;
  console.log('[fetchPhotosFromAPI] Fetching:', url);

  const response = await fetch(url);

  console.log('[fetchPhotosFromAPI] Response:', {
    status: response.status,
    ok: response.ok,
    headers: Object.fromEntries(response.headers.entries())
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error('[fetchPhotosFromAPI] Error response:', errorData);
    throw new Error(errorData.error || `Failed to fetch photos: ${response.status}`);
  }

  const data = await response.json();
  console.log('[fetchPhotosFromAPI] Data:', { photoCount: data.photos?.length, hasNextPage: !!data.nextPage });
  return data;
}

export function useInfinitePhotos(
  rover: string | null = null,
  camera: string | null = null,
  date: string | null = null,
) {
  return useInfiniteQuery({
    queryKey: ["photos", rover, camera, date],
    queryFn: async ({ pageParam = 1 }) => {
      console.log('[useInfinitePhotos] Fetching:', { rover, camera, date, page: pageParam });
      const result = await fetchPhotosFromAPI(rover, pageParam, camera, date);
      console.log('[useInfinitePhotos] Result:', { photoCount: result.photos.length, nextPage: result.nextPage });
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: true, // Explicitly enable the query
  });
}
