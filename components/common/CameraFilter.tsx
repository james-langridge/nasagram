"use client";

// Camera filter component
// Allows users to filter photos by camera type

import { useState } from "react";
import { getCamerasForRover } from "@/lib/constants/cameras";

interface CameraFilterProps {
  readonly roverId: string | null;
  readonly selectedCamera: string | null;
  readonly onCameraChange: (camera: string | null) => void;
}

export function CameraFilter({
  roverId,
  selectedCamera,
  onCameraChange,
}: CameraFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only show camera filter if we have a specific rover
  if (!roverId) {
    return null;
  }

  const cameras = getCamerasForRover(roverId);

  if (cameras.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        {selectedCamera
          ? cameras.find((c) => c.name === selectedCamera)?.name || "Camera"
          : "All Cameras"}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute top-full mt-2 right-0 sm:left-0 sm:right-auto z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[280px] max-h-[400px] overflow-y-auto">
            <div className="py-1">
              {/* All cameras option */}
              <button
                onClick={() => {
                  onCameraChange(null);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  !selectedCamera ? "bg-blue-50 text-blue-600" : ""
                }`}
              >
                <div className="font-medium">All Cameras</div>
              </button>

              <div className="border-t border-gray-200 my-1" />

              {/* Individual camera options */}
              {cameras.map((camera) => (
                <button
                  key={camera.name}
                  onClick={() => {
                    onCameraChange(camera.name);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                    selectedCamera === camera.name
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }`}
                >
                  <div className="font-medium">{camera.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {camera.fullName}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
