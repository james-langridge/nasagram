// Rover profile header component
// Displays Instagram-like profile information for a Mars rover

import type { RoverProfile } from "@/lib/constants/rovers";

interface RoverHeaderProps {
  readonly profile: RoverProfile;
}

export function RoverHeader({ profile }: RoverHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-start gap-4">
          {/* Avatar placeholder */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl text-white font-bold">
              {profile.displayName.charAt(0)}
            </span>
          </div>

          {/* Profile info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold">{profile.displayName}</h1>
              {profile.verified && (
                <svg
                  className="w-5 h-5 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-3">{profile.username}</p>

            {/* Stats */}
            <div className="flex gap-4 mb-3">
              <div>
                <span className="font-semibold">{profile.stats.posts}</span>
                <span className="text-gray-500 text-sm ml-1">photos</span>
              </div>
              <div>
                <span className="font-semibold">{profile.stats.followers}</span>
                <span className="text-gray-500 text-sm ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold">{profile.stats.following}</span>
                <span className="text-gray-500 text-sm ml-1">following</span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm mb-2">{profile.bio}</p>

            {/* Location and status */}
            <div className="text-xs text-gray-500 space-y-1">
              <div>📍 {profile.location}</div>
              <div>
                🚀 Landed: {new Date(profile.landingDate).toLocaleDateString()}
              </div>
              <div>
                {profile.status === "active" ? (
                  <span className="inline-flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Active mission
                  </span>
                ) : (
                  <span className="text-gray-400">Mission complete</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
