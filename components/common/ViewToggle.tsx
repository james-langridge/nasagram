"use client";

import { Grid3x3, LayoutGrid } from "lucide-react";
import { useViewMode } from "@/lib/providers/view-mode-provider";

export function ViewToggle() {
  const { viewMode, setViewMode } = useViewMode();

  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white">
      <button
        onClick={() => setViewMode("feed")}
        className={`p-1.5 rounded transition-colors ${
          viewMode === "feed"
            ? "bg-gray-900 text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
        aria-label="Feed view"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => setViewMode("grid")}
        className={`p-1.5 rounded transition-colors ${
          viewMode === "grid"
            ? "bg-gray-900 text-white"
            : "text-gray-600 hover:text-gray-900"
        }`}
        aria-label="Grid view"
      >
        <Grid3x3 className="w-5 h-5" />
      </button>
    </div>
  );
}
