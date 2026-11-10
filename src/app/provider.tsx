'use client'

import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from '@tanstack/react-query'
import type { DehydratedState } from '@tanstack/react-query'
import { useState } from 'react'

export function Provider({
  children,
  dehydratedState,
}: {
  children: React.ReactNode
  dehydratedState?: DehydratedState
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 10, // 10 minutes default stale time
            gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
            refetchOnWindowFocus: false, // Don't refetch on window focus
            refetchOnReconnect: false, // Don't refetch on reconnect within staleTime
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
  )
}

