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
    } catch (error) {
      showError('Eroare la trimiterea reclamației. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900">
      <section className="py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Reclamații și <span className="text-gradient">Soluționare Conflicte</span>
          </h1>
          <p className="text-xl text-gray-300">
            Ne pare rău pentru experiența ta. Vrem să rezolvăm situația rapid și echitabil.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <div className="card p-8 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">Formular reclamație</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nume complet *</label>
                  <input
                    type="text"
                    required
                    className="form-input w-full"
                    value={formData.nume}
                    onChange={(e) => setFormData({...formData, nume: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    className="form-input w-full"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Număr comandă</label>
                  <input
                    type="text"
                    placeholder="Ex: #CP141135"
                    className="form-input w-full"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Tipul reclamației *</label>
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
                    <option value="comportament">Comportament neprofesionist curier</option>
                    <option value="pret">Neclarități preț/facturare</option>
                    <option value="anulare">Anulare comandă</option>
                    <option value="altele">Altele</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Descrierea problemei *</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Descrie detaliat ce s-a întâmplat..."
                    className="form-input w-full resize-none"
                    value={formData.descriere}
                    onChange={(e) => setFormData({...formData, descriere: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Documente suport (poze, facturi)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="form-input w-full"
                    onChange={(e) => setFormData({...formData, documente: e.target.files ? Array.from(e.target.files) : null})}
                  />
                  <p className="text-xs text-gray-500 mt-1">Poți încărca poze sau PDF-uri (max 10MB/fișier)</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 disabled:opacity-50"
                >
                  {loading ? 'Se trimite...' : 'Trimite reclamația'}
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Proces soluționare</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Primim reclamația', time: 'Instant', desc: 'Reclamația ta este înregistrată automat în sistem' },
                  { step: '2', title: 'Investigăm cazul', time: '24-48 ore', desc: 'Analizăm detaliile și discutăm cu curieru' },
                  { step: '3', title: 'Propunem soluție', time: '48-72 ore', desc: 'Îți comunicăm decizia și pașii următori' },
                  { step: '4', title: 'Implementăm soluția', time: '3-7 zile', desc: 'Aplicăm măsurile corective sau compensații' }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-orange-400">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="text-sm text-orange-400 mb-1">{item.time}</p>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 bg-blue-500/5 border-blue-500/20">
              <h3 className="text-lg font-bold text-white mb-3">📋 Ce informații să incluzi?</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Numărul comenzii (#CP141135)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Data și ora incidentului
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Numele curierului (dacă știi)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Poze ale problemei (colet deteriorat, etc.)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  Orice comunicare relevantă (mesaje chat)
                </li>
              </ul>
            </div>

            <div className="card p-6 bg-emerald-500/5 border-emerald-500/20">
              <h3 className="text-lg font-bold text-white mb-3">✅ Politica noastră</h3>
              <p className="text-sm text-gray-300 mb-3">
                Curierul Perfect se angajează să medieze conflictele echitabil și transparent. 
                Ținem cont de versiunile ambelor părți și aplicăm soluții potrivite situației.
              </p>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong className="text-emerald-400">Deteriorare colet:</strong> Caz cu caz, bazat pe asigurare</p>
                <p><strong className="text-emerald-400">Comportament:</strong> Avertisment/suspendare curier</p>
                <p><strong className="text-emerald-400">Întârziere:</strong> Compensații negociate</p>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-bold text-white mb-3">Contact direct</h3>
              <p className="text-gray-300 text-sm mb-4">Pentru urgențe, contactează-ne imediat:</p>
              <div className="space-y-2">
                <a href="mailto:contact@curierulperfect.com" className="block text-orange-400 hover:text-orange-300">
                  contact@curierulperfect.com
                </a>
                <a href="https://wa.me/447880312621" target="_blank" rel="noopener noreferrer" className="block text-emerald-400 hover:text-emerald-300">
                  WhatsApp: +44 788 031 2621
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
