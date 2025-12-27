'use client';

import Link from 'next/link';

export default function DevinoPartenerPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-6">
            🚀 Ofertă Limitată - 100% GRATUIT
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Devino <span className="text-gradient">Partener Curier</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Alătură-te platformei #1 de transport pentru românii din diaspora. Zero comisioane, comenzi nelimitate, acces gratuit.
          </p>
          <Link href="/register?role=curier" className="btn-primary px-10 py-4 text-lg inline-flex items-center gap-3">
            <span>Înregistrează-te Acum</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">De ce Curierul Perfect?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: 'Zero Comisioane', desc: 'Păstrezi 100% din banii câștigați. Negociezi direct cu clienții.' },
              { icon: '📦', title: 'Comenzi Nelimitate', desc: 'Acces la toate comenzile disponibile pe rutele tale.' },
              { icon: '⚡', title: 'Instant Access', desc: 'După verificare, vezi imediat toate comenzile active.' },
              { icon: '💬', title: 'Chat Direct', desc: 'Comunici direct cu clienții, fără intermediari.' },
              { icon: '🌍', title: '16 Țări', desc: 'Acoperim întreaga Europă - de la UK la Grecia.' },
              { icon: '⭐', title: 'Reputație', desc: 'Construiește-ți reputația cu recenzii reale.' }
            ].map((benefit, idx) => (
              <div key={idx} className="card p-6 hover:border-green-500/30 transition-colors">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Cerințe pentru înregistrare</h2>
          <div className="space-y-4">
            {[
              { title: 'Carte de identitate / Pașaport', desc: 'Document valid de identitate' },
              { title: 'Asigurare RCA valabilă', desc: 'Pentru vehiculul folosit la transport' },
              { title: 'Certificat de înmatriculare', desc: 'Pentru vehiculul de transport' },
              { title: 'Telefon & Email', desc: 'Pentru comunicare cu clienții' }
            ].map((req, idx) => (
              <div key={idx} className="card p-6 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{req.title}</h3>
                  <p className="text-gray-400 text-sm">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works for couriers */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Cum funcționează</h2>
          <div className="space-y-8">
            {[
              { step: '1', title: 'Te înregistrezi', desc: 'Completezi formularul și încarci documentele necesare. Durează 5 minute.', time: '5 min' },
              { step: '2', title: 'Verificare documente', desc: 'Echipa noastră verifică documentele. Primești email de confirmare.', time: '24-48h' },
              { step: '3', title: 'Acces platformă', desc: 'Contul e activat. Vezi toate comenzile și poți trimite oferte.', time: 'Instant' },
              { step: '4', title: 'Primești comenzi', desc: 'Clienții îți văd ofertele și te contactează direct pentru detalii.', time: 'Continuu' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 card p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <span className="text-xs text-green-400 font-medium px-3 py-1 rounded-full bg-green-500/20">{item.time}</span>
                  </div>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Întrebări frecvente</h2>
          <div className="space-y-4">
            {[
              { q: 'Costă ceva să mă înregistrez?', a: 'Nu, platforma este 100% gratuită pentru curieri. Nu percepem comisioane din comenzi.' },
              { q: 'Cât durează verificarea?', a: 'În general 24-48 ore lucrătoare. Primești email când contul e aprobat.' },
              { q: 'Pot lucra și pentru alte platforme?', a: 'Da, nu există exclusivitate. Poți lucra în paralel pe mai multe platforme.' },
              { q: 'Cum primesc plata?', a: 'Negociezi direct cu clientul metoda de plată (cash, transfer bancar, etc.).' }
            ].map((item, idx) => (
              <details key={idx} className="card group">
                <summary className="p-6 cursor-pointer flex justify-between items-center">
                  <span className="font-semibold text-white">{item.q}</span>
                  <svg className="w-5 h-5 text-orange-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 border-t border-white/5 pt-4 text-gray-300">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Gata să începi?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Alătură-te celor 500+ de curieri care câștigă deja prin Curierul Perfect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=curier" className="btn-primary px-10 py-4 text-lg">
              Înregistrează-te Gratuit
            </Link>
            <Link href="/cum-functioneaza" className="btn-secondary px-10 py-4 text-lg">
              Află mai multe
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
