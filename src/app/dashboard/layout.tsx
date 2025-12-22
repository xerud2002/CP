import type { Metadata } from 'next';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Curierul Perfect'
  },
  robots: {
    index: false,
    follow: false,
  }
};

// Dashboard-specific layout that excludes the global Header and Footer
// This prevents duplicate headers in dashboard pages
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen relative overflow-hidden bg-slate-900">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-linear-to-br from-orange-500/20 via-slate-900 to-green-500/20 pointer-events-none"></div>
        
        {/* Decorative circles */}
        <div className="fixed top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </ErrorBoundary>
  );
}
