'use client';

import Image from 'next/image';
import Link from 'next/link';
import CountUp from '@/components/ui/CountUp';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { countries } from '@/lib/constants';

const features = [
  {
    image: '/img/curieriinostri.png',
    title: 'Curieri Verificați',
    description: 'Toți curierii noștri trec printr-un proces riguros de verificare. Sunt profesioniști cu experiență în transport internațional.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    image: '/img/asigurare.png',
    title: 'Asigurare Gratuită',
    description: 'Fiecare colet beneficiază de asigurare inclusă în preț. Liniște sufletească pentru tine și destinatarul tău.',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  {
    image: '/img/door2door.png',
    title: 'Door to Door',
    description: 'Ridicăm coletul de la ușa ta și îl livrăm direct la destinație. Fără cozi, fără așteptări.',
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
  {
    image: '/img/track.png',
    title: 'Tracking Live',
    description: 'Urmărește-ți coletul în timp real pe hartă. Știi mereu exact unde se află și când ajunge.',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    image: '/img/heretohelp.png',
    title: 'Suport Non-Stop',
    description: 'Echipa noastră de suport îți răspunde 24/7 pe WhatsApp, telefon sau email.',
    gradient: 'from-red-500/20 to-rose-500/20',
  },
  {
    image: '/img/pets.png',
    title: 'Transport Special',
    description: 'Transportăm și animale de companie, obiecte fragile sau colete voluminoase cu grijă maximă.',
    gradient: 'from-teal-500/20 to-cyan-500/20',
  },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Colete livrate', iconType: 'package' },
  { value: 500, suffix: '+', label: 'Curieri activi', iconType: 'truck' },
  { value: 16, suffix: '', label: 'Țări acoperite', iconType: 'globe' },
  { value: 4.9, suffix: '★', label: 'Rating mediu', iconType: 'star', isDecimal: true },
];

const testimonials = [
  {
    company: 'Express Curier SRL',
    badge: 'Excelent',
    badgeColor: 'bg-green-500',
    text: 'Serviciu de top! Am colaborat de peste 2 ani și nu am avut nicio problemă. Recomand cu încredere!',
    author: 'Andrei M.',
    location: 'București',
    rating: 5.0,
    reviewCount: 12,
    date: '05 decembrie 2025',
  },
  {
    company: 'Trans Europa',
    badge: 'Excelent',
    badgeColor: 'bg-green-500',
    text: 'Foarte profesioniști, coletele ajung mereu la timp. Comunicare excelentă cu clienții.',
    author: 'Maria P.',
    location: 'Cluj-Napoca',
    rating: 4.8,
    reviewCount: 8,
    date: '02 decembrie 2025',
  },
  {
    company: 'Rapid Delivery',
    badge: 'Bun',
    badgeColor: 'bg-cyan-500',
    text: 'Servicii bune, prețuri competitive. Uneori durează puțin mai mult, dar ajunge în siguranță.',
    author: 'Ion V.',
    location: 'Timișoara',
    rating: 4.0,
    reviewCount: 5,
    date: '28 noiembrie 2025',
  },
  {
    company: 'Euro Transport',
    badge: 'Excelent',
    badgeColor: 'bg-green-500',
    text: 'Cel mai bun serviciu de curierat pe ruta România-Germania. Foarte mulțumit!',
    author: 'Elena D.',
    location: 'Iași',
    rating: 5.0,
    reviewCount: 15,
    date: '25 noiembrie 2025',
  },
  {
    company: 'Fast Cargo',
    badge: 'Bun',
    badgeColor: 'bg-cyan-500',
    text: 'Raport calitate-preț excelent. Curieri amabili și colete în stare perfectă.',
    author: 'Cristian B.',
    location: 'Brașov',
    rating: 4.2,
    reviewCount: 3,
    date: '20 noiembrie 2025',
  },
];

const popularRoutes = [
  { from: 'România', fromFlag: '/img/flag/ro.svg', to: 'Anglia', toFlag: '/img/flag/gb.svg', toCode: 'GB', price: 'de la 25€', time: '3-5 zile' },
  { from: 'România', fromFlag: '/img/flag/ro.svg', to: 'Germania', toFlag: '/img/flag/de.svg', toCode: 'DE', price: 'de la 20€', time: '2-4 zile' },
  { from: 'România', fromFlag: '/img/flag/ro.svg', to: 'Italia', toFlag: '/img/flag/it.svg', toCode: 'IT', price: 'de la 22€', time: '2-4 zile' },
  { from: 'România', fromFlag: '/img/flag/ro.svg', to: 'Spania', toFlag: '/img/flag/es.svg', toCode: 'ES', price: 'de la 28€', time: '3-5 zile' },
];

export default function Home() {

  return (
    <div className="min-h-screen">
      {/* Hero Section - Optimized for Mobile */}
      <section id="top" className="relative min-h-svh lg:min-h-[90vh] flex items-center px-4 py-6 sm:py-8 overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800"></div>
          <div className="absolute top-0 right-0 w-full lg:w-1/2 h-1/2 lg:h-full bg-linear-to-bl lg:bg-linear-to-l from-orange-500/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full lg:w-1/3 h-1/3 bg-linear-to-tr from-green-500/5 to-transparent"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left side - Content */}
            <div className="animate-fade-in order-2 lg:order-1">
              {/* Badge - Mobile optimized */}
              <div className="mb-4 sm:mb-6">
                <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs sm:text-sm">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Peste 500+ curieri activi acum
                </span>
              </div>

              {/* Main Title - Mobile first */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-[1.1]">
                <span className="text-white">Trimite colete</span>
                <br />
                <span className="text-gradient">rapid și sigur</span>
                <br />
                <span className="text-white">în toată Europa</span>
              </h1>

              {/* Subtitle - Mobile optimized */}
              <p className="text-gray-400 text-base sm:text-lg max-w-lg mb-6 sm:mb-8">
                Conectăm românii din diaspora cu curieri verificați. Transport door-to-door pentru colete, mobilă, electronice și animale de companie.
              </p>

              {/* CTA Buttons - Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Link href="/comanda" className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                  Plasează o comandă
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/register?role=curier" className="btn-secondary px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg flex items-center justify-center w-full sm:w-auto">
                  Devino curier
                </Link>
              </div>

              {/* Trust indicators - Grid on mobile */}
              <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-6 text-xs sm:text-sm text-gray-400">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 text-center sm:text-left">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Curieri verificați</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 text-center sm:text-left">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Asigurare inclusă</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-2 text-center sm:text-left">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Tracking live</span>
                </div>
              </div>
            </div>

            {/* Right side - Services Grid */}
            <div className="animate-fade-in-delayed order-1 lg:order-2">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-linear-to-r from-orange-500/10 to-green-500/10 rounded-3xl blur-2xl"></div>
                
                {/* Services Grid */}
                <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { 
                      name: 'Colete', 
                      desc: 'Pachete și cutii', 
                      icon: '📦', 
                      color: 'from-blue-500/20 to-cyan-500/20',
                      border: 'border-blue-500/30 hover:border-blue-400/50',
                      iconBg: 'bg-blue-500/20',
                      service: 'colete'
                    },
                    { 
                      name: 'Express', 
                      desc: 'Livrare rapidă', 
                      icon: '⚡', 
                      color: 'from-yellow-500/20 to-orange-500/20',
                      border: 'border-yellow-500/30 hover:border-yellow-400/50',
                      iconBg: 'bg-yellow-500/20',
                      service: 'express'
                    },
                    { 
                      name: 'Mobilă', 
                      desc: 'Transport mobilier', 
                      icon: '🛋️', 
                      color: 'from-amber-500/20 to-orange-500/20',
                      border: 'border-amber-500/30 hover:border-amber-400/50',
                      iconBg: 'bg-amber-500/20',
                      service: 'mobila'
                    },
                    { 
                      name: 'Electronice', 
                      desc: 'TV, electrocasnice', 
                      icon: '💻', 
                      color: 'from-purple-500/20 to-pink-500/20',
                      border: 'border-purple-500/30 hover:border-purple-400/50',
                      iconBg: 'bg-purple-500/20',
                      service: 'electronice'
                    },
                    { 
                      name: 'Animale', 
                      desc: 'Transport animale', 
                      icon: '🐕', 
                      color: 'from-pink-500/20 to-rose-500/20',
                      border: 'border-pink-500/30 hover:border-pink-400/50',
                      iconBg: 'bg-pink-500/20',
                      service: 'animale'
                    },
                    { 
                      name: 'Auto & Platformă', 
                      desc: 'Mașini, piese auto', 
                      icon: '🚗', 
                      color: 'from-slate-500/20 to-gray-500/20',
                      border: 'border-slate-500/30 hover:border-slate-400/50',
                      iconBg: 'bg-slate-500/20',
                      service: 'auto'
                    },
                  ].map((service) => (
                    <Link 
                      key={service.name}
                      href={`/comanda?serviciu=${service.service}`}
                      className={`group relative bg-slate-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border ${service.border} p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20`}
                    >
                      {/* Gradient overlay on hover */}
                      <div className={`absolute inset-0 bg-linear-to-br ${service.color} opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300`}></div>
                      
                      <div className="relative">
                        {/* Icon */}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${service.iconBg} rounded-xl flex items-center justify-center text-xl sm:text-2xl mb-3`}>
                          {service.icon}
                        </div>
                        
                        {/* Text */}
                        <h3 className="text-white font-semibold text-sm sm:text-base mb-1">{service.name}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm">{service.desc}</p>
                        
                        {/* Arrow */}
                        <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* More services link */}
                <div className="mt-4 text-center">
                  <Link 
                    href="/servicii" 
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 text-sm transition-colors group"
                  >
                    <span>Vezi toate serviciile</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              
              {/* Stats below services on mobile */}
              <div className="mt-4 sm:mt-6 grid grid-cols-4 gap-2 sm:hidden">
                <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-white/5">
                  <p className="text-white font-bold text-sm">10k+</p>
                  <p className="text-gray-500 text-[10px]">Colete</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-white/5">
                  <p className="text-white font-bold text-sm">500+</p>
                  <p className="text-gray-500 text-[10px]">Curieri</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-white/5">
                  <p className="text-white font-bold text-sm">16</p>
                  <p className="text-gray-500 text-[10px]">Țări</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 text-center border border-white/5">
                  <p className="text-white font-bold text-sm">4.9★</p>
                  <p className="text-gray-500 text-[10px]">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator - Hidden on mobile */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 animate-bounce">
          <span className="text-gray-500 text-xs">Scroll</span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="w-10 h-10 mb-3 mx-auto rounded-xl bg-orange-500/10 flex items-center justify-center">
                  {stat.iconType === 'package' && (
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                  {stat.iconType === 'truck' && (
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h8M8 17a2 2 0 11-4 0m4 0a2 2 0 10-4 0m12 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0M3 9h13a2 2 0 012 2v4H3V9zm13 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4h13z" />
                    </svg>
                  )}
                  {stat.iconType === 'globe' && (
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {stat.iconType === 'star' && (
                    <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  )}
                </div>
                <div className="stat-value">
                  {stat.isDecimal ? (
                    <>{stat.value}{stat.suffix}</>
                  ) : (
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  )}
                </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-orange-500/30 transition-all duration-500 hover:transform hover:-translate-y-2"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Image container with glow effect */}
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl group-hover:bg-orange-500/30 transition-all duration-500"></div>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={160}
                      height={160}
                      className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Text */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-linear-to-br from-orange-500/20 to-transparent rotate-45 group-hover:from-orange-500/40 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Recenzii verificate
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Ce spun </span>
              <span className="text-gradient">clienții noștri</span>
            </h2>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-left gap-6 hover:[animation-play-state:paused]">
              {/* Duplicate testimonials for infinite scroll effect */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div 
                  key={index} 
                  className="shrink-0 w-[calc(33.333%-1rem)] min-w-[320px] group relative bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-l-green-500 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  {/* Header with company name and rating */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{testimonial.company}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${testimonial.badgeColor}`}>
                        {testimonial.badge}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">{testimonial.rating.toFixed(1)}</div>
                      <div className="text-xs text-gray-500">{testimonial.reviewCount} recenzii</div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className={`w-5 h-5 ${star <= Math.floor(testimonial.rating) ? 'text-green-500' : star - 0.5 <= testimonial.rating ? 'text-green-500/50' : 'text-gray-600'}`}
                        viewBox="0 0 24 24"
                      >
                        <path 
                          fill="currentColor" 
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">&ldquo;{testimonial.text}&rdquo;</p>

                  {/* Author */}
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3 border-t border-white/5 pt-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">{testimonial.author}</span>
                    <span className="text-gray-600">•</span>
                    <span>{testimonial.location}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {testimonial.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-slate-800/80 backdrop-blur-sm border border-white/10 p-10 md:p-14 text-center">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/10 via-transparent to-green-500/10 pointer-events-none"></div>
            
            {/* Icon */}
            <div className="relative w-20 h-20 mx-auto mb-8 rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h8M8 17a2 2 0 11-4 0m4 0a2 2 0 10-4 0m12 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0M3 9h13a2 2 0 012 2v4H3V9zm13 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4h13z" />
              </svg>
            </div>
            
            {/* Title */}
            <h2 className="relative text-3xl md:text-4xl font-bold text-white mb-4">
              Ești curier? Alătură-te platformei!
            </h2>
            
            {/* Description */}
            <p className="relative text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Găsește comenzi pe rutele tale existente. Selectezi țările și județele pe care le acoperi, iar noi îți trimitem clienți potriviți.
            </p>
            
            {/* Benefits */}
            <div className="relative flex flex-wrap gap-6 justify-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <span className="text-white font-medium">Alegi rutele tale</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-white font-medium">Câștiguri pe drum</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white font-medium">Program flexibil</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=curier" className="btn-primary px-8 py-3 text-base font-semibold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow">
                Înregistrează-te Gratuit
              </Link>
              <Link href="/despre-curieri" className="btn-outline-green px-8 py-3 text-base font-semibold">
                Află Mai Multe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4">
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
          
          <div className="relative group inline-block">
            <div className="absolute -inset-1 bg-linear-to-r from-orange-500 to-emerald-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-2xl px-10 py-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg mb-2">Pregătit să trimiți un colet?</p>
              <p className="text-gray-400 text-sm mb-5">Găsește cel mai bun curier în câteva secunde</p>
              <Link href="#top" className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all group-hover:scale-105">
                <span>Începe acum</span>
                <span className="text-orange-200">- Este gratuit →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Elements */}
      <WhatsAppButton />
      {/* <SocialProof /> */}
    </div>
  );
}
