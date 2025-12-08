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
      <Image
        src={isClient ? '/img/loginclient.png' : '/img/cont.png'}
        alt="Login"
        width={140}
        height={140}
        className="mx-auto mb-4"
      />

      <h2 className="text-2xl font-bold text-white mb-6">
        Autentificare {isClient ? 'Client' : 'Curier'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="username"
          className="form-input"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parola"
          required
          autoComplete="current-password"
          className="form-input"
        />

        <button
          type="submit"
          disabled={loading}
          className={'btn-primary w-full ' + (loading ? 'opacity-50 cursor-not-allowed' : '')}
        >
          {loading ? 'Se autentifica...' : 'Autentifica-te'}
        </button>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </form>

      <div className="mt-6 text-gray-400 text-sm space-y-2">
        <p>
          Nu ai cont?{' '}
          <Link href={'/register?role=' + role} className="text-green-400 hover:underline">
            Inregistreaza-te
          </Link>
        </p>
        <p>
          Ai uitat parola?{' '}
          <Link href={'/forgot-password?role=' + role} className="text-green-400 hover:underline">
            Recupereaza parola
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<div className="auth-box"><p className="text-white">Se incarca...</p></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
