# Curierul Perfect - AI Agent Instructions

Romanian courier marketplace: clients post delivery requests, couriers bid/chat, then fulfill.  
**Stack**: Next.js 16 (App Router), React 19, Firebase 11.1 (Auth/Firestore/Storage), Tailwind CSS 4, Sonner toasts

## Architecture

**Multi-tenant SaaS** with roles: `client` | `curier` | `admin`. Owner-based Firestore security via `uid` fields.

**Role Permissions**:
- `client`: Create orders, chat with couriers, write reviews, manage own profile
- `curier`: View all orders, message clients, update order status, manage services/coverage zones
- `admin`: Full access to all data, user management, system settings (implementation in progress)

**⚠️ CRITICAL SECURITY**: Firestore rules check ownership but **don't filter results**—client queries MUST include `where('uid', '==', user.uid)`. This is enforced in `firestore.rules` but not auto-applied to queries.

### Route Structure
```
/dashboard/client  → /comenzi, /profil, /recenzii, /suport
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
| `cities.ts` | Cities by country and region: `oraseByCountryAndRegion`, `getOraseForRegion()`, `getAllOraseForCountry()` |
| `AuthContext.tsx` | `useAuth()` hook: `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()`, `resetPassword()` |
| `toast.ts` | `showSuccess()`, `showError()` — auto-translates Firebase errors to Romanian via `errorMessages.ts` |
| `errorMessages.ts` | Firebase error code → Romanian message mapping (e.g., `auth/user-not-found` → "Nu există cont cu acest email") |
| `orderStatusHelpers.ts` | `canEditOrder()`, `canFinalizeOrder()`, `transitionToInLucru()`, `transitionToFinalizata()` |
| `orderHelpers.ts` | `getNextOrderNumber()` (atomic transaction), `formatOrderNumber()` → "CP141122" |
| `documentRequirements.ts` | Service type → required documents mapping (e.g., animals need health certificates) |
| `rating.ts` | `calculateNewRating()` — weighted average algorithm for courier ratings |
| `ServiceIcons.tsx` | `<ServiceIcon service="colete" />` — centralized icons, normalizes case-insensitive lookup |
| `types/index.ts` | TypeScript interfaces: `User`, `Order`, `CoverageZone`, `UserRole`, `Review` |
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

### 5. Authentication — Email & Google OAuth
```tsx
// Email/password registration
const userData = await register(email, password, 'client');

// Google OAuth login (role selected beforehand)
const userData = await loginWithGoogle('curier');

// Password reset
await resetPassword(email);
showSuccess('Email de resetare trimis!');
```
**Why**: `AuthContext` provides unified auth interface. Google OAuth creates/updates user document in Firestore with selected role. Password reset uses Firebase's built-in email flow.

### 6. Timestamps — Server-Side Only
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

### 7. Order Status — Use Helpers, Not Direct Checks
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

### 8. Real-time Data — onSnapshot Cleanup
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

## Service-Specific Requirements

### Document Requirements by Service Type
The `documentRequirements.ts` utility maps service types to required documents:
- **Animals** (`animale`): Health certificate, vaccination records, travel permit
- **Perishable goods** (`perisabile`): Temperature control certificate, quality certificate
- **Fragile items** (`fragile`): Special handling documentation

Use `getRequiredDocuments(serviceType)` to display requirements in order forms.

### Courier Rating System
Ratings use weighted average algorithm in `rating.ts`:
```tsx
import { calculateNewRating } from '@/lib/rating';

// Calculate new rating after review
const newRating = calculateNewRating(
  currentRating,      // Courier's current rating (1-5)
  currentReviewCount, // Number of existing reviews
  newReviewRating     // New review rating (1-5)
);
```
**Formula**: Weighted average that gives more weight to newer reviews while preserving historical data. Updates `profil_curier` document's `rating` and `reviewCount` fields.

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
npm run build      # Production build (checks types, builds Next.js)
npm start          # Production server (after build)
npm run lint       # ESLint check
```

**No emulators**: Project uses live Firebase services, not local emulators. Configuration in `firebase.json` for deployment only.

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

## File Organization — Role-Based Separation

**Hook Pattern** (in `src/hooks/`):
```
client/
  useClientOrdersLoader.ts    # Real-time orders + unread counts for clients
  useClientOrderActions.ts    # Edit, delete, finalize actions
courier/
  useOrdersLoader.ts          # Real-time filtering for couriers
  useOrderHandlers.ts         # Accept, message, finalize actions
  useUnreadMessages.ts        # Unread message tracking
```

**Component Pattern** (in `src/components/orders/`):
```
client/
  filters/ClientOrderFilters.tsx
  list/ClientOrderCard.tsx, ClientOrderList.tsx
courier/
  filters/OrderFilters.tsx
  list/[similar structure]
shared/
  OrderDetailsModal.tsx       # Reusable across roles
  OrderRouteSection.tsx       # Display route info
  CountryFilter.tsx           # Reusable filter component
```

