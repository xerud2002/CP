'use client';

import { User } from '@/types';
import { getDisplayName, formatUserDate } from './types';
import { EyeIcon, TrashIcon } from '@/components/icons/DashboardIcons';
import { useState, useMemo } from 'react';

interface UsersTableProps {
  users: User[];
  onRoleChange: (uid: string, role: string) => void;
  onDelete: (uid: string) => void;
  onViewDetails: (user: User) => void;
  filter: 'all' | 'client' | 'curier';
  statusFilter?: 'all' | 'online' | 'offline';
}

type SortColumn = 'role' | 'regDate' | 'status' | 'lastSeen' | null;
type SortDirection = 'asc' | 'desc';

export default function UsersTable({ users, onRoleChange, onDelete, onViewDetails, filter, statusFilter = 'all' }: UsersTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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
  }, [users, filter, statusFilter, sortColumn, sortDirection]);

  // Helper to check if user is online (active in last 5 minutes)
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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Utilizator</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Email</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
              <button 
                onClick={() => handleSort('role')}
                className="flex items-center gap-2 hover:text-white transition-colors group"
              >
                Rol
                {getSortIcon('role')}
              </button>
            </th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
              <button 
                onClick={() => handleSort('regDate')}
                className="flex items-center gap-2 hover:text-white transition-colors group"
              >
                Data înregistrării
                {getSortIcon('regDate')}
              </button>
            </th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
              <button 
                onClick={() => handleSort('status')}
                className="flex items-center gap-2 hover:text-white transition-colors group"
              >
                Status
                {getSortIcon('status')}
              </button>
            </th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">
              <button 
                onClick={() => handleSort('lastSeen')}
                className="flex items-center gap-2 hover:text-white transition-colors group"
              >
                Last Seen
                {getSortIcon('lastSeen')}
              </button>
            </th>
            <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedUsers.map((u) => {
            const displayName = getDisplayName(u);
            const phone = formatPhone(u.telefon);
            const regDate = formatUserDate(u.createdAt);
            const online = isUserOnline(u.lastSeen);
            const lastSeenText = formatLastSeen(u.lastSeen);
            
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
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      online ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      online ? 'text-emerald-400' : 'text-gray-500'
                    }`}>
                      {online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-gray-400 text-sm">{lastSeenText}</span>
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
      {filteredAndSortedUsers.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Nu există utilizatori în această categorie.
        </div>
      )}
    </div>
  );
}
