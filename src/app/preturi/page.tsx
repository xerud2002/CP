'use client';

import Link from 'next/link';
import { serviceTypes } from '@/lib/constants';

export default function PreturiPage() {
  const steps = [
    { 
      step: '1', 
      title: 'Plasezi comanda', 
      desc: 'Descrii ce ai nevoie să transporți',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
    },
    { 
      step: '2', 
      title: 'Primești oferte', 
      desc: 'Curierii verificați îți trimit prețuri',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
    },
    { 
      step: '3', 
      title: 'Compari și alegi', 
      desc: 'Vezi rating, preț, timp de livrare',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
    },
    { 
      step: '4', 
      title: 'Gata!', 
      desc: 'Curierul tău preia transportul',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
  ];

  const benefits = [
    { title: 'Zero comisioane', desc: 'Nu plătești nicio taxă platformei', icon: '💰' },
    { title: 'Oferte competitive', desc: 'Mai mulți curieri, prețuri mai bune', icon: '📊' },
    { title: 'Curieri verificați', desc: 'Documente și recenzii verificate', icon: '✅' },
    { title: 'Chat direct', desc: 'Negociezi direct cu transportatorul', icon: '💬' },
    { title: 'Transparent', desc: 'Vezi toate costurile de la început', icon: '👁️' },
    { title: 'Fără surprize', desc: 'Prețul agreat este prețul final', icon: '🎯' },
  ];

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-28 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-slate-900 to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            100% GRATUIT pentru clienți
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Prețuri stabilite de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">piață, nu de noi</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Nu setăm prețuri fixe. Curierii concurează pentru comanda ta, iar tu alegi oferta perfectă.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/comanda" className="btn-primary px-8 py-4 text-lg font-bold shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all">
              Cere oferte gratuit
            </Link>
            <Link href="/cum-functioneaza" className="btn-secondary px-8 py-4 text-lg font-semibold">
              Cum funcționează?
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Cum obții cel mai bun preț?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">În 4 pași simpli primești oferte competitive de la curieri verificați</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent z-0" />
                )}
                <div className="card p-6 text-center hover:border-orange-500/40 transition-all duration-300 relative z-10">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-orange-400 mb-2">PASUL {item.step}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services with pricing factors */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ce influențează prețul?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Fiecare tip de transport are factori diferiți. Curierii calculează prețul în funcție de nevoile tale specifice.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceTypes.slice(0, 9).map((service) => (
              <Link 
                key={service.id} 
                href={`/servicii/${service.id}`}
                className="card p-5 hover:border-orange-500/40 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${service.bgColor} ${service.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{service.label}</h3>
                    <p className="text-sm text-gray-400 mb-3">{service.description}</p>
                    <div className="flex items-center gap-2 text-xs text-orange-400 font-medium">
                      <span>Vezi detalii</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-slate-800/50 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">De ce Curierul Perfect?</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Platformă gratuită cu beneficii reale pentru tine</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="card p-6 hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison: What you pay vs don't pay */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What you get */}
            <div className="card p-6 border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Ce primești GRATUIT</h3>
              </div>
              <ul className="space-y-3">
                {['Acces nelimitat la platformă', 'Oferte de la curieri verificați', 'Chat direct cu transportatorii', 'Sistem de recenzii și rating', 'Suport clienți dedicat', 'Urmărire comandă în timp real'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What you don't pay */}
            <div className="card p-6 border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Ce NU plătești</h3>
              </div>
              <ul className="space-y-3">
                {['Comisioane de platformă', 'Taxe de plasare comandă', 'Abonamente lunare', 'Taxe ascunse', 'Penalizări de anulare', 'Costuri de modificare'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-400 line-through opacity-70">
                    <svg className="w-5 h-5 text-red-400/70 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-amber-500/10" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Gata să primești oferte?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Plasează o comandă gratuit și vezi ce prețuri oferă curierii pentru transportul tău
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/comanda" className="btn-primary px-10 py-4 text-lg font-bold shadow-xl shadow-orange-500/30">
              Plasează comandă acum
            </Link>
            <Link href="/servicii" className="btn-secondary px-8 py-4 text-lg font-semibold">
              Explorează serviciile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
