# Curierul Perfect - AI Coding Instructions

## Project Overview
Romanian courier marketplace (Next.js 16, React 19, Firebase, Tailwind CSS 4) connecting clients with couriers for European package delivery.

## Architecture

### Role-Based Dashboard System
Three user roles with distinct UX patterns:
- `client` → `/dashboard/client` — **single-page tabs** (profil, trimite, comenzi, servicii, fidelitate, facturi, suport)
- `curier` → `/dashboard/curier` — **card grid + sub-pages** (`/zona-acoperire`, `/calendar`, `/tarife`, `/profil`, `/comenzi`, `/plati`)
- `admin` → `/dashboard/admin`

**Auth flow**: Login/register use `?role=client|curier` query param → redirect to `/dashboard/{role}` after auth.

### Data Flow
```
RootLayout (AuthProvider) → useAuth() hook → Firebase Auth
                                           ↓
                          Firestore collections:
                            • users/{uid} - User profile
                            • comenzi - Orders
                            • zona_acoperire - Courier coverage zones
```

### Key Files
| Purpose | Location |
|---------|----------|
| Auth context | `src/contexts/AuthContext.tsx` |
| Firebase singleton | `src/lib/firebase.ts` (uses `getApps()` pattern) |
| Types | `src/types/index.ts` |
| Country/region data | `src/lib/constants.ts` |
| Custom CSS classes | `src/app/globals.css` |
| Dashboard icons | `src/components/icons/DashboardIcons.tsx` |

## Code Patterns

### Protected Page Template
All dashboard pages follow this auth guard pattern:
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
  // ...
}
```

### Suspense for useSearchParams
Required for `useSearchParams()` in Next.js App Router (see `src/app/(auth)/login/page.tsx`):
```tsx
export default function Page() {
  return <Suspense fallback={<div className="spinner"></div>}><LoginForm /></Suspense>;
}
```

### Styling System
Use custom CSS classes from `globals.css`, not inline Tailwind for common elements:
- **Buttons**: `btn-primary` (orange), `btn-secondary` (green), `btn-danger`, `btn-outline-orange`, `btn-outline-green`
- **Cards**: `card` (glassmorphism)
- **Loading**: `spinner`
- **Text effects**: `text-gradient`

**Color variables**: `--orange: #f97316`, `--green: #34d399`, `--blue: #0f172a`

### Firestore Pattern
```tsx
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

await addDoc(collection(db, 'zona_acoperire'), {
  uid: user.uid,
  tara,
  judet,
  addedAt: serverTimestamp(), // Always use for dates
});
```

### Icon Components
Import from `@/components/icons/DashboardIcons` — all icons accept `className` prop with default size.

### Country/Region Data
- **Shared use**: Import from `src/lib/constants.ts` (`countries`, `countriesSimple`, `judetByCountry`)
- **Extended lists**: Define locally when page needs more regions (see `zona-acoperire/page.tsx` for full Romanian județe)

## Conventions
- **UI text**: Romanian (labels, messages, placeholders)
- **Code**: English (variables, functions, comments)
- **Path alias**: `@/*` → `./src/*`
- **Images**: Use `next/image` with explicit dimensions, assets in `public/img/`

## Commands
```bash
npm run dev    # localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```

## Environment Variables
Firebase config via `NEXT_PUBLIC_FIREBASE_*` env vars (see `src/lib/firebase.ts`).
