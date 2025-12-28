'use client';

import { User } from '@/types';
import { getDisplayName, formatUserDate } from './types';
import { SmallMessageButton, SmallViewButton, SmallDeleteButton } from '@/components/ui/ActionButtons';
import { useState, useMemo } from 'react';

interface UsersTableProps {
  users: User[];
  onRoleChange: (uid: string, role: string) => void;
  onDelete: (uid: string) => void;
  onViewDetails: (user: User) => void;
  onSendMessage: (user: User) => void;
  onToggleVerification: (uid: string, currentStatus: boolean | undefined) => void;
  filter: 'all' | 'client' | 'curier';
  statusFilter?: 'all' | 'online' | 'offline';
  verificationFilter?: 'all' | 'verified' | 'unverified';
}

type SortColumn = 'role' | 'regDate' | 'status' | 'lastSeen' | null;
type SortDirection = 'asc' | 'desc';

export default function UsersTable({ users, onRoleChange, onDelete, onViewDetails, onSendMessage, onToggleVerification, filter, statusFilter = 'all', verificationFilter = 'all' }: UsersTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Helper to check if user is online (active in last 5 minutes)
  // MUST be defined before useMemo that uses it
  const isUserOnline = (lastSeen?: Date | { seconds: number }) => {
    if (!lastSeen) return false;
    let lastSeenDate: Date;
    if (typeof lastSeen === 'object' && 'seconds' in lastSeen) {
      lastSeenDate = new Date(lastSeen.seconds * 1000);
    } else {
      lastSeenDate = lastSeen as Date;
    }
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return lastSeenDate.getTime() > fiveMinutesAgo;
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    // First filter by role
    let filtered = filter === 'all' 
      ? users 
      : users.filter(u => u.role === filter);

    // Then filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => {
        const online = isUserOnline(u.lastSeen);
        return statusFilter === 'online' ? online : !online;
      });
    }

    // Filter by verification status (only for couriers)
    if (verificationFilter !== 'all' && filter === 'curier') {
      filtered = filtered.filter(u => {
        if (verificationFilter === 'verified') {
          return u.verified === true;
        } else {
          return !u.verified;
        }
      });
    }

    // If no sorting, return filtered
    if (!sortColumn) return filtered;

    // Apply sorting
    return [...filtered].sort((a, b) => {
      let compareResult = 0;

      switch (sortColumn) {
        case 'role': {
          const roleOrder = { admin: 0, curier: 1, client: 2 };
          compareResult = (roleOrder[a.role] || 999) - (roleOrder[b.role] || 999);
          break;
        }
        case 'regDate': {
          const aDate = a.createdAt ? (typeof a.createdAt === 'object' && 'seconds' in a.createdAt ? a.createdAt.seconds : new Date(a.createdAt).getTime()) : 0;
          const bDate = b.createdAt ? (typeof b.createdAt === 'object' && 'seconds' in b.createdAt ? b.createdAt.seconds : new Date(b.createdAt).getTime()) : 0;
          compareResult = (aDate as number) - (bDate as number);
          break;
        }
        case 'status': {
          const isOnlineA = isUserOnline(a.lastSeen);
          const isOnlineB = isUserOnline(b.lastSeen);
          compareResult = (isOnlineB ? 1 : 0) - (isOnlineA ? 1 : 0);
          break;
        }
        case 'lastSeen': {
          const getLastSeenTimestamp = (lastSeen?: Date | { seconds: number }) => {
            if (!lastSeen) return 0;
            if (typeof lastSeen === 'object' && 'seconds' in lastSeen) {
              return lastSeen.seconds * 1000;
            }
            return new Date(lastSeen).getTime();
          };
          compareResult = getLastSeenTimestamp(b.lastSeen) - getLastSeenTimestamp(a.lastSeen);
          break;
        }
      }

      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  }, [users, filter, statusFilter, verificationFilter, sortColumn, sortDirection]);

  // Helper to format phone
  const formatPhone = (phone?: string) => {
    if (!phone) return null;
    return phone;
  };

  // Helper to format last seen
  const formatLastSeen = (lastSeen?: Date | { seconds: number }) => {
    if (!lastSeen) return 'Niciodată';
    let lastSeenDate: Date;
    if (typeof lastSeen === 'object' && 'seconds' in lastSeen) {
      lastSeenDate = new Date(lastSeen.seconds * 1000);
    } else {
      lastSeenDate = lastSeen as Date;
    }
    
    const now = Date.now();
    const diff = now - lastSeenDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Acum';
    if (minutes < 60) return `${minutes} min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return lastSeenDate.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' });
  };

  // Helper to get sort indicator
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    if (sortDirection === 'asc') {
      return (
        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full min-w-200">
        <thead>
          <tr className="border-b border-white/10 bg-slate-900/30">
            <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Utilizator</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Email</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">
              <button 
                onClick={() => handleSort('role')}
                className="flex items-center gap-1.5 hover:text-white transition-colors group"
              >
                Rol
                {getSortIcon('role')}
              </button>
            </th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">
              <button 
                onClick={() => handleSort('regDate')}
                className="flex items-center gap-1.5 hover:text-white transition-colors group"
              >
                Înregistrat
                {getSortIcon('regDate')}
              </button>
            </th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">
              <button 
                onClick={() => handleSort('status')}
                className="flex items-center gap-1.5 hover:text-white transition-colors group"
              >
                Status
                {getSortIcon('status')}
              </button>
            </th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">
              <button 
                onClick={() => handleSort('lastSeen')}
                className="flex items-center gap-1.5 hover:text-white transition-colors group"
              >
                Ultima activitate
                {getSortIcon('lastSeen')}
              </button>
            </th>
            {filter === 'curier' && (
              <th className="text-left py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Verificare</th>
            )}
            <th className="text-right py-3 px-4 text-gray-400 font-medium text-xs uppercase tracking-wide">Acțiuni</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {filteredAndSortedUsers.map((u) => {
            const displayName = getDisplayName(u);
            const phone = formatPhone(u.telefon);
            const regDate = formatUserDate(u.createdAt);
            const online = isUserOnline(u.lastSeen);
            const lastSeenText = formatLastSeen(u.lastSeen);
            
            return (
              <tr key={u.uid} className="hover:bg-white/2 transition-colors group">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg relative ${
                      u.role === 'admin' ? 'bg-linear-to-br from-red-500 to-red-600 shadow-red-500/25' :
                      u.role === 'curier' ? 'bg-linear-to-br from-orange-400 to-orange-600 shadow-orange-500/25' :
                      'bg-linear-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/25'
                    }`}>
                      {displayName.charAt(0).toUpperCase()}
                      {/* Online indicator on avatar */}
                      {online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{displayName}</p>
                      {phone ? (
                        <p className="text-gray-500 text-xs flex items-center gap-1">
                          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="truncate">{phone}</span>
                        </p>
                      ) : (
                        <p className="text-gray-600 text-xs italic">Telefon nesetat</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-300 text-sm">{u.email}</span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={u.role}
                    onChange={(e) => onRoleChange(u.uid, e.target.value)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer transition-all ${
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
                <td className="py-3 px-4">
                  {regDate ? (
                    <span className="text-gray-400 text-sm">{regDate}</span>
                  ) : (
                    <span className="text-gray-600 text-sm">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      online ? 'bg-emerald-500' : 'bg-gray-600'
                    }`} />
                    <span className={`text-xs font-medium ${
                      online ? 'text-emerald-400' : 'text-gray-500'
                    }`}>
                      {online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-500 text-sm">{lastSeenText}</span>
                </td>
                {filter === 'curier' && (
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleVerification(u.uid, u.verified)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                        u.verified 
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
                      }`}
                      title={u.verified ? 'Anulează verificarea' : 'Marcă ca verificat'}
                    >
                      {u.verified ? (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verificat
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Neverificat
                        </>
                      )}
                    </button>
                  </td>
                )}
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    <SmallMessageButton
                      onClick={() => onSendMessage(u)}
                      title="Trimite mesaj"
                    />
                    <SmallViewButton
                      onClick={() => onViewDetails(u)}
                      title="Vezi detalii"
                    />
                    <SmallDeleteButton
                      onClick={() => onDelete(u.uid)}
                      title="Șterge utilizator"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredAndSortedUsers.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p>Nu există utilizatori în această categorie.</p>
        </div>
      )}
    </div>
  );
}
