'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false
  });

  const handleSave = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Preferințele tale au fost salvate!');
  };

  useEffect(() => {
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-900">
      <section className="py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Politica <span className="text-gradient">Cookies</span>
          </h1>
          <p className="text-gray-300">Ultima actualizare: Ianuarie 2025</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Ce sunt cookies?</h2>
            <p className="text-gray-300 leading-relaxed">
              Cookies sunt fișiere text mici stocate pe dispozitivul tău când vizitezi un site web. 
              Ele ne ajută să îți oferim o experiență personalizată și să îmbunătățim platforma.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Tipuri de cookies folosite</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-emerald-400 pl-4">
                <h3 className="text-xl font-semibold text-white mb-2">🔒 Cookies Esențiale (Obligatorii)</h3>
                <p className="text-gray-300 mb-3">
                  Necesare pentru funcționarea de bază a platformei. Nu pot fi dezactivate.
                </p>
                <div className="bg-slate-800/50 p-4 rounded text-sm">
                  <p className="text-gray-400 mb-1"><strong className="text-white">Exemplu:</strong> authToken, sessionId</p>
                  <p className="text-gray-400 mb-1"><strong className="text-white">Scop:</strong> Autentificare utilizator, securitate sesiune</p>
                  <p className="text-gray-400"><strong className="text-white">Expirare:</strong> 7-30 zile</p>
                </div>
              </div>

              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="text-xl font-semibold text-white mb-2">📊 Cookies Analytics (Opționale)</h3>
                <p className="text-gray-300 mb-3">
                  Ne ajută să înțelegem cum folosești platforma pentru a o îmbunătăți.
                </p>
                <div className="bg-slate-800/50 p-4 rounded text-sm">
                  <p className="text-gray-400 mb-1"><strong className="text-white">Furnizor:</strong> Google Analytics (GA4)</p>
                  <p className="text-gray-400 mb-1"><strong className="text-white">Date colectate:</strong> Pagini vizitate, timp pe site, dispozitiv, locație generală</p>
                  <p className="text-gray-400 mb-1"><strong className="text-white">Cookies:</strong> _ga, _ga_*, _gid</p>
                  <p className="text-gray-400"><strong className="text-white">Expirare:</strong> 2 ani (_ga), 24 ore (_gid)</p>
                </div>
              </div>

              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="text-xl font-semibold text-white mb-2">🎯 Cookies Marketing (Opționale)</h3>
                <p className="text-gray-300 mb-3">
                  Pentru publicitate personalizată și remarketing.
                </p>
                <div className="bg-slate-800/50 p-4 rounded text-sm">
                  <p className="text-gray-400 mb-1"><strong className="text-white">Furnizori:</strong> Facebook Pixel, Google Ads (dacă aplică în viitor)</p>
                  <p className="text-gray-400 mb-1"><strong className="text-white">Scop:</strong> Afișare reclame relevante</p>
                  <p className="text-gray-400"><strong className="text-white">Status actual:</strong> NU folosim momentan</p>
                </div>
              </div>

              <div className="border-l-4 border-purple-400 pl-4">
                <h3 className="text-xl font-semibold text-white mb-2">⚙️ Cookies Funcționale (Opționale)</h3>
                <p className="text-gray-300 mb-3">
                  Reține preferințele tale (limba, regiune, tema).
                </p>
                <div className="bg-slate-800/50 p-4 rounded text-sm">
                  <p className="text-gray-400 mb-1"><strong className="text-white">Exemplu:</strong> userPreferences, theme</p>
                  <p className="text-gray-400"><strong className="text-white">Expirare:</strong> 1 an</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8 mb-6 bg-linear-to-br from-orange-500/10 to-purple-500/10 border-orange-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">⚙️ Setări Cookies</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white">Cookies Esențiale</h3>
                  <p className="text-sm text-gray-400">Necesare pentru funcționare</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-5 h-5 opacity-50"
                  />
                  <span className="text-gray-500 text-sm">Obligatorii</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white">Google Analytics</h3>
                  <p className="text-sm text-gray-400">Statistici anonime</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white">Marketing</h3>
                  <p className="text-sm text-gray-400">Publicitate personalizată</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="btn-primary w-full mt-6 py-3"
            >
              Salvează preferințele
            </button>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Cum gestionezi cookies?</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-2">🌐 Din browser</h3>
                <p className="text-sm mb-2">Poți șterge sau bloca cookies din setările browserului:</p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong className="text-white">Chrome:</strong> Setări → Confidențialitate → Cookie-uri</li>
                  <li>• <strong className="text-white">Firefox:</strong> Opțiuni → Confidențialitate → Cookie-uri</li>
                  <li>• <strong className="text-white">Safari:</strong> Preferințe → Confidențialitate → Cookie-uri</li>
                  <li>• <strong className="text-white">Edge:</strong> Setări → Cookie-uri și permisiuni site</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">⚙️ Din setările de mai sus</h3>
                <p className="text-sm">Folosește toggle-urile pentru cookies opționale (Analytics, Marketing)</p>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded">
                <p className="text-sm text-orange-400">
                  <strong>Atenție:</strong> Blocarea cookies esențiale poate afecta funcționarea platformei (ex: nu te poți autentifica).
                </p>
              </div>
            </div>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Google Analytics și confidențialitate</h2>
            <p className="text-gray-300 mb-4">
              Folosim Google Analytics 4 (GA4) pentru a înțelege cum interacționezi cu platforma. Datele sunt anonimizate și agregate.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• <strong className="text-white">IP anonimizat:</strong> Ultimul octet e mascat (ex: 123.45.67.XXX)</li>
              <li>• <strong className="text-white">Fără date personale:</strong> GA4 nu primește nume, email sau telefon</li>
              <li>• <strong className="text-white">Opt-out:</strong> Poți dezactiva din setările de mai sus sau instalând <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline">Google Analytics Opt-out Browser Add-on</a></li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Durata de stocare</h2>
            <div className="space-y-2 text-gray-300">
              <p>• <strong className="text-white">Cookies esențiale:</strong> Până la logout sau 30 zile</p>
              <p>• <strong className="text-white">Google Analytics (_ga):</strong> 2 ani</p>
              <p>• <strong className="text-white">Google Analytics (_gid):</strong> 24 ore</p>
              <p>• <strong className="text-white">Preferințe utilizator:</strong> 1 an</p>
            </div>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Modificări politică</h2>
            <p className="text-gray-300">
              Ne rezervăm dreptul de a actualiza această politică. Orice schimbare va fi anunțată pe platformă și prin actualizarea datei de mai sus.
            </p>
          </div>

          <div className="card p-8 bg-orange-500/5 border-orange-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
            <p className="text-gray-300 mb-4">Pentru întrebări despre cookies:</p>
            <p className="text-gray-300">
              <strong className="text-white">Email:</strong>{' '}
              <a href="mailto:privacy@curierulperfect.com" className="text-orange-400">privacy@curierulperfect.com</a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/confidentialitate" className="btn-primary px-6 py-3">
              Politica de Confidențialitate
            </Link>
            <Link href="/gdpr" className="btn-secondary px-6 py-3">
              Drepturile GDPR
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
