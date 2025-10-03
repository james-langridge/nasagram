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
): Promise<PhotosResponse> {
  const params = new URLSearchParams();
  if (rover) params.append("rover", rover);
  params.append("page", page.toString());

  const response = await fetch(`/api/photos?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch photos");
  }

  return response.json();
}

export function useInfinitePhotos(rover: string | null = null) {
  return useInfiniteQuery({
    queryKey: ["photos", rover],
    queryFn: ({ pageParam = 1 }) => fetchPhotosFromAPI(rover, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
}
