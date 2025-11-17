# API Response Caching Strategy

## Overview
This application uses TanStack Query (React Query) for server state management with a centralized caching configuration.

## Cache Configuration

### Constants (src/config/constants.ts)
All cache timing is centralized in a single source of truth:

```typescript
export const CACHE_TIMES = {
  STALE_TIME: 5 * 60 * 1000,        // 5 minutes - Standard queries
  CACHE_TIME: 10 * 60 * 1000,       // 10 minutes - Garbage collection
  STALE_TIME_SHORT: 1 * 60 * 1000,  // 1 minute - Frequently changing
  STALE_TIME_LONG: 15 * 60 * 1000,  // 15 minutes - Rarely changing
} as const;
```

### Global Defaults (src/lib/queryClient.ts)
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIMES.STALE_TIME,  // 5 minutes
      gcTime: CACHE_TIMES.CACHE_TIME,      // 10 minutes
      retry: 3,                             // Retry failed requests
    },
  },
});
```

## Cache Timing Explained

### Stale Time
**Time before data is considered "stale" and needs refetching**

- **Standard (5 min)**: Most queries - users, flows, enrollments
- **Short (1 min)**: Real-time data - message counts, active sessions
- **Long (15 min)**: Static data - tenant settings, flow configurations

### Garbage Collection Time (gcTime)
**Time before unused cache is removed from memory**

- **Default (10 min)**: Standard cleanup interval
- Always set longer than staleTime to preserve background data

## Cache Invalidation Strategy

### 1. Mutation-Based Invalidation
When data changes via mutations, we invalidate related queries:

```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
```

### 2. Hierarchical Query Keys
Query keys follow a hierarchy for targeted invalidation:

```typescript
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id) => [...userKeys.details(), id] as const,
};

// Invalidate all user data
queryClient.invalidateQueries({ queryKey: userKeys.all });

// Invalidate only user lists
queryClient.invalidateQueries({ queryKey: userKeys.lists() });

// Invalidate specific user
queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
```

### 3. Cross-Domain Invalidation
Some mutations affect multiple domains:

```typescript
export function useDeleteEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollmentApi.delete,
    onSuccess: (_, { tenantUuid, enrollmentUuid }) => {
      // Invalidate enrollments
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.tenant(tenantUuid)
      });

      // Invalidate user dashboard (shows enrollment counts)
      queryClient.invalidateQueries({
        queryKey: userKeys.current()
      });

      // Remove from cache
      queryClient.removeQueries({
        queryKey: enrollmentKeys.detail(tenantUuid, enrollmentUuid)
      });
    },
  });
}
```

## Query Key Patterns

All query hooks follow this pattern:

```typescript
// 1. Define query keys
export const domainKeys = {
  all: ['domain'] as const,
  tenant: (tenantUuid: string) => [...domainKeys.all, 'tenant', tenantUuid] as const,
  lists: (tenantUuid: string, params?: Params) =>
    [...domainKeys.tenant(tenantUuid), 'list', params] as const,
  detail: (tenantUuid: string, id: string) =>
    [...domainKeys.tenant(tenantUuid), 'detail', id] as const,
};

// 2. Create queries with appropriate cache times
export function useDomains(tenantUuid: string, params?: Params) {
  return useQuery({
    queryKey: domainKeys.lists(tenantUuid, params),
    queryFn: () => domainApi.getDomains(tenantUuid, params),
    enabled: !!tenantUuid,
    staleTime: CACHE_TIMES.STALE_TIME, // Choose appropriate timing
  });
}
```

## Cache Versioning

### No Explicit Versioning
We don't use cache versioning because:
1. **Mutation-based invalidation** handles most cases
2. **Short stale times** prevent stale data issues
3. **Automatic refetch** on window focus catches missed updates

### When to Consider Versioning
Add version keys if:
- Deploying breaking API changes
- Long cache times (>15 minutes)
- Critical data consistency requirements

```typescript
// Example versioned cache (if needed)
const API_VERSION = 'v2';

