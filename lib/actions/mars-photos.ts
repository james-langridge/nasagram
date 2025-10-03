// Action layer: Side effects for fetching Mars photos
// Thin wrapper around mars-photo-sdk

import { MarsPhotosClient } from "mars-photo-sdk";
import type { Photo } from "mars-photo-sdk";

// Initialize client with API key
function getClient() {
  const apiKey =
    process.env.NASA_API_KEY || process.env.NEXT_PUBLIC_NASA_API_KEY;

  if (!apiKey) {
    throw new Error("NASA_API_KEY environment variable is not set");
  }

  return new MarsPhotosClient({ apiKey });
}

export interface FetchPhotosParams {
  readonly rover: string;
  readonly date: string;
  readonly page?: number;
  readonly camera?: string;
}

export interface PhotosResponse {
  readonly photos: readonly Photo[];
  readonly nextPage: number | null;
}

// Fetch photos with pagination
export async function fetchMarsPhotos(
  params: FetchPhotosParams,
): Promise<PhotosResponse> {
  const client = getClient();
  const page = params.page || 1;

  const response = await client.photos.get({
    rover: params.rover,
    date: params.date,
    page,
    camera: params.camera,
  });

  // Determine if there's a next page
  const hasNextPage = response && response.length > 0;

  return {
    photos: response || [],
    nextPage: hasNextPage ? page + 1 : null,
  };
}

// Fetch latest photos from a rover
export async function fetchLatestPhotos(
  rover: string,
  page: number = 1,
  camera?: string | null,
  date?: string | null,
): Promise<PhotosResponse> {
  const client = getClient();

  // Determine which date to use
  let targetDate: string;
  if (date) {
    // Use provided date (could be Earth date YYYY-MM-DD or sol number)
    targetDate = date;
  } else {
    // Get latest manifest to find most recent sol
    const manifest = await client.manifests.get(rover);
    targetDate = (manifest.maxSol || manifest.max_sol || 1000).toString();
  }

  return fetchMarsPhotos({
    rover,
    date: targetDate,
    page,
    camera: camera || undefined,
  });
}

// Fetch photos from all active rovers (for mixed feed)
export async function fetchMixedFeed(
  page: number = 1,
): Promise<PhotosResponse> {
  const activeRovers = ["curiosity", "perseverance"];
  const client = getClient();

  // Get latest sols for both rovers
  const manifests = await Promise.all(
    activeRovers.map((rover) => client.manifests.get(rover)),
  );

  // Fetch photos from both rovers
  const photoResponses = await Promise.all(
    manifests.map((manifest, index) => {
      const latestSol = manifest.maxSol || manifest.max_sol || 1000;
      return fetchMarsPhotos({
        rover: activeRovers[index],
        date: latestSol.toString(),
        page,
      });
    }),
  );

  // Combine and interleave photos
  const allPhotos = photoResponses.flatMap((r) => r.photos);

  return {
    photos: allPhotos,
    nextPage: allPhotos.length > 0 ? page + 1 : null,
  };
}
