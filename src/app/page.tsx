'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import SearchableSelect from '@/components/ui/SearchableSelect';

const countries = [
  { code: 'RO', name: 'România', flag: '/img/flag/ro.svg' },
  { code: 'GB', name: 'Anglia', flag: '/img/flag/gb.svg' },
  { code: 'IT', name: 'Italia', flag: '/img/flag/it.svg' },
  { code: 'ES', name: 'Spania', flag: '/img/flag/es.svg' },
  { code: 'DE', name: 'Germania', flag: '/img/flag/de.svg' },
  { code: 'FR', name: 'Franța', flag: '/img/flag/fr.svg' },
  { code: 'AT', name: 'Austria', flag: '/img/flag/at.svg' },
  { code: 'BE', name: 'Belgia', flag: '/img/flag/be.svg' },
  { code: 'NL', name: 'Olanda', flag: '/img/flag/nl.svg' },
  { code: 'GR', name: 'Grecia', flag: '/img/flag/gr.svg' },
  { code: 'PT', name: 'Portugalia', flag: '/img/flag/pt.svg' },
  { code: 'NO', name: 'Norvegia', flag: '/img/flag/no.svg' },
  { code: 'SE', name: 'Suedia', flag: '/img/flag/se.svg' },
  { code: 'DK', name: 'Danemarca', flag: '/img/flag/dk.svg' },
  { code: 'FI', name: 'Finlanda', flag: '/img/flag/fi.svg' },
  { code: 'IE', name: 'Irlanda', flag: '/img/flag/ie.svg' },
];

const features = [
  {
    image: '/img/curieriinostri.png',
    title: 'Curieri Verificați',
    description: 'Toți curierii noștri trec printr-un proces riguros de verificare. Sunt profesioniști cu experiență în transport internațional.',
  },
  {
    image: '/img/asigurare.png',
    title: 'Asigurare Gratuită',
    description: 'Fiecare colet beneficiază de asigurare inclusă în preț. Liniște sufletească pentru tine și destinatarul tău.',
  },
  {
    image: '/img/door2door.png',
    title: 'Door to Door',
    description: 'Ridicăm coletul de la ușa ta și îl livrăm direct la destinație. Fără cozi, fără așteptări.',
  },
  {
    image: '/img/track.png',
    title: 'Tracking Live',
    description: 'Urmărește-ți coletul în timp real pe hartă. Știi mereu exact unde se află și când ajunge.',
  },
  {
    image: '/img/heretohelp.png',
    title: 'Suport Non-Stop',
    description: 'Echipa noastră de suport îți răspunde 24/7 pe WhatsApp, telefon sau email.',
  },
  {
    image: '/img/pets.png',
    title: 'Transport Special',
    description: 'Transportăm și animale de companie, obiecte fragile sau colete voluminoase cu grijă maximă.',
  },
];

const stats = [
  { value: '10K+', label: 'Colete livrate', icon: '📦' },
  { value: '500+', label: 'Curieri activi', icon: '🚚' },
  { value: '16', label: 'Țări acoperite', icon: '🌍' },
  { value: '4.9★', label: 'Rating mediu', icon: '⭐' },
];

const testimonials = [
  {
    name: 'Maria D.',
    location: 'București → Londra',
    text: 'Am trimis colete mamei mele în UK de nenumărate ori. Serviciu excelent, prețuri corecte și curieri de încredere!',
    rating: 5,
    avatar: '👩',
  },
  {
    name: 'Andrei P.',
    location: 'Milano → Cluj',
    text: 'Lucrez în Italia și trimit pachete acasă lunar. Curierul Perfect e cea mai bună soluție pe care am găsit-o.',
    rating: 5,
    avatar: '👨',
  },
  {
    name: 'Elena M.',
    location: 'Madrid → Iași',
    text: 'Rapid, sigur și comunicare excelentă. Coletul a ajuns în 3 zile. Recomand cu încredere!',
    rating: 5,
    avatar: '👩‍🦰',
  },
];

