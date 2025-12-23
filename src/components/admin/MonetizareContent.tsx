'use client';

import { useState } from 'react';
import {
  UsersIcon,
  PackageIcon,
  ChartIcon,
  MoneyIcon,
} from '@/components/icons/DashboardIcons';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { serviceTypes } from '@/lib/constants';
import { User, Order } from './types';

interface MonetizareContentProps {
  users: User[];
  orders: Order[];
}

export default function MonetizareContent({ users, orders }: MonetizareContentProps) {
  // Collapsible sections
  const [isLeadWorkflowOpen, setIsLeadWorkflowOpen] = useState(false);
  const [isCommissionOpen, setIsCommissionOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isPaymentMethodsOpen, setIsPaymentMethodsOpen] = useState(false);
  const [isRecentPurchasesOpen, setIsRecentPurchasesOpen] = useState(false);

  // Service-based commission rates (LEI per lead)
  const [serviceCommissions, setServiceCommissions] = useState<Record<string, number>>({
    colete: 20,
    plicuri: 15,
    persoane: 25,
    electronice: 20,
    animale: 30,
    platforma: 50,
    tractari: 40,
    mobila: 35,
    paleti: 30,
  });

  // Calculate revenue data
  const deliveredOrders = orders.filter(o => o.status === 'livrata');
  const totalLeads = deliveredOrders.length;
  
  // Calculate total revenue based on service commissions
  const calculateTotalRevenue = () => {
    return deliveredOrders.reduce((sum, order) => {
      const service = order.serviciu?.toLowerCase() || 'colete';
      const commission = serviceCommissions[service] || 20;
      return sum + commission;
    }, 0);
  };

  // Count orders by service
  const ordersByService = deliveredOrders.reduce((acc, order) => {
    const service = order.serviciu?.toLowerCase() || 'colete';
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = calculateTotalRevenue();
  const couriersCount = users.filter(u => u.role === 'curier').length;

  // Update commission for a service
  const updateCommission = (service: string, value: number) => {
    setServiceCommissions(prev => ({
      ...prev,
      [service]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl p-5 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <MoneyIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-emerald-400 text-xs font-medium px-2 py-1 bg-emerald-500/20 rounded-full">
              Lead-uri
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Venit Total din Lead-uri</p>
          <p className="text-3xl font-bold text-emerald-400">{totalRevenue} LEI</p>
          <p className="text-gray-500 text-xs mt-1">Din {totalLeads} lead-uri finalizate</p>
        </div>

        <div className="bg-linear-to-br from-orange-500/20 to-orange-600/10 rounded-xl p-5 border border-orange-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <PackageIcon className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Lead-uri</p>
          <p className="text-3xl font-bold text-orange-400">{totalLeads}</p>
          <p className="text-gray-500 text-xs mt-1">Comenzi finalizate (livrate)</p>
        </div>

        <div className="bg-linear-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-5 border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Curieri Activi</p>
          <p className="text-3xl font-bold text-purple-400">{couriersCount}</p>
          <p className="text-gray-500 text-xs mt-1">Care pot primi lead-uri</p>
        </div>

        <div className="bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-5 border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ChartIcon className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Medie Comision/Lead</p>
          <p className="text-3xl font-bold text-blue-400">
            {totalLeads > 0 ? Math.round(totalRevenue / totalLeads) : 0} LEI
          </p>
          <p className="text-gray-500 text-xs mt-1">Per comandă finalizată</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
        <button 
          onClick={() => setIsLeadWorkflowOpen(!isLeadWorkflowOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cum funcționează sistemul de lead-uri
          </h3>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isLeadWorkflowOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden transition-all duration-300 ${isLeadWorkflowOpen ? 'mt-4 max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-4 bg-slate-700/30 rounded-xl text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">1️⃣</span>
            </div>
            <h4 className="text-white font-medium mb-1">Client postează</h4>
            <p className="text-gray-400 text-xs">Clientul creează o comandă cu detalii de transport</p>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-xl text-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">2️⃣</span>
            </div>
            <h4 className="text-white font-medium mb-1">Curier vede comanda</h4>
            <p className="text-gray-400 text-xs">Curierul vede ruta și serviciul, dar NU datele de contact</p>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-xl text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">3️⃣</span>
            </div>
            <h4 className="text-white font-medium mb-1">Plătește lead-ul</h4>
            <p className="text-gray-400 text-xs">Curierul plătește prețul setat pentru a vedea detaliile</p>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-xl text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">4️⃣</span>
            </div>
            <h4 className="text-white font-medium mb-1">Contactează clientul</h4>
            <p className="text-gray-400 text-xs">Curierul primește telefon/email și poate contacta clientul</p>
          </div>
        </div>
      </div>

      {/* Service-Based Commission Settings */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
        <button 
          onClick={() => setIsCommissionOpen(!isCommissionOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Comision per Lead (pe serviciu)
          </h3>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isCommissionOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isCommissionOpen ? 'mt-4 max-h-500 opacity-100' : 'max-h-0 opacity-0'}`}>
          <p className="text-gray-400 text-sm mb-6">
            Setează prețul în LEI pe care curierul îl plătește pentru a vedea detaliile clientului pentru fiecare tip de serviciu.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceTypes.map((service) => {
            const serviceId = service.id;
            const count = ordersByService[serviceId] || 0;
            const revenue = count * serviceCommissions[serviceId];
            
            return (
              <div 
                key={serviceId} 
                className={`relative overflow-hidden rounded-2xl border ${service.borderColor} ${service.bgColor} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-${service.id === 'colete' ? 'blue' : service.id === 'plicuri' ? 'yellow' : service.id === 'persoane' ? 'pink' : service.id === 'electronice' ? 'purple' : service.id === 'animale' ? 'emerald' : service.id === 'platforma' ? 'red' : service.id === 'tractari' ? 'orange' : service.id === 'mobila' ? 'amber' : 'cyan'}-500/10`}
              >
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-linear-to-br ${service.gradient} opacity-5`} />
                
                <div className="relative">
                  {/* Header with icon and title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${service.bgColor} border ${service.borderColor} flex items-center justify-center`}>
                      <ServiceIcon service={serviceId} className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${service.color}`}>{service.name}</h4>
                      <p className="text-gray-500 text-xs">{count} lead-uri finalizate</p>
                    </div>
                  </div>

                  {/* Price input */}
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-gray-400 text-sm">Preț/Lead:</label>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={serviceCommissions[serviceId]}
                        onChange={(e) => updateCommission(serviceId, Number(e.target.value))}
                        className={`w-20 px-3 py-1.5 bg-slate-900/50 border ${service.borderColor} rounded-lg text-white text-center font-bold focus:outline-none focus:ring-2 focus:ring-${service.id === 'colete' ? 'blue' : service.id === 'plicuri' ? 'yellow' : service.id === 'persoane' ? 'pink' : service.id === 'electronice' ? 'purple' : service.id === 'animale' ? 'emerald' : service.id === 'platforma' ? 'red' : service.id === 'tractari' ? 'orange' : service.id === 'mobila' ? 'amber' : 'cyan'}-500/50 transition-all`}
                      />
                      <span className="text-gray-400 font-medium">LEI</span>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Venit generat:</span>
                      <span className="text-emerald-400 font-bold">{revenue} LEI</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-slate-900/50 rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-400 text-sm">Total venit estimat din lead-uri:</p>
              <p className="text-2xl font-bold text-emerald-400">{totalRevenue} LEI</p>
            </div>
            <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Salvează Prețurile
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* How subscription works */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-purple-500/20">
        <button 
          onClick={() => setIsSubscriptionOpen(!isSubscriptionOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Cum funcționează sistemul de abonament
            <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-normal">
              Alternativă
            </span>
          </h3>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isSubscriptionOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isSubscriptionOpen ? 'mt-4 max-h-500 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-purple-500/10 rounded-xl text-center border border-purple-500/20">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">1️⃣</span>
            </div>
            <h4 className="text-white font-medium mb-1">Alege planul</h4>
            <p className="text-gray-400 text-xs">Curierul selectează un abonament lunar sau anual</p>
          </div>

          <div className="p-4 bg-purple-500/10 rounded-xl text-center border border-purple-500/20">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">2️⃣</span>
            </div>
            <h4 className="text-white font-medium mb-1">Plătește abonamentul</h4>
            <p className="text-gray-400 text-xs">Plată unică lunară/anuală pentru acces nelimitat</p>
          </div>

          <div className="p-4 bg-purple-500/10 rounded-xl text-center border border-purple-500/20">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">3️⃣</span>
            </div>
            <h4 className="text-white font-medium mb-1">Acces complet</h4>
            <p className="text-gray-400 text-xs">Vede toate detaliile comenzilor fără costuri suplimentare</p>
          </div>

          <div className="p-4 bg-purple-500/10 rounded-xl text-center border border-purple-500/20">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">4️⃣</span>
            </div>
            <h4 className="text-white font-medium mb-1">Lead-uri nelimitate</h4>
            <p className="text-gray-400 text-xs">Contactează oricâți clienți dorește pe durata abonamentului</p>
          </div>
        </div>

        {/* Subscription comparison */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold">Basic</h4>
              <span className="px-2 py-0.5 bg-slate-500/20 text-gray-400 text-xs rounded-full">Gratuit</span>
            </div>
            <p className="text-2xl font-bold text-white mb-2">0 LEI<span className="text-sm font-normal text-gray-500">/lună</span></p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Vezi comenzile disponibile
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Plătești per lead
              </li>
            </ul>
          </div>

          <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/30 relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 bg-purple-500 text-white text-xs rounded-full font-medium">Popular</span>
            </div>
            <div className="flex items-center justify-between mb-3 mt-2">
              <h4 className="text-purple-400 font-semibold">Pro</h4>
              <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">Lunar</span>
            </div>
            <p className="text-2xl font-bold text-purple-400 mb-2">199 LEI<span className="text-sm font-normal text-gray-500">/lună</span></p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Lead-uri nelimitate
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Notificări prioritare
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Badge verificat
              </li>
            </ul>
          </div>

          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-amber-400 font-semibold">Business</h4>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">Anual</span>
            </div>
            <p className="text-2xl font-bold text-amber-400 mb-2">1499 LEI<span className="text-sm font-normal text-gray-500">/an</span></p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-300">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Totul din Pro
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Economisești 37%
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Suport prioritar
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
        <button 
          onClick={() => setIsPaymentMethodsOpen(!isPaymentMethodsOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Metode de Plată pentru Curieri
          </h3>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isPaymentMethodsOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isPaymentMethodsOpen ? 'mt-4 max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">S</span>
              </div>
              <div>
                <p className="text-white font-medium">Stripe</p>
                <p className="text-emerald-400 text-xs">Activ - Card Online</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">✓</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-900 flex items-center justify-center">
                <span className="text-lg font-bold text-white">P</span>
              </div>
              <div>
                <p className="text-white font-medium">PayPal</p>
                <p className="text-gray-500 text-xs">Opțional</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30 transition-all">
              Activează
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Credit Cont</p>
                <p className="text-gray-500 text-xs">Prepaid Balance</p>
              </div>
            </div>
            <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30 transition-all">
              Activează
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Recent Lead Purchases */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
        <button 
          onClick={() => setIsRecentPurchasesOpen(!isRecentPurchasesOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Ultimele Achiziții Lead-uri
          </h3>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isRecentPurchasesOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className={`overflow-hidden transition-all duration-300 ${isRecentPurchasesOpen ? 'mt-4 max-h-250 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Curier</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Serviciu</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Comandă</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Preț Lead</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Data</th>
              </tr>
            </thead>
            <tbody>
              {[
                { courier: 'marbetransport', service: 'colete', order: 'CP141142', amount: 20, status: 'paid', date: '22 Dec 2025' },
                { courier: 'faniness88', service: 'mobila', order: 'CP141140', amount: 35, status: 'paid', date: '22 Dec 2025' },
                { courier: 'bonusdesign', service: 'persoane', order: 'CP141139', amount: 25, status: 'pending', date: '21 Dec 2025' },
                { courier: 'marbetransport', service: 'animale', order: 'CP141138', amount: 30, status: 'paid', date: '21 Dec 2025' },
                { courier: 'ciprian.roto', service: 'tractari', order: 'CP141137', amount: 40, status: 'paid', date: '20 Dec 2025' },
              ].map((tx, idx) => {
                const serviceData = serviceTypes.find(s => s.id === tx.service);
                return (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
                        {tx.courier.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white text-sm">{tx.courier}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${serviceData?.bgColor || 'bg-slate-500/20'} ${serviceData?.color || 'text-gray-400'}`}>
                      <ServiceIcon service={tx.service} className="w-3.5 h-3.5" />
                      {serviceData?.label || tx.service}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm font-mono">{tx.order}</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-400 font-bold">{tx.amount} LEI</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {tx.status === 'paid' ? '✓ Plătit' : '⏳ În așteptare'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">{tx.date}</td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>

          <div className="mt-4 flex justify-center">
            <button className="px-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              Vezi toate tranzacțiile →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
