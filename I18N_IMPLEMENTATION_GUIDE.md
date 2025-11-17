# i18n Implementation Guide

## Overview

This guide shows you how to add translations to all components in the application. We've already completed:
- ✅ Dashboard component - FULLY TRANSLATED
- ✅ Header component - FULLY TRANSLATED
- ✅ SignIn component - FULLY TRANSLATED (example)
- ✅ LanguageSwitcher - FULLY TRANSLATED
- ✅ PWAUpdatePrompt - FULLY TRANSLATED

## Pattern to Follow

### Step 1: Import useTranslation Hook

At the top of your component file:

```typescript
import { useTranslation } from 'react-i18next';
```

### Step 2: Initialize the Hook

At the beginning of your component function:

```typescript
const MyComponent = () => {
  const { t } = useTranslation();
  // ... rest of component
};
```

### Step 3: Replace Hardcoded Strings

**Before:**
```typescript
<h1>Sign In</h1>
<p>Enter your credentials to access your account</p>
<Button>Sign In</Button>
```

**After:**
```typescript
<h1>{t('auth.signInTitle')}</h1>
<p>{t('auth.signInDescription')}</p>
<Button>{t('auth.signInButton')}</Button>
```

### Step 4: Handle Interpolated Values

For strings with dynamic values, use interpolation:

**Before:**
```typescript
<p>Welcome back, {user.name}!</p>
```

**After:**
```typescript
<p>{t('dashboard.welcome', { name: user.name })}</p>
```

### Step 5: Handle Conditional Text

**Before:**
```typescript
{isLoading ? 'Loading...' : 'Load More'}
```

**After:**
```typescript
{isLoading ? t('common.loading') : t('common.loadMore')}
```

## Component-by-Component Checklist

### HIGH PRIORITY (Do These First)

#### 1. SignUp Component (`src/components/Authentication/SignUp.tsx`)
**Status**: ⏳ TODO
**Strings to translate** (~30):
- Page title: "Create Account"
- Form labels: "Name", "Email", "Password", "Confirm Password", "WhatsApp Phone Number"
- Placeholders: "Enter your full name", "Enter your email", etc.
- Validation messages: "Please fill in all fields", "Passwords do not match", etc.
- Links: "Already have an account?", "Sign in"
- Success messages
- Invite-specific messages

**Translation keys** (already in i18n.ts):
```typescript
t('auth.signUpTitle')
t('auth.signUpDescription')
t('auth.name')
t('auth.email')
t('auth.password')
t('auth.confirmPassword')
t('auth.namePlaceholder')
t('auth.emailPlaceholder')
t('auth.passwordPlaceholder')
t('auth.confirmPasswordPlaceholder')
t('auth.fillAllFields')
t('auth.passwordMismatch')
t('auth.passwordMinLength')
t('auth.whatsappNumber')
t('auth.whatsappHelper')
t('auth.agreeToReceiveUpdates')
t('auth.creatingAccount')
t('auth.signUpButton')
t('auth.alreadyHaveAccount')
t('auth.signIn')
```

#### 2. ForgotPassword Component (`src/components/Authentication/ForgotPassword.tsx`)
**Status**: ⏳ TODO
**Strings to translate** (~15):
- "Reset Password", "Send Reset Link", "Email Sent!", etc.

**Translation keys** (already in i18n.ts):
```typescript
t('auth.forgotPasswordTitle')
t('auth.forgotPasswordDescription')
t('auth.emailAddress')
t('auth.enterEmailAddress')
t('auth.sendResetLink')
t('auth.sending')
t('auth.emailSent')
t('auth.checkInbox')
t('auth.resetLinkSentTo')
t('auth.didntReceiveEmail')
t('auth.tryAgain')
t('auth.backToSignIn')
t('auth.rememberPassword')
t('auth.needNewAccount')
t('auth.failedToSendReset')
```

#### 3. ConfirmEmail Component (`src/components/Authentication/ConfirmEmail.tsx`)
**Status**: ⏳ TODO
**Keys available in i18n.ts**: `auth.checkYourEmail`, `auth.confirmYourEmail`, etc.

#### 4. EmailConfirmation Component (`src/components/Authentication/EmailConfirmation.tsx`)
**Status**: ⏳ TODO
**Keys available in i18n.ts**: `auth.confirmingEmail`, `auth.emailConfirmed`, etc.

#### 5. FlowManagement Component (`src/components/Flow/FlowManagement.tsx`)
**Status**: ⏳ TODO
**Strings to translate** (~50):
- Need to ADD flow management keys to i18n.ts first
- "Back to Dashboard", "Flow Management", "Search flows...", "Create Flow", etc.

