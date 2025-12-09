# Curierul Perfect - AI Coding Instructions

Romanian courier marketplace connecting clients with couriers for European package delivery.  
**Stack**: Next.js 16 (App Router), React 19, Firebase Auth/Firestore, Tailwind CSS 4

## Architecture

### Role-Based Dashboards
| Role | Path | Pattern |
|------|------|---------|
| `client` | `/dashboard/client` | Single-page with tab switching (`id` prop) |
| `curier` | `/dashboard/curier` | Card grid → sub-pages (`href` prop): `/zona-acoperire`, `/calendar`, `/tarife`, `/profil`, `/comenzi`, `/plati` |

**Auth flow**: `?role=client|curier` on login/register → stores role in Firestore `users/{uid}` → redirects to `/dashboard/{role}`

### Layout Hierarchy
```
RootLayout (AuthProvider) → LayoutWrapper → /dashboard/* uses DashboardLayout (no Header/Footer)
                                          → other routes get Header + Footer
```

### Key Files
- **Auth**: `src/contexts/AuthContext.tsx` — `useAuth()` hook with `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`
- **Types**: `src/types/index.ts` — `User`, `UserRole`, `Order`, `CoverageZone`, `CourierProfile`
- **Firebase**: `src/lib/firebase.ts` — singleton with `getApps()` pattern
- **Styling**: `src/app/globals.css` — custom classes (see below)
- **Icons**: `src/components/icons/DashboardIcons.tsx` — all dashboard icons
- **Data**: `src/lib/constants.ts` — `countries`, `judetByCountry` (extend locally for full regions)

## Critical Patterns

### Protected Page Template (REQUIRED)
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

### Suspense for useSearchParams
```tsx
export default function Page() {
  return <Suspense fallback={<div className="spinner"></div>}><LoginForm /></Suspense>;
}
```

### Firestore Writes — Always use serverTimestamp()
```tsx
await addDoc(collection(db, 'zona_acoperire'), { uid: user.uid, tara, judet, addedAt: serverTimestamp() });
```

## Styling (globals.css classes)
| Use | Classes |
|-----|---------|
| Buttons | `btn-primary` (orange), `btn-secondary` (green), `btn-danger`, `btn-outline-orange`, `btn-outline-green` |
| Cards | `card` (glassmorphism), `stat-card` |
| Forms | `form-input`, `form-select`, `form-label` |
| Tabs | `tab-menu`, `tab-button`, `tab-button.active` |
| Loading | `spinner` |
| Text | `text-gradient` (orange→green) |

**CSS vars**: `--orange: #f97316`, `--green: #34d399`, `--blue: #0f172a`

## Conventions
- **UI text**: Romanian | **Code**: English
- **Path alias**: `@/*` → `./src/*`
- **Flags**: `public/img/flag/{code}.svg` (lowercase)
- **Firestore security**: Owner-based rules in `firestore.rules` — check `uid` matches `request.auth.uid`

## Commands
```bash
npm run dev    # localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```

## Environment Variables
`NEXT_PUBLIC_FIREBASE_*`: `API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`
