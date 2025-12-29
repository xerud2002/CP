'use client';

import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      category: 'Despre platformă',
      questions: [
        { 
          q: 'Ce este Curierul Perfect și cum funcționează?', 
          a: 'Curierul Perfect este o platformă marketplace care conectează clienți cu transportatori verificați pentru servicii de curierat și transport în România și Europa. Funcționăm similar cu Uber sau Airbnb, dar pentru transport: tu postezi cererea (colete, mobilă, persoane, etc.), transportatorii verificați îți trimit oferte competitive, tu compari prețuri și recenzii, apoi alegi oferta potrivită. Comunicarea și negocierea se fac direct, fără intermediari, ceea ce înseamnă prețuri mai bune și flexibilitate maximă.' 
        },
        { 
          q: 'Cât costă să folosesc platforma?', 
          a: 'Platforma este 100% gratuită pentru clienți. Nu percepem niciun comision, taxă de listare sau costuri ascunse. Plătești doar prețul negociat direct cu transportatorul ales. Pentru transportatori, există un model freemium: funcționalitățile de bază sunt gratuite, dar oferim și opțiuni premium pentru vizibilitate crescută și acces la comenzi prioritare.' 
        },
        { 
          q: 'În ce țări activați și ce rute acoperiți?', 
          a: 'Acoperim 20 țări din Europa: România, Anglia, Scoția, Țara Galilor, Irlanda de Nord, Germania, Franța, Italia, Spania, Belgia, Olanda, Austria, Portugalia, Grecia, Irlanda, Moldova, Danemarca, Suedia, Norvegia și Finlanda. Transportatorii noștri operează pe peste 200 rute internaționale regulate (București-Londra, Cluj-München, Timișoara-Milano, etc.) și acceptă și rute personalizate pe cerere. Peste 95% din cererile de transport pe teritoriul României și între România și vestul Europei sunt acoperite de rețeaua noastră.' 
        },
        { 
          q: 'Care e diferența față de curierii tradiționali (DPD, Fan Courier, etc.)?', 
          a: 'Spre deosebire de curierii mari care au tarife fixe și proceduri rigide, Curierul Perfect îți oferă: (1) Prețuri competitive prin licitație - transportatorii concurează pentru comanda ta, (2) Flexibilitate maximă - negociezi direct data, ora și condițiile, (3) Servicii personalizate - colete nestandard, mutări complete, transport special, (4) Transparență totală - vezi recenziile, evaluările și istoricul transportatorului, (5) Suport pentru rute mai puțin comune - transportatorii independenți acoperă și zone neglijate de firmele mari.' 
        },
        {
          q: 'Este sigur să folosesc transportatori independenți?',
          a: 'Da. Siguranța ta este prioritatea noastră #1. Fiecare transportator trece prin verificare riguroasă în 3 etape: (1) Verificare identitate - CI/pașaport valid, cazier fiscal pentru firme, (2) Verificare vehicul - asigurare RCA/CMR obligatorie, ITP valid, certificat înmatriculare, (3) Verificare licențe - autorizație transport marfă/persoane de la ARR unde e cazul. Plus, sistemul nostru de recenzii și rating permite comunitatea să elimine natural transportatorii neserioși. După finalizarea transportului, poți raporta orice problemă și investigăm fiecare caz în max 24 ore.'
        }
      ]
    },
    {
      category: 'Comenzi și transport',
      questions: [
        { 
          q: 'Cum plasez o comandă pas cu pas?', 
          a: 'Procesul e simplu în 6 pași: (1) Intri pe "Plasează comandă" sau alegi serviciul din homepage, (2) Completezi formularul: tip serviciu (colete, mobilă, persoane, etc.), țară/oraș pornire și destinație, dimensiuni/greutate sau număr persoane, data dorită de transport, detalii speciale (fragil, perisabil, animale, etc.), (3) Creezi cont sau te loghezi (verificare email necesară), (4) Postezi cererea - transportatorii o văd instant în dashboard, (5) Primești oferte în 2-48 ore - notificări prin email și pe platformă, (6) Compari oferte, citești recenziile, comunici în chat, apoi confirmi transportatorul preferat. Total durează 3-5 minute să completezi formularul.' 
        },
        { 
          q: 'Cât durează până primesc oferte și câte oferte pot primi?', 
          a: 'Primul răspuns vine de obicei în 2-6 ore pe rutele populare (București-Germania/UK/Italia) și în 12-48 ore pe rutele mai rare. Numărul de oferte depinde de: (1) Popularitatea rutei - pe București-Londra poți primi 5-10 oferte, pe rute mai rare 1-3 oferte, (2) Sezonul - vară/sărbători = mai mulți transportatori disponibili, (3) Urgența - pentru transport în aceeași săptămână primești mai puține oferte. Sistemul nostru notifică automat transportatorii care operează pe ruta ta și au rating bun. Poți primi oferte până la 30 zile după postare (util pentru transport planificat în viitor).' 
        },
        { 
          q: 'Pot anula sau modifica o comandă după ce am postat-o?', 
          a: 'Da, cu următoarele condiții: (1) Înainte de a confirma un transportator - anulare/modificare 100% gratuită oricând, (2) După confirmare dar înainte de ridicare - discuți direct cu transportatorul; majoritatea acceptă modificări minore (schimbare oră) fără costuri, dar pot percepe taxe pentru schimbări majore (dată, destinație), (3) După ridicare - anularea nu mai e posibilă, dar poți redirecționa coletul dacă transportatorul acceptă (se pot aplica costuri suplimentare). În cazul anulării din vina transportatorului (ex: nu se prezintă), anularea e gratuită și îi afectează rating-ul.' 
        },
        { 
          q: 'Ce se întâmplă dacă coletul se pierde, e deteriorat sau ajunge cu întârziere?', 
          a: 'Avem un sistem clar de protecție: (1) Asigurare obligatorie - toți transportatorii au asigurare RCA/CMR validă care acoperă deteriorări/pierderi, (2) Documentare - la ridicare fotografiază coletul și confirmă starea în chat (dovadă în caz de dispută), (3) Reclamație - contactează transportatorul în max 24 ore de la livrare prin chat, dacă nu rezolvi, deschizi tichet la Suport din contul tău, (4) Investigație - analizăm dovezile (poze, chat, tracking) în max 48 ore, (5) Rezolvare - în funcție de vină, curieru compensează pierderea (conform asigurării CMR: max 8.33 DST/kg pentru transport internațional) sau oferim voucher pentru următorul transport. Pentru bunuri valoroase (>500€) recomandăm asigurare suplimentară.' 
        },
        { 
          q: 'Pot urmări coletul în timp real cu GPS?', 
          a: 'Depinde de transportator - circa 60% din transportatorii noștri oferă tracking GPS live prin platformă sau aplicații externe (WhatsApp location share, Google Maps link). În profilul fiecărui transportator vezi dacă oferă "Tracking GPS" ca feature. Chiar dacă nu e tracking automat, comunicarea directă prin chat permite update-uri în timp real: poți cere poze la ridicare, confirmări de opriri, estimare timp sosire, etc. Pentru transport persoane, tracking e mai rar (din motive de confidențialitate), dar șoferul anunță punctele de oprire.' 
        },
        {
          q: 'Ce tipuri de colete pot trimite și există restricții?',
          a: 'Poți trimite aproape orice: colete standard (cutii, pachete), mobilier și electrocasnice (frigidere, canapele, dulapuri), electronice (laptop, telefoane, TV - recomandat ambalare profesională), documente și plicuri (inclusiv contracte, acte oficiale), produse alimentare ambalate (nu perisabile fără refrigerare), obiecte personale pentru relocări, unelte și echipamente profesionale. Restricții: (1) INTERZIS - droguri, arme, materiale explozive, bani cash peste 10.000€ nedeclarați, bunuri contrafăcute, (2) AUTORIZAȚIE SPECIALĂ NECESARĂ - alcool (>5L), tutun (>800 țigări), medicamente controlate, plante/semințe vii, (3) DECLARAȚIE VAMALĂ pentru transport în UK (post-Brexit) și orice bunuri comerciale >150€. Pentru bunuri periculoase (chimicale, lichide inflamabile) consultă transportatorul - mulți refuză din motive de siguranță/asigurare.'
        },
        {
          q: 'Cum funcționează transportul de mobilă și mutările complete?',
          a: 'Avem transportatori specializați în mutări cu servicii complete: (1) Evaluare volum - specifici lista mobilei (ex: canapea 3 locuri, masă, 4 scaune, dulap 2m, frigider) și ei estimează volumul în mc, (2) Ofertă detaliată - include: ridicare de la etaj (cu/fără lift), demontare mobilă dacă e necesar, ambalare cu folie stretch/pături, transport asigurat CMR, descărcare și mutare la etaj destinație, (3) Servicii opționale la cost extra: ambalare profesională în cutii/carton, depozitare temporară (1-30 zile), montare mobilă la destinație, evacuare moloz/debarasare, (4) Timeline - mutări locale (același oraș) în 4-8 ore, internaționale 2-7 zile. Sfaturi: cere poze ale vehiculului (unii au lift hidraulic), verifică dimensiunile mobilei vs ușă/scară, declară bunurile fragile/valoroase pentru asigurare extinsă.'
        }
      ]
    },
    {
      category: 'Prețuri și plată',
      questions: [
        { 
          q: 'Cum se stabilesc prețurile și cum aleg cea mai bună ofertă?', 
          a: 'Prețurile variază bazat pe: (1) Distanță - tarif/km scade la distanțe mari (ex: 200km = 1.5 RON/km, 1000km = 0.7 RON/km), (2) Volum/greutate - colet mic (<10kg) = 50-150 RON, mobilă completă = 500-2000 RON, transport persoane = 30-80 EUR/persoană, (3) Urgență - transport în 24-48 ore poate costa +30-50% față de programare cu 1-2 săptămâni înainte, (4) Sezon - preț mai mare în vară și sărbători. Cum compari oferte: nu alege doar cel mai ieftin! Analizează: rating transportator (min 4.5⭐), număr recenzii (min 10 pentru siguranță), vechime pe platformă (>6 luni = experiență), ce include prețul (ridicare la etaj? asigurare? ambalare?), disponibilitate (data ta exactă sau +/- zile?). Un transportator cu 5⭐ și 50 recenzii la 450 RON e mai sigur decât unul nou la 300 RON.' 
        },
        { 
          q: 'Există costuri ascunse sau taxe suplimentare?', 
          a: 'Curierul Perfect NU adaugă niciun comision sau taxă pe tranzacție - plătești exact suma negociată cu transportatorul. Însă, pot apărea costuri suplimentare de la transportator dacă: (1) Cerințe speciale neprecizate inițial - ex: etaj 5 fără lift (+50-100 RON), așteptare >30 min la ridicare/livrare (+50 RON/oră), acces dificil (drum îngust, parcare departe), (2) Taxe vamale și accize - transport UK/Norvegia/Elveția poate atrage taxe vamale (10-20% din valoarea bunurilor) plătite de destinatar la livrare, (3) Asigurare suplimentară - asigurarea CMR standard acoperă ~8.33 DST/kg; pentru bunuri valoroase (>1000€) poți cumpăra asigurare extinsă la valoarea declarată (+1-3% din valoare), (4) Combustibil pe rute foarte lungi - unii transportatori au clauză de ajustare dacă prețul carburantului crește >20% între confirmare și transport. SFAT: discută toate costurile posibile în chat ÎNAINTE de confirmare și cere ofertă finală detaliată în scris.' 
        },
        { 
          q: 'Cum și când plătesc transportatorul?', 
          a: 'Metoda de plată o negociezi direct cu transportatorul în chat. Opțiuni comune: (1) Cash la ridicare (40% cazuri) - dai bani șoferului când ridică coletul; sigur pentru colete mici, mai riscant pentru mobilă (ce faci dacă nu ajunge?), (2) Cash la livrare (30% cazuri) - plătești când primești coletul intact; preferat pentru verificare calitate, (3) Transfer bancar 50% avans + 50% la livrare (20% cazuri) - balansat pentru ambele părți; recomandat pentru sume mari (>500 RON), (4) Transfer bancar 100% anticipat (10% cazuri) - doar pentru transportatori cu rating 5⭐ și multe recenzii; folosit pentru relocări planificate. ATENȚIE: Curierul Perfect NU procesează plăți - toate tranzacțiile sunt direct cu transportatorul. Păstrează dovada plății (chitanță, confirmare transfer) pentru protecție.' 
        },
        { 
          q: 'Pot cere factură fiscală și cum funcționează cu TVA?', 
          a: 'Da, dacă transportatorul e înregistrat ca persoană juridică (SRL, PFA, II): (1) Verificare - în profilul transportatorului vezi "Tip cont: Firmă" și CUI-ul afisat, (2) Solicitare - menționezi în chat că ai nevoie de factură cu date de facturare (nume firmă, CUI, adresă sediu, email), (3) Emitere - transportatorul emite factură fiscală electronică în max 5 zile de la prestare, (4) TVA - factura include TVA 19% (deja inclus în prețul discutat sau se adaugă? - clarifică!). Pentru persoane fizice (curieri individuali fără firmă): nu emit facturi fiscale, doar chitanță simplă confirmând plata. Dacă ai nevoie obligatoriu de factură pentru contabilitate, filtrează doar transportatori "Firmă verificată" la căutare.' 
        },
        {
          q: 'Oferiti opțiuni de plată în rate sau credit?',
          a: 'Momentan NU oferim direct plată în rate prin platformă, dar ai alternative: (1) Card de credit - dacă plătești cu cardul personal de credit și transferi transportatorului, banca ta poate oferi rate, (2) Transportatori cu parteneriate - câțiva transportatori mari cooperează cu TBI Credit/Cetelem pentru comenzi >1000 RON (întreabă în chat), (3) Plată eșalonată negociată - pentru mutări/transporturi mari (+2000 RON) unii transportatori acceptă 30% avans + 70% în 2-3 tranșe la intervale de 1-2 săptămâni (ai relație de încredere și garantează disponibilitatea comenzii). VIITOR: lucrăm la integrarea cu procesatori de plăți pentru rate automate la comenzi >500 RON (lansare estimată Q2 2025).'
        }
      ]
    },
    {
      category: 'Curieri și siguranță',
      questions: [
        { 
          q: 'Cum sunt verificați și autorizați curierii din platformă?', 
          a: 'Proces de verificare în 4 etape stricte: (1) VERIFICARE IDENTITATE - copie CI/pașaport, selfie cu actul în mână (anti-fraud), verificare cazier fiscal pentru firme (fără datorii ANAF), (2) VERIFICARE VEHICUL - asigurare RCA valabilă (verificăm în baza BAAR), ITP valabil (copie certificat tehnic), certificat înmatriculare pe numele solicitantului sau contract comodat, (3) LICENȚE & AUTORIZAȚII - pentru transport marfă >3.5t: licență comunitară ARR, pentru transport persoane: autorizație transport persoane + certificat atestare șofer, pentru transport internațional: asigurare CMR obligatorie (min 100.000 DST), (4) RECENZII & RATING CONTINUU - primele 5 comenzi sunt „perioadă de probă" monitorizate special, rating <4.0 după 10 comenzi = avertisment, <3.5 = suspendare automată. RE-VERIFICARE anuală a tuturor documentelor pentru menținere cont activ.' 
        },
        { 
          q: 'Ce înseamnă badge-urile și certificările din profilul transportatorilor?', 
          a: 'Badge-urile ajută la identificare rapidă: (1) ✓ VERIFICAT - a trecut verificarea inițială (identitate + vehicul + asigurări), (2) ⭐ TOP CURIER - rating 4.8+ și >50 comenzi finalizate în ultimele 12 luni, (3) 🛡️ ASIGURARE EXTINSĂ - are asigurare CMR peste minimul legal (>200.000 DST), acceptă bunuri de valoare, (4) 🚛 FIRMĂ VERIFICATĂ - persoană juridică cu CUI valid, emite facturi fiscale, (5) ⚡ RĂSPUNS RAPID - timp mediu de răspuns <2 ore la mesaje, (6) 📍 TRACKING GPS - oferă urmărire live în timpul transportului, (7) 🏆 VETERAN - >3 ani pe platformă și >200 comenzi finalizate, (8) 💼 SPECIALIZARE - transport mobilă/animale/electronice dedicat (>60% din comenzi pe categoria respectivă). Badge-urile se actualizează automat bazat pe performanță și nu pot fi cumpărate.' 
        },
        { 
          q: 'Ce fac dacă am probleme cu un curier sau transport?', 
          a: 'Protocol de rezolvare în 3 niveluri: (1) COMUNICARE DIRECTĂ (primele 24 ore) - majoritatea problemelor se rezolvă rapid prin chat: întârziere → cere ETA actualizat, colet deteriorat → cere poze + confirmare asigurare, neînțelegere preț → arată conversația inițială cu prețul agreat, (2) ESCALADARE LA SUPORT (24-72 ore) - dacă transportatorul nu răspunde sau refuză rezolvare: mergi la "Suport" în cont → "Raportează problemă" → descrie situația + atașează poze/dovezi/chat history, echipa noastră contactează transportatorul în max 12 ore, mediază disputa și propune soluție echitabilă, (3) RECLAMAȚIE OFICIALĂ (după 72 ore) - pentru cazuri grave (pierdere colet, fraudă, pagube majore): completezi formular "Reclamații" cu toate dovezile, investigație aprofundată 5-7 zile lucrătoare, posibile sancțiuni pentru transportator (suspendare cont, raportare autorități), compensație financiară conform asigurare CMR sau voucher platformă. IMPORTANT: rating-ul tău afectează și reputația transportatorului - reviews negative apar public în profil.' 
        },
        { 
          q: 'Pot lăsa o recenzie și cât de importante sunt recenziile?', 
          a: 'Recenziile sunt ESENȚIALE pentru ecosistemul platformei: (1) CÂND - după ce comanda e marcată "Finalizată" (de tine sau transportator), primești email + notificare în 24 ore să lași review, (2) CE EVALUEZI - rating 1-5 stele pe 4 categorii: Profesionalism (punctualitate, comunicare), Îngrijire marfă (ambalare, mânuire), Preț vs calitate (a meritat banii?), Experiență generală (ai recomanda?), plus comentariu text liber min 50 caractere (detalii concrete!), (3) VIZIBILITATE - reviews apar public în profil transportator, nu pot fi șterse (doar ascunse de admin dacă conțin injurii), transportatorii pot răspunde la reviews (clarificări situație), (4) IMPACT - transportatori cu <4.0 primesc mai puține cereri (algoritm prioritate), <3.5 = suspendare cont după 3 reviews consecutive negative. SFAT: fii obiectiv și constructiv - reviews influenteaza deciziile a mii de clienți. Evită reviews emoționale imediat după incident - așteaptă rezolvarea prin suport.' 
        },
        {
          q: 'Cum protejați datele mele personale și ce informații văd transportatorii?',
          a: 'Confidențialitate pe 3 niveluri: (1) ÎNAINTE DE CONFIRMARE - transportatorii văd doar: orașul/țara ridicare și destinație (nu adresa exactă), tipul și dimensiunile coletului, data dorită, detalii speciale (fragil, etc.); NU văd: numele tău complet, telefon, adresa exactă, email, (2) DUPĂ CONFIRMARE - dezvălui gradual: în chat discuți detalii specifice, adresa exactă o dai cu max 24h înainte de ridicare, telefon pentru urgențe doar dacă dorești, (3) PROTECȚIE TEHNICĂ - criptare SSL 256-bit pentru toate datele, servere conforme GDPR în UE (nu SUA/China), mesajele din chat sunt criptate end-to-end (noi vedem doar metadate pentru investigații), drept "de uitat" - poți șterge contul + toate datele în max 30 zile. NU vindem/partajăm datele cu terți pentru marketing. Transportatorii sunt obligați contractual să nu folosească datele tale în afara comenzii (sancțiune: închidere cont + amendă GDPR până la 20 milioane EUR).'
        }
      ]
    },
    {
      category: 'Servicii speciale',
      questions: [
        {
          q: 'Cum funcționează transportul de animale de companie?',
          a: 'Transport animale necesită pregătire specială: (1) DOCUMENTAȚIE - pașaport european pentru animale (carnet de sănătate la zi), vaccin antirabic valabil (min 21 zile înainte de călătorie, max 12 luni vechime), cip electronic identificare (obligatoriu UE), certificat sanitar veterinar pentru UK/Norvegia (<10 zile vechime), (2) TRANSPORTATORI AUTORIZAȚI - doar cei cu autorizație ANSVSA pentru transport animale vii (badge "Transport animale autorizat"), vehicule adaptate (cuști/boxe siguranță, aerisire, temperatură controlată), experiență dovedită (min 10 transporturi animale), (3) CONDIȚII TRANSPORT - maxim 8 ore călătorie continuă (pauze obligatorii pentru apă/nevoie), interdicție transport <8 săptămâni sau gravide, cuști/cușcă adecvate dimensiunii (animalul se poate întinde și întoarce), (4) COSTURI - transport câine/pisică România-Germania: 150-300 EUR (variază după dimensiune și urgență). ATENȚIE: UK are regulamente speciale post-Brexit - verifică pe gov.uk/pet-travel înainte!'
        },
        {
          q: 'Oferiti transport refrigerat pentru produse perisabile?',
          a: 'Da, avem transportatori cu vehicule frigorifice pentru: (1) PRODUSE ALIMENTARE - carne, lactate, fructe/legume, produse congelate (-18°C), preparate culinare, (2) MEDICAMENTE - necesită temperatură controlată (2-8°C), transport autorizat cu documentație de temperatură, (3) FLORI/PLANTE - transport în condiții optime pentru produse sensibile. CERINȚE: ambalare adecvată (lăzi termo, gheață uscată pentru distanțe lungi), etichetare clară (PERISABIL - A SE REFRIGERA), livrare urgentă (max 24-48 ore pentru proaspăt). COSTURI: +30-50% față de transport standard (energie refrigerare + vehicul specializat). LIMITĂRI: nu toate rutele sunt acoperite cu frigo - verifică disponibilitate la postare. Transportatori cu badge "🧊 Transport refrigerat" au certificări sanitare ANSVSA valide.'
        },
        {
          q: 'Pot trimite bunuri foarte grele sau supradimensionate (paleți, utilaje)?',
          a: 'Da, pentru bunuri industriale/comerciale avem transportatori specializați: (1) PALEȚI STANDARD - EUR palet (120x80cm), maxim 1.2m înălțime, max 500kg, transport grupaj (shareaza camionul cu alte colete) = cost redus, transport dedicat (camion întreg) = mai scump dar mai rapid, (2) BUNURI SUPRADIMENSIONATE - utilaje industriale, structuri metalice, containere, necesită vehicule speciale (platformă deschisă, macara, trailer), autorizații transport agabaritic (>2.55m lățime, >4m înălțime), escortă poliție pentru dimensiuni extreme, (3) COSTURI - grupaj palet: 150-400 RON (România-Germania), camion dedicat FTL: 800-2000 EUR (24t capacitate), (4) DOCUMENTAȚIE - CMR obligatoriu (contract transport internațional), declarație vamală pentru UK/Norvegia, licență export pentru utilaje specializate. Filtrează transportatori după "Transport marfă" și "Paleți/Grupaj" la căutare.'
        }
      ]
    },
    {
      category: 'Cont și date personale',
      questions: [
        { 
          q: 'Trebuie să am cont pentru a comanda sau pot comanda ca guest?', 
          a: 'Ai nevoie de cont pentru a plasa comenzi și comunica cu transportatorii. Motivele: (1) SECURITATE - verificare email obligatorie (prevenim spam și fake requests), (2) URMĂRIRE - vezi istoricul comenzilor, conversațiile, statusul în timp real, (3) PROTECȚIE - în caz de dispută avem datele tale verificate pentru investigație, (4) RECENZII - doar utilizatori reali pot lăsa reviews. Crearea contului durează 60 secunde: email + parolă + verificare email → gata! Poți folosi și "Login with Google" pentru viteză maximă. Nu percepem taxă pentru cont și nu ai obligația să comanzi după înregistrare.' 
        },
        { 
          q: 'Cum îmi protejați datele și ce faceți cu informațiile mele?', 
          a: 'Confidențialitatea ta e prioritară: (1) CONFORMITATE LEGALĂ - 100% GDPR compliant (Regulamentul UE 2016/679), certificate ISO 27001 pentru securitate informații, rapoarte publice transparență pe site (câte cereri procesăm, incidente, etc.), (2) SECURITATE TEHNICĂ - criptare SSL/TLS 256-bit pentru toate comunicările, parole hashate cu bcrypt (noi nu știm parola ta reală), servere în centre de date EU (Frankfurt/Amsterdam), backup zilnic cu criptare, (3) CE FACEM CU DATELE - le folosim DOAR pentru: procesare comenzi tale, comunicare cu transportatori confirmați, email-uri de notificare (poți opri oricând), îmbunătățire platformă (analiză agregată anonimă), (4) CE NU FACEM - NU vindem datele către terți, NU folosim pentru marketing agresiv (max 1 email/săptămână cu oferte), NU permitem transportatorilor să te contacteze în afara platformei. DREPTURILE TALE: accesare (vezi ce date avem), rectificare (corectezi erori), ștergere ("drept de a fi uitat"), portabilitate (exporți datele), opoziție (refuzi prelucrări). Scrie la gdpr@curierulperfect.com pentru orice cerere.' 
        },
        { 
          q: 'Pot șterge contul și ce se întâmplă cu datele după ștergere?', 
          a: 'Da, poți șterge contul oricând, dar cu consecințe: (1) ȘTERGERE ACCOUNT - mergi în Setări cont → Securitate → "Șterge contul definitiv", confirmă prin email (link verificare), perioada "carantină" 30 zile (poți anula ștergerea), după 30 zile: ștergere automată permanentă, (2) CE SE ȘTERGE - datele personale (nume, email, telefon, adresă), conversațiile private cu transportatori, preferințele și setările contului, (3) CE RĂMÂNE (OBLIGAȚIE LEGALĂ) - comenzile anonimizate (pentru statistici platformă), recenziile publice (anonimizate ca "Utilizator șters"), facturile fiscale (păstrare 10 ani conform legii contabilității), rapoartele financiare pentru ANAF. ATENȚIE: ștergerea e ireversibilă după 30 zile! Dacă ai comenzi în curs, TREBUIE finalizate înainte (sau anulate). Alternative: dezactivare temporară (ascunde profilul dar păstrează datele) - util dacă pleci în concediu.' 
        },
        {
          q: 'Cum îmi schimb parola și ce fac dacă uit parola sau contul e compromis?',
          a: 'SCHIMBARE PAROLĂ NORMALĂ: Setări cont → Securitate → "Schimbă parola" → parolă veche + parolă nouă (min 8 caractere: litere, cifre, simboluri) → confirmare email → logout automat pe toate dispozitivele (re-login necesar). PAROLĂ UITATĂ: Click "Ai uitat parola?" pe pagina de login → introdu email-ul contului → primești link resetare valabil 1 oră → creezi parolă nouă. CONT COMPROMIS (suspiciune hacking): (1) ACȚIUNE IMEDIATĂ - schimbă parola imediat (chiar dacă nu mai ai acces - folosește "parolă uitată"), (2) CONTACTEAZĂ SUPORT - raportează la contact@curierulperfect.com: activitate suspectă (comenzi/mesaje necunoscute), tranzacții neautorizate, email-uri suspecte primite "din partea platformei", (3) INVESTIGAȚIE - blocăm temporar contul (prevent further damage), verificăm loguri IP/device, resetăm sesiunile active, contactăm transportatorii implicați, (4) RECUPERARE - restabilim accesul după confirmare identitate (CI + selfie). PREVENȚIE: activează autentificare 2FA (SMS/Google Authenticator) în Setări - disponibil începând Q1 2025.'
        }
      ]
    },
    {
      category: 'Documentație și legislație',
      questions: [
        {
          q: 'Ce documente am nevoie pentru transport internațional de colete?',
          a: 'Documentația variază după destinație și tip bunuri: (1) INTRA-UE (România ↔ Germania/Italia/Franța/etc.) - Pentru bunuri personale <1000€: NICIUN document special (piață unică), doar o listă simplă conținut colet (scris de mână OK), Pentru bunuri comerciale: factură comercială/proformă, certificat origine (dacă valoare >6000€), transport CMR (asigurare obligatorie transportator), (2) UK (post-Brexit 2021) - declarație vamală obligatorie (orice valoare), factură detaliată în lire sterline (GBP), cod EORI (Economic Operator Registration ID - gratuit pe ANAF), posibile taxe vamale 10-20% + TVA 20% (plătite de destinatar), (3) NORVEGIA/ELVEȚIA (non-UE) - similar UK: declarație vamală + factură + posibile taxe. ATENȚIE la bunuri speciale: alcool (>2L) = accize mari, tutun (>200 țigări) = limită legală, medicamente = rețetă obligatorie, bunuri protejate CITES (piele exotică) = interzis fără permis. Transportatorul TE AJUTĂ cu documentele - discută în chat!'
        },
        {
          q: 'Ce este asigurarea CMR și când este obligatorie?',
          a: 'CMR (Convention relative au contrat de transport international de Marchandises par Route) = convenție internațională care reglementează transportul rutier de mărfuri: (1) CÂND E OBLIGATORIE - orice transport internațional marfă (între 2 țări), indiferent de valoare sau distanță, transportatori profesioniști (cu licență ARR), (2) CE ACOPERĂ - pierderea coletului (compensație max 8.33 DST/kg), deteriorarea parțială (proporțional cu gradul de deteriorare), întârzierea livrării (dacă cauza prejudicii dovedite), (3) CE NU ACOPERĂ - bunuri ascunse nedeclarate (ex: bani cash în cutii), deteriorări din ambalare inadecvată (sticle sparte fără protecție), "vicii proprii" (produse deja deteriorate la ridicare), forță majoră (accident major, calamități), (4) CUM FUNCȚIONEAZĂ RECLAMAȚIA - notifici transportatorul în max 7 zile de la livrare (scris, email = OK), pentru deteriorări nevăzute (cutie intactă): 14 zile, depui cerere de despăgubire cu dovezi (poze, factură valoare, CMR), asigurătorul transportatorului analizează și plătește în 30-90 zile. IMPORTANT: 8.33 DST/kg ≈ 10-11 EUR/kg = pentru laptop 2kg (1000€) compensația e doar ~22 EUR dacă nu ai asigurare suplimentară!'
        },
        {
          q: 'Ce taxe vamale pot apărea și cine le plătește?',
          a: 'Taxe vamale apar doar la transport în afara UE: (1) UK (post-Brexit) - bunuri comerciale sau personale >150 GBP: TVA 20% (calculat pe valoarea bunurilor), taxe vamale 0-12% (depinde de categoria produsului: îmbrăcăminte 12%, electronice 0-4%, cărți 0%), "handling fee" curier vamă: 8-15 GBP (taxă procesare document), plătit de DESTINATAR la livrare (cash/card curierului), (2) NORVEGIA - bunuri >350 NOK (~35 EUR): TVA 25% (cea mai mare din Europa!), taxe import 0-15%, processing fee ~150 NOK, (3) ELVEȚIA - prag foarte jos 65 CHF: TVA 8.1%, taxe vamale variabile, (4) ESTIMARE - laptop 1000€ către UK: 1000€ + 20% TVA (200€) + 4% taxă (40€) + handling (15 GBP) ≈ 1240€ + 15 GBP total. CINE PLĂTEȘTE - întotdeauna DESTINATARUL (conform convenții internaționale), EXCEPȚIE: poți negocia cu expeditorul să plătească el (DAP/DDP Incoterms). EVITARE TAXE - declară corect valoarea (sub-declarare = confiscare + amendă), verifică exceptări (cadouri <39 EUR către UK = fără taxe).'
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-slate-900">
      <section className="py-20 px-4 bg-linear-to-b from-slate-800 to-slate-900">
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
