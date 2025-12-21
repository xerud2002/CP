# Curierul Perfect - AI Agent Instructions

Romanian courier marketplace: clients post delivery requests, couriers bid/chat, then fulfill.  
**Stack**: Next.js 16 (App Router), React 19, Firebase 11.1 (Auth/Firestore/Storage), Tailwind CSS 4, Sonner toasts

## Architecture

**Multi-tenant SaaS** with roles: `client` | `curier` | `admin`. Owner-based Firestore security via `uid` fields.

**Critical**: Firestore rules check ownership but **don't filter results**—client queries MUST include `where('uid', '==', user.uid)`.

### Route Structure
```
/dashboard/client  → /comenzi, /profil, /recenzii, /fidelitate, /suport
/dashboard/curier  → /comenzi, /profil, /recenzii, /servicii, /verificare
/comanda           → Order creation wizard (no header/footer)
```

Auth pages use `?role=client|curier` query param. [LayoutWrapper.tsx](src/components/LayoutWrapper.tsx) hides Header/Footer on dashboards and auth pages.

### Component Organization
```
src/components/orders/
  client/        → Client-specific order views (filters, list, cards)
  courier/       → Courier-specific views (details, filters, list)
  shared/        → Reusable across both roles (modals, sections)
```
Custom hooks in `src/hooks/{client|courier}/` handle data loading, real-time subscriptions, and business logic.

## Key Files

| File | What It Does |
|------|--------------|
| [constants.ts](src/lib/constants.ts) | **SINGLE SOURCE**: `countries`, `judetByCountry`, `serviceTypes`, `orderStatusConfig` |
| [AuthContext.tsx](src/contexts/AuthContext.tsx) | `useAuth()`: `user`, `loading`, `login()`, `register()`, `logout()` |
| [toast.ts](src/lib/toast.ts) | `showSuccess()`, `showError()` — auto-translates Firebase errors to Romanian |
| [orderStatusHelpers.ts](src/utils/orderStatusHelpers.ts) | `canEditOrder()`, `canFinalizeOrder()`, `transitionToFinalizata()` |
| [orderHelpers.ts](src/utils/orderHelpers.ts) | `getNextOrderNumber()` (atomic), `formatOrderNumber()` → "CP141122" |
| [ServiceIcons.tsx](src/components/icons/ServiceIcons.tsx) | `<ServiceIcon service="colete" />` — centralized, normalizes case |
| [types/index.ts](src/types/index.ts) | `User`, `Order`, `CoverageZone`, `UserRole` interfaces |
| [useClientOrdersLoader.ts](src/hooks/client/useClientOrdersLoader.ts) | Real-time orders + unread counts for clients |
| [useOrdersLoader.ts](src/hooks/courier/useOrdersLoader.ts) | Real-time order filtering for couriers |

**Architecture Docs** (root): `FIRESTORE_STRUCTURE.md`, `STATUS_TRANSITIONS.md`, `CHAT_SYSTEM.md`, `SERVICE_FLOW_ARCHITECTURE.md`

## Critical Patterns

### 1. Dashboard Page Template
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
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>;
  if (!user) return null;
  // ... content
}
```

### 2. Firestore Queries — Owner Filter Required
```tsx
// ✅ CORRECT
const q = query(collection(db, 'zona_acoperire'), where('uid', '==', user.uid), orderBy('addedAt', 'desc'));
```

### 3. Service Name Normalization
Orders store lowercase (`'colete'`), profiles may use capitalized (`'Colete'`):
```tsx
const match = order.serviciu.toLowerCase().trim() === courier.serviciiOferite[0].toLowerCase().trim();
```

### 4. Error Handling
```tsx
import { showSuccess, showError } from '@/lib/toast';
try {
  await updateDoc(docRef, data);
  showSuccess('Salvat!');
} catch (err) {
  showError(err);  // Auto-translates to Romanian
}
```

### 5. Timestamps
Always use `serverTimestamp()`, never `Date.now()` or `new Date()`.

### 6. Order Status — Use Helpers
```tsx
import { canEditOrder, transitionToFinalizata } from '@/utils/orderStatusHelpers';
if (canEditOrder(order.status)) { /* show edit */ }
await transitionToFinalizata(orderId, currentStatus);
```

### 7. Real-time Data — onSnapshot
```tsx
useEffect(() => {
  const q = query(collection(db, 'mesaje'), where('orderId', '==', id), orderBy('createdAt', 'asc'));
  const unsubscribe = onSnapshot(q, snap => setMessages(snap.docs.map(d => ({id: d.id, ...d.data()}))));
  return () => unsubscribe();  // MUST cleanup
}, [id]);
```

**Multiple subscriptions**: Track in array, cleanup all:
```tsx
useEffect(() => {
  const unsubscribes: Array<() => void> = [];
  orders.forEach(order => {
    const unsub = onSnapshot(query(...), snap => { /* ... */ });
    unsubscribes.push(unsub);
  });
  return () => unsubscribes.forEach(fn => fn());
}, [orders]);
```

## Order Status Flow
```
noua → in_lucru → livrata
  ↓        ↓**1-to-1 chat per order** (filter by BOTH) — see [CHAT_SYSTEM.md](CHAT_SYSTEM.md) |
