'use client';

export default function TermeniPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <section className="py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Termeni și <span className="text-gradient">Condiții</span>
          </h1>
          <p className="text-gray-300">Ultima actualizare: Ianuarie 2025</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert prose-orange">
          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptarea Termenilor</h2>
            <p className="text-gray-300 leading-relaxed">
              Prin accesarea și utilizarea platformei Curierul Perfect, confirmi că ai citit, înțeles și acceptat acești termeni și condiții. 
              Dacă nu ești de acord cu oricare dintre aceste prevederi, te rugăm să nu folosești platforma.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">2. Definiții</h2>
            <ul className="space-y-2 text-gray-300">
              <li><strong className="text-white">Platforma:</strong> Website-ul Curierul Perfect și serviciile asociate</li>
              <li><strong className="text-white">Client:</strong> Utilizator care plasează comenzi de transport</li>
              <li><strong className="text-white">Curier:</strong> Transportator verificat care oferă servicii prin platformă</li>
              <li><strong className="text-white">Comandă:</strong> Cerere de transport plasată de client</li>
              <li><strong className="text-white">Servicii:</strong> Toate categoriile de transport oferite (colete, mobilă, persoane, etc.)</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">3. Serviciile Platformei</h2>
            <p className="text-gray-300 mb-4">Curierul Perfect oferă:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Intermediere între clienți și curieri</li>
              <li>• Platformă de comunicare directă (chat)</li>
              <li>• Sistem de rating și recenzii</li>
              <li>• Suport tehnic și customer service</li>
              <li>• Verificare identitate și documente curieri</li>
            </ul>
            <p className="text-gray-300 mt-4">
              <strong className="text-orange-400">Important:</strong> Curierul Perfect este platformă de intermediere. 
              Nu suntem parte în contractul de transport stabilit între client și curier.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">4. Utilizarea Contului</h2>
            <h3 className="text-xl font-semibold text-white mb-2">4.1 Înregistrare</h3>
            <p className="text-gray-300 mb-4">
              Pentru a folosi platforma trebuie să creezi un cont cu informații corecte și actualizate. 
              Ești responsabil pentru confidențialitatea parolei și toate activitățile din contul tău.
            </p>
            <h3 className="text-xl font-semibold text-white mb-2">4.2 Condiții de eligibilitate</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Vârstă minimă: 18 ani</li>
              <li>• Capacitate juridică deplină</li>
              <li>• Date reale și verificabile</li>
              <li>• Acordul de a respecta termenii platformei</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">5. Obligații Clienți</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Să furnizeze informații corecte despre comandă</li>
              <li>• Să descrie acurat conținutul și dimensiunile coletului</li>
              <li>• Să declare marfă periculoasă/interzisă (dacă e cazul)</li>
              <li>• Să respecte termenii negociați cu curieru</li>
              <li>• Să plătească curieru conform înțelegerii directe</li>
              <li>• Să respecte timpul curierului și să fie disponibil la ridicare/livrare</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">6. Obligații Curieri</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Să dețină documentele legale necesare (CI, RCA, certificat înmatriculare)</li>
              <li>• Să furnizeze servicii profesionale și respectuoase</li>
              <li>• Să respecte termenii negociați cu clientul</li>
              <li>• Să comunice promt în caz de întârzieri sau probleme</li>
              <li>• Să asigure integritatea coletului pe durata transportului</li>
              <li>• Să dețină asigurare de răspundere civilă valabilă</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">7. Prețuri și Plăți</h2>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">7.1 Prețuri:</strong> Sunt negociate direct între client și curier. 
              Curierul Perfect nu percepe comisioane de la clienți.
            </p>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">7.2 Metode de plată:</strong> Se stabilesc direct între părți (cash, transfer, etc.). 
              Platforma nu procesează plăți.
            </p>
            <p className="text-gray-300">
              <strong className="text-white">7.3 Facturare:</strong> Dacă curieru este persoană juridică, poate emite factură la cerere.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">8. Anulări și Modificări</h2>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">8.1 Anulare înainte de acceptare curier:</strong> Gratuită, oricând.
            </p>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">8.2 Anulare după acceptare:</strong> Se negociază direct cu curieru. 
              Curieru poate solicita compensații pentru timp/costuri (ex: drum parcurs).
            </p>
            <p className="text-gray-300">
              <strong className="text-white">8.3 Modificări comandă:</strong> Orice modificare majoră (rută, dată) trebuie discutată și acceptată de curier.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">9. Răspundere și Asigurări</h2>
            <p className="text-gray-300 mb-4">
              <strong className="text-orange-400">Important:</strong> Curierul Perfect este platformă de intermediere și NU este parte în contractul de transport.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Răspunderea pentru transport revine 100% curierului</li>
              <li>• Recomandăm asigurare pentru marfă valoroasă</li>
              <li>• Curierii trebuie să aibă RCA valabil</li>
              <li>• În caz de deteriorare/pierdere, clientul se adresează direct curierului și asigurării acestuia</li>
              <li>• Platforma mediază conflictele dar nu este răspunzătoare financiar</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">10. Proprietate Intelectuală</h2>
            <p className="text-gray-300">
              Tot conținutul platformei (logo, texte, design, cod) este proprietatea Curierul Perfect. 
              Nu ai dreptul să copiezi, reproduci sau distribui fără acordul nostru scris.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">11. Suspendare și Încheiere Cont</h2>
            <p className="text-gray-300 mb-4">Ne rezervăm dreptul de a suspenda/închide contul tău dacă:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Încalci acești termeni și condiții</li>
              <li>• Furnizezi informații false sau frauduloase</li>
              <li>• Ai comportament abuziv față de curieri sau echipa platformei</li>
              <li>• Folosești platforma pentru activități ilegale</li>
              <li>• Acumulezi recenzii negative repetate</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">12. Modificarea Termenilor</h2>
            <p className="text-gray-300">
              Putem modifica acești termeni oricând. Modificările majore vor fi anunțate prin email sau notificare pe platformă. 
              Continuarea utilizării după modificări înseamnă acceptarea noilor termeni.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">13. Legea Aplicabilă</h2>
            <p className="text-gray-300">
              Acești termeni sunt guvernați de legea română. Orice dispută va fi soluționată amiabil sau, 
              în caz contrar, de instanțele competente din România.
            </p>
          </div>

          <div className="card p-8 bg-orange-500/5 border-orange-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">14. Contact</h2>
            <p className="text-gray-300 mb-4">Pentru întrebări despre termeni și condiții:</p>
            <p className="text-gray-300">
              <strong className="text-white">Email:</strong> <a href="mailto:legal@curierulperfect.com" className="text-orange-400">legal@curierulperfect.com</a><br/>
              <strong className="text-white">Suport:</strong> <a href="mailto:support@curierulperfect.com" className="text-orange-400">support@curierulperfect.com</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
