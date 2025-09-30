## 🚀 Tech Stack

### Core Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety throughout the application
- **Vite** - Lightning-fast development and build tool

### UI & Styling
- **Shadcn/ui** - High-quality, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons

### State Management
- **TanStack Query** - Server state management with caching, background updates, and optimistic updates
- **Zustand** - Lightweight client state management with persistence

### Routing & Navigation
- **React Router v6** - Declarative routing with modern patterns
- **Custom URL State Hooks** - Type-safe URL parameter management

### Authentication
- **JWT Token Management** - Secure authentication with automatic refresh
- **Protected Routes** - Route-level authentication guards
- **Persistent Auth State** - Authentication persists across browser sessions

### Testing
- **Vitest** - Fast unit and integration testing
- **React Testing Library** - Component testing with best practices
- **MSW (Mock Service Worker)** - API mocking for reliable tests

### Development Tools
- **ESLint** - Code linting with modern rules
- **Prettier** - Consistent code formatting
- **TypeScript Strict Mode** - Maximum type safety

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Shadcn/ui base components
│   ├── Authentication/  # Auth-related components
│   ├── Home/           # Home page components
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
├── mocks/              # MSW API mocks for testing
└── ...
```

## 🛠 Setup Instructions

### Prerequisites
- **Node.js 18+** - Install via [nodejs.org](https://nodejs.org/) or `brew install node`
- **npm** - Comes with Node.js

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd StatusAtFrontend
   npm install
   ```

2. **Environment setup:**
   ```bash
   # Create environment file
   cp .env.example .env.local
   
   # Edit .env.local with your backend URL
   VITE_API_HOST=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

## 🔧 Available Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run type-check   # Run TypeScript type checking
```

### Testing
```bash
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage reportP
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
npm run format       # Format code with Prettier
```

### Shadcn/ui Components
```bash
npx shadcn-ui@latest add button     # Add new UI components
npx shadcn-ui@latest add form       # Add form components
npx shadcn-ui@latest add dialog     # Add dialog components
```

## 🔐 Authentication System

### Features
- **JWT Authentication** with automatic token refresh
- **Persistent login** across browser sessions
- **Protected routes** with automatic redirects
- **Complete auth flow**: Sign In, Sign Up, Forgot Password, Email Confirmation

### Usage Example
```typescript
import { useCurrentUser, useLogin, useLogout } from '@/hooks/useUserQuery';
import { useAuthStore } from '@/stores/useAuthStore';

function MyComponent() {
  const { data: user, isLoading } = useCurrentUser();
  const { isAuthenticated } = useAuthStore();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const handleLogin = async (credentials) => {
    await loginMutation.mutateAsync(credentials);
    // User is now logged in, tokens stored automatically
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <LoginForm onLogin={handleLogin} />;
  
  return <div>Welcome, {user?.name}!</div>;
}
```

## 🌐 API Integration

### Configuration
The API client is configured in `src/lib/api.ts` with:
- **Automatic token management**
- **Request/response interceptors**
- **Error handling**
- **TypeScript types**

### Usage Example
```typescript
import { userApi, authApi } from '@/lib/api';

// Authentication
await authApi.login({ email, password });
await authApi.signup({ name, email, password, marketing_consent });
await authApi.forgotPassword(email);

// User operations
const user = await userApi.getCurrentUser();
await userApi.updateUser({ name: 'New Name' });
```

## 🎨 UI Components

### Shadcn/ui Integration
All UI components are built with Shadcn/ui for consistency and accessibility:

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function MyForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Email" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Theme Support
- **Light/Dark mode** with system preference detection
- **CSS variables** for easy customization
- **Tailwind CSS** for utility styling

## 🔄 State Management

### Server State (TanStack Query)
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Fetch data with caching
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: () => userApi.getUsers(),
});

// Mutations with optimistic updates
const updateUserMutation = useMutation({
  mutationFn: userApi.updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries(['users']);
  },
});
```

### Client State (Zustand)
```typescript
import { useAppStore } from '@/stores/useAppStore';