| `zona_acoperire` | `uid` | Courier coverage zones (multi-record) |
| `profil_curier` | doc ID = `uid` | Extended courier profile |
| `profil_client` | doc ID = `uid` | Extended client profile |
| `recenzii` | `clientId` | Reviews (client reviews courier) |
| `counters/orderNumber` | — | Atomic sequential counter |

**Chat System**: Each client-courier pair has a separate conversation per order. Query MUST filter by `orderId`, `clientId`, AND `courierId` to ensure privacy. Unread badges use `where('read', '==', false)` + client-side filtering.
- `in_lucru`: Locked, can finalize
- `livrata`: Complete, enables reviews

## Firestore Collections

| Collection | Owner | Notes |
|------------|-------|-------|
| `comenzi` | `uid_client` | Orders with `orderNumber`, `status`, `courierId` |
| `mesaje` | `clientId` + `courierId` | 1-to-1 chat per order (filter by both) |
| `zona_acoperire` | `uid` | Courier coverage zones (multi-record) |
| `profil_curier` | doc ID = `uid` | Extended courier profile |
| `counters/orderNumber` | — | Atomic sequential counter |

## Styling
- Pre-built: `.btn-primary`, `.btn-secondary`, `.card`, `.form-input`, `.spinner`
- Colors: `text-orange-500` (primary), `text-emerald-400` (secondary), `bg-slate-900` (dashboard)
- Status styling: `orderStatusConfig[status].bg`, `.color`, `.label`
- Service styling: `serviceTypes.find(s => s.id === 'colete').bgColor`

## Commands
```bash
np**Language**: UI text in Romanian | Code/comments/commits in English
- **Client components**: All dashboard pages MUST have `'use client'` directive at top
- **Path alias**: `@/*` → `./src/*` (configured in `tsconfig.json`)
- **Imports**: Use path alias, never relative paths from deep nesting (e.g., `@/lib/constants` not `../../../lib/constants`)
- **Constants**: Never duplicate — always import from [constants.ts](src/lib/constants.ts)
- **Types**: Import from [types/index.ts](src/types/index.ts), never inline `interface` in components
- **Firebase 11.1**: Uses modular SDK (`import { collection } from 'firebase/firestore'`), not legacy `firebase.firestore()`
- **Docs**: Read root `.md` files for architecture context before major changes
## Common Mistakes

| ❌ Wrong | ✅ Right |
|----------|----------|
| Query without owner filter | `where('uid', '==', user.uid)` |
| `status === 'in_lucru'` | `canEditOrder(status)` |
| Inline service icons | Import `ServiceIcon` from centralized file |
| `alert(error.message)` | `showError(error)` |
| `Date.now()` timestamps | `serverTimestamp()` |

## Conventions
- UI text: Romanian | Code/commits: English
- All dashboard pages: `'use client'` directive
- Path alias: `@/*` → `./src/*`
- Never duplicate constants — always import from `@/lib/constants.ts`
- Docs: `FIRESTORE_STRUCTURE.md`, `STATUS_TRANSITIONS.md`, `CHAT_SYSTEM.md`
