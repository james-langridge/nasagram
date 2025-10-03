"use client";

import { Heart } from "lucide-react";
import { signIn, signOut } from "@/lib/auth-actions";
import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";

interface AuthButtonProps {
  session: Session | null;
}

export function AuthButton({ session }: AuthButtonProps) {
  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/favorites" className="text-gray-700 hover:text-gray-900">
          <Heart className="w-6 h-6" />
        </Link>
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-gray-700 hover:text-gray-900"
          >
            Sign Out
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={signIn}>
      <button
        type="submit"
        className="text-sm text-gray-700 hover:text-gray-900 font-medium"
      >
        Sign In
      </button>
    </form>
  );
}
