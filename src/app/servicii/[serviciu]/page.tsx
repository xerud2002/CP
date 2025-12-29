import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import type { Metadata } from 'next';

type Params = {
  serviciu: string;
};

const servicesData: Record<string, {
  title: string;
  description: string;
  longDescription: string;
  article: string;
  insurance: { title: string; description: string }[];
  benefits: string[];
  popularRoutes: string[];
  faq: { q: string; a: string }[];
  color: string;
  borderColor: string;
}> = {
  colete: {
    title: 'Transport Colete România - Europa',
    description: 'Trimite colete rapid și sigur între România și orice țară europeană. Curieri verificați, servicii de încredere.',
    longDescription: 'Serviciul nostru de transport colete conectează România cu toată Europa. Indiferent dacă trimiți pachete mici sau cutii mari, curieri verificați asigură livrarea în siguranță.',
    article: `Transport colete între România și Europa reprezintă una dintre cele mai solicitate servicii în rândul românilor care locuiesc în străinătate sau au afaceri internaționale. Platforma Curierul Perfect pune la dispoziție o rețea extinsă de transportatori verificați, toți având asigurare CMR valabilă și documentație completă pentru transport internațional de mărfuri.

Fiecare transportator din platforma noastră trece printr-un proces riguros de verificare care include validarea documentelor, verificarea asigurării de răspundere civilă și a asigurării CMR (Convenția referitoare la contractul de transport internațional de mărfuri pe șosele). Această convenție internațională garantează că marfa dvs. este protejată pe tot parcursul transportului, iar în cazul improbabil al unor deteriorări sau pierderi, sunteți acoperit până la limita specificată în convenție.

Transportul de colete pe rute internaționale necesită mai mult decât un simplu vehicul și un șofer. Necesită experiență în gestionarea documentelor vamale, cunoașterea regulamentelor specifice fiecărei țări și, cel mai important, profesionalism în manipularea și securizarea coletelor. Transportatorii noștri sunt instruiți în tehnici de ambalare și fixare a mărfii pentru a preveni deteriorările pe parcursul călătoriei, indiferent de distanță sau condițiile meteorologice.

Pe platforma Curierul Perfect, transparența este o prioritate. Fiecare transportator are obligația de a specifica tipul și limitele asigurării deținute, astfel încât dumneavoastră să puteți lua o decizie informată. Pentru colete cu valoare ridicată, recomandăm întotdeauna să alegeți transportatori cu asigurare extinsă sau să contractați o poliță suplimentară de asigurare pentru marfă.

Procesul de transport începe cu <a href="/comanda" className="text-emerald-400 hover:text-emerald-300 underline">postarea cererii dumneavoastră pe platformă</a>, unde specificați detaliile coletului: dimensiuni, greutate, natura conținutului și datele de ridicare și livrare. În câteva ore, primiți oferte de la transportatori verificați care operează pe ruta solicitată. Puteți compara prețurile, citiți recenziile altor clienți și verificați detaliile asigurării fiecărui transportator înainte de a lua o decizie.

Majoritatea transportatorilor noștri oferă servicii complete care includ: ridicare de la adresa specificată în România, manipulare cu grijă pe tot parcursul transportului, tracking în timp real prin GPS și livrare la adresa finală în țara de destinație. Pentru colete fragile sau valoroase, mulți transportatori oferă servicii suplimentare de ambalare profesională cu materiale de protecție precum spumă antișoc, folie cu bule și cutii întărite.

Timpul de livrare variază în funcție de destinație și tipul serviciului ales. Pentru <a href="/transport/romania-germania" className="text-emerald-400 hover:text-emerald-300 underline">transport către Germania</a>, durata medie este de 2-3 zile. Pentru <a href="/transport/romania-uk" className="text-emerald-400 hover:text-emerald-300 underline">Marea Britanie</a>, din cauza procedurilor vamale post-Brexit, trebuie să adăugați încă 1-2 zile. Destinațiile din <a href="/transport/romania-italia" className="text-emerald-400 hover:text-emerald-300 underline">Italia</a> și <a href="/transport/romania-spania" className="text-emerald-400 hover:text-emerald-300 underline">Spania</a> necesită în general 3-4 zile, în timp ce destinațiile nordice pot dura până la 5 zile din cauza distanțelor mari.

Un aspect esențial în alegerea unui transportator este experiența sa în gestionarea documentelor vamale. Pentru expedieri în afara Uniunii Europene sau în cazul unor mărfuri specifice, sunt necesare declarații vamale, facturi comerciale și uneori permise speciale. Transportatorii noștri verificați au experiență în pregătirea acestor documente și pot oferi asistență completă pentru a asigura trecerea rapidă prin vamă fără întârzieri sau costuri suplimentare. Pentru întrebări frecvente despre proces, consultați <a href="/faq" className="text-emerald-400 hover:text-emerald-300 underline">secțiunea FAQ</a>.`,
    insurance: [
      { title: 'Asigurare CMR obligatorie', description: 'Toți transportatorii au asigurare CMR valabilă care acoperă marfa în transport internațional conform convenției internaționale' },
      { title: 'Verificare documentație', description: 'Validăm periodic documentele de asigurare și licențele de transport pentru fiecare curier din platformă' },
      { title: 'Protecție până la 8.33 DST/kg', description: 'Asigurarea CMR standard oferă compensație de până la 8.33 DST (Drepturi Speciale de Tragere) per kilogram de marfă' },
      { title: 'Opțiune asigurare extinsă', description: 'Pentru bunuri de valoare, mulți transportatori oferă posibilitatea contractării unei asigurări suplimentare la valoarea declarată' },
    ],
    benefits: [
      'Livrare în 24-72 ore în majoritatea țărilor',
      'Tracking în timp real',
      'Asigurare inclusă',
      'Ridicare de la domiciliu',
      'Fără costuri ascunse',
    ],
    popularRoutes: ['România - UK', 'România - Germania', 'România - Italia', 'România - Spania'],
    faq: [
      { q: 'Cât durează livrarea unui colet?', a: 'În funcție de destinație, livrarea durează între 24-72 ore pentru țările europene.' },
      { q: 'Ce dimensiuni poate avea coletul?', a: 'Acceptăm colete de orice dimensiune, de la plicuri până la cutii voluminoase.' },
      { q: 'Este inclus tracking-ul?', a: 'Da, toate coletele au tracking în timp real inclus gratuit.' },
    ],
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
  },
  persoane: {
    title: 'Transport Persoane România - Europa',
    description: 'Transport persoane confortabil și sigur. Curse regulate România-Europa cu șoferi profesioniști.',
    longDescription: 'Călătorește confortabil între România și orice destinație europeană. Oferim transport cu microbuze și autocare moderne, cu șoferi experimentați.',
    article: `Transportul de persoane între România și țările europene este o necesitate pentru mii de români care călătoresc regulat pentru muncă, vizite familiale sau afaceri. Platforma Curierul Perfect reunește operatori de transport verificați, toți având licențe valabile de transport persoane și asigurări RCA și Casco complete pentru vehiculele utilizate.

Siguranța pasagerilor este prioritatea noastră absolută. Fiecare operator de transport din platformă trebuie să demonstreze că deține licență de transport persoane eliberată de Autoritatea Rutieră Română (ARR), asigurare RCA valabilă pentru transport internațional și, în majoritatea cazurilor, asigurare Casco pentru vehiculul utilizat. Șoferii trebuie să prezinte certificat de atestare profesională, cazier judiciar și să parcurgă periodic programe de pregătire și perfecționare.

Vehiculele utilizate pentru transport persoane sunt în mare parte microbuze și autocare moderne, fabricate după anul 2015, dotate cu sisteme de siguranță avansate precum ESP, ABS, airbag-uri multiple și centuri de siguranță pentru toți pasagerii. Majoritatea operatorilor investesc constant în întreținerea și modernizarea flotei pentru a oferi confort maxim și siguranță deplină pe distanțe lungi.

Pe lângă aspectele tehnice și legale, experiența operatorului joacă un rol crucial în asigurarea unei călătorii plăcute și sigure. Operatorii noștri au experiență de ani de zile pe rutele internaționale, cunosc perfect itinerariile, punctele de oprire optime și au relații bune cu autoritățile vamale pentru treceri rapide ale frontierelor. Pentru a înțelege mai bine <a href="/cum-functioneaza" className="text-emerald-400 hover:text-emerald-300 underline">cum funcționează platforma</a>, vizitați pagina dedicată.

Confortul pasagerilor este asigurat prin multiple facilități oferite în vehicule: aer condiționat pentru vară, încălzire eficientă pentru iarnă, scaune ergonomice rabatabile, WiFi gratuit în majoritatea vehiculelor, prize USB pentru încărcarea telefoanelor și tabletelor, și spațiu generos pentru bagaje. Unii operatori oferă chiar cafea, apă și gustări gratuite pe parcursul călătoriei.

Rutele sunt planificate atent pentru a evita drumurile aglomerate și pentru a include pauze regulate la fiecare 4-5 ore, conform regulamentelor europene privind timpul de conducere. Aceste pauze permit pasagerilor să se întindă, să servească o masă sau pur și simplu să se relaxeze înainte de continuarea călătoriei. Majoritatea operatorilor aleg stații de servicii moderne, cu facilități complete.

Programul de curse variază în funcție de sezon și cerere. Pe rutele foarte solicitate precum <a href="/transport/romania-uk" className="text-emerald-400 hover:text-emerald-300 underline">București-Londra</a> sau <a href="/transport/romania-germania" className="text-emerald-400 hover:text-emerald-300 underline">Cluj-München</a>, există curse zilnice sau chiar de două ori pe zi. Pentru destinații mai puțin frecventate, cursele pot fi săptămânale, dar operatorii sunt flexibili și pot organiza curse suplimentare dacă există suficiente rezervări. Flexibilitatea programului este un avantaj major față de transportul regulat de linie.

Tarifele pentru transport persoane variază în funcție de distanță, sezon și tip de vehicul, dar sunt în general competitive față de alte opțiuni de călătorie. Avantajul major este raportul calitate-preț: pentru un preț similar sau chiar mai mic decât un bilet de avion sau tren, beneficiați de serviciu ușă-la-ușă, fără stres cu transferuri, fără limitări stricte de bagaj și cu posibilitatea de a opri la solicitare pentru nevoile personale. Pentru mai multe detalii, <a href="/contact" className="text-emerald-400 hover:text-emerald-300 underline">contactați-ne</a> sau consultați <a href="/faq" className="text-emerald-400 hover:text-emerald-300 underline">întrebările frecvente</a>.`,
    insurance: [
      { title: 'Licență transport persoane valabilă', description: 'Toți operatorii dețin licență ARR pentru transport rutier de persoane pe plan internațional, verificată și actualizată periodic' },
      { title: 'Asigurare RCA pentru transport internațional', description: 'Vehiculele au asigurare de răspundere civilă auto valabilă în toate țările europene, acoperind pasagerii în caz de accident' },
      { title: 'Asigurare Casco pentru vehicule', description: 'Majoritatea operatorilor au și asigurare Casco care protejează atât vehiculul cât și pasagerii împotriva unor riscuri suplimentare' },
      { title: 'Șoferi cu certificare profesională', description: 'Toți șoferii dețin certificat de atestare profesională și sunt supuși controalelor medicale periodice obligatorii' },
    ],
    benefits: [
      'Microbuze și autocare moderne, climatizate',
      'Șoferi profesioniști cu experiență',
      'Curse zilnice pe rutele populare',
      'WiFi și prize USB la bord',
      'Bagaj generos inclus',
    ],
    popularRoutes: ['București - Londra', 'Cluj - München', 'Iași - Roma', 'Timișoara - Madrid'],
    faq: [
      { q: 'Câte kg de bagaj pot lua?', a: 'Fiecare pasager are dreptul la 30kg bagaj inclus.' },
      { q: 'De unde se face îmbarcarea?', a: 'Ridicăm pasagerii de la adresa dorită în majoritatea orașelor.' },
      { q: 'Copiii plătesc bilet întreg?', a: 'Copiii sub 3 ani călătoresc gratuit, iar cei între 3-12 ani au reducere.' },
    ],
    color: 'from-rose-500/20 to-pink-500/20',
    borderColor: 'border-rose-500/30',
  },
  mobila: {
    title: 'Transport Mobilă și Mutări România - Europa',
    description: 'Mutări internaționale complete. Transport mobilă, electrocasnice și bunuri personale în toată Europa.',
    longDescription: 'Serviciu complet de mutări internaționale: ambalare profesională, transport sigur și dezambalare la destinație. Ideal pentru mutări complete sau transport piese mari de mobilier.',
    article: `Mutările internaționale sunt procese complexe care necesită mai mult decât simplu transport - necesită planificare meticuloasă, experien ță în manipulare și protecție adecvată pentru bunurile dumneavoastră valoroase. Platforma Curierul Perfect colaborează exclusiv cu firme specializate în mutări care dețin toate licențele necesare și asigurări complete pentru protecția bunurilor transportate.

Fiecare firmă de mutări din platforma noastră este verificată riguros și trebuie să demonstreze că posedă licență de transport marfă, asigurare CMR pentru marfa transportată, asigurare de răspundere civilă și, foarte important, experiență dovedită în mutări internaționale. Verificăm periodic valabilitatea acestor documente și monitorizăm feedback-ul clienților pentru a menține standarde înalte de calitate.

Protecția bunurilor dumneavoastră începe cu ambalarea profesională. Firmele noastre partenere utilizează materiale de cea mai bună calitate: cutii de carton ondulat cu pereți dubli pentru obiecte grele, folie cu bule de aer pentru protecție împotriva șocurilor, hârtie de împachetat neutră pentru obiecte delicate, pături speciale groase pentru mobilier și benzi de ambalare rezistente. Mobilierul este dezasamblat parțial sau complet după caz, fiecare componentă fiind etichetată pentru reasamblare ușoară la destinație.

Transportul propriu-zis se face cu camioane moderne dotate cu sisteme de suspensie care amortizează șocurile drumului, sisteme de fixare profesionale pentru prevenirea deplasării bunurilor în timpul transportului și, când este necesar, controlul climatului pentru protecția obiectelor sensibile la temperatură sau umiditate. Pentru mutări complete, majoritatea firmelor oferă camion dedicat, ceea ce înseamnă că bunurile dumneavoastră nu sunt mixate cu ale altor clienți și transportul este direct, fără opriri intermediare.

Asigurarea este un aspect crucial al oricărei mutări internaționale. Asigurarea CMR standard acoperă marfa la o valoare de până la 8.33 DST per kilogram, dar pentru mutări care implică bunuri valoroase - mobilier de designer, electronice scumpe, obiecte de artă - recomandăm insistent contractarea unei asigurări suplimentare la valoarea declarată. Firmele noastre pot facilita această asigurare extinsă printr-o primă suplimentară rezonabilă care vă oferă liniște deplină.

Procesul de mutare începe cu o evaluare detaliată, fie la fața locului, fie online prin fotografii și descrieri. Pe baza acestei evaluări, primiți o ofertă detaliată care include volumul estimat în metri cubi, costul transportului, costul materialelor de ambalare, costul forței de muncă și orice servicii suplimentare solicitate. Transparența costurilor este esențială - nu acceptăm în platformă firme care practică taxe ascunse sau modifică prețurile după începerea lucrărilor.

În ziua mutării, echipa sosește la ora stabilită cu toate materialele necesare. Procesul de ambalare durează în funcție de volumul bunurilor - de la câteva ore pentru un apartament mic până la o zi întreagă pentru o casă mare. Echipele noastre sunt instruite să protejeze și proprietatea din care se mută, folosind protecții pentru podele, pereți și uși pentru a preveni zgârieturile sau loviturile în timpul deplasării mobilierului voluminos.

Transportul poate dura de la 2-3 zile pentru destinații apropiate precum Austria sau Ungaria până la 5-7 zile pentru destinații îndepărtate precum Marea Britanie sau țările nordice. Timpul depinde de distanță, trafic, formalități vamale și numărul de șoferi (pentru distanțe mari se folosesc doi șoferi pentru respectarea timpilor de odihnă). Pe tot parcursul transportului, primiți actualizări despre locația încărcăturii.

La destinație, serviciul complet include descărcarea, urcarea bunurilor la etaj (inclusiv cu lift de mobilă pentru etajele superioare când nu există lift în clădire), despachetarea și reasamblarea mobilierului dezasamblat, aranjarea bunurilor în încăperile indicate și colectarea materialelor de ambalare folosite. Unele firme oferă chiar și servicii de curățenie post-mutare.`,
    insurance: [
      { title: 'Asigurare CMR pentru marfă', description: 'Toate firmele de mutări au asigurare CMR valabilă care protejează bunurile transportate conform standardelor internaționale' },
      { title: 'Asigurare la valoare declarată', description: 'Pentru bunuri de valoare mare, oferim posibilitatea asigurării suplimentare la valoarea reală declarată de client' },
      { title: 'Asigurare manipulare și depozitare', description: 'Bunurile sunt asigurate nu doar pe durata transportului, ci și în timpul încărcării, descărcării și depozitării temporare' },
      { title: 'Echipe profesioniste instruite', description: 'Personal specializat în manipularea mobilierului și obiectelor fragile, cu echipament profesional de protecție și transport' },
    ],
    benefits: [
      'Ambalare profesională inclusă',
      'Echipe experimentate de mutări',
      'Asigurare completă pentru bunuri',
      'Camioane dedicate sau grupaj',
      'Dezambalare și montare la destinație',
    ],
    popularRoutes: ['România - UK', 'România - Germania', 'România - Italia', 'România - Franța'],
    faq: [
      { q: 'Oferiți servicii de ambalare?', a: 'Da, echipa noastră poate ambala toate bunurile profesional cu materiale de calitate.' },
      { q: 'Cât durează o mutare internațională?', a: 'În funcție de distanță și volum, între 2-7 zile lucrătoare.' },
      { q: 'Ce se întâmplă dacă se strică ceva?', a: 'Toate transporturile sunt asigurate. Despăgubirea se face în maxim 14 zile.' },
    ],
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
  },
  animale: {
    title: 'Transport Animale de Companie România - Europa',
    description: 'Transport specializat pentru animale de companie. Câini, pisici și alte animale călătoresc în siguranță.',
    longDescription: 'Transport autorizat pentru animale de companie în toată Europa. Vehicule special amenajate, cu climat controlat și îngrijire pe tot parcursul călătoriei.',
    article: `Transportul animalelor de companie peste granițe este o responsabilitate majoră care necesită nu doar vehicule adecvate, ci și cunoștințe specializate, autorizări specifice și o grijă deosebită pentru bunăstarea patrupedelor. Platforma Curierul Perfect colaborează exclusiv cu transportatori autorizați care dețin toate permisele necesare pentru transport animale vii și sunt instruiți în îngrijirea acestora pe parcursul călătoriilor lungi.

Toți transportatorii de animale din platforma noastră dețin autorizație specială pentru transport animale de companie eliberată de Autoritatea Națională Sanitară Veterinară și pentru Siguranța Alimentelor (ANSVSA), asigurare de răspundere civilă care acoperă și transportul animalelor, și cel puțin un însoțitor instruit în îngrijirea animalelor. Verificăm periodic aceste documente și monitorizăm strict respectarea regulamentelor de bunăstare a animalelor.

Vehiculele utilizate pentru transport animale sunt special amenajate cu cuști sau boxe sigure, ventilație adecvată, control al temperaturii (aer condiționat vara, încălzire iarna) și separare între compartimentele pentru animale diferite pentru a preveni stresul. Multe vehicule au și camere de supraveghere care permit monitorizarea constantă a animalelor și transmiterea de actualizări video proprietarilor pe durata călătoriei.

Înainte de orice transport internațional, animalul dumneavoastră trebuie să îndeplinească anumite cerințe legale: trebuie să fie identificat prin microcip conform standardului ISO, să aibă pașaport european pentru animale de companie emis de un veterinar autorizat, să fie vaccinat antirabic cu cel puțin 21 de zile înainte de călătorie (dar nu mai mult de perioada de valabilitate a vaccinului), și să fie tratat împotriva paraziților interni și externi, dacă destinația o cere.

Pentru Marea Britanie și Irlanda de Nord, după Brexit, există cerințe suplimentare: animalul trebuie să aibă titrare de anticorpi antirabici efectuată la minimum 30 de zile după vaccinare și cu minimum 3 luni înainte de călătorie, și declarație de sănătate completată de veterinar cu maxim 10 zile înainte de călătorie. Transportatorii noștri cunosc perfect aceste cerințe și vă pot ghida prin întregul proces de pregătire.

Pe durata transportului, bunăstarea animalului este prioritatea absolută. Se fac pauze regulate la fiecare 4-6 ore pentru plimbare, hrană și apă proaspătă. Animalele sunt menținute la temperatură confortabilă constant - nu prea cald vara, nu prea frig iarna. Pentru călătorii foarte lungi (peste 10 ore), se planifică opriri de noapte în locații sigure unde animalele pot fi plimbate mai mult timp și se pot odihni corespunzător.

Stresul călătoriei poate fi redus semnificativ prin pregătire adecvată. Recomandăm obișnuirea treptată a animalului cu cușca sau boxul în care va călători, cu câteva săptămâni înainte de transport. În ziua călătoriei, este bine ca animalul să fie plimbat și hrănit cu câteva ore înainte, dar nu imediat înainte de plecare pentru a preveni greața în mișcare. Unii proprietari optează pentru calmante prescrise de veterinar, dar acest lucru trebuie discutat în prealabil cu medicul veterinar.

Documentația necesară este verificată atent de transportator înainte de plecare și pregătită pentru controalele vamale. Pentru călătorii în UE, de obicei nu sunt controale foarte stricte, dar pentru UK și alte destinații extra-UE, documentele sunt verificate riguros. Transportatorii noștri experți cunosc procedurile și pot accelera trecerea prin vamă prin pregătirea corectă a documentației.

Costul transportului animalelor variază în funcție de mărimea animalului, distanța parcursă și serviciile suplimentare solicitate (de exemplu, îngrijire specială pentru animale în vârstă sau cu probleme de sănătate). În general, transportul este mai scump decât pentru o persoană din cauza cerințelor speciale și a responsabilității suplimentare, dar siguranța și confortul animalului dumneavoastră merită investiția.`,
    insurance: [
      { title: 'Autorizație ANSVSA pentru transport animale', description: 'Toți transportatorii dețin autorizație valabilă de la Autoritatea Sanitară Veterinară pentru transport animale vii' },
      { title: 'Asigurare pentru transport animale', description: 'Asigurare specială care acoperă animalele pe durata transportului împotriva accidentelor și bolilor' },
      { title: 'Personal instruit în îngrijirea animalelor', description: 'Însoțitorii au pregătire în îngrijirea animalelor, recunoașterea semnelor de stres și acordarea primului ajutor' },
      { title: 'Vehicule autorizate și echipate', description: 'Vehicule special amenajate cu control climatic, ventilație și separații pentru siguranța și confortul animalelor' },
    ],
    benefits: [
      'Vehicule special amenajate pentru animale',
      'Climat controlat (AC/încălzire)',
      'Pauze regulate pentru hrană și apă',
      'Personal instruit în îngrijirea animalelor',
      'Documentație completă pentru transport',
    ],
    popularRoutes: ['România - UK', 'România - Germania', 'România - Italia', 'România - Spania'],
    faq: [
      { q: 'Ce documente sunt necesare?', a: 'Pașaport european pentru animale, vaccinări la zi și microcip obligatoriu.' },
      { q: 'Pot călători și eu cu animalul?', a: 'Da, oferim și transport combinat pasageri + animale.' },
      { q: 'Cum este monitorizat animalul?', a: 'Primești actualizări foto și video pe tot parcursul călătoriei.' },
    ],
    color: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/30',
  },
  platforma: {
    title: 'Transport Auto pe Platformă România - Europa',
    description: 'Transport mașini și vehicule pe platformă. Siguranță maximă pentru autoturisme, motociclete și utilaje.',
    longDescription: 'Transport profesional de vehicule pe platformă în toată Europa. Ideal pentru mașini de lux, vehicule defecte sau utilaje care nu pot circula pe drumuri publice.',
    article: `Transportul auto pe platformă este soluția ideală când trebuie să mutați un vehicul peste distanțe lungi fără a adăuga kilometri la bord, când vehiculul este defect și nu poate circula, sau când doriți protecție maximă pentru o mașină de valoare. Platforma Curierul Perfect lucrează cu transportatori specializați care dețin platforme moderne și toate asigurările necesare pentru protecția completă a vehiculului dumneavoastră.

Fiecare transportator de vehicule din platforma noastră trebuie să demonstreze că posedă licență de transport marfă, platforme în stare tehnică perfectă, asigurare CMR pentru vehiculele transportate și asigurare Casco pentru platforma propriu-zisă. Verificăm periodic starea tehnică a platformelor și respectarea procedurilor de siguranță în fixarea vehiculelor. Siguranța mașinii dumneavoastră este garantată prin multiple straturi de protecție.

Există două tipuri principale de platforme: platforme deschise și platforme închise (carosate). Platformele deschise sunt mai economice și sunt ideale pentru vehicule standard care nu au nevoie de protecție suplimentară împotriva condițiilor meteorologice. Platformele închise oferă protecție completă împotriva ploii, zăpezii, prafului și privirilor curioase, fiind recomandate pentru mașini de lux, mașini istorice sau vehicule cu vopsea sensibilă.

Platformele moderne pot transporta de la un singur vehicul până la 8-10 autoturisme simultan, în funcție de mărimea platformei. Pentru transport individual, mașina dumneavoastră este încărcată și fixată singură pe platformă, beneficiind de atenție exclusivă și risc zero de contact cu alte vehicule. Pentru transport în grupaj, vehiculele sunt încărcate strategic pentru a maximiza spațiul și a preveni orice contact între ele.

Fixarea vehiculului pe platformă este un proces critic care necesită experiență și echipament profesional. Se folosesc chingi de transport certificate cu rezistență mare (minimum 2 tone putere de rupere per chingă), tensionate corespunzător pentru a preveni orice mișcare a vehiculului în timpul transportului, dar fără a pune presiune excesivă pe suspensie. Jantele de aluminiu și cele cromate sunt protejate cu materiale moi pentru a preveni zgârieturile. Vehiculele sportive joase sau mașinile modificate necesită atenție specială la încărcare pentru a nu deteriora spoilerele sau difuzoarele.

Înainte de încărcare, se face o inspecție detaliată a vehiculului împreună cu proprietarul sau reprezentantul acestuia. Se documentează fotografic orice zgârietură, lovitură sau defect existent, kilometrajul este notat, iar documentele vehiculului sunt verificate. Această inspecție inițială este crucială pentru a evita orice dispută ulterioară privind starea vehiculului. La livrare, se repetă inspecția pentru a confirma că vehiculul a fost livrat în aceeași stare în care a fost preluat.

Asigurarea este aspect esențial al transportului auto pe platformă. Asigurarea CMR standard acoperă vehiculul la o valoare de aproximativ 3-4 euro per kilogram, ceea ce pentru o mașină de 1500 kg înseamnă aproximativ 4500-6000 euro. Pentru vehicule de valoare mai mare - mașini de lux, mașini clasice, mașini sport - este absolut necesară contractarea unei asigurări suplimentare la valoarea de piață reală a vehiculului. Această asigurare extinsă se contractează ușor printr-o primă suplimentară calculată ca procent din valoarea declarată.

Transportul internațional de vehicule implică și aspecte vamale și de înmatriculare. Pentru vehicule second-hand transportate definitiv în altă țară, sunt necesare documente specifice: certificat de conformitate (COC), dovada plății taxelor în România, certificat de radiere din evidențele române (dacă e cazul). Transportatorii noștri experimentați vă pot ghida prin aceste formalități și pot asista la pregătirea documentației necesare.

Timpul de transport variază în funcție de distanță și de tipul serviciului ales. Pentru transport dedicat (platforma transportă doar vehiculul dumneavoastră), durata este minimă - de exemplu, 2-3 zile pentru Germania, 4-5 zile pentru UK, 3-4 zile pentru Italia. Pentru transport în grupaj (vehiculul este combinat cu alte vehicule pe aceeași rută), durata poate fi cu 1-2 zile mai mare din cauza încărcărilor și descărcărilor multiple, dar costul este semnificativ redus.`,
    insurance: [
      { title: 'Asigurare CMR pentru vehicule transportate', description: 'Toate vehiculele sunt acoperite de asigurare CMR pe durata transportului conform reglementărilor internaționale' },
      { title: 'Asigurare suplimentară la valoare declarată', description: 'Pentru vehicule de valoare mare, oferim asigurare completă la prețul de piață real declarat de proprietar' },
      { title: 'Platforme certificate și verificate', description: 'Toate platformele sunt în stare tehnică perfectă, cu ITP la zi și echipament de fixare certificat' },
      { title: 'Inspecție completă pre și post-transport', description: 'Documentare foto detaliată a stării vehiculului la preluare și livrare pentru protecția ambelor părți' },
    ],
    benefits: [
      'Platforme moderne, închise sau deschise',
      'Fixare profesională cu chingi certificate',
      'Asigurare completă inclusă',
      'Transport ușă-la-ușă',
      'Documentație vamală completă',
    ],
    popularRoutes: ['România - UK', 'România - Germania', 'România - Italia', 'România - Olanda'],
    faq: [
      { q: 'Transportați și mașini defecte?', a: 'Da, transportăm vehicule care nu pot circula, inclusiv accidentate.' },
      { q: 'Mașina este asigurată pe durata transportului?', a: 'Da, toate vehiculele sunt asigurate la valoarea declarată.' },
      { q: 'Cât durează transportul?', a: 'În funcție de destinație, între 2-5 zile pentru majoritatea țărilor europene.' },
    ],
    color: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/30',
  },
  tractari: {
    title: 'Tractări Auto și Asistență Rutieră Europa',
    description: 'Servicii de tractare auto și asistență rutieră în toată Europa. Disponibil 24/7 pentru urgențe.',
    longDescription: 'Asistență rutieră și tractări auto oriunde în Europa. Echipe disponibile non-stop pentru pană, accident sau orice problemă tehnică.',
    article: `Problemele tehnice ale vehiculelor nu respectă programul de lucru și pot apărea oricând, în cele mai neașteptate locații. Serviciul nostru de tractări auto și asistență rutieră în toată Europa este disponibil 24 de ore din 24, 7 zile din 7, inclusiv în weekend-uri și sărbători legale. Platforma Curierul Perfect colaborează cu operatori specializați în asistență rutieră care dețin toate autorizațiile necesare și echipamentul modern pentru intervenții rapide și sigure.

Toți operatorii de tractări din platforma noastră trebuie să demonstreze că posedă licență de transport mărfuri (necesară pentru tractări), platforme sau targi de tractare certificate tehnic, asigurare RCA și Casco pentru vehiculele de intervenție, și asigurare CMR care acoperă vehiculele tractate. Echipajele trebuie să fie instruite în tehnici de tractare sigură și să cunoască procedurile specifice pentru diferite tipuri de vehicule - de la mașini mici până la dube de 3.5 tone.

Echipamentul utilizat include platforme moderne cu sistem hidraulic de încărcare, targi cu braț telescopic pentru tractări simple, cricuri și elevația pneumatice pentru ridicarea vehiculelor avariate, și echipament de depanare pentru rezolvarea problemelor minore la fața locului. Multe echipaje sunt dotate și cu sisteme de diagnosticare electronică care permit identificarea rapidă a problemei și estimarea corectă a situației.

Timpii de intervenție depind de locație și trafic. În zonele urbane mari precum București, Cluj, Timișoara, sau în orașe europene importante, echipajul poate ajunge în 30-60 de minute de la apel. În zonele rurale sau pe autostrăzi în afara orelor de vârf, timpul poate crește la 1-2 ore. Pentru urgențe critice - accidente cu persoane blocate în vehicul - prioritizăm intervenția și colaborăm cu serviciile de urgență pentru asistență imediată.

Primul pas la sosirea echipajului este evaluarea situației. Mecanicul verifică vehiculul pentru a determina dacă problema poate fi rezolvată la fața locului sau este necesară tractarea la un service. Multe probleme comune - baterie descărcată, roată spartă, cheia blocată în contact, combustibil terminat - pot fi rezolvate rapid pe loc. Pentru baterie, avem jump-start și încărcătoare rapide. Pentru roți, înlocuim cu roata de rezervă dacă este funcțională. Pentru combustibil, unele echipaje au rezerve mici de motorină sau benzină.

Când tractarea este inevitabilă, procesul este executat profesional pentru a preveni orice daună suplimentară vehiculului. Mașinile cu tracțiune integrală sau cutie automată necesită atenție specială - ideally se tractează pe platformă pentru a evita deteriorarea transmisiei. Vehiculele sportive joase necesită folosirea unor plăci speciale de încărcare pentru a nu deteriora bara față sau difuzorul. Înainte de tractare, se documentează fotografic starea vehiculului și se notează kilometrajul.

Destinația tractării este la alegerea clientului: cel mai apropiat service autorizat pentru marca respectivă, service-ul personal de încredere, locuința sau orice altă adresă indicată. Pentru mașini sub garanție, recomandăm întotdeauna tractarea la service autorizat pentru a nu pierde garanția. În cazul accidentelor, tractarea se face de obicei la parcarea indicată de poliție sau compania de asigurări până la evaluarea daunelor.

Pentru români în deplasare în Europa, serviciul nostru acoperă toate țările europene importante. Avem parteneri în UK, Germania, Franța, Italia, Spania și alte destinații frecvente. Echipajele vorbesc de obicei limba locală, dar pot comunica și în română sau engleză pentru a facilita înțelegerea cu clienții români. Cunosc specificul local - ce documente sunt necesare, care sunt procedurile pentru accidente, unde sunt service-urile de încredere.

Costul serviciului variază în funcție de distanța tractării, tipul vehiculului și momentul intervenției (noapte și weekend-uri pot avea tarife majorate). Pe platforma noastră, prețurile sunt transparente - operatorul comunică tariful înainte de intervenție, fără surprize. Multe polițe de asigurare Casco includ asistență rutieră gratuită sau cu franșiză redusă - verificați condițiile poliței dumneavoastră înainte de a apela la servicii externe.`,
    insurance: [
      { title: 'Licență de transport și asistență rutieră', description: 'Toți operatorii dețin licențele necesare pentru prestarea serviciilor de tractare și asistență rutieră autorizată' },
      { title: 'Asigurare pentru vehicule tractate', description: 'Asigurare CMR care acoperă vehiculul tractat împotriva daunelor care pot apărea în timpul tractării' },
      { title: 'Echipament certificat și verificat', description: 'Platforme și targi cu ITP la zi, verificate tehnic și echipate corespunzător pentru siguranță maximă' },
      { title: 'Personal instruit în tehnici de tractare', description: 'Echipaje cu experiență în tractarea diferitelor tipuri de vehicule, de la citycar-uri până la dube de 3.5t' },
    ],
    benefits: [
      'Disponibil 24/7, inclusiv sărbători',
      'Intervenție rapidă (sub 60 min în zone urbane)',
      'Platforme și utilaje pentru orice vehicul',
      'Depanare la fața locului când e posibil',
      'Acoperire în toată Europa',
    ],
    popularRoutes: ['Oriunde în UK', 'Oriunde în Germania', 'Oriunde în Italia', 'Oriunde în România'],
    faq: [
      { q: 'Cât durează până ajunge echipa?', a: 'În zone urbane, sub 60 de minute. În zone rurale, sub 2 ore.' },
      { q: 'Tractați și vehicule grele?', a: 'Da, avem echipamente pentru autoturisme, dube și vehicule până la 3.5t.' },
      { q: 'Ce se întâmplă dacă nu poate fi reparat?', a: 'Transportăm vehiculul la cel mai apropiat service sau la destinația dorită.' },
    ],
    color: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/30',
  },
  electronice: {
    title: 'Transport Electronice și Electrocasnice Europa',
    description: 'Transport sigur pentru TV, electrocasnice și echipamente electronice fragile.',
    longDescription: 'Serviciu specializat pentru transport echipamente electronice și electrocasnice. Ambalare profesională și manipulare cu grijă pentru a preveni deteriorarea.',
    article: `Echipamentele electronice și electrocasnicele sunt printre cele mai sensibile bunuri la transport, necesitând atenție deosebită la ambalare, manipulare și asigurarea condițiilor optime pe durata călătoriei. Platforma Curierul Perfect colaborează cu transportatori experimentați în manipularea electronicelor care înțeleg vulnerabilitatea acestor produse și aplică protocoale stricte de protecție.

Toți transportatorii specializați în electronice din platforma noastră dețin licență de transport marfă, asigurare CMR cu acoperire adecvată pentru bunuri fragile și de valoare, experiență dovedită în transportul electronicelor (confirmată prin recenzii pozitive), și în multe cazuri, vehicule echipate cu suspensie pneumatică sau alte sisteme de amortizare superioară pentru reducerea vibrațiilor. Verificăm regulat feedback-ul clienților și menținem în platformă doar transportatorii cu rate de livrare intactă de minimum 98%.

Ambalarea corectă este absolut esențială pentru protecția electronicelor. Ideal, echipamentele ar trebui ambalate în cutiile originale care au fost proiectate specific pentru protecția acelui produs. Dacă cutia originală nu mai este disponibilă, transportatorii noștri folosesc cutii de carton ondulat cu pereți dubli sau tripli, spumă de polietilenă expandată tăiată pe măsură pentru fiecare produs, folie cu bule de aer de 20-30mm pentru protecție suplimentară, și chips-uri de polistiren pentru umplerea spațiilor goale.

Pentru televizoare și monitoare, protecția ecranului este critică. Se folosesc panouri de carton rigid sau spumă densă care acoperă complet suprafața ecranului, apoi întregul aparat este învelit în folie cu bule și așezat vertical în cutie (niciodată culcat pentru a evita presiunea pe ecran). Pentru televizoare mari de peste 50 inch, se recomandă folosirea lăzilor din lemn custom-făcute care oferă protecție maximă. Colțurile sunt întărite suplimentar cu bucăți de spumă densă sau profile de protecție din carton.

Echipamentele cu componente mobile - imprimante, console de gaming, laptopuri - necesită pregătire suplimentară. Părțile mobile trebuie fixate sau blocate în poziție de transport dacă există această opțiune. Cartușele de cerneală sau toner trebuie scoase din imprimante pentru a preveni scurgerile. Hard disk-urile externe și alte dispozitive de stocare sensibile trebuie ambalate separat în materiale antistatic pentru protecție împotriva electricității statice și șocurilor mecanice.

Frigiderele și congelatoarele necesită pregătire specială înainte de transport. Trebuie decongelate complet și uscate minimum 24 de ore înainte de transport pentru a preveni formarea mucegaiului. Se transportă vertical sau cu o înclinare maximă de 30 de grade pentru a proteja circuitul frigorific. După transport, trebuie lăsate să stea vertical minimum 4-6 ore înainte de a fi repornite pentru ca fluidul frigorific să revină în poziția corectă.

Mașinile de spălat și uscătoarele trebuie să aibă tamburul blocat cu șuruburile de transport (dacă au fost păstrate) sau cu perne groase pentru a preveni mișcarea în timpul transportului, care poate deteriora suspensiile și rulmenții. Furtunurile trebuie deconectate și golite de apă. Ușa trebuie fie închisă cu bandă adezivă puternică, fie deschisă și fixată pentru a preveni închiderea bruscă care ar putea deteriora balamalele.

Transportul propriu-zis se face în vehicule cu suspensie adecvată, preferabil climatizate pentru a evita condensul (variațiile mari de temperatură pot deteriora electronicele). Bunurile sunt fixate solid pentru a preveni deplasarea în timpul frânării sau la viraje. Se evită suprapunerea obiectelor grele peste electronice. Pentru transport pe distanțe lungi, se preferă rutele cu drumuri bune, evitându-se pe cât posibil drumurile de țară neasfaltate care produc vibrații excesive.

Asigurarea este extrem de importantă pentru electronicele de valoare. Asigurarea CMR standard acoperă la aproximativ 3-4 euro per kilogram, ceea ce pentru un televizor OLED de 20kg înseamnă doar 60-80 euro - mult sub valoarea reală. Pentru echipamente scumpe - televizoare 4K/8K, sisteme audio high-end, echipamente IT profesionale - recomandăm insistent asigurare suplimentară la valoarea reală de piață. Această asigurare extinsă se contractează printr-o primă mică (de obicei 1-2% din valoarea asigurată) și vă oferă liniște deplină.

La livrare, este esențial să inspectați ambalajul înainte de semnarea documentelor de recepție. Dacă cutia prezintă deteriorări vizibile - strivire, găuri, pete de umiditate - notați aceste daune pe documentul de livrare și fotografiați. Despachetați echipamentul în prezența curierului dacă este posibil. Testați funcționarea de bază chiar dacă totul pare intact exterior - porniți televizorul, verificați ecranul pentru pixeli morți sau crăpături, testați porturile. Dacă descoperiți defecte, refuzați recepția sau notați-le clar pe documentul de livrare pentru a putea face claim de asigurare.`,
    insurance: [
      { title: 'Asigurare CMR pentru bunuri fragile', description: 'Transport acoperit de asigurare CMR cu atenție specială pentru bunuri electronice fragile și valoroase' },
      { title: 'Asigurare extinsă disponibilă', description: 'Pentru echipamente scumpe, oferim asigurare suplimentară la valoarea de piață reală declarată' },
      { title: 'Manipulare specializată', description: 'Personal instruit specific în manipularea corectă a electronicelor și tehnici de ambalare profesională' },
      { title: 'Vehicule cu suspensie adecvată', description: 'Transport în vehicule cu suspensie modernă care minimizează vibrațiile și șocurile pe drum' },
    ],
    benefits: [
      'Ambalare specială pentru electronice',
      'Manipulare cu grijă extremă',
      'Asigurare completă',
      'Transport climatizat',
      'Verificare la livrare',
    ],
    popularRoutes: ['România - UK', 'România - Germania', 'România - Italia', 'România - Spania'],
    faq: [
      { q: 'Cum sunt ambalate electronicele?', a: 'Folosim spumă antișoc, folie cu bule și cutii rigide speciale.' },
      { q: 'Ce se întâmplă dacă ajunge stricat?', a: 'Asigurarea acoperă valoarea declarată, despăgubire în maxim 7 zile.' },
      { q: 'Transportați și electronice second-hand?', a: 'Da, transportăm orice echipament electronic, nou sau folosit.' },
    ],
    color: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30',
  },
  plicuri: {
    title: 'Transport Plicuri și Documente Europa',
    description: 'Curierat rapid pentru documente importante. Livrare expresă în 24-48 ore în toată Europa.',
    longDescription: 'Serviciu de curierat expres pentru documente și plicuri. Ideal pentru acte importante, contracte sau documente care necesită semnătură.',
    article: `Documentele importante - contracte, acte notariale, documente legale, certificate, pașapoarte - necesită un serviciu de curierat rapid, sigur și de încredere. Platforma Curierul Perfect colaborează cu curieri profesioniști specializați în transport documente care înțeleg importanța confidențialității, rapidității și respectării termenelor strânse pentru livrare.

Toți curierii de documente din platforma noastră dețin licență de curierat rapid, asigurare de răspundere civilă care acoperă și pierderea sau deteriorarea documentelor, cazier judiciar curat (verificat periodic pentru siguranța clienților), și experiență în manipularea corespondenței confidențiale. Pentru documente cu valoare declarată mare sau de importanță critică, mulți curieri oferă și asigurare suplimentară specifică pentru documente valoroase.

Serviciul de curierat expres se diferențiază fundamental de poșta tradițională prin viteză, siguranță și responsabilitate personală. În timp ce un plic trimis prin poștă poate dura 5-7 zile și trece prin multiple puncte de sortare cu risc de pierdere, curierul nostru preia plicul personal de la dumneavoastră și îl livrează direct destinatarului, în 24-48 ore pentru majoritatea destinațiilor europene. Fiecare plic este tracked individual și știți exact unde se află în fiecare moment.

Timpul de livrare depinde de distanță și serviciul ales. Pentru serviciul express premium, livrarea în 24 ore este posibilă pentru majoritatea capitalelor europene - București către Londra, Viena, Berlin, Budapesta. Pentru serviciul standard express, livrarea în 48 ore acoperă practic întreaga Europă, inclusiv destinații mai îndepărtate precum Lisabona, Madrid, Helsinki sau Atena. Pentru urgențe absolute, unii curieri oferă serviciu same-day pentru curse în aceeași țară sau la distanțe scurte.

Confidențialitatea este garantată prin multiple măsuri de securitate. Plicurile sunt sigilate în prezența clientului și orice semn de deschidere ar fi imediat vizibil. Curierii sunt instruiți să nu dezvăluie conținutul și să nu deschidă plicurile în nicio circumstanță. Pentru documente extrem de sensibile - contracte importante, acte care conțin date personale conform GDPR - mulți curieri folosesc plicuri securizate speciale cu mai multe straturi de protecție și sigilii evidente.

Procesul de ridicare este flexibil și adaptat nevoilor clientului. Puteți programa ridicarea pentru un moment specific - dimineață, după-amiază, seară - sau puteți solicita ridicare imediată pentru urgențe (de obicei în 1-2 ore în zonele urbane). Curierul vine la adresa indicată, preia plicul, verifică adresa de livrare și datele de contact ale destinatarului, și vă furnizează un număr de tracking unic pentru monitorizare.

Tracking-ul în timp real vă permite să urmăriți progresul livrării pas cu pas. Vedeți când plicul a fost preluat, când a fost preluat de curierul internațional (dacă e cazul), când a trecut frontiera, când a ajuns în orașul de destinație și când a fost livrat final. La livrare, primiți notificare instant prin SMS și email, inclusiv semnătura digitalizată a destinatarului sau fotografia confirmării de recepție.

Pentru documente care necesită semnătură la primire sau proof of delivery, curierii oferă serviciu cu confirmare obligatorie. Destinatarul trebuie să semneze personal și să prezinte un act de identitate pentru confirmare. În cazul lipsei destinatarului, se fac de obicei 2-3 încercări de livrare la intervale diferite, sau se livrează la vecinul de încredere indicat de client, sau se păstrează la sediul curierului pentru ridicare personală.

Documentele importante trebuie ambalate corect chiar dacă par rezistente. Recomandăm folosirea plicurilor cu bule pentru protecție suplimentară, învelirea în folie plastic dacă există risc de umezeală, și folosirea plicurilor rigide pentru documente care nu trebuie îndoite (certificate originale, diplome). Pentru volume mari de documente sau dosare, se folosesc cutii rigide de dimensiuni adecvate cu materiale de protecție.

Costul serviciului de curierat expres variază în funcție de greutate, distanță și viteza de livrare dorită. Un plic standard sub 500g către o capitală europeană costă de obicei între 25-50 euro pentru livrare în 48h și 50-80 euro pentru express 24h. Deși pare scump comparativ cu poșta, valoarea documentelor transportate și importanța termenelor justifică investiția. Pentru firme care trimit frecvent documente, mulți curieri oferă tarife preferențiale sau contracte corporative cu reduceri substanțiale.`,
    insurance: [
      { title: 'Licență de curierat rapid valabilă', description: 'Toți curierii dețin licență de curierat rapid autorizată pentru transport documente și colete mici' },
      { title: 'Asigurare pentru documente', description: 'Asigurare de răspundere care acoperă pierderea sau deteriorarea documentelor transportate' },
      { title: 'Confidențialitate garantată', description: 'Curieri cu cazier curat, instruiți în manipularea confidențială a documentelor sensibile' },
      { title: 'Tracking și confirmare livrare', description: 'Sistem de tracking în timp real și confirmare de primire cu semnătură digitală la livrare' },
    ],
    benefits: [
      'Livrare expresă în 24-48 ore',
      'Tracking în timp real',
      'Confirmare de primire',
      'Manipulare confidențială',
      'Ridicare de la adresă',
    ],
    popularRoutes: ['România - UK', 'România - Germania', 'România - Italia', 'România - Spania'],
    faq: [
      { q: 'Cât de repede ajunge un plic?', a: 'Livrare expresă în 24-48 ore pentru majoritatea destinațiilor europene.' },
      { q: 'Primesc confirmare de livrare?', a: 'Da, primești notificare instant când documentul a fost livrat.' },
      { q: 'Este confidențial conținutul?', a: 'Absolut. Nu deschidem și nu inspectăm conținutul plicurilor.' },
    ],
    color: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-500/30',
  },
  paleti: {
    title: 'Transport Paleți și Marfă Paletizată Europa',
    description: 'Transport marfă paletizată în toată Europa. Soluții flexibile pentru afaceri și particulari.',
    longDescription: 'Serviciu profesional de transport paleți pentru business și persoane fizice. De la un singur palet până la camioane complete.',
    article: `Transportul de marfă paletizată reprezintă coloana vertebrală a comerțului european, oferind o metodă standardizată, eficientă și sigură de a muta cantități mari de produse între țări. Platforma Curierul Perfect conectează afaceri și particulari cu transportatori profesioniști care oferă soluții flexibile de la un singur palet până la camioane complete de marfă.

Toți transportatorii de paleți din platforma noastră dețin licență de transport marfă internațional, asigurare CMR valabilă pentru întreaga Europă, camioane moderne echipate cu sisteme de fixare profesionale (chingi, bare de fixare, plase de protecție), și experiență în manipularea diferitelor tipuri de marfă - de la produse alimentare care necesită temperatură controlată până la bunuri fragile care cer atenție specială.

Paletul european standard (EUR-palet sau EPAL) are dimensiunile de 120cm x 80cm și poate suporta în mod sigur până la 1500kg de greutate statică sau 1000kg în timpul transportului. Înălțimea maximă recomandată a mărfii pe palet este de 120-150cm, astfel încât paletul complet să nu depășească 180cm înălțime totală. Această standardizare permite utilizarea eficientă a spațiului în camioane și facilitează manipularea cu stivuitoare și transpalete în depozite și puncte de livrare.

Pentru afaceri care expediază regulat, înțelegerea capacității unui camion este esențială pentru optimizarea costurilor. Un camion standard tip curtain-side (cu prelată laterală) poate încărca 33 de paleți EUR pe un nivel sau până la 66 de paleți dacă se folosește încărcare pe două niveluri (pentru marfă ușoară care permite suprapunerea). Un camion frigorific are capacitate ușor redusă din cauza izolației - aproximativ 30 de paleți. Mega-trailere (cu înălțime mărită) pot încărca 100 de paleți sau mai mult.

Serviciul de grupaj (LTL - Less Than Truckload) este ideal când aveți doar câțiva paleți și nu justifică costul unui camion complet. Palețiiau dumneavoastră sunt combinați cu ai altor clienți pe aceeași rută, reducând semnificativ costul per palet. Dezavantajul este timpul ușor mai lung de livrare din cauza opririlor multiple pentru încărcări și descărcări. De obicei, grupajul adaugă 1-2 zile față de transportul dedicat, dar costă cu 40-60% mai puțin.

Transportul dedicat (FTL - Full Truckload) este recomandat când aveți cel puțin 15-20 de paleți sau când viteza și siguranța sunt prioritare. Camionul este rezervat exclusiv pentru marfa dumneavoastră, nu face opriri intermediate, și ajunge mai rapid la destinație. Pentru marfă sensibilă, valoroasă sau care necesită condiții speciale (temperatură, umiditate), transportul dedicat este singura opțiune recomandată.

Ambalarea și paletizarea corectă sunt esențiale pentru protecția mărfii în timpul transportului. Cutiile trebuie aranjate stable pe palet, preferabil în straturi uniforme care se leagă între ele. Folosiți folie stretch pentru a ține cutiile unite și a preveni deplasarea. Pentru paleți care vor fi suprapuși, puneți un top-cap (placă de carton groasă) deasupra ultimului strat de cutii pentru distribuirea uniformă a greutății. Colțurile paletului trebuie protejate cu profile din carton sau plastic pentru a preveni deteriorarea de către chingile de fixare.

Mărfurile care necesită temperatură controlată - produse alimentare, medicamente, produse chimice sensibile - trebuie transportate în camioane frigorifice sau izoterme. Transportatorii noștri specializați în cargo refrigerat mențin temperatura constantă între -25°C și +25°C, cu monitorizare continuă și alarme în caz de abateri. Pentru produse farmaceutice, se furnizează rapoarte de temperatură validate GDP (Good Distribution Practice) pentru conformitatea regulatorie.

Documentația pentru transport internațional de paleți include: factură comercială sau pro-forma (pentru vamă), packing list detaliat cu conținutul fiecărui palet, CMR (document de transport internațional), și certificat de origine dacă este necesar. Pentru produse alimentare se adaugă certificate sanitare-veterinare, pentru produse reglementate pot fi necesare licențe speciale. Transportatorii experimentați vă pot asista la pregătirea tuturor documentelor necesare pentru trecerea rapidă prin vamă.

Livrarea la destinație poate fi făcută la rampă (dock delivery) sau la sol (kerbside delivery). Livrarea la rampă presupune că destinatarul are rampă de încărcare și stivuitor pentru descărcare. Livrarea la sol înseamnă că camionul descarcă palețiiîn stradă folosind lift hidraulic (tail-lift), dar destinatarul trebuie să aibă transpalet pentru deplasarea paletțiilor. Dacă destinatarul nu are echipament, unii transportatori oferă serviciu de descărcare manuală cu cost suplimentar.

Costurile pentru transport paleți variază în funcție de număr de paleți, greutate totală, distanță, tip de marfă și servicii suplimentare. În mod orientativ, un palet în grupaj către Germania costă 80-120 euro, către UK 150-200 euro, către Spania/Italia 120-180 euro. Un camion complet (33 paleți) către Germania costă 1200-1800 euro, către UK 2000-2800 euro. Aceste prețuri sunt estimate și depind de sezon, prețul combustibilului și cerere.`,
    insurance: [
      { title: 'Asigurare CMR pentru marfă paletizată', description: 'Toată marfa transportată este acoperită de asigurare CMR conform convențiilor internaționale de transport' },
      { title: 'Asigurare extinsă pentru marfă valoroasă', description: 'Pentru paleți cu produse de valoare mare, oferim asigurare suplimentară la valoarea declarată completă' },
      { title: 'Licențe transport internațional valabile', description: 'Toți transportatorii dețin licențe CEMT sau cabotaj pentru operare legală în toate țările europene' },
      { title: 'Camioane echipate profesional', description: 'Vehicule moderne cu sisteme de fixare certificate, GPS tracking și opțional control temperatură pentru cargo sensibil' },
    ],
    benefits: [
      'Transport de la 1 palet',
      'Camioane complete disponibile',
      'Grupaj economic',
      'Documentație completă',
      'Livrare la rampă sau la sol',
    ],
    popularRoutes: ['România - UK', 'România - Germania', 'România - Italia', 'România - Franța'],
    faq: [
      { q: 'Ce dimensiuni are un palet standard?', a: 'Palet EURO: 120x80cm, max 120cm înălțime, max 500kg.' },
      { q: 'Oferiți și ambalare?', a: 'Da, putem paletiză și ambala marfa dacă nu este pregătită.' },
      { q: 'Aveți transport refrigerat?', a: 'Da, pentru mărfuri perisabile avem camioane frigorifice.' },
    ],
    color: 'from-slate-500/20 to-gray-500/20',
    borderColor: 'border-slate-500/30',
  },
};

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { serviciu } = await params;
  const data = servicesData[serviciu];

  if (!data) {
    return {
      title: 'Serviciu negăsit',
    };
  }

  // Service-specific keywords
  const serviceKeywords: Record<string, string[]> = {
    colete: [
      'transport colete România Europa',
      'curier colete România',
      'trimite colete Europa',
      'transport colete internațional',
      'curierat internațional România',
      'livrare colete Europa',
      'transport pachete România Germania',
      'transport pachete România UK',
      'transport pachete România Italia',
      'trimite colete în străinătate',
      'curier România Europa',
      'transport colete rapid',
      'livrare colete internațional',
    ],
    persoane: [
      'transport persoane România Europa',
      'transport România Germania persoane',
      'transport România UK persoane',
      'transport România Italia persoane',
      'curse România Europa',
      'microbuz România Germania',
      'transport pasageri internațional',
      'călătorie România Europa',
      'transport persoane internațional',
      'microbuz România Italia',
      'autocar România Europa',
    ],
    mobila: [
      'transport mobilă România Europa',
      'mutare mobilă România Germania',
      'mutare mobilă România UK',
      'transport mobilă internațional',
      'mutări internaționale România',
      'relocare mobilă Europa',
      'transport mobilier România Italia',
      'mutare apartament România Europa',
      'transport mobilă casa României Germania',
      'mutări mobilă străinătate',
    ],
    animale: [
      'transport animale România Europa',
      'transport câini România Germania',
      'transport pisici România UK',
      'transport animale companie internațional',
      'relocare animale Europa',
      'transport pet România Italia',
      'transport câini România Italia',
      'transport animale autorizat',
      'călătorie animale Europa',
      'transport câini străinătate',
    ],
    platforma: [
      'transport auto pe platformă România',
      'platformă auto România Europa',
      'transport mașini România Germania',
      'transport vehicule platformă',
      'transport auto internațional',
      'platformă auto România UK',
      'transport mașini România Italia',
      'transport autoturisme Europa',
      'platformă transport auto',
    ],
    tractari: [
      'tractări auto România Europa',
      'tractări internaționale România',
      'asistență rutieră Europa',
      'tractare auto România Germania',
      'transport mașini defecte Europa',
      'service rutier internațional',
      'tractări România UK',
      'tractări România Italia',
      'recuperare auto Europa',
    ],
    electronice: [
      'transport electronice România Europa',
      'transport fragile internațional',
      'transport echipamente IT Europa',
      'livrare electronice România Germania',
      'transport laptop România UK',
      'transport echipamente sensibile',
      'livrare electronice sigură Europa',
      'transport aparatură electronică',
    ],
    plicuri: [
      'curier plicuri România Europa',
      'transport plicuri internațional',
      'curier documente România Germania',
      'livrare plicuri România UK',
      'curier plicuri România Italia',
      'transport documente Europa',
      'curier expres internațional',
      'livrare plicuri rapidă Europa',
      'transport corespondență internațională',
    ],
    paleti: [
      'transport paleți România Europa',
      'transport marfă paleți',
      'grupaj România Europa',
      'transport FTL România Germania',
      'transport LTL România Europa',
      'transport paleți internațional',
      'transport marfă voluminoasă Europa',
      'transport paleți România UK',
      'transport paleți România Italia',
      'grupaj internațional România',
    ],
  };

  const title = `${data.title} | Curierul Perfect`;
  const description = `${data.description} Transportatori verificați cu asigurare. Plasează comandă gratuită și primește oferte personalizate în 24 ore.`;
  const keywords = serviceKeywords[serviciu] || [];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://curierulperfect.com/servicii/${serviciu}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ro_RO',
      url: `https://curierulperfect.com/servicii/${serviciu}`,
      siteName: 'Curierul Perfect',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate static params for all services
