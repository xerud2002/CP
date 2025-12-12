'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Hide global Header/Footer on dashboard pages, comanda page and auth pages (they have their own headers)
  const isDashboard = pathname?.startsWith('/dashboard');
  const isComanda = pathname === '/comanda';
  const isAuth = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/forgot-password');
  
  if (isDashboard || isComanda || isAuth) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
