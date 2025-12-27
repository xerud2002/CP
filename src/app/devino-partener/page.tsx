'use client';

import Link from 'next/link';

export default function DevinoPartenerPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-linear-to-b from-slate-800 via-slate-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-sm font-semibold mb-8 animate-pulse">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>100% GRATUIT pe perioadă nedeterminată - Fără Comisioane!</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Devino Curier <span className="text-gradient">Partner</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-4 leading-relaxed">
            Alătură-te platformei #1 de transport pentru români din Europa
          </p>
          <p className="text-lg text-gray-400 mb-10">
            🚀 Zero comisioane permanent • 📦 Comenzi nelimitate • ⚡ Contactezi clienții direct • ✅ Acces instant după verificare
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=curier" className="btn-primary px-10 py-4 text-lg inline-flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Înregistrează-te Acum</span>
            </Link>
            <Link href="/cum-functioneaza" className="btn-secondary px-10 py-4 text-lg inline-flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cum funcționează?</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">De ce să alegi Curierul Perfect?</h2>
            <p className="text-gray-400 text-lg">Avantaje reale pentru transportatori profesioniști</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ), 
                title: 'Zero Comisioane Permanent', 
                desc: 'Păstrezi 100% din banii câștigați. Negociezi direct cu clienții prin chat și stabilești propriile prețuri. Contactezi clienții fără intermediari.',
                color: 'green'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ), 
                title: 'Comenzi Nelimitate', 
                desc: 'Acces la toate comenzile disponibile pe rutele tale. Fără limite sau restricții.',
                color: 'blue'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ), 
                title: 'Acces Instant', 
                desc: 'După verificare, vezi imediat toate comenzile active și poți trimite oferte.',
                color: 'amber'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ), 
                title: 'Chat Direct cu Clienții', 
                desc: 'Comunicare în timp real cu clienții FĂRĂ intermediari. Contactezi direct clienții, răspunzi rapid la întrebări și clarifici detaliile comenzii. Acces gratuit permanent.',
                color: 'purple'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ), 
                title: '16 Țări Europa', 
                desc: 'Acoperim întreaga Europă - de la UK până în Grecia. Rute multiple, oportunități maxime.',
                color: 'cyan'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ), 
                title: 'Reputație Verificată', 
                desc: 'Construiește-ți reputația cu recenzii reale de la clienți mulțumiți. Mai multe comenzi.',
                color: 'orange'
              }
            ].map((benefit, idx) => (
              <div key={idx} className={`card p-6 hover:border-${benefit.color}-500/30 transition-all group`}>
                <div className={`w-14 h-14 rounded-xl bg-${benefit.color}-500/20 flex items-center justify-center mb-4 text-${benefit.color}-400 group-hover:scale-110 transition-transform`}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 bg-linear-to-b from-slate-800/50 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Cerințe pentru înregistrare</h2>
            <p className="text-gray-400 text-lg">Documentele necesare pentru verificare</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { 
                title: 'Carte de identitate / Pașaport', 
                desc: 'Document valid de identitate pentru verificare',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                )
              },
              { 
                title: 'Asigurare RCA valabilă', 
                desc: 'Pentru vehiculul folosit la transport',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              { 
                title: 'Certificat de înmatriculare', 
                desc: 'Pentru vehiculul de transport (auto/dubă)',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              { 
                title: 'Telefon & Email activ', 
                desc: 'Pentru comunicare rapidă cu clienții',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              }
            ].map((req, idx) => (
              <div key={idx} className="card p-6 flex items-start gap-4 hover:border-orange-500/30 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center shrink-0 text-orange-400 group-hover:scale-110 transition-transform">
                  {req.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1.5">{req.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 card p-6 bg-blue-500/5 border-blue-500/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">📋 Notă importantă</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Toate documentele sunt verificate de echipa noastră pentru a asigura siguranța clienților. 
                  Procesul durează 24-48 ore lucrătoare. Vei primi email de confirmare când contul e aprobat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works for couriers */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Cum funcționează?</h2>
            <p className="text-gray-400 text-lg">4 pași simpli până la prima comandă</p>
          </div>
          <div className="space-y-6">
            {[
              { 
                step: '1', 
                title: 'Te înregistrezi', 
                desc: 'Completezi formularul de înregistrare și încarci documentele necesare (CI, RCA, certificat înmatriculare). Procesul durează doar 5 minute.', 
                time: '5 min',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )
              },
              { 
                step: '2', 
                title: 'Verificăm documentele', 
                desc: 'Echipa noastră verifică identitatea și documentele vehiculului pentru siguranța platformei. Primești email de confirmare când ești aprobat.', 
                time: '24-48h',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                step: '3', 
                title: 'Acces instant la platformă', 
                desc: 'Contul e activat și poți vedea toate comenzile disponibile. Filtrezi după țară, serviciu și rută. Trimiți oferte clienților care te interesează.', 
                time: 'Instant',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              { 
                step: '4', 
                title: 'Primești și finalizezi comenzi', 
                desc: 'Clienții îți văd ofertele și te contactează prin chat. Negociezi detaliile, finalizezi transportul și primești plata direct. Construiești reputația cu recenzii.', 
                time: 'Continuu',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {idx < 3 && (
                  <div className="absolute left-9 top-20 w-0.5 h-12 bg-linear-to-b from-orange-500/50 to-transparent hidden sm:block" />
                )}
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="relative shrink-0">
                    <div className="w-18 h-18 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-orange-500/30">
                      {item.step}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-linear-to-br from-green-500/20 to-green-600/20 border-2 border-green-500/30 flex items-center justify-center text-green-400">
                      {item.icon}
                    </div>
                  </div>
                  <div className="flex-1 card p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <span className="inline-flex items-center gap-1.5 text-xs text-green-400 font-semibold px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 w-fit">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {item.time}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-linear-to-b from-slate-900 to-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Întrebări frecvente</h2>
            <p className="text-gray-400 text-lg">Răspunsuri rapide la cele mai comune întrebări</p>
          </div>
          <div className="space-y-4">
            {[
              { 
                q: 'Costă ceva să mă înregistrez?', 
                a: 'Nu, platforma este 100% gratuită pentru curieri pe perioadă nedeterminată. Nu percepem comisioane din comenzi, nu există taxe de înregistrare sau abonamente. Păstrezi toți banii câștigați și contactezi clienții direct.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                q: 'Cât durează verificarea?', 
                a: 'În general 24-48 ore lucrătoare după ce trimiți documentele complete. Primești email când contul e aprobat și poți începe să vezi comenzile.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                q: 'Pot lucra și pentru alte platforme?', 
                a: 'Da, nu există exclusivitate. Poți lucra în paralel pe orice alte platforme sau pentru clienții tăi direcți. Flexibilitate totală.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              { 
                q: 'Cum primesc plata?', 
                a: 'Negociezi direct cu clientul metoda de plată prin chat-ul platformei (cash la ridicare/livrare, transfer bancar, etc.). Contactezi clienții direct, fără intermediari. Platforma nu procesează plăți, deci nu există întârzieri sau comisioane.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              { 
                q: 'Ce servicii pot oferi?', 
                a: 'Colete, plicuri, mobilă, electronice, transport persoane, platformă auto, tractări, animale de companie și marfă perisabilă. Alegi serviciile care ți se potrivesc.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              },
              { 
                q: 'Trebuie să am firmă?', 
                a: 'Nu obligatoriu. Poți lucra ca persoană fizică autorizată (PFA) sau SRL, dar și fără firmă. Important e să ai documente valide pentru vehicul și asigurare RCA.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              }
            ].map((item, idx) => (
              <details key={idx} className="card group">
                <summary className="p-6 cursor-pointer flex justify-between items-center hover:bg-white/5 transition-colors rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-semibold text-white">{item.q}</span>
                  </div>
                  <svg className="w-5 h-5 text-orange-400 group-open:rotate-180 transition-transform shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 border-t border-white/5 pt-4">
                  <p className="text-gray-300 leading-relaxed ml-11">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/faq" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors">
              <span>Vezi toate întrebările frecvente</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ce spun curierii noștri</h2>
            <p className="text-gray-400 text-lg">Peste 500 de curieri activi au ales Curierul Perfect</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Andrei M.',
                role: 'Transportator colete',
                location: 'București → Germania',
                text: 'Fără comisioane înseamnă că păstrez toți banii. Am făcut deja 50+ de curse și clienții sunt mulțumiți. Cea mai bună platformă!',
                rating: 5.0,
                avatar: 'AM'
              },
              {
                name: 'Maria P.',
                role: 'Transport mobil ă',
                location: 'Cluj → Anglia',
                text: 'Comunicarea directă cu clienții e super. Nu mai sunt intermediari care îți iau comision. Recomand cu încredere!',
                rating: 4.9,
                avatar: 'MP'
              },
              {
                name: 'Ion V.',
                role: 'Platformă auto',
                location: 'România → Europa',
                text: 'Am găsit comenzi constante pe rutele mele. Verificarea a durat 2 zile și de atunci nu am stat fără comenzi.',
                rating: 4.8,
                avatar: 'IV'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="card p-6 hover:border-orange-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{testimonial.text}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-white">{testimonial.rating}</span>
                  </div>
                  <div className="text-gray-500">📍 {testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-linear-to-b from-slate-800/50 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold mb-6">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Înregistrare 100% gratuită - Fără comisioane!</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Gata să începi <span className="text-gradient">câștigurile</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-4">
            Alătură-te platformei de transport pentru europeni.
          </p>
          <p className="text-gray-400 mb-10">
            Înregistrare rapidă ⚡ Verificare în 24-48h 📋 Acces instant la comenzi 🚀
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=curier" className="btn-primary px-12 py-4 text-lg inline-flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Înregistrează-te Gratuit</span>
            </Link>
            <Link href="/contact" className="btn-secondary px-12 py-4 text-lg inline-flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Contactează-ne</span>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verificare sigură</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Date protejate</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Suport 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
