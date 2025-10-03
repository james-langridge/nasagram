// Pure functions for generating share URLs and text
// Following functional design principles - calculations only, no side effects

import type { Photo } from "mars-photo-sdk";

// Generate shareable URL for a photo
export function generateShareUrl(photoId: number): string {
  const baseUrl = (
    process.env.NEXT_PUBLIC_URL || "https://nasagram.vercel.app"
  ).replace(/\/$/, "");
  return `${baseUrl}/photo/${photoId}`;
}

// Generate share text for a photo
export function generateShareText(photo: Photo): string {
  return `Check out this amazing Mars photo from ${photo.rover.name} on Sol ${photo.sol}! 🔴`;
}

// Generate share data for Web Share API
export function generateShareData(photo: Photo): ShareData {
  return {
    title: `Mars Photo - ${photo.rover.name}`,
    text: generateShareText(photo),
    url: generateShareUrl(photo.id),
  };
}

// Platform-specific share URL builders
export function getTwitterShareUrl(text: string, url: string): string {
  const params = new URLSearchParams({ text, url });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function getFacebookShareUrl(url: string): string {
  const params = new URLSearchParams({ u: url });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

export function getRedditShareUrl(title: string, url: string): string {
  const params = new URLSearchParams({ title, url });
  return `https://reddit.com/submit?${params.toString()}`;
}

export function getEmailShareUrl(subject: string, body: string): string {
  const params = new URLSearchParams({ subject, body });
  return `mailto:?${params.toString()}`;
}

// Copy text to clipboard (returns true if successful)
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}

// Check if Web Share API is supported
export function isNativeShareSupported(): boolean {
  return typeof navigator !== "undefined" && "share" in navigator;
}
