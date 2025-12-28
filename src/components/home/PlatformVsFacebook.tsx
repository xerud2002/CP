'use client';

import Link from 'next/link';

const cpKeyFeatures = [
  {
    id: 1,
    title: 'Transportatori verificați',
    description: 'Verificăm background, licențe, rating și asigurări ale fiecărui curier înainte să poată opera pe platformă',
    fbLack: 'Pe Facebook: Oricine',
    fbDescription: 'Oricine poate răspunde la comenzi - nu există verificare, licențe sau garanții de profesionalism',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Sistem de rating',
    description: 'Evaluări de la clienți reali după fiecare transport finalizat',
    fbLack: 'Pe Facebook: Doar like-uri',
    fbDescription: 'Doar like-uri la postări, fără sistem real de rating sau recenzii structurate pentru transportatori',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Recenzii bune și rele',
    description: 'Vezi feedback-ul complet - recenzii pozitive și negative autentice',
    fbLack: 'Pe Facebook: Doar pozitive',
    fbDescription: 'Recenziile negative sunt șterse sau ascunse - vezi doar partea frumoasă, nu realitatea completă',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Controlezi ofertele',
    description: 'Tu decizi câte oferte primești și cu cine comunici',
    fbLack: 'Pe Facebook: Spam necontrolat',
    fbDescription: 'Primești sute de mesaje de la oricine, fără posibilitatea de a limita sau filtra ofertele',
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
];


export default function PlatformVsFacebook() {
  return (
    <section className="below-fold py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative overflow-hidden bg-gradient-to-b from-slate-900/50 via-slate-900 to-slate-900/50">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-orange-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4 shadow-lg shadow-emerald-500/10">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            De ce Curierul Perfect
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-2">
            <span className="text-white">De ce </span>
            <span className="text-gradient">Curierul Perfect</span>
            <br className="hidden sm:block" />
            <span className="text-white"> în loc de </span>
            <span className="text-red-400">Facebook</span>
            <span className="text-white">?</span>
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto px-4">
            Avantajele unei platforme profesionale comparativ cu grupurile improvizate
          </p>
        </div>

        {/* Compact Comparison Cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-10 sm:mb-12">
          {cpKeyFeatures.map((feature) => (
            <div 
              key={feature.id} 
              className="group relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl rounded-xl p-5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
            >
              {/* CP Advantage */}
              <div className="flex items-start gap-4 mb-4 pb-4 border-b border-slate-700/50">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* FB Disadvantage */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <h4 className="text-base font-bold text-red-400">
                      {feature.fbLack}
                    </h4>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.fbDescription}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-block p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-800/50 border border-orange-500/30 shadow-2xl shadow-orange-500/10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Te-ai săturat de <span className="text-red-400">țepari</span> și <span className="text-red-400">intermediari dubioși</span>?
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-5 max-w-2xl mx-auto leading-relaxed">
              Uită de mesajele goale, ofertele false și promisiunile neîndeplinite. Comandă transport cu încredere pe o platformă care îți oferă 
              <span className="text-emerald-400 font-semibold"> curieri verificați, prețuri transparente și protecție reală</span>.
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
