'use client';

import { useState } from 'react';
import { showSuccess, showError } from '@/lib/toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    telefon: '',
    subiect: '',
    mesaj: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Eroare la trimiterea mesajului');
      }

      showSuccess('Mesajul tău a fost trimis! Îți vom răspunde în 24-48 ore. Verifică și inbox-ul pentru confirmare.');
      setFormData({ nume: '', email: '', telefon: '', subiect: '', mesaj: '' });
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Eroare la trimiterea mesajului. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900">
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] [filter:drop-shadow(0_0_30px_rgba(251,146,60,0.5))]">
            Contactează-ne
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-lg mx-auto">
            Suntem aici să te ajutăm! Scrie-ne și îți răspundem rapid.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {/* Formular */}
          <div className="card p-5 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Trimite-ne un mesaj</h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm sm:text-base text-gray-300 mb-1.5 sm:mb-2">Nume complet *</label>
                <input
                  type="text"
                  required
                  className="form-input w-full"
                  value={formData.nume}
                  onChange={(e) => setFormData({...formData, nume: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-300 mb-1.5 sm:mb-2">Email *</label>
                <input
                  type="email"
                  required
                  className="form-input w-full text-sm sm:text-base min-h-11"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-300 mb-1.5 sm:mb-2">Telefon</label>
                <input
                  type="tel"
                  className="form-input w-full text-sm sm:text-base min-h-11"
                  value={formData.telefon}
                  onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-300 mb-1.5 sm:mb-2">Subiect *</label>
                <select
                  required
                  className="form-input w-full text-sm sm:text-base min-h-11"
                  value={formData.subiect}
                  onChange={(e) => setFormData({...formData, subiect: e.target.value})}
                >
                  <option value="">Selectează subiectul</option>
                  <option value="comanda">Întrebare despre comandă</option>
                  <option value="curier">Devin curier partener</option>
                  <option value="suport">Suport tehnic</option>
                  <option value="reclamatie">Reclamație</option>
                  <option value="facturare">Facturare</option>
                  <option value="altele">Altele</option>
                </select>
              </div>

              <div>
                <label className="block text-sm sm:text-base text-gray-300 mb-1.5 sm:mb-2">Mesajul tău *</label>
                <textarea
                  required
                  rows={5}
                  className="form-input w-full resize-none text-sm sm:text-base"
                  value={formData.mesaj}
                  onChange={(e) => setFormData({...formData, mesaj: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative group/btn w-full py-3 min-h-12 text-sm sm:text-base rounded-xl font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 transition-transform group-hover/btn:scale-110"></div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-xl blur-lg opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
                {/* Content */}
                <span className="relative z-10 text-white">{loading ? 'Se trimite...' : 'Trimite mesajul'}</span>
              </button>
            </form>
          </div>

          {/* Info contact */}
          <div className="space-y-4 sm:space-y-6">
            <div className="card p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-orange-500/10 rounded-lg shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-1">Email</h3>
                  <a href="mailto:contact@curierulperfect.com" className="text-orange-400 hover:text-orange-300 text-sm sm:text-base break-all">
                    contact@curierulperfect.com
                  </a>
                </div>
              </div>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-emerald-500/10 rounded-lg shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-1">WhatsApp</h3>
                  <a href="https://wa.me/447880312621" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 text-sm sm:text-base">
                    +44 788 031 2621
                  </a>
                </div>
              </div>
            </div>

            <div className="card p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-blue-500/10 rounded-lg shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-1">Program</h3>
                  <p className="text-sm sm:text-base text-gray-300">Luni - Vineri: 9:00 - 18:00</p>
                  <p className="text-sm sm:text-base text-gray-300">Sâmbătă: 10:00 - 14:00</p>
                </div>
              </div>
            </div>

            <div className="card p-4 sm:p-6 bg-gradient-to-br from-orange-500/10 to-purple-500/10 border-orange-500/20">
              <h3 className="font-bold text-white text-sm sm:text-base mb-3">Social Media</h3>
              <div className="flex gap-2 sm:gap-3">
                <a href="https://www.facebook.com/profile.php?id=61571831621426" target="_blank" rel="noopener noreferrer" className="p-2.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-lg transition min-w-11 min-h-11 flex items-center justify-center" aria-label="Facebook">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
