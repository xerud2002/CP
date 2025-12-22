/**
 * Curierul Perfect - Paleta de Culori Standardizată
 * 
 * Această paletă definește culorile brand-ului și asigură consistență
 * în întreaga aplicație. Folosește aceste clase Tailwind în loc de culori hardcodate.
 */

// ============================================
// CULORI BRAND
// ============================================

/**
 * Culoare primară - Portocaliu
 * Folosită pentru: butoane CTA principale, logo, elemente importante
 */
export const brandColors = {
  primary: {
    main: 'bg-orange-500 text-white',
    hover: 'hover:bg-orange-600',
    active: 'active:bg-orange-700',
    text: 'text-orange-500',
    light: 'bg-orange-500/10',
    medium: 'bg-orange-500/20',
    border: 'border-orange-500/30',
    shadow: 'shadow-orange-500/20',
    gradient: 'from-orange-500 to-orange-600',
  },
  
  /**
   * Culoare secundară - Verde Emerald
   * Folosită pentru: succes, confirmări, status pozitiv
   */
  success: {
    main: 'bg-emerald-500 text-white',
    hover: 'hover:bg-emerald-600',
    text: 'text-emerald-400',
    light: 'bg-emerald-500/10',
    medium: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  
  /**
   * Culoare de avertizare
   * Folosită pentru: status "in_lucru", notificări
   */
  warning: {
    main: 'bg-amber-500 text-white',
    hover: 'hover:bg-amber-600',
    text: 'text-amber-400',
    light: 'bg-amber-500/10',
    medium: 'bg-amber-500/20',
    border: 'border-amber-500/30',
  },
  
  /**
   * Culoare de eroare/anulare
   * Folosită pentru: erori, anulări, ștergeri
   */
  danger: {
    main: 'bg-red-500 text-white',
    hover: 'hover:bg-red-600',
    text: 'text-red-400',
    light: 'bg-red-500/10',
    medium: 'bg-red-500/20',
    border: 'border-red-500/30',
  },
  
  /**
   * Culoare informativă
   * Folosită pentru: informații generale, links, detalii
   */
  info: {
    main: 'bg-blue-500 text-white',
    hover: 'hover:bg-blue-600',
    text: 'text-blue-400',
    light: 'bg-blue-500/10',
    medium: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    shadow: 'shadow-blue-500/20',
    gradient: 'from-blue-500 to-blue-600',
  },
};

// ============================================
// CULORI PENTRU ROLURI
// ============================================

export const roleColors = {
  admin: {
    avatar: 'bg-linear-to-br from-orange-500 to-orange-600',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    text: 'text-orange-400',
  },
  
  curier: {
    avatar: 'bg-linear-to-br from-orange-500 to-orange-600',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    text: 'text-orange-400',
  },
  
  client: {
    avatar: 'bg-linear-to-br from-emerald-500 to-emerald-600',
    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    text: 'text-emerald-400',
  },
};

// ============================================
// CULORI PENTRU STATUS-URI COMENZI
// ============================================

export const statusColors = {
  noua: {
    bg: 'bg-white/10',
    text: 'text-white',
    badge: 'bg-white/10 text-white',
    dot: 'bg-white',
  },
  
  in_lucru: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  },
  
  acceptata: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-400',
    border: 'border-blue-500/30',
    dot: 'bg-blue-400',
  },
  
  in_tranzit: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    badge: 'bg-orange-500/20 text-orange-400',
    border: 'border-orange-500/30',
    dot: 'bg-orange-400',
  },
  
  livrata: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  
  anulata: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    badge: 'bg-red-500/20 text-red-400',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
  },
};

// ============================================
// CULORI PENTRU FUNDAL ȘI ELEMENTE UI
// ============================================

export const uiColors = {
  background: {
    primary: 'bg-slate-900',
    secondary: 'bg-slate-800',
    tertiary: 'bg-slate-800/50',
    card: 'bg-slate-800/50 backdrop-blur-sm',
    modal: 'bg-slate-800',
  },
  
  text: {
    primary: 'text-white',
    secondary: 'text-gray-300',
    muted: 'text-gray-400',
    disabled: 'text-gray-500',
  },
  
  border: {
    default: 'border-white/5',
    light: 'border-white/10',
    medium: 'border-white/20',
  },
  
  hover: {
    light: 'hover:bg-white/5',
    medium: 'hover:bg-white/10',
  },
};

// ============================================
// CLASE PENTRU BUTOANE
// ============================================

export const buttonStyles = {
  primary: `${brandColors.primary.main} ${brandColors.primary.hover} ${brandColors.primary.active} font-medium rounded-xl transition-all ${brandColors.primary.shadow}`,
  
  secondary: 'bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white font-medium rounded-xl transition-all',
  
  danger: `${brandColors.danger.main} ${brandColors.danger.hover} font-medium rounded-xl transition-all`,
  
  success: `${brandColors.success.main} ${brandColors.success.hover} font-medium rounded-xl transition-all`,
  
  ghost: 'bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-medium rounded-xl transition-all',
  
  outline: `bg-transparent border ${uiColors.border.light} hover:border-orange-500/50 text-white font-medium rounded-xl transition-all`,
};

// ============================================
// GRADIENT-URI PENTRU ELEMENTE DECORATIVE
// ============================================

export const gradients = {
  primary: 'bg-linear-to-br from-orange-500 to-orange-600',
  primaryLight: 'bg-linear-to-br from-orange-500/20 to-orange-600/10',
  success: 'bg-linear-to-br from-emerald-500 to-emerald-600',
  background: 'bg-linear-to-br from-slate-800/80 to-slate-900/80',
  
  // Gradient-uri pentru orb-uri decorative
  orb: {
    primary: 'bg-orange-500/10',
    secondary: 'bg-orange-500/5',
  },
};

// ============================================
// CLASE HELPER PENTRU RATING
// ============================================

export const ratingColors = {
  5: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
  4: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
  3: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
  2: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
  1: 'text-red-400 bg-red-500/20 border-red-500/30',
};

// ============================================
// CULORI PENTRU NOTIFICĂRI/BADGE-URI
// ============================================

export const badgeColors = {
  notification: brandColors.primary.main,
  unread: 'bg-orange-500',
  new: 'bg-emerald-500',
  urgent: 'bg-red-500',
  info: 'bg-blue-500',
};

// ============================================
// EXPORT DEFAULT - PENTRU IMPORT RAPID
// ============================================

export default {
  brand: brandColors,
  role: roleColors,
  status: statusColors,
  ui: uiColors,
  buttons: buttonStyles,
  gradients,
  rating: ratingColors,
  badge: badgeColors,
};
