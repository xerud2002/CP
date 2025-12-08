'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const countries = [
  { code: 'RO', name: 'România', flag: '🇷🇴' },
  { code: 'GB', name: 'Anglia', flag: '🇬🇧' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'ES', name: 'Spania', flag: '🇪🇸' },
  { code: 'DE', name: 'Germania', flag: '🇩🇪' },
  { code: 'FR', name: 'Franța', flag: '🇫🇷' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgia', flag: '🇧🇪' },
  { code: 'NL', name: 'Olanda', flag: '🇳🇱' },
  { code: 'GR', name: 'Grecia', flag: '🇬🇷' },
  { code: 'PT', name: 'Portugalia', flag: '🇵🇹' },
  { code: 'NO', name: 'Norvegia', flag: '🇳🇴' },
  { code: 'SE', name: 'Suedia', flag: '🇸🇪' },
  { code: 'DK', name: 'Danemarca', flag: '🇩🇰' },
  { code: 'FI', name: 'Finlanda', flag: '🇫🇮' },
  { code: 'IE', name: 'Irlanda', flag: '🇮🇪' },
];

const features = [
  {
    image: '/img/curieriinostri.png',
    title: 'Curieri Verificați',
    description: 'Toți curierii noștri trec printr-un proces riguros de verificare. Sunt profesioniști cu experiență în transport internațional.',
    icon: '✓',
  },
  {
    image: '/img/asigurare.png',
    title: 'Asigurare Gratuită',
    description: 'Fiecare colet beneficiază de asigurare inclusă în preț. Liniște sufletească pentru tine și destinatarul tău.',
    icon: '🛡️',
  },
  {
    image: '/img/door2door.png',
    title: 'Door to Door',
    description: 'Ridicăm coletul de la ușa ta și îl livrăm direct la destinație. Fără cozi, fără așteptări.',
    icon: '🏠',
  },
  {
    image: '/img/track.png',
    title: 'Tracking Live',
    description: 'Urmărește-ți coletul în timp real pe hartă. Știi mereu exact unde se află și când ajunge.',
    icon: '📍',
  },
  {
    image: '/img/heretohelp.png',
    title: 'Suport Non-Stop',
    description: 'Echipa noastră de suport îți răspunde 24/7 pe WhatsApp, telefon sau email.',
    icon: '💬',
  },
  {
    image: '/img/pets.png',
    title: 'Transport Special',
    description: 'Transportăm și animale de companie, obiecte fragile sau colete voluminoase cu grijă maximă.',
    icon: '🐾',
  },
];

const stats = [
  { value: '10K+', label: 'Colete livrate', icon: '📦' },
  { value: '500+', label: 'Curieri activi', icon: '🚚' },
  { value: '16', label: 'Țări acoperite', icon: '🌍' },
  { value: '4.9★', label: 'Rating mediu', icon: '⭐' },
];

const howItWorks = [
  {
    step: '01',
    title: 'Selectează ruta',
    description: 'Alege țara de origine și destinație pentru coletul tău.',
    icon: '📍',
  },
  {
    step: '02',
    title: 'Primește oferte',
    description: 'Curierii disponibili pe ruta ta îți trimit oferte competitive.',
    icon: '💰',
  },
  {
    step: '03',
    title: 'Alege curierul',
    description: 'Compară prețurile, recenziile și alege curierul potrivit.',
    icon: '✅',
  },
  {
    step: '04',
    title: 'Relaxează-te',
    description: 'Coletul tău este ridicat și livrat în siguranță la destinație.',
    icon: '🎉',
  },
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
  { from: '🇷🇴 România', to: '🇬🇧 Anglia', price: 'de la 25€', time: '3-5 zile' },
  { from: '🇷🇴 România', to: '🇩🇪 Germania', price: 'de la 20€', time: '2-4 zile' },
  { from: '🇷🇴 România', to: '🇮🇹 Italia', price: 'de la 22€', time: '2-4 zile' },
  { from: '🇷🇴 România', to: '🇪🇸 Spania', price: 'de la 28€', time: '3-5 zile' },
];

export default function Home() {
  const [pickupCountry, setPickupCountry] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-green-500/10 to-transparent"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left side - Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-green-500/20 rounded-3xl blur-xl"></div>
                
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
                        <select
                          value={pickupCountry}
                          onChange={(e) => setPickupCountry(e.target.value)}
                          className="form-select"
                          required
                        >
                          <option value="">Selectează țara de origine</option>
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.name}
                            </option>
                          ))}
                        </select>
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
                        <select
                          value={deliveryCountry}
                          onChange={(e) => setDeliveryCountry(e.target.value)}
                          className="form-select"
                          required
                        >
                          <option value="">Selectează țara de destinație</option>
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.name}
                            </option>
                          ))}
                        </select>
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
                        <span className="px-2 py-1 rounded bg-slate-700/50 text-gray-300 text-xs">🇷🇴→🇬🇧</span>
                        <span className="px-2 py-1 rounded bg-slate-700/50 text-gray-300 text-xs">🇷🇴→🇩🇪</span>
                        <span className="px-2 py-1 rounded bg-slate-700/50 text-gray-300 text-xs">🇷🇴→🇮🇹</span>
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium mb-4">
              Simplu ca 1-2-3-4
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

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-green-500/30"></div>
                )}
                <div className="card text-center hover:border-green-500/50 transition-all">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/20 flex items-center justify-center text-3xl">
                    {item.icon}
                  </div>
                  <span className="text-green-400 text-sm font-bold">PASUL {item.step}</span>
                  <h3 className="text-xl font-semibold text-white mt-2 mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
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
                href={`/oferte?from=RO&to=${route.to.includes('Anglia') ? 'GB' : route.to.includes('Germania') ? 'DE' : route.to.includes('Italia') ? 'IT' : 'ES'}`}
                className="card hover:border-orange-500/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg">{route.from}</span>
                  <span className="text-orange-400 group-hover:translate-x-1 transition-transform">→</span>
                  <span className="text-lg">{route.to}</span>
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
              <div key={index} className="feature-card group">
                <div className="relative h-48 overflow-hidden rounded-xl mb-4">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
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
          <div className="card text-center bg-gradient-to-r from-orange-600/20 to-green-600/20 border-orange-500/30">
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
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-default"
                title={country.name}
              >
                <span className="text-xl mr-2">{country.flag}</span>
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
