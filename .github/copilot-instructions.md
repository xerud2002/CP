# Curierul Perfect - AI Coding Instructions

## Project Overview
Romanian courier marketplace (Next.js 16 App Router, React 19, Firebase, Tailwind CSS 4) connecting clients with couriers for European package delivery.

## Architecture

### Role-Based Routing
Three user roles with dedicated dashboards:
- `client` → `/dashboard/client` (single-page with tabs: profil, trimite, comenzi, servicii, fidelitate, facturi, suport)
- `curier` → `/dashboard/curier` (card grid navigation to sub-pages like `/zona-acoperire`, `/calendar`, `/tarife`)
- `admin` → `/dashboard/admin`

**Auth flow**: Login/register pages receive role via `?role=client|curier` query param. After auth, redirect to `/dashboard/{role}`.

### Data Flow
```
AuthProvider (layout.tsx) → useAuth() hook → Firebase Auth
                                           ↓
                          Firestore collections:
                            • users (keyed by uid)
                            • comenzi (orders)
                            • zona_acoperire (courier coverage zones)
```

### File Structure
```
src/
├── app/(auth)/           # Route group: login, register, forgot-password
├── app/dashboard/{role}/ # Role-specific dashboards
├── contexts/AuthContext.tsx  # Global auth state
├── lib/firebase.ts       # Firebase singleton (getApps() pattern)
├── lib/constants.ts      # Shared countries, judetByCountry data
├── types/index.ts        # User, Order, CoverageZone, CourierProfile interfaces
└── components/ui/        # Reusable UI components
```

## Code Patterns

### Page Component Template
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RolePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'expectedRole')) {
      router.push('/login?role=expectedRole');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;
  if (!user) return null;

  return (/* content */);
}
```

### useSearchParams Requirement
When using `useSearchParams()`, wrap component in `Suspense`:
```tsx
// See src/app/(auth)/login/page.tsx for pattern
export default function Page() {
  return (
    <Suspense fallback={<div className="spinner"></div>}>
      <ActualComponent />
    </Suspense>
  );
}
```

### Styling Classes (globals.css)
Use these custom classes instead of inline Tailwind:
- **Buttons**: `btn-primary` (orange), `btn-secondary` (green), `btn-danger` (red), `btn-outline-orange`, `btn-outline-green`
- **Cards**: `card`, `dashboard-card`, `feature-card`, `stat-card`
- **Forms**: `form-input`, `form-select`, `form-label`, `auth-box`
- **Layout**: `dashboard-grid`, `tab-menu`, `tab-button`
- **Utils**: `spinner`, `page-transition`, `text-gradient`, `glow-green`, `glow-orange`

**Color variables**: `--orange: #f97316`, `--green: #34d399`, `--blue: #0f172a`

### Firestore Operations
```tsx
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Always use serverTimestamp() for dates
await addDoc(collection(db, 'zona_acoperire'), {
  uid: user.uid,
  tara,
  judet,
  addedAt: serverTimestamp(),
});
```

## Language Convention
- **UI text**: Romanian (maintain consistency with existing labels)
- **Code**: English (variables, comments, function names)

## Development
```bash
npm run dev    # localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```

## Key Implementation Notes
- Path alias: `@/*` → `./src/*`
- Images: Use `next/image` with explicit `width`/`height`, assets in `public/img/`
- Country/region data: Use `src/lib/constants.ts` for shared data, or define locally for page-specific extended lists (see `zona-acoperire/page.tsx`)
- TypeScript: All interfaces in `src/types/index.ts` - extend as needed