**Why**: Separation by role prevents logic bleeding. A client hook should never import courier logic. If code is truly shared, move it to `shared/` or utils.

## Data Loading Patterns

### Real-time Subscriptions
All dashboard pages use `onSnapshot` for real-time data:
```tsx
useEffect(() => {
  const q = query(
    collection(db, 'comenzi'),
    where('uid_client', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
  
  const unsubscribe = onSnapshot(q, 
    snapshot => setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() }))),
    error => console.error(error)
  );
  
  return () => unsubscribe();
}, [user.uid]);
```

### Filtering Strategy
- **Firestore**: Fetch all user's orders with basic `where()` clauses
- **Client-side**: Apply additional filters (country, service type, search) in memory
- **Why**: Firestore composite indexes are expensive. Client-side filtering provides flexibility for multi-field filters without index overhead.

### Unread Message Tracking
Pattern used in `useClientOrdersLoader.ts` and `useUnreadMessages.ts`:
```tsx
// Subscribe to unread messages for each order
useEffect(() => {
  const unsubscribes: Array<() => void> = [];
  
  orders.forEach(order => {
    const q = query(
      collection(db, 'mesaje'),
      where('orderId', '==', order.id),
      where('clientId', '==', clientId),
      where('courierId', '==', order.courierId),
      where('read', '==', false)
    );
    
    const unsub = onSnapshot(q, snap => {
      const count = snap.docs.filter(d => d.data().senderId !== user.uid).length;
      setUnreadCounts(prev => ({ ...prev, [order.id]: count }));
    });
    
    unsubscribes.push(unsub);
  });
  
  return () => unsubscribes.forEach(fn => fn());
}, [orders]);
```
**Critical**: Filter out own messages client-side (`senderId !== user.uid`) to avoid counting sent messages as unread.

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

## Order Creation Form - Location Selection

The order form uses a combination of dropdown and manual input for location selection:

### Location Structure
- **Country dropdown** (`tara_ridicare`, `tara_livrare`): 16 European countries
- **Region dropdown** (`judet_ridicare`, `judet_livrare`): Regions/counties per country
- **City dropdown** (`oras_ridicare`, `oras_livrare`): Major cities (20-30 per region)
- **Localitate text input** (`localitate_ridicare`, `localitate_livrare`): Manual input for smaller localities/communes

### Selection Logic
- User can choose **either** a city from dropdown **OR** manually enter a localitate
- Selecting a city clears the localitate field and vice versa
- Validation requires at least one: `oras OR localitate` for each location
- Error message: "Selectează un oraș sau introdu o localitate"

### Dropdown Search
All dropdowns include inline search functionality:
- Search bar at top filters by name (case-insensitive)
- "Nu s-au găsit rezultate" message when no matches
- Search clears when dropdown closes
- When country/region changes, city and localitate are reset

### Data Storage
- Cities stored in `cities.ts` with `oraseByCountryAndRegion` object
- Helper functions: `getOraseForRegion()`, `getAllOraseForCountry()`
- 16 countries × ~20 regions × ~25 cities ≈ 8000+ cities total

### Implementation Pattern
```tsx
// City + Localitate on same row
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <CityDropdown
    value={formData.oras_ridicare}
    onChange={(value) => setFormData(prev => ({ ...prev, oras_ridicare: value, localitate_ridicare: '' }))}
    ...
  />
  <input
    name="localitate_ridicare"
    value={formData.localitate_ridicare || ''}
    onChange={(e) => {
      handleInputChange(e);
      if (e.target.value) {
        setFormData(prev => ({ ...prev, oras_ridicare: '' }));
      }
    }}
    placeholder="Comuna, sat..."
  />
</div>
```


## Troubleshooting: Missing Country Flag SVGs (404 Errors)

If you see repeated 404 errors in the browser console for missing `public/img/flag/XX.svg` files (where `XX` is a country code), it means the flag asset is missing from the `public/img/flag/` directory.

- **Required:** Each country in `constants.ts` must have a corresponding SVG flag in `public/img/flag/` named as its 2-letter code (e.g., `RO.svg`, `DE.svg`).
- **Symptoms:** Orders or filters may show broken images or missing flags in the UI.
- **How to fix:**
  1. Add the missing SVG file(s) to `public/img/flag/`.
  2. Use open-source flag SVGs (e.g., [hampusborgos/country-flags](https://github.com/hampusborgos/country-flags)).
  3. Ensure the filename matches the country code in `constants.ts` (case-sensitive).

**AI agents:** When adding new countries or updating `constants.ts`, always add the corresponding flag SVG to avoid asset errors.
