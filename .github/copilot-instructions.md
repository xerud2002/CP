# Curierul Perfect - AI Coding Instructions

Romanian courier marketplace connecting clients with couriers for European package delivery.  
**Stack**: Next.js 16 (App Router), React 19, Firebase Auth/Firestore, Tailwind CSS 4

## Architecture Overview

This is a **multi-tenant SaaS** platform with role-based access control. All data isolation uses owner-based security (`uid` fields) enforced at both Firestore rules and client-side query filtering. The app uses **client components** (`'use client'`) throughout dashboards for auth state and real-time updates.

### Role-Based Dashboards
| Role | Path | Pattern | Sub-pages |
|------|------|---------|-----------|
| `client` | `/dashboard/client` | Single-page dashboard with stats + navigation grid | `/comenzi`, `/profil`, `/recenzii`, `/fidelitate`, `/suport` |
| `curier` | `/dashboard/curier` | Card grid dashboard → sub-pages | `/comenzi`, `/profil`, `/recenzii`, `/servicii`, `/verificare` |
| `admin` | `/dashboard/admin` | Admin panel | — |

**Auth flow**: `?role=client|curier` on login/register → stores role in Firestore `users/{uid}` → redirects to `/dashboard/{role}`

### Layout Hierarchy
```
RootLayout (AuthProvider)
  └─ LayoutWrapper (conditional Header/Footer)
      ├─ /dashboard/* → DashboardLayout (dark theme, no Header/Footer)
      ├─ /comanda → no Header/Footer (dedicated order page)
      ├─ /(auth)/* → no Header/Footer (login/register/forgot-password)
      └─ all other routes → Header + content + Footer
```

**Routing groups**: `(auth)` is a route group (not in URL path) for grouping auth pages with shared layout  
**Layout logic** (see `LayoutWrapper.tsx`):
- Excludes Header/Footer when: `pathname.startsWith('/dashboard')` OR `/comanda` OR auth routes
- Dashboard pages render page-specific sticky headers with back navigation
- `DashboardLayout` provides dark theme (`bg-slate-900`) with decorative orange/green gradient circles
- Auth pages require `<Suspense>` wrapper when using `useSearchParams()` (Next.js App Router requirement)

### Key Files
| Purpose | File | Description |
|---------|------|-------------|
| Auth hook | `src/contexts/AuthContext.tsx` | `useAuth()` with `user`, `loading`, `login()`, `register()`, `loginWithGoogle()`, `logout()`, `resetPassword()` |
| Types | `src/types/index.ts` | `User`, `UserRole`, `Order`, `CoverageZone`, `CourierProfile` |
| Firebase | `src/lib/firebase.ts` | Singleton init with `getApps()` pattern (prevents re-init); exports `auth`, `db`, `storage` |
| Styling | `src/app/globals.css` | Custom CSS classes: `btn-primary`, `card`, `form-input`, `tab-menu`, `spinner`, `text-gradient` |
| Icons | `src/components/icons/DashboardIcons.tsx` | All SVG dashboard icons as React components |
| Data | `src/lib/constants.ts` | `countries` (16 EU countries), `judetByCountry` (full region lists), `serviceTypes` (unified service definitions with icons), `serviceNames` (map), `orderStatusConfig` (unified status display) |
| Helpers | `src/utils/orderHelpers.ts` | `getNextOrderNumber()` (atomic counter), `formatOrderNumber()`, `formatClientName()` |
| Status Helpers | `src/utils/orderStatusHelpers.ts` | `transitionToInLucru()`, `transitionToFinalizata()`, `canEditOrder()`, `canDeleteOrder()`, `canFinalizeOrder()`, `canLeaveReview()` |
| Toast | `src/lib/toast.ts` | Sonner wrapper: `showSuccess()`, `showError()`, `showInfo()`, `showWarning()`, `showLoading()` |
| Errors | `src/lib/errorMessages.ts` | Romanian error messages map for Firebase auth/firestore/storage errors + `getErrorMessage()` helper + `logError()` for console logging |
| Help | `src/components/HelpCard.tsx` | Reusable support card with email/WhatsApp links for all sub-pages |
| Layout | `src/components/LayoutWrapper.tsx` | Conditional Header/Footer logic based on pathname |
| Docs | `FIRESTORE_STRUCTURE.md` | Complete schema docs with security, indexes, and query patterns |
| Status Flow | `STATUS_TRANSITIONS.md` | Order status lifecycle, transition rules, validation, and UI patterns |
| Security | `SECURITY_CHECKLIST.md` | Security measures, data flow, validation rules, and testing checklist |

