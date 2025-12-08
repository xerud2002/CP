'use client';

import { ReactNode } from 'react';

// Dashboard-specific layout that excludes the global Header and Footer
// This prevents duplicate headers in dashboard pages
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      {children}
    </div>
  );
}