**Required i18n additions**:
```typescript
flows: {
  // Existing keys...
  backToDashboard: 'Back to Dashboard',
  flowManagement: 'Flow Management',
  manageWorkflows: 'Manage your status tracking workflows',
  managingFor: 'Managing flows for {{tenant}}',
  noOrgSelected: 'No Organization Selected',
  selectOrgMessage: 'Please select an organization from the menu to manage flows.',
  searchFlows: 'Search flows...',
  perPage: '{{count}} per page',
  loadingFlows: 'Loading flows...',
  failedToLoad: 'Failed to load flows. Please try again.',
  flowsCount: 'Flows ({{count}})',
  noFlowsFound: 'No Flows Found',
  notCreatedYet: "You haven't created any flows yet.",
  noMatchingFlows: "No flows match '{{search}}'. Try adjusting your search.",
  showingPagination: 'Showing {{start}} to {{end}} of {{total}} flows',
  created: 'Created: {{date}}',
  edit: 'Edit',
  invite: 'Invite',
  delete: 'Delete',
  // ... more keys
}
```

#### 6. MemberManagement Component (`src/components/Member/MemberManagement.tsx`)
**Status**: ⏳ TODO
**Need to expand members section in i18n.ts**

#### 7. CustomerManagement Component (`src/components/Customer/CustomerManagement.tsx`)
**Status**: ⏳ TODO
**Need to expand customers section in i18n.ts**

### MEDIUM PRIORITY

#### 8. AccountSettings Component (`src/components/Account/AccountSettings.tsx`)
#### 9. NotificationPreferences Component (`src/components/Account/NotificationPreferences.tsx`)
#### 10. FlowBuilder Component (`src/components/Flow/FlowBuilder.tsx`)
#### 11. CreateFlowDialog Component (`src/components/Flow/CreateFlowDialog.tsx`)
#### 12. TenantPage Component (`src/components/Tenant/TenantPage.tsx`)
#### 13. SubscriptionManagement Component (`src/components/Payment/SubscriptionManagement.tsx`)

### LOWER PRIORITY

#### 14. HomeShell Component (`src/components/Home/HomeShell.tsx`)
#### 15. InboxPage Component (`src/components/Inbox/InboxPage.tsx`)
#### 16. CreateOrganization Component (`src/components/Tenant/CreateOrganization.tsx`)
#### 17. TenantSettings Component (`src/components/Tenant/TenantSettings.tsx`)

## Adding New Translation Keys

### Process:

1. **Identify all hardcoded strings** in the component
2. **Add keys to ALL 4 languages** in `src/lib/i18n.ts`:
   - English (en)
   - Spanish (es)
   - Portuguese (pt)
   - French (fr)

3. **Keep the structure consistent** across all languages

### Example: Adding Flow Management Keys

1. Open `src/lib/i18n.ts`

2. Find the `flows` section in English (around line 82)

3. Add new keys:
```typescript
flows: {
  title: 'Flows',
  // ... existing keys ...

  // Add new keys:
  backToDashboard: 'Back to Dashboard',
  flowManagement: 'Flow Management',
  searchFlows: 'Search flows...',
  // etc.
}
```

4. Scroll to Spanish section (line ~269), find `flows`, add Spanish translations:
```typescript
flows: {
  title: 'Flujos',
  // ... existing keys ...

  backToDashboard: 'Volver al Panel',
  flowManagement: 'Gestión de Flujos',
  searchFlows: 'Buscar flujos...',
  // etc.
}
```

5. Repeat for Portuguese (pt) section (~537):
```typescript
flows: {
  title: 'Fluxos',
  // ... existing keys ...

  backToDashboard: 'Voltar ao Painel',
  flowManagement: 'Gestão de Fluxos',
  searchFlows: 'Pesquisar fluxos...',
  // etc.
}
```

6. Repeat for French (fr) section (~669):
```typescript
flows: {
  title: 'Flux',
  // ... existing keys ...

  backToDashboard: 'Retour au Tableau de Bord',
  flowManagement: 'Gestion des Flux',
  searchFlows: 'Rechercher des flux...',
  // etc.
}
```

## Translation Tips

### 1. Use Consistent Key Names

✅ GOOD:
```typescript
auth.signIn
auth.signInButton
auth.signInTitle
auth.signingIn
```

❌ BAD:
```typescript
auth.signin
auth.buttonSignIn
auth.sign_in_title
auth.signinginprogress
```

### 2. Group Related Keys

```typescript
flows: {
  // List/Management
  flowManagement: '...',
  searchFlows: '...',

  // Actions
  create: '...',
  edit: '...',
  delete: '...',

  // States
  loading: '...',
  empty: '...',
}
```

### 3. Handle Pluralization

For counts, use interpolation:
```typescript
// i18n.ts
flowsCount: 'Flows ({{count}})'
flowsCount_plural: '{{count}} flows'

// Component
t('flows.flowsCount', { count: flows.length })
```

### 4. Context Matters

Sometimes the same English word has different translations based on context:

