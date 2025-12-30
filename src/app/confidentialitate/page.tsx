'use client';

import Link from 'next/link';

export default function ConfidentialitatePage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Conform UK GDPR
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Politica de <span className="text-gradient">Confidențialitate</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Îți protejăm datele personale cu cele mai înalte standarde de securitate
          </p>
          <p className="text-gray-500 text-sm mt-4">Ultima actualizare: 30 Decembrie 2025</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">1. Introducere</h2>
                <p className="text-gray-300 leading-relaxed">
                  Curierul Perfect respectă confidențialitatea datelor tale personale și se angajează să le protejeze conform 
                  Regulamentului General privind Protecția Datelor (UK GDPR) și legislației din Regatul Unit aplicabile.
                </p>
              </div>
            </div>
          </div>

          {/* Data Collected */}
          <div className="card p-6 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">2. Date Colectate</h2>
            
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  2.1 Date furnizate direct de tine
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <span className="text-blue-400 font-medium">Cont:</span>
                    <span className="text-gray-300 ml-2">Nume, email, telefon, parolă</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <span className="text-blue-400 font-medium">Comenzi:</span>
                    <span className="text-gray-300 ml-2">Adrese, detalii colet</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <span className="text-blue-400 font-medium">Curieri:</span>
                    <span className="text-gray-300 ml-2">CI, RCA, certificat vehicul</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <span className="text-blue-400 font-medium">Comunicare:</span>
                    <span className="text-gray-300 ml-2">Mesaje, recenzii, suport</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  2.2 Date colectate automat
                </h3>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="px-3 py-1.5 rounded-full bg-slate-800/50 text-gray-300">IP & Browser</span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-800/50 text-gray-300">Dispozitiv & OS</span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-800/50 text-gray-300">
                    <Link href="/cookies" className="text-purple-400 hover:text-purple-300">Cookies</Link>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-800/50 text-gray-300">Google Analytics</span>
                  <span className="px-3 py-1.5 rounded-full bg-slate-800/50 text-gray-300">Loguri activitate</span>
                </div>
              </div>
            </div>
          </div>

          {/* How we use data */}
          <div className="card p-6 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">3. Cum Folosim Datele</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Furnizarea serviciilor platformei</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Comunicare între clienți și curieri</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Verificare identitate curieri</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Customer support</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Îmbunătățirea platformei</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Prevenirea fraudelor</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Notificări despre comenzi</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">Marketing (cu consimțământ)</span>
              </div>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">4. Partajarea Datelor</h2>
                <p className="text-orange-400 font-semibold text-sm">Nu vindem datele tale niciodată.</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { who: 'Cu curierii', what: 'Nume, telefon, adrese ridicare/livrare pentru comenzi' },
                { who: 'Cu clienții', what: 'Numele și contactul curierului pentru comenzile acceptate' },
                { who: 'Furnizori terți', what: 'Firebase (hosting), Google Analytics (statistici)' },
                { who: 'Autorități', what: 'Doar dacă legea o cere (investigații legale)' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5">
                  <span className="text-orange-400 font-semibold text-sm min-w-[100px]">{item.who}:</span>
                  <span className="text-gray-300 text-sm">{item.what}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="card p-6 sm:p-8 mb-6 bg-linear-to-br from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              5. Securitatea Datelor
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-emerald-500/10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="font-semibold text-white text-sm">SSL/TLS</p>
                <p className="text-gray-500 text-xs mt-1">Tot traficul HTTPS</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-emerald-500/10">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="font-semibold text-white text-sm">Firebase</p>
                <p className="text-gray-500 text-xs mt-1">Reguli stricte acces</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-emerald-500/10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <p className="font-semibold text-white text-sm">Parole</p>
                <p className="text-gray-500 text-xs mt-1">Criptare + hashing</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-emerald-500/10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <p className="font-semibold text-white text-sm">Backup</p>
                <p className="text-gray-500 text-xs mt-1">Copii automate</p>
              </div>
            </div>
          </div>

          {/* GDPR Rights */}
          <div className="card p-6 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">6. Drepturile Tale (UK GDPR)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Acces</p>
                  <p className="text-gray-400 text-xs mt-0.5">Solicită o copie a datelor tale</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Rectificare</p>
                  <p className="text-gray-400 text-xs mt-0.5">Corectează date incorecte</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Ștergere</p>
                  <p className="text-gray-400 text-xs mt-0.5">&quot;Dreptul de a fi uitat&quot;</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Restricționare</p>
                  <p className="text-gray-400 text-xs mt-0.5">Limitează procesarea</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Portabilitate</p>
                  <p className="text-gray-400 text-xs mt-0.5">Export date în format standard</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-4.5 h-4.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Opoziție</p>
                  <p className="text-gray-400 text-xs mt-0.5">Refuză marketing/prelucrări</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-300">
                  <strong className="text-orange-400">Cum îți exerciți drepturile:</strong> Trimite email la{' '}
                  <a href="mailto:contact@curierulperfect.com" className="text-orange-400 underline">contact@curierulperfect.com</a>{' '}
                  sau din setările contului. Răspundem în cel mai scurt timp posibil.
                </p>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="card p-6 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">7. Reținerea Datelor</h2>
            <div className="space-y-2">
              {[
                { type: 'Cont activ', duration: 'Până când îl ștergi', color: 'emerald' },
                { type: 'Comenzi', duration: '5 ani (obligație fiscală)', color: 'blue' },
                { type: 'Mesaje chat', duration: '2 ani după finalizare', color: 'purple' },
                { type: 'Loguri securitate', duration: '1 an', color: 'amber' },
                { type: 'După ștergere cont', duration: 'Anonimizare în 30 zile', color: 'red' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-white/5">
                  <span className="text-gray-300 text-sm">{item.type}</span>
                  <span className={`text-${item.color}-400 text-sm font-medium`}>{item.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cookies & Tracking */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">8. Cookies și Tracking</h2>
                <p className="text-gray-300 text-sm mb-4">
                  Folosim cookies pentru funcționare, analytics și îmbunătățiri.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">Esențiale (obligatorii)</span>
                  <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">Analytics (opțional)</span>
                  <span className="px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">Marketing (cu consimțământ)</span>
                </div>
                <Link href="/cookies" className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm mt-4 transition-colors">
                  Vezi Politica Cookies
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Minors */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">9. Minori</h2>
                <p className="text-gray-300 text-sm">
                  Platforma este destinată persoanelor cu vârstă <strong className="text-white">≥18 ani</strong>. Nu colectăm intenționat date de la minori. 
                  Dacă descoperi că un minor și-a creat cont, contactează-ne imediat.
                </p>
              </div>
            </div>
          </div>

          {/* International Transfers */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">10. Transferuri Internaționale</h2>
                <p className="text-gray-300 text-sm">
                  Datele sunt stocate pe servere <strong className="text-white">Firebase (Google Cloud Platform)</strong> în Europa (Belgium). 
                  Google respectă GDPR și folosește clauze contractuale standard pentru transferuri în afara SEE.
                </p>
              </div>
            </div>
          </div>

          {/* Policy Changes */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">11. Modificări Politică</h2>
                <p className="text-gray-300 text-sm">
                  Putem actualiza această politică periodic. Modificările majore vor fi anunțate prin email sau notificare pe platformă. 
                  Data ultimei actualizări este afișată în partea de sus.
                </p>
              </div>
            </div>
          </div>

          {/* Contact DPO */}
          <div className="card p-6 sm:p-8 bg-linear-to-br from-orange-500/5 to-amber-500/5 border-orange-500/20">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">12. Contact DPO</h2>
              <p className="text-gray-400 text-sm mb-4">Pentru întrebări despre date personale sau GDPR</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="mailto:contact@curierulperfect.com" className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@curierulperfect.com
                </a>
                <span className="hidden sm:block text-gray-600">•</span>
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  ICO (UK Authority)
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/gdpr" className="btn-primary px-6 py-3 text-center">
              Vezi Drepturile GDPR
            </Link>
            <Link href="/cookies" className="btn-secondary px-6 py-3 text-center">
              Politica Cookies
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