### Firestore Collections
| Collection | Document ID | Owner Field | Purpose |
|------------|-------------|-------------|---------|
| `users` | `{uid}` | `uid` | User profiles & roles + `serviciiOferite` array for couriers |
| `zona_acoperire` | auto | `uid` | Courier coverage zones (multi-record) |
| `tarife_curier` | auto | `uid` | Courier pricing (multi-record) |
| `profil_client` | `{uid}` | — | Extended client profile (single doc per client) |
| `profil_curier` | `{uid}` | — | Extended courier profile (single doc per courier) |
| `comenzi` | auto | `uid_client` | Orders (`orderNumber` field, `courierId` when accepted) |
| `recenzii` | auto | `clientId` | Reviews from clients about couriers |
| `counters` | `orderNumber` | — | Sequential order number counter (uses `runTransaction`) |
| `transport_aeroport` | auto | `uid` | Airport transfer routes (courier-specific) |
| `transport_persoane` | auto | `uid` | Person transport routes (courier-specific) |

**Data Fetching Pattern**: Use `where()` filters + owner field for multi-tenant security:
```tsx
const q = query(collection(db, 'zona_acoperire'), where('uid', '==', user.uid));
const snapshot = await getDocs(q);
```

**Firestore Rules**: All collections enforce owner-based access. Couriers can read pending orders + their assigned orders. See `FIRESTORE_STRUCTURE.md` for complete security documentation. **CRITICAL**: Queries MUST filter by owner field client-side — rules alone don't auto-filter queries.

**Order Numbering**: Orders use sequential numbers starting at `141121` via `getNextOrderNumber()` using Firestore transactions on `counters/orderNumber`. Display with `formatOrderNumber()` → `"CP141121"`. Fallback handles old orders without `orderNumber` field.

**Service Name Normalization**: **CRITICAL** - Always compare service names case-insensitive (`.toLowerCase().trim()`):
- Orders: saved as lowercase (`'colete'`, `'plicuri'`, `'persoane'`)
- Courier services: saved as capitalized in `users.serviciiOferite` (`'Colete'`, `'Plicuri'`, `'Persoane'`)
- **All service matching MUST normalize both sides to lowercase before comparison**
- Example in courier order filtering:
```tsx
const userServices = user.serviciiOferite?.map(s => s.toLowerCase().trim()) || [];
const matchesService = userServices.includes(order.serviciu.toLowerCase().trim());
```

**Order Lifecycle & Status Flow**:
```
noua → in_lucru (auto) → livrata (manual)
  ↓         ↓
anulata   anulata
```
**Status Transitions**:
- `noua` → `in_lucru`: Automatic when courier sends first message or offer (uses `transitionToInLucru()`)
- `in_lucru` → `livrata`: Manual via "Finalizează" button by client or courier (uses `transitionToFinalizata()`)
- **CRITICAL**: Only `noua` orders can be edited/deleted. Only `in_lucru` orders can be finalized.
- **Reviews**: Only `livrata` orders allow reviews - client can leave review anytime, courier can request review from client
- See `STATUS_TRANSITIONS.md` for complete flow documentation

## Critical Patterns

### Protected Page Template (REQUIRED for all dashboard pages)
```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CurierPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>;
  if (!user) return null;
  // Page content...
}
```

### Suspense for useSearchParams (auth pages)
```tsx
export default function Page() {
  return <Suspense fallback={<div className="spinner"></div>}><LoginForm /></Suspense>;
}
```
**Why**: Next.js requires Suspense for dynamic params (`searchParams`) when using client components

### Firestore Writes — Always use serverTimestamp()
```tsx
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

await addDoc(collection(db, 'zona_acoperire'), { 
  uid: user.uid, 
  tara, 
  judet, 
  addedAt: serverTimestamp() // Server-side timestamp (not Date.now())
});
```
**Why**: Server timestamps prevent client clock skew issues and ensure consistent ordering

### Toast System & Error Handling
```tsx
import { showError, showSuccess, showPromise } from '@/lib/toast';
import { getErrorMessage } from '@/lib/errorMessages';

try {
  await someFirebaseOperation();
  showSuccess('Operațiune reușită!');
} catch (err: unknown) {
  showError(err); // Automatically converts to Romanian user-friendly message
}

// For async operations with automatic loading/success/error states
await showPromise(
  someAsyncOperation(),
  {
    loading: 'Se procesează...',
    success: 'Operațiune finalizată!',
    error: 'Eroare la procesare'
  }
);
```
**Toast System**: Use Sonner-based helpers from `@/lib/toast.ts`:
- `showSuccess(message)` — Green toast, 3s duration
- `showError(error)` — Red toast with auto-translated Romanian error, 5s duration  
- `showInfo(message)` — Blue toast, 3s
- `showWarning(message)` — Yellow toast, 4s
- `showLoading(message)` — Returns toast ID for dismissal (`dismissToast(id)`)
- `showPromise(promise, messages)` — Auto-handles loading/success/error states

