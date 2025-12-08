'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CoverageZone } from '@/types';

// Icons
const MapIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const TrashIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const GlobeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

// Countries with flags - sorted alphabetically by name
const countries = [
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

// Regions by country - each array is already sorted alphabetically
const judetByCountry: Record<string, string[]> = {
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

// Helper function to get flag path for a country code
const getFlagPath = (code: string) => `/img/flag/${code.toLowerCase()}.svg`;

export default function ZonaAcoperiirePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [tara, setTara] = useState('GB'); // Default to first country alphabetically (Anglia)
  const [judet, setJudet] = useState('');
  const [savedZones, setSavedZones] = useState<CoverageZone[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  // Custom dropdown states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const regionDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setRegionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Set default judet when tara changes
    const judete = judetByCountry[tara] || [];
    setJudet(judete[0] || '');
  }, [tara]);

  useEffect(() => {
    if (user) {
      loadSavedZones();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadSavedZones = async () => {
    if (!user) return;
    
    const q = query(
      collection(db, 'zona_acoperire'),
      where('uid', '==', user.uid)
    );
    
    const snapshot = await getDocs(q);
    const zones: CoverageZone[] = [];
    snapshot.forEach((doc) => {
      zones.push({ id: doc.id, ...doc.data() } as CoverageZone);
    });
    setSavedZones(zones);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    setMessage('');

    // Check for duplicates
    const exists = savedZones.some(z => z.tara === tara && z.judet === judet);
    if (exists) {
      setMessage('⚠️ Această zonă a fost deja adăugată!');
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, 'zona_acoperire'), {
        uid: user.uid,
        tara,
        judet,
        addedAt: serverTimestamp(),
      });
      
      setMessage('✅ Zonă salvată cu succes!');
      loadSavedZones();
    } catch (error) {
      console.error('❌ Firebase error:', error);
      setMessage('❌ Eroare la salvare în Firebase.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (zoneId: string) => {
    try {
      await deleteDoc(doc(db, 'zona_acoperire', zoneId));
      setMessage('✅ Zonă ștearsă cu succes!');
      loadSavedZones();
    } catch (error) {
      console.error('❌ Delete error:', error);
      setMessage('❌ Eroare la ștergere.');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  const judete = judetByCountry[tara] || [];

  // Group zones by country
  const zonesByCountry = savedZones.reduce((acc, zone) => {
    if (!acc[zone.tara]) acc[zone.tara] = [];
    acc[zone.tara].push(zone);
    return acc;
  }, {} as Record<string, CoverageZone[]>);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard/curier" 
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <MapIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Zona de Acoperire</h1>
                  <p className="text-xs text-gray-500">Configurează zonele tale de livrare</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                {savedZones.length} {savedZones.length === 1 ? 'zonă' : 'zone'} active
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="mb-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <GlobeIcon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">De ce este important?</h3>
              <p className="text-gray-400 text-sm">
                Zonele de acoperire permit platformei să îți trimită doar comenzile care se potrivesc cu ruta și disponibilitatea ta. 
                Cu cât adaugi mai multe zone, cu atât vei primi mai multe comenzi relevante.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Zone Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/5 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <PlusIcon className="w-5 h-5 text-emerald-400" />
                Adaugă zonă nouă
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Custom Country Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Țară</label>
                  <div className="relative" ref={countryDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all flex items-center justify-between"
                    >
                      <span className="flex items-center gap-3">
                        <Image 
                          src={getFlagPath(tara)} 
                          alt={countries.find(c => c.code === tara)?.name || ''} 
                          width={24} 
                          height={18} 
                          className="rounded-sm shadow-sm"
                        />
                        <span>{countries.find(c => c.code === tara)?.name}</span>
                      </span>
                      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {countryDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                        {countries.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setTara(c.code);
                              setCountryDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-emerald-500/10 transition-colors ${
                              tara === c.code ? 'bg-emerald-500/20 text-emerald-400' : 'text-white'
                            }`}
                          >
                            <Image 
                              src={c.flag} 
                              alt={c.name} 
                              width={24} 
                              height={18} 
                              className="rounded-sm shadow-sm"
                            />
                            <span>{c.name}</span>
                            {tara === c.code && <CheckIcon className="w-4 h-4 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Custom Region Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Județ / Regiune</label>
                  <div className="relative" ref={regionDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all flex items-center justify-between"
                    >
                      <span className="flex items-center gap-3">
                        <Image 
                          src={getFlagPath(tara)} 
                          alt={countries.find(c => c.code === tara)?.name || ''} 
                          width={20} 
                          height={15} 
                          className="rounded-sm shadow-sm opacity-60"
                        />
                        <span>{judet || 'Selectează o regiune'}</span>
                      </span>
                      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${regionDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {regionDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                        {judete.map((j) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() => {
                              setJudet(j);
                              setRegionDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-emerald-500/10 transition-colors ${
                              judet === j ? 'bg-emerald-500/20 text-emerald-400' : 'text-white'
                            }`}
                          >
                            <Image 
                              src={getFlagPath(tara)} 
                              alt="" 
                              width={16} 
                              height={12} 
                              className="rounded-sm shadow-sm opacity-40"
                            />
                            <span>{j}</span>
                            {judet === j && <CheckIcon className="w-4 h-4 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    submitting 
                      ? 'bg-emerald-500/50 text-emerald-200 cursor-not-allowed' 
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Se salvează...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      Adaugă zona
                    </>
                  )}
                </button>
                
                {message && (
                  <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                    message.includes('✅') 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {message.includes('✅') ? <CheckIcon className="w-4 h-4" /> : '⚠️'}
                    {message.replace('✅ ', '').replace('⚠️ ', '').replace('❌ ', '')}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Saved Zones */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-emerald-400" />
                Zonele tale salvate
                {savedZones.length > 0 && (
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    {Object.keys(zonesByCountry).length} {Object.keys(zonesByCountry).length === 1 ? 'țară' : 'țări'}
                  </span>
                )}
              </h2>
              
              {savedZones.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                    <MapIcon className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-2">Nu ai nicio zonă salvată încă</p>
                  <p className="text-gray-500 text-sm">Adaugă prima ta zonă de acoperire din formularul alăturat</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(zonesByCountry).map(([countryCode, zones]) => {
                    const country = countries.find(c => c.code === countryCode);
                    return (
                      <div key={countryCode} className="space-y-3">
                        {/* Country Header */}
                        <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                          <Image 
                            src={getFlagPath(countryCode)} 
                            alt={country?.name || countryCode} 
                            width={28} 
                            height={21} 
                            className="rounded-sm shadow-md"
                          />
                          <span className="font-medium text-white">{country?.name || countryCode}</span>
                          <span className="ml-auto text-xs text-gray-500 bg-slate-700/50 px-2 py-1 rounded-full">
                            {zones.length} {zones.length === 1 ? 'regiune' : 'regiuni'}
                          </span>
                        </div>
                        
                        {/* Zones Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {zones.map((zone) => (
                            <div 
                              key={zone.id} 
                              className="group flex items-center justify-between p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-white/5 hover:border-white/10 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <Image 
                                  src={getFlagPath(countryCode)} 
                                  alt="" 
                                  width={18} 
                                  height={14} 
                                  className="rounded-sm opacity-50"
                                />
                                <span className="text-gray-300">{zone.judet}</span>
                              </div>
                              <button
                                onClick={() => zone.id && handleDelete(zone.id)}
                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                title="Șterge zona"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            {savedZones.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 text-center">
                  <p className="text-2xl font-bold text-white">{savedZones.length}</p>
                  <p className="text-xs text-gray-500">Total zone</p>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 text-center">
                  <p className="text-2xl font-bold text-white">{Object.keys(zonesByCountry).length}</p>
                  <p className="text-xs text-gray-500">Țări acoperite</p>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 text-center">
                  <p className="text-2xl font-bold text-emerald-400">Activ</p>
                  <p className="text-xs text-gray-500">Status</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
