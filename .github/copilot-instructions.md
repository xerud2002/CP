# Curierul Perfect - AI Coding Instructions

Romanian courier marketplace connecting clients with couriers for European package delivery.  
**Stack**: Next.js 16 (App Router), React 19, Firebase Auth/Firestore, Tailwind CSS 4

## Architecture

### Role-Based Dashboards
| Role | Path | Pattern |
|------|------|---------|
| `client` | `/dashboard/client` | Single-page dashboard with stats + navigation grid |
| `curier` | `/dashboard/curier` | Card grid dashboard → sub-pages: `/zona-acoperire`, `/calendar`, `/tarife`, `/profil`, `/comenzi`, `/plati`, `/servicii`, `/transport-aeroport`, `/transport-persoane` |
| `admin` | `/dashboard/admin` | Admin panel |

**Auth flow**: `?role=client|curier` on login/register → stores role in Firestore `users/{uid}` → redirects to `/dashboard/{role}`

### Layout Hierarchy
```
RootLayout (AuthProvider) → LayoutWrapper → /dashboard/* uses DashboardLayout (no Header/Footer)
                                          → /comanda uses no Header/Footer
                                          → /(auth)/* uses no Header/Footer
                                          → other routes get Header + Footer
```
- `LayoutWrapper` excludes global Header/Footer when `pathname.startsWith('/dashboard')` OR `/comanda` OR auth routes
- Dashboard pages render their own page-specific headers with back navigation
- `(auth)` route group for login/register/forgot-password pages (Suspense required for `useSearchParams`)
- `DashboardLayout` provides dark theme (`bg-slate-900`) with decorative gradients (orange/green circles)

### Key Files
| Purpose | File |
|---------|------|
| Auth hook | `src/contexts/AuthContext.tsx` — `useAuth()` with `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()`, `resetPassword()` |
| Types | `src/types/index.ts` — `User`, `UserRole`, `Order`, `CoverageZone`, `CourierProfile` |
| Firebase | `src/lib/firebase.ts` — singleton with `getApps()` pattern |
| Styling | `src/app/globals.css` — custom component classes (`btn-primary`, `card`, `form-input`, `tab-menu`, `spinner`) |
| Icons | `src/components/icons/DashboardIcons.tsx` — all SVG dashboard icons |
| Data | `src/lib/constants.ts` — `countries`, `judetByCountry` (extend locally if full regions needed) |
| Helpers | `src/utils/orderHelpers.ts` — `getNextOrderNumber()`, `formatOrderNumber()`, `formatClientName()` |
| Help | `src/components/HelpCard.tsx` — reusable support card (email + WhatsApp) for all sub-pages |

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

**Firestore Rules**: All collections enforce owner-based access. Couriers can read pending orders + their assigned orders. See FIRESTORE_STRUCTURE.md for complete security documentation. Queries MUST filter by owner field client-side.

**Order Numbering**: Orders use sequential numbers starting at `141121` via `getNextOrderNumber()` (stored in `counters/orderNumber`). Display with `formatOrderNumber()` → `"CP141121"`. Fallback handles old orders without `orderNumber` field.

**Service Name Normalization**: CRITICAL - Always compare service names case-insensitive (`.toLowerCase().trim()`):
- Orders save as lowercase: `'colete'`, `'plicuri'`, `'persoane'`
- Courier services save as capitalized: `'Colete'`, `'Plicuri'`, `'Persoane'`
- All service matching MUST normalize both sides to lowercase

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

### Error Handling Pattern
```tsx
try {
  await someFirebaseOperation();
} catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : 'Generic error message';
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
- **Extended regions**: Pages needing full region lists define local `judetByCountry` (see src/app/dashboard/curier/zona-acoperire/page.tsx line 39)
- **Firebase init**: Singleton pattern with `getApps()` check to prevent re-initialization
- **Client components**: All dashboard pages are `'use client'` due to auth hooks and state management
- **HelpCard**: Standard help component imported into all dashboard sub-pages — provides WhatsApp/email support links with consistent styling (see `src/components/HelpCard.tsx`)
- **Navigation pattern**: Client dashboard = single page with tiles | Courier dashboard = hub page with tile grid linking to dedicated sub-pages
- **Images**: Use `next/image` with explicit width/height; flags are 24x18px typically
- **Loading states**: Centered spinner with `animate-spin` + text feedback (see protected page template)

## Commands
```bash
npm run dev    # localhost:3000
npm run build  # Production build
npm run lint   # ESLint
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
