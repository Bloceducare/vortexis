import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { useState } from "react";


export function Provider({
    children,
    dehydratedState,
  }: {
    children: React.ReactNode;
    dehydratedState?: unknown;
  }) {
    const [queryClient] = useState(() => new QueryClient());
  
    return (
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
      </QueryClientProvider>
    );
}
  