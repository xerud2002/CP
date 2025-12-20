# Curierul Perfect - AI Agent Instructions

Romanian courier marketplace connecting clients with couriers for European package delivery.  
**Stack**: Next.js 16.0 (App Router), React 19, Firebase 11.1, Tailwind CSS 4, Sonner

## 🎯 Architecture At-a-Glance

**Multi-tenant SaaS** with role-based access (`client` | `curier` | `admin`). Security model enforces **owner-based isolation** through `uid` fields in Firestore—rules check ownership, but **client queries MUST also filter by owner** (rules don't auto-filter results).

### Auth Flow
1. User logs in with `?role=client|curier` query param
2. Role stored in `users/{uid}.role` during registration
3. Redirect to `/dashboard/{role}` after auth
4. Protected pages check `user.role` in `useEffect` hook (see pattern below)

### Dashboard Routes
```
/dashboard/client  → Hub + /comenzi, /profil, /recenzii, /fidelitate, /suport
/dashboard/curier  → Hub + /comenzi, /profil, /recenzii, /servicii, /verificare
/dashboard/admin   → Admin panel (future)
```

### Layout Logic
`src/components/LayoutWrapper.tsx` controls Header/Footer visibility:
- **No Header/Footer**: `/dashboard/*`, `/comanda`, auth pages (`/login`, `/register`, `/forgot-password`)
- **With Header/Footer**: All other public routes
- ⚠️ Auth pages using `useSearchParams()` require `<Suspense>` wrapper to avoid hydration errors

## 📋 Essential Files Reference

| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | `useAuth()` hook: `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()`, `resetPassword()` |
| `src/lib/constants.ts` | **SINGLE SOURCE OF TRUTH**: `countries`, `judetByCountry`, `serviceTypes`, `orderStatusConfig` — NEVER duplicate |
| `src/lib/toast.ts` | `showSuccess()`, `showError()`, `showWarning()`, `showInfo()` — auto-translates Firebase errors to Romanian |
| `src/lib/errorMessages.ts` | `logError(context, error)` — Logs errors with context (dev console only) |
| `src/components/icons/ServiceIcons.tsx` | **Centralized service icons**: `ServiceIcon` component + `getServiceIconMetadata()` helper |
| `src/components/orders/OrderChat.tsx` | 1-to-1 chat component with real-time messaging (see Chat System below) |
| `src/utils/orderStatusHelpers.ts` | Status transitions: `transitionToInLucru()`, `transitionToFinalizata()`, `canEditOrder()`, `canFinalizeOrder()` |
| `src/utils/orderHelpers.ts` | `getNextOrderNumber()` (atomic counter), `formatOrderNumber()` (adds "CP" prefix) |
| `src/types/index.ts` | TypeScript interfaces: `User`, `Order`, `CoverageZone`, `UserRole` |

## 🔥 Firestore Collections

| Collection | Owner Field | Key Details |
|------------|-------------|-------------|
| `users` | `uid` (doc ID) | Base profile + `serviciiOferite: string[]` (couriers only) |
| `comenzi` | `uid_client` | Orders with sequential `orderNumber`, `courierId` when accepted, status workflow |
| `mesaje` | `clientId` + `courierId` | 1-to-1 chat messages per order (private conversations) |
| `profil_curier` / `profil_client` | Doc ID = `uid` | Extended single-doc profiles |
| `zona_acoperire` | `uid` | Multi-record coverage zones (courier can have many regions) |
| `recenzii` | `clientId` | Reviews left by clients for couriers (only after `livrata`) |
| `counters/orderNumber` | N/A | Sequential counter (starts 141121, atomic increment via `runTransaction`) |

## 🚨 Critical Patterns (MUST FOLLOW)

### 1. Protected Dashboard Page Template
**COPY THIS** for all `/dashboard/*` pages:
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

### 2. Firestore Queries — ALWAYS Filter by Owner
```tsx
// ❌ WRONG - Security rules block this, returns wrong data
const q = query(collection(db, 'zona_acoperire'));

// ✅ CORRECT - Client queries MUST filter by owner
const q = query(
  collection(db, 'zona_acoperire'), 
  where('uid', '==', user.uid),
  orderBy('addedAt', 'desc')
);
```

### 3. Service Name Normalization
Orders store lowercase (`'colete'`), courier profiles use capitalized (`'Colete'`). **Always normalize**:
```tsx
const userServices = user.serviciiOferite?.map(s => s.toLowerCase().trim()) || [];
const matchesService = userServices.includes(order.serviciu.toLowerCase().trim());
```

### 4. Timestamps — Use serverTimestamp()
```tsx
// ❌ WRONG - Client-side timestamp causes clock skew
addDoc(collection(db, 'zona_acoperire'), { uid: user.uid, timestamp: Date.now() });

// ✅ CORRECT - Server-side timestamp
addDoc(collection(db, 'zona_acoperire'), { 
  uid: user.uid, 
  addedAt: serverTimestamp()
});
```

### 5. Error Handling — Auto-Translation
```tsx
import { showSuccess, showError } from '@/lib/toast';

try {
  await updateDoc(docRef, data);
  showSuccess('Datele au fost salvate!');
} catch (err) {
  showError(err);  // Auto-converts Firebase errors to Romanian
}
```

### 6. Order Numbers — Sequential via Transaction
```tsx
import { getNextOrderNumber, formatOrderNumber } from '@/utils/orderHelpers';

// Creating order - atomic counter
const orderNumber = await getNextOrderNumber();  // 141122

// Displaying order - format with prefix
formatOrderNumber(order.orderNumber);  // "CP141122"
```

### 7. Service Icons — Centralized Component
**ALWAYS** import from `src/components/icons/ServiceIcons.tsx` (single source of truth):
```tsx
import { ServiceIcon, getServiceIconMetadata } from '@/components/icons/ServiceIcons';

// Usage - handles both 'Colete' and 'colete', normalizes internally
<ServiceIcon service={order.serviciu} className="w-5 h-5 text-blue-400" />

// Get full metadata (icon + colors + label)
const { icon, color, bg } = getServiceIconMetadata('colete');
```
**NEVER** create inline ServiceIcon components - always import from centralized file.

### 8. Order Status — NEVER Hardcode
**Use helpers** from `src/utils/orderStatusHelpers.ts`:
```tsx
import { canEditOrder, canFinalizeOrder, transitionToFinalizata } from '@/utils/orderStatusHelpers';

// Check permissions
if (canEditOrder(order.status)) { /* show edit button */ }
if (canFinalizeOrder(order.status)) { /* show finalize button */ }

// Transition (validates internally)
await transitionToFinalizata(order.id, order.status);  // Only works if status === 'in_lucru'
```

### 9. Real-time Listeners — Use onSnapshot Pattern
**For live data** (messages, orders), use Firestore `onSnapshot`:
```tsx
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

useEffect(() => {
  if (!orderId || !user) return;
  
  const q = query(
    collection(db, 'mesaje'),
    where('orderId', '==', orderId),
    where('clientId', '==', user.uid),
    orderBy('createdAt', 'asc')
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMessages(msgs);
  });
  
  return () => unsubscribe();  // Cleanup on unmount
}, [orderId, user]);
```
**Warning**: Always include cleanup return to prevent memory leaks.

## 📊 Order Status Lifecycle
```
noua (new) → in_lucru (in progress) → livrata (delivered)
  ↓              ↓
anulata        anulata
```
- **`noua`**: Editable/deletable by client, auto-transitions to `in_lucru` when courier messages/offers
- **`in_lucru`**: No edits, can be finalized by client OR courier
- **`livrata`**: Final, enables review (`canLeaveReview()`)
- **`anulata`**: Terminal, no further actions

**Full state machine**: `STATUS_TRANSITIONS.md`

## 💬 Chat System

**Private 1-to-1 conversations** between client and each courier per order. Key features:
- **Separation**: Client talking to 3 couriers = 3 distinct conversations
- **Real-time**: `onSnapshot` updates with unread count badges
- **Auto-status**: First courier message transitions order `noua` → `in_lucru`

### Query Pattern
```tsx
// Client sees messages with specific courier
query(
  collection(db, 'mesaje'),
  where('orderId', '==', orderId),
  where('clientId', '==', user.uid),
  where('courierId', '==', courierId),  // Specific courier
  orderBy('createdAt', 'asc')
);

// Courier sees messages with specific client
query(
  collection(db, 'mesaje'),
  where('orderId', '==', orderId),
  where('courierId', '==', user.uid),
  where('clientId', '==', clientId),  // Specific client
  orderBy('createdAt', 'asc')
);
```
**Full docs**: `CHAT_SYSTEM.md`

## 🎨 Styling System

### Pre-built CSS Classes (`src/app/globals.css`)
```css
.btn-primary / .btn-secondary / .btn-danger   /* Action buttons */
.btn-outline-primary / .btn-outline-secondary  /* Outlined variants */
.card                                          /* Glassmorphism card */
.stat-card                                     /* Dashboard stat card */
.form-input / .form-select / .form-label       /* Form elements */
.spinner                                       /* Loading animation */
.custom-scrollbar                              /* Styled scrollbar */
```

### Color System
- **Primary (Orange)**: `#f97316` / `text-orange-500` / `var(--orange)`
- **Secondary (Green)**: `#34d399` / `text-emerald-400` / `var(--green)`
- **Dashboard BG**: `bg-slate-900` (base) / `bg-slate-800/50` (cards)

### Service Type Styling
`src/lib/constants.ts` `serviceTypes` contains `color`, `bgColor`, `borderColor`, `gradient`:
```tsx
import { serviceTypes } from '@/lib/constants';
const service = serviceTypes.find(s => s.id === 'colete');
<div className={service.bgColor}>{service.label}</div>
```

### Order Status Styling
`src/lib/constants.ts` `orderStatusConfig` provides unified status display across dashboards:
```tsx
import { orderStatusConfig } from '@/lib/constants';
const statusConfig = orderStatusConfig[order.status];
<div className={`${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
  {statusConfig.label}
</div>
```

## 💻 Development Workflow

### Commands
```bash
npm run dev       # Dev server → http://localhost:3000
npm run build     # Production build (type checks + lints)
npm run lint      # ESLint
npm start         # Run production build locally
```

### Environment Setup
Create `.env.local` with Firebase config (never commit):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
Get values from Firebase Console → Project Settings → General

### Firebase
```bash
firebase deploy --only firestore:rules   # Deploy rules only
firebase deploy --only hosting           # Deploy hosting only
firebase deploy                          # Full deployment
```

### Migration Scripts
Located in `scripts/` folder:
- **Order status migration**: `node scripts/migrateOrderStatuses.js`
- Requires `serviceAccountKey.json` (download from Firebase Console)
- See `scripts/README.md` for setup instructions

### Debugging
- **Firestore rules**: Test in Firebase Console → Firestore → Rules → Simulator
- **Auth issues**: Check `user` and `loading` state in `useAuth()`
- **Query errors**: Missing owner filter (`where('uid', '==', user.uid)`)
- **Error logs**: Use `logError(context, error)` (dev console only)

## 📖 Documentation

- `FIRESTORE_STRUCTURE.md`: Schema, security rules, indexes, query patterns
- `STATUS_TRANSITIONS.md`: Order status lifecycle, transition rules, validation
- `CHAT_SYSTEM.md`: 1-to-1 chat architecture, query patterns, real-time messaging
- `SERVICE_FLOW_ARCHITECTURE.md`: Order flow from client to courier
- `SECURITY_CHECKLIST.md`: Security measures, validation rules
- `scripts/README.md`: Migration scripts and database maintenance

## 🐛 Common Pitfalls

| ❌ Mistake | ✅ Solution |
|-----------|----------|
| Missing owner filter in query | Always add `where('uid', '==', user.uid)` |
| Hardcoded status checks (`status === 'in_lucru'`) | Use `canEditOrder()`, `canFinalizeOrder()` helpers |
| Hardcoded status display/colors | Use `orderStatusConfig[status]` from constants |
| Inline ServiceIcon components | Always import `ServiceIcon` from `@/components/icons/ServiceIcons` |
| Service name case mismatch | Normalize: `.toLowerCase().trim()` before comparison |
| `alert(error.message)` (English Firebase errors) | Use `showError(error)` for Romanian auto-translation |
| Manual order numbers (`Math.random()`) | Use `getNextOrderNumber()` (atomic transaction) |

## 🌍 Conventions

- **Language**: Romanian UI text, English code/commits
- **Client Components**: All dashboard pages use `'use client'` directive
- **Path Alias**: `@/*` → `./src/*`
- **Type Imports**: `import type { Order } from '@/types'`
- **Constants**: **NEVER duplicate** — always import from `@/lib/constants.ts`
- **Country Flags**: `public/img/flag/{code}.svg` (lowercase: `ro.svg`, `gb.svg`)
- **Firestore Imports**: Always `import { db } from '@/lib/firebase'` (consistent path)
