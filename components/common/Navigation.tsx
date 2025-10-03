"use client";

import { AuthButton } from "@/components/auth/AuthButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  // Hide navigation on photo detail pages for immersive viewing
  if (pathname?.startsWith("/photo/")) {
    return null;
  }

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer hover:text-gray-700">
              MarsGram
            </h1>
          </Link>
          <div className="flex items-center space-x-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
