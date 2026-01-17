# Vertical Landing Pages Guide

This guide explains how to create new industry-specific landing pages (verticals) like `/law-services`, `/visa-services`, etc.

## Overview

The vertical landing page system uses a reusable component (`VerticalLandingPage.tsx`) with configuration-driven content. This allows you to create new industry-specific pages by writing ~20 lines of config instead of 500+ lines of duplicate code.

**Existing Verticals:**

- `/law-services` - Legal case tracking
- `/visa-services` - Visa & passport tracking

## Architecture

```
src/components/LandingPages/
├── VerticalLandingPage.tsx        # Reusable component (shared structure)
├── verticalConfigs.ts             # Configuration for each vertical
├── LawServicesLanding.tsx         # Thin wrapper using lawServicesConfig
├── VisaServicesLanding.tsx        # Thin wrapper using visaServicesConfig
└── README.md                      # This file
```

---

## Adding a New Vertical

Let's walk through adding a new vertical landing page for "Education Services" as an example.

### Step 1: Add Configuration

**File:** `src/components/LandingPages/verticalConfigs.ts`

Add your new config export:

```typescript
import {
  BookOpen,
  FileText,
  Palette,
  Users,
  Eye,
  Bell,
  History,
  QrCode,
  Smartphone,
  Shield,
} from 'lucide-react';

export const educationServicesConfig: VerticalConfig = {
  namespace: 'education', // Translation namespace

  seo: {
    title:
      'Student Status Tracking Software | Keep Students & Parents Informed',
    description:
      'Professional tracking platform for education consultants and student visa agencies. Automate updates via WhatsApp, manage documents, and track applications. 10% off with code EDU10.',
    keywords:
      'education tracking software, student visa tracking, education consultant software, student application tracking',
    url: 'https://statusat.com/education-services',
  },

  analytics: {
    heroEvent: 'education_services_hero',
    ctaEvent: 'education_services_cta',
    pageLabel: 'Education',
  },

  schema: {
    name: 'Status At - Education & Student Tracking',
    description:
      'Professional tracking platform for education consultants. Automate student updates and manage applications efficiently.',
    featureList: [
      'Custom student tracking workflows',
      'Document management',
      'Automated student & parent updates',
      'Application tracking',
      'Team collaboration',
      'Brand customization',
    ],
  },

  features: [
    {
      icon: BookOpen,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: FileText,
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Palette,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      gradient: 'from-green-500 to-emerald-500',
    },
  ],

  benefits: [
    { icon: Eye },
    { icon: Bell },
    { icon: History },
    { icon: QrCode },
    { icon: Smartphone },
    { icon: Shield },
  ],

  showUseCases: true, // Optional: show use cases section
  useCases: [
    'undergraduate',
    'graduate',
    'studyAbroad',
    'languageSchools',
    'vocational',
    'universityAdmissions',
  ],
};
```

**Notes:**

- `namespace`: Must match your translation files (e.g., `education.ts`)
- `features`: Array of icons/gradients. Maps to translation keys: `customWorkflows`, `documentManagement`, `branding`, `tracking`, `teamAlignment`
- `benefits`: Array of icons. Maps to translation keys: `alwaysKnow`, `updates`, `whatsapp`, `history`, `signUp`, `checkStatus`, `checkProgress`, `secure`
- `useCases`: Optional array of translation keys for the use cases section

---

### Step 2: Create Component File

**File:** `src/components/LandingPages/EducationServicesLanding.tsx`

```typescript
import VerticalLandingPage from './VerticalLandingPage';
import { educationServicesConfig } from './verticalConfigs';

const EducationServicesLanding = () => {
  return <VerticalLandingPage config={educationServicesConfig} />;
};

export default EducationServicesLanding;
```

---

### Step 3: Add Route

**File:** `src/components/layout/Shell.tsx`

1. Add lazy import at top with other landing page imports (~line 48):

```typescript
const EducationServicesLanding = lazy(
  () => import('../LandingPages/EducationServicesLanding')
);
```

2. Add route in the "Landing pages for verticals" section (~line 253):

```typescript
{/* Landing pages for verticals */}
<Route
  path="/education-services"
  element={
    <ProtectedRoute fallbackRoute="/home">
      <EducationServicesLanding />
    </ProtectedRoute>
  }
/>
```

---

### Step 4: Add to Reserved Routes

**File:** `src/lib/constants.ts`

Add your new route to the `RESERVED_ROUTES` array (around line 19-21):

```typescript
export const RESERVED_ROUTES = [
  // ... other routes

  // Vertical Landing Pages
  'visa-services',
  'law-services',
  'education-services', // Add your new route here

  // ... other routes
] as const;
```

