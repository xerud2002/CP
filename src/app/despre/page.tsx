'use client';

import Link from 'next/link';

export default function DesprePage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Despre <span className="text-gradient">Curierul Perfect</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Conectăm clienții cu transportatori de încredere pentru servicii complete de transport în România și Europa.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-10 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-5 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Povestea noastră</h2>
            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              <p>
                Curierul Perfect s-a născut din experiența personală a românilor care s-au confruntat cu dificultăți în găsirea de servicii de transport fiabile între România și țările din Europa de Vest.
              </p>
              <p>
                Am observat că mulți transportatori independenți ofereau servicii excelente, dar nu aveau o platformă centralizată unde să își prezinte serviciile. În același timp, clienții petreceau ore întregi căutând pe grupuri de Facebook sau prin recomandări opțiuni de transport.
              </p>
              <p>
                Astfel a apărut ideea Curierul Perfect - o platformă modernă, sigură și ușor de folosit care pune în contact direct clienții cu transportatorii verificați, eliminând intermediarii și oferind transparență totală în proces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-10 sm:py-16 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
            {/* Mission */}
            <div className="card p-5 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Misiunea noastră</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Să facilităm transportul între România și Europa prin conectarea directă între clienți și curieri verificați, oferind un proces simplu, transparent și sigur pentru toate părțile implicate.
              </p>
            </div>

            {/* Vision */}
            <div className="card p-5 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 sm:mb-6">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Viziunea noastră</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Să devenim platforma de referință pentru transport în România și Europa, oferind servicii de calitate superioară pe toate rutele naționale și internaționale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">Valorile noastre</h2>
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                ),
                title: 'Încredere',
                desc: 'Verificăm fiecare curier pentru siguranța ta'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: 'Transparență',
                desc: 'Comunicare directă, fără intermediari'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                title: 'Rapiditate',
                desc: 'Răspunsuri și oferte în câteva ore'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                ),
                title: 'Comunitate',
                desc: 'Rețea de transportatori în toată România și Europa'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                ),
                title: 'Flexibilitate',
                desc: 'Servicii personalizate pentru fiecare nevoie'
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                ),
                title: 'Suport',
                desc: 'Echipă dedicată pentru ajutor permanent'
              }
            ].map((value, idx) => (
              <div key={idx} className="card p-4 sm:p-6 hover:border-orange-500/30 transition-colors">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-500/20 flex items-center justify-center mb-3 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {value.icon}
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">{value.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Gata să începi?</h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto">
            Încearcă Curierul Perfect pentru transportul tău în România și Europa.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/comanda" className="btn-primary px-6 sm:px-8 py-3 sm:py-4 min-h-12 flex items-center justify-center text-sm sm:text-base">
              Plasează o comandă
            </Link>
            <Link href="/register?role=curier" className="btn-secondary px-6 sm:px-8 py-3 sm:py-4 min-h-12 flex items-center justify-center text-sm sm:text-base">
              Devino Partener
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
