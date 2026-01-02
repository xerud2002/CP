# Curierul Perfect - AI Agent Instructions

Romanian courier marketplace: clients post delivery requests, couriers bid/chat, then fulfill.  
**Stack**: Next.js 16 (App Router), React 19, Firebase 11.1 (Auth/Firestore/Storage), Tailwind CSS 4, Sonner toasts

## Architecture

**Multi-tenant SaaS** with roles: `client` | `curier` | `admin`. Owner-based Firestore security via `uid` fields.

**⚠️ CRITICAL SECURITY**: Firestore rules check ownership but **don't filter results**—client queries MUST include `where('uid', '==', user.uid)`.

### Route Structure
- `/dashboard/client` → `/comenzi`, `/profil`, `/suport`
- `/dashboard/curier` → `/comenzi`, `/profil`, `/servicii`, `/verificare`
- `/dashboard/admin` → `/utilizatori`, `/curieri`, `/comenzi`, `/verificare-documente`, `/setari`, `/mesaje`
- `/comanda` → Order creation wizard (no header/footer)

### Code Organization
- `src/components/orders/{client|courier|shared}/` → Role-specific + reusable components
- `src/components/admin/` → Admin panel components
- `src/hooks/{client|courier}/` → Role-specific data hooks
- `src/hooks/useChatMessages.ts` → Shared real-time messaging

## Key Files (Single Source of Truth)

| File | Purpose |
|------|---------|
| `lib/constants.ts` | `countries`, `judetByCountry`, `serviceTypes`, `orderStatusConfig` |
| `lib/cities.ts` | `oraseByCountryAndRegion`, `getOraseForRegion()`, `getAllOraseForCountry()` |
| `lib/toast.ts` | `showSuccess()`, `showError()` — auto-translates Firebase errors to Romanian |
| `lib/contact.ts` | `CONTACT_INFO`, `SOCIAL_LINKS`, `COMPANY_INFO` |
| `contexts/AuthContext.tsx` | `useAuth()`: `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()` |
| `utils/orderStatusHelpers.ts` | `canEditOrder()`, `canDeleteOrder()`, `transitionToInLucru()`, `transitionToFinalizata()` |
| `types/index.ts` | TypeScript interfaces: `User`, `Order`, `UserRole`, `CourierProfile` |

## Critical Patterns

### 1. Dashboard Auth Guard (REQUIRED for all /dashboard/* pages)
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) router.push('/login?role=client');
  }, [user, loading, router]);
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>;
  if (!user) return null;
  // ... protected content
}
```

### 2. Firestore Owner Filter (SECURITY-CRITICAL)
```tsx
// ✅ CORRECT — always filter by owner
const q = query(collection(db, 'comenzi'), where('uid_client', '==', user.uid), orderBy('createdAt', 'desc'));
// ❌ WRONG — exposes other users' data
const q = query(collection(db, 'comenzi'), orderBy('createdAt', 'desc'));
```

### 3. Message Threading (Order-Scoped)
```tsx
// ✅ Filter by ALL THREE fields — each order has isolated chats per courier
const q = query(collection(db, 'mesaje'), where('orderId', '==', orderId), where('clientId', '==', clientId), where('courierId', '==', courierId), orderBy('timestamp', 'asc'));
```

### 4. Timestamps & Error Handling
```tsx
import { serverTimestamp } from 'firebase/firestore';
import { showSuccess, showError } from '@/lib/toast';
try {
  await addDoc(collection(db, 'comenzi'), { ...data, createdAt: serverTimestamp() }); // ✅ NEVER use new Date()
  showSuccess('Salvat!');
} catch (err) { showError(err); } // Auto-translates Firebase errors to Romanian
```

### 5. Order Status Logic — Use Helpers
```tsx
import { canEditOrder, transitionToInLucru } from '@/utils/orderStatusHelpers';
if (canEditOrder(order.status)) { /* show edit */ } // ✅ Business logic in helpers
// ❌ NEVER: if (order.status === 'noua') — logic must stay in helpers
```

### 6. Real-time Subscriptions — Always Cleanup
```tsx
useEffect(() => {
  const unsubscribe = onSnapshot(query(...), snap => { /* ... */ });
  return () => unsubscribe(); // MUST cleanup
}, [deps]);
```

## Order Status Flow
```
noua → in_lucru → livrata
  ↓        ↓
anulata  anulata
```
- `noua`: New, editable/deletable | `in_lucru`: Locked (courier messaged) | `livrata`: Complete | `anulata`: Cancelled
- Auto-transition: `noua` → `in_lucru` when courier sends first message

## Firestore Collections

| Collection | Owner Field | Notes |
|------------|-------------|-------|
| `comenzi` | `uid_client` | Orders with `orderNumber`, `status`, `courierId` |
| `mesaje` | `clientId` + `courierId` | 1-to-1 chat per order — filter by `orderId`, `clientId`, AND `courierId` |
| `profil_curier` | doc ID = `uid` | Publicly readable (clients see courier info) |
| `profil_client` | doc ID = `uid` | Private |
| `users` | doc ID = `uid` | Base profile with `role`, `email`, `serviciiOferite` |

## Commands
```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
```
**No emulators** — project uses live Firebase services. See `.env.local` for required Firebase config.

## Conventions
- **Language**: UI in Romanian | Code/comments in English
- **Imports**: Use `@/*` alias (`@/lib/toast`), never `../../../`
- **Constants**: Import from `lib/constants.ts`, never duplicate
- **Types**: Import from `types/index.ts`, never inline interfaces
- **Firebase**: Modular v11 syntax (`import { collection } from 'firebase/firestore'`)
- **NO PRICES**: Never display prices, currency symbols (€, $, RON), or "de la X" pricing
- **Production**: `next.config.ts` removes `console.*` in production builds

## Common Mistakes

| ❌ Wrong | ✅ Right |
|----------|----------|
| Query without owner filter | `where('uid', '==', user.uid)` |
| `if (status === 'in_lucru')` | `canEditOrder(status)` |
| Inline service colors | Import from `constants.ts` |
| `alert(error.message)` | `showError(error)` |
| `createdAt: new Date()` | `serverTimestamp()` |
| Missing `onSnapshot` cleanup | `return () => unsubscribe()` |

## Service Name Normalization
Orders store lowercase (`'colete'`), profiles may use capitalized (`'Colete'`):
```tsx
const userServices = user.serviciiOferite?.map(s => s.toLowerCase().trim()) || [];
const matchesService = userServices.includes(order.serviciu.toLowerCase().trim());
```

## Styling
- Buttons: `.btn-primary`, `.btn-secondary` | Layout: `.card`, `.form-input`, `.spinner`
- Brand: `text-orange-500` (CTA), `text-emerald-400` (success), `bg-slate-900` (dashboard)
- Status: `orderStatusConfig[status].bg`, `.color`, `.label` from `constants.ts`
- Service: `serviceTypes[].color`, `.bgColor`, `.borderColor` from `constants.ts`

## SEO & OG Images
Dynamic OG images via `opengraph-image.tsx` (1200×630). SEO helpers in `lib/seo.ts`:
- `generatePageMetadata(title, description)` for per-page overrides
- Always include `locale: 'ro_RO'` and Romanian keywords

## Migration Scripts
Located in `scripts/` folder. Requires Firebase Admin SDK:
1. Save service account key as `scripts/serviceAccountKey.json`
2. Run: `cd scripts && npm install firebase-admin && node <script>.js`

## Flags & Assets
Country flags: `public/img/flag/{code}.svg` (lowercase: `ro.svg`, `de.svg`). When adding countries to `constants.ts`, add corresponding flag SVG.
