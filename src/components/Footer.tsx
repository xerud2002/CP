'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              {/* Logo Image */}
              <div className="relative w-11 h-11 group-hover:scale-105 transition-all">
                <Image 
                  src="/img/logo2.png" 
                  alt="Curierul Perfect Logo" 
                  width={44} 
                  height={44} 
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              {/* Text */}
              <div className="flex flex-col">
                <span className="text-xl font-black leading-none">
                  <span className="group-hover:opacity-80 transition-opacity" style={{color: '#FF8C00'}}>CurierulPerfect</span>
                </span>
                <span className="text-[10px] text-gray-600 font-medium tracking-wider uppercase mt-0.5 text-center">- TRANSPORT NAȚIONAL & EUROPEAN -</span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-sm">
              Conectăm clienții cu transportatori verificați pentru transport național și european. Recenzii reale, comunicare directă, fără intermediari.
            </p>
            
            {/* Social Media */}
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 flex items-center justify-center text-gray-300 hover:text-blue-400 transition-all"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/447880312621" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-green-600/20 border border-white/10 hover:border-green-500/50 flex items-center justify-center text-gray-300 hover:text-green-400 transition-all"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Companie</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/despre" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Despre noi
                </Link>
              </li>
              <li>
                <Link href="/cum-functioneaza" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Cum funcționează
                </Link>
              </li>
              <li>
                <Link href="/devino-partener" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Devino curier
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Servicii</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/servicii/colete" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Transport colete
                </Link>
              </li>
              <li>
                <Link href="/servicii/plicuri" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Transport plicuri
                </Link>
              </li>
              <li>
                <Link href="/servicii/persoane" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Transport persoane
                </Link>
              </li>
              <li>
                <Link href="/servicii/mobila" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Mobilă & mutări
                </Link>
              </li>
              <li>
                <Link href="/servicii/electronice" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Transport electronice
                </Link>
              </li>
              <li>
                <Link href="/servicii/animale" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Transport animale
                </Link>
              </li>
              <li>
                <Link href="/servicii/platforma" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Transport platformă
                </Link>
              </li>
              <li>
                <Link href="/servicii/tractari" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Tractări auto
                </Link>
              </li>
              <li>
                <Link href="/servicii/paleti" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Transport paleți
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Suport & Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Întrebări frecvente
                </Link>
              </li>
              <li>
                <Link href="/reclamatii" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Reclamații
                </Link>
              </li>
              <li>
                <Link href="/termeni" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Termeni și condiții
                </Link>
              </li>
              <li>
                <Link href="/confidentialitate" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Politica cookies
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="text-gray-300 hover:text-orange-400 transition-colors text-sm flex items-center gap-2 group">
                  <svg className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-300 text-sm">
              © {currentYear ?? ''} Curierul Perfect. Toate drepturile rezervate.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Plăți securizate</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Date protejate SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}




