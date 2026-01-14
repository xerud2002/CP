export default function TermeniPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <section className="py-20 px-4 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Termeni și <span className="text-gradient">Condiții</span>
          </h1>
          <p className="text-gray-300">Actualizat: 14 ianuarie 2026</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert prose-orange">
          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">1. Ce este Curierul Perfect?</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Salut! Bine ai venit pe Curierul Perfect - un loc unde românii conectează rapid cu transportatori verificați, fie că ai un colet de trimis din București în Cluj, fie că muți mobilă sau trimiți un pachet în Anglia.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Folosind platforma noastră, înseamnă că ești OK cu regulile de aici. Dacă ceva nu-ți convine, ne pare rău - dar mai bine să nu o folosești decât să fii nemulțumit după.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">2. Cum funcționează treaba?</h2>
            <p className="text-gray-300 mb-4">În esență, noi facem legătura. Tu (clientul) spui ce trebuie transportat, curierii îți dau prețuri, tu alegi pe cel care ți se potrivește.</p>
            <ul className="space-y-3 text-gray-300">
              <li><strong className="text-white">Clienții</strong> plasează comenzi - de la colete mici până la mutări complete sau transporturi internaționale</li>
              <li><strong className="text-white">Curierii</strong> sunt transportatorii verificați care lucrează prin platformă (inclusiv firme cu kamioni și persoane fizice autorizate)</li>
              <li><strong className="text-white">Platforma</strong> pune la dispoziție chat-ul, sistemul de recenzii, și verificarea documentelor curierilor</li>
            </ul>
            <p className="text-gray-300 mt-4">
              <strong className="text-orange-400">Atenție:</strong> Noi doar intermediem - contractul de transport se face între tine și curier. Dacă se sparge ceva sau întârzie, discuția e direct cu el, nu cu noi.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">3. Cont și înregistrare</h2>
            <p className="text-gray-300 mb-4">
              Ca să folosești platforma trebuie cont. Simplu: email, parolă, câteva date de bază. E responsabilitatea ta să păstrezi parola în siguranță - dacă cineva intră în contul tău și comandă transport pentru 50 de frigidere, problema e a ta, nu a noastră.
            </p>
            <p className="text-gray-300">Trebuie să ai peste 18 ani și să dai date reale. Dacă te prinde cineva că ai pus nume fals sau vârsta mincinoasă, îți închidem contul fără preaviz.</p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">4. Ce trebuie să faci ca și client</h2>
            <p className="text-gray-300 mb-4">Când comanzi un transport, e responsabilitatea ta să:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Descrii corect ce transporti - dimensiuni, greutate, fragilitate. Dacă zici că e un colet mic și apare frigiderul, nu merge.</li>
              <li>• Fii prezent la ora stabilită. Curierii au și alte transporturi - dacă pierzi 2 ore din timpul lor, e posibil să plătești penalizare.</li>
              <li>• Dacă trimiți ceva valoros (electronice, documente importante), spune-i curierului din start. Majoritatea au asigurare suplimentară disponibilă.</li>
              <li>• Respectă prețul negociat. Dacă v-ați înțeles pe 200 lei pentru București-Brașov, nu te răzgândi la ridicare că dai doar 150.</li>
              <li>• Nu trimite lucruri ilegale sau periculoase (arme, droguri, substanțe inflamabile). Dacă o faci, riști și tu și curieru probleme serioase.</li>
            </ul>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">5. Ce trebuie să facă curierii</h2>
            <p className="text-gray-300 mb-4">Transportatorii care lucrează prin platformă trebuie:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Să aibă acte în regulă: CI/pașaport, RCA valabil, certificat înmatriculare dacă folosesc mașina/dubița proprie</li>
              <li>• Să se comporte profesionist - fără limbaj nepotrivit sau comportament agresiv</li>
              <li>• Să respecte termenul de livrare agreat. Dacă întârzie din motive obiective (trafic, vamă), să anunțe clientul din timp</li>
              <li>• Să aibă grijă de colet - dacă se sparge ceva din neglijență, răspund ei</li>
              <li>• Să comunice deschis. Dacă nu pot prelua comanda, să spună din timp, nu cu 10 minute înainte.</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Curierii care strâng recenzii negative repetate sau au comportament inadecvat vor fi scoși de pe platformă.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">6. Banii - cum se plătește?</h2>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">Important:</strong> Platforma e gratis pentru clienți. Zero comision de la tine.
            </p>
            <p className="text-gray-300 mb-4">
              Prețul îl negociezi direct cu curieru. Cash la ridicare, transfer bancar, Revolut - cum vă înțelegeți voi doi. Noi nu procesăm plăți și nu luăm comision de la clienți.
            </p>
            <p className="text-gray-300">
              Dacă curieru e firmă, poate să-ți dea factură. Dacă e persoană fizică autorizată (PFA), la fel. Dacă lucrează „pe negru" (deși nu recomandăm), asta e între voi.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">7. Anulări și schimbări de planuri</h2>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">Înainte să accepte vreun curier:</strong> Anulezi când vrei, fără penalizare.
            </p>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">După ce a acceptat cineva:</strong> Aici se complică. Dacă curieru și-a făcut deja planuri (a refuzat alte comenzi, și-a schimbat ruta), e dreptul lui să ceară compensație. Discutați amiabil - majoritatea sunt oameni de treabă și înțeleg că se întâmplă.
            </p>
            <p className="text-gray-300">
              <strong className="text-white">Schimbări de rută sau dată:</strong> Dacă te răzgândești pe drum (de exemplu, în loc de Cluj vrei la Sibiu), discuți cu curieru și ajustați prețul dacă e cazul. Nu-l lua prin surprindere.
            </p>
          </div>

          <div className="card p-8 mb-6 bg-orange-500/10 border-orange-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">8. Cine răspunde dacă se strică/pierde ceva?</h2>
            <p className="text-gray-300 mb-4">
              <strong className="text-orange-400">Asta e cea mai importantă secțiune - citește-o cu atenție!</strong>
            </p>
            <p className="text-gray-300 mb-4">
              Curierul Perfect e doar platformă de intermediere. Nu suntem noi șoferii, nu noi transportăm. Deci:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li>• Dacă se pierde/strică coletul, răspunderea e 100% a curierului</li>
              <li>• Dacă întârzie, discuți cu curieru, nu cu noi</li>
              <li>• Dacă curieru dispare cu marfa (sper să nu se întâmple niciodată), faci plângere la poliție și contactezi asigurarea lui</li>
            </ul>
            <p className="text-gray-300 mb-4">
              <strong className="text-white">Ce putem face noi:</strong> Te ajutăm să mediezi conflictul, dăm datele curierului la cerere (dacă e nevoie de instanță), îi ștergem contul dacă se dovedește că a fost în neregulă.
            </p>
            <p className="text-gray-300">
              <strong className="text-white">Ce NU putem face:</strong> Să-ți dăm noi bani înapoi. Nu suntem asigurare și nu avem cum să despăgubim pentru lucruri pe care nu le-am transportat noi.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">9. Asigurări - ia-le în serios</h2>
            <p className="text-gray-300 mb-4">
              Majoritatea curierilor au asigurare RCA (obligatorie). Unii au și Casco. Pentru transporturi valoroase (mobilă scumpă, electronice, opere de artă), întreabă curieru dacă are asigurare de marfă.
            </p>
            <p className="text-gray-300">
              Dacă trimiți ceva foarte valoros și curieru nu are asigurare suficientă, asigură-l tu. Costă câțiva zeci de lei și te scapă de potențiale dureri de cap.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">10. Drepturile noastre (și ale tale)</h2>
            <p className="text-gray-300 mb-4">
              Logo-ul Curierul Perfect, design-ul site-ului, textele de aici - toate sunt ale noastre. Nu le poți copia sau folosi pentru alte chestii fără acordul nostru scris.
            </p>
            <p className="text-gray-300">
              Pe de altă parte, datele tale personale sunt ale tale. Le folosim doar pentru funcționarea platformei, nu le vindem la terti. Vezi mai multe detalii în <a href="/confidentialitate" className="text-orange-400 hover:underline">Politica de Confidențialitate</a>.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">11. Când îți închidem contul</h2>
            <p className="text-gray-300 mb-4">Sperăm să nu fie cazul, dar îți putem închide/suspenda contul dacă:</p>
            <ul className="space-y-2 text-gray-300">
              <li>• Încalci în mod repetat regulile de aici</li>
              <li>• Dai date false sau încerci să înșeli alți utilizatori</li>
              <li>• Ai comportament abuziv - insulți, ameninți, hărțuiești alte persoane</li>
              <li>• Folosești platforma pentru chestii ilegale</li>
              <li>• Acumulezi review-uri foarte proaste și nu faci nimic să remediezi situația</li>
            </ul>
            <p className="text-gray-300 mt-4">
              În general, preferăm să rezolvăm problemele amiabil. Dar dacă ești problematic în mod repetat, îți dăm block fără discuții.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">12. Putem schimba regulile?</h2>
            <p className="text-gray-300 mb-4">
              Da, putem. Dacă facem modificări mari, te anunțăm prin email sau notificare pe site. Dacă continui să folosești platforma după modificări, înseamnă că le accepți.
            </p>
            <p className="text-gray-300">
              Dacă nu-ți plac noile reguli, îmi pare rău - dar ai dreptul să-ți ștergi contul oricând.
            </p>
          </div>

          <div className="card p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">13. Legea și jurisdicția</h2>
            <p className="text-gray-300 mb-4">
              Platforma e înregistrată în Regatul Unit, deci se aplică legile britanice. Dacă avem probleme serioase care ajung la instanță, se rezolvă în UK.
            </p>
            <p className="text-gray-300">
              Dar sincer, n-am avut nevoie până acum și sper să nu avem niciodată. Preferăm să rezolvăm totul prin discuții civilizate.
            </p>
          </div>

          <div className="card p-8 bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">14. Ai întrebări sau probleme?</h2>
            <p className="text-gray-300 mb-4">
              Dacă ceva din documentul ăsta nu-i clar, sau ai patanias cu o comandă, scrie-ne:
            </p>
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-white">Email:</strong> <a href="mailto:contact@curierulperfect.com" className="text-orange-400 hover:underline">contact@curierulperfect.com</a></p>
              <p><strong className="text-white">WhatsApp:</strong> <a href="https://wa.me/447880312621" className="text-orange-400 hover:underline">+44 7880 312621</a></p>
            </div>
            <p className="text-gray-300 mt-4">
              De obicei răspundem în maxim 24h (mai repede dacă e urgent). Suntem oameni, nu roboți - așa că vorbește liber.
            </p>
          </div>

          <div className="card p-8 mt-8 bg-slate-800/50">
            <p className="text-gray-400 text-sm text-center">
              Versiunea din 14 ianuarie 2026. © Curierul Perfect - Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
