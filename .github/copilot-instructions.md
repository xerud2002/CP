# Curierul Perfect - AI Agent Instructions

Romanian courier marketplace: clients post delivery requests, couriers bid/chat, then fulfill.  
**Stack**: Next.js 16 (App Router), React 19, Firebase 11.1 (Auth/Firestore/Storage), Tailwind CSS 4, Sonner toasts

## Architecture

**Multi-tenant SaaS** with roles: `client` | `curier` | `admin`. Owner-based Firestore security via `uid` fields.

**⚠️ CRITICAL SECURITY**: Firestore rules check ownership but **don't filter results**—client queries MUST include `where('uid', '==', user.uid)`.

### Route Structure
```
/dashboard/client  → /comenzi, /profil, /recenzii, /suport
/dashboard/curier  → /comenzi, /profil, /recenzii, /servicii, /verificare
/dashboard/admin   → Admin panel (user management, verification, stats)
/comanda           → Order creation wizard (no header/footer)
```

### Component & Hook Organization
```
src/components/orders/{client|courier|shared}/  → Role-specific + reusable components
src/components/admin/                           → Admin panel components
src/hooks/{client|courier}/                     → Role-specific data hooks
src/hooks/useChatMessages.ts                    → Shared real-time messaging
```

## Key Files (Single Source of Truth)

| File | Purpose |
|------|---------|
| `lib/constants.ts` | `countries`, `judetByCountry`, `serviceTypes`, `orderStatusConfig` |
| `lib/cities.ts` | `oraseByCountryAndRegion`, `getOraseForRegion()`, `getAllOraseForCountry()` |
| `lib/toast.ts` | `showSuccess()`, `showError()`, `showInfo()`, `showWarning()` — auto-translates Firebase errors to Romanian |
| `lib/contact.ts` | Centralized `CONTACT_INFO`, `SOCIAL_LINKS`, `COMPANY_INFO` |
| `lib/faq.ts` | `FAQ_ITEMS` with category filtering |
| `lib/businessInfo.ts` | `COUNTRY_TAX_INFO` — 20-country tax ID formats |
| `contexts/AuthContext.tsx` | `useAuth()`: `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()`, `resetPassword()` |
| `utils/orderStatusHelpers.ts` | `canEditOrder()`, `canDeleteOrder()`, `transitionToInLucru()`, `transitionToFinalizata()` |
| `types/index.ts` | TypeScript interfaces: `User`, `Order`, `CoverageZone`, `UserRole`, `CourierProfile`, `DocumentRequirement` |

**Architecture Docs**: `COURIER_MESSAGING_SYSTEM.md` (messaging restrictions), `OPTIMIZATION_SUMMARY.md` (refactoring context)

## Error Handling
- Use `showError(err)` from `lib/toast.ts` for user-facing errors (auto-translated to Romanian)
- Use `logError()` from `lib/errorMessages.ts` for development debugging
- Console logs automatically removed in production builds

## Critical Patterns

### 1. Dashboard Auth Template
All `/dashboard/*` pages MUST use this pattern:
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) { // or 'curier' for courier pages
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>;
  if (!user) return null;
  // ... protected content
}
```

### 2. Firestore Owner Filter (REQUIRED)
```tsx
// ✅ CORRECT
const q = query(collection(db, 'zona_acoperire'), where('uid', '==', user.uid), orderBy('addedAt', 'desc'));

// ❌ WRONG - Exposes other users' data
const q = query(collection(db, 'zona_acoperire'), orderBy('addedAt', 'desc'));
```

### 3. Service Name Normalization
Orders store lowercase (`'colete'`), profiles may use capitalized (`'Colete'`):
```tsx
const userServices = user.serviciiOferite?.map(s => s.toLowerCase().trim()) || [];
const matchesService = userServices.includes(order.serviciu.toLowerCase().trim());
```

### 4. Error Handling — Centralized Toasts
```tsx
import { showSuccess, showError } from '@/lib/toast';
try {
  await updateDoc(docRef, data);
  showSuccess('Salvat!');
} catch (err) {
  showError(err);  // Auto-translates Firebase codes to Romanian
}
```

### 5. Timestamps — Server-Side Only
```tsx
import { serverTimestamp } from 'firebase/firestore';
await addDoc(collection(db, 'comenzi'), { ...data, createdAt: serverTimestamp() });
// ❌ NEVER: createdAt: new Date()
```

### 6. Order Status — Use Helpers
```tsx
import { canEditOrder, canDeleteOrder, canFinalizeOrder } from '@/utils/orderStatusHelpers';
if (canEditOrder(order.status)) { /* Show edit button */ }
// ❌ NEVER: if (order.status === 'noua') — business logic must stay in helpers
```

### 7. Real-time Subscriptions — Always Cleanup
```tsx
useEffect(() => {
  const unsubscribe = onSnapshot(query(...), snap => { /* ... */ });
  return () => unsubscribe();  // MUST cleanup
}, [deps]);
```

### 8. Message Threading — Order-Scoped Chats
Each order has isolated chats per courier. Query mesaje collection:
```tsx
// ✅ CORRECT - Filter by all three
const q = query(
  collection(db, 'mesaje'),
  where('orderId', '==', orderId),
  where('clientId', '==', clientId),
  where('courierId', '==', courierId),
  orderBy('timestamp', 'asc')
);
// ❌ WRONG - Missing orderId filter exposes cross-order messages
```

## Order Status Flow
```
noua → in_lucru → livrata
  ↓        ↓