const popularRoutes = [
  { from: 'România', fromFlag: '/img/flag/ro.svg', to: 'Anglia', toFlag: '/img/flag/gb.svg', toCode: 'GB', price: 'de la 25€', time: '3-5 zile' },
  { from: 'România', fromFlag: '/img/flag/ro.svg', to: 'Germania', toFlag: '/img/flag/de.svg', toCode: 'DE', price: 'de la 20€', time: '2-4 zile' },
  { from: 'România', fromFlag: '/img/flag/ro.svg', to: 'Italia', toFlag: '/img/flag/it.svg', toCode: 'IT', price: 'de la 22€', time: '2-4 zile' },
  { from: 'România', fromFlag: '/img/flag/ro.svg', to: 'Spania', toFlag: '/img/flag/es.svg', toCode: 'ES', price: 'de la 28€', time: '3-5 zile' },
];

export default function Home() {
  const [pickupCountry, setPickupCountry] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/oferte?from=${pickupCountry}&to=${deliveryCountry}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="top" className="relative min-h-[90vh] flex items-center px-4 overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-orange-500/10 to-transparent"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left side - Content */}
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Peste 500+ curieri activi acum
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1]">
                <span className="text-white">Trimite colete</span>
                <br />
                <span className="text-gradient">rapid și sigur</span>
                <br />
                <span className="text-white">în toată Europa</span>
              </h1>

              {/* Subtitle */}
              <p className="text-gray-400 text-lg max-w-lg mb-8">
                Platformă de curierat care conectează românii din diaspora cu curieri verificați. Prețuri competitive, tracking în timp real.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/register?role=client" className="btn-primary px-8 py-4 text-lg flex items-center gap-2">
                  Trimite un colet
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/register?role=curier" className="btn-secondary px-8 py-4 text-lg">
                  Devino curier
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Curieri verificați</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Asigurare inclusă</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Tracking live</span>
                </div>
              </div>
            </div>

            {/* Right side - Search Form */}
            <div className="animate-fade-in-delayed">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-orange-500/20 to-green-500/20 rounded-3xl blur-xl"></div>
                
                {/* Card */}
                <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-white mb-2">Găsește curieri disponibili</h2>
                    <p className="text-gray-400 text-sm">Compară prețuri și alege cel mai bun curier</p>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          <span className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-xs">1</span>
                            De unde trimiți?
                          </span>
                        </label>
                        <SearchableSelect
                          options={countries}
                          value={pickupCountry}
                          onChange={setPickupCountry}
                          placeholder="Selectează țara de origine"
                          searchPlaceholder="Caută țara..."
                          required
                        />
                      </div>
                      
                      {/* Arrow connector */}
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          <span className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs">2</span>
                            Unde livrăm?
                          </span>
                        </label>
                        <SearchableSelect
                          options={countries}
                          value={deliveryCountry}
                          onChange={setDeliveryCountry}
                          placeholder="Selectează țara de destinație"
                          searchPlaceholder="Caută țara..."
                          required
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="btn-primary w-full py-4 text-lg font-semibold flex items-center justify-center gap-2 group">
                      <span>Caută curieri</span>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </form>
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Rute populare:</span>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded bg-slate-700/50 text-gray-300 text-xs flex items-center gap-1">
                          <Image src="/img/flag/ro.svg" alt="RO" width={16} height={12} className="rounded-sm" />
                          →
                          <Image src="/img/flag/gb.svg" alt="GB" width={16} height={12} className="rounded-sm" />
                        </span>
                        <span className="px-2 py-1 rounded bg-slate-700/50 text-gray-300 text-xs flex items-center gap-1">
                          <Image src="/img/flag/ro.svg" alt="RO" width={16} height={12} className="rounded-sm" />
                          →
                          <Image src="/img/flag/de.svg" alt="DE" width={16} height={12} className="rounded-sm" />
                        </span>
                        <span className="px-2 py-1 rounded bg-slate-700/50 text-gray-300 text-xs flex items-center gap-1">
                          <Image src="/img/flag/ro.svg" alt="RO" width={16} height={12} className="rounded-sm" />
                          →
                          <Image src="/img/flag/it.svg" alt="IT" width={16} height={12} className="rounded-sm" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium mb-4">
              Simplu și rapid
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-white">Cum </span>
              <span className="text-gradient">funcționează</span>
              <span className="text-white">?</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              În doar 4 pași simpli, coletul tău ajunge la destinație în siguranță.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-linear-to-r from-orange-500/50 to-transparent"></div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-orange-500/40 transition-all duration-300">
                  <svg className="w-9 h-9 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold mb-3">PASUL 01</div>
                <h3 className="text-xl font-semibold text-white mb-2">Selectează ruta</h3>
                <p className="text-gray-400 text-sm">Alege țara de origine și destinație pentru coletul tău.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-linear-to-r from-green-500/50 to-transparent"></div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-green-500/20 to-green-600/10 border border-green-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-green-500/40 transition-all duration-300">
                  <svg className="w-9 h-9 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold mb-3">PASUL 02</div>
                <h3 className="text-xl font-semibold text-white mb-2">Primește oferte</h3>
                <p className="text-gray-400 text-sm">Curierii disponibili pe ruta ta îți trimit oferte competitive.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-linear-to-r from-blue-500/50 to-transparent"></div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-300">
                  <svg className="w-9 h-9 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-3">PASUL 03</div>
                <h3 className="text-xl font-semibold text-white mb-2">Alege curierul</h3>
                <p className="text-gray-400 text-sm">Compară prețurile, recenziile și alege curierul potrivit.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-300">
                  <svg className="w-9 h-9 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold mb-3">PASUL 04</div>
                <h3 className="text-xl font-semibold text-white mb-2">Relaxează-te</h3>
                <p className="text-gray-400 text-sm">Coletul tău este ridicat și livrat în siguranță la destinație.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-16 px-4 bg-blue-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Rute </span>
              <span className="text-gradient">Populare</span>
            </h2>
            <p className="text-gray-400">Cele mai căutate rute de transport</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRoutes.map((route, index) => (
              <Link
                key={index}
                href={`/oferte?from=RO&to=${route.toCode}`}
                className="card hover:border-orange-500/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2">
                    <Image src={route.fromFlag} alt={route.from} width={20} height={15} className="rounded-sm" />
                    <span className="text-sm">{route.from}</span>
                  </span>
                  <span className="text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
                  <span className="flex items-center gap-2">
                    <Image src={route.toFlag} alt={route.to} width={20} height={15} className="rounded-sm" />
                    <span className="text-sm">{route.to}</span>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-400 font-semibold">{route.price}</span>
                  <span className="text-gray-500">{route.time}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-4">
              De ce noi?
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-white">Totul pentru o </span>
              <span className="text-gradient">experiență perfectă</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Am creat platforma perfectă pentru nevoile comunității românești din diaspora.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card group overflow-hidden p-0">
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-green-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-medium mb-4">
              ⭐ Recenzii verificate
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Ce spun </span>
              <span className="text-gradient">clienții noștri</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card hover:border-yellow-500/30 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                <div className="mb-3">
                  {'⭐'.repeat(testimonial.rating)}
                </div>
                <p className="text-gray-300 text-sm italic">&ldquo;{testimonial.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center bg-linear-to-r from-orange-600/20 to-green-600/20 border-orange-500/30">
            <span className="text-6xl mb-6 block">🚚</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ești curier? Hai în echipă!
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Câștigă bani extra transportând colete pe rutele tale obișnuite între România și Europa.
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center mb-8">
              <div className="flex items-center gap-2 text-white">
                <span className="text-2xl">💰</span>
                <span>Câștiguri atractive</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-2xl">📅</span>
                <span>Program flexibil</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-2xl">🔒</span>
                <span>Plăți garantate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=curier" className="btn-primary">
                Înregistrează-te Gratuit
              </Link>
              <Link href="/despre-curieri" className="btn-outline-green">
                Află Mai Multe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 text-sm mb-6">Transportăm colete în siguranță în peste 16 țări europene</p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {countries.map((country) => (
              <div 
                key={country.code} 
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-default flex items-center gap-2"
                title={country.name}
              >
                <Image src={country.flag} alt={country.name} width={20} height={15} className="rounded-sm" />
                <span className="text-sm text-gray-400">{country.name}</span>
              </div>
            ))}
          </div>
          
          <div className="card inline-block px-8 py-6">
            <p className="text-white font-medium mb-4">Pregătit să trimiți un colet?</p>
            <Link href="#top" className="btn-primary">
              Începe acum - Este gratuit →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
