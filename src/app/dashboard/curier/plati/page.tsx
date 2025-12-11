'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, DownloadIcon, CreditCardIcon } from '@/components/icons/DashboardIcons';
// Firebase imports ready for production use
// import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
// import { db } from '@/lib/firebase';

interface Payment {
  id: string;
  tip: 'incasare' | 'retragere';
  suma: number;
  status: 'pending' | 'completat' | 'anulat';
  data: string;
  descriere: string;
}

interface Invoice {
  id: string;
  numar: string;
  data: string;
  suma: number;
  status: 'platita' | 'neplatita' | 'anulata';
  pdfUrl?: string;
}

const paymentStatusLabels = {
  pending: { label: 'În așteptare', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  completat: { label: 'Completat', color: 'text-green-400', bg: 'bg-green-500/20' },
  anulat: { label: 'Anulat', color: 'text-red-400', bg: 'bg-red-500/20' },
};

const invoiceStatusLabels = {
  platita: { label: 'Plătită', color: 'text-green-400', bg: 'bg-green-500/20' },
  neplatita: { label: 'Neplătită', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  anulata: { label: 'Anulată', color: 'text-red-400', bg: 'bg-red-500/20' },
};

// Empty initial state - will be loaded from Firebase
const initialPayments: Payment[] = [];
const initialInvoices: Invoice[] = [];

export default function PlatiFacturiPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [payments] = useState<Payment[]>(initialPayments);
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [loadingData] = useState(false);
  const [activeTab, setActiveTab] = useState<'plati' | 'facturi'>('plati');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Calculate totals
  const totalIncasari = payments
    .filter(p => p.tip === 'incasare' && p.status === 'completat')
    .reduce((sum, p) => sum + p.suma, 0);
  
  const totalRetrageri = payments
    .filter(p => p.tip === 'retragere' && p.status === 'completat')
    .reduce((sum, p) => sum + p.suma, 0);
  
  const soldDisponibil = totalIncasari - totalRetrageri;

  // const totalFacturi = invoices.reduce((sum, f) => sum + f.suma, 0);
   
  const facturiNeplatite = invoices
    .filter(f => f.status === 'neplatita')
    .reduce((sum, f) => sum + f.suma, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header - Same style as comenzi */}
      <div className="bg-slate-900/80 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/dashboard/curier" 
              className="p-2 sm:p-2.5 hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-linear-to-br from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/20">
                <CreditCardIcon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Plăți & Facturi</h1>
                <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Gestionează încasările și facturile</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        
        {/* Hero Balance Section */}
        <div className="relative mb-6 sm:mb-8">
          {/* Main Balance Card */}
          <div className="bg-linear-to-br from-slate-800 via-slate-800/95 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/8 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative">
              {/* Top Row - Balance + Action */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-0.5">Sold disponibil</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">{soldDisponibil}</span>
                      <span className="text-xl sm:text-2xl font-semibold text-emerald-400">€</span>
                    </div>
                  </div>
                </div>
                
                {/* Free Platform Badge */}
                <div className="flex flex-col items-center lg:items-end">
                  <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-emerald-500/20 to-green-500/10 rounded-lg sm:rounded-xl border border-emerald-500/30 flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-emerald-400 font-semibold text-xs sm:text-sm">Platformă Gratuită</p>
                      <p className="text-gray-400 text-[10px] sm:text-xs">0% comision pentru curieri</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </div>
                    <div className="hidden sm:block">
                      <div className="w-12 h-1 bg-blue-500/30 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-blue-400">{totalIncasari} €</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Total încasări</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 hover:border-orange-500/30 transition-all group">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    </div>
                    <div className="hidden sm:block">
                      <div className="w-12 h-1 bg-orange-500/30 rounded-full overflow-hidden">
                        <div className="w-2/3 h-full bg-orange-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-orange-400">{totalRetrageri} €</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Total retrageri</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 hover:border-yellow-500/30 transition-all group">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="hidden sm:block">
                      <div className="w-12 h-1 bg-yellow-500/30 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-yellow-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg sm:text-2xl font-bold text-yellow-400">{facturiNeplatite} €</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">De încasat</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs with counter badges */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab('plati')}
            className={`relative px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'plati'
                ? 'bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-800/80 text-gray-300 hover:bg-slate-700 border border-white/5'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Plăți
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
              activeTab === 'plati' ? 'bg-white/20' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {payments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('facturi')}
            className={`relative px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'facturi'
                ? 'bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30'
                : 'bg-slate-800/80 text-gray-300 hover:bg-slate-700 border border-white/5'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Facturi
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
              activeTab === 'facturi' ? 'bg-white/20' : 'bg-orange-500/20 text-orange-400'
            }`}>
              {invoices.length}
            </span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'plati' && (
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-linear-to-r from-emerald-500/10 to-green-500/5 p-3 sm:p-5 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">Istoric Plăți</h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs">{payments.length} tranzacții</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <span>Caută...</span>
                </div>
              </div>
            </div>
            
            {loadingData ? (
              <div className="flex justify-center py-16">
                <div className="spinner"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl bg-slate-800/80 flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <p className="text-gray-300 text-base sm:text-lg font-medium mb-1">Nu ai nicio plată</p>
                <p className="text-gray-500 text-xs sm:text-sm">Plățile vor apărea aici când finalizezi livrări.</p>
              </div>
            ) : (
              <div className="p-3 sm:p-4">
                <div className="space-y-2.5">
                  {payments.map((payment, index) => (
                    <div 
                      key={payment.id} 
                      className={`relative bg-slate-900/60 rounded-lg sm:rounded-xl p-3 sm:p-4 border transition-all hover:shadow-lg cursor-pointer group ${
                        payment.tip === 'incasare' 
                          ? 'border-green-500/10 hover:border-green-500/30 hover:shadow-green-500/5' 
                          : 'border-orange-500/10 hover:border-orange-500/30 hover:shadow-orange-500/5'
                      }`}
                    >
                      {/* Timeline connector */}
                      {index < payments.length - 1 && (
                        <div className="absolute left-6 sm:left-7 top-full w-0.5 h-2.5 bg-linear-to-b from-slate-700 to-transparent"></div>
                      )}
                      
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Icon with ring */}
                        <div className="relative">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                            payment.tip === 'incasare' 
                              ? 'bg-linear-to-br from-green-500/20 to-emerald-500/10' 
                              : 'bg-linear-to-br from-orange-500/20 to-amber-500/10'
                          }`}>
                            {payment.tip === 'incasare' ? (
                              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                              </svg>
                            )}
                          </div>
                          {/* Status dot */}
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                            payment.status === 'completat' ? 'bg-green-500' : 
                            payment.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                            <div className="min-w-0">
                              <p className="text-white font-semibold text-xs sm:text-sm truncate">{payment.descriere}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-gray-500 text-[10px] sm:text-xs">{payment.data}</span>
                                <span className="text-gray-600">•</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${paymentStatusLabels[payment.status].bg} ${paymentStatusLabels[payment.status].color}`}>
                                  {paymentStatusLabels[payment.status].label}
                                </span>
                              </div>
                            </div>
                            <p className={`text-lg sm:text-xl font-bold whitespace-nowrap ${
                              payment.tip === 'incasare' ? 'text-green-400' : 'text-orange-400'
                            }`}>
                              {payment.tip === 'incasare' ? '+' : '-'}{payment.suma} €
                            </p>
                          </div>
                        </div>
                        
                        {/* Arrow indicator */}
                        <div className="hidden sm:block text-gray-600 group-hover:text-gray-400 transition-colors">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Load more hint */}
                {payments.length >= 3 && (
                  <div className="mt-6 text-center">
                    <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      Încarcă mai multe
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'facturi' && (
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-linear-to-r from-orange-500/10 to-amber-500/5 p-3 sm:p-5 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">Facturi Emise</h2>
                    <p className="text-gray-400 text-[10px] sm:text-xs">{invoices.length} facturi</p>
                  </div>
                </div>
                <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg text-xs font-medium transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export toate
                </button>
              </div>
            </div>
            
            {loadingData ? (
              <div className="flex justify-center py-16">
                <div className="spinner"></div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-xl bg-slate-800/80 flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <p className="text-gray-300 text-base sm:text-lg font-medium mb-1">Nu ai nicio factură</p>
                <p className="text-gray-500 text-xs sm:text-sm">Facturile sunt generate automat lunar.</p>
              </div>
            ) : (
              <div className="p-3 sm:p-4">
                <div className="space-y-2.5">
                  {invoices.map((invoice) => (
                    <div 
                      key={invoice.id} 
                      className="relative bg-slate-900/60 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-500/10 hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/5 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Icon */}
                        <div className="relative">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-orange-500/20 to-amber-500/10 flex items-center justify-center transition-transform group-hover:scale-105">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          {/* Status dot */}
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                            invoice.status === 'platita' ? 'bg-green-500' : 
                            invoice.status === 'neplatita' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                            <div className="min-w-0">
                              <p className="text-white font-semibold text-xs sm:text-sm">{invoice.numar}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-gray-500 text-[10px] sm:text-xs">{invoice.data}</span>
                                <span className="text-gray-600">•</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${invoiceStatusLabels[invoice.status].bg} ${invoiceStatusLabels[invoice.status].color}`}>
                                  {invoiceStatusLabels[invoice.status].label}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <p className="text-lg sm:text-xl font-bold text-emerald-400 whitespace-nowrap">{invoice.suma} €</p>
                              <button className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg text-[10px] sm:text-xs font-medium transition-colors">
                                <DownloadIcon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Descarcă</span> PDF
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Info Footer */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Fără comisioane - <span className="text-emerald-400">100% câștiguri</span></span>
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Plăți directe de la <span className="text-blue-400">clienți</span></span>
            </span>
            <a href="mailto:support@curierulperfect.ro" className="flex items-center gap-1.5 text-blue-400/80 hover:text-blue-400 transition-colors">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span>support@curierulperfect.ro</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
