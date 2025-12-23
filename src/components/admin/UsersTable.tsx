'use client';

import { User } from '@/types';
import { getDisplayName, formatUserDate } from './types';
import { EyeIcon, TrashIcon } from '@/components/icons/DashboardIcons';

interface UsersTableProps {
  users: User[];
  onRoleChange: (uid: string, role: string) => void;
  onDelete: (uid: string) => void;
  onViewDetails: (user: User) => void;
  filter: 'all' | 'client' | 'curier';
}

export default function UsersTable({ users, onRoleChange, onDelete, onViewDetails, filter }: UsersTableProps) {
  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);

  // Helper to format phone
  const formatPhone = (phone?: string) => {
    if (!phone) return null;
    return phone;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Utilizator</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Email</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Rol</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Data înregistrării</th>
            <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => {
            const displayName = getDisplayName(u);
            const phone = formatPhone(u.telefon);
            const regDate = formatUserDate(u.createdAt);
            
            return (
              <tr key={u.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg ${
                      u.role === 'admin' ? 'bg-linear-to-br from-red-500 to-red-600 shadow-red-500/25' :
                      u.role === 'curier' ? 'bg-linear-to-br from-orange-400 to-orange-600 shadow-orange-500/25' :
                      'bg-linear-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/25'
                    }`}>
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{displayName}</p>
                      {phone ? (
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {phone}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm italic">Telefon nesetat</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-300">{u.email}</span>
                </td>
                <td className="py-4 px-4">
                  <select
                    value={u.role}
                    onChange={(e) => onRoleChange(u.uid, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer transition-all ${
                      u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                      u.role === 'curier' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    <option value="client">Client</option>
                    <option value="curier">Curier</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  {regDate ? (
                    <span className="text-gray-400 text-sm">{regDate}</span>
                  ) : (
                    <span className="text-gray-500 text-sm italic">Necunoscut</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onViewDetails(u)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Vezi detalii"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete(u.uid)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Șterge utilizator"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Nu există utilizatori în această categorie.
        </div>
      )}
    </div>
  );
}
