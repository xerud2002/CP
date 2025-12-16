'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const role = (searchParams.get('role') as UserRole) || 'client';
  const isCurier = role === 'curier';

  useEffect(() => {
    if (user) {
      router.push('/dashboard/' + user.role);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);

      if (userData.role !== role && role !== 'admin') {
        setError('Contul nu corespunde tipului de utilizator selectat.');
        return;
      }

      router.push('/dashboard/' + userData.role);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Eroare la autentificare';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const user = await loginWithGoogle(role);
      router.push('/dashboard/' + user.role);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Eroare la autentificare cu Google';
      setError(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 via-slate-900 to-green-500/20"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            {isCurier ? (
              <>
                Bine ai revenit,<br />
                <span className="text-gradient">Partenere!</span>
              </>
            ) : (
              <>
                Bine ai revenit în<br />
                <span className="text-gradient">contul tău!</span>
              </>
            )}
          </h1>
          
          <p className="text-gray-400 text-lg mb-10 max-w-md">
            {isCurier 
              ? 'Accesează dashboard-ul și gestionează transporturi de colete, plicuri, persoane, mobilă, electronice, animale și servicii de platformă pe rutele tale europene.'
              : 'Transport sigur în toată Europa: colete, plicuri, persoane, mobilă, electronice, animale, platformă și tractări auto.'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">16+</div>
              <div className="text-gray-500 text-sm">Țări acoperite</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50k+</div>
              <div className="text-gray-500 text-sm">Transporturi finalizate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9★</div>
              <div className="text-gray-500 text-sm">Rating mediu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Logo - Mobile & Desktop */}
          <Link href="/" className="flex items-center justify-center gap-3 sm:gap-4 mb-8 group">
            {/* Logo Image */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 group-hover:scale-105 transition-all">
              <Image 
                src="/img/logo2.png" 
                alt="Curierul Perfect Logo" 
                width={56} 
                height={56} 
                className="w-full h-full object-contain drop-shadow-lg"
                priority
              />
            </div>
            {/* Text */}
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                <span className="group-hover:opacity-80 transition-opacity" style={{color: '#FF8C00'}}>CurierulPerfect</span>
              </span>
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium tracking-wider uppercase text-center">- TRANSPORT EUROPA -</span>
            </div>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${isCurier ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
              {isCurier ? (
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h8M8 17a2 2 0 11-4 0m4 0a2 2 0 10-4 0m12 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0M3 9h13a2 2 0 012 2v4H3V9zm13 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4h13z" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isCurier ? 'Autentificare Partener' : 'Autentificare Client'}
            </h2>
            <p className="text-gray-400">
              Introdu datele tale pentru a continua
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {googleLoading ? (
              <span className="spinner w-5 h-5 border-2 border-gray-400 border-t-gray-800"></span>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continuă cu Google
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-950 text-gray-500">sau cu email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplu@email.com"
                required
                autoComplete="username"
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Parolă</label>
                <Link 
                  href={'/forgot-password?role=' + role} 
                  className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
                >
                  Ai uitat parola?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                isCurier 
                  ? 'bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30' 
                  : 'bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30'
              } ${(loading || googleLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner w-5 h-5 border-2"></span>
                  Se autentifică...
                </>
              ) : (
                'Autentifică-te'
              )}
            </button>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Nu ai cont?{' '}
              <Link 
                href={'/register?role=' + role} 
                className={`font-medium transition-colors ${isCurier ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'}`}
              >
                Înregistrează-te gratuit
              </Link>
            </p>
          </div>

          {/* Switch Role */}
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-sm">
              {isCurier ? 'Ești client?' : 'Ești partener de transport?'}{' '}
              <Link 
                href={`/login?role=${isCurier ? 'client' : 'curier'}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isCurier ? 'Autentifică-te ca client' : 'Autentifică-te ca partener'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="spinner"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}




