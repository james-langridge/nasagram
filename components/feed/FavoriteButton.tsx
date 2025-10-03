"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import type { Photo } from "mars-photo-sdk";
import { normalizeImageUrl } from "@/lib/calculations/photo-utils";

interface FavoriteButtonProps {
  readonly photo: Photo;
  readonly initialFavorited?: boolean;
}

export function FavoriteButton({
  photo,
  initialFavorited = false,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  async function toggleFavorite() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId: photo.id,
          roverId: photo.rover.name.toLowerCase(),
          photoUrl: normalizeImageUrl(photo.imgSrc),
          photoSol: photo.sol,
          photoEarthDate: photo.earthDate || "",
          cameraName: photo.camera.name,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFavorited(data.favorited);
      } else if (response.status === 401) {
        window.location.href = "/api/auth/signin";
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className="hover:text-gray-500 disabled:opacity-50"
      aria-label={favorited ? "Unlike" : "Like"}
    >
      <Heart
        className={`w-6 h-6 ${favorited ? "fill-red-500 text-red-500" : ""}`}
      />
    </button>
  );
}
