# Curierul Perfect - AI Coding Instructions

Romanian courier marketplace connecting clients with couriers for European package delivery.  
**Stack**: Next.js 16.0 (App Router), React 19, Firebase 11.1, Tailwind CSS 4, Sonner

## Architecture Overview

**Multi-tenant SaaS** with role-based access (`client` | `curier` | `admin`). Security model enforces **owner-based isolation** through `uid` fields in Firestore—rules check ownership, but **client queries MUST also filter by owner** (rules don't auto-filter results).

### Auth Flow
1. User logs in with `?role=client|curier` query param
2. Role stored in `users/{uid}.role` during registration
3. Redirect to `/dashboard/{role}` after auth
4. Protected pages check `user.role` in `useEffect` hook

### Dashboard Structure
```
/dashboard/client  → Hub + /comenzi, /profil, /recenzii, /fidelitate, /suport
/dashboard/curier  → Hub + /comenzi, /profil, /recenzii, /servicii, /verificare
/dashboard/admin   → Admin panel (future)
```

### Layout Logic ([LayoutWrapper.tsx](../src/components/LayoutWrapper.tsx))
- **No Header/Footer**: `/dashboard/*`, `/comanda`, auth pages (`/login`, `/register`, `/forgot-password`)
- **With Header/Footer**: All other public routes
- ⚠️ Auth pages using `useSearchParams()` require `<Suspense>` wrapper to avoid hydration errors

### Key Files Reference
| File | Purpose |
|------|---------|
| [AuthContext.tsx](../src/contexts/AuthContext.tsx) | `useAuth()` hook with `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()`, `resetPassword()` |
| [constants.ts](../src/lib/constants.ts) | **SINGLE SOURCE OF TRUTH**: `countries`, `judetByCountry`, `serviceTypes`, `orderStatusConfig` — NEVER duplicate these |
| [toast.ts](../src/lib/toast.ts) | `showSuccess()`, `showError()`, `showWarning()`, `showInfo()` — auto-translates Firebase errors via `errorMessages.ts` |
| [orderStatusHelpers.ts](../src/utils/orderStatusHelpers.ts) | Status transition logic: `transitionToInLucru()`, `transitionToFinalizata()`, `canEditOrder()`, `canFinalizeOrder()` |
| [orderHelpers.ts](../src/utils/orderHelpers.ts) | Order utilities: `getNextOrderNumber()` (sequential counter), `formatOrderNumber()` (adds "CP" prefix) |
| [types/index.ts](../src/types/index.ts) | TypeScript interfaces: `User`, `Order`, `CoverageZone`, `CourierProfile` |

### Firestore Collections
| Collection | Owner Field | Key Patterns |
|------------|-------------|--------------|
| `users` | `uid` (doc ID) | Base profile + `serviciiOferite: string[]` array for couriers |
| `comenzi` | `uid_client` | Orders with sequential `orderNumber`, `courierId` when accepted, status workflow |
| `profil_curier` / `profil_client` | Doc ID = `uid` | Extended single-doc profiles (one per user) |
| `zona_acoperire` | `uid` | Multi-record coverage zones (courier can have multiple regions) |
| `recenzii` | `clientId` | Reviews left by clients for couriers after `livrata` status |
| `counters/orderNumber` | N/A | Sequential counter (starts at 141121, increments via `runTransaction`) |

## Critical Patterns (READ FIRST)

### 1. Protected Dashboard Page Template
**COPY THIS PATTERN** for all dashboard pages:
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
  
  // Page content here
}
```

### 2. Firestore Queries — Owner Filtering is MANDATORY
```tsx
// ❌ WRONG - Security rules will block this, but it's conceptually incorrect
const q = query(collection(db, 'zona_acoperire'));

// ✅ CORRECT - Always filter by owner in client queries
const q = query(
  collection(db, 'zona_acoperire'), 
  where('uid', '==', user.uid),
  orderBy('addedAt', 'desc')
);
```

### 3. Service Name Normalization
Orders store lowercase service names (`'colete'`), but courier profiles use capitalized (`'Colete'`). **Always normalize when comparing**:
```tsx
const userServices = user.serviciiOferite?.map(s => s.toLowerCase().trim()) || [];
const matchesService = userServices.includes(order.serviciu.toLowerCase().trim());
```

### 4. Timestamps — Use serverTimestamp()
```tsx
// ❌ WRONG
addDoc(collection(db, 'zona_acoperire'), { uid: user.uid, timestamp: Date.now() });

// ✅ CORRECT
addDoc(collection(db, 'zona_acoperire'), { 
  uid: user.uid, 
  addedAt: serverTimestamp()  // Server-side timestamp, avoids clock skew
});
```

### 5. Error Handling — Auto-Translation to Romanian
```tsx
import { showSuccess, showError } from '@/lib/toast';

try {
  await updateDoc(docRef, data);
  showSuccess('Datele au fost salvate!');
} catch (err) {
  showError(err);  // Automatically converts Firebase error codes to Romanian messages
}
```

### 6. Order Numbers — Sequential Generation
```tsx
import { getNextOrderNumber, formatOrderNumber } from '@/utils/orderHelpers';

// Creating order - get next number using Firestore transaction
const orderNumber = await getNextOrderNumber();  // e.g., 141122

