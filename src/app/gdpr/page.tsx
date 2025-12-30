import Link from 'next/link';

export default function GDPRPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Conform UK GDPR
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Drepturile Tale <span className="text-gradient">GDPR</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Ai control deplin asupra datelor tale personale
          </p>
          <p className="text-gray-500 text-sm mt-4">Ultima actualizare: 30 Decembrie 2025</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Rights Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {/* Access */}
            <div className="card p-6 hover:border-blue-500/30 transition group">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dreptul de acces</h3>
              <p className="text-sm text-gray-400">Poți solicita o copie completă a datelor personale pe care le deținem despre tine.</p>
            </div>

            {/* Rectification */}
            <div className="card p-6 hover:border-emerald-500/30 transition group">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dreptul la rectificare</h3>
              <p className="text-sm text-gray-400">Poți corecta orice date inexacte sau incomplete din contul tău.</p>
            </div>

            {/* Deletion */}
            <div className="card p-6 hover:border-red-500/30 transition group">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dreptul la ștergere</h3>
              <p className="text-sm text-gray-400">&quot;Dreptul de a fi uitat&quot; - poți cere ștergerea completă a datelor tale.</p>
            </div>

            {/* Restriction */}
            <div className="card p-6 hover:border-amber-500/30 transition group">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dreptul la restricționare</h3>
              <p className="text-sm text-gray-400">Poți limita modul în care folosim datele tale în anumite situații.</p>
            </div>

            {/* Portability */}
            <div className="card p-6 hover:border-purple-500/30 transition group">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dreptul la portabilitate</h3>
              <p className="text-sm text-gray-400">Poți primi datele tale într-un format structurat și portabil.</p>
            </div>

            {/* Opposition */}
            <div className="card p-6 hover:border-pink-500/30 transition group">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Dreptul la opoziție</h3>
              <p className="text-sm text-gray-400">Te poți opune procesării datelor în scopuri de marketing.</p>
            </div>
          </div>

          {/* How to exercise rights */}
          <div className="card p-6 sm:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Cum îți exerciți drepturile?</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Pentru a-ți exercita oricare dintre drepturile GDPR, ne poți contacta prin email la{' '}
              <a href="mailto:contact@curierulperfect.com" className="text-orange-400 hover:underline font-medium">
                contact@curierulperfect.com
              </a>. Vom răspunde în cel mai scurt timp posibil conform UK GDPR.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold text-white">Gratuit</span>
                </div>
                <p className="text-sm text-gray-400">Prima cerere GDPR este gratuită conform legii.</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-white">Răspuns rapid</span>
                </div>
                <p className="text-sm text-gray-400">Procesăm cererile în cel mai scurt timp posibil.</p>
              </div>
            </div>
          </div>

          {/* Contact DPO */}
          <div className="card p-6 sm:p-8 bg-linear-to-br from-orange-500/5 to-purple-500/5 border-orange-500/20">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Contact</h2>
              <p className="text-gray-400 text-sm">Pentru întrebări despre datele tale sau drepturile GDPR</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <a href="mailto:contact@curierulperfect.com" className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-white font-semibold text-sm">contact@curierulperfect.com</p>
                </div>
              </a>
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Autoritate UK</p>
                  <p className="text-white font-semibold text-sm">ICO (ico.org.uk)</p>
                </div>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/confidentialitate" className="btn-primary px-6 py-3 text-center">
              Politica de Confidențialitate
            </Link>
            <Link href="/cookies" className="btn-secondary px-6 py-3 text-center">
              Politica Cookies
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
