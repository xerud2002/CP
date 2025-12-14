// Shared constants across the application

// Countries sorted alphabetically by name
export const countries = [
  { code: 'GB', name: 'Anglia', flag: '/img/flag/gb.svg' },
  { code: 'AT', name: 'Austria', flag: '/img/flag/at.svg' },
  { code: 'BE', name: 'Belgia', flag: '/img/flag/be.svg' },
  { code: 'DK', name: 'Danemarca', flag: '/img/flag/dk.svg' },
  { code: 'FI', name: 'Finlanda', flag: '/img/flag/fi.svg' },
  { code: 'FR', name: 'Franța', flag: '/img/flag/fr.svg' },
  { code: 'DE', name: 'Germania', flag: '/img/flag/de.svg' },
  { code: 'GR', name: 'Grecia', flag: '/img/flag/gr.svg' },
  { code: 'IE', name: 'Irlanda', flag: '/img/flag/ie.svg' },
  { code: 'IT', name: 'Italia', flag: '/img/flag/it.svg' },
  { code: 'NO', name: 'Norvegia', flag: '/img/flag/no.svg' },
  { code: 'NL', name: 'Olanda', flag: '/img/flag/nl.svg' },
  { code: 'PT', name: 'Portugalia', flag: '/img/flag/pt.svg' },
  { code: 'RO', name: 'România', flag: '/img/flag/ro.svg' },
  { code: 'ES', name: 'Spania', flag: '/img/flag/es.svg' },
  { code: 'SE', name: 'Suedia', flag: '/img/flag/se.svg' },
];

// Simple countries list (without flag) for forms
export const countriesSimple = countries.map(({ code, name }) => ({ code, name }));

// Județe/Regions by country - Full list for all countries
export const judetByCountry: Record<string, string[]> = {
  RO: ["Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila", "București", "Buzău", "Călărași", "Caraș-Severin", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"],
  GB: ["Bedfordshire", "Berkshire", "Bristol", "Buckinghamshire", "Cambridgeshire", "Cheshire", "Cornwall", "County Durham", "Cumbria", "Derbyshire", "Devon", "Dorset", "East Riding of Yorkshire", "East Sussex", "Essex", "Gloucestershire", "Greater London", "Greater Manchester", "Hampshire", "Herefordshire", "Hertfordshire", "Isle of Wight", "Kent", "Lancashire", "Leicestershire", "Lincolnshire", "Londra", "Merseyside", "Norfolk", "North Yorkshire", "Northamptonshire", "Northumberland", "Nottinghamshire", "Oxfordshire", "Rutland", "Shropshire", "Somerset", "South Yorkshire", "Staffordshire", "Suffolk", "Surrey", "Tyne and Wear", "Warwickshire", "West Midlands", "West Sussex", "West Yorkshire", "Wiltshire", "Worcestershire"],
  IT: ["Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche", "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"],
  ES: ["Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country", "Canary Islands", "Cantabria", "Castile and León", "Castilla-La Mancha", "Catalonia", "Extremadura", "Galicia", "La Rioja", "Madrid", "Murcia", "Navarre", "Valencia"],
  DE: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"],
  FR: ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandie", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"],
  AT: ["Burgenland", "Carinthia", "Lower Austria", "Salzburg", "Styria", "Tyrol", "Upper Austria", "Vienna", "Vorarlberg"],
  BE: ["Antwerp", "Brussels", "East Flanders", "Flemish Brabant", "Hainaut", "Liège", "Limburg", "Luxembourg", "Namur", "Walloon Brabant", "West Flanders"],
  NL: ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "North Brabant", "North Holland", "Overijssel", "South Holland", "Utrecht", "Zeeland"],
  GR: ["Attica", "Central Greece", "Central Macedonia", "Crete", "East Macedonia and Thrace", "Epirus", "Ionian Islands", "North Aegean", "Peloponnese", "South Aegean", "Thessaly", "Western Greece", "Western Macedonia"],
  PT: ["Aveiro", "Azores", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro", "Guarda", "Leiria", "Lisbon", "Madeira", "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu"],
  NO: ["Agder", "Innlandet", "Møre og Romsdal", "Nordland", "Oslo", "Rogaland", "Troms og Finnmark", "Trøndelag", "Vestfold og Telemark", "Vestland", "Viken"],
  SE: ["Blekinge", "Dalarna", "Gotland", "Gävleborg", "Halland", "Jämtland", "Jönköping", "Kalmar", "Kronoberg", "Norrbotten", "Skåne", "Stockholm", "Södermanland", "Uppsala", "Värmland", "Västerbotten", "Västernorrland", "Västmanland", "Västra Götaland", "Örebro", "Östergötland"],
  DK: ["Capital Region", "Central Denmark Region", "North Denmark Region", "Region Zealand", "Region of Southern Denmark"],
  FI: ["Central Finland", "Central Ostrobothnia", "Etelä-Savo", "Kainuu", "Kanta-Häme", "Kymenlaakso", "Lapland", "North Karelia", "North Ostrobothnia", "North Savo", "Ostrobothnia", "Pirkanmaa", "Päijät-Häme", "Satakunta", "South Karelia", "South Ostrobothnia", "Uusimaa", "Varsinais-Suomi", "Åland"],
  IE: ["Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath", "Wexford", "Wicklow"],
};

