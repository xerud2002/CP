'use client';

import Link from 'next/link';

export default function DevinoPartenerPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 bg-linear-to-b from-slate-800 via-slate-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 animate-pulse">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-center">100% GRATUIT - Fără Comisioane!</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            <span className="bg-linear-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">Devino Curier</span> <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent animate-gradient-x bg-size-[200%_auto] drop-shadow-[0_0_30px_rgba(52,211,153,0.5)]">Partner</span>
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-gray-300 mb-3 sm:mb-4 leading-relaxed max-w-2xl mx-auto">
            Alătură-te platformei #1 de transport pentru români din Europa
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
            🚀 Zero comisioane • 📦 Comenzi nelimitate • ⚡ Contact direct • ✅ Acces instant
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/register?role=curier" className="relative group/btn inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg min-h-12 rounded-xl font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95">
              {/* Gradient emerald background */}
              <div className="absolute inset-0 bg-linear-to-r from-emerald-500 via-teal-500 to-green-500 transition-transform group-hover/btn:scale-110"></div>
              {/* Shine effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 via-teal-500 to-green-500 rounded-xl blur-lg opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
              {/* Content */}
              <svg className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="relative z-10 text-white">Înregistrează-te Acum</span>
            </Link>
            <Link href="/cum-functioneaza" className="btn-secondary px-6 sm:px-10 py-3 sm:py-4 text-sm sm:text-lg inline-flex items-center justify-center gap-2 sm:gap-3 min-h-12">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cum funcționează?</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">De ce să alegi Curierul Perfect?</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-400">Avantaje reale pentru transportatori profesioniști</p>
          </div>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { 
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" className="fill-green-500/30"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="3" className="fill-green-400"/>
                  </svg>
                ), 
                title: 'Zero Comisioane Permanent', 
                desc: 'Păstrezi 100% din banii câștigați. Negociezi direct cu clienții prin chat și stabilești propriile prețuri. Contactezi clienții fără intermediari.',
                color: 'green'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="3" className="fill-blue-500/30"/>
                    <path d="M7 8h4m-4 4h10m-10 4h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="18" cy="8" r="2" className="fill-blue-400"/>
                    <path d="M16 18l2-2 2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ), 
                title: 'Comenzi Nelimitate', 
                desc: 'Acces la toate comenzile disponibile pe rutele tale. Fără limite sau restricții.',
                color: 'blue'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" className="fill-amber-500/30"/>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="11" r="2" className="fill-amber-400"/>
                  </svg>
                ), 
                title: 'Acces Instant', 
                desc: 'După verificare, vezi imediat toate comenzile active și poți trimite oferte.',
                color: 'amber'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="3" className="fill-purple-500/30"/>
                    <path d="M8 10h.01M12 10h.01M16 10h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M8 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="19" cy="5" r="3" className="fill-purple-400"/>
                  </svg>
                ), 
                title: 'Chat Direct cu Clienții', 
                desc: 'Comunicare în timp real cu clienții FĂRĂ intermediari. Contactezi direct clienții, răspunzi rapid la întrebări și clarifici detaliile comenzii. Acces gratuit permanent.',
                color: 'purple'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" className="fill-cyan-500/30"/>
                    <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5"/>
                    <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 12 12)"/>
                    <ellipse cx="12" cy="12" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 12 12)"/>
                    <circle cx="12" cy="12" r="3" className="fill-cyan-400"/>
                  </svg>
                ), 
                title: '20 Țări Europa', 
                desc: 'Acoperim întreaga Europă - de la UK până în Grecia și Moldova. Rute multiple, oportunități maxime.',
                color: 'cyan'
              },
              { 
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" className="fill-orange-500/30"/>
                    <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" className="fill-orange-400"/>
                  </svg>
                ), 
                title: 'Reputație Verificată', 
                desc: 'Construiește-ți reputația cu recenzii reale de la clienți mulțumiți. Mai multe comenzi.',
                color: 'orange'
              }
            ].map((benefit, idx) => (
              <div key={idx} className={`card p-4 sm:p-6 hover:border-${benefit.color}-500/30 transition-all group`}>
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-${benefit.color}-500/20 flex items-center justify-center mb-3 sm:mb-4 text-${benefit.color}-400 group-hover:scale-110 transition-transform`}>
                  {benefit.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-10 sm:py-16 px-4 bg-linear-to-b from-slate-800/50 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Cerințe pentru înregistrare</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-400">Documentele necesare pentru verificare</p>
          </div>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4">
            {[
              { 
                title: 'Carte de identitate / Pașaport', 
                desc: 'Document valid de identitate pentru verificare',
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" className="fill-orange-500/20"/>
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="9" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M14 10h4M14 14h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )
              },
              { 
                title: 'Asigurare RCA valabilă', 
                desc: 'Pentru vehiculul folosit la transport',
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 6v6c0 5.5 3.4 10.3 8 12 4.6-1.7 8-6.5 8-12V6l-8-4z" className="fill-orange-500/20"/>
                    <path d="M12 2L4 6v6c0 5.5 3.4 10.3 8 12 4.6-1.7 8-6.5 8-12V6l-8-4z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              { 
                title: 'Certificat de înmatriculare', 
                desc: 'Pentru vehiculul de transport (auto/dubă)',
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" className="fill-orange-500/20"/>
                    <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 8h10M7 12h6M7 16h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="17" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                )
              },
              { 
                title: 'Telefon & Email activ', 
                desc: 'Pentru comunicare rapidă cu clienții',
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="2" width="16" height="20" rx="3" className="fill-orange-500/20"/>
                    <rect x="4" y="2" width="16" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                    <path d="M9 6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )
              }
            ].map((req, idx) => (
              <div key={idx} className="card p-4 sm:p-6 flex items-start gap-3 sm:gap-4 hover:border-orange-500/30 transition-colors group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center shrink-0 text-orange-400 group-hover:scale-110 transition-transform">
                  {req.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-1 sm:mb-1.5">{req.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 sm:mt-8 card p-4 sm:p-6 bg-blue-500/5 border-blue-500/20">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm sm:text-base mb-1.5 sm:mb-2">📋 Notă importantă</h4>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
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
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-6-6z" className="fill-green-500/30"/>
                    <path d="M15 3v6h6M9 13h6m-6 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )
              },
              { 
                step: '2', 
                title: 'Verificăm documentele', 
                desc: 'Echipa noastră verifică identitatea și documentele vehiculului pentru siguranța platformei. Primești email de confirmare când ești aprobat.', 
                time: '24-48h',
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" className="fill-green-500/30"/>
                    <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              { 
                step: '3', 
                title: 'Acces instant la platformă', 
                desc: 'Contul e activat și poți vedea toate comenzile disponibile. Filtrezi după țară, serviciu și rută. Trimiți oferte clienților care te interesează.', 
                time: 'Instant',
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" className="fill-green-500/30"/>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              { 
                step: '4', 
                title: 'Primești și finalizezi comenzi', 
                desc: 'Clienții îți văd ofertele și te contactează prin chat. Negociezi detaliile, finalizezi transportul și primești plata direct. Construiești reputația cu recenzii.', 
                time: 'Continuu',
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" className="fill-green-500/30"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor"/>
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
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" className="fill-orange-500/30"/>
                    <path d="M12 8v3m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )
              },
              { 
                q: 'Cât durează verificarea?', 
                a: 'În general 24-48 ore lucrătoare după ce trimiți documentele complete. Primești email când contul e aprobat și poți începe să vezi comenzile.',
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" className="fill-orange-500/30"/>
                    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )
              },
              { 
                q: 'Pot lucra și pentru alte platforme?', 
                a: 'Da, nu există exclusivitate. Poți lucra în paralel pe orice alte platforme sau pentru clienții tăi direcți. Flexibilitate totală.',
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 6v6c0 5.5 3.4 10.3 8 12 4.6-1.7 8-6.5 8-12V6l-8-4z" className="fill-orange-500/30"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )
              },
              { 
                q: 'Cum primesc plata?', 
                a: 'Negociezi direct cu clientul metoda de plată prin chat-ul platformei (cash la ridicare/livrare, transfer bancar, etc.). Contactezi clienții direct, fără intermediari. Platforma nu procesează plăți, deci nu există întârzieri sau comisioane.',
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="2" className="fill-orange-500/30"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M6 9h.01M18 15h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )
              },
              { 
                q: 'Ce servicii pot oferi?', 
                a: 'Colete, plicuri, mobilă, electronice, transport persoane, platformă auto, tractări, animale de companie și marfă perisabilă. Alegi serviciile care ți se potrivesc.',
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" className="fill-orange-500/30"/>
                    <path d="M12 22V12M3 7l9 5m9-5l-9 5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                )
              },
              { 
                q: 'Trebuie să am firmă?', 
                a: 'Nu obligatoriu. Poți lucra ca persoană fizică autorizată (PFA) sau SRL, dar și fără firmă. Important e să ai documente valide pentru vehicul și asigurare RCA.',
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" className="fill-orange-500/30"/>
                    <path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
