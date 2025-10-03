// Action layer: Side effects for fetching Mars photos
// Thin wrapper around mars-photo-sdk

import { MarsPhotosClient } from "mars-photo-sdk";
import type { Photo } from "mars-photo-sdk";

// Initialize client with API key
function getClient() {
  const apiKey =
    process.env.NASA_API_KEY || process.env.NEXT_PUBLIC_NASA_API_KEY;

  if (!apiKey) {
    console.error("[getClient] NASA_API_KEY is missing!", {
      NASA_API_KEY: !!process.env.NASA_API_KEY,
      NEXT_PUBLIC_NASA_API_KEY: !!process.env.NEXT_PUBLIC_NASA_API_KEY,
      env: Object.keys(process.env).filter(
        (k) => k.includes("NASA") || k.includes("API"),
      ),
    });
    throw new Error(
      "NASA_API_KEY environment variable is not set. Please configure it in your deployment settings.",
    );
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
// Goes backwards in time with each page for infinite scroll when no date filter
export async function fetchLatestPhotos(
  rover: string,
  page: number = 1,
  camera?: string | null,
  date?: string | null,
): Promise<PhotosResponse> {
  const client = getClient();

  // If user selected a specific date, just paginate through that date
  if (date) {
    return fetchMarsPhotos({
      rover,
      date,
      page,
      camera: camera || undefined,
    });
  }

  // Get manifest to determine which sols to fetch
  const manifest = await client.manifests.get(rover);
  const latestSol = manifest.maxSol || manifest.max_sol || 1000;

  let solsToFetch: number[];

  // When camera filter is active, use manifest to find sols with that camera
  if (camera) {
    // Find all sols that have photos from this camera, sorted newest first
    const solsWithCamera = manifest.photos
      .filter((p) => {
        // Manifest uses full camera names (e.g., CHEMCAM_RMI, FHAZ_LEFT_B)
        // but we filter by prefix (e.g., CHEMCAM, FHAZ)
        const cameraList = p.cameras || [];
        const cameraUpper = camera.toUpperCase();

        // Special case: NAVCAM -> NAV (manifest uses NAV_LEFT_B, NAV_RIGHT_B)
        const searchPrefix = cameraUpper === "NAVCAM" ? "NAV" : cameraUpper;

        return cameraList.some((c) => c.toUpperCase().startsWith(searchPrefix));
      })
      .map((p) => p.sol)
      .sort((a, b) => b - a); // newest first

    // Paginate through the filtered sols (2 per page)
    const SOLS_PER_PAGE = 2;
    const startIndex = (page - 1) * SOLS_PER_PAGE;
    solsToFetch = solsWithCamera.slice(startIndex, startIndex + SOLS_PER_PAGE);

    // No more sols with this camera
    if (solsToFetch.length === 0) {
      return { photos: [], nextPage: null };
    }
  } else {
    // No camera filter - just fetch recent sols
    const SOLS_PER_PAGE = 2;
    const solOffset = (page - 1) * SOLS_PER_PAGE;

    solsToFetch = [];
    for (let i = 0; i < SOLS_PER_PAGE; i++) {
      const targetSol = latestSol - solOffset - i;
      if (targetSol < 1) break;
      solsToFetch.push(targetSol);
    }
  }

  if (solsToFetch.length === 0) {
    return { photos: [], nextPage: null };
  }

  // Fetch photos from the selected sols
  // Note: When camera filter is active, we already selected sols from manifest
  // Don't pass camera param because API uses specific names (CHEMCAM_RMI not CHEMCAM)
  const promises = solsToFetch.map((sol) =>
    fetchMarsPhotos({
      rover,
      date: sol.toString(),
      page: 1,
      camera: undefined, // Always undefined - we filter after fetching
    }).catch((error) => {
      console.error(`Failed to fetch ${rover} sol ${sol}:`, error);
      return { photos: [], nextPage: null };
    }),
  );

  // Wait for all fetches to complete
  const results = await Promise.all(promises);

  // Combine all photos from all sols
  let allPhotos = results.flatMap((r) => r.photos);

  // Filter by camera if specified (client-side filtering)
  // Photos API uses specific names (CHEMCAM_RMI) but we filter by prefix (CHEMCAM)
  if (camera) {
    const cameraUpper = camera.toUpperCase();
    // Special case: NAVCAM -> NAV (manifest uses NAV_LEFT_B, NAV_RIGHT_B)
    const searchPrefix = cameraUpper === "NAVCAM" ? "NAV" : cameraUpper;

    allPhotos = allPhotos.filter((photo) => {
      const photoCamera = photo.camera.name.toUpperCase();
      return photoCamera.startsWith(searchPrefix);
    });
  }

  // Sort by earth date descending (newest first)
  const sortedPhotos = [...allPhotos].sort((a, b) => {
    const dateA = a.earth_date || a.earthDate || "1970-01-01";
    const dateB = b.earth_date || b.earthDate || "1970-01-01";
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Continue pagination if we got photos
  const hasNextPage = sortedPhotos.length > 0;

  return {
    photos: sortedPhotos,
    nextPage: hasNextPage ? page + 1 : null,
  };
}

// Fetch photos from all active rovers (for mixed feed)
// Goes backwards in time with each page for infinite scroll
export async function fetchMixedFeed(
  page: number = 1,
): Promise<PhotosResponse> {
  const activeRovers = ["curiosity", "perseverance"];
  const client = getClient();

  // Get manifests to know latest sols for each rover
  const manifests = await Promise.all(
    activeRovers.map((rover) => client.manifests.get(rover)),
  );

  // Fetch multiple sols per page to ensure we have enough photos
  // Go back in time with each page
  const SOLS_PER_PAGE = 2;
  const solOffset = (page - 1) * SOLS_PER_PAGE;

  // Fetch photos from multiple sols for each rover
  const photoPromises = manifests.flatMap((manifest, index) => {
    const rover = activeRovers[index];
    const latestSol = manifest.maxSol || manifest.max_sol || 1000;

    const promises = [];
    for (let i = 0; i < SOLS_PER_PAGE; i++) {
      const targetSol = latestSol - solOffset - i;

      // Stop if we've gone before sol 1
      if (targetSol < 1) break;

      promises.push(
        fetchMarsPhotos({
          rover,
          date: targetSol.toString(),
          page: 1,
        }).catch((error) => {
          // If a specific sol fails, log and return empty
          console.error(`Failed to fetch ${rover} sol ${targetSol}:`, error);
          return { photos: [], nextPage: null };
        }),
      );
    }
    return promises;
  });

  // Wait for all fetches to complete
  const results = await Promise.all(photoPromises);

  // Combine all photos from all rovers and sols
  const allPhotos = results.flatMap((r) => r.photos);

  // Sort by earth date descending (newest first)
  const sortedPhotos = [...allPhotos].sort((a, b) => {
    const dateA = a.earth_date || a.earthDate || "1970-01-01";
    const dateB = b.earth_date || b.earthDate || "1970-01-01";
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Continue pagination if we got photos
  const hasNextPage = sortedPhotos.length > 0;

  return {
    photos: sortedPhotos,
    nextPage: hasNextPage ? page + 1 : null,
  };
}
