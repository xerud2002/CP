# Curierul Perfect - AI Coding Instructions

Romanian courier marketplace connecting clients with couriers for European package delivery.  
**Stack**: Next.js 16 (App Router), React 19, Firebase Auth/Firestore, Tailwind CSS 4

## Architecture Overview

This is a **multi-tenant SaaS** platform with role-based access control. All data isolation uses owner-based security (`uid` fields) enforced at both Firestore rules and client-side query filtering. The app uses **client components** (`'use client'`) throughout dashboards for auth state and real-time updates.

### Role-Based Dashboards
| Role | Path | Pattern |
|------|------|---------|
| `client` | `/dashboard/client` | Single-page dashboard with stats + navigation grid |
| `curier` | `/dashboard/curier` | Card grid dashboard → sub-pages: `/zona-acoperire`, `/calendar`, `/tarife`, `/profil`, `/comenzi`, `/plati`, `/servicii`, `/transport-aeroport`, `/transport-persoane` |
| `admin` | `/dashboard/admin` | Admin panel |

**Auth flow**: `?role=client|curier` on login/register → stores role in Firestore `users/{uid}` → redirects to `/dashboard/{role}`

### Layout Hierarchy
```
RootLayout (AuthProvider)
  └─ LayoutWrapper (conditional Header/Footer)
      ├─ /dashboard/* → DashboardLayout (dark theme, no Header/Footer)
      ├─ /comanda → no Header/Footer (dedicated order page)
      ├─ /(auth)/* → no Header/Footer (login/register/forgot-password)
      └─ all other routes → Header + content + Footer
```

**Routing groups**: `(auth)` is a route group (not in URL path) for grouping auth pages with shared layout  
**Layout logic** (see `LayoutWrapper.tsx`):
- Excludes Header/Footer when: `pathname.startsWith('/dashboard')` OR `/comanda` OR auth routes
- Dashboard pages render page-specific sticky headers with back navigation
- `DashboardLayout` provides dark theme (`bg-slate-900`) with decorative orange/green gradient circles
- Auth pages require `<Suspense>` wrapper when using `useSearchParams()` (Next.js App Router requirement)

### Key Files
| Purpose | File | Description |
|---------|------|-------------|
| Auth hook | `src/contexts/AuthContext.tsx` | `useAuth()` with `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()`, `resetPassword()` |
| Types | `src/types/index.ts` | `User`, `UserRole`, `Order`, `CoverageZone`, `CourierProfile` |
| Firebase | `src/lib/firebase.ts` | Singleton init with `getApps()` pattern (prevents re-init); exports `auth`, `db`, `storage` |
| Styling | `src/app/globals.css` | Custom CSS classes: `btn-primary`, `card`, `form-input`, `tab-menu`, `spinner`, `text-gradient` |
| Icons | `src/components/icons/DashboardIcons.tsx` | All SVG dashboard icons as React components |
| Data | `src/lib/constants.ts` | `countries` (16 EU countries), `judetByCountry` (full region lists for all countries) |
| Helpers | `src/utils/orderHelpers.ts` | `getNextOrderNumber()` (atomic counter), `formatOrderNumber()`, `formatClientName()` |
| Help | `src/components/HelpCard.tsx` | Reusable support card with email/WhatsApp links for all sub-pages |
| Layout | `src/components/LayoutWrapper.tsx` | Conditional Header/Footer logic based on pathname |
| Docs | `FIRESTORE_STRUCTURE.md` | Complete schema docs with security, indexes, and query patterns |

### Firestore Collections
| Collection | Document ID | Owner Field | Purpose |
|------------|-------------|-------------|---------|
| `users` | `{uid}` | `uid` | User profiles & roles + `serviciiOferite` array for couriers |
| `zona_acoperire` | auto | `uid` | Courier coverage zones (multi-record) |
| `tarife_curier` | auto | `uid` | Courier pricing (multi-record) |
| `profil_client` | `{uid}` | — | Extended client profile (single doc per client) |
| `profil_curier` | `{uid}` | — | Extended courier profile (single doc per courier) |
| `comenzi` | auto | `uid_client` | Orders (`orderNumber` field, `courierId` when accepted) |
| `recenzii` | auto | `clientId` | Reviews from clients about couriers |
| `counters` | `orderNumber` | — | Sequential order number counter (uses `runTransaction`) |
| `transport_aeroport` | auto | `uid` | Airport transfer routes (courier-specific) |
| `transport_persoane` | auto | `uid` | Person transport routes (courier-specific) |

**Data Fetching Pattern**: Use `where()` filters + owner field for multi-tenant security:
```tsx
const q = query(collection(db, 'zona_acoperire'), where('uid', '==', user.uid));
const snapshot = await getDocs(q);
```