export function generateStaticParams() {
  return Object.keys(servicesData).map((serviciu) => ({
    serviciu,
  }));
}

export default async function ServiciuPage({ params }: { params: Promise<Params> }) {
  const { serviciu } = await params;
  const data = servicesData[serviciu];

  if (!data) {
    notFound();
  }

  // Structured data schemas for SEO
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.title,
    description: data.description,
    provider: {
      '@type': 'Organization',
      name: 'Curierul Perfect',
      url: 'https://curierulperfect.com',
      logo: 'https://curierulperfect.com/logo.png',
    },
    serviceType: data.title,
    areaServed: {
      '@type': 'Place',
      name: 'Europa',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `https://curierulperfect.com/servicii/${serviciu}`,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Servicii ${data.title}`,
      itemListElement: data.benefits.map((benefit) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: benefit,
        },
      })),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Acasă',
        item: 'https://curierulperfect.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Servicii',
        item: 'https://curierulperfect.com/#servicii',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.title,
        item: `https://curierulperfect.com/servicii/${serviciu}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className={`relative py-20 sm:py-24 px-4 overflow-hidden`}>
          {/* Background effects */}
          <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-800/50 to-slate-900"></div>
          <div className={`absolute inset-0 bg-linear-to-br ${data.color} opacity-30`}></div>
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-linear-to-br from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Acasă</Link>
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-medium">Servicii</span>
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-400">{data.title.split(' - ')[0]}</span>
            </nav>

            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Icon and title */}
              <div className="flex-1">
                <div className="flex items-center gap-6 mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-slate-800/80 backdrop-blur-sm border-2 ${data.borderColor} flex items-center justify-center shadow-2xl`}>
                    <ServiceIcon service={serviciu} className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-emerald-400 text-sm font-medium mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Serviciu verificat
                    </p>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">{data.title}</h1>
                  </div>
                </div>
                <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">{data.longDescription}</p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href={`/comanda?serviciu=${serviciu}`} 
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:scale-105 active:scale-95"
                  >
                    Solicită ofertă gratuită
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/cum-functioneaza"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700 text-white font-medium rounded-xl border border-white/10 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cum funcționează
                  </Link>
                </div>
              </div>

              {/* Stats card */}
              <div className="lg:w-80 w-full">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    De ce să alegi acest serviciu?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Transportatori verificați</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Asigurare completă inclusă</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Răspuns rapid în 24h</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-300">Prețuri transparente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Section - Detailed Content */}
        <section className="py-20 px-4 bg-linear-to-b from-slate-900 to-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 sm:p-12">
              <div className="prose prose-invert prose-lg max-w-none">
                {data.article.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-300 leading-relaxed mb-6 first:text-xl first:text-gray-200 first:font-medium">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Insurance & Verification Section */}
        <section className="py-16 px-4 bg-linear-to-br from-emerald-500/10 to-blue-500/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium mb-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Transportatori Verificați și Asigurați
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Siguranța Ta Este Prioritatea Noastră
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Toți transportatorii din platforma noastră sunt verificați riguros și dețin asigurările necesare pentru protecția completă a bunurilor tale.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {data.insurance.map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-slate-800/50 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">100% verificați</span> - Licențe și asigurări validate periodic
                  </p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-white/10"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">Recenzii reale</span> - Transparență completă în evaluări
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4 bg-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">De ce să alegi Curierul Perfect?</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Servicii complete cu toate avantajele de care ai nevoie pentru un transport sigur și eficient</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.benefits.map((benefit, idx) => {
                // Function to select appropriate icon based on benefit text
                const getIconForBenefit = (text: string) => {
                  const lowerText = text.toLowerCase();
                  
                  // Time/Speed related
                  if (lowerText.includes('24') || lowerText.includes('48') || lowerText.includes('rapid') || lowerText.includes('expresă') || lowerText.includes('livrare') || lowerText.includes('ore')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                  }
                  // Tracking/GPS
                  if (lowerText.includes('tracking') || lowerText.includes('timp real') || lowerText.includes('monitorizare') || lowerText.includes('gps')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
                  }
                  // Insurance/Protection
                  if (lowerText.includes('asigurare') || lowerText.includes('protecție') || lowerText.includes('siguranță') || lowerText.includes('acoperit')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
                  }
                  // Home pickup/delivery
                  if (lowerText.includes('domiciliu') || lowerText.includes('ridicare') || lowerText.includes('adresa') || lowerText.includes('ușă')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
                  }
                  // Money/Pricing
                  if (lowerText.includes('cost') || lowerText.includes('preț') || lowerText.includes('tarif') || lowerText.includes('fără') || lowerText.includes('transparent')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                  }
                  // Packing/Wrapping
                  if (lowerText.includes('ambalare') || lowerText.includes('împachetat') || lowerText.includes('cutii') || lowerText.includes('materiale')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
                  }
                  // Vehicles/Modern equipment
                  if (lowerText.includes('modern') || lowerText.includes('vehicul') || lowerText.includes('camion') || lowerText.includes('microbuz') || lowerText.includes('autocar') || lowerText.includes('platformă')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
                  }
                  // Climate control/Comfort
                  if (lowerText.includes('climat') || lowerText.includes('confort') || lowerText.includes('temperatură') || lowerText.includes('ac') || lowerText.includes('încălzire') || lowerText.includes('wifi')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                  }
                  // Documents/Papers
                  if (lowerText.includes('document') || lowerText.includes('vamă') || lowerText.includes('licență') || lowerText.includes('certificat') || lowerText.includes('permis')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
                  }
                  // Professional/Experienced
                  if (lowerText.includes('profesionist') || lowerText.includes('experien') || lowerText.includes('instruit') || lowerText.includes('calificat') || lowerText.includes('pregătit')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
                  }
                  // Assistance/Support
                  if (lowerText.includes('asistență') || lowerText.includes('suport') || lowerText.includes('ajutor') || lowerText.includes('service') || lowerText.includes('disponibil') || lowerText.includes('24/7')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
                  }
                  // Baggage/Space
                  if (lowerText.includes('bagaj') || lowerText.includes('spațiu') || lowerText.includes('generos') || lowerText.includes('încăpător')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
                  }
                  // Fixation/Securing
                  if (lowerText.includes('fixare') || lowerText.includes('securiz') || lowerText.includes('ching') || lowerText.includes('prinde')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
                  }
                  // Food/Water (for animals)
                  if (lowerText.includes('hrană') || lowerText.includes('apă') || lowerText.includes('pauze') || lowerText.includes('plimbare')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;
                  }
                  // Animals
                  if (lowerText.includes('animal') || lowerText.includes('câin') || lowerText.includes('pisic') || lowerText.includes('pet')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
                  }
                  // Intervention/Emergency
                  if (lowerText.includes('intervenție') || lowerText.includes('rapid') || lowerText.includes('urgență') || lowerText.includes('minut')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
                  }
                  // Unpacking/Mounting
                  if (lowerText.includes('dezambalare') || lowerText.includes('montare') || lowerText.includes('asamblare') || lowerText.includes('instalare')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
                  }
                  // Confidential/Privacy
                  if (lowerText.includes('confidențial') || lowerText.includes('sigil') || lowerText.includes('privat') || lowerText.includes('securitate')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
                  }
                  // Confirmation/Signature
                  if (lowerText.includes('confirmare') || lowerText.includes('semnătură') || lowerText.includes('primire') || lowerText.includes('notificare')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
                  }
                  // Pallets/Cargo
                  if (lowerText.includes('palet') || lowerText.includes('grupaj') || lowerText.includes('camion') || lowerText.includes('dedicat') || lowerText.includes('marfă')) {
                    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
                  }
                  
                  // Default checkmark icon
                  return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
                };

                const icon = getIconForBenefit(benefit);
                const colors = ['text-emerald-400', 'text-blue-400', 'text-purple-400', 'text-orange-400', 'text-yellow-400', 'text-cyan-400', 'text-pink-400'];
                const bgColors = ['bg-emerald-500/20', 'bg-blue-500/20', 'bg-purple-500/20', 'bg-orange-500/20', 'bg-yellow-500/20', 'bg-cyan-500/20', 'bg-pink-500/20'];
                const borderColors = ['border-emerald-500/30', 'border-blue-500/30', 'border-purple-500/30', 'border-orange-500/30', 'border-yellow-500/30', 'border-cyan-500/30', 'border-pink-500/30'];
                
                return (
                  <div key={idx} className={`group bg-slate-800/50 backdrop-blur-sm border ${borderColors[idx % borderColors.length]} hover:border-opacity-60 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-black/20`}>
                    <div className={`w-12 h-12 ${bgColors[idx % bgColors.length]} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <span className={colors[idx % colors.length]}>{icon}</span>
                    </div>
                    <p className="text-gray-200 leading-relaxed font-medium">{benefit}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular Routes Section */}
        <section className="py-20 px-4 bg-linear-to-b from-slate-800/50 to-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Rute populare</h2>
              <p className="text-gray-400 text-lg">Operăm pe cele mai solicitate trasee din Europa</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.popularRoutes.map((route, idx) => (
                <div key={idx} className={`group relative bg-slate-800/50 backdrop-blur-sm border ${data.borderColor} hover:border-opacity-60 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl overflow-hidden`}>
                  <div className={`absolute inset-0 bg-linear-to-br ${data.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative flex items-center justify-between">
                    <div className="text-lg font-semibold text-white group-hover:scale-105 transition-transform">{route}</div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-slate-900">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Întrebări frecvente</h2>
              <p className="text-gray-400 text-lg">Răspunsuri la cele mai comune întrebări despre acest serviciu</p>
            </div>
            <div className="space-y-4">
              {data.faq.map((item, idx) => (
                <details key={idx} className="group bg-slate-800/50 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-800/70 transition-colors">
                    <h3 className="text-lg font-semibold text-white pr-4">{item.q}</h3>
                    <svg className="w-6 h-6 text-orange-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 border-t border-white/5">
                    <p className="text-gray-400 leading-relaxed pt-4">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 via-red-500/20 to-orange-500/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl">
              <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Gata să plasezi o comandă?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Primești oferte personalizate de la curieri verificați în câteva minute. 100% gratuit, fără obligații.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href={`/comanda?serviciu=${serviciu}`} 
                  className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-orange-500/40 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  Plasează comandă acum
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-slate-700/50 backdrop-blur-sm hover:bg-slate-700 text-white text-lg font-semibold rounded-xl border border-white/10 transition-all w-full sm:w-auto"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contactează-ne
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Gratuit și fără obligații</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Răspuns în 24 ore</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Curieri verificați</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}