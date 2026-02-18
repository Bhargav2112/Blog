import { QueryClient } from "@tanstack/react-query";

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Only retry once to fail fast
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
      // prevent infinite loading by converting long hangs to errors
      timeout: 10000, // 10 seconds timeout for all queries
    },
  },
});
