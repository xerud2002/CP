'use client';

import Link from 'next/link';

export default function ConfidentialitatePage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <section className="py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Politica de <span className="text-gradient">Confidențialitate</span>
          </h1>
          <p className="text-gray-300">Ultima actualizare: Ianuarie 2025</p>
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg mt-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-semibold">Conformi GDPR</span>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introducere</h2>
            <p className="text-gray-300 leading-relaxed">
              Curierul Perfect respectă confidențialitatea datelor tale personale și se angajează să le protejeze conform 
              Regulamentului General privind Protecția Datelor (GDPR) și legislației române aplicabile.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">2. Date Colectate</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.1 Date furnizate direct de tine</h3>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li>• <strong className="text-white">Cont:</strong> Nume, email, telefon, parolă (criptată)</li>
              <li>• <strong className="text-white">Comenzi:</strong> Adrese ridicare/livrare, detalii colet, date transport</li>
              <li>• <strong className="text-white">Curieri:</strong> CI/pașaport, RCA, certificat înmatriculare vehicul</li>
              <li>• <strong className="text-white">Comunicare:</strong> Mesaje chat, recenzii, întrebări suport</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">2.2 Date colectate automat</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• IP, browser, dispozitiv, sistem operare</li>
              <li>• Cookies și tehnologii de tracking (vezi <Link href="/cookies" className="text-orange-400">Politica Cookies</Link>)</li>
              <li>• Google Analytics pentru statistici utilizare</li>
              <li>• Loguri activitate platformă (comenzi, login, etc.)</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">3. Cum Folosim Datele</h2>
            <div className="space-y-3 text-gray-300">
              <p><strong className="text-white">✓</strong> Furnizarea serviciilor platformei (intermediere comenzi)</p>
              <p><strong className="text-white">✓</strong> Comunicare între clienți și curieri (chat)</p>
              <p><strong className="text-white">✓</strong> Verificare identitate curieri (siguranță)</p>
              <p><strong className="text-white">✓</strong> Customer support și răspuns întrebări</p>
              <p><strong className="text-white">✓</strong> Îmbunătățirea platformei (feedback, analytics)</p>
              <p><strong className="text-white">✓</strong> Prevenirea fraudelor și abuzurilor</p>
              <p><strong className="text-white">✓</strong> Notificări despre comenzi (email, SMS)</p>
              <p><strong className="text-white">✓</strong> Marketing (cu consimțământ explicit - newsletter)</p>
            </div>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">4. Partajarea Datelor</h2>
            <p className="text-gray-300 mb-4">
              <strong className="text-orange-400">Nu vindem datele tale niciodată.</strong> Le partajăm doar în următoarele cazuri:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• <strong className="text-white">Cu curierii:</strong> Când plasezi comandă, curieru vede numele, telefon, adresele ridicare/livrare</li>
              <li>• <strong className="text-white">Cu clienții:</strong> Curierii văd numele și contactul clientului pentru comenzile acceptate</li>
              <li>• <strong className="text-white">Furnizori terți:</strong> Firebase (hosting date), Google Analytics (statistici), servicii email</li>
              <li>• <strong className="text-white">Autorități:</strong> Dacă legea o cere (investigații, măsuri legale)</li>
              <li>• <strong className="text-white">Achiziție/fuziune:</strong> În caz de vânzare/transfer business</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">5. Securitatea Datelor</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="font-semibold text-white">Criptare SSL/TLS</p>
                  <p className="text-sm">Tot traficul HTTPS</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="font-semibold text-white">Firebase Security</p>
                  <p className="text-sm">Reguli stricte acces date</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <div>
                  <p className="font-semibold text-white">Parole criptate</p>
                  <p className="text-sm">Firebase Auth + hashing</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="font-semibold text-white">Backup regulat</p>
                  <p className="text-sm">Copii de siguranță automate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">6. Drepturile Tale (GDPR)</h2>
            <div className="space-y-3 text-gray-300">
              <p><strong className="text-white">📖 Dreptul de acces:</strong> Poți solicita o copie a datelor tale</p>
              <p><strong className="text-white">✏️ Dreptul la rectificare:</strong> Poți corecta date incorecte</p>
              <p><strong className="text-white">🗑️ Dreptul la ștergere:</strong> Poți cere ștergerea datelor (&quot;dreptul de a fi uitat&quot;)</p>
              <p><strong className="text-white">⛔ Dreptul la restricționare:</strong> Poți limita procesarea datelor</p>
              <p><strong className="text-white">📦 Dreptul la portabilitate:</strong> Poți primi datele în format exportabil</p>
              <p><strong className="text-white">🚫 Dreptul la opoziție:</strong> Poți refuza marketing sau prelucrări anume</p>
              <p><strong className="text-white">⚖️ Dreptul la plângere:</strong> Poți contacta Autoritatea de Supraveghere (ANSPDCP)</p>
            </div>
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong className="text-orange-400">Cum îți exerciți drepturile:</strong> Trimite email la{' '}
                <a href="mailto:privacy@curierulperfect.com" className="text-orange-400 underline">privacy@curierulperfect.com</a>{' '}
                sau din setările contului. Răspundem în max. 30 zile.
              </p>
            </div>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">7. Reținerea Datelor</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• <strong className="text-white">Cont activ:</strong> Până când îl ștergi</li>
              <li>• <strong className="text-white">Comenzi:</strong> 5 ani (obligație fiscală)</li>
              <li>• <strong className="text-white">Mesaje chat:</strong> 2 ani după finalizarea comenzii</li>
              <li>• <strong className="text-white">Loguri securitate:</strong> 1 an</li>
              <li>• <strong className="text-white">După ștergere cont:</strong> Anonimizăm/ștergem datele în 30 zile (păstrăm doar ce e necesar legal)</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">8. Cookies și Tracking</h2>
            <p className="text-gray-300 mb-4">
              Folosim cookies pentru funcționare, analytics și îmbunătățiri. Detalii complete în{' '}
              <Link href="/cookies" className="text-orange-400 underline">Politica Cookies</Link>.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• <strong className="text-white">Cookies esențiale:</strong> Autentificare, securitate (obligatorii)</li>
              <li>• <strong className="text-white">Google Analytics:</strong> Statistici anonime (poți refuza)</li>
              <li>• <strong className="text-white">Marketing cookies:</strong> Doar cu consimțământ explicit</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">9. Minori</h2>
            <p className="text-gray-300">
              Platforma este destinată persoanelor cu vârstă ≥18 ani. Nu colectăm intenționat date de la minori. 
              Dacă descoperi că un minor și-a creat cont, contactează-ne imediat pentru ștergere.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">10. Transferuri Internaționale</h2>
            <p className="text-gray-300">
              Datele sunt stocate pe servere Firebase (Google Cloud Platform) în Europa (locație: Belgium). 
              Google respectă GDPR și folosește clauze contractuale standard UE pentru transferuri în afara SEE.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">11. Modificări Politică</h2>
            <p className="text-gray-300">
              Putem actualiza această politică periodic. Modificările majore vor fi anunțate prin email sau notificare pe platformă. 
              Data ultimei actualizări este afișată în capul paginii.
            </p>
          </div>

          <div className="card p-8 bg-orange-500/5 border-orange-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact DPO</h2>
            <p className="text-gray-300 mb-4">Pentru întrebări despre date personale sau GDPR:</p>
            <p className="text-gray-300">
              <strong className="text-white">Email Privacy:</strong>{' '}
              <a href="mailto:privacy@curierulperfect.com" className="text-orange-400">privacy@curierulperfect.com</a><br/>
              <strong className="text-white">Suport General:</strong>{' '}
              <a href="mailto:support@curierulperfect.com" className="text-orange-400">support@curierulperfect.com</a><br/>
              <strong className="text-white">ANSPDCP:</strong>{' '}
              <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-orange-400">
                www.dataprotection.ro
              </a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/gdpr" className="btn-primary px-6 py-3">
              Vezi Drepturile GDPR
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
