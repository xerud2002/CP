'use client';

import Link from 'next/link';

const cpKeyFeatures = [
  {
    id: 1,
    title: 'Transportatori verificați',
    description: 'Verificăm identitatea, licențele și asigurările fiecărui curier pentru siguranța ta',
    fbAlt: 'În grupuri: Verificare manuală',
    fbDescription: 'Trebuie să verifici singur fiecare transportator - un proces care necesită timp și experiență',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Sistem de rating structurat',
    description: 'Evaluări detaliate de la clienți reali după fiecare transport finalizat',
    fbAlt: 'În grupuri: Reacții generale',
    fbDescription: 'Like-urile și comentariile nu oferă aceeași transparență ca un sistem de rating dedicat',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Feedback transparent',
    description: 'Vezi toate recenziile - pozitive și negative - pentru decizii informate',
    fbAlt: 'În grupuri: Vizibilitate variabilă',
    fbDescription: 'Recenziile pot fi greu de găsit sau incomplete - lipsa unui istoric centralizat',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Control total al ofertelor',
    description: 'Tu alegi câte oferte primești și cu cine comunici - totul organizat',
    fbAlt: 'În grupuri: Gestionare manuală',
    fbDescription: 'Multe mesaje de sortat manual - necesită timp pentru a găsi ofertele potrivite',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
];


export default function PlatformVsFacebook() {
  return (
    <section className="below-fold py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative overflow-hidden bg-linear-to-b from-slate-900/50 via-slate-900 to-slate-900/50">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-emerald-500/10 to-orange-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4 shadow-lg shadow-emerald-500/10">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Avantajele platformei
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            <span className="text-white">De ce să alegi </span>
            <span className="text-gradient">Curierul Perfect</span>
            <span className="text-white">?</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
            O platformă profesională dedicată vs. alternative improvizate
          </p>
        </div>

        {/* Compact Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 mb-10 sm:mb-12">
          {cpKeyFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className="group relative bg-linear-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 sm:hover:-translate-y-1"
            >
              {/* CP Advantage */}
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-700/50">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-linear-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Alternative comparison - softer tone */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-linear-to-br from-slate-600/30 to-slate-700/20 border border-slate-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <h4 className="text-sm sm:text-base font-medium text-slate-400">
                      {feature.fbAlt}
                    </h4>
                  </div>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {feature.fbDescription}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-block p-6 sm:p-8 rounded-2xl bg-linear-to-br from-slate-800/90 to-slate-800/50 border border-orange-500/30 shadow-2xl shadow-orange-500/10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Caută <span className="text-orange-400">siguranță</span> și <span className="text-orange-400">profesionalism</span> pentru transporturile tale?
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-5 max-w-2xl mx-auto leading-relaxed">
              Descoperă o experiență superioară: platformă dedicată cu 
              <span className="text-emerald-400 font-semibold"> curieri verificați profesional, transparență totală a prețurilor și protecție completă</span> pentru fiecare comandă.
            </p>
            <Link href="/comanda" className="btn-primary px-8 py-3.5 text-base inline-flex items-center gap-2">
              Comandă în siguranță acum
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
