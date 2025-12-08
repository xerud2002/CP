'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-blue-950/80 border-b border-white/10">
      <div className="gradient-line"></div>
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <Image 
            src="/logo.png" 
            alt="Curierul Perfect" 
            width={120} 
            height={85} 
            className="h-16 w-auto transition-transform group-hover:scale-105" 
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-3 items-center">
          {!user ? (
            <>
              <Link 
                href="/login?role=client" 
                className="btn-outline-green"
              >
                👤 Client
              </Link>
              <Link 
                href="/login?role=curier" 
                className="btn-outline-orange"
              >
                🚚 Curier
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-400 text-sm mr-2">
                Salut, <span className="text-green-400 font-medium">{user.email?.split('@')[0]}</span>
              </span>
              <Link 
                href={`/dashboard/${user.role}`}
                className="btn-outline-green"
              >
                📊 Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                Ieșire
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-blue-950/95 backdrop-blur-lg border-t border-white/10 p-4 space-y-3">
          {!user ? (
            <>
              <Link 
                href="/login?role=client" 
                className="btn-outline-green w-full block text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                👤 Client
              </Link>
              <Link 
                href="/login?role=curier" 
                className="btn-outline-orange w-full block text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                🚚 Curier
              </Link>
            </>
          ) : (
            <>
              <Link 
                href={`/dashboard/${user.role}`}
                className="btn-outline-green w-full block text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                📊 Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full px-4 py-2 rounded-lg border-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                Ieșire
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
