import Link from 'next/link';

export default function CumFunctioneazaPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="relative py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Cum funcționează <span className="text-gradient">Curierul Perfect</span>?
          </h1>
          <p className="text-xl text-gray-300">
            Un proces simplu în 5 pași pentru transport sigur și rapid în toată Europa
          </p>
        </div>
      </section>

      {/* Steps - Visual Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {[
            {
              step: '01',
              title: 'Creezi comanda',
              desc: 'Completezi formularul cu detalii despre transport: tipul serviciului, ruta, dimensiuni, data dorită. Durează doar 2-3 minute.',
              time: '2-3 minute',
              color: 'orange',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              )
            },
            {
              step: '02',
              title: 'Primești oferte',
              desc: 'Transportatorii disponibili pe ruta ta văd comanda și îți trimit oferte personalizate cu prețuri competitive.',
              time: '2-24 ore',
              color: 'green',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              )
            },
            {
              step: '03',
              title: 'Compari și alegi',
              desc: 'Vezi toate ofertele, compari prețurile, citești recenziile și alegi transportatorul care ți se potrivește cel mai bine.',
              time: '5-10 minute',
              color: 'blue',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              )
            },
            {
              step: '04',
              title: 'Confirmi detaliile',
              desc: 'Comunici direct cu transportatorul ales prin chat, negociezi detalii suplimentare dacă e nevoie și confirmi comanda finală.',
              time: 'Instant',
              color: 'purple',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              )
            },
            {
              step: '05',
              title: 'Transportul e realizat',
              desc: 'Transportatorul ridică și livrează conform acordului. Primești actualizări pe parcurs și confirmare la finalizare. Poți lăsa o recenzie.',
              time: 'Conform acordului',
              color: 'amber',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              )
            }
          ].map((item, idx) => (
            <div key={idx} className="relative mb-12 last:mb-0">
              {/* Connector line */}
              {idx < 4 && (
                <div className="absolute left-10 top-24 w-0.5 h-12 bg-linear-to-b from-white/20 to-transparent hidden md:block" />
              )}
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Step number + icon */}
                <div className="relative shrink-0">
                  <div className={`w-20 h-20 rounded-2xl bg-${item.color}-500/20 border-2 border-${item.color}-500/30 flex items-center justify-center`}>
                    <svg className={`w-10 h-10 text-${item.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                    {item.step}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 card p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-${item.color}-500/20 border border-${item.color}-500/30 text-${item.color}-400 text-xs font-bold mt-2 sm:mt-0`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {item.time}
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* For Couriers */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Pentru Curieri</h2>
            <p className="text-gray-300">Cum funcționează platforma din perspectiva transportatorului</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Te înregistrezi',
                desc: 'Creezi cont GRATUIT (până pe 31 Martie 2026), adaugi documentele necesare (CI, asigurare, acte autovehicul) și aștepți verificarea.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              },
              {
                title: 'Vezi comenzile',
                desc: 'Accesezi GRATUIT lista cu toate comenzile disponibile, filtrate după țară, tip serviciu și rută.',
                icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
              },
              {
                title: 'Trimiți oferte',
                desc: 'Contactezi clienții direct prin chat (FĂRĂ comisioane), negociezi prețul și detaliile, iar apoi finalizezi transportul.',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              }
            ].map((step, idx) => (
              <div key={idx} className="card p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {step.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/register?role=curier" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
              <span>Devino Partener Curier</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Quick */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Întrebări frecvente</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Cât costă să folosesc platforma?',
                a: 'Platforma este 100% gratuită pentru clienți. Nu percepem comisioane - plătești doar prețul negociat direct cu transportatorul.'
              },
              {
                q: 'Cum sunt verificați curierii?',
                a: 'Fiecare curier trebuie să prezinte CI/pașaport, asigurare RCA valabilă, certificat de înmatriculare vehicul și alte documente relevante. Echipa noastră verifică toate documentele înainte de aprobare.'
              },
              {
                q: 'Ce se întâmplă dacă coletul e deteriorat?',
                a: 'Recomandăm să optezi pentru asigurare transport (oferită de curier). În caz de deteriorare, poți face reclamație și curierii sunt obligați să aibă asigurare de răspundere civilă.'
              },
              {
                q: 'Pot anula o comandă?',
                a: 'Da, poți anula comanda gratuit înainte să confirmi transportatorul. După confirmare, condițiile de anulare depind de acordul cu curieru.'
              }
            ].map((item, idx) => (
              <details key={idx} className="card group">
                <summary className="p-6 cursor-pointer flex items-center justify-between">
                  <span className="font-semibold text-white">{item.q}</span>
                  <svg className="w-5 h-5 text-orange-400 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/faq" className="text-orange-400 hover:text-orange-300 font-medium inline-flex items-center gap-2">
              Vezi toate întrebările frecvente
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-linear-to-br from-orange-500/10 to-orange-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Simplu, Rapid, Sigur</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Platformă de încredere pentru transport în Europa.
          </p>
          <Link href="/comanda" className="btn-primary px-10 py-4 text-lg inline-flex items-center gap-3">
            <span>Plasează prima comandă</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
