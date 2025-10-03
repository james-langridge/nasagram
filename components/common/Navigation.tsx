"use client";

import { AuthButton } from "@/components/auth/AuthButton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { ViewToggle } from "./ViewToggle";

interface NavigationProps {
  session: Session | null;
}

export function Navigation({ session }: NavigationProps) {
  const pathname = usePathname();

  // Hide navigation on photo detail pages for immersive viewing
  if (pathname?.startsWith("/photo/")) {
    return null;
  }

  // Show view toggle on pages with photo grids
  const showViewToggle = pathname === "/" ||
                         pathname === "/favorites" ||
                         pathname?.match(/^\/[^/]+$/); // Rover profile pages

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer hover:text-gray-700">
              MarsGram
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            {showViewToggle && <ViewToggle />}
            <AuthButton session={session} />
          </div>
        </div>
      </div>
    </nav>
  );
}