**Error Messages**: `@/lib/errorMessages.ts` maps Firebase error codes to Romanian messages. Use `getErrorMessage(error)` to convert any error to user-friendly text.

### Sub-page Header Pattern (curier sub-pages)
```tsx
<div className="bg-slate-900/80 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl">
  <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
    <div className="flex items-center gap-3">
      <Link href="/dashboard/curier" className="p-2 hover:bg-slate-800/80 rounded-xl">
        <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
      </Link>
      <div className="p-2.5 bg-linear-to-br from-{color}-500/20 to-{color}-500/20 rounded-xl border border-{color}-500/20">
        <PageIcon className="w-6 h-6 text-{color}-400" />
      </div>
      <div><h1 className="text-lg sm:text-2xl font-bold text-white">Page Title</h1></div>
    </div>
  </div>
</div>
```

### Custom Dropdown Pattern (avoid browser defaults)
Use custom dropdowns with `useRef` + click-outside handling for country/prefix selectors:
```tsx
const dropdownRef = useRef<HTMLDivElement>(null);
const [isOpen, setIsOpen] = useState(false);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```
See `src/app/dashboard/curier/profil/page.tsx` for full country/phone prefix dropdown implementation.

## Styling

### CSS Classes (from globals.css)
| Use | Classes |
|-----|---------|
| Buttons | `btn-primary` (orange), `btn-secondary` (green), `btn-danger`, `btn-outline-orange`, `btn-outline-green` |
| Cards | `card` (glassmorphism), `stat-card` |
| Forms | `form-input`, `form-select`, `form-label` |
| Tabs | `tab-menu`, `tab-button`, `tab-button.active` |
| Loading | `spinner` |
| Text | `text-gradient` (orange→green) |
| Scroll | `custom-scrollbar` |

### Color Palette
- **Orange** (primary): `#f97316` — buttons, CTAs, courier accent
- **Green** (secondary): `#34d399` — success, client accent
- **Dark theme**: `bg-slate-900` (dashboard base), `bg-slate-800/50` (cards with glassmorphism)

### Responsive Breakpoints
- Mobile-first design with `sm:` breakpoint (640px+)
- Stack vertically on mobile, grid layouts on desktop
- Touch-friendly targets (min 44x44px) with `active:scale-[0.98]` for tactile feedback

## Conventions
- **UI text**: Romanian | **Code/variables**: English | **Comments**: English
- **Path alias**: `@/*` → `./src/*`
- **Flags**: `public/img/flag/{code}.svg` (lowercase country code)
- **Firestore security**: Owner-based rules — `resource.data.uid == request.auth.uid`
- **Extended regions**: All countries have full region lists in `src/lib/constants.ts` (`judetByCountry` object)
- **Firebase init**: Singleton pattern with `getApps()` check to prevent re-initialization
- **Client components**: All dashboard pages are `'use client'` due to auth hooks and state management
- **HelpCard**: Standard help component imported into all dashboard sub-pages — provides WhatsApp/email support links with consistent styling (see `src/components/HelpCard.tsx`)
- **Navigation pattern**: Client dashboard = single page with tiles | Courier dashboard = hub page with tile grid linking to dedicated sub-pages
- **Images**: Use `next/image` with explicit width/height; flags are 24x18px typically
- **Loading states**: Centered spinner with `animate-spin` + text feedback (see protected page template)
- **Form validation**: Validate on submit, not on change; show errors below inputs with red text
- **Toasts**: Always use `showSuccess()`, `showError()`, etc. from `@/lib/toast.ts` — Toaster component auto-included in `RootLayout`
- **Error handling**: Use `showError(error)` for automatic Romanian translation of Firebase errors
- **🆕 Centralized Constants**: **ALWAYS** import services, countries, and status configs from `@/lib/constants.ts` — never duplicate these definitions in components

## File Organization
```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Route group: login, register, forgot-password (no Header/Footer)
│   ├── dashboard/         # Protected dashboards (client/curier/admin)
│   │   ├── client/        # Client dashboard + sub-pages (comenzi, profil, etc.)
│   │   └── curier/        # Courier dashboard + sub-pages (comenzi, profil, etc.)
│   ├── comanda/           # Public order creation page
│   ├── globals.css        # Tailwind + custom classes (btn-primary, card, spinner, etc.)
│   └── layout.tsx         # Root layout with AuthProvider + Toaster
├── components/            # Reusable UI components
│   ├── icons/             # SVG icon components
│   ├── orders/            # Order-specific helpers
│   └── ui/                # Generic UI components (CountUp, SearchableSelect, etc.)
├── contexts/              # React contexts (AuthContext for user state)
├── lib/                   # Core utilities
│   ├── constants.ts       # **CRITICAL**: Single source of truth for countries, services, status configs
│   ├── errorMessages.ts   # Romanian translations of Firebase errors
│   ├── firebase.ts        # Firebase initialization (auth, db, storage)
│   └── toast.ts           # Sonner wrapper helpers
├── types/                 # TypeScript type definitions
│   └── index.ts           # User, Order, CoverageZone, CourierProfile types
└── utils/                 # Helper functions
    ├── orderHelpers.ts    # Order number generation & formatting
    └── orderStatusHelpers.ts  # Status transition logic & validation
```

