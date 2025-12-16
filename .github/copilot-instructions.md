# Curierul Perfect - AI Coding Instructions

Romanian courier marketplace connecting clients with couriers for European package delivery.  
**Stack**: Next.js 16 (App Router), React 19, Firebase 11.1, Tailwind CSS 4, Sonner

## Architecture

**Multi-tenant SaaS** with role-based access. Owner-based security via `uid` fields enforced in Firestore rules AND client queries.

### Dashboards
- **Client** (`/dashboard/client`): Single-page with stats grid + sub-pages (`/comenzi`, `/profil`, `/recenzii`, `/fidelitate`, `/suport`)
- **Courier** (`/dashboard/curier`): Hub page with tiles linking to sub-pages (`/comenzi`, `/profil`, `/recenzii`, `/servicii`, `/verificare`)
- **Auth flow**: `?role=client|curier` on login → stored in `users/{uid}.role` → redirects to `/dashboard/{role}`

### Layout Logic (`LayoutWrapper.tsx`)
- **No Header/Footer**: `/dashboard/*`, `/comanda`, auth routes (`/login`, `/register`, `/forgot-password`)
- **With Header/Footer**: All other routes
- Auth pages using `useSearchParams()` require `<Suspense>` wrapper

### Key Files
| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | `useAuth()` hook: `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()` |
| `src/lib/constants.ts` | **SINGLE SOURCE**: `countries`, `judetByCountry`, `serviceTypes` |
| `src/lib/toast.ts` | `showSuccess()`, `showError()`, `showPromise()` — auto-translates Firebase errors to Romanian |
| `src/lib/errorMessages.ts` | `getErrorMessage()` — maps Firebase error codes to Romanian messages |
| `src/utils/orderStatusHelpers.ts` | `transitionToInLucru()`, `transitionToFinalizata()`, `canEditOrder()`, `canDeleteOrder()` |
| `src/utils/orderHelpers.ts` | `getNextOrderNumber()`, `formatOrderNumber()`, `formatClientName()` |
| `src/types/index.ts` | `User`, `UserRole`, `Order`, `CoverageZone`, `CourierProfile` |

### Firestore Collections
| Collection | Owner Field | Key Notes |
|------------|-------------|-----------|
| `users` | `uid` | Base profiles + `serviciiOferite` array for couriers |
| `comenzi` | `uid_client` | Orders with `orderNumber`, `courierId` when accepted |
| `zona_acoperire` | `uid` | Multi-record courier coverage zones |
| `profil_curier` / `profil_client` | doc ID = `uid` | Extended profiles (single doc per user) |
| `counters/orderNumber` | — | Sequential order counter (starts 141121) |

## Critical Patterns

### 1. Protected Dashboard Page (REQUIRED)
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;
  if (!user) return null;
  // Content here
}
```

### 2. Firestore Queries — ALWAYS filter by owner
```tsx
// CRITICAL: Rules don't auto-filter — queries MUST include owner filter
const q = query(collection(db, 'zona_acoperire'), where('uid', '==', user.uid));
```

### 3. Service Name Matching — ALWAYS normalize
```tsx
// Orders: lowercase ('colete') | Courier services: capitalized ('Colete')
const userServices = user.serviciiOferite?.map(s => s.toLowerCase().trim()) || [];
const matchesService = userServices.includes(order.serviciu.toLowerCase().trim());
```

### 4. Timestamps — Use serverTimestamp()
```tsx
await addDoc(collection(db, 'zona_acoperire'), { 
  uid: user.uid, tara, judet, 
  addedAt: serverTimestamp()  // NOT Date.now()
});
```

### 5. Error Handling — showError() auto-translates
```tsx
try {
  await firebaseOperation();
  showSuccess('Operațiune reușită!');
} catch (err) {
  showError(err);  // Auto-converts to Romanian via getErrorMessage()
}
```

### 6. Order Number Generation
```tsx
import { getNextOrderNumber, formatOrderNumber } from '@/utils/orderHelpers';

// Creating new order — get sequential number
const orderNumber = await getNextOrderNumber();  // Returns: 141122

// Displaying — format with prefix
formatOrderNumber(order.orderNumber);  // Returns: "CP141122"
```

## Order Status Flow
```
noua → in_lucru → livrata
  ↓         ↓
anulata   anulata
```
- **Edit/Delete**: Only `noua` status (`canEditOrder()`, `canDeleteOrder()`)
- **Finalize**: Only `in_lucru` status (`canFinalizeOrder()`)
- **Reviews**: Only `livrata` status (`canLeaveReview()`)
- **Auto-transition**: `noua` → `in_lucru` when courier sends first message/offer

## Styling

### CSS Classes (globals.css)
- **Buttons**: `btn-primary` (orange), `btn-secondary` (green), `btn-danger`, `btn-outline-*`
- **Cards**: `card` (glassmorphism), `stat-card`
- **Forms**: `form-input`, `form-select`, `form-label`
- **Loading**: `spinner`

### Colors
- Orange (primary): `#f97316` | Green (secondary): `#34d399`
- Dashboard: `bg-slate-900` base, `bg-slate-800/50` cards

### Service Types Styling
Use `serviceTypes` from constants — each has `color`, `bgColor`, `borderColor`, `gradient` properties.

## Conventions
- **UI text**: Romanian | **Code**: English
- **Path alias**: `@/*` → `./src/*`
- **All dashboard pages**: `'use client'` directive
- **Constants**: NEVER duplicate — import from `@/lib/constants.ts`
- **Flags**: `public/img/flag/{code}.svg` (lowercase country codes)
- **Firestore imports**: Always from `firebase/firestore`, db from `@/lib/firebase`

## Commands
```bash
npm run dev                              # Dev server :3000
npm run build                            # Production build
firebase deploy --only firestore:rules   # Deploy security rules
```

## Documentation
- `FIRESTORE_STRUCTURE.md`: Complete schema, security rules, query patterns
- `STATUS_TRANSITIONS.md`: Order lifecycle, transition rules
- `SECURITY_CHECKLIST.md`: Security measures, validation rules
