"use client";

// React Query provider setup
// Manages server state caching and automatic refetching

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: how long data is considered fresh
            staleTime: 0, // Always fetch fresh data
            // Cache time: how long inactive data stays in cache
            gcTime: 5 * 60 * 1000, // 5 minutes
            // Retry failed requests
            retry: 2,
            // Refetch on window focus
            refetchOnWindowFocus: false,
            // Refetch on mount
            refetchOnMount: true,
          },
        },
      }),
  );

  console.log('[QueryProvider] Initialized');

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
