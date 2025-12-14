'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const role = (searchParams.get('role') as UserRole) || 'client';
  const isCurier = role === 'curier';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Eroare la trimiterea email-ului';
      setError(errorMessage);
    } finally {
      setLoading(false);
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
            Resetează-ți<br />
            <span className="text-gradient">parola</span>
          </h1>
          
          <p className="text-gray-400 text-lg mb-10 max-w-md">
            Nu-ți face griji! Îți trimitem un email cu instrucțiuni pentru a-ți reseta parola în siguranță.
          </p>

          {/* Security Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-gray-300">Link securizat de resetare</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-300">Link valid pentru 1 oră</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-gray-300">Protecție anti-spam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center justify-center gap-3 mb-8 group">
            <div className="w-10 h-10 group-hover:scale-105 transition-all">
              <Image 
                src="/img/logo.png" 
                alt="Curierul Perfect Logo" 
                width={40} 
                height={40} 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            <span className="text-xl font-bold text-white">Curierul Perfect</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-yellow-500/20">
              <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Ai uitat parola?
            </h2>
            <p className="text-gray-400">
              Introdu email-ul și îți trimitem instrucțiuni
            </p>
          </div>

          {success ? (
            /* Success Message */
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Email trimis!</h3>
              <p className="text-gray-400 mb-6">
                Am trimis instrucțiunile de resetare la <span className="text-white font-medium">{email}</span>. Verifică și folder-ul de spam dacă nu găsești email-ul.
              </p>
              <Link 
                href={'/login?role=' + role}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                  isCurier 
                    ? 'bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' 
                    : 'bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Înapoi la autentificare
              </Link>
            </div>
          ) : (
            /* Email Form */
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Adresa de email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplu@email.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/30 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <span className="spinner w-5 h-5 border-2"></span>
                      Se trimite...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Trimite email de resetare
                    </>
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
              <div className="mt-8 text-center space-y-3">
                <p className="text-gray-400">
                  Ți-ai amintit parola?{' '}
                  <Link 
                    href={'/login?role=' + role} 
                    className={`font-medium transition-colors ${isCurier ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'}`}
                  >
                    Autentifică-te
                  </Link>
                </p>
                <p className="text-gray-500 text-sm">
                  Nu ai cont?{' '}
                  <Link 
                    href={'/register?role=' + role}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Înregistrează-te gratuit
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* Switch Role */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {isCurier ? 'Ești client?' : 'Ești curier?'}{' '}
              <Link 
                href={`/forgot-password?role=${isCurier ? 'client' : 'curier'}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isCurier ? 'Resetează parola ca client' : 'Resetează parola ca curier'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="spinner"></div>
      </div>
    }>
      <ForgotPasswordForm />
    </Suspense>
  );
}




