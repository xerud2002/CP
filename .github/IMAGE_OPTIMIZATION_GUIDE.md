# Image Optimization Guide

## Next.js Image Component Best Practices

### Flag Images (SVG)

All flag SVG images MUST use the `unoptimized` prop to prevent Next.js aspect ratio warnings.

**❌ Wrong:**
```tsx
<Image 
  src={`/img/flag/${countryCode}.svg`}
  alt="Country flag"
  width={20}
  height={15}
  className="rounded"
/>
```

**✅ Correct:**
```tsx
<Image 
  src={`/img/flag/${countryCode}.svg`}
  alt="Country flag"
  width={20}
  height={15}
  className="rounded"
  unoptimized
/>
```

### Why `unoptimized` for SVGs?

1. **Aspect Ratio Issues**: Next.js Image optimization can cause aspect ratio warnings with SVG files that have intrinsic dimensions
2. **SVG Optimization**: SVGs are already optimized vector graphics and don't benefit from Next.js image optimization
3. **Performance**: Skipping optimization for small SVG icons (like flags) has negligible performance impact

### Standard Flag Dimensions

Use these consistent dimensions across the app:

- **Large**: `width={24} height={18}` - Used in form dropdowns, buttons
- **Small**: `width={20} height={15}` - Used in lists, cards, filters
- **Aspect Ratio**: Always maintain 4:3 ratio (standard for flags)

### Implementation Checklist

When adding flag images anywhere in the app:

- [ ] Import `Image` from `next/image`
- [ ] Set both `width` and `height` props
- [ ] Add `unoptimized` prop
- [ ] Use consistent dimensions (24x18 or 20x15)
- [ ] Add error handling with `onError` callback (optional)
- [ ] Add `alt` text for accessibility

### Example Implementation

```tsx
import Image from 'next/image';

// In a dropdown or card
<Image 
  src={`/img/flag/${countryCode.toLowerCase()}.svg`}
  alt={countryName}
  width={20}
  height={15}
  className="rounded shrink-0"
  unoptimized
  onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
/>
```

### Files Updated (December 2024)

The following files have been updated with proper flag image optimization:

- `src/components/orders/shared/OrderRouteSection.tsx`
- `src/components/orders/shared/CountryFilter.tsx`
- `src/components/orders/client/list/ClientOrderCard.tsx`
- `src/components/orders/courier/list/OrderCard.tsx`
- `src/app/comanda/components/dropdowns/CountryDropdown.tsx`
- `src/app/comanda/components/dropdowns/CityDropdown.tsx`
- `src/app/comanda/components/dropdowns/RegionDropdown.tsx`

### Preventing Future Issues

**Before adding new Image components:**

1. Check if it's an SVG file → use `unoptimized`
2. Check if it's a flag → use standard dimensions (20x15 or 24x18)
3. Always specify both `width` and `height`
4. Test in browser console for warnings

**Browser Console Check:**

After any changes involving Image components, check the browser console for:
- "Image with src ... has either width or height modified"
- Missing aspect ratio warnings

If you see these warnings, add the `unoptimized` prop to the affected Image components.