**Why?** This prevents users from creating organizations with names that conflict with your landing page routes. For example, if someone tries to create an organization called "education-services", it would conflict with your `/education-services` route.

---

### Step 5: Update Main README

**File:** `README.md` (root of project)

Find the "Reserved Routes" section (around line 428) and add your new route:

```markdown
**Public Pages:**

- `home`, `sign-in`, `sign-up`, `forgot-password`, `confirm-email`, `email-confirmation`
- `privacy`, `terms`
- `visa-services`, `law-services`, `education-services` (add here)
- `pricing`, `how-it-works`, `demo` (Google Ads sitelinks)
```

This documents the new route for other developers.

---

### Step 6: Create Translation Files

You need to create translation files for **all 5 languages**: `en`, `de`, `es`, `fr`, `pt`

#### 6a. English Translations

**File:** `src/locales/en/education.ts`

```typescript
export default {
  hero: {
    couponCode: 'EDU10',
    couponText: 'Special Offer: Use code',
    couponOffer: 'for 10% off',
    title: 'Keep Your Students & Parents',
    titleHighlight: 'Always Informed',
    subtitle:
      'The professional status tracking platform built for education consultants and student visa agencies. Automate communications and reduce endless status inquiries.',
    startTrial: 'Start Free 7-Day Trial',
    trialInfo: '✨ 7-day free trial • Cancel anytime • Start in minutes',
  },
  problem: {
    title: 'Drowning in "What\'s My Application Status?" Messages?',
    description:
      'Students and parents are anxious about applications. They email, call, and message constantly. Your team wastes hours answering the same questions.',
    painPoints: {
      calls: 'Endless status inquiries from students & parents',
      time: 'Hours daily on repetitive updates',
      automate: 'Most questions could be automated',
    },
  },
  features: {
    title: 'Built Specifically for',
    titleHighlight: 'Education Services',
    subtitle:
      'Everything you need to manage student applications professionally',
    customWorkflows: {
      title: 'Custom Workflows for Every Program',
      description:
        'Build specific flows for undergraduate, graduate, study abroad, and language programs. Match your exact process with drag-and-drop simplicity.',
    },
    documentManagement: {
      title: 'Document Hub for Students',
      description:
        'Students upload transcripts, test scores, and documents directly. Everything organized in one place - no more email chaos.',
    },
    branding: {
      title: 'Your Agency, Your Brand',
      description:
        'Customize with your logo and colors. Students see your professional agency brand throughout.',
    },
    tracking: {
      title: 'Real-Time Application Tracking',
      description:
        'Students and parents track progress 24/7. Automatic updates reduce your support load dramatically.',
    },
  },
  clientBenefits: {
    title: 'What Your Students & Parents Get',
    subtitle: "A modern, transparent experience they'll love",
    alwaysKnow: {
      title: 'Always Know Their Status',
      description:
        'Students see exactly where their application stands - no guessing, no anxiety.',
    },
    updates: {
      title: 'Instant Updates',
      description:
        'Automatic notifications when applications progress. No more checking emails constantly.',
    },
    history: {
      title: 'Full Application History',
      description:
        'Complete timeline of every step, document, and milestone in their application journey.',
    },
    signUp: {
      title: 'Easy QR Code Sign-Up',
      description:
        "Students scan a QR code and they're enrolled. No complicated setup or passwords to remember.",
    },
    checkStatus: {
      title: 'Check Status Anytime',
      description:
        'Mobile-friendly portal lets students check progress on any device, 24/7.',
    },
    secure: {
      title: 'Secure & Private',
      description:
        'Bank-level encryption keeps sensitive student documents and data completely secure.',
    },
  },
  useCases: {
    title: 'Perfect for All Education Services',
    cases: {
      undergraduate: 'Undergraduate Admissions',
      graduate: 'Graduate Programs',
      studyAbroad: 'Study Abroad Programs',
      languageSchools: 'Language Schools',
      vocational: 'Vocational Training',
      universityAdmissions: 'University Admissions',
    },
  },
  cta: {
    title: 'Ready to Eliminate Status Inquiries?',
    subtitle:
      "Join education consultants who've automated their student communication",
    startTrial: 'Start Free 7-Day Trial',
    pricing: 'Starting from €49/month • Use code EDU10 for 10% off',
  },
};
```

#### 6b. Add to Locale Index Files

For **each language** (`en`, `de`, `es`, `fr`, `pt`), update the index file:

**Files:**

