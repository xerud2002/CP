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

// Mock data for demo
const mockPayments: Payment[] = [
  {
    id: '1',
    tip: 'incasare',
    suma: 450,
    status: 'completat',
    data: '25.01.2025',
    descriere: 'Încasare pentru 5 colete livrate',
  },
  {
    id: '2',
    tip: 'retragere',
    suma: 300,
    status: 'completat',
    data: '20.01.2025',
    descriere: 'Transfer în cont bancar',
  },
  {
    id: '3',
    tip: 'incasare',
    suma: 180,
    status: 'pending',
    data: '28.01.2025',
    descriere: 'Încasare pentru 2 colete în tranzit',
  },
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    numar: 'FC-2025-001',
    data: '25.01.2025',
    suma: 450,
    status: 'platita',
    pdfUrl: '#',
  },
  {
    id: '2',
    numar: 'FC-2025-002',
    data: '20.01.2025',
    suma: 300,
    status: 'platita',
    pdfUrl: '#',
  },
  {
    id: '3',
    numar: 'FC-2025-003',
    data: '15.01.2025',
    suma: 225,
    status: 'neplatita',
    pdfUrl: '#',
  },
];

export default function PlatiFacturiPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [payments] = useState<Payment[]>(mockPayments);
  const [invoices] = useState<Invoice[]>(mockInvoices);
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
        {/* Stats Cards - Same style as comenzi */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-emerald-500/20 rounded-lg sm:rounded-xl">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-emerald-400">{soldDisponibil} €</p>
                <p className="text-xs text-gray-400">Sold disponibil</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-blue-500/20 rounded-lg sm:rounded-xl">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-blue-400">{totalIncasari} €</p>
                <p className="text-xs text-gray-400">Total încasări</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-orange-500/20 rounded-lg sm:rounded-xl">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-orange-400">{totalRetrageri} €</p>
                <p className="text-xs text-gray-400">Total retrageri</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-yellow-500/20 rounded-lg sm:rounded-xl">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-yellow-400">{facturiNeplatite} €</p>
                <p className="text-xs text-gray-400">De încasat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Withdraw CTA Card */}
        <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-linear-to-br from-emerald-500/20 to-green-500/20 rounded-xl sm:rounded-2xl">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white">Retrage fonduri</h2>
                <p className="text-gray-400 text-sm">
                  Disponibil: <span className="text-emerald-400 font-semibold">{soldDisponibil} €</span>
                </p>
              </div>
            </div>
            <button className="w-full sm:w-auto py-2.5 sm:py-3 px-5 sm:px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-[0.98]">
              💸 Solicită retragere
            </button>
          </div>
        </div>

        {/* Tabs - Same style as filters in comenzi */}
        <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('plati')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'plati'
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Plăți
            </button>
            <button
              onClick={() => setActiveTab('facturi')}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'facturi'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Facturi
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'plati' && (
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Istoric Plăți
            </h2>
            
            {loadingData ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-5xl sm:text-7xl mb-4">💳</div>
                <p className="text-gray-300 text-base sm:text-lg font-medium">Nu ai nicio plată</p>
                <p className="text-gray-500 text-sm mt-2">Plățile vor apărea aici când finalizezi livrări.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div 
                    key={payment.id} 
                    className="bg-slate-900/50 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-all"
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            payment.tip === 'incasare' ? 'bg-green-500/20' : 'bg-orange-500/20'
                          }`}>
                            {payment.tip === 'incasare' ? (
                              <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                              </svg>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm truncate">{payment.descriere}</p>
                            <p className="text-gray-500 text-xs">{payment.data}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pl-13">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentStatusLabels[payment.status].bg} ${paymentStatusLabels[payment.status].color}`}>
                          {paymentStatusLabels[payment.status].label}
                        </span>
                        <p className={`text-lg font-bold ${
                          payment.tip === 'incasare' ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {payment.tip === 'incasare' ? '+' : '-'}{payment.suma} €
                        </p>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          payment.tip === 'incasare' ? 'bg-green-500/20' : 'bg-orange-500/20'
                        }`}>
                          {payment.tip === 'incasare' ? (
                            <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{payment.descriere}</p>
                          <p className="text-gray-500 text-sm">{payment.data}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusLabels[payment.status].bg} ${paymentStatusLabels[payment.status].color}`}>
                          {paymentStatusLabels[payment.status].label}
                        </span>
                        <p className={`text-xl font-bold min-w-20 text-right ${
                          payment.tip === 'incasare' ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {payment.tip === 'incasare' ? '+' : '-'}{payment.suma} €
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'facturi' && (
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Facturi Emise
            </h2>
            
            {loadingData ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="text-5xl sm:text-7xl mb-4">📄</div>
                <p className="text-gray-300 text-base sm:text-lg font-medium">Nu ai nicio factură</p>
                <p className="text-gray-500 text-sm mt-2">Facturile sunt generate automat lunar.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice.id} 
                    className="bg-slate-900/50 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/10 transition-all"
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{invoice.numar}</p>
                            <p className="text-gray-500 text-xs">{invoice.data}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${invoiceStatusLabels[invoice.status].bg} ${invoiceStatusLabels[invoice.status].color}`}>
                          {invoiceStatusLabels[invoice.status].label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pl-13">
                        <p className="text-green-400 font-bold">{invoice.suma} €</p>
                        <button className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1.5 text-xs font-medium bg-orange-500/10 px-3 py-1.5 rounded-lg">
                          <DownloadIcon className="w-3.5 h-3.5" />
                          PDF
                        </button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium">{invoice.numar}</p>
                          <p className="text-gray-500 text-sm">{invoice.data}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <p className="text-green-400 font-bold text-lg">{invoice.suma} €</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoiceStatusLabels[invoice.status].bg} ${invoiceStatusLabels[invoice.status].color}`}>
                          {invoiceStatusLabels[invoice.status].label}
                        </span>
                        <button className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1.5 text-sm font-medium bg-orange-500/10 px-4 py-2 rounded-lg hover:bg-orange-500/20">
                          <DownloadIcon className="w-4 h-4" />
                          Descarcă PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info Box - Subtle */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500 py-2">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Retrageri: 1-3 zile lucrătoare
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Min. retragere: 50 €
          </span>
          <a href="mailto:support@curierulperfect.ro" className="flex items-center gap-1.5 text-blue-400/70 hover:text-blue-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            support@curierulperfect.ro
          </a>
        </div>
      </div>
    </div>
  );
}
