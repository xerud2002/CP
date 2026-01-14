'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { showSuccess } from '@/lib/toast';

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false
  });

  const handleSave = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    showSuccess('Preferințele tale au fost salvate!');
  };

  useEffect(() => {
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Transparență totală
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Politica <span className="text-gradient">Cookies</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Află ce cookies folosim și cum îți poți gestiona preferințele
          </p>
          <p className="text-gray-500 text-sm mt-4">Ultima actualizare: 29 Decembrie 2025</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* What are cookies */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Ce sunt cookies?</h2>
                <p className="text-gray-300 leading-relaxed">
                  Cookies sunt fișiere text mici stocate pe dispozitivul tău când vizitezi un site web. 
                  Ele ne ajută să îți oferim o experiență personalizată, să te menținem autentificat și să îmbunătățim platforma pe baza statisticilor de utilizare.
                </p>
              </div>
            </div>
          </div>

          {/* Cookie Types */}
          <div className="card p-6 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Tipuri de cookies folosite</h2>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Essential */}
              <div className="p-4 sm:p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">Cookies Esențiale</h3>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400">Obligatorii</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Necesare pentru funcționarea de bază a platformei. Fără acestea nu te poți autentifica sau folosi serviciile.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        <span className="text-gray-500">Cookie:</span>
                        <span className="text-gray-300 ml-1">authToken, session</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        <span className="text-gray-500">Scop:</span>
                        <span className="text-gray-300 ml-1">Autentificare</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        <span className="text-gray-500">Expirare:</span>
                        <span className="text-gray-300 ml-1">7-30 zile</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics */}
              <div className="p-4 sm:p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">Cookies Analytics</h3>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400">Opționale</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Google Analytics 4 - ne ajută să înțelegem cum folosești platforma pentru a o îmbunătăți. Datele sunt anonimizate.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        <span className="text-gray-500">Cookie:</span>
                        <span className="text-gray-300 ml-1">_ga, _ga_*, _gid</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        <span className="text-gray-500">Furnizor:</span>
                        <span className="text-gray-300 ml-1">Google</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-800/50">
                        <span className="text-gray-500">Expirare:</span>
                        <span className="text-gray-300 ml-1">24h - 2 ani</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing */}
              <div className="p-4 sm:p-5 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">Cookies Marketing</h3>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-400">Opționale</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Pentru publicitate personalizată și remarketing. Momentan NU folosim cookies de marketing.
                    </p>
                    <div className="p-2 rounded-lg bg-slate-800/50 text-xs inline-block">
                      <span className="text-gray-500">Status:</span>
                      <span className="text-gray-300 ml-1">Inactive - nu colectăm date de marketing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cookie Settings Panel */}
          <div className="card p-6 sm:p-8 mb-6 bg-gradient-to-br from-orange-500/5 to-purple-500/5 border-orange-500/20">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Setări Cookies</h2>
              <p className="text-gray-400 text-sm">Alege ce cookies să permiti</p>
            </div>
            
            <div className="space-y-3">
              {/* Essential - Always on */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">Cookies Esențiale</h3>
                    <p className="text-xs text-gray-500">Necesare pentru funcționare</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-medium">Mereu active</span>
                </div>
              </div>

              {/* Analytics Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">Google Analytics</h3>
                    <p className="text-xs text-gray-500">Statistici anonime</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              {/* Marketing Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">Marketing</h3>
                    <p className="text-xs text-gray-500">Publicitate (inactive)</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="btn-primary w-full mt-6 py-3.5 text-base font-semibold"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Salvează preferințele
            </button>
          </div>

          {/* How to manage */}
          <div className="card p-6 sm:p-8 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Cum gestionezi cookies din browser?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-white">Chrome</span>
                </div>
                <p className="text-gray-400 text-sm">Setări → Confidențialitate → Cookie-uri și alte date</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-white">Firefox</span>
                </div>
                <p className="text-gray-400 text-sm">Opțiuni → Confidențialitate → Cookie-uri</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-white">Safari</span>
                </div>
                <p className="text-gray-400 text-sm">Preferințe → Confidențialitate → Cookie-uri</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    </svg>
                  </div>
                  <span className="font-semibold text-white">Edge</span>
                </div>
                <p className="text-gray-400 text-sm">Setări → Cookie-uri și permisiuni site</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-amber-300 text-sm">
                  <strong>Atenție:</strong> Blocarea cookies esențiale poate afecta funcționarea platformei (ex: nu te poți autentifica).
                </p>
              </div>
            </div>
          </div>

          {/* Google Analytics info */}
          <div className="card p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Google Analytics și confidențialitate</h2>
                <p className="text-gray-400 mb-4">
                  Folosim Google Analytics 4 (GA4) pentru a înțelege cum interacționezi cu platforma. Datele sunt anonimizate.
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-white">IP anonimizat:</strong> Nu vedem adresa ta IP completă</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-white">Fără date personale:</strong> GA4 nu primește nume, email sau telefon</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong className="text-white">Opt-out:</strong> Dezactivează din setări sau instalează{' '}
                      <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline">
                        GA Opt-out Add-on
                      </a>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="card p-6 sm:p-8 bg-orange-500/5 border-orange-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Contact</h2>
                <p className="text-gray-400 mb-3">Pentru întrebări despre cookies:</p>
                <a href="mailto:contact@curierulperfect.com" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                  contact@curierulperfect.com
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/confidentialitate" className="btn-primary px-6 py-3 text-center">
              Politica de Confidențialitate
            </Link>
            <Link href="/gdpr" className="btn-secondary px-6 py-3 text-center">
              Drepturile GDPR
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
