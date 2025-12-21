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

Auth pages use `?role=client|curier` query param. `LayoutWrapper.tsx` hides Header/Footer on dashboards and auth pages.

## Key Files

| File | What It Does |
|------|--------------|
| `src/lib/constants.ts` | **SINGLE SOURCE**: `countries`, `judetByCountry`, `serviceTypes`, `orderStatusConfig` |
| `src/contexts/AuthContext.tsx` | `useAuth()`: `user`, `loading`, `login()`, `register()`, `logout()` |
| `src/lib/toast.ts` | `showSuccess()`, `showError()` — auto-translates Firebase errors to Romanian |
| `src/utils/orderStatusHelpers.ts` | `canEditOrder()`, `canFinalizeOrder()`, `transitionToFinalizata()` |
| `src/utils/orderHelpers.ts` | `getNextOrderNumber()` (atomic), `formatOrderNumber()` → "CP141122" |
| `src/components/icons/ServiceIcons.tsx` | `<ServiceIcon service="colete" />` — centralized, normalizes case |
| `src/types/index.ts` | `User`, `Order`, `CoverageZone`, `UserRole` interfaces |

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

## Order Status Flow
```
noua → in_lucru → livrata
  ↓        ↓
anulata  anulata
```
- `noua`: Editable, auto-transitions when courier messages
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
npm run dev                              # Dev server
npm run build                            # Type-check + build
firebase deploy --only firestore:rules   # Deploy rules
```

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
