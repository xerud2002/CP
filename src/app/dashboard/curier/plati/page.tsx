'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    <div className="min-h-screen p-6 page-transition">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard/curier" className="text-gray-400 hover:text-white transition-colors mb-2 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Înapoi la Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">💳 Plăți & Facturi</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="stat-value text-green-400">{soldDisponibil} €</div>
            <div className="stat-label">Sold disponibil</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-blue-400">{totalIncasari} €</div>
            <div className="stat-label">Total încasări</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-orange-400">{totalRetrageri} €</div>
            <div className="stat-label">Total retrageri</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-yellow-400">{facturiNeplatite} €</div>
            <div className="stat-label">Facturi neplătite</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="card mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Retrage fonduri</h2>
              <p className="text-gray-400 text-sm">Sold disponibil pentru retragere: <span className="text-green-400 font-medium">{soldDisponibil} €</span></p>
            </div>
            <button className="btn-secondary">
              Solicită retragere
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('plati')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'plati'
                ? 'bg-green-500 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            💰 Plăți
          </button>
          <button
            onClick={() => setActiveTab('facturi')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'facturi'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            📄 Facturi
          </button>
        </div>

        {/* Content */}
        {activeTab === 'plati' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Istoric Plăți</h2>
            
            {loadingData ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💸</div>
                <p className="text-gray-400">Nu ai nicio plată înregistrată.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div 
                    key={payment.id} 
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        payment.tip === 'incasare' ? 'bg-green-500/20' : 'bg-orange-500/20'
                      }`}>
                        <span className="text-2xl">{payment.tip === 'incasare' ? '📥' : '📤'}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{payment.descriere}</p>
                        <p className="text-gray-500 text-sm">{payment.data}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        payment.tip === 'incasare' ? 'text-green-400' : 'text-orange-400'
                      }`}>
                        {payment.tip === 'incasare' ? '+' : '-'}{payment.suma} €
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs ${paymentStatusLabels[payment.status].bg} ${paymentStatusLabels[payment.status].color}`}>
                        {paymentStatusLabels[payment.status].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'facturi' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Facturi Emise</h2>
            
            {loadingData ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-gray-400">Nu ai nicio factură.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Nr. Factură</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Data</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Suma</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                        <td className="py-4 px-4">
                          <span className="text-white font-medium">{invoice.numar}</span>
                        </td>
                        <td className="py-4 px-4 text-gray-400">{invoice.data}</td>
                        <td className="py-4 px-4">
                          <span className="text-green-400 font-medium">{invoice.suma} €</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${invoiceStatusLabels[invoice.status].bg} ${invoiceStatusLabels[invoice.status].color}`}>
                            {invoiceStatusLabels[invoice.status].label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-orange-400 hover:text-orange-300 transition-colors inline-flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Descarcă PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="card mt-6 bg-slate-800/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl">ℹ️</span>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Informații despre plăți</h3>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Retragerile sunt procesate în termen de 1-3 zile lucrătoare</li>
                <li>• Suma minimă pentru retragere este de 50 €</li>
                <li>• Facturile sunt generate automat la fiecare final de lună</li>
                <li>• Pentru întrebări contactează suportul la support@curierulperfect.ro</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
