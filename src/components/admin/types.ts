// Admin Component Types
import { User, Order } from '@/types';

// Re-export for convenience
export type { User, Order };

export interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  color: string;
  bgColor: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

// Helper Functions
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bună dimineața';
  if (hour < 18) return 'Bună ziua';
  return 'Bună seara';
}

export function formatDate(timestamp: number | undefined): string {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Get display name helper
export function getDisplayName(user: User): string {
  if (user.nume && user.prenume) {
    return `${user.nume} ${user.prenume}`;
  }
  if (user.nume) return user.nume;
  if (user.prenume) return user.prenume;
  if (user.displayName) return user.displayName;
  // Return role-based default name
  if (user.role === 'curier') return 'Curier';
  if (user.role === 'admin') return 'Administrator';
  return 'Client';
}

// Format user date helper
export function formatUserDate(createdAt: Date | string | { seconds: number } | undefined): string | null {
  if (!createdAt) return null;
  try {
    let date: Date;
    if (typeof createdAt === 'object' && 'seconds' in createdAt) {
      date = new Date(createdAt.seconds * 1000);
    } else if (typeof createdAt === 'string') {
      date = new Date(createdAt);
    } else {
      date = createdAt as Date;
    }
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

// Service info for monetization
export const serviceInfo: Record<string, { name: string; emoji: string; color: string; bgColor: string }> = {
  colete: { name: 'Transport Colete', emoji: '📦', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  plicuri: { name: 'Transport Plicuri', emoji: '✉️', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  persoane: { name: 'Transport Persoane', emoji: '👥', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
  electronice: { name: 'Transport Electronice', emoji: '💻', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  animale: { name: 'Transport Animale', emoji: '🐾', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  platforma: { name: 'Transport Platformă', emoji: '🚛', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  tractari: { name: 'Tractări Auto', emoji: '🚗', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  mobila: { name: 'Transport Mobilă', emoji: '🛋️', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  paleti: { name: 'Transport Paleți', emoji: '📥', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
};
