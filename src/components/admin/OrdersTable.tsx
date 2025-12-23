'use client';

import { Order } from '@/types';
import { EyeIcon } from '@/components/icons/DashboardIcons';

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, status: string) => void;
  onViewDetails: (order: Order) => void;
}

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

  return (
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
          {orders.map((order) => {
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
      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Nu există comenzi.
        </div>
      )}
    </div>
  );
}
