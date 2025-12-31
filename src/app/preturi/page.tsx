'use client';

import Link from 'next/link';

export default function PreturiPage() {
  const servicii = [
    { id: 'colete', name: 'Colete', desc: 'Transport colete și plicuri până la 30kg', icon: '📦', factors: ['Distanță', 'Greutate', 'Dimensiuni', 'Urgență'] },
    { id: 'mobila', name: 'Mobilă', desc: 'Mutări mobilă și obiecte voluminoase', icon: '🛋️', factors: ['Volum', 'Etaj', 'Distanță', 'Demontaj/Montaj'] },
    { id: 'electronice', name: 'Electronice', desc: 'Transport echipamente electronice fragile', icon: '💻', factors: ['Dimensiuni', 'Asigurare', 'Distanță', 'Ambalare specială'] },
    { id: 'persoane', name: 'Persoane', desc: 'Transport pasageri pe distanțe medii/lungi', icon: '👥', factors: ['Distanță', 'Nr. persoane', 'Bagaje', 'Confort auto'] },
    { id: 'platforma', name: 'Platformă Auto', desc: 'Transport autovehicule pe platformă', icon: '🚗', factors: ['Distanță', 'Tip vehicul', 'Stare funcțională', 'Urgență'] },
    { id: 'animale', name: 'Animale', desc: 'Transport animale de companie cu condiții speciale', icon: '🐕', factors: ['Distanță', 'Talie animal', 'Cușcă transport', 'Certificat sănătate'] },
    { id: 'tractari', name: 'Tractări', desc: 'Servicii de tractare și asistenă rutieră', icon: '🚛', factors: ['Distanță', 'Urgență', 'Tip vehicul', 'Disponibilitate 24/7'] },
    { id: 'perisabile', name: 'Perisabile', desc: 'Transport mărfuri perisabile cu condiții speciale', icon: '🧊', factors: ['Temperatură controlată', 'Distanță', 'Greutate', 'Certificare'] }
  ];

  return (
    <main className="min-h-screen bg-slate-900">
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            <span className="text-gradient">Prețuri</span> Transparente
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-4 max-w-xl mx-auto">
            Compari oferte de la curieri verificați și alegi cea mai bună pentru tine
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">100% GRATUIT pentru clienți - Zero comisioane!</span>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Cum funcționează prețurile?</h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto">
              Fiecare transport este unic. Curierii îți trimit oferte personalizate bazate pe nevoile tale specifice.
              Tu compari și alegi oferta care ți se potrivește cel mai bine - preț, timp, rating.
            </p>
          </div>

          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {servicii.map((serviciu) => (
              <div key={serviciu.id} className="card p-4 sm:p-6 hover:border-orange-500/30 transition">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{serviciu.icon}</div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{serviciu.name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">{serviciu.desc}</p>
                <div className="space-y-1.5">
                  <p className="text-xs sm:text-sm font-semibold text-orange-400 mb-2">Factori de preț:</p>
                  {serviciu.factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full shrink-0"></div>
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="card p-5 sm:p-8 mb-8 sm:mb-12 bg-linear-to-br from-orange-500/5 to-purple-500/5 border-orange-500/20">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Exemple de prețuri orientative</h2>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl sm:text-3xl mb-2">📦</div>
                <h3 className="font-semibold text-white text-sm sm:text-base mb-1">Colet 5kg</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-2">București → Cluj-Napoca</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-400">50-100 RON</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-lg">
                <div className="text-2xl sm:text-3xl mb-2">🛋️</div>
                <h3 className="font-semibold text-white text-sm sm:text-base mb-1">Mobilă 2 camere</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-2">În aceeași oraș</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-400">300-600 RON</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-slate-800/50 rounded-lg min-[400px]:col-span-2 md:col-span-1">
                <div className="text-2xl sm:text-3xl mb-2">🚗</div>
                <h3 className="font-semibold text-white text-sm sm:text-base mb-1">Auto pe platformă</h3>
                <p className="text-xs sm:text-sm text-gray-400 mb-2">România → Germania</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-400">€300-500</p>
              </div>
            </div>
            <p className="text-center text-xs sm:text-sm text-gray-400 mt-4">
              * Prețurile sunt orientative și variază în funcție de specificul comenzii
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
            <div className="card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ce INCLUDEM
              </h3>
              <ul className="space-y-2">
                {['Acces gratuit la platformă', 'Curieri verificați', 'Chat direct cu transportatorul', 'Suport clienți 24/7', 'Tracking comandă', 'Sistem de recenzii'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm sm:text-base text-gray-300">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ce NU plătești la noi
              </h3>
              <ul className="space-y-2">
                {['Comisioane platformă', 'Taxe de plasare comandă', 'Costuri abonament', 'Taxe ascunse', 'Comisioane anulare', 'Taxe de modificare'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm sm:text-base text-gray-300 line-through opacity-60">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Gata să economisești?</h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto">
            Creează o comandă GRATUIT și primește oferte competitive de la curieri verificați
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/comanda" className="btn-primary px-6 sm:px-8 py-3 text-base sm:text-lg min-h-12 flex items-center justify-center">
              Plasează comandă acum
            </Link>
            <Link href="/cum-functioneaza" className="btn-secondary px-6 sm:px-8 py-3 text-base sm:text-lg min-h-12 flex items-center justify-center">
              Vezi cum funcționează
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
