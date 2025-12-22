# Ghid Utilizare Paleta de Culori - Curierul Perfect

## 📋 Rezumat

Paleta de culori a fost standardizată pentru consistență vizuală în întreaga platformă. Acest document explică cum să folosești noile culori și ce sa evitat.

## 🎨 Paleta de Culori Principală

### Culoare Brand - Portocaliu
**Orange-500** este culoarea principală a brandului:
- **Utilizare**: Butoane CTA, logo, elemente importante, notificări
- **Clase Tailwind**: `bg-orange-500`, `text-orange-400`, `from-orange-500 to-orange-600`
- **Gradient**: `bg-gradient-to-br from-orange-500 to-orange-600`

### Culoare Succes - Emerald (Verde)
**Emerald-500** înlocuiește vechile tonuri de verde:
- **Utilizare**: Status "livrata", confirmări, mesaje pozitive
- **Clase Tailwind**: `bg-emerald-500`, `text-emerald-400`
- **Gradient**: `bg-gradient-to-br from-emerald-500 to-emerald-600`

### Culoare Avertizare - Amber
**Amber-500** pentru status-uri intermediare:
- **Utilizare**: Status "in_lucru", notificări neutre, avertismente
- **Clase Tailwind**: `bg-amber-500/20`, `text-amber-400`

### Culoare Pericol - Red
**Red-500** pentru acțiuni destructive:
- **Utilizare**: Erori, anulări, ștergeri
- **Clase Tailwind**: `bg-red-500`, `text-red-400`

### Culoare Informativă - Blue
**Blue-500** pentru informații generale:
- **Utilizare**: Links, detalii, mesaje informative
- **Clase Tailwind**: `bg-blue-500`, `text-blue-400`

## 📁 Fișier Centralizat

**Locație**: [`src/lib/colors.ts`](src/lib/colors.ts)

Acest fișier exportă:
- `brandColors` - culori brand (primary, success, warning, danger, info)
- `roleColors` - culori pentru roluri (admin, curier, client)
- `statusColors` - culori pentru status-uri comenzi
- `uiColors` - culori UI (background, text, border, hover)
- `buttonStyles` - clase pre-configurate pentru butoane
- `gradients` - gradient-uri predefinite
- `ratingColors` - culori pentru rating (1-5 stele)
- `badgeColors` - culori pentru badge-uri/notificări

### Exemplu de utilizare:

```typescript
import { brandColors, buttonStyles } from '@/lib/colors';

// În JSX
<button className={buttonStyles.primary}>
  Comandă acum
</button>

// Sau individual
<div className={`${brandColors.primary.main} ${brandColors.primary.hover}`}>
  Element important
</div>
```

## 🔄 Schimbări Majore

### Ce s-a schimbat:

1. **Verde → Emerald**
   - ❌ Înainte: `bg-green-500`, `text-green-400`
   - ✅ Acum: `bg-emerald-500`, `text-emerald-400`

2. **Galben → Amber**
   - ❌ Înainte: `bg-yellow-500`, `text-yellow-400`
   - ✅ Acum: `bg-amber-500`, `text-amber-400`

3. **Roșu-Portocaliu pentru Admin → Orange uniform**
   - ❌ Înainte: `from-red-500 to-orange-500`, `from-red-400 to-red-600`
   - ✅ Acum: `from-orange-500 to-orange-600` (consistent)

4. **Gradiente mixte → Gradient-uri uniforme**
   - ❌ Înainte: `from-blue-500 to-cyan-500` (servicii)
   - ✅ Acum: `from-orange-500 to-orange-600` (brand consistency)

5. **Clase CSS invalide corectate**
   - ❌ Înainte: `bg-linear-to-br` (invalid)
   - ✅ Acum: `bg-gradient-to-br` (corect)

## 🎯 Roluri și Culori

### Admin
- Avatar: `bg-gradient-to-br from-orange-500 to-orange-600`
- Badge: `bg-orange-500/20 text-orange-400 border-orange-500/30`
- Acces: Culoare orange pentru a indica autoritate

### Curier
- Avatar: `bg-gradient-to-br from-orange-500 to-orange-600`
- Badge: `bg-orange-500/20 text-orange-400 border-orange-500/30`
- Acces: Culoare orange pentru rol activ

### Client
- Avatar: `bg-gradient-to-br from-emerald-500 to-emerald-600`
- Badge: `bg-emerald-500/20 text-emerald-400 border-emerald-500/30`
- Acces: Culoare emerald pentru diferențiere

## 📊 Status-uri Comenzi

