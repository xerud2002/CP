# Curierul Perfect - AI Coding Instructions

Romanian courier marketplace connecting clients with couriers for European package delivery.  
**Stack**: Next.js 16 (App Router), React 19, Firebase Auth/Firestore, Tailwind CSS 4

## Architecture

### Role-Based Dashboards
| Role | Path | Pattern |
|------|------|---------|
| `client` | `/dashboard/client` | Single-page with tab switching (no sub-routes) |
| `curier` | `/dashboard/curier` | Card grid → sub-pages: `/zona-acoperire`, `/calendar`, `/tarife`, `/profil`, `/comenzi`, `/plati`, `/servicii`, `/transport-aeroport`, `/transport-persoane` |
| `admin` | `/dashboard/admin` | Admin panel |

**Auth flow**: `?role=client|curier` on login/register → stores role in Firestore `users/{uid}` → redirects to `/dashboard/{role}`

### Layout Hierarchy
```
RootLayout (AuthProvider) → LayoutWrapper → /dashboard/* uses DashboardLayout (no Header/Footer)
                                          → other routes get Header + Footer
```
- `LayoutWrapper` (client component) checks `pathname.startsWith('/dashboard')` to conditionally exclude global Header/Footer
- Dashboard pages render their own headers with back navigation
- `(auth)` route group for login/register/forgot-password pages (no auth required)
- `DashboardLayout` provides dark theme background with decorative gradients (orange/green)

### Key Files
| Purpose | File |
|---------|------|
| Auth hook | `src/contexts/AuthContext.tsx` — `useAuth()` with `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()`, `resetPassword()` |
| Types | `src/types/index.ts` — `User`, `UserRole`, `Order`, `CoverageZone`, `CourierProfile` |
| Firebase | `src/lib/firebase.ts` — singleton with `getApps()` pattern |
| Styling | `src/app/globals.css` — custom component classes |
| Icons | `src/components/icons/DashboardIcons.tsx` — all SVG icons |
| Data | `src/lib/constants.ts` — `countries`, `judetByCountry` (extend locally for full regions) |

### Firestore Collections
| Collection | Document ID | Owner Field | Purpose |
|------------|-------------|-------------|---------|
| `users` | `{uid}` | `uid` | User profiles & roles (created on register) |
| `zona_acoperire` | auto | `uid` | Courier coverage zones (multi-record) |
| `tarife_curier` | auto | `uid` | Courier pricing (multi-record) |
| `calendar_colectii` | auto | `courierId` | Courier availability dates |
| `profil_curier` | `{uid}` | — | Extended courier profile (single doc per courier) |
| `comenzi` | auto | `uid_client` | Orders from clients |
| `transport_aeroport` | auto | `uid` | Airport transfer routes (courier-specific) |
| `transport_persoane` | auto | `uid` | Person transport routes (courier-specific) |

**Data Fetching Pattern**: Use `where()` filters + owner field for multi-tenant security:
```tsx
const q = query(collection(db, 'zona_acoperire'), where('uid', '==', user.uid));
const snapshot = await getDocs(q);
```

**Firestore Rules**: All collections enforce owner-based access (`resource.data.uid == request.auth.uid`) — see [firestore.rules](firestore.rules). Queries MUST filter by owner field client-side; Firestore rules only verify ownership on write operations.

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
- **Blue** (background): `#0f172a` → `slate-950` — dark theme base
- Gradients: `bg-linear-to-br from-{color}-500/20 to-{color}-500/20`

## Conventions
- **UI text**: Romanian | **Code/variables**: English
- **Path alias**: `@/*` → `./src/*`
- **Flags**: `public/img/flag/{code}.svg` (lowercase country code)
- **Firestore security**: Owner-based rules — `resource.data.uid == request.auth.uid`
- **Extended regions**: Pages needing full region lists define local `judetByCountry` (see [zona-acoperire/page.tsx](src/app/dashboard/curier/zona-acoperire/page.tsx))
- **Firebase init**: Use singleton pattern with `getApps()` check to prevent re-initialization
- **Client components**: All dashboard pages are `'use client'` due to auth hooks and state management
- **HelpCard**: Standard help component imported into all dashboard sub-pages — provides WhatsApp/email support links with consistent styling

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
