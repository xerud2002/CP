'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CoverageZone } from '@/types';

const judetByCountry: Record<string, string[]> = {
  RO: ["Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila", "București", "Buzău", "Călărași", "Caraș-Severin", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Sălaj", "Satu Mare", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"],
  GB: ["Bedfordshire", "Berkshire", "Bristol", "Buckinghamshire", "Cambridgeshire", "Cheshire", "Londra", "Cornwall", "County Durham", "Cumbria", "Derbyshire", "Devon", "Dorset", "East Riding of Yorkshire", "East Sussex", "Essex", "Gloucestershire", "Greater London", "Greater Manchester", "Hampshire", "Herefordshire", "Hertfordshire", "Isle of Wight", "Kent", "Lancashire", "Leicestershire", "Lincolnshire", "Merseyside", "Norfolk", "North Yorkshire", "Northamptonshire", "Northumberland", "Nottinghamshire", "Oxfordshire", "Rutland", "Shropshire", "Somerset", "South Yorkshire", "Staffordshire", "Suffolk", "Surrey", "Tyne and Wear", "Warwickshire", "West Midlands", "West Sussex", "West Yorkshire", "Wiltshire", "Worcestershire"],
  IT: ["Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", "Lazio", "Liguria", "Lombardia", "Marche", "Molise", "Piemonte", "Puglia", "Sardegna", "Sicilia", "Toscana", "Trentino-Alto Adige", "Umbria", "Valle d'Aosta", "Veneto"],
  ES: ["Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country", "Canary Islands", "Cantabria", "Castile and León", "Castilla-La Mancha", "Catalonia", "Extremadura", "Galicia", "La Rioja", "Madrid", "Murcia", "Navarre", "Valencia"],
  DE: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"],
  FR: ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Bretagne", "Centre-Val de Loire", "Corse", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandie", "Nouvelle-Aquitaine", "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"],
  AT: ["Burgenland", "Carinthia", "Lower Austria", "Upper Austria", "Salzburg", "Styria", "Tyrol", "Vorarlberg", "Vienna"],
  BE: ["Brussels", "Flemish Brabant", "Walloon Brabant", "Antwerp", "Limburg", "Liège", "Namur", "Luxembourg", "Hainaut", "East Flanders", "West Flanders"],
  NL: ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "North Brabant", "North Holland", "Overijssel", "South Holland", "Utrecht", "Zeeland"],
  GR: ["Attica", "Central Greece", "Central Macedonia", "Crete", "East Macedonia and Thrace", "Epirus", "Ionian Islands", "North Aegean", "Peloponnese", "South Aegean", "Thessaly", "Western Greece", "Western Macedonia"],
  PT: ["Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro", "Guarda", "Leiria", "Lisbon", "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu", "Madeira", "Azores"],
  NO: ["Agder", "Innlandet", "Møre og Romsdal", "Nordland", "Oslo", "Rogaland", "Troms og Finnmark", "Trøndelag", "Vestfold og Telemark", "Vestland", "Viken"],
  SE: ["Blekinge", "Dalarna", "Gävleborg", "Gotland", "Halland", "Jämtland", "Jönköping", "Kalmar", "Kronoberg", "Norrbotten", "Örebro", "Östergötland", "Skåne", "Södermanland", "Stockholm", "Uppsala", "Värmland", "Västerbotten", "Västernorrland", "Västmanland", "Västra Götaland"],
  DK: ["Capital Region", "Central Denmark Region", "North Denmark Region", "Region Zealand", "Region of Southern Denmark"],
  FI: ["Uusimaa", "Varsinais-Suomi", "Satakunta", "Kanta-Häme", "Pirkanmaa", "Päijät-Häme", "Kymenlaakso", "South Karelia", "Etelä-Savo", "North Savo", "North Karelia", "Central Finland", "South Ostrobothnia", "Ostrobothnia", "Central Ostrobothnia", "North Ostrobothnia", "Kainuu", "Lapland", "Åland"],
  IE: ["Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath", "Wexford", "Wicklow"],
};

const countries = [
  { code: 'RO', name: 'România' },
  { code: 'GB', name: 'Anglia' },
  { code: 'IT', name: 'Italia' },
  { code: 'ES', name: 'Spania' },
  { code: 'DE', name: 'Germania' },
  { code: 'FR', name: 'Franța' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgia' },
  { code: 'NL', name: 'Olanda' },
  { code: 'GR', name: 'Grecia' },
  { code: 'PT', name: 'Portugalia' },
  { code: 'NO', name: 'Norvegia' },
  { code: 'SE', name: 'Suedia' },
  { code: 'DK', name: 'Danemarca' },
  { code: 'FI', name: 'Finlanda' },
  { code: 'IE', name: 'Irlanda' },
];

export default function ZonaAcoperiirePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [tara, setTara] = useState('RO');
  const [judet, setJudet] = useState('');
  const [savedZones, setSavedZones] = useState<CoverageZone[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-green-400 text-xl">Se încarcă...</div>
      </div>
    );
  }

  const judete = judetByCountry[tara] || [];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="card mb-8">
          <h1 className="text-2xl font-bold text-green-400 mb-4">Zona ta de Acoperire</h1>
          <p className="text-gray-300 mb-6">
            Aceste informații sunt esențiale pentru ca platforma noastră să îți trimită doar comenzile care se potrivesc cu ruta și disponibilitatea ta.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Țară:</label>
              <select
                value={tara}
                onChange={(e) => setTara(e.target.value)}
                className="form-select"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="form-label">Județ/Regiune:</label>
              <select
                value={judet}
                onChange={(e) => setJudet(e.target.value)}
                className="form-select"
              >
                {judete.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className={`btn-primary ${submitting ? 'opacity-50' : ''}`}
            >
              {submitting ? 'Se salvează...' : 'Adaugă zona'}
            </button>
            
            {message && (
              <p className={message.includes('✅') ? 'text-green-400' : 'text-red-400'}>
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-green-400 mb-4">Zonele tale salvate</h2>
          
          {savedZones.length === 0 ? (
            <p className="text-gray-400">Nu ai nicio zonă salvată încă.</p>
          ) : (
            <ul className="space-y-2">
              {savedZones.map((zone) => (
                <li key={zone.id} className="flex justify-between items-center bg-blue-900/50 p-3 rounded-lg">
                  <span>
                    {countries.find(c => c.code === zone.tara)?.name || zone.tara} - {zone.judet}
                  </span>
                  <button
                    onClick={() => zone.id && handleDelete(zone.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    🗑️ Șterge
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
