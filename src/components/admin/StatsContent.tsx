'use client';

import { useState } from 'react';
import { User, Order } from '@/types';
import {
  UsersIcon,
  TruckIcon,
  PackageIcon,
  ChartIcon,
} from '@/components/icons/DashboardIcons';

interface StatsContentProps {
  users: User[];
  orders: Order[];
}

const serviceColors: Record<string, string> = {
  colete: 'bg-orange-500',
  paleti: 'bg-blue-500',
  persoane: 'bg-purple-500',
  masini: 'bg-emerald-500',
  animale: 'bg-pink-500',
  altele: 'bg-gray-500',
};

export default function StatsContent({ users, orders }: StatsContentProps) {
  // Collapsible sections state
  const [isStatusDistOpen, setIsStatusDistOpen] = useState(true);
  const [isServiceDistOpen, setIsServiceDistOpen] = useState(true);
  const [isTopCountriesOpen, setIsTopCountriesOpen] = useState(true);
  const [isPlatformHealthOpen, setIsPlatformHealthOpen] = useState(true);
  const [isRecentActivityOpen, setIsRecentActivityOpen] = useState(true);

  const clientsCount = users.filter(u => u.role === 'client').length;
  const couriersCount = users.filter(u => u.role === 'curier').length;
  const deliveredOrders = orders.filter(o => o.status === 'livrata').length;
  const pendingOrders = orders.filter(o => o.status === 'noua').length;
  const inProgressOrders = orders.filter(o => o.status === 'in_lucru').length;
  const cancelledOrders = orders.filter(o => o.status === 'anulata').length;
  
  // Calculate order distribution by service type
  const serviceDistribution = orders.reduce((acc, order) => {
    const service = order.serviciu?.toLowerCase() || 'altele';
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate orders by country
  const countryDistribution = orders.reduce((acc, order) => {
    const country = order.tara_ridicare || 'Necunoscut';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top 5 countries
  const topCountries = Object.entries(countryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Recent 7 days orders
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentOrders = orders.filter(o => (o.timestamp || 0) > sevenDaysAgo).length;
  
  // Average orders per day (last 30 days)
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const last30DaysOrders = orders.filter(o => (o.timestamp || 0) > thirtyDaysAgo).length;
  const avgOrdersPerDay = (last30DaysOrders / 30).toFixed(1);

  // Status distribution for chart
  const statusData = [
    { label: 'Noi', count: pendingOrders, color: 'bg-white/20', textColor: 'text-white' },
    { label: 'În Lucru', count: inProgressOrders, color: 'bg-amber-500', textColor: 'text-amber-400' },
    { label: 'Livrate', count: deliveredOrders, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
    { label: 'Anulate', count: cancelledOrders, color: 'bg-red-500', textColor: 'text-red-400' },
  ];

  const totalStatusOrders = statusData.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <UsersIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-gray-400 text-xs">Clienți</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{clientsCount}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <TruckIcon className="w-4 h-4 text-orange-400" />
            </div>
            <span className="text-gray-400 text-xs">Curieri</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{couriersCount}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <PackageIcon className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-gray-400 text-xs">Total Comenzi</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{orders.length}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <ChartIcon className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-gray-400 text-xs">Ultimele 7 zile</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{recentOrders}</div>
        </div>
        <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-xl p-4 border border-pink-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <ChartIcon className="w-4 h-4 text-pink-400" />
            </div>
            <span className="text-gray-400 text-xs">Media/zi (30d)</span>
          </div>
          <div className="text-2xl font-bold text-pink-400">{avgOrdersPerDay}</div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
          <button
            onClick={() => setIsStatusDistOpen(!isStatusDistOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <h4 className="text-white font-semibold flex items-center gap-2">
              <PackageIcon className="w-5 h-5 text-orange-400" />
              Distribuție Status Comenzi
            </h4>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isStatusDistOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${isStatusDistOpen ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Visual bar chart */}
          <div className="space-y-3 mb-4">
            {statusData.map((status) => (
              <div key={status.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className={status.textColor}>{status.label}</span>
                  <span className="text-gray-400">{status.count} ({totalStatusOrders > 0 ? Math.round((status.count / totalStatusOrders) * 100) : 0}%)</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${status.color} rounded-full transition-all duration-500`}
                    style={{ width: `${totalStatusOrders > 0 ? (status.count / totalStatusOrders) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Success Rate */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Rată succes</span>
              <span className="text-emerald-400 font-bold text-lg">
                {orders.length > 0 ? Math.round((deliveredOrders / orders.length) * 100) : 0}%
              </span>
            </div>
          </div>
          </div>
        </div>

        {/* Service Type Distribution */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
          <button
            onClick={() => setIsServiceDistOpen(!isServiceDistOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <h4 className="text-white font-semibold flex items-center gap-2">
              <TruckIcon className="w-5 h-5 text-blue-400" />
              Comenzi pe Tip Serviciu
            </h4>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isServiceDistOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${isServiceDistOpen ? 'mt-4 max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-3">
            {Object.entries(serviceDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([service, count]) => (
                <div key={service} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${serviceColors[service] || 'bg-gray-500'}`} />
                  <span className="text-gray-300 capitalize flex-1">{service}</span>
                  <span className="text-white font-medium">{count}</span>
                  <span className="text-gray-500 text-sm w-12 text-right">
                    {orders.length > 0 ? Math.round((count / orders.length) * 100) : 0}%
                  </span>
                </div>
              ))}
          </div>

          {Object.keys(serviceDistribution).length === 0 && (
            <p className="text-gray-500 text-center py-4">Nu există date</p>
          )}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
          <button
            onClick={() => setIsTopCountriesOpen(!isTopCountriesOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <h4 className="text-white font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Top 5 Țări (Ridicare)
            </h4>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isTopCountriesOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${isTopCountriesOpen ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-3">
            {topCountries.map(([country, count], idx) => (
              <div key={country} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                  idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                  idx === 2 ? 'bg-amber-600/20 text-amber-500' :
                  'bg-slate-600/20 text-gray-400'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-gray-300 flex-1">{country}</span>
                <span className="text-white font-medium">{count}</span>
              </div>
            ))}
          </div>

          {topCountries.length === 0 && (
            <p className="text-gray-500 text-center py-4">Nu există date</p>
          )}
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
          <button
            onClick={() => setIsPlatformHealthOpen(!isPlatformHealthOpen)}
            className="w-full flex items-center justify-between text-left"
          >
            <h4 className="text-white font-semibold flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Sănătate Platformă
            </h4>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isPlatformHealthOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${isPlatformHealthOpen ? 'mt-4 max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-4">
            {/* User Activity */}
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Utilizatori Activi</p>
                  <p className="text-gray-400 text-xs">Total înregistrați</p>
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-xl">{users.length}</span>
            </div>

            {/* Courier Ratio */}
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <TruckIcon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Raport Curier/Client</p>
                  <p className="text-gray-400 text-xs">Curieri per 10 clienți</p>
                </div>
              </div>
              <span className="text-orange-400 font-bold text-xl">
                {clientsCount > 0 ? ((couriersCount / clientsCount) * 10).toFixed(1) : '0'}
              </span>
            </div>

            {/* Order Completion */}
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <PackageIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Comenzi Finalizate</p>
                  <p className="text-gray-400 text-xs">Livrate cu succes</p>
                </div>
              </div>
              <span className="text-blue-400 font-bold text-xl">{deliveredOrders}</span>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline - Recent Orders */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
        <button
          onClick={() => setIsRecentActivityOpen(!isRecentActivityOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h4 className="text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Activitate Recentă (Ultimele 5 comenzi)
          </h4>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isRecentActivityOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ${isRecentActivityOpen ? 'mt-4 max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order, idx) => (
            <div key={order.id || idx} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className={`w-2 h-2 rounded-full ${
                order.status === 'livrata' ? 'bg-emerald-500' :
                order.status === 'anulata' ? 'bg-red-500' :
                order.status === 'in_lucru' ? 'bg-amber-500' :
                'bg-white/50'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {order.orderNumber ? `CP${order.orderNumber}` : 'Fără număr'}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 text-sm capitalize">{order.serviciu || '-'}</span>
                </div>
                <p className="text-gray-500 text-xs truncate">
                  {order.tara_ridicare} → {order.tara_livrare}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                order.status === 'livrata' ? 'bg-emerald-500/20 text-emerald-400' :
                order.status === 'anulata' ? 'bg-red-500/20 text-red-400' :
                order.status === 'in_lucru' ? 'bg-amber-500/20 text-amber-400' :
                'bg-white/10 text-gray-300'
              }`}>
                {order.status === 'livrata' ? 'Livrată' :
                 order.status === 'anulata' ? 'Anulată' :
                 order.status === 'in_lucru' ? 'În Lucru' :
                 order.status === 'noua' ? 'Nouă' :
                 order.status || 'Nouă'}
              </span>
            </div>
          ))}
          
          {orders.length === 0 && (
            <p className="text-gray-500 text-center py-4">Nu există comenzi recente</p>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
