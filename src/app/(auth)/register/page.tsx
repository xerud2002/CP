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
      setError('Parola trebuie sa aiba cel putin 6 caractere.');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, role);
      router.push('/dashboard/' + role);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Eroare la inregistrare';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box">
      <Image
        src={isClient ? '/img/loginclient.png' : '/img/cont.png'}
        alt="Register"
        width={140}
        height={140}
        className="mx-auto mb-4"
      />

      <h2 className="text-2xl font-bold text-white mb-6">
        Inregistrare {isClient ? 'Client' : 'Curier'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoComplete="email"
          className="form-input"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parola"
          required
          autoComplete="new-password"
          className="form-input"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirma parola"
          required
          autoComplete="new-password"
          className="form-input"
        />

        <button
          type="submit"
          disabled={loading}
          className={'btn-primary w-full ' + (loading ? 'opacity-50 cursor-not-allowed' : '')}
        >
          {loading ? 'Se inregistreaza...' : 'Inregistreaza-te'}
        </button>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
      </form>

      <div className="mt-6 text-gray-400 text-sm">
        <p>
          Ai deja cont?{' '}
          <Link href={'/login?role=' + role} className="text-green-400 hover:underline">
            Autentifica-te
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<div className="auth-box"><p className="text-white">Se incarca...</p></div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
