'use client';

import { useState } from 'react';
import { showSuccess, showError } from '@/lib/toast';

export default function ReclamatiiPage() {
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    orderNumber: '',
    tipReclamatie: '',
    descriere: '',
    documente: null as File[] | null
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess('Reclamația ta a fost înregistrată. Echipa noastră va investiga cazul în 48 ore.');
      setFormData({ nume: '', email: '', orderNumber: '', tipReclamatie: '', descriere: '', documente: null });
    } catch {
      showError('Eroare la trimiterea reclamației. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Suport dedicat
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Reclamații și <span className="text-gradient">Soluționare</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Ne pare rău pentru experiența ta. Vrem să rezolvăm situația rapid și echitabil.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Process Steps */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div className="card p-5 text-center group hover:border-orange-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="font-bold text-orange-400 text-lg">1</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Primim cererea</h3>
              <p className="text-xs text-gray-500">Instant</p>
            </div>
            <div className="card p-5 text-center group hover:border-blue-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="font-bold text-blue-400 text-lg">2</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Investigăm</h3>
              <p className="text-xs text-gray-500">24-48 ore</p>
            </div>
            <div className="card p-5 text-center group hover:border-purple-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="font-bold text-purple-400 text-lg">3</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Propunem soluție</h3>
              <p className="text-xs text-gray-500">48-72 ore</p>
            </div>
            <div className="card p-5 text-center group hover:border-emerald-500/30 transition">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="font-bold text-emerald-400 text-lg">4</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Rezolvăm</h3>
              <p className="text-xs text-gray-500">3-7 zile</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form - takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Formular reclamație</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm font-medium">Nume complet *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ion Popescu"
                        className="form-input w-full"
                        value={formData.nume}
                        onChange={(e) => setFormData({...formData, nume: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm font-medium">Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="email@exemplu.ro"
                        className="form-input w-full"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm font-medium">Număr comandă</label>
                      <input
                        type="text"
                        placeholder="Ex: #CP141135"
                        className="form-input w-full"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-sm font-medium">Tipul reclamației *</label>
                      <select
                        required
                        className="form-input w-full"
                        value={formData.tipReclamatie}
                        onChange={(e) => setFormData({...formData, tipReclamatie: e.target.value})}
                      >
                        <option value="">Selectează tipul</option>
                        <option value="intarziere">Întârziere livrare</option>
                        <option value="deteriorare">Colet deteriorat</option>
                        <option value="pierdere">Colet pierdut</option>
                        <option value="comportament">Comportament neprofesionist</option>
                        <option value="pret">Neclarități facturare</option>
                        <option value="anulare">Anulare comandă</option>
                        <option value="altele">Altele</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Descrierea problemei *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Descrie detaliat ce s-a întâmplat, include data și ora incidentului..."
                      className="form-input w-full resize-none"
                      value={formData.descriere}
                      onChange={(e) => setFormData({...formData, descriere: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">Documente suport</label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-4 hover:border-orange-500/30 transition cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => setFormData({...formData, documente: e.target.files ? Array.from(e.target.files) : null})}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-400">Click pentru a încărca poze sau PDF</span>
                        <span className="text-xs text-gray-500 mt-1">Max 10MB/fișier</span>
                      </label>
                    </div>
                    {formData.documente && formData.documente.length > 0 && (
                      <p className="text-xs text-emerald-400 mt-2">
                        {formData.documente.length} fișier(e) selectat(e)
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-base font-semibold disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Se trimite...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Trimite reclamația
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar - takes 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              {/* What to include */}
              <div className="card p-5 bg-blue-500/5 border-blue-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-white">Ce să incluzi?</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Numărul comenzii (#CP...)
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Data și ora incidentului
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Poze cu problema (dacă e cazul)
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Comunicări relevante (chat)
                  </li>
                </ul>
              </div>

              {/* Policy */}
              <div className="card p-5 bg-emerald-500/5 border-emerald-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-white">Politica noastră</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Mediem conflictele echitabil, luând în calcul ambele părți.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-gray-300"><strong className="text-amber-400">Deteriorare:</strong> Bazat pe asigurare</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="text-gray-300"><strong className="text-red-400">Comportament:</strong> Avertisment/suspendare</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="text-gray-300"><strong className="text-blue-400">Întârziere:</strong> Compensații negociate</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="card p-5 bg-linear-to-br from-orange-500/5 to-purple-500/5 border-orange-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-white">Contact urgent</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">Pentru urgențe, contactează-ne direct:</p>
                <div className="space-y-2">
                  <a href="mailto:contact@curierulperfect.com" className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm text-white font-medium">contact@curierulperfect.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
