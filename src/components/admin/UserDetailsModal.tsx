'use client';

import { User } from '@/types';
import { getDisplayName, formatUserDate } from './types';

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  const displayName = getDisplayName(user);
  const regDate = formatUserDate(user.createdAt);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Detalii Utilizator</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ${
              user.role === 'admin' ? 'bg-linear-to-br from-red-500 to-red-600 shadow-red-500/25' :
              user.role === 'curier' ? 'bg-linear-to-br from-orange-400 to-orange-600 shadow-orange-500/25' :
              'bg-linear-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/25'
            }`}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{displayName}</h3>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                user.role === 'curier' ? 'bg-orange-500/20 text-orange-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {user.role === 'admin' ? 'Administrator' : user.role === 'curier' ? 'Curier' : 'Client'}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Nume */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Nume complet</p>
                  <p className="text-white font-medium">
                    {user.nume && user.prenume 
                      ? `${user.nume} ${user.prenume}` 
                      : user.nume || user.prenume || (user.role === 'curier' ? 'Curier' : user.role === 'admin' ? 'Administrator' : 'Client')}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Telefon */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Telefon</p>
                  {user.telefon ? (
                    <a href={`tel:${user.telefon}`} className="text-emerald-400 font-medium hover:underline">
                      {user.telefon}
                    </a>
                  ) : (
                    <p className="text-gray-500 italic">Nesetat</p>
                  )}
                </div>
              </div>
            </div>

            {/* UID */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">User ID</p>
                  <p className="text-white font-mono text-sm">{user.uid}</p>
                </div>
              </div>
            </div>

            {/* Data înregistrării */}
            <div className="bg-slate-700/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Data înregistrării</p>
                  <p className="text-white font-medium">{regDate || 'Necunoscută'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}
