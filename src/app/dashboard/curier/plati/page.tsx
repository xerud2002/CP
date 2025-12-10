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
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                href="/dashboard/curier" 
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <CreditCardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">Plăți & Facturi</h1>
                  <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Gestionează încasările și facturile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-sm">💰</span>
              </div>
              <span className="text-gray-400 text-xs sm:text-sm">Sold disponibil</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-400">{soldDisponibil} €</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <span className="text-sm">📥</span>
              </div>
              <span className="text-gray-400 text-xs sm:text-sm">Total încasări</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-400">{totalIncasari} €</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <span className="text-sm">📤</span>
              </div>
              <span className="text-gray-400 text-xs sm:text-sm">Total retrageri</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-orange-400">{totalRetrageri} €</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <span className="text-sm">⏳</span>
              </div>
              <span className="text-gray-400 text-xs sm:text-sm">De încasat</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-yellow-400">{facturiNeplatite} €</p>
          </div>
        </div>

        {/* Withdraw Card */}
        <div className="bg-linear-to-br from-emerald-500/10 to-green-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="text-xl sm:text-2xl">💸</span>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-white">Retrage fonduri</h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Disponibil: <span className="text-emerald-400 font-medium">{soldDisponibil} €</span>
                </p>
              </div>
            </div>
            <button className="w-full sm:w-auto py-2.5 sm:py-3 px-4 sm:px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors text-sm sm:text-base">
              Solicită retragere
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('plati')}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'plati'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            💰 Plăți
          </button>
          <button
            onClick={() => setActiveTab('facturi')}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'facturi'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📄 Facturi
          </button>
        </div>

        {/* Content */}
        {activeTab === 'plati' && (
          <div className="bg-slate-800/30 rounded-xl sm:rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-white/5">
              <h2 className="text-base sm:text-lg font-semibold text-white">Istoric Plăți</h2>
            </div>
            
            {loadingData ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl">💳</span>
                </div>
                <p className="text-gray-400 text-sm sm:text-base">Nu ai nicio plată înregistrată.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {payments.map((payment) => (
                  <div 
                    key={payment.id} 
                    className="p-3 sm:p-4 hover:bg-white/5 transition-colors"
                  >
                    {/* Mobile Layout */}
                    <div className="sm:hidden">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            payment.tip === 'incasare' ? 'bg-green-500/20' : 'bg-orange-500/20'
                          }`}>
                            <span className="text-lg">{payment.tip === 'incasare' ? '📥' : '📤'}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm truncate">{payment.descriere}</p>
                            <p className="text-gray-500 text-xs">{payment.data}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pl-13">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${paymentStatusLabels[payment.status].bg} ${paymentStatusLabels[payment.status].color}`}>
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
                          <span className="text-2xl">{payment.tip === 'incasare' ? '📥' : '📤'}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{payment.descriere}</p>
                          <p className="text-gray-500 text-sm">{payment.data}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs ${paymentStatusLabels[payment.status].bg} ${paymentStatusLabels[payment.status].color}`}>
                          {paymentStatusLabels[payment.status].label}
                        </span>
                        <p className={`text-xl font-bold min-w-[80px] text-right ${
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
          <div className="bg-slate-800/30 rounded-xl sm:rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-white/5">
              <h2 className="text-base sm:text-lg font-semibold text-white">Facturi Emise</h2>
            </div>
            
            {loadingData ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl">📄</span>
                </div>
                <p className="text-gray-400 text-sm sm:text-base">Nu ai nicio factură.</p>
              </div>
            ) : (
              <>
                {/* Mobile Cards */}
                <div className="sm:hidden divide-y divide-white/5">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="p-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-white font-medium text-sm">{invoice.numar}</p>
                          <p className="text-gray-500 text-xs">{invoice.data}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${invoiceStatusLabels[invoice.status].bg} ${invoiceStatusLabels[invoice.status].color}`}>
                          {invoiceStatusLabels[invoice.status].label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-green-400 font-bold">{invoice.suma} €</p>
                        <button className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1 text-xs">
                          <DownloadIcon className="w-3.5 h-3.5" />
                          PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Nr. Factură</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Data</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Suma</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">Acțiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <span className="text-white font-medium">{invoice.numar}</span>
                          </td>
                          <td className="py-4 px-4 text-gray-400">{invoice.data}</td>
                          <td className="py-4 px-4">
                            <span className="text-green-400 font-medium">{invoice.suma} €</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${invoiceStatusLabels[invoice.status].bg} ${invoiceStatusLabels[invoice.status].color}`}>
                              {invoiceStatusLabels[invoice.status].label}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1 text-sm">
                              <DownloadIcon className="w-4 h-4" />
                              Descarcă PDF
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-500/20">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-xl sm:text-2xl">ℹ️</span>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">Informații despre plăți</h3>
              <ul className="text-gray-400 text-xs sm:text-sm space-y-1">
                <li>• Retragerile sunt procesate în 1-3 zile lucrătoare</li>
                <li>• Suma minimă pentru retragere: <span className="text-white">50 €</span></li>
                <li>• Facturile sunt generate automat lunar</li>
                <li className="hidden sm:block">• Pentru întrebări: <span className="text-blue-400">support@curierulperfect.ro</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
