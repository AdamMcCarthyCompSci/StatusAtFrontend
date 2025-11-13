# Claude Code Context - StatusAt Frontend

## Project Overview
StatusAt is a React-based flow management and customer tracking application built with TypeScript, Vite, and TanStack Query.

**Backend API:**
- Base URL: `http://localhost:8000/api/v1` (includes API versioning)
- Swagger Documentation: `http://localhost:8000/swagger` (no trailing slash)
- All endpoints: `/api/v1/{endpoint}` (no trailing slashes)

## Architecture Patterns

### State Management
- **Server State**: TanStack Query with centralized configuration
- **Client State**: Zustand stores with persistence
- **URL State**: Custom hooks for type-safe URL parameters
- **Cache Strategy**: All cache times defined in `src/config/constants.ts`

### Code Organization
```
src/
├── config/              # Constants (cache times, pagination, API config)
├── components/          # React components (lazy-loaded per route)
├── hooks/              # React Query hooks and custom hooks
├── lib/                # Utilities (api, logger, queryClient, i18n)
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
└── mocks/              # MSW API mocks for testing
```

### Performance Strategy
- **Vendor Chunking**: Third-party libraries split by type in vite.config.ts
- **Route-Based Splitting**: All routes use React.lazy()
- **Async Dependencies**: Heavy libraries (i18n, animations) lazy-loaded
- **Initial Bundle**: ~70KB (19KB gzipped) main code + ~130KB total gzipped

## Key Patterns to Follow

### 1. Constants Over Magic Numbers
```typescript
// ✅ Good
import { CACHE_TIMES, PAGINATION, API_CONFIG } from '@/config/constants';

staleTime: CACHE_TIMES.STALE_TIME
pageSize: PAGINATION.DEFAULT_PAGE_SIZE
maxRetries: API_CONFIG.MAX_RETRIES

// ❌ Bad
staleTime: 1000 * 60 * 5
pageSize: 10
maxRetries: 5
```

### 2. Logging
```typescript
// ✅ Good - Development only, stripped in production
import { logger } from '@/lib/logger';
logger.info('User action', data);
logger.error('Operation failed:', error);

// ❌ Bad - Appears in production console
console.log('Debug info');
console.error(error);
```

### 3. React Query Hooks
```typescript
// Pattern: src/hooks/use[Domain]Query.ts
export const [domain]Keys = {
  all: ['domain'] as const,
  lists: (params) => [...[domain]Keys.all, 'list', params] as const,
  detail: (id) => [...[domain]Keys.all, 'detail', id] as const,
};

export function use[Domain]s(params) {
  return useQuery({
    queryKey: [domain]Keys.lists(params),
    queryFn: () => [domain]Api.get[Domain]s(params),
    staleTime: CACHE_TIMES.STALE_TIME,
  });
}
```

### 4. API Integration
```typescript
// 1. Define types in src/types/[domain].ts
export interface Domain {
  id: string;
  name: string;
}

// 2. Add API functions in src/lib/api.ts
export const domainApi = {
  getDomains: () => apiClient.get<Domain[]>('/domains'),
  createDomain: (data) => apiClient.post<Domain>('/domains', data),
};

// 3. Create hook in src/hooks/use[Domain]Query.ts
export function useDomains() {
  return useQuery({
    queryKey: domainKeys.all,
    queryFn: domainApi.getDomains,
    staleTime: CACHE_TIMES.STALE_TIME,
  });
}
```

### 5. Component Structure
```typescript
// Lazy load route components
const MyPage = lazy(() => import('../MyPage/MyPage'));

// Route definition
<Route path="/my-page" element={<Suspense fallback={<Loading />}><MyPage /></Suspense>} />
```

## Configuration Reference

### Cache Times (src/config/constants.ts)
```typescript
CACHE_TIMES.STALE_TIME       // 5 minutes - standard queries
CACHE_TIMES.CACHE_TIME       // 10 minutes - garbage collection
CACHE_TIMES.STALE_TIME_SHORT // 1 minute - frequently changing
CACHE_TIMES.STALE_TIME_LONG  // 15 minutes - rarely changing
```

### Pagination (src/config/constants.ts)
```typescript
PAGINATION.DEFAULT_PAGE_SIZE      // 10
PAGINATION.PAGE_SIZE_OPTIONS      // [10, 20, 50, 100]
```

### API Config (src/config/constants.ts)
```typescript
API_CONFIG.DEFAULT_TIMEOUT   // 30 seconds
API_CONFIG.MAX_RETRIES       // 3 attempts
API_CONFIG.RETRY_DELAY       // 1 second
```

## Common Commands

### Development
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build
npm run type-check   # TypeScript validation
```

### Testing
```bash
npm test             # Run tests in watch mode
npm run coverage     # Generate coverage report
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## Key Files

| File | Purpose |
|------|---------|
| `src/config/constants.ts` | All constants (cache, pagination, API) |
| `src/lib/logger.ts` | Development-only logging utility |
| `src/lib/queryClient.ts` | TanStack Query configuration |
| `src/lib/api.ts` | API client with interceptors |
| `vite.config.ts` | Build config with chunking strategy |
| `src/App.tsx` | Root component with providers |

## Type Safety Rules
- Strict TypeScript mode enabled
- No `any` types - use `unknown` if needed
- All API responses must have type definitions
- Props interfaces required for all components

## Testing Patterns
- Uses Vitest + React Testing Library
- MSW for API mocking (see `src/mocks/handlers.ts`)
- Test files colocated with components: `Component.test.tsx`
- Query/mutation hooks tested with mock API responses

## Bundle Optimization
- Check bundle impact: `npm run build` shows all chunk sizes
- Keep route components focused and small
- Use named imports for tree-shaking
- Heavy dependencies should be lazy-loaded
- Icons: Use lucide-react (tree-shakeable)

## Important Notes
- Authentication tokens in localStorage (managed by Zustand)
- All routes except auth pages require authentication
- Dark mode via CSS variables (light/dark classes)
- i18n loaded asynchronously after initial render
- MSW mocks active in development and tests