- `src/locales/en/index.ts`
- `src/locales/de/index.ts`
- `src/locales/es/index.ts`
- `src/locales/fr/index.ts`
- `src/locales/pt/index.ts`

Add import and export:

```typescript
import education from './education';

export default {
  translation: {
    common,
    // ... other imports
    education, // Add this
  },
};
```

#### 6c. Translate for Other Languages

**Repeat Step 6a for all languages:**

- `src/locales/de/education.ts` (German)
- `src/locales/es/education.ts` (Spanish)
- `src/locales/fr/education.ts` (French)
- `src/locales/pt/education.ts` (Portuguese)

Use existing `visa.ts` or `law.ts` files as templates. You can use AI translation tools or professional translation services.

---

### Step 7: Update Sitemap

**File:** `public/sitemap.xml`

Add your new page (maintain alphabetical or priority order):

```xml
<!-- Education Services Landing Page -->
<url>
  <loc>https://statusat.com/education-services</loc>
  <lastmod>2026-01-17</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.9</priority>
</url>
```

**Update `lastmod` to today's date.**

---

### Step 8: Test Locally

```bash
# 1. Start dev server
npm run dev

# 2. Visit your new page
open http://localhost:5173/education-services

# 3. Test all languages
# Check language switcher works for all content

# 4. Test responsive design
# Check mobile, tablet, desktop views

# 5. Check console for errors
# Open browser DevTools and verify no errors
```

**Testing Checklist:**

- [ ] Page loads without errors
- [ ] All translations display correctly (test all 5 languages)
- [ ] Video embed works
- [ ] All CTA buttons link to `/sign-up`
- [ ] Analytics tracking fires (check console logs in dev mode)
- [ ] Use cases section shows/hides based on config
- [ ] Mobile responsive design works
- [ ] SEO meta tags are correct (view page source)

---

### Step 9: Build & Deploy

```bash
# Build production bundle
npm run build

# Test production build locally
npm run preview

# Deploy (your deployment process)
# E.g., git push to trigger CI/CD
```

---

## External Setup (Post-Deployment)

### Google Search Console

