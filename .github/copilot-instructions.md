# Curierul Perfect - AI Agent Instructions

Romanian courier marketplace: clients post delivery requests, couriers bid/chat, then fulfill.  
**Stack**: Next.js 16 (App Router), React 19, Firebase 11.1 (Auth/Firestore/Storage), Tailwind CSS 4, Sonner toasts

## Architecture

**Multi-tenant SaaS** with roles: `client` | `curier` | `admin`. Owner-based Firestore security via `uid` fields.

**⚠️ CRITICAL SECURITY**: Firestore rules check ownership but **don't filter results**—client queries MUST include `where('uid', '==', user.uid)`. This is enforced in `firestore.rules` but not auto-applied to queries.

### Route Structure
```
/dashboard/client  → /comenzi, /profil, /recenzii, /fidelitate, /suport
/dashboard/curier  → /comenzi, /profil, /recenzii, /servicii, /verificare
/comanda           → Order creation wizard (no header/footer)
```

Auth pages use `?role=client|curier` query param. `LayoutWrapper.tsx` conditionally hides Header/Footer on dashboards and auth pages.

### Component Organization
```
src/components/orders/
  client/        → Client-specific order views (filters, list, cards)
  courier/       → Courier-specific views (details, filters, list)
  shared/        → Reusable across both roles (modals, sections)
```
Custom hooks in `src/hooks/{client|courier}/` handle data loading, real-time subscriptions, and business logic. This separation prevents role-specific logic from bleeding across boundaries.

## Key Files

| File | Purpose |
|------|---------|
| `constants.ts` | **SINGLE SOURCE OF TRUTH**: `countries`, `judetByCountry`, `serviceTypes`, `orderStatusConfig` |
| `AuthContext.tsx` | `useAuth()` hook: `user`, `loading`, `login()`, `register()`, `logout()` |
| `toast.ts` | `showSuccess()`, `showError()` — auto-translates Firebase errors to Romanian via `errorMessages.ts` |
| `orderStatusHelpers.ts` | `canEditOrder()`, `canFinalizeOrder()`, `transitionToInLucru()`, `transitionToFinalizata()` |
| `orderHelpers.ts` | `getNextOrderNumber()` (atomic transaction), `formatOrderNumber()` → "CP141122" |
| `ServiceIcons.tsx` | `<ServiceIcon service="colete" />` — centralized icons, normalizes case-insensitive lookup |
| `types/index.ts` | TypeScript interfaces: `User`, `Order`, `CoverageZone`, `UserRole` |
| `useClientOrdersLoader.ts` | Real-time orders + unread message counts for clients |
| `useOrdersLoader.ts` | Real-time order filtering for couriers (by service type, country) |

**Architecture Docs** (root): `FIRESTORE_STRUCTURE.md`, `STATUS_TRANSITIONS.md`, `CHAT_SYSTEM.md`, `SERVICE_FLOW_ARCHITECTURE.md`. Read these before major changes to understand data flows and business rules.

## Critical Patterns

### 1. Dashboard Page Auth Template
All `/dashboard/*` pages MUST follow this pattern for auth protection:
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
  // ... protected content
}
```
**Why**: Client-side auth check with loading state prevents flash of unauthorized content. The `useEffect` runs after hydration to avoid SSR mismatches.

### 2. Firestore Queries — Owner Filter Required
```tsx
// ✅ CORRECT - Explicit ownership filter
const q = query(
  collection(db, 'zona_acoperire'), 
  where('uid', '==', user.uid),
  orderBy('addedAt', 'desc')
);

// ❌ WRONG - Missing owner filter exposes other users' data
const q = query(collection(db, 'zona_acoperire'), orderBy('addedAt', 'desc'));
```
**Why**: Security rules allow broad reads for couriers to see available orders, but you MUST filter by ownership in the query to avoid leaking data.

### 3. Service Name Normalization
Orders store lowercase (`'colete'`), profiles may use capitalized (`'Colete'`):
```tsx
// Matching logic in courier dashboards
const userServices = user.serviciiOferite?.map(s => s.toLowerCase().trim()) || [];
const orderService = order.serviciu.toLowerCase().trim();
const matchesService = userServices.includes(orderService);
```
**Why**: Inconsistent capitalization from different input sources. Always normalize before comparison.

### 4. Error Handling — Centralized Toasts
```tsx
import { showSuccess, showError } from '@/lib/toast';

