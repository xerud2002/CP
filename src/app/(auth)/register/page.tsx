'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const role = (searchParams.get('role') as UserRole) || 'client';
  const isClient = role === 'client';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Parolele nu coincid.');
      return;
    }

    if (password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere.');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, role);
      router.push('/dashboard/' + role);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Eroare la înregistrare';
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
          alt="Register"
          width={120}
          height={120}
          className="mx-auto mb-6 drop-shadow-lg"
        />
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {isClient ? '👤 Cont nou Client' : '🚚 Cont nou Curier'}
      </h2>
      <p className="text-gray-400 text-sm mb-6">
        Creează-ți contul gratuit în câteva secunde
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
            autoComplete="email"
            className="form-input"
          />
        </div>

        <div className="text-left">
          <label className="form-label">Parolă</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minim 6 caractere"
            required
            autoComplete="new-password"
            className="form-input"
          />
        </div>

        <div className="text-left">
          <label className="form-label">Confirmă parola</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetă parola"
            required
            autoComplete="new-password"
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
              Se creează contul...
            </>
          ) : (
            'Creează cont'
          )}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">⚠️ {error}</p>
          </div>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-gray-400 text-sm">
        <p>
          Ai deja cont?{' '}
          <Link href={'/login?role=' + role} className="text-green-400 hover:text-green-300 font-medium transition-colors">
            Autentifică-te
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 page-transition">
      <Suspense fallback={
        <div className="auth-box flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