export const userKeys = {
  all: [API_VERSION, 'users'] as const,
  // ... rest of keys
};
```

## Background Refetching

### Automatic Refetch Triggers
TanStack Query automatically refetches data on:

1. **Window Focus** - When user returns to tab
2. **Network Reconnect** - When connection restored
3. **Mount** - When component using query mounts (if stale)

### Custom Refetch Intervals
For real-time requirements:

```typescript
// Poll every 30 seconds
export function useRealtimeData() {
  return useQuery({
    queryKey: ['realtime'],
    queryFn: fetchRealtimeData,
    staleTime: CACHE_TIMES.STALE_TIME_SHORT,
    refetchInterval: 30000, // Poll every 30s
  });
}
```

## Cache Persistence

### In-Memory Only
Cache is stored in memory (not localStorage) because:
- Server state may be outdated on reload
- Small cache footprint (<10MB typical)
- Fresh data on page load is preferred

### Session Persistence
Auth tokens and user preferences use Zustand with persistence:
```typescript
// src/stores/useAuthStore.ts
persist(
  (set, get) => ({ /* state */ }),
  { name: 'auth-storage' }
)
```

## Best Practices

### 1. Always Use Constants
```typescript
// ✅ Good
staleTime: CACHE_TIMES.STALE_TIME

// ❌ Bad
staleTime: 300000
```

### 2. Hierarchical Invalidation
```typescript
// ✅ Good - Invalidate all related queries
queryClient.invalidateQueries({ queryKey: userKeys.all });

// ⚠️ Careful - May invalidate too much
queryClient.invalidateQueries({ queryKey: ['users'] });

// ❌ Bad - Misses related queries
queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
```

### 3. Use Enabled Flag
```typescript
// ✅ Good - Only fetch when ready
export function useEnrollment(tenantUuid: string, enrollmentUuid: string) {
  return useQuery({
    queryKey: enrollmentKeys.detail(tenantUuid, enrollmentUuid),
    queryFn: () => enrollmentApi.get(tenantUuid, enrollmentUuid),
    enabled: !!tenantUuid && !!enrollmentUuid, // Prevent unnecessary requests
    staleTime: CACHE_TIMES.STALE_TIME,
  });
}
```

### 4. Optimistic Updates
For better UX, update cache immediately:

```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateUser,
    onMutate: async (updatedUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.all });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(userKeys.current());

      // Optimistically update
      queryClient.setQueryData(userKeys.current(), updatedUser);

      return { previousUser };
    },
    onError: (err, updatedUser, context) => {
      // Rollback on error
      queryClient.setQueryData(userKeys.current(), context.previousUser);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
```

## Monitoring & Debugging

### React Query DevTools
Available in development:

```typescript
// src/App.tsx
<QueryClientProvider client={queryClient}>
  <App />
  {import.meta.env.DEV && <ReactQueryDevtools />}
</QueryClientProvider>
```

### Cache Inspection
```typescript
// Get current cache state
const userCache = queryClient.getQueryData(userKeys.current());

// Get cache status
const { isStale, isFetching } = queryClient.getQueryState(userKeys.current());
```

## Common Patterns

### Pattern: List + Detail Caching
```typescript
// List query
const { data: users } = useUsers();

// Detail query (may already be cached from list)
const { data: user } = useUser(userId);

// Mutation updates both
const updateUser = useMutation({
  mutationFn: userApi.update,
  onSuccess: (updatedUser) => {
    // Update detail cache
    queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
    // Invalidate list to refetch
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  },
});
```

### Pattern: Dependent Queries
```typescript
// First query
const { data: tenant } = useTenant(tenantUuid);

// Second query depends on first
const { data: flows } = useFlows(tenant?.id, {
  enabled: !!tenant?.id, // Only fetch when tenant loaded
});
```

### Pattern: Prefetching
```typescript
// Prefetch on hover for instant navigation
<Link
  to="/user/123"
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: userKeys.detail('123'),
      queryFn: () => userApi.getUser('123'),
    });
  }}
>
  View User
</Link>
```

## Summary

- **Centralized config** in `src/config/constants.ts`
- **5-minute default** stale time for most queries
- **Hierarchical keys** for targeted invalidation
- **Mutation-based** invalidation on data changes
- **No versioning** needed with current strategy
- **In-memory cache** cleared on page reload
- **Auto-refetch** on focus/reconnect
