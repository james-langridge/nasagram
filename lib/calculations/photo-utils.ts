// Calculation layer: Pure functions for photo transformations
// No side effects, always returns same output for same input

import type { Photo } from "mars-photo-sdk";

// Format sol date for display
export function formatSol(sol: number): string {
  return `Sol ${sol.toLocaleString()}`;
}

// Format earth date for display
export function formatEarthDate(earthDate: string): string {
  const date = new Date(earthDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Calculate relative time (e.g., "2 years ago")
export function getRelativeTime(earthDate: string): string {
  const date = new Date(earthDate);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 1) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;

  const years = Math.floor(diffInDays / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

// Generate photo caption
export function generatePhotoCaption(photo: Photo): string {
  const camera = photo.camera.fullName || photo.camera.name;
  const earthDateStr = photo.earthDate
    ? ` (${formatEarthDate(photo.earthDate)})`
    : "";
  return `${camera} on ${formatSol(photo.sol)}${earthDateStr}`;
}

// Generate share URL
export function generateShareUrl(photoId: number): string {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
  return `${baseUrl}/photo/${photoId}`;
}

// Generate share text
export function generateShareText(photo: Photo): string {
  return `Check out this amazing Mars photo from ${photo.rover.name} on ${formatSol(photo.sol)}! 🔴`;
}

// Extract unique ID for photo (for React keys)
export function getPhotoKey(photo: Photo): string {
  return `${photo.rover.name}-${photo.id}`;
}

// Sort photos by date (most recent first)
export function sortPhotosByDate(photos: readonly Photo[]): readonly Photo[] {
  return [...photos].sort((a, b) => {
    const dateA = a.earthDate ? new Date(a.earthDate).getTime() : 0;
    const dateB = b.earthDate ? new Date(b.earthDate).getTime() : 0;
    return dateB - dateA;
  });
}

// Group photos by sol
export function groupPhotosBySol(
  photos: readonly Photo[],
): Map<number, readonly Photo[]> {
  const groups = new Map<number, Photo[]>();

  photos.forEach((photo) => {
    const existing = groups.get(photo.sol) || [];
    groups.set(photo.sol, [...existing, photo]);
  });

  return groups;
}

// Calculate image aspect ratio
export function getImageAspectRatio(): number {
  // Mars rover images are typically square or 4:3
  // Default to square for Instagram-like feed
  return 1;
}

// Generate blur placeholder for image loading
export function generateBlurDataUrl(): string {
  // Simple base64 encoded 1x1 gray pixel
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
}
