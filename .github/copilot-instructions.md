# Curierul Perfect - AI Coding Instructions

## Project Overview
Romanian/European courier marketplace connecting clients with couriers for package delivery. Built with **Next.js 16** (App Router), **React 19**, **Firebase** (Auth + Firestore), and **Tailwind CSS 4**.

## Architecture

### User Roles & Dashboards
Three distinct user roles with role-based routing:
- **client** → `/dashboard/client` - Send packages, track orders
- **curier** → `/dashboard/curier` - Manage routes, coverage zones, accept orders
- **admin** → `/dashboard/admin` - User management, order oversight

Auth flow redirects users to `/dashboard/{role}` after login. Role is passed via query param: `/login?role=client`.

### Key Data Flow
```
AuthContext (user state) → Firebase Auth → Firestore (user profile in 'users' collection)
                                         → Firestore (orders in 'comenzi' collection)
                                         → Firestore (coverage in 'zona_acoperire' collection)
```

### File Structure Patterns
- `src/app/(auth)/` - Route group for auth pages (login, register, forgot-password)
- `src/app/dashboard/{role}/` - Role-specific dashboard pages
- `src/contexts/AuthContext.tsx` - Global auth state with `useAuth()` hook
- `src/lib/firebase.ts` - Firebase singleton initialization
- `src/types/index.ts` - TypeScript interfaces for `User`, `Order`, `CoverageZone`, `CourierProfile`

## Code Conventions

### Component Patterns
- All pages using client-side features must have `'use client';` directive
- Use `useAuth()` hook for authentication state
- Dashboard pages follow guard pattern:
```tsx
useEffect(() => {
  if (!loading && (!user || user.role !== 'expectedRole')) {
    router.push('/login?role=expectedRole');
  }
}, [user, loading, router]);
```

### Styling
- Use custom CSS classes defined in `globals.css`: `card`, `btn-primary`, `btn-secondary`, `btn-danger`, `form-input`, `form-select`, `auth-box`, `dashboard-card`
- Color scheme: orange (`#f97316`), green (`#34d399`), blue (`#0f172a`)
- Prefer custom classes over inline Tailwind for consistency

### Firebase/Firestore
- Collections: `users`, `comenzi`, `zona_acoperire`
- Always use `serverTimestamp()` for timestamps
- User documents keyed by Firebase Auth `uid`

### Language
- UI text is in **Romanian** - maintain consistency
- Code comments and variables in English

## Development Commands
```bash
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build
npm run lint   # ESLint check
```

## Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## Important Implementation Notes
- `useSearchParams()` requires `Suspense` boundary wrapper (see login/register pages)
- Path alias `@/*` maps to `./src/*`
- Country/region data stored in page components (e.g., `judetByCountry` in zona-acoperire)
- Images in `public/img/` - use `next/image` with explicit width/height
