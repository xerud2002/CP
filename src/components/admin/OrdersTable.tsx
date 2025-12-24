'use client';

import { useState, useMemo } from 'react';
import { Order } from '@/types';
import { EyeIcon, SearchIcon } from '@/components/icons/DashboardIcons';

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: string) => void;
  onViewDetails: (order: Order) => void;
}

type OrderStatus = 'all' | 'noua' | 'in_lucru' | 'acceptata' | 'in_tranzit' | 'livrata' | 'anulata';

const statusColors: Record<string, string> = {
  noua: 'bg-blue-500/20 text-blue-400',
  in_lucru: 'bg-amber-500/20 text-amber-400',
  acceptata: 'bg-cyan-500/20 text-cyan-400',
  in_tranzit: 'bg-purple-500/20 text-purple-400',
  livrata: 'bg-emerald-500/20 text-emerald-400',
  anulata: 'bg-red-500/20 text-red-400',
};

const statusLabels: Record<string, string> = {
  noua: 'Nouă',
  in_lucru: 'În Lucru',
  acceptata: 'Acceptată',
  in_tranzit: 'În tranzit',
  livrata: 'Livrată',
  anulata: 'Anulată',
};

const serviceConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
  colete: { icon: '📦', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  plicuri: { icon: '✉️', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  persoane: { icon: '👥', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  animale: { icon: '🐾', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
  masini: { icon: '🚗', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  platforma: { icon: '🚛', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' },
  paleti: { icon: '📋', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  electronice: { icon: '📺', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20' },
  tractari: { icon: '🔧', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  mutari: { icon: '🏠', color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  mobila: { icon: '🛋️', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
};

export default function OrdersTable({ orders, onStatusChange, onViewDetails }: OrdersTableProps) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const formatOrderNumber = (orderNumber?: number) => {
    return orderNumber ? `CP${orderNumber}` : '-';
  };

  const getServiceConfig = (serviciu?: string) => {
    const key = serviciu?.toLowerCase() || '';
    return serviceConfig[key] || { icon: '📦', color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
  };

  const getClientName = (order: Order) => {
    if (order.nume) return order.nume;
    if (order.email) return order.email.split('@')[0];
    return 'Client necunoscut';
  };

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(order => {
        const orderNum = order.orderNumber ? `cp${order.orderNumber}` : '';
        const clientName = getClientName(order).toLowerCase();
        const email = (order.email || '').toLowerCase();
        const pickupCity = (order.oras_ridicare || '').toLowerCase();
        const deliveryCity = (order.oras_livrare || '').toLowerCase();
        const pickupCountry = (order.tara_ridicare || '').toLowerCase();
        const deliveryCountry = (order.tara_livrare || '').toLowerCase();
        
        return orderNum.includes(query) ||
               clientName.includes(query) ||
               email.includes(query) ||
               pickupCity.includes(query) ||
               deliveryCity.includes(query) ||
               pickupCountry.includes(query) ||
               deliveryCountry.includes(query);
      });
    }

    return result;
  }, [orders, statusFilter, searchQuery]);

  // Count orders by status for badges
  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      noua: orders.filter(o => o.status === 'noua').length,
      in_lucru: orders.filter(o => o.status === 'in_lucru').length,
      acceptata: orders.filter(o => o.status === 'acceptata').length,
      in_tranzit: orders.filter(o => o.status === 'in_tranzit').length,
      livrata: orders.filter(o => o.status === 'livrata').length,
      anulata: orders.filter(o => o.status === 'anulata').length,
    };
  }, [orders]);

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-col gap-4">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Toate ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter('noua')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'noua' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Noi ({statusCounts.noua})
          </button>
          <button
            onClick={() => setStatusFilter('in_lucru')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'in_lucru' ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            În Lucru ({statusCounts.in_lucru})
          </button>
          <button
            onClick={() => setStatusFilter('acceptata')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'acceptata' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Acceptate ({statusCounts.acceptata})
          </button>
          <button
            onClick={() => setStatusFilter('in_tranzit')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'in_tranzit' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            În Tranzit ({statusCounts.in_tranzit})
          </button>
          <button
            onClick={() => setStatusFilter('livrata')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'livrata' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Livrate ({statusCounts.livrata})
          </button>
          <button
            onClick={() => setStatusFilter('anulata')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'anulata' ? 'bg-red-500/20 text-red-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Anulate ({statusCounts.anulata})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Caută după comandă, client, email, oraș..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Comandă</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Client</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Serviciu</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Rută</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Data ridicare</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
            <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => {
            const serviceConf = getServiceConfig(order.serviciu);
            const clientName = getClientName(order);
            
            return (
              <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                      <span className="text-orange-400 text-xs font-bold">#</span>
                    </div>
                    <span className="text-white font-mono font-semibold">
                      {formatOrderNumber(order.orderNumber)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white font-semibold text-sm">
                      {clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{clientName}</p>
                      <p className="text-gray-500 text-xs">{order.email || '-'}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg ${serviceConf.bgColor} flex items-center justify-center text-sm`}>
                      {serviceConf.icon}
                    </span>
                    <span className={`capitalize font-medium ${serviceConf.color}`}>
                      {order.serviciu || '-'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-slate-700/50 text-white text-sm font-medium">
                      {order.tara_ridicare || '??'}
                    </span>
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="px-2 py-1 rounded bg-slate-700/50 text-white text-sm font-medium">
                      {order.tara_livrare || '??'}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {order.data_ridicare ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-300 text-sm">
                        {new Date(order.data_ridicare).toLocaleDateString('ro-RO', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm italic">Nesetat</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <select
                    value={order.status || 'noua'}
                    onChange={(e) => onStatusChange(order.id!, e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer transition-all ${statusColors[order.status || 'noua'] || 'bg-gray-500/20 text-gray-400'}`}
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="noua" className="bg-slate-800 text-white">{statusLabels.noua}</option>
                    <option value="in_lucru" className="bg-slate-800 text-white">{statusLabels.in_lucru}</option>
                    <option value="acceptata" className="bg-slate-800 text-white">{statusLabels.acceptata}</option>
                    <option value="in_tranzit" className="bg-slate-800 text-white">{statusLabels.in_tranzit}</option>
                    <option value="livrata" className="bg-slate-800 text-white">{statusLabels.livrata}</option>
                    <option value="anulata" className="bg-slate-800 text-white">{statusLabels.anulata}</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onViewDetails(order)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Vezi detalii"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          {orders.length === 0 
            ? 'Nu există comenzi.'
            : 'Nu s-au găsit comenzi pentru filtrele selectate.'}
        </div>
      )}
      </div>
    </div>
  );
}
