# Curierul Perfect - AI Agent Instructions

Romanian courier marketplace: clients post delivery requests, couriers bid/chat, then fulfill.  
**Stack**: Next.js 16 (App Router), React 19, Firebase 11.1 (Auth/Firestore/Storage), Tailwind CSS 4, Sonner toasts

## Architecture

**Multi-tenant SaaS** with roles: `client` | `curier` | `admin`. Owner-based Firestore security via `uid` fields.

**⚠️ CRITICAL SECURITY**: Firestore rules check ownership but **don't filter results**—client queries MUST include `where('uid_client', '==', user.uid)` for orders. See `firestore.rules` lines 41-47 for read permissions requiring client-side filtering.

### Route Structure
- `/dashboard/client` → `/comenzi`, `/profil`, `/suport`
- `/dashboard/curier` → `/comenzi`, `/profil`, `/servicii`, `/verificare`
- `/dashboard/admin` → Single-page tabbed UI with: `utilizatori`, `curieri`, `comenzi`, `arhiva`, `verificare-documente`, `setari`, `mesaje`, `monetizare`
- `/comanda` → Order creation wizard (no header/footer, see `app/comanda/layout.tsx`)
- `/api/contact` → Server-side email via Nodemailer (SMTP config in `.env.local`)

### Code Organization
- `src/components/orders/{client|courier|shared}/` → Role-specific + reusable components
- `src/components/admin/` → Admin panel components (17 files: `AdminUI.tsx`, `OrdersTable.tsx`, `UsersTable.tsx`, `CouriersGrid.tsx`, etc.)
- `src/hooks/{client|courier}/` → Role-specific data hooks
- `src/hooks/useChatMessages.ts` → Shared real-time messaging (order-scoped 1-to-1 chats)
- `src/hooks/useAdminMessages.ts` → Admin messaging system
- `functions/` → Firebase Cloud Functions (placeholder, currently empty)

## Key Files (Single Source of Truth)

| File | Purpose |
|------|---------|
| `lib/constants.ts` | `countries` (24), `judetByCountry`, `serviceTypes` (10), `orderStatusConfig`, `serviceNames` |
| `lib/cities.ts` | `oraseByCountryAndRegion` (20-30 major cities per region), `getOraseForRegion()`, `getAllOraseForCountry()` |
| `lib/errorMessages.ts` | Firebase error code → Romanian message mapping (auth, firestore, storage) — 40+ errors |
| `lib/toast.ts` | `showSuccess()`, `showError()` — auto-translates Firebase errors via `getErrorMessage()` |
| `lib/contact.ts` | `CONTACT_INFO`, `SOCIAL_LINKS`, `COMPANY_INFO` |
| `lib/firebase.ts` | Firebase v11 initialization — exports `auth`, `db`, `storage` (modular imports only) |
| `contexts/AuthContext.tsx` | `useAuth()`: `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()`, `resetPassword()` |
| `utils/orderStatusHelpers.ts` | `canEditOrder()`, `canDeleteOrder()`, `transitionToInLucru()`, `transitionToFinalizata()` |
| `types/index.ts` | TypeScript interfaces: `User`, `Order`, `UserRole`, `CourierProfile`, `DocumentRequirement`, `ChatMessage` |
| `next.config.ts` | Production config: `removeConsole`, `optimizeCss`, image optimization, cache headers |

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
// ✅ CORRECT — always filter by owner (field name varies by collection)
const q = query(collection(db, 'comenzi'), where('uid_client', '==', user.uid), orderBy('createdAt', 'desc'));
// For profil_curier/profil_client: doc ID = user.uid (no filter needed, direct doc access)
// For users collection: doc ID = user.uid
// For mesaje: filter by orderId + clientId + courierId (see Message Threading pattern)
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
} catch (err) { showError(err); } // Auto-translates Firebase errors to Romanian via lib/errorMessages.ts
```
**Error Translation**: `showError()` automatically maps Firebase error codes to Romanian messages (e.g., `auth/user-not-found` → "Nu există niciun cont cu această adresă de email."). See `lib/errorMessages.ts` for full mapping.

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

### Order Archiving
Orders can be soft-deleted (archived) instead of permanently deleted:
```tsx
// Archive an order (soft delete)
await updateDoc(doc(db, 'comenzi', orderId), {
  archived: true,
  archivedAt: serverTimestamp()
});
// Exclude archived from queries (client-side filtering)
orders.filter(order => order.archived !== true);
```
Admin panel has a dedicated "Arhivă" tab to view/restore archived orders.

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
npm run lighthouse   # Desktop performance audit (builds, starts, runs Lighthouse)
```
**No emulators** — project uses live Firebase services. See `.env.local` for required Firebase config:
- `NEXT_PUBLIC_FIREBASE_*` — Client-side Firebase config
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_PORT` — Contact form email

## Conventions
- **Language**: UI in Romanian | Code/comments in English
- **Imports**: Use `@/*` alias (`@/lib/toast`), never `../../../`
- **Constants**: Import from `lib/constants.ts`, never duplicate
- **Types**: Import from `types/index.ts`, never inline interfaces
- **Firebase**: Modular v11 syntax — always import from submodules:
  ```tsx
  import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
  import { db } from '@/lib/firebase'; // Initialized instance
  ```
  NEVER use compatibility or compat imports.
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
Orders store lowercase IDs (`'colete'`, `'plicuri'`), but `serviceTypes` in `constants.ts` uses mixed case in `value` field. Always normalize when comparing:
```tsx
// ✅ CORRECT — normalize both sides
const userServices = user.serviciiOferite?.map(s => s.toLowerCase().trim()) || [];
const matchesService = userServices.includes(order.serviciu.toLowerCase().trim());
// Common in: useOrdersLoader.ts, CouriersGrid.tsx, courier dashboard filters
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