try {
  await updateDoc(docRef, data);
  showSuccess('Salvat!');  // Romanian UI text
} catch (err) {
  showError(err);  // Auto-translates Firebase codes to Romanian
}
```
**Why**: `showError()` uses `errorMessages.ts` to map Firebase error codes to user-friendly Romanian messages. Never use `alert()` or raw error messages.

### 5. Timestamps — Server-Side Only
```tsx
import { serverTimestamp } from 'firebase/firestore';

// ✅ CORRECT
await addDoc(collection(db, 'comenzi'), {
  ...data,
  createdAt: serverTimestamp()
});

// ❌ WRONG - Client time can be manipulated/incorrect
await addDoc(collection(db, 'comenzi'), {
  ...data,
  createdAt: new Date()  // or Date.now()
});
```
**Why**: Client clocks are unreliable. `serverTimestamp()` ensures consistent, tamper-proof timestamps.

### 6. Order Status — Use Helpers, Not Direct Checks
```tsx
import { canEditOrder, transitionToFinalizata } from '@/utils/orderStatusHelpers';

// ✅ CORRECT
if (canEditOrder(order.status)) {
  // Show edit button
}

// ❌ WRONG - Business logic scattered across components
if (order.status === 'noua' || order.status === 'in_lucru') {
  // Show edit button (incorrect - 'in_lucru' can't be edited)
}
```
**Why**: Status transition rules are complex (see `STATUS_TRANSITIONS.md`). Helpers centralize business logic and prevent bugs.

### 7. Real-time Data — onSnapshot Cleanup
```tsx
useEffect(() => {
  const q = query(
    collection(db, 'mesaje'), 
    where('orderId', '==', id),
    orderBy('createdAt', 'asc')
  );
  const unsubscribe = onSnapshot(q, snap => {
    setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
  return () => unsubscribe();  // MUST cleanup or memory leak
}, [id]);
```

**Multiple subscriptions** (e.g., loading messages for multiple orders):
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
**Why**: `onSnapshot` creates persistent connections. Without cleanup, you'll leak listeners and hit Firebase quota limits.

## Order Status Flow
```
noua → in_lucru → livrata
  ↓        ↓
anulata  anulata
```
- `noua`: New order, editable/deletable by client only
- `in_lucru`: Locked (courier messaged), can be finalized by client OR courier
- `livrata`: Complete, triggers review flow
- Auto-transition: `noua` → `in_lucru` when courier sends first message (see `transitionToInLucru()`)

## Firestore Collections

| Collection | Owner Field | Key Points |
|------------|-------------|------------|
| `comenzi` | `uid_client` | Orders with `orderNumber` (sequential), `status`, `courierId` |
| `mesaje` | `clientId` + `courierId` | **1-to-1 chat per order** — filter by `orderId`, `clientId`, AND `courierId` |
| `zona_acoperire` | `uid` | Courier coverage zones (multi-record, one per zone) |
| `profil_curier` | doc ID = `uid` | Extended courier profile (publicly readable for clients) |
| `profil_client` | doc ID = `uid` | Extended client profile (private) |
| `recenzii` | `clientId` | Reviews of couriers (written by clients after `livrata` status) |
| `counters/orderNumber` | — | Atomic counter for sequential order numbers |

**Chat System**: Each client-courier pair has a **separate conversation** per order. A client messaging 3 couriers about one order = 3 distinct threads. Query MUST filter by `orderId`, `clientId`, AND `courierId` to ensure privacy (see `CHAT_SYSTEM.md`).

## Styling — Pre-built Classes
- Buttons: `.btn-primary`, `.btn-secondary`
- Layout: `.card`, `.form-input`, `.spinner`
- Brand colors: `text-orange-500` (primary CTA), `text-emerald-400` (success), `bg-slate-900` (dashboard background)
- Status styling: Use `orderStatusConfig[status].bg`, `.color`, `.label` from `constants.ts`
- Service styling: Use `serviceTypes.find(s => s.id === 'colete').bgColor`

## Commands
```bash
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run lint       # ESLint check
```

## Common Mistakes

| ❌ Wrong | ✅ Right | Why |
|----------|----------|-----|
| Query without owner filter | `where('uid', '==', user.uid)` | Security rules don't auto-filter |
| `if (status === 'in_lucru')` | `canEditOrder(status)` | Business logic in helpers |
| Inline service icons/colors | Import from `ServiceIcons.tsx`, `constants.ts` | Single source of truth |
| `alert(error.message)` | `showError(error)` | Romanian translations |
| `createdAt: new Date()` | `serverTimestamp()` | Server-side consistency |
| Missing `onSnapshot` cleanup | `return () => unsubscribe()` | Prevents memory leaks |

## Conventions
- **Language**: UI text in Romanian | Code/comments/commits in English
- **Client components**: All dashboard pages MUST have `'use client'` directive at top (Next.js 16 App Router requirement)
- **Path alias**: `@/*` → `./src/*` (configured in `tsconfig.json`). Never use relative paths like `../../../lib/constants`
- **Constants**: Never duplicate. Always import from `@/lib/constants.ts`
- **Types**: Import from `@/types/index.ts`. Never inline `interface` in components
- **Firebase SDK**: Uses modular v11.1 syntax (`import { collection } from 'firebase/firestore'`), not legacy `firebase.firestore()`

## Development Workflow
1. Read relevant `.md` docs in root for context on major changes
2. Check `constants.ts` before adding new countries/services/statuses
3. Use `showError(err)` for all user-facing errors
4. Test status transitions with `orderStatusHelpers.ts` functions
5. Verify Firestore rules in `firestore.rules` match query ownership filters

## Order Filtering & Search

Both client and courier order filters support:
- **Country**: Matches pickup OR delivery country
- **Service Type**: Normalized lowercase comparison (`'colete'` vs `'Colete'`)
- **Search**: Matches order number (#CP141135), pickup city, or delivery city
- **Sort**: Newest (default), oldest

Filters are applied client-side after Firestore fetch for flexibility. 

**Client Implementation**:
- Filters in `useClientOrdersLoader` hook
- Component: `ClientOrderFilters.tsx`
- Page: `dashboard/client/comenzi`

**Courier Implementation**:
- Filters in `useOrdersLoader` hook (with options parameter)
- Component: `OrderFilters.tsx`
- Page: `dashboard/curier/comenzi`

**Filter Component Pattern**:
```tsx
// 3-column grid for main filters
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
  <CountryFilter />
  <ServiceTypeFilter />
  <CustomSortDropdown />  // Custom dropdown with icons
</div>

// Search bar below filters
<input 
  type="text"
  placeholder="Caută după număr comandă (#CP141135) sau oraș..."
  className="form-input w-full pl-10 pr-4"
/>
```

**Sort Dropdown Pattern**:
```tsx
// Custom dropdown (NOT native <select>) with icons and state management
const [isSortOpen, setIsSortOpen] = useState(false);
const sortDropdownRef = useRef<HTMLDivElement>(null);

// Click outside to close
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
      setIsSortOpen(false);
    }
  }
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

// Options with icons
const sortOptions = [
  { value: 'newest', label: 'Cele mai recente', icon: 'down' },
  { value: 'oldest', label: 'Cele mai vechi', icon: 'up' }
];
```

## Order Creation Form - Dropdown Search

Country and region dropdowns include inline search functionality:
- **Country dropdowns** (`tara_ridicare`, `tara_livrare`): Search bar at top filters by country name
- **Region dropdowns** (`judet_ridicare`, `judet_livrare`): Search bar at top filters by region name
- Search is case-insensitive and clears when dropdown closes
- "Nu s-au găsit rezultate" message appears when no matches
- Implementation pattern:
  ```tsx
  // State for search
  const [countrySearch, setCountrySearch] = useState('');
  
  // Filtered list
  const filteredCountries = useMemo(
    () => countries.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())),
    [countrySearch]
  );
  
  // Dropdown structure
  <div className="absolute ... flex flex-col">
    <div className="p-2 border-b">
      <input value={countrySearch} onChange={...} placeholder="Caută..." />
    </div>
    <div className="overflow-y-auto">
      {filteredCountries.map(...)}
    </div>
  </div>
  ```
