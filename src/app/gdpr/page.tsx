'use client';

import { useState } from 'react';
import Link from 'next/link';
import { showSuccess, showError } from '@/lib/toast';

export default function GDPRPage() {
  const [requestType, setRequestType] = useState<string>('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess('Cererea ta GDPR a fost înregistrată. Vom răspunde în max. 30 zile.');
      setRequestType('');
      setEmail('');
      setDetails('');
    } catch (error) {
      showError('Eroare la trimiterea cererii. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Drepturile Tale <span className="text-gradient">GDPR</span>
          </h1>
          <p className="text-xl text-gray-300">
            Ai control deplin asupra datelor tale personale
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg mt-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-semibold">Conformi Regulamentului (UE) 2016/679</span>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: '📖',
                title: 'Dreptul de acces',
                desc: 'Poți solicita o copie completă a datelor personale pe care le deținem despre tine',
                action: 'Solicită acces'
              },
              {
                icon: '✏️',
                title: 'Dreptul la rectificare',
                desc: 'Poți corecta orice date inexacte sau incomplete din contul tău',
                action: 'Corectează date'
              },
              {
                icon: '🗑️',
                title: 'Dreptul la ștergere',
                desc: '"Dreptul de a fi uitat" - poți cere ștergerea completă a datelor tale',
                action: 'Șterge datele'
              },
              {
                icon: '⛔',
                title: 'Dreptul la restricționare',
                desc: 'Poți limita modul în care folosim datele tale în anumite situații',
                action: 'Restricționează'
              },
              {
                icon: '📦',
                title: 'Dreptul la portabilitate',
                desc: 'Poți primi datele tale într-un format structurat și portabil',
                action: 'Export date'
              },
              {
                icon: '🚫',
                title: 'Dreptul la opoziție',
                desc: 'Poți te opui procesării datelor în scopuri de marketing sau alte scopuri',
                action: 'Opune-te'
              }
            ].map((right, idx) => (
              <div key={idx} className="card p-6 hover:border-orange-500/30 transition">
                <div className="text-4xl mb-3">{right.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{right.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{right.desc}</p>
                <button 
                  onClick={() => setRequestType(right.title)}
                  className="text-orange-400 hover:text-orange-300 text-sm font-semibold"
                >
                  {right.action} →
                </button>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Trimite cerere GDPR</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Tipul cererii *</label>
                  <select
                    required
                    className="form-input w-full"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                  >
                    <option value="">Selectează dreptul</option>
                    <option value="Dreptul de acces">📖 Acces la date</option>
                    <option value="Dreptul la rectificare">✏️ Rectificare date</option>
                    <option value="Dreptul la ștergere">🗑️ Ștergere date ("Dreptul de a fi uitat")</option>
                    <option value="Dreptul la restricționare">⛔ Restricționare procesare</option>
                    <option value="Dreptul la portabilitate">📦 Portabilitate date</option>
                    <option value="Dreptul la opoziție">🚫 Opoziție procesare</option>
                    <option value="Revocare consimțământ">❌ Revocare consimțământ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email cont *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@exemplu.ro"
                    className="form-input w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Trebuie să fie emailul asociat contului tău
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Detalii suplimentare</label>
                  <textarea
                    rows={4}
                    placeholder="Descrie cererea ta (opțional dar recomandat)..."
                    className="form-input w-full resize-none"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded text-sm text-gray-300">
                  <p>
                    <strong className="text-blue-400">Notă:</strong> Vei primi confirmare pe email și vom răspunde cererii 
                    în maxim <strong className="text-white">30 zile</strong> conform GDPR.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 disabled:opacity-50"
                >
                  {loading ? 'Se trimite...' : 'Trimite cererea GDPR'}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Cum funcționează?</h3>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Trimiți cererea', desc: 'Completezi formularul cu tipul cererii GDPR' },
                    { step: '2', title: 'Verificăm identitatea', desc: 'Confirmăm că ești proprietarul contului' },
                    { step: '3', title: 'Procesăm cererea', desc: 'Echipa noastră analizează și pregătește răspunsul' },
                    { step: '4', title: 'Primești răspuns', desc: 'Te contactăm în max. 30 zile cu soluția' }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-orange-400">{item.step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 bg-emerald-500/5 border-emerald-500/20">
                <h3 className="text-lg font-bold text-white mb-3">✅ Garanțiile noastre</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    Răspuns în max. 30 zile conform GDPR
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    Gratuit (prima cerere GDPR)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    Confidențialitate deplină
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    Fără întrebări nedorite
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">•</span>
                    Confirmări clare pe email
                  </li>
                </ul>
              </div>

              <div className="card p-6 bg-orange-500/5 border-orange-500/20">
                <h3 className="text-lg font-bold text-white mb-3">📋 Ce date poți solicita?</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    Date cont (nume, email, telefon)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    Istoric comenzi complete
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    Mesaje chat cu curieri
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    Recenzii scrise/primite
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    Loguri activitate (login, acțiuni)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400">•</span>
                    Preferințe și setări
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Întrebări frecvente GDPR</h2>
            <div className="space-y-4">
              <details className="group">
                <summary className="p-4 cursor-pointer flex justify-between items-center bg-slate-800/50 rounded-lg">
                  <span className="font-semibold text-white">Cât durează să primesc datele mele?</span>
                  <svg className="w-5 h-5 text-orange-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-4 text-gray-300 text-sm">
                  Maximum 30 zile conform GDPR. De obicei răspundem în 7-14 zile. Vei primi datele pe email în format JSON sau PDF.
                </div>
              </details>

              <details className="group">
                <summary className="p-4 cursor-pointer flex justify-between items-center bg-slate-800/50 rounded-lg">
                  <span className="font-semibold text-white">Pot șterge contul fără să aștept 30 zile?</span>
                  <svg className="w-5 h-5 text-orange-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-4 text-gray-300 text-sm">
                  Da! Poți șterge contul instant din setările contului. Cererea GDPR formală e necesară doar dacă vrei confirmări detaliate sau ai comenzi active.
                </div>
              </details>

              <details className="group">
                <summary className="p-4 cursor-pointer flex justify-between items-center bg-slate-800/50 rounded-lg">
                  <span className="font-semibold text-white">Ce se întâmplă cu comenzile după ștergerea contului?</span>
                  <svg className="w-5 h-5 text-orange-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-4 text-gray-300 text-sm">
                  Păstrăm datele comenzilor 5 ani pentru obligații fiscale (conform legii contabilității). Datele sunt anonimizate (nume → "Utilizator #12345").
                </div>
              </details>

              <details className="group">
                <summary className="p-4 cursor-pointer flex justify-between items-center bg-slate-800/50 rounded-lg">
                  <span className="font-semibold text-white">Pot reclama la ANSPDCP dacă nu sunt mulțumit?</span>
                  <svg className="w-5 h-5 text-orange-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-4 text-gray-300 text-sm">
                  Da, ai dreptul la plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP): 
                  <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline ml-1">
                    www.dataprotection.ro
                  </a>
                </div>
              </details>

              <details className="group">
                <summary className="p-4 cursor-pointer flex justify-between items-center bg-slate-800/50 rounded-lg">
                  <span className="font-semibold text-white">Costă bani să-mi exercit drepturile GDPR?</span>
                  <svg className="w-5 h-5 text-orange-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="p-4 text-gray-300 text-sm">
                  NU. Prima cerere GDPR e gratuită conform legii. Dacă faci cereri multiple excesive/nejustificate în timp scurt, putem percepe o taxă rezonabilă sau refuza (conform Art. 12 GDPR).
                </div>
              </details>
            </div>
          </div>

          <div className="card p-8 bg-gradient-to-br from-orange-500/10 to-purple-500/10 border-orange-500/20">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Contact DPO</h2>
            <p className="text-gray-300 mb-6 text-center">
              Pentru orice întrebare despre datele tale sau drepturile GDPR:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <a href="mailto:privacy@curierulperfect.com" className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Email DPO</p>
                  <p className="text-white font-semibold">privacy@curierulperfect.com</p>
                </div>
              </a>
              <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Autoritate</p>
                  <p className="text-white font-semibold">ANSPDCP</p>
                </div>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/confidentialitate" className="btn-primary px-6 py-3">
              Politica de Confidențialitate
            </Link>
            <Link href="/cookies" className="btn-secondary px-6 py-3">
              Politica Cookies
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