// Displaying order - format with "CP" prefix
formatOrderNumber(order.orderNumber);  // Returns: "CP141122"
```

### 7. Service Icons — Inline SVG Components
Dashboard pages use a local `ServiceIcon` component with inline SVG icon mappings. **Pattern** (see [comenzi/page.tsx](../src/app/dashboard/curier/comenzi/page.tsx)):
```tsx
const ServiceIcon = ({ service }: { service: string }) => {
  const iconMap: Record<string, JSX.Element> = {
    'Colete': <svg>...</svg>,
    'Persoane': <svg>...</svg>,
  };
  return iconMap[service.charAt(0).toUpperCase() + service.slice(1).toLowerCase()] || iconMap['Colete'];
};
```

### 8. Order Status — Use Helper Functions
**NEVER hardcode status checks**. Use helpers from [orderStatusHelpers.ts](../src/utils/orderStatusHelpers.ts):
```tsx
import { canEditOrder, canFinalizeOrder, transitionToFinalizata } from '@/utils/orderStatusHelpers';

// Check permissions
if (canEditOrder(order.status)) { /* show edit button */ }
if (canFinalizeOrder(order.status)) { /* show finalize button */ }

// Transition status (validates automatically)
await transitionToFinalizata(order.id, order.status);  // Only works if status === 'in_lucru'
```

## Order Status Lifecycle
```
noua (new) → in_lucru (in progress) → livrata (delivered)
  ↓              ↓
anulata        anulata
```
- **`noua`**: Editable/deletable by client, auto-transitions to `in_lucru` when courier messages/offers
- **`in_lucru`**: No edits allowed, can be finalized by client OR courier
- **`livrata`**: Final status, triggers review eligibility (`canLeaveReview()`)
- **`anulata`**: Terminal status, no further actions

**See [STATUS_TRANSITIONS.md](../STATUS_TRANSITIONS.md) for full state machine**.

## Styling System

### Pre-built CSS Classes ([globals.css](../src/app/globals.css))
```css
/* Buttons */
.btn-primary        /* Orange primary action */
.btn-secondary      /* Green secondary action */
.btn-danger         /* Red destructive action */
.btn-outline-*      /* Outlined variants */

/* Cards */
.card               /* Glassmorphism card with backdrop-blur */
.stat-card          /* Dashboard stat card with hover effect */

/* Forms */
.form-input         /* Input field with focus ring */
.form-select        /* Select dropdown */
.form-label         /* Form label */

/* Utilities */
.spinner            /* Loading spinner animation */
.custom-scrollbar   /* Styled scrollbar for modals/containers */
```

### Color Palette
- **Primary (Orange)**: `#f97316` / `text-orange-500` / `var(--orange)`
- **Secondary (Green)**: `#34d399` / `text-emerald-400` / `var(--green)`
- **Dashboard BG**: `bg-slate-900` (base) / `bg-slate-800/50` (cards)

### Service Type Styling
Import `serviceTypes` from [constants.ts](../src/lib/constants.ts) — each object contains `color`, `bgColor`, `borderColor`, `gradient` for consistent theming:
```tsx
import { serviceTypes } from '@/lib/constants';
const service = serviceTypes.find(s => s.id === 'colete');
<div className={service.bgColor}>{service.label}</div>
```

## Development Conventions

### Language
- **User-facing text**: Romanian (`Comandă nouă`, `Finalizează`)
- **Code**: English (variables, functions, comments)
- **Commit messages**: English

### Code Style
- All dashboard pages: `'use client'` directive (uses hooks)
- Path alias: `@/*` maps to `./src/*`
- Type imports: `import type { Order } from '@/types'` (type-only)
- Constants: **NEVER duplicate** — always import from `@/lib/constants.ts`
- Country flags: `public/img/flag/{code}.svg` (lowercase: `ro.svg`, `gb.svg`)

### Firestore Imports
```tsx
// ✅ Correct pattern
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ❌ Wrong - Don't import db from different path
import { db } from '../firebase';
```

## Commands & Workflows

### Development
```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build (checks types & lints)
npm run lint      # Run ESLint
npm start         # Run production build locally
```

### Firebase
```bash
firebase deploy --only firestore:rules   # Deploy security rules only
firebase deploy --only hosting           # Deploy hosting only
firebase deploy                          # Full deployment
```

### Debugging
- **Firestore rules**: Test in Firebase Console → Firestore → Rules → Simulator
- **Auth issues**: Check `user` and `loading` state in `useAuth()` hook
- **Query errors**: Common cause is missing owner filter (`where('uid', '==', user.uid)`)

## Documentation Reference

- **[FIRESTORE_STRUCTURE.md](../FIRESTORE_STRUCTURE.md)**: Complete schema, security rules, indexes, query patterns
- **[STATUS_TRANSITIONS.md](../STATUS_TRANSITIONS.md)**: Order status lifecycle, transition rules, validation logic
- **[SERVICE_FLOW_ARCHITECTURE.md](../SERVICE_FLOW_ARCHITECTURE.md)**: Order flow from client creation to courier fulfillment
- **[SECURITY_CHECKLIST.md](../SECURITY_CHECKLIST.md)**: Security measures, validation rules, data protection

## Common Pitfalls & Solutions

### ❌ Forgot owner filter in query
```tsx
// Missing where('uid', '==', user.uid) - will throw permission error or return wrong data
```
**Solution**: Always filter by owner field in client-side queries.

### ❌ Hardcoded status strings
```tsx
if (order.status === 'in_lucru') { /* ... */ }  // Brittle
```
**Solution**: Use `canEditOrder()`, `canFinalizeOrder()` helpers.

### ❌ Service name case mismatch
```tsx
user.serviciiOferite.includes(order.serviciu)  // Fails if case differs
```
**Solution**: Normalize both sides: `.toLowerCase().trim()` before comparison.

### ❌ Direct error display
```tsx
alert(error.message);  // Shows Firebase error codes in English
```
**Solution**: Use `showError(error)` for auto-translated Romanian messages.

### ❌ Manual order number assignment
```tsx
orderNumber: Math.random()  // Not sequential, conflicts possible
```
**Solution**: Use `getNextOrderNumber()` which uses Firestore transaction for atomic increment.
