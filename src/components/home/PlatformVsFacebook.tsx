'use client';

import Link from 'next/link';

const cpFeatures = [
  {
    id: 1,
    title: 'Chat privat dedicat',
    description: 'Conversații private cu fiecare curier, fără ca alții să vadă mesajele tale și detaliile comenzii',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Sistem de verificare și rating',
    description: 'Fiecare curier e verificat și evaluat - vezi rating-ul și istoricul înainte să alegi',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Recenzii pozitive ȘI negative',
    description: 'Vezi feedback complet - nu doar like-uri, ci recenzii reale care te ajută să alegi corect',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Protecție GDPR și securitate',
    description: 'Datele tale sunt protejate conform legislației europene - securitate maximă garantată',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Alegi câte oferte primești',
    description: 'Control total - vezi ofertele organizat, compari și alegi doar pe cele care te interesează',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Dashboard organizat',
    description: 'Toate comenzile într-un singur loc, cu istoric complet, status și documentație',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
  {
    id: 7,
    title: 'Notificări instant',
    description: 'Primești alertă imediat când un curier îți scrie - nu pierzi nicio ofertă',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    id: 8,
    title: 'Filtrare avansată',
    description: 'Caută rapid după țară, serviciu, număr comandă - găsești instant ce ai nevoie',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    id: 9,
    title: 'Design profesional',
    description: 'Interface modernă, ușor de folosit pe orice device - experiență premium',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const fbDisadvantages = [
  {
    id: 1,
    title: 'Comentarii publice',
    description: 'Toată lumea vede detaliile comenzii tale, prețurile discutate și informațiile personale',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Fără verificare',
    description: 'Nu știi cine e de încredere - nicio garanție, niciun istoric, doar promisiuni',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Doar like-uri, fără recenzii negative',
    description: 'Problemele reale se pierd în comentarii - vezi doar partea frumoasă',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Zero protecție date personale',
    description: 'Datele tale rămân publice la infinit - risc major de securitate',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Spam și mesaje haotice',
    description: 'Oferte de la oricine, mesaje neverificate - nu poți filtra sau organiza nimic',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Postări haotice și greu de urmărit',
    description: 'Pierzi comenzi în miile de postări zilnice - dificil de urmărit ce ai comandat',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
      </svg>
    ),
  },
  {
    id: 7,
    title: 'Scroll infinit prin comentarii',
    description: 'Cauți manual prin sute de comentarii pentru un răspuns - extrem de ineficient',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 8,
    title: 'Imposibil de filtrat și căutat',
    description: 'Nu poți căuta rapid ce te interesează - pierdere de timp cu browsing manual',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6" />
      </svg>
    ),
  },
  {
    id: 9,
    title: 'Interface improvizată',
    description: 'Facebook nu e făcut pentru transport - folosești o platformă neprofesionistă',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

// Display order for CP features (1,2,3,6,7,4,8,9,5)
const cpDisplayOrder = [0, 1, 2, 5, 6, 3, 7, 8, 4];

export default function PlatformVsFacebook() {
  return (
    <section className="below-fold py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative overflow-hidden bg-linear-to-b from-slate-900/50 via-slate-900 to-slate-900/50">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-linear-to-r from-orange-500/10 to-blue-500/10 border border-orange-500/20 text-orange-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4 shadow-lg shadow-orange-500/10">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Platformă profesională
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            <span className="text-white">De ce </span>
            <span className="text-gradient">Curierul Perfect</span>
            <br className="hidden sm:block" />
            <span className="text-white"> în loc de </span>
            <span className="text-red-400">grupuri Facebook</span>
            <span className="text-white">?</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Platformă dedicată cu funcții profesionale care depășesc cu mult posibilitățile unui grup de Facebook
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Curierul Perfect - Left Column */}
          <div className="space-y-4 sm:space-y-5">
            <div className="text-center md:text-left mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-linear-to-r from-orange-500 to-orange-600 text-white font-bold text-base sm:text-lg shadow-2xl shadow-orange-500/40 border border-orange-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Curierul Perfect
              </div>
            </div>

            {cpDisplayOrder.map((index, displayIndex) => {
              const feature = cpFeatures[index];
              return (
                <div key={feature.id} className="group relative bg-linear-to-br from-slate-800/90 to-slate-800/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 font-bold text-sm">{displayIndex + 1}</span>
                  </div>
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-green-500/30 to-green-600/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{feature.title}</h3>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Facebook Groups - Right Column */}
          <div className="space-y-4 sm:space-y-5">
            <div className="text-center md:text-left mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-linear-to-r from-red-500/20 to-red-600/20 border-2 border-red-500/40 text-red-400 font-bold text-base sm:text-lg shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Grupuri Facebook
              </div>
            </div>

            {fbDisadvantages.map((disadvantage) => (
              <div key={disadvantage.id} className="group relative bg-linear-to-br from-slate-800/30 to-slate-800/10 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-red-500/30 opacity-70 hover:opacity-85 transition-all duration-300">
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold text-sm">{disadvantage.id}</span>
                </div>
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-linear-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/30 flex items-center justify-center">
                    {disadvantage.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-2">{disadvantage.title}</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                      {disadvantage.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <div className="inline-block p-6 sm:p-8 rounded-2xl bg-linear-to-br from-slate-800/90 to-slate-800/50 border border-orange-500/30 shadow-2xl shadow-orange-500/20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              Treci la <span className="text-gradient">profesionalism</span>
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-5 sm:mb-6 max-w-xl mx-auto">
              Alătură-te platformei moderne de transport care pune securitatea, eficiența și experiența ta pe primul loc
            </p>
            <Link href="/comanda" className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg inline-flex items-center gap-2">
              Plasează prima comandă
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
