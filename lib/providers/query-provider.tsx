"use client";

// React Query provider setup following Next.js App Router best practices
// Uses singleton pattern to prevent hydration issues

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: how long data is considered fresh
        staleTime: 60 * 1000, // 1 minute
        // Cache time: how long inactive data stays in cache
        gcTime: 5 * 60 * 1000, // 5 minutes
        // Retry failed requests
        retry: 2,
        // Refetch on window focus
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  // Server: always make a new query client
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  // Browser: use singleton pattern to avoid creating new clients
  else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
