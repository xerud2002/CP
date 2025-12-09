# Curierul Perfect - AI Coding Instructions

## Project Overview
Romanian courier marketplace (Next.js 16, React 19, Firebase, Tailwind CSS 4) connecting clients with couriers for European package delivery.

## Architecture

### Role-Based Dashboard System
| Role | Path | UX Pattern |
|------|------|------------|
| `client` | `/dashboard/client` | Single-page with tab switching (profil, trimite, comenzi, servicii, fidelitate, facturi, suport) |
| `curier` | `/dashboard/curier` | Card grid → sub-pages (`/zona-acoperire`, `/calendar`, `/tarife`, `/profil`, `/comenzi`, `/plati`) |
| `admin` | `/dashboard/admin` | Admin panel |

**Auth flow**: `?role=client|curier` query param on login/register → redirect to `/dashboard/{role}`.

### Layout Architecture
```
RootLayout (AuthProvider)
  └── LayoutWrapper (conditionally renders Header/Footer)
       └── /dashboard/* routes → DashboardLayout (no Header/Footer, slate-950 bg)
       └── other routes → Header + content + Footer
```

### Firestore Collections
- `users/{uid}` — User profile with `role: 'client' | 'curier' | 'admin'`
- `comenzi` — Orders with status workflow
- `zona_acoperire` — Courier coverage zones by country/region

### Key Files
| Purpose | Location |
|---------|----------|
| Auth context + hooks | `src/contexts/AuthContext.tsx` |
| Firebase singleton | `src/lib/firebase.ts` (`getApps()` pattern) |
| TypeScript types | `src/types/index.ts` (`User`, `Order`, `CoverageZone`, `CourierProfile`) |
| Country/region data | `src/lib/constants.ts` |
| Custom CSS classes | `src/app/globals.css` |
| Dashboard icons | `src/components/icons/DashboardIcons.tsx` |
| Reusable UI | `src/components/ui/` (`SearchableSelect`, `CountUp`, `SocialProof`, `WhatsAppButton`) |

## Code Patterns

### Protected Page Template
All dashboard pages MUST use this auth guard pattern:
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

### Suspense Boundary for useSearchParams
Required for any component using `useSearchParams()`:
```tsx
export default function Page() {
  return <Suspense fallback={<div className="spinner"></div>}><LoginForm /></Suspense>;
}
```

### Styling System
**Use custom CSS classes from `globals.css`** — avoid inline Tailwind for these elements:

| Element | Classes | Notes |
|---------|---------|-------|
| Buttons | `btn-primary` (orange), `btn-secondary` (green), `btn-danger`, `btn-outline-orange`, `btn-outline-green` | Include hover effects |
| Cards | `card` (glassmorphism), `stat-card` | Glass effect with blur |
| Forms | `form-input`, `form-select`, `form-label` | Dark theme inputs |
| Tabs | `tab-menu`, `tab-button`, `tab-button.active` | For client dashboard |
| Loading | `spinner` | Animated green spinner |
| Text | `text-gradient` | Orange→green gradient |

**CSS Variables**: `--orange: #f97316`, `--green: #34d399`, `--blue: #0f172a`, `--glass-bg`, `--glass-border`

### Firestore Operations
Always use `serverTimestamp()` for date fields:
```tsx
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

await addDoc(collection(db, 'zona_acoperire'), {
  uid: user.uid,
  tara,
  judet,
  addedAt: serverTimestamp(),
});
```

### Icon Components
Import from `@/components/icons/DashboardIcons` — all accept `className` prop (default: `w-7 h-7` or `w-6 h-6`):
```tsx
import { MapIcon, CalendarIcon, UserIcon, BoxIcon } from '@/components/icons/DashboardIcons';
```

### Country/Region Data
- **Basic use**: Import from `src/lib/constants.ts` (`countries`, `countriesSimple`, `judetByCountry`)
- **Extended lists**: Define locally when page needs full regions (see `zona-acoperire/page.tsx` for complete Romanian județe list)

### Dashboard Card Pattern
Both dashboards use typed configuration arrays for cards:
```tsx
interface DashboardCard {
  href?: string;  // curier uses href (sub-pages)
  id?: string;    // client uses id (tabs)
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;       // e.g., 'from-emerald-500/10 to-teal-500/10'
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeColor?: string;
}
```

## Conventions
- **UI text**: Romanian (toate labels, mesaje, placeholder-uri)
- **Code**: English (variabile, funcții, comentarii)
- **Path alias**: `@/*` → `./src/*`
- **Images**: `next/image` with explicit dimensions, assets in `public/img/`
- **Flags**: SVG files in `public/img/flag/{code}.svg` (lowercase country code)

## Commands
```bash
npm run dev    # localhost:3000
npm run build  # Production build
npm run lint   # ESLint check
```

## Environment Variables
Firebase config via `NEXT_PUBLIC_FIREBASE_*` (see `src/lib/firebase.ts`):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
