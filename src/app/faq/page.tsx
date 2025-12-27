'use client';

import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      category: 'Despre platformă',
      questions: [
        { q: 'Ce este Curierul Perfect?', a: 'Curierul Perfect este o platformă care conectează clienți cu transportatori verificați pentru servicii de curierat și transport în România și Europa. Oferim servicii complete: transport colete, plicuri, persoane, mobilă, electronice, animale, platformă auto și tractări.' },
        { q: 'Cât costă să folosesc platforma?', a: 'Platforma este 100% gratuită pentru clienți. Nu percepem comisioane - plătești doar prețul negociat direct cu transportatorul ales.' },
        { q: 'În ce țări activați?', a: 'Acoperim 16 țări din Europa: România, Anglia, Germania, Franța, Italia, Spania, Belgia, Olanda, Austria, Portugalia, Grecia, Irlanda, Danemarca, Suedia, Norvegia și Finlanda.' }
      ]
    },
    {
      category: 'Comenzi și transport',
      questions: [
        { q: 'Cum plasez o comandă?', a: 'Accesează pagina "Plasează comandă", completezi formularul cu detaliile transportului (tip serviciu, rută, dimensiuni, dată), apoi aștepi oferte de la transportatori. Durează 2-3 minute.' },
        { q: 'Cât durează până primesc oferte?', a: 'În general între 2-24 ore. Depinde de disponibilitatea transportatorilor pe ruta ta și de urgența comenzii.' },
        { q: 'Pot anula o comandă?', a: 'Da. Înainte să confirmi un transportator, poți anula gratuit. După confirmare, condițiile de anulare se negociază direct cu curieru.' },
        { q: 'Ce se întâmplă dacă coletul e deteriorat?', a: 'Recomandăm să optezi pentru asigurare transport. În caz de deteriorare, poți face reclamație și curierii sunt obligați să aibă asigurare de răspundere civilă. Contactează-ne la support@curierulperfect.com.' },
        { q: 'Pot urmări coletul în timp real?', a: 'Depinde de transportator. Comunicarea directă prin chat permite actualizări în timp real. Unii curieri oferă tracking GPS.' }
      ]
    },
    {
      category: 'Prețuri și plată',
      questions: [
        { q: 'Cum se stabilesc prețurile?', a: 'Prețurile sunt negociate direct între tine și transportator. Fiecare curier îți trimite oferta sa, tu compari și alegi cea mai bună.' },
        { q: 'Există costuri ascunse?', a: 'Nu. Curierul Perfect nu adaugă comisioane sau taxe. Plătești exact suma negociată cu transportatorul.' },
        { q: 'Cum plătesc transportatorul?', a: 'Metoda de plată o negociezi direct cu curieru: cash la ridicare/livrare, transfer bancar, etc. Nu procesăm plăți prin platformă.' },
        { q: 'Pot cere factură?', a: 'Da, dacă transportatorul e persoană juridică (SRL, PFA), poate emite factură. Discută acest lucru în chat înainte de confirmare.' }
      ]
    },
    {
      category: 'Curieri și siguranță',
      questions: [
        { q: 'Cum sunt verificați curierii?', a: 'Fiecare curier trebuie să prezinte: CI/pașaport, asigurare RCA valabilă, certificat înmatriculare vehicul. Echipa noastră verifică toate documentele înainte de aprobare.' },
        { q: 'Ce fac dacă am probleme cu un curier?', a: 'Contactează-ne imediat la support@curierulperfect.com sau folosește secțiunea "Reclamații". Investigăm fiecare caz și luăm măsuri dacă e necesar.' },
        { q: 'Pot lăsa o recenzie?', a: 'Da, după finalizarea transportului primești notificare să lași o recenzie. Recenziile ajută comunitatea să aleagă cei mai buni curieri.' }
      ]
    },
    {
      category: 'Cont și date personale',
      questions: [
        { q: 'Trebuie să am cont pentru a comanda?', a: 'Da, ai nevoie de cont pentru a plasa comenzi, comunica cu curierii și urmări istoricul transporturilor.' },
        { q: 'Cum îmi protejați datele?', a: 'Folosim criptare SSL, respectăm GDPR și nu vindem datele tale niciodată. Citește Politica de Confidențialitate pentru detalii.' },
        { q: 'Pot șterge contul?', a: 'Da, din setările contului sau contactând support@curierulperfect.com. Datele vor fi șterse conform GDPR.' }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-slate-900">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Întrebări <span className="text-gradient">Frecvente</span>
          </h1>
          <p className="text-xl text-gray-300">
            Găsește răspunsuri rapide la cele mai comune întrebări despre Curierul Perfect
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {faqs.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-white mb-6">{section.category}</h2>
              <div className="space-y-4">
                {section.questions.map((item, qIdx) => (
                  <details key={qIdx} className="card group">
                    <summary className="p-6 cursor-pointer flex justify-between items-center">
                      <span className="font-semibold text-white">{item.q}</span>
                      <svg className="w-5 h-5 text-orange-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6 border-t border-white/5 pt-4 text-gray-300 leading-relaxed">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Nu ai găsit răspunsul?</h2>
          <p className="text-gray-300 mb-8">Echipa noastră de suport e aici să te ajute!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary px-8 py-3">Contactează-ne</Link>
            <a href="https://wa.me/447880312621" target="_blank" rel="noopener noreferrer" className="btn-secondary px-8 py-3 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
