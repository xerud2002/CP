'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  return (
    <header className="bg-blue-950 flex justify-between items-center px-4 py-2">
      <Link href="/">
        <Image src="/logo.png" alt="Curierul Perfect" width={120} height={85} className="h-20 w-auto" />
      </Link>
      
      <nav className="flex gap-4">
        {!user ? (
          <>
            <Link 
              href="/login?role=client" 
              className="px-6 py-2 rounded-lg border-2 border-green-400 text-white hover:bg-green-400 hover:text-blue-950 transition-all"
            >
              Client
            </Link>
            <Link 
              href="/login?role=curier" 
              className="px-6 py-2 rounded-lg border-2 border-orange-500 text-white hover:bg-orange-500 hover:text-blue-950 transition-all"
            >
              Curier
            </Link>
          </>
        ) : (
          <>
            <Link 
              href={`/dashboard/${user.role}`}
              className="px-6 py-2 rounded-lg border-2 border-green-400 text-white hover:bg-green-400 hover:text-blue-950 transition-all"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg border-2 border-red-500 text-white hover:bg-red-500 hover:text-blue-950 transition-all"
            >
              Deloghează-te
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