function ThemeToggle() {
  const { theme, setTheme } = useAppStore();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

### URL State
```typescript
import { useUrlSearch, useUrlPage } from '@/hooks/useUrlState';

function SearchableList() {
  const [search, setSearch] = useUrlSearch();
  const [page, setPage] = useUrlPage();
  
  // URL automatically updates: /?search=query&page=2
  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <button onClick={() => setPage(page + 1)}>Next Page</button>
    </div>
  );
}
```

## 🧪 Testing

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './MyComponent';

test('renders and handles user interaction', () => {
  const queryClient = new QueryClient();
  
  render(
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  );
  
  expect(screen.getByText('Welcome')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button'));
  // Assert expected behavior
});
```

### API Mocking
MSW automatically mocks API calls in tests:
```typescript
// src/mocks/handlers.ts
export const handlers = [
  http.get('/api/user/me', () => {
    return HttpResponse.json({ id: '1', name: 'Test User' });
  }),
];
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create `.env.production` for production settings:
```bash
VITE_API_HOST=https://your-api.com
```

### Deployment Platforms
This skeleton works with:
- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **AWS S3 + CloudFront** - Scalable hosting
- **Docker** - Containerized deployment

## 🔧 Customization

### Adding New Components
1. **UI Components**: Use Shadcn/ui CLI
   ```bash
   npx shadcn-ui@latest add [component-name]
   ```

2. **Custom Components**: Follow the established patterns
   ```typescript
   // src/components/MyComponent.tsx
   import { Button } from '@/components/ui/button';
   
   export function MyComponent() {
     return <Button>Click me</Button>;
   }
   ```

### Adding New Pages
1. Create component in appropriate directory
2. Add route to `src/components/Shell.tsx`
3. Add navigation links as needed

### Adding New API Endpoints
1. Add types to `src/types/`
2. Add API functions to `src/lib/api.ts`
3. Create React Query hooks in `src/hooks/`

## 📚 Key Dependencies

| Package | Purpose | Documentation |
|---------|---------|---------------|
| React | UI Framework | [reactjs.org](https://reactjs.org) |
| TypeScript | Type Safety | [typescriptlang.org](https://typescriptlang.org) |
| Vite | Build Tool | [vitejs.dev](https://vitejs.dev) |
| TanStack Query | Server State | [tanstack.com/query](https://tanstack.com/query) |
| Zustand | Client State | [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand) |
| Shadcn/ui | UI Components | [ui.shadcn.com](https://ui.shadcn.com) |
| Tailwind CSS | Styling | [tailwindcss.com](https://tailwindcss.com) |
| React Router | Routing | [reactrouter.com](https://reactrouter.com) |
| Vitest | Testing | [vitest.dev](https://vitest.dev) |

## 🤝 Contributing

1. Follow the established patterns and conventions
2. Write tests for new features
3. Use TypeScript strictly - no `any` types
4. Follow the component and hook patterns
5. Update documentation for significant changes

## 🌙 Dark Mode Support

Dark mode is automatically handled at the CSS base layer level:

### **Automatic Support**
The following elements automatically inherit proper dark mode colors:
- ✅ **All headings** (`h1`, `h2`, `h3`, etc.) - `text-foreground` applied via CSS
- ✅ **All inputs** (`input`, `textarea`, `select`) - `text-foreground` applied via CSS
- ✅ **Shadcn components** - Built-in dark mode support

### **Component-Level Fixes**
These components have been updated with proper dark mode support:
- ✅ `SelectTrigger` - includes `text-foreground`
- ✅ `PaginationLink` - includes `text-foreground` for non-active states
- ✅ `PaginationEllipsis` - includes `text-foreground`
- ✅ `Button` with `outline` variant - includes `text-foreground`

### **Testing Dark Mode**
1. **Toggle Theme**: Use Account Settings to switch between light/dark
2. **Verify Elements**: All text should be automatically visible
3. **Custom Components**: Only custom buttons/icons may need explicit `text-foreground`

### **Implementation**
Dark mode support is implemented via:
- **CSS Base Layer**: Automatic `text-foreground` for common elements
- **Component Updates**: Shadcn components updated with proper classes
- **Theme Variables**: CSS custom properties handle light/dark switching

## 📝 Notes

- **Authentication tokens** are stored in localStorage and automatically managed
- **API calls** include automatic retry logic and error handling
- **Components** are designed to be reusable and accessible
- **State management** follows separation of concerns (server vs client state)
- **URL state** is type-safe and automatically synced
- **Tests** use MSW for reliable API mocking
- **Dark mode** follows systematic rules to ensure consistent visibility