// Service Types - Unified definition across the app
export const serviceTypes = [
  { 
    id: 'colete', 
    value: 'Colete',
    name: 'Transport Colete', 
    label: 'Colete & Pachete',
    description: 'Colete și pachete standard',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    gradient: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    )
  },
  { 
    id: 'plicuri', 
    value: 'Plicuri',
    name: 'Transport Plicuri/Documente', 
    label: 'Plicuri & Documente',
    description: 'Documente și plicuri urgente',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    gradient: 'from-yellow-500 to-orange-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  { 
    id: 'persoane', 
    value: 'Persoane',
    name: 'Transport Persoane', 
    label: 'Transport Persoane',
    description: 'Pasageri - călătorii în Europa',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    borderColor: 'border-rose-500/30',
    gradient: 'from-rose-500 to-pink-500',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    )
  },
  { 
    id: 'electronice', 
    value: 'Electronice',
    name: 'Transport Electronice', 
    label: 'Electronice',
    description: 'Echipamente electronice fragile',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    gradient: 'from-purple-500 to-pink-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  { 
    id: 'animale', 
    value: 'Animale',
    name: 'Transport Animale', 
    label: 'Animale de Companie',
    description: 'Transport animale de companie',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500/30',
    gradient: 'from-pink-500 to-rose-500',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm3.5-2c-.83 0-1.5.67-1.5 1.5S8.67 7 9.5 7s1.5-.67 1.5-1.5S10.33 4 9.5 4zm5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-2.5 9c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    )
  },
  { 
    id: 'platforma', 
    value: 'Platforma',
    name: 'Transport cu Platformă', 
    label: 'Transport Platformă',
    description: 'Vehicule și echipamente grele',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    gradient: 'from-red-500 to-orange-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <rect x="2" y="16" width="20" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 16V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="20" r="1" />
        <circle cx="16" cy="20" r="1" />
        <path d="M12 16V4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 7h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  { 
    id: 'tractari', 
    value: 'Tractari',
    name: 'Tractări Auto', 
    label: 'Tractări Auto',
    description: 'Tractări și asistență rutieră',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    gradient: 'from-orange-500 to-red-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M5 17h-2a1 1 0 0 1-1-1v-5l3-3h14l3 3v5a1 1 0 0 1-1 1h-2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m9 17 6-6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m15 11 4 4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  { 
    id: 'aeroport', 
    value: 'Aeroport',
    name: 'Transport Aeroport', 
    label: 'Transfer Aeroport',
    description: 'Transfer la/de la aeroport',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    gradient: 'from-cyan-500 to-blue-500',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    )
  },
  { 
    id: 'mobila', 
    value: 'Mobila',
    name: 'Transport Mobilă', 
    label: 'Mobilă & Mutări',
    description: 'Mobilier și obiecte voluminoase',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    gradient: 'from-amber-500 to-orange-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 18v2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 18v2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 4v9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  { 
    id: 'paleti', 
    value: 'Paleti',
    name: 'Transport Paleți', 
    label: 'Paleți & Marfă',
    description: 'Transport paleți și marfă paletizată',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    gradient: 'from-orange-500 to-amber-500',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 6v12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 6v12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 6v12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
];

// Service Names Map - for display
export const serviceNames: Record<string, string> = {
  colete: 'Transport Colete',
  plicuri: 'Transport Plicuri',
  mobila: 'Transport Mobilă',
  electronice: 'Transport Electronice',
  animale: 'Transport Animale',
  persoane: 'Transport Persoane',
  aeroport: 'Transfer Aeroport',
  platforma: 'Transport Platformă',
  tractari: 'Tractări Auto',
  paleti: 'Transport Paleți',
};

// Order Status Configurations - Unified across client and courier dashboards
export const orderStatusConfig = {
  pending: {
    label: 'În așteptare',
    shortLabel: 'Pending',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    dotColor: 'bg-yellow-400',
  },
  accepted: {
    label: 'Acceptată',
    shortLabel: 'Accepted',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    dotColor: 'bg-blue-400',
  },
  in_transit: {
    label: 'În tranzit',
    shortLabel: 'In Transit',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    dotColor: 'bg-orange-400',
  },
  completed: {
    label: 'Finalizată',
    shortLabel: 'Completed',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dotColor: 'bg-emerald-400',
  },
  cancelled: {
    label: 'Anulată',
    shortLabel: 'Cancelled',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    dotColor: 'bg-red-400',
  },
};
