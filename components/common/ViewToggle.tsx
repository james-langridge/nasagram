"use client";

// View mode toggle component
// Instagram-style view toggle for switching between feed and grid views

import { useViewMode } from "@/lib/providers/view-mode-provider";

// Instagram-style grid icon (3x3 grid)
function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 3H21V21H3z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9.01486 3 9.01486 21"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14.98514 3 14.98514 21"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 9.01486 3 9.01486"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 14.98514 3 14.98514"
      />
    </svg>
  );
}

// Instagram-style feed icon (single post)
function FeedIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="2">
        <path strokeLinejoin="round" d="M6 7H18V17H6z" fill="none" />
        <path
          strokeMiterlimit="10"
          d="M6.00183 3.00372 18.00012 3.00372"
          fill="none"
        />
        <path
          strokeMiterlimit="10"
          d="M6.00183 20.99981 18.00012 20.99981"
          fill="none"
        />
      </g>
    </svg>
  );
}

export function ViewToggle() {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setViewMode("grid")}
        className={`p-1 transition-colors ${
          viewMode === "grid"
            ? "text-gray-900"
            : "text-gray-400 hover:text-gray-600"
        }`}
        aria-label="Grid view"
      >
        <GridIcon className="w-6 h-6" />
      </button>
      <button
        onClick={() => setViewMode("feed")}
        className={`p-1 transition-colors ${
          viewMode === "feed"
            ? "text-gray-900"
            : "text-gray-400 hover:text-gray-600"
        }`}
        aria-label="Feed view"
      >
        <FeedIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
