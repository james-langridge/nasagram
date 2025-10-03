// Photo detail page - Full view of a single Mars photo with deep linking
// Fetches photo metadata from cache for clean, shareable URLs

import Link from "next/link";
import { getCachedPhoto, cachedPhotoToPhoto } from "@/lib/actions/photo-cache";
import { PhotoDetailContent } from "@/components/photo/PhotoDetailContent";
import { notFound } from "next/navigation";
import { isPhotoFavorited } from "@/lib/actions/favorites";

interface PhotoDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function PhotoDetailPage({
  params,
}: PhotoDetailPageProps) {
  const { id } = await params;
  const photoId = parseInt(id);

  if (isNaN(photoId)) {
    notFound();
  }

  // Fetch photo from cache
  const cached = await getCachedPhoto(photoId);

  if (!cached) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center space-y-4">
          <h1 className="text-2xl mb-4">Photo not found</h1>
          <p className="text-gray-400 text-sm max-w-md">
            This photo hasn&apos;t been viewed yet. Browse photos from the home
            page to view and share them.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  // Transform cached data to Photo type for components
  const photo = cachedPhotoToPhoto(cached);

  // Check if photo is favorited by current user
  const favorited = await isPhotoFavorited(photoId);

  return <PhotoDetailContent photo={photo} initialFavorited={favorited} />;
}
