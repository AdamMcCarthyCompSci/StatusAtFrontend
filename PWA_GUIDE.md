# Progressive Web App (PWA) Guide

## What is a PWA?

A **Progressive Web App (PWA)** is a modern web application that provides an app-like experience using web technologies. It combines the best features of web and native mobile apps:

### Key Features
- **Installable**: Users can add it to their home screen without visiting an app store
- **Offline Support**: Works without internet connection using service workers
- **Fast Loading**: Cached resources load instantly
- **Automatic Updates**: Updates happen in the background without user intervention
- **Push Notifications**: Can send notifications (when implemented)
- **Native-like Experience**: Feels like a native app with full-screen mode and app icons

### Why PWAs Matter
1. **No App Store**: Users don't need to download from app stores
2. **One Codebase**: Works across all platforms (iOS, Android, Desktop)
3. **Always Up-to-Date**: Users always have the latest version
4. **Smaller Size**: Takes less space than native apps
5. **SEO Friendly**: Still accessible via web search engines

## How to Use This PWA

### Installing on Desktop (Chrome, Edge, Brave)

1. **Visit the application** in your browser
2. **Look for the install prompt** in the address bar:
   - Chrome/Edge: Click the ⊕ install icon in the address bar
   - Or click the three-dot menu → "Install StatusAt..."
3. **Click "Install"** in the dialog
4. The app will open in its own window
5. **Find the app** in your applications folder or Start menu

**Keyboard Shortcut**: You can also use `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Shift+I` (Mac) to see install options

### Installing on Mobile (iOS Safari)

1. **Open the app** in Safari browser
2. **Tap the Share button** (square with arrow pointing up)
3. **Scroll down** and tap "Add to Home Screen"
4. **Edit the name** if desired
5. **Tap "Add"** in the top right
6. The app icon will appear on your home screen

**Note**: iOS requires Safari for PWA installation. Chrome/Firefox on iOS won't work for installation.

### Installing on Mobile (Android Chrome)

1. **Open the app** in Chrome browser
2. **Look for the install banner** at the bottom of the screen
   - Or tap the three-dot menu → "Install app" or "Add to Home screen"
3. **Tap "Install"** or "Add"
4. The app will appear on your home screen and app drawer

### Using the App Offline

Once installed, the PWA works offline:

1. **Visit any page** while online
2. **Disconnect from the internet**
3. **Navigate the app** - cached pages will still work
4. **API calls** will fail gracefully with error messages
5. **Reconnect** - the app will sync automatically

**What's Cached**:
- HTML pages
- JavaScript bundles
- CSS stylesheets
- Images and icons
- Fonts (including Google Fonts)

**What Needs Internet**:
- API calls to the backend
- Real-time data updates
- Fetching new content

### Managing Updates

The app handles updates automatically:

1. **Service Worker checks** for updates in the background
2. **When an update is available**, you'll see a notification at the bottom-right:
   - "Update available" message
   - "A new version of the app is available..."
3. **Click "Update Now"** to install immediately
4. **Click "Later"** to continue using the current version
5. **The page will reload** with the new version

**Manual Check**: Close and reopen the app to force an update check

### Uninstalling the PWA

#### Desktop
- **Windows**: Right-click the app → "Uninstall"
- **Mac**: Drag the app to Trash
- **Chrome**: Settings → Apps → Manage apps → Find StatusAt → Uninstall

#### Mobile (iOS)
1. **Long-press the app icon**
2. **Tap "Remove App"**
3. **Tap "Delete App"**

#### Mobile (Android)
1. **Long-press the app icon**
2. **Tap "Uninstall"** or drag to "Uninstall" at the top
3. **Confirm**

## Technical Details

### Service Worker

The app uses **Workbox** for service worker generation with the following caching strategies:

```javascript
// Runtime caching strategies:
{
  // Google Fonts - Cache First
  urlPattern: /^https:\/\/fonts\.googleapis\.com/,
  handler: 'CacheFirst',

  // Google Fonts Stylesheets - Stale While Revalidate
  urlPattern: /^https:\/\/fonts\.gstatic\.com/,
  handler: 'StaleWhileRevalidate',

  // API Calls - Network First
  urlPattern: /\/api\//,
  handler: 'NetworkFirst'
}
```

