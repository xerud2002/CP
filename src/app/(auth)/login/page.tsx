'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const role = (searchParams.get('role') as UserRole) || 'client';
  const isClient = role === 'client';

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

  return (
    <div className="auth-box">
      <div className="relative">
        <Image
          src={isClient ? '/img/loginclient.png' : '/img/cont.png'}
          alt="Login"
          width={120}
          height={120}
          className="mx-auto mb-6 drop-shadow-lg"
        />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {isClient ? '👤 Autentificare Client' : '🚚 Autentificare Curier'}
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Introdu datele tale pentru a continua
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplu@email.com"
            required
            autoComplete="username"
            className="form-input"
          />
        </div>

        <div className="text-left">
          <label className="form-label">Parolă</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="form-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={'btn-primary w-full flex items-center justify-center gap-2 ' + (loading ? 'opacity-50 cursor-not-allowed' : '')}
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
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">⚠️ {error}</p>
          </div>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-gray-400 text-sm space-y-3">
        <p>
          Nu ai cont?{' '}
          <Link href={'/register?role=' + role} className="text-green-400 hover:text-green-300 font-medium transition-colors">
            Înregistrează-te gratuit
          </Link>
        </p>
        <p>
          <Link href={'/forgot-password?role=' + role} className="text-gray-500 hover:text-gray-400 transition-colors">
            Ai uitat parola?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-transition">
      <Suspense fallback={
        <div className="auth-box flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