| Status | Culoare | Background | Text |
|--------|---------|------------|------|
| `noua` | White/Neutru | `bg-white/10` | `text-white` |
| `in_lucru` | Amber | `bg-amber-500/20` | `text-amber-400` |
| `acceptata` | Blue | `bg-blue-500/20` | `text-blue-400` |
| `in_tranzit` | Orange | `bg-orange-500/20` | `text-orange-400` |
| `livrata` | Emerald | `bg-emerald-500/20` | `text-emerald-400` |
| `anulata` | Red | `bg-red-500/20` | `text-red-400` |

## 🚀 Butoane Pre-configurate

Folosește clasele din `globals.css`:

```tsx
// Buton principal (orange)
<button className="btn-primary">Comandă</button>

// Buton secundar (emerald)
<button className="btn-secondary">Salvează</button>

// Buton pericol (red)
<button className="btn-danger">Șterge</button>

// Buton outline orange
<button className="btn-outline-orange">Detalii</button>

// Buton outline emerald
<button className="btn-outline-green">Confirmă</button>
```

## ⚠️ Ce să eviți

### ❌ NU folosi:
- `bg-green-*` → Folosește `bg-emerald-*`
- `text-green-*` → Folosește `text-emerald-*`
- `bg-yellow-*` → Folosește `bg-amber-*`
- `from-red-* to-orange-*` → Folosește `from-orange-* to-orange-*` (pentru brand)
- `from-blue-* to-cyan-*` → Folosește gradient-urile definite în `colors.ts`
- Culori hardcodate (e.g., `bg-[#f97316]`) → Folosește clase Tailwind

### ✅ FOLOSEȘTE:
- `bg-emerald-500` pentru succes
- `bg-amber-500` pentru warning
- `bg-orange-500` pentru brand/primary
- `bg-red-500` pentru erori
- Gradient-uri din `colors.ts`

## 📝 Exemple Concrete

### Card Component
```tsx
<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-orange-500/30">
  {/* Content */}
</div>
```

### Badge Status
```tsx
// Status livrata
<span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full text-xs">
  Livrată
</span>

// Status in_lucru
<span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-1 rounded-full text-xs">
  În Lucru
</span>
```

### Avatar Gradient
```tsx
// Admin/Curier
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold">
  CP
</div>

// Client
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
  C
</div>
```

## 🔍 Unde s-au aplicat schimbările

### Fișiere Actualizate:
- ✅ `src/app/globals.css` - CSS variables și clase butoane
- ✅ `src/lib/colors.ts` - Paletă centralizată (NOU)
- ✅ `src/lib/constants.ts` - Gradient-uri servicii
- ✅ `src/lib/rating.ts` - Culori rating (amber în loc de yellow)
- ✅ `src/components/Header.tsx` - Gradient emerald
- ✅ `src/components/Footer.tsx` - Buton newsletter
- ✅ `src/components/HelpCard.tsx` - Gradient orange-amber
- ✅ `src/components/orders/CourierProfileModal.tsx` - Header gradient
- ✅ `src/components/orders/OrderChat.tsx` - Corectare clase invalide
- ✅ `src/components/orders/OrderChatMulti.tsx` - Gradient-uri avatar
- ✅ `src/app/(auth)/login/page.tsx` - Badge culori
- ✅ `src/app/(auth)/register/page.tsx` - Badge culori
- ✅ `src/app/dashboard/admin/page.tsx` - Orange uniform pentru admin
- ✅ `src/app/dashboard/curier/page.tsx` - Emerald pentru verificare

## 💡 Best Practices

1. **Import centralizat**: Preferă `colors.ts` în loc de clase hardcodate
2. **Consistență opacity**: Folosește `/10`, `/20`, `/30` pentru transparență
3. **Hover states**: Adaugă întotdeauna hover pentru interactivitate
4. **Gradient-uri**: Folosește `bg-gradient-to-br` (bottom-right) pentru depth
5. **Border matches**: Border-ul trebuie să matcheze culoarea principală (`border-orange-500/30` cu `bg-orange-500/20`)

## 📚 Resurse Suplimentare

- **Tailwind CSS Colors**: https://tailwindcss.com/docs/customizing-colors
- **Accessibility**: Verifică contrastul culorilor pentru WCAG AA compliance
- **Design System**: Toate culorile sunt definite în [`src/lib/colors.ts`](src/lib/colors.ts)

---

**Data actualizării**: 22 decembrie 2025  
**Versiune paletă**: 1.0.0  
**Culori brand**: Orange-500 (primary), Emerald-500 (success), Amber-500 (warning)