### Manifest Configuration

The `manifest.json` includes:
- **name**: "StatusAt"
- **short_name**: "StatusAt"
- **description**: "Flow management and customer tracking application"
- **theme_color**: "#4F46E5" (Indigo)
- **background_color**: "#ffffff"
- **display**: "standalone" (full-screen app mode)
- **start_url**: "/"
- **icons**: Multiple sizes (72x72 to 512x512)

### Update Strategy

- **registerType**: `autoUpdate` - Updates install automatically
- **Prompt user**: Custom UI via `PWAUpdatePrompt` component
- **Update check**: Every time the user navigates to the app
- **Fallback**: Manual reload triggers update check

### Browser Support

| Browser | Desktop | Mobile | Install | Offline |
|---------|---------|--------|---------|---------|
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ | ✅ |
| Safari | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ⚠️ | ✅ |
| Opera | ✅ | ✅ | ✅ | ✅ |
| Brave | ✅ | ✅ | ✅ | ✅ |

**Legend**: ✅ Full support | ⚠️ Limited support

**Firefox Note**: Firefox supports PWAs but may not show install prompts as readily

## Troubleshooting

### App Won't Install

**Desktop**:
1. Check if you're using **HTTPS** (required for PWAs)
2. Clear browser cache and reload
3. Try incognito/private mode
4. Update browser to latest version
5. Check if app is already installed

**Mobile (iOS)**:
1. Must use **Safari** browser (not Chrome/Firefox)
2. Ensure you're on **iOS 11.3+**
3. Check if "Add to Home Screen" is available in Share menu

**Mobile (Android)**:
1. Must use **Chrome** or **Samsung Internet**
2. Ensure you're on **Android 5.0+**
3. Check browser permissions

### Offline Mode Not Working

1. **Visit the app online first** - service worker must install
2. **Check network tab** in DevTools - ensure resources are cached
3. **Hard refresh** (`Ctrl+F5` or `Cmd+Shift+R`) to reinstall service worker
4. **Clear site data** and revisit online

### Updates Not Appearing

1. **Close all tabs/windows** of the app
2. **Reopen** - update check runs on startup
3. **Clear browser cache** if stuck
4. **Check DevTools** → Application → Service Workers → "Update on reload"

### App Looks Wrong After Update

1. **Hard refresh** the page
2. **Clear cache**: DevTools → Application → Clear storage
3. **Reinstall** the app

## Development

### Testing PWA Locally

```bash
# Build the app
npm run build

# Preview the production build
npm run preview

# Open DevTools → Lighthouse → Run PWA audit
```

### PWA Audit Checklist

Using Chrome DevTools Lighthouse:
- [ ] Performance score > 90
- [ ] Installable (manifest detected)
- [ ] Service worker registered
- [ ] Works offline
- [ ] HTTPS enabled
- [ ] Icons provided
- [ ] Responsive design
- [ ] Fast time-to-interactive

### Debugging Service Worker

**Chrome DevTools**:
1. Open **DevTools** (`F12`)
2. Go to **Application** tab
3. Click **Service Workers**
4. Options:
   - "Update on reload" - Force update on each refresh
   - "Bypass for network" - Disable service worker temporarily
   - "Unregister" - Remove service worker

**View Cache**:
1. DevTools → **Application** → **Cache Storage**
2. Expand to see cached resources
3. Right-click to delete individual items

### Configuration Files

- **vite.config.ts**: PWA plugin configuration
- **public/manifest.json**: Generated from vite config
- **src/components/ui/pwa-update-prompt.tsx**: Update UI component
- **dist/sw.js**: Generated service worker (after build)

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: Learn PWA](https://web.dev/learn/pwa/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [Can I Use: Service Workers](https://caniuse.com/serviceworkers)

---

**Last Updated**: 2025-10-27
