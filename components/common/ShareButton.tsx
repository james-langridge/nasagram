"use client";

// Share button component with dropdown menu
// Supports native share API and platform-specific sharing

import { useState } from "react";
import type { Photo } from "mars-photo-sdk";
import {
  generateShareUrl,
  generateShareText,
  generateShareData,
  getTwitterShareUrl,
  getFacebookShareUrl,
  getRedditShareUrl,
  getEmailShareUrl,
  copyToClipboard,
  isNativeShareSupported,
} from "@/lib/calculations/share-utils";

interface ShareButtonProps {
  readonly photo: Photo;
  readonly className?: string;
  readonly dropdownPosition?: "above" | "below";
  readonly dropdownAlign?: "left" | "right";
}

export function ShareButton({
  photo,
  className = "",
  dropdownPosition = "above",
  dropdownAlign = "left",
}: ShareButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const shareUrl = generateShareUrl(photo.id);
  const shareText = generateShareText(photo);

  const handleNativeShare = async () => {
    try {
      await navigator.share(generateShareData(photo));
      setIsMenuOpen(false);
    } catch (error) {
      // User cancelled or share failed
      console.log("Share cancelled:", error);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
        setIsMenuOpen(false);
      }, 2000);
    }
  };

  const handlePlatformShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400");
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`hover:text-gray-500 ${className}`}
        aria-label="Share"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      </button>

      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu */}
          <div
            className={`absolute ${dropdownPosition === "above" ? "bottom-full mb-2" : "top-full mt-2"} ${dropdownAlign === "left" ? "left-0" : "right-0"} z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px]`}
          >
            <div className="py-1">
              {/* Native share (mobile) */}
              {isNativeShareSupported() && (
                <button
                  onClick={handleNativeShare}
                  className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Share via...
                </button>
              )}

              {/* Copy link */}
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                {copySuccess ? "Copied!" : "Copy link"}
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 my-1" />

              {/* Twitter */}
              <button
                onClick={() =>
                  handlePlatformShare(getTwitterShareUrl(shareText, shareUrl))
                }
                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
                Share on Twitter
              </button>

              {/* Facebook */}
              <button
                onClick={() =>
                  handlePlatformShare(getFacebookShareUrl(shareUrl))
                }
                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Share on Facebook
              </button>

              {/* Reddit */}
              <button
                onClick={() =>
                  handlePlatformShare(getRedditShareUrl(shareText, shareUrl))
                }
                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
                Share on Reddit
              </button>

              {/* Email */}
              <button
                onClick={() =>
                  handlePlatformShare(
                    getEmailShareUrl(
                      `Mars Photo from ${photo.rover.name}`,
                      `${shareText}\n\n${shareUrl}`,
                    ),
                  )
                }
                className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Share via Email
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
