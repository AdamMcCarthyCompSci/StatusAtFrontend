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

## Theme System (ShadCN + Tailwind)

### Overview
StatusAt uses a sophisticated theme system built on ShadCN UI with CSS variables, providing:
- Light/Dark mode support with high contrast
- Brand gradient integration (primary → blue → purple)
- Semantic color tokens for consistent design
- Reusable gradient utilities

### Configuration Files
```typescript
// Theme configuration
components.json         // ShadCN configuration
tailwind.config.js     // Tailwind with semantic tokens
src/index.css          // CSS variables for light/dark themes
```

### Color System
**Semantic Tokens** (defined in `src/index.css`):
```typescript
// Surface colors
--background    // Main background
--foreground    // Main text
--card          // Elevated surfaces (cards, modals)
--popover       // Highest elevation (dropdowns, tooltips)

// Interactive colors
--primary       // Brand color (deep blue-black)
--secondary     // Secondary actions
--muted         // Backgrounds, subtle elements
--accent        // Highlights, interactive elements (brand blue)
--destructive   // Errors, dangerous actions

// Utility colors
--border        // All borders
--input         // Form inputs
--ring          // Focus indicators
```

### Brand Gradient
**Colors**: Primary (#0a0e1a) → Blue (#3b82f6) → Purple (#a855f7)

**CSS Variables** (reference only):
```css
--brand-primary: 222.2 47.4% 11.2%;
--brand-blue: 217 91% 60%;
--brand-purple: 271 76% 53%;
```

**Utility Classes** (use these!):
```tsx
// Background gradients
<Button className="bg-gradient-brand">Full Gradient</Button>
<Button className="bg-gradient-brand-subtle">Primary → Blue</Button>

// Text gradients
<h1 className="text-gradient-brand">Gradient Text</h1>

// Border gradients
<div className="border-gradient-brand">Gradient Border</div>
```

### Usage Examples

**Cards with Elevation:**
```tsx
// Simple card - uses --card color
<Card>Content</Card>

// Hero card with gradient accent
<Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
  Hero Content
</Card>
```

**Buttons:**
```tsx
// Standard primary button
<Button>Default</Button>

// Brand gradient button (for CTAs)
<Button className="bg-gradient-brand-subtle hover:opacity-90">
  Get Started
</Button>

// Secondary/outline
<Button variant="outline">Secondary</Button>
```

**Text Hierarchy:**
```tsx
<h1 className="text-foreground">Primary Heading</h1>
<p className="text-muted-foreground">Secondary Text</p>
<span className="text-gradient-brand">Gradient Accent</span>
```

### Theme State Management
```typescript
// useAppStore (Zustand)
const { theme, setTheme } = useAppStore();
// Values: 'light' | 'dark' | 'auto'

// Apply theme in Shell component
<div className={theme === 'dark' ? 'dark' : ''}>
  {/* Theme automatically propagates */}
</div>
```

### Color Contrast Improvements
The theme has been optimized for better visual hierarchy:

**Light Mode:**
- Pure white background (`0 0% 100%`)
- Elevated cards with blue tint (`215 25% 97%`)
- Stronger borders (`215 20% 85%`)
- Deep blue-black foreground (`222 47% 11%`)

**Dark Mode:**
- True deep black background (`222 47% 5%`)
- Elevated cards (`222 30% 10%`)
- Clear surface separation
- Stronger borders (`217 25% 20%`)

### Best Practices

**✅ Do:**
- Use semantic tokens (`bg-background`, `text-foreground`)
- Use brand gradient utilities for CTAs and hero sections
- Leverage `--card` for elevated surfaces
- Use `--muted` for subtle backgrounds

**❌ Don't:**
- Hard-code colors (`bg-white`, `text-black`)
- Write inline gradient styles (use utilities)
- Mix semantic tokens with absolute colors
- Override theme colors directly

### Adding New Colors
1. Add CSS variable to `src/index.css` (both `:root` and `.dark`)
2. Register in `tailwind.config.js` under `theme.extend.colors`
3. Use as `bg-[color]`, `text-[color]`, `border-[color]`

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
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format with Prettier
```

### Maintenance & Debugging
```bash
npm run dev:clean    # Clear cache and reinstall dependencies
npm run analyze      # Build with bundle size visualization
```

## Pre-commit Hooks

This project uses Husky + lint-staged for automatic code quality checks before commits.

**What runs on every commit:**
- ESLint auto-fix on staged `.js`, `.jsx`, `.ts`, `.tsx` files
- Prettier formatting on staged code files
- Prettier formatting on staged `.json`, `.css`, `.md` files

**How it works:**
1. You run `git commit`
2. Husky intercepts and runs lint-staged
3. Only staged files are checked and auto-fixed
4. Fixes are automatically added to your commit
5. If errors can't be auto-fixed, commit is aborted

**Skip hooks (not recommended):**
```bash
git commit --no-verify  # Bypass pre-commit checks
```

**Troubleshooting:**
- If hooks aren't running: `npm install` (runs prepare script)
- Check hook status: `cat .husky/pre-commit`
- View hook logs: Errors appear in terminal during commit

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