**Firestore Rules**: All collections enforce owner-based access. Couriers can read pending orders + their assigned orders. See `FIRESTORE_STRUCTURE.md` for complete security documentation. **CRITICAL**: Queries MUST filter by owner field client-side — rules alone don't auto-filter queries.

**Order Numbering**: Orders use sequential numbers starting at `141121` via `getNextOrderNumber()` using Firestore transactions on `counters/orderNumber`. Display with `formatOrderNumber()` → `"CP141121"`. Fallback handles old orders without `orderNumber` field.

**Service Name Normalization**: **CRITICAL** - Always compare service names case-insensitive (`.toLowerCase().trim()`):
- Orders: saved as lowercase (`'colete'`, `'plicuri'`, `'persoane'`)
- Courier services: saved as capitalized in `users.serviciiOferite` (`'Colete'`, `'Plicuri'`, `'Persoane'`)
- **All service matching MUST normalize both sides to lowercase before comparison**

## Critical Patterns

### Protected Page Template (REQUIRED for all dashboard pages)
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CurierPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;
  if (!user) return null;
  // Page content...
}
```

### Suspense for useSearchParams (auth pages)
```tsx
export default function Page() {
  return <Suspense fallback={<div className="spinner"></div>}><LoginForm /></Suspense>;
}
```
**Why**: Next.js requires Suspense for dynamic params (`searchParams`) when using client components

### Firestore Writes — Always use serverTimestamp()
```tsx
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

await addDoc(collection(db, 'zona_acoperire'), { 
  uid: user.uid, 
  tara, 
  judet, 
  addedAt: serverTimestamp() // Server-side timestamp (not Date.now())
});
```
**Why**: Server timestamps prevent client clock skew issues and ensure consistent ordering

### Error Handling Pattern
```tsx
try {
  await someFirebaseOperation();
} catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Eroare necunoscută';
  setError(errorMessage);
}
```
Use type-safe `unknown` and check `instanceof Error` before accessing `.message`

### Sub-page Header Pattern (curier sub-pages)
```tsx
<div className="bg-slate-900/80 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
    <div className="flex items-center gap-3">
      <Link href="/dashboard/curier" className="p-2 hover:bg-slate-800/80 rounded-xl">
        <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
      </Link>
      <div className="p-2.5 bg-linear-to-br from-{color}-500/20 to-{color}-500/20 rounded-xl border border-{color}-500/20">
        <PageIcon className="w-6 h-6 text-{color}-400" />
      </div>
      <div><h1 className="text-lg sm:text-2xl font-bold text-white">Page Title</h1></div>
    </div>
  </div>
</div>
```

## Styling

### CSS Classes (from globals.css)
| Use | Classes |
|-----|---------|
| Buttons | `btn-primary` (orange), `btn-secondary` (green), `btn-danger`, `btn-outline-orange`, `btn-outline-green` |
| Cards | `card` (glassmorphism), `stat-card` |
| Forms | `form-input`, `form-select`, `form-label` |
| Tabs | `tab-menu`, `tab-button`, `tab-button.active` |
| Loading | `spinner` |
| Text | `text-gradient` (orange→green) |
| Scroll | `custom-scrollbar` |

### Color Palette
- **Orange** (primary): `#f97316` — buttons, CTAs, courier accent
- **Green** (secondary): `#34d399` — success, client accent

## Conventions
- **UI text**: Romanian | **Code/variables**: English | **Comments**: English
- **Path alias**: `@/*` → `./src/*`
- **Flags**: `public/img/flag/{code}.svg` (lowercase country code)
- **Firestore security**: Owner-based rules — `resource.data.uid == request.auth.uid`
- **Extended regions**: All countries have full region lists in `src/lib/constants.ts` (`judetByCountry` object)
- **Firebase init**: Singleton pattern with `getApps()` check to prevent re-initialization
- **Client components**: All dashboard pages are `'use client'` due to auth hooks and state management
- **HelpCard**: Standard help component imported into all dashboard sub-pages — provides WhatsApp/email support links with consistent styling (see `src/components/HelpCard.tsx`)
- **Navigation pattern**: Client dashboard = single page with tiles | Courier dashboard = hub page with tile grid linking to dedicated sub-pages
- **Images**: Use `next/image` with explicit width/height; flags are 24x18px typically
- **Loading states**: Centered spinner with `animate-spin` + text feedback (see protected page template)
- **Form validation**: Validate on submit, not on change; show errors below inputs with red text

## Commands
```bash
npm run dev    # localhost:3000
npm run build  # Production build
npm run lint   # ESLint
firebase deploy --only firestore  # Deploy Firestore rules & indexes
```

## Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
