# Assets Directory

## Logo Setup Instructions

To complete the logo integration, follow these steps:

### Step 1: Move the Logo File
Move your logo from the public directory to this assets directory:

```bash
mv /Users/adammccarthy/PycharmProjects/PythonProject/StatusAtFrontend/public/logo.svg /Users/adammccarthy/PycharmProjects/PythonProject/StatusAtFrontend/src/assets/logo.svg
```

### Step 2: Update the Logo Component
Open `/src/components/ui/logo.tsx` and:

1. **Uncomment the import** at the top of the file:
   ```typescript
   import logoSvg from '@/assets/logo.svg';
   ```

2. **Replace the placeholder `<div>`** with the actual logo:
   ```typescript
   <img 
     src={logoSvg} 
     alt="StatusAt Logo" 
     className={cn(sizeClasses[size], 'w-auto')}
   />
   ```

3. **Remove the placeholder div** and its comment

### Step 3: Test
Run your dev server and check these pages to see your logo:
- Landing page (`/`)
- Sign in page (`/sign-in`)
- Sign up page (`/sign-up`)
- Header (when logged in, visible on `/dashboard`)

## Why src/assets/ instead of public/?

### `/src/assets/` (Recommended for logos)
✅ **Optimized by Vite** - automatic compression and bundling
✅ **Cache busting** - content hashes added to filenames
✅ **TypeScript support** - import errors caught at build time
✅ **Tree shaking** - unused assets won't be bundled

### `/public/` (For static files)
✅ **Direct URL access** - good for favicons, robots.txt, manifest files
✅ **No processing** - files served as-is
❌ **No optimization** - no compression or bundling
❌ **Manual cache management** - you control versioning

## Logo Locations

Your logo is now used in:
1. **Header** (`/src/components/layout/Header.tsx`) - Small size, shown when logged in
2. **Landing Page** (`/src/components/Home/HomeShell.tsx`) - Large size with hover animation
3. **Sign In** (`/src/components/Authentication/SignIn.tsx`) - Large size, centered
4. **Sign Up** (`/src/components/Authentication/SignUp.tsx`) - Large size, centered

## Customization

You can customize the logo appearance by:
- Adjusting the `size` prop: `'sm' | 'md' | 'lg' | 'xl'`
- Toggling `showText` to show/hide "StatusAt" text next to the logo
- Adding custom `className` for additional styling