```typescript
// "Back" button
common.back: 'Back'  // Spanish: 'Atrás', French: 'Retour'

// "Back side"
common.backSide: 'Back'  // Spanish: 'Reverso', French: 'Verso'
```

### 5. Keep Formatting

Maintain HTML/Markdown in translations:
```typescript
// English
message: 'Click <strong>here</strong> to continue'

// Spanish
message: 'Haga clic <strong>aquí</strong> para continuar'
```

## Testing Your Translations

### 1. Run the app:
```bash
npm run dev
```

### 2. Click the language switcher in the header

### 3. Switch between languages and verify:
- All text changes
- No English text remains
- Layout doesn't break
- Interpolated values still work

### 4. Common Issues:

**Text doesn't change:**
- Check if you imported `useTranslation`
- Check if you initialized `const { t } = useTranslation()`
- Check if the key exists in i18n.ts for ALL languages

**Missing interpolation:**
```typescript
// ❌ Wrong
t('dashboard.welcome')

// ✅ Correct
t('dashboard.welcome', { name: user.name })
```

**Pluralization not working:**
```typescript
// ❌ Wrong
t('flows.count') + ': ' + count

// ✅ Correct
t('flows.count', { count })
```

## Quick Reference: Common Keys

Already available in `src/lib/i18n.ts`:

### Common
```typescript
t('common.loading')      // Loading...
t('common.error')        // Error
t('common.success')      // Success
t('common.cancel')       // Cancel
t('common.confirm')      // Confirm
t('common.save')         // Save
t('common.delete')       // Delete
t('common.edit')         // Edit
t('common.create')       // Create
t('common.back')         // Back
t('common.close')        // Close
```

### Navigation
```typescript
t('nav.home')           // Home
t('nav.dashboard')      // Dashboard
t('nav.flows')          // Flows
t('nav.members')        // Members
t('nav.signIn')         // Sign In
t('nav.signOut')        // Sign Out
```

### Authentication
```typescript
t('auth.email')                  // Email
t('auth.password')               // Password
t('auth.emailPlaceholder')       // Enter your email
t('auth.passwordPlaceholder')    // Enter your password
t('auth.signInButton')           // Sign In
t('auth.signingIn')              // Signing in...
t('auth.fillAllFields')          // Please fill in all fields
t('auth.loginFailed')            // Login failed
```

### Dashboard (Fully implemented!)
```typescript
t('dashboard.title')                    // Dashboard
t('dashboard.welcome', { name })        // Welcome back, {name}!
t('dashboard.createOrganization')       // Create Organization
t('dashboard.managementMode')           // Management Mode
t('dashboard.managementTools')          // Management Tools
// ... see Dashboard.tsx for full list
```

## Progress Tracking

### Completed ✅
1. Dashboard.tsx
2. Header.tsx
3. SignIn.tsx
4. language-switcher.tsx
5. pwa-update-prompt.tsx

### In Progress ⏳
- You're here! Ready to continue with SignUp, ForgotPassword, etc.

### TODO 📋
- SignUp.tsx
- ForgotPassword.tsx
- ConfirmEmail.tsx
- EmailConfirmation.tsx
- FlowManagement.tsx
- FlowBuilder.tsx
- CreateFlowDialog.tsx
- MemberManagement.tsx
- CustomerManagement.tsx
- AccountSettings.tsx
- NotificationPreferences.tsx
- TenantPage.tsx
- SubscriptionManagement.tsx
- HomeShell.tsx
- InboxPage.tsx
- CreateOrganization.tsx
- TenantSettings.tsx
- ... (see full list in exploration report)

## Estimated Work Remaining

- **Total Components**: 25+
- **Completed**: 5 (20%)
- **Remaining**: 20+ (80%)
- **Estimated Strings**: ~400-500
- **Estimated Time**: 10-15 hours for complete implementation

## Getting Help

### If a component has complex logic:
1. Start with the most visible strings (titles, buttons)
2. Then do form labels and placeholders
3. Then validation messages
4. Finally, edge case messages

### If you're unsure about a translation:
1. Use Google Translate as a starting point
2. Check context - same English word may need different translations
3. Keep it simple and clear
4. Test with a native speaker if possible

### If the build fails:
1. Check for missing commas in i18n.ts
2. Check for mismatched quotes (' vs ")
3. Check for missing translation keys in any language
4. Run `npm run build` to see exact errors

## Next Steps

### Immediate:
1. Update SignUp.tsx (use SignIn.tsx as reference)
2. Update ForgotPassword.tsx
3. Test language switching

### Short-term:
1. Complete all authentication components
2. Move to flow management components
3. Update member/customer components

### Long-term:
1. Complete all 25+ components
2. Add any missing languages
3. Consider professional translation review
4. Set up translation management system (if needed)

---

**Last Updated**: 2025-10-27

**Example Component Complete**: `src/components/Authentication/SignIn.tsx` - Use this as your reference implementation!
