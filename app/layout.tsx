import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { ViewModeProvider } from "@/lib/providers/view-mode-provider";
import { Navigation } from "@/components/common/Navigation";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarsGram - Mars Rover Photos",
  description:
    "Instagram for Mars Rover photos - Browse stunning images from Curiosity and Perseverance rovers",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ViewModeProvider>
            <Navigation session={session} />
            {children}
          </ViewModeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