1. **Submit Updated Sitemap**

   - Go to [Google Search Console](https://search.google.com/search-console)
   - Navigate to "Sitemaps" in left sidebar
   - Remove old sitemap if needed
   - Add: `https://statusat.com/sitemap.xml`
   - Click "Submit"

2. **Request Indexing (Optional - Faster)**

   - Go to "URL Inspection" tool
   - Enter: `https://statusat.com/education-services`
   - Click "Request Indexing"
   - Wait 24-48 hours for Google to index

3. **Monitor Coverage**
   - Check "Coverage" report after 1-2 weeks
   - Verify your new page appears as "Valid"
   - Fix any errors reported by Google

### Google Analytics

Your page will automatically track analytics because:

- We're using the shared `trackClick` and `trackSignUpStart` functions
- Analytics events fire based on your config (`heroEvent`, `ctaEvent`)

**Verify tracking works:**

1. Visit [Google Analytics](https://analytics.google.com)
2. Go to Realtime → Overview
3. Visit your new page
4. Click CTA buttons
5. Verify events appear in Realtime view

### Google Ads (Optional)

If running Google Ads campaigns for this vertical:

1. **Create Ad Campaign**

   - Use URL: `https://statusat.com/education-services`
   - Add UTM parameters for tracking: `?utm_source=google&utm_medium=cpc&utm_campaign=education`

2. **Set Up Conversion Tracking**

   - Your page already tracks `sign_up` events
   - Import these events to Google Ads as conversions

3. **Create Sitelinks**
   - Link to `/pricing`, `/how-it-works`, `/demo` from your ad
   - Use the coupon code (e.g., EDU10) in ad copy

---

## Translation Management

### Translation Keys Structure

All translations follow this structure:

```
{vertical}.hero.*           - Hero section content
{vertical}.problem.*        - Problem section content
{vertical}.features.*       - Features section content
{vertical}.clientBenefits.* - Client benefits section
{vertical}.useCases.*       - Use cases section (optional)
{vertical}.cta.*            - Call-to-action section
```

### Adding New Languages

If you need to add a 6th language (e.g., Italian):

1. Create `src/locales/it/` directory
2. Copy all files from `src/locales/en/`
3. Translate all content
4. Update `src/locales/index.ts` to include Italian
5. Update language switcher component to include `it`

---

## Customization Options

### Feature Icons & Gradients

Choose from [Lucide Icons](https://lucide.dev/icons/):

```typescript
import {
  BookOpen, // Education
  Briefcase, // Business
  Heart, // Healthcare
  Truck, // Logistics
  Home, // Real Estate
  // ... any icon from lucide-react
} from 'lucide-react';
```

Gradient options (Tailwind):

```typescript
'from-indigo-500 to-purple-500'; // Purple
'from-blue-500 to-cyan-500'; // Blue
'from-green-500 to-emerald-500'; // Green
'from-orange-500 to-red-500'; // Orange/Red
'from-pink-500 to-rose-500'; // Pink
```

### Optional Sections

```typescript
// Show/hide use cases section
showUseCases: true,

// Custom use cases (maps to translation keys)
useCases: [
  'keyOne',
  'keyTwo',
  'keyThree',
  // Add as many as needed
],
```

### SEO Best Practices

1. **Title**: 60-70 characters max
2. **Description**: 150-160 characters max
3. **Keywords**: 5-10 relevant keywords, comma-separated
4. **URL**: Use kebab-case (e.g., `/education-services`)
5. **Schema.org**: Already included in config
6. **Coupon Code**: Make it memorable (e.g., `LAW10`, `VISA10`, `EDU10`)

---

## Troubleshooting

### Page Not Found (404)

- Verify route is added to `Shell.tsx`
- Check component filename matches import
- Run `npm run build` to ensure no TypeScript errors

### Translations Missing

- Verify translation files exist for all 5 languages
- Check translation keys match config `namespace`
- Look for typos in `index.ts` import/export
- Check browser console for i18n warnings

### Analytics Not Tracking

- Verify user accepted cookies (check cookie banner)
- Open browser DevTools → Console
- Look for `[Analytics] Event:` logs
- Check GA4 Realtime view

### Icons Not Showing

- Verify icon is imported from `lucide-react`
- Check icon name spelling
- Ensure icon is passed correctly in config

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

---

## Examples

### Minimal Config (No Use Cases)

```typescript
export const healthcareConfig: VerticalConfig = {
  namespace: 'healthcare',
  seo: {
    /* ... */
  },
  analytics: {
    /* ... */
  },
  schema: {
    /* ... */
  },
  features: [
    /* 4 features */
  ],
  benefits: [
    /* 6 benefits */
  ],
  showUseCases: false, // No use cases section
};
```

### Full Config (With Use Cases)

```typescript
export const logisticsConfig: VerticalConfig = {
  namespace: 'logistics',
  seo: {
    /* ... */
  },
  analytics: {
    /* ... */
  },
  schema: {
    /* ... */
  },
  features: [
    /* 4 features */
  ],
  benefits: [
    /* 6 benefits */
  ],
  showUseCases: true,
  useCases: [
    'shipping',
    'warehousing',
    'lastMile',
    'freight',
    'customs',
    'returns',
  ],
};
```

---

## Quick Reference Checklist

When adding a new vertical:

**Code Changes:**

- [ ] Add config to `verticalConfigs.ts`
- [ ] Create component file (`{Vertical}ServicesLanding.tsx`)
- [ ] Add lazy import to `Shell.tsx`
- [ ] Add route to `Shell.tsx`
- [ ] Add route to `RESERVED_ROUTES` in `src/lib/constants.ts`
- [ ] Update main `README.md` reserved routes section

**Translations:**

- [ ] Create `en/{vertical}.ts` translation file
- [ ] Add translation import/export to `en/index.ts`
- [ ] Copy & translate for: `de`, `es`, `fr`, `pt`
- [ ] Add translation imports to all locale `index.ts` files

**SEO & Testing:**

- [ ] Update `public/sitemap.xml`
- [ ] Test locally (all languages, responsive)
- [ ] Build and deploy

**Post-Deployment:**

- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for new page
- [ ] Verify analytics tracking
- [ ] Set up Google Ads (if applicable)

---

## Need Help?

- **Translation Issues**: Check existing `visa.ts` or `law.ts` as reference
- **Styling Issues**: All styles are in `VerticalLandingPage.tsx` - shared across all verticals
- **SEO Issues**: Use [Google's Rich Results Test](https://search.google.com/test/rich-results)
- **Analytics Issues**: Check browser console for `[Analytics]` logs

---

## Benefits of This System

✅ **Consistency**: All verticals have the same structure and UX
✅ **Maintainability**: Fix once, apply everywhere
✅ **Speed**: Create new vertical in ~30 minutes vs 4+ hours
✅ **SEO**: Built-in SEO best practices for all pages
✅ **i18n**: Multilingual support out of the box
✅ **Analytics**: Tracking configured automatically
✅ **Type-Safe**: TypeScript catches config errors at build time