**Documentation Files** (root):
- `FIRESTORE_STRUCTURE.md`: Complete Firestore schema, security rules, and query patterns
- `STATUS_TRANSITIONS.md`: Order status lifecycle with rules and UI implementations
- `SECURITY_CHECKLIST.md`: Security measures, validation, and testing guidelines
- `firestore.rules`: Firestore security rules (deploy with `firebase deploy --only firestore:rules`)
- `firestore.indexes.json`: Composite indexes for efficient queries
- `scripts/`: Database migration scripts with documentation

## Commands
```bash
npm run dev    # Development server on localhost:3000
npm run build  # Production build (check for build errors)
npm run start  # Start production server (requires build first)
npm run lint   # ESLint (check code style)
firebase deploy --only firestore         # Deploy rules & indexes
firebase deploy --only firestore:rules   # Deploy only rules
firebase deploy --only firestore:indexes # Deploy only indexes
```

## Key Implementation Notes

### Future Features (Not Yet Implemented)
- **Messaging System**: `mesaje` collection for courier-client chat (referenced in `STATUS_TRANSITIONS.md`)
- **Offers System**: `oferte` collection for courier price proposals
- **Automatic Transitions**: Currently `noua` → `in_lucru` requires manual helper call; will be automatic when messaging/offers are built
- **Firebase Emulators**: Local dev environment not configured (connects directly to production)
- **CI/CD Pipeline**: No automated testing or deployment pipeline yet

### Performance Considerations
- All dashboard queries use composite indexes (defined in `firestore.indexes.json`)
- Order queries filter by `uid_client` or `courierId` + `timestamp` DESC for pagination readiness
- Use `limit()` queries when displaying large lists (e.g., `limit(20)` for initial load)
- Images use Next.js Image optimization — always specify width/height
- Firestore real-time listeners not yet implemented (currently using one-time fetches)

### Data Migration
- Script `scripts/migrateOrderStatuses.js` available for batch order status updates
- See `scripts/README.md` for migration documentation
- Always backup Firestore data before running migration scripts

## Development Workflows

### Testing Multi-Tenant Security
1. Create test accounts for both roles: `?role=client` and `?role=curier` during registration
2. Verify owner-based filtering: client should only see their orders, courier sees pending + assigned
3. Test service matching: courier's `serviciiOferite` must match order's `serviciu` (case-insensitive)
4. Check order lifecycle: `noua` → `in_lucru` (auto) → `livrata` (manual) → reviews enabled
5. Verify deletion rules: only `noua` orders can be deleted by owner
6. Test status transitions: use helpers from `orderStatusHelpers.ts` for `transitionToInLucru()` and `transitionToFinalizata()`

### Firebase Deployment
```bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy only rules
firebase deploy --only firestore:rules

# Deploy only indexes
firebase deploy --only firestore:indexes

# Check rules syntax before deploying
firebase firestore:rules:validate
```
**Note**: Always test rule changes in console before deploying. Use Firestore Rules Playground at [Firebase Console](https://console.firebase.google.com).

### Firebase Local Development
```bash
# NOT IMPLEMENTED - Requires firebase-tools and local emulator setup
# firebase emulators:start
# Set NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true in .env.local
```
Currently, the app connects directly to production Firebase (no emulator support yet).

### Debugging Auth Issues
- Check `AuthContext.tsx` state in React DevTools (user object should have `role`, `uid`, `email`)
- Verify Firebase `users/{uid}` document has correct `role` field using Firestore console
- Confirm Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Test role redirects: login should redirect to `/dashboard/{role}` based on `?role` param
- Check browser console for Firebase auth errors (translated to Romanian via `errorMessages.ts`)

### Order Status Testing
1. **Create order**: Client creates new order → status = `noua`
2. **Transition to in_lucru**: Manually call `transitionToInLucru(orderId, 'noua')` (simulates courier interaction)
3. **Finalize order**: Use "Finalizează" button → calls `transitionToFinalizata(orderId, 'in_lucru')` → status = `livrata`
4. **Review flow**: Once `livrata`, client can leave review via `/dashboard/client/recenzii?orderId={id}`
5. **Validation**: Test `canEditOrder()`, `canDeleteOrder()`, `canFinalizeOrder()` helpers for proper status checks

## Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