anulata  anulata
```
- `noua`: New, editable/deletable by client
- `in_lucru`: Locked (courier messaged), can be finalized by client
- `livrata`: Complete, triggers review flow
- `anulata`: Cancelled (from `noua` or `in_lucru`)
- Auto-transition: `noua` → `in_lucru` when courier sends first message (via `transitionToInLucru()`)

## Firestore Collections

| Collection | Owner Field | Key Notes |
|------------|-------------|-----------|
| `comenzi` | `uid_client` | Orders with `orderNumber`, `status`, `courierId` |
| `mesaje` | `clientId` + `courierId` | **1-to-1 chat per order** — filter by `orderId`, `clientId`, AND `courierId` |
| `zona_acoperire` | `uid` | Courier coverage zones (multi-record per courier) |
| `profil_curier` | doc ID = `uid` | Extended courier profile (publicly readable) |
| `profil_client` | doc ID = `uid` | Extended client profile (private) |
| `recenzii` | `clientId` | Reviews of couriers (after `livrata` status) |

**Chat System**: Each client-courier pair has a **separate conversation** per order. Query MUST filter by `orderId`, `clientId`, AND `courierId`.

## Styling
- Buttons: `.btn-primary`, `.btn-secondary`
- Layout: `.card`, `.form-input`, `.spinner`
- Brand colors: `text-orange-500` (CTA), `text-emerald-400` (success), `bg-slate-900` (dashboard bg)
- Status styling: `orderStatusConfig[status].bg`, `.color`, `.label`
- Service styling: Use `serviceTypes[].color`, `.bgColor`, `.borderColor` from `constants.ts`

## Commands
```bash
npm run dev                # Dev server (localhost:3000)
npm run build              # Production build
npm run start              # Production server
npm run lint               # ESLint check
npm run lighthouse         # Lighthouse audit (desktop, auto-kills node process)
npm run lighthouse:mobile  # Lighthouse audit (mobile preset)
```
**No emulators**: Project uses live Firebase services.

### Environment Variables
Required in `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
Firebase config is singleton-initialized in `lib/firebase.ts` (checks `getApps().length`).

## Conventions
- **Language**: UI text in Romanian | Code/comments/commits in English
- **Client components**: All dashboard pages need `'use client'` directive
- **Path alias**: `@/*` → `./src/*` — never use relative paths like `../../../`
- **Constants**: Always import from `@/lib/constants.ts`, never duplicate
- **Types**: Import from `@/types/index.ts`, never inline interfaces
- **Firebase SDK**: Modular v11 syntax (`import { collection } from 'firebase/firestore'`)
- **NO PRICES**: Never display prices, currency symbols (€, $, RON), or "de la X" pricing anywhere in the UI or metadata
- **Icons**: Use `src/components/icons/DashboardIcons.tsx` for consistent Heroicons styling
- **Production**: `next.config.ts` removes `console.*` in production builds, optimizes CSS/images (AVIF/WebP)

## Common Mistakes

| ❌ Wrong | ✅ Right |
|----------|----------|
| Query without owner filter | `where('uid', '==', user.uid)` |
| `if (status === 'in_lucru')` | `canEditOrder(status)` |
| Inline service icons/colors | Import from `constants.ts` |
| `alert(error.message)` | `showError(error)` |
| `createdAt: new Date()` | `serverTimestamp()` |
| Missing `onSnapshot` cleanup | `return () => unsubscribe()` |
| Inline contact info | Import from `@/lib/contact.ts` |

## File Organization

**Hooks** (`src/hooks/`):
- `client/` — `useClientOrdersLoader.ts`, `useClientOrderActions.ts`
- `courier/` — `useOrdersLoader.ts`, `useOrderHandlers.ts`, `useUnreadMessages.ts`
- `useChatMessages.ts` — shared real-time messaging

**Components** (`src/components/orders/`):
- `client/filters/`, `client/list/` — client-specific views
- `courier/filters/`, `courier/list/`, `courier/details/` — courier-specific views
- `shared/` — `OrderDetailsModal`, `MessageList`, `MessageInput`, `CountryFilter`

## Courier Messaging Restrictions
Before first message, these checks run (see `COURIER_MESSAGING_SYSTEM.md`):
1. **Order exists** — verify not deleted
2. **Courier verification** — if client accepts only "firme", courier needs `verified: true`
3. **Offer limits** — client sets max couriers (1-3, 4-5, or unlimited)

## Migration Scripts
Located in `scripts/` folder. Requires Firebase Admin SDK setup:
1. Download service account key from Firebase Console → save as `scripts/serviceAccountKey.json`
2. Run with `node scripts/<script>.js`
See `scripts/README.md` for detailed instructions.

## Firebase Security
- **Firestore Rules**: Read access for owners only (`resource.data.uid == request.auth.uid`), but rules **don't auto-filter**
- **Couriers**: Can read ALL orders (for discovery), but update only assigned orders (`resource.data.courierId == request.auth.uid`)
- **Profiles**: `profil_curier` is publicly readable (for client reviews), `profil_client` is private
- **Reviews**: Public read, write only by review author (`clientId == request.auth.uid`)
- **Storage**: Courier verification documents in `courierDocs/{uid}/`, client profile photos in `clientPhotos/{uid}/`

## Performance Optimizations
- Images use Next.js Image component with Firebase Storage remote patterns
- Static assets cached for 1 year (`max-age=31536000, immutable`)
- Next.js static paths cached for 1 year
- CSS optimized via `experimental.optimizeCss` in `next.config.ts`
- Responsive image sizes: `[640, 750, 828, 1080, 1200]`

## Flags & Assets
Country flags in `public/img/flag/{code}.svg` (lowercase, e.g., `ro.svg`, `de.svg`). When adding countries to `constants.ts`, add the corresponding flag SVG.
