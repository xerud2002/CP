'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, TrashIcon } from '@/components/icons/DashboardIcons';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Tarif {
  id: string;
  tara: string;
  taraCode: string;
  tipServiciu: string;
  pret: number;
  minUnit: number;
  unitType: 'kg' | 'm3' | 'nr' | 'plic';
  // Colete sub-options
  coleteOptions?: {
    express?: boolean;
    frigo?: boolean;
    fragil?: boolean;
    door2door?: boolean;
  };
  // Animale specific fields
  tipAnimal?: 'caine' | 'pisica' | 'pasare' | 'rozator' | 'reptila' | 'altul';
  pretAnimal?: number;
  areCertificat?: boolean;
  areAsigurare?: boolean;
  // Platforma specific fields
  tipVehicul?: ('masina' | 'van' | 'camion' | 'tractor')[];
  acceptaAvariat?: boolean;
}

// Weight icon component
const WeightIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" />
  </svg>
);

// Volume/Cube icon component
const CubeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

// Euro icon component
const EuroIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10h12" />
    <path d="M4 14h9" />
    <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
  </svg>
);

// Countries with codes - sorted alphabetically (16 main European countries)
const countriesWithCodes = [
  { name: 'Anglia', code: 'gb' },
  { name: 'Austria', code: 'at' },
  { name: 'Belgia', code: 'be' },
  { name: 'Danemarca', code: 'dk' },
  { name: 'Finlanda', code: 'fi' },
  { name: 'Franța', code: 'fr' },
  { name: 'Germania', code: 'de' },
  { name: 'Grecia', code: 'gr' },
  { name: 'Irlanda', code: 'ie' },
  { name: 'Italia', code: 'it' },
  { name: 'Norvegia', code: 'no' },
  { name: 'Olanda', code: 'nl' },
  { name: 'Portugalia', code: 'pt' },
  { name: 'România', code: 'ro' },
  { name: 'Spania', code: 'es' },
  { name: 'Suedia', code: 'se' },
];

// Service types with custom SVG icons - Colete is main service with sub-options
const serviceTypes = [
  { 
    value: 'Colete', 
    label: 'Colete', 
    description: 'Transport colete și pachete',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    kgOnly: true,
    hasSubOptions: true,
    subOptions: [
      { value: 'express', label: 'Express', description: 'Livrare urgentă 24-48h', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
      { value: 'frigo', label: 'Frigorific', description: 'Transport refrigerat', color: 'text-sky-400', bgColor: 'bg-sky-500/20' },
      { value: 'fragil', label: 'Fragil', description: 'Manipulare atentă', color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
      { value: 'door2door', label: 'Door to Door', description: 'Ridicare și livrare la adresă', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
    ]
  },
  { 
    value: 'Plicuri', 
    label: 'Plicuri', 
    description: 'Documente și acte importante',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    plicuriOnly: true,
  },
  { 
    value: 'Mobila', 
    label: 'Mobilă', 
    description: 'Transport mobilier',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    m3Only: true,
  },
  { 
    value: 'Electronice', 
    label: 'Electronice', 
    description: 'TV, electrocasnice, produse electronice',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
  { 
    value: 'Animale', 
    label: 'Animale', 
    description: 'Transport animale de companie',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
  },
  { 
    value: 'Auto', 
    label: 'Auto & Piese', 
    description: 'Mașini și piese auto',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
  { 
    value: 'Aeroport', 
    label: 'Transfer Aeroport', 
    description: 'Transfer persoane la/de la aeroport',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    persoaneOnly: true,
  },
  { 
    value: 'Persoane', 
    label: 'Transport Persoane', 
    description: 'Transport persoane în Europa',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    persoaneOnly: true,
  },
  { 
    value: 'Paleti', 
    label: 'Paleți', 
    description: 'Transport paleți și marfă paletizată',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    nrOnly: true,
  },
];

// Service icons as components
const ServiceIcon = ({ service, className = "w-6 h-6" }: { service: string; className?: string }) => {
  const icons: Record<string, React.ReactElement> = {
    Colete: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
    Plicuri: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    Express: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    Door2Door: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    Mobila: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
        <path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" />
        <path d="M4 18v2" />
        <path d="M20 18v2" />
        <path d="M12 4v9" />
      </svg>
    ),
    Electronice: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    Animale: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm3.5-2c-.83 0-1.5.67-1.5 1.5S8.67 7 9.5 7s1.5-.67 1.5-1.5S10.33 4 9.5 4zm5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-2.5 9c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    Auto: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
    Aeroport: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    ),
    Persoane: (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    Frigorific: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18m0-18l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12h18M3 12l3-3m-3 3l3 3m15-3l-3-3m3 3l-3 3" />
      </svg>
    ),
    Paleti: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M3 12h18" />
        <path d="M3 18h18" />
        <path d="M4 6v12" />
        <path d="M12 6v12" />
        <path d="M20 6v12" />
        <rect x="5" y="2" width="14" height="4" rx="1" />
      </svg>
    ),
    Fragil: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
        <path d="M18 2v6" />
        <path d="M15 5h6" />
        <path d="M12 11v5" />
        <path d="M9.5 14h5" />
      </svg>
    ),
  };
  
  return icons[service] || icons.Colete;
};

export default function TarifePracticatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tarife, setTarife] = useState<Tarif[]>([]);
  const [loadingTarife, setLoadingTarife] = useState(true);
  
  // Selected services state (services the courier offers)
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [savingServices, setSavingServices] = useState(false);
  
  // Expanded countries state for tarife list
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  
  const toggleCountryExpand = (country: string) => {
    setExpandedCountries(prev => ({
      ...prev,
      [country]: !prev[country]
    }));
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Load tarife and selected services from Firebase
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        // Load tarife
        const q = query(
          collection(db, 'tarife_curier'),
          where('uid', '==', user.uid),
          orderBy('addedAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const loadedTarife: Tarif[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          loadedTarife.push({
            id: docSnap.id,
            tara: data.tara,
            taraCode: data.taraCode || countriesWithCodes.find(c => c.name === data.tara)?.code || 'eu',
            tipServiciu: data.tipServiciu,
            pret: data.pret ?? data.pretKg ?? 0,
            minUnit: data.minUnit ?? data.minKg ?? 0,
            unitType: data.unitType || 'kg',
            // Animale fields
            tipAnimal: data.tipAnimal,
            pretAnimal: data.pretAnimal,
            areCertificat: data.areCertificat,
            areAsigurare: data.areAsigurare,
            // Platforma fields
            tipVehicul: data.tipVehicul,
            acceptaAvariat: data.acceptaAvariat,
          });
        });
        setTarife(loadedTarife);
        
        // Load selected services from user profile
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          if (userData.serviciiOferite) {
            // Filter out any services that no longer exist in serviceTypes
            const validServiceValues = serviceTypes.map(s => s.value);
            const validServices = userData.serviciiOferite.filter(
              (s: string) => validServiceValues.includes(s)
            );
            setSelectedServices(validServices);
            
            // If some services were filtered out, update Firebase
            if (validServices.length !== userData.serviciiOferite.length) {
              const userDocRef = doc(db, 'users', userDoc.docs[0].id);
              await import('firebase/firestore').then(({ updateDoc }) => 
                updateDoc(userDocRef, { serviciiOferite: validServices })
              );
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingTarife(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Toggle service selection and save to Firebase
  const toggleService = async (serviceValue: string) => {
    if (!user) return;
    
    setSavingServices(true);
    const newServices = selectedServices.includes(serviceValue)
      ? selectedServices.filter(s => s !== serviceValue)
      : [...selectedServices, serviceValue];
    
    try {
      // Find user document
      const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        const userDocRef = doc(db, 'users', userSnapshot.docs[0].id);
        await import('firebase/firestore').then(({ updateDoc }) => 
          updateDoc(userDocRef, { serviciiOferite: newServices })
        );
      }
      
      setSelectedServices(newServices);
    } catch (error) {
      console.error('Error saving services:', error);
    } finally {
      setSavingServices(false);
    }
  };

  const handleDelete = async (tarifId: string) => {
    if (!confirm('Sigur vrei să ștergi acest tarif?')) return;

    try {
      await deleteDoc(doc(db, 'tarife_curier', tarifId));
      setTarife(tarife.filter(t => t.id !== tarifId));
    } catch (error) {
      console.error('Error deleting tarif:', error);
      alert('Eroare la ștergere. Încearcă din nou.');
    }
  };

  const handleDeleteAllForCountry = async (country: string) => {
    if (!confirm(`Sigur vrei să ștergi toate tarifele pentru ${country}?`)) return;

    try {
      const tarifeToDelete = tarife.filter(t => t.tara === country);
      const batch = writeBatch(db);
      tarifeToDelete.forEach(t => {
        batch.delete(doc(db, 'tarife_curier', t.id));
      });
      await batch.commit();
      setTarife(tarife.filter(t => t.tara !== country));
    } catch (error) {
      console.error('Error deleting tarife:', error);
      alert('Eroare la ștergere. Încearcă din nou.');
    }
  };

  // Group tarife by country
  const tarifeByCountry = tarife.reduce((acc, t) => {
    if (!acc[t.tara]) {
      acc[t.tara] = [];
    }
    acc[t.tara].push(t);
    return acc;
  }, {} as Record<string, Tarif[]>);

  // Stats - available for future use
  // const totalTarife = tarife.length;
  // const totalCountries = Object.keys(tarifeByCountry).length;
  // const avgPrice = tarife.length > 0 
  //   ? (tarife.reduce((sum, t) => sum + t.pret, 0) / tarife.length).toFixed(1)
  //   : '0';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/curier" 
              className="p-2.5 hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/20">
                <EuroIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Servicii Active</h1>
                <p className="text-sm text-gray-400 hidden sm:block">Configurează serviciile și tarifele tale pentru clienți</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Service Types Selection */}
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="M9 12h6" />
                  <path d="M9 16h6" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Servicii active</h2>
                <p className="text-xs text-gray-500">Selectează serviciile pe care le oferi clienților</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {savingServices && (
                <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              )}
              <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full font-medium">
                {selectedServices.length} / {serviceTypes.length} active
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
            {serviceTypes.map((service) => {
              const isSelected = selectedServices.includes(service.value);
              return (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => toggleService(service.value)}
                  className={`relative flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 text-left ${
                    isSelected
                      ? 'bg-indigo-500/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-800/50 border-white/5 hover:border-white/20 hover:bg-slate-800'
                  }`}
                >
                  {/* Checkmark indicator */}
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? 'bg-indigo-500' : 'bg-slate-700/50'
                  }`}>
                    {isSelected ? (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </div>
                  
                  <div className={`p-2 rounded-lg ${isSelected ? service.bgColor : 'bg-slate-700/50'}`}>
                    <ServiceIcon service={service.value} className={`w-5 h-5 ${isSelected ? service.color : 'text-gray-500'}`} />
                  </div>
                  <div className="min-w-0 pr-6">
                    <p className={`font-medium text-sm truncate ${isSelected ? 'text-white' : 'text-gray-400'}`}>{service.label}</p>
                    <p className="text-xs text-gray-500 truncate">{service.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {selectedServices.length === 0 && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-amber-400">Selectează cel puțin un serviciu pentru a fi vizibil clienților!</p>
            </div>
          )}
        </div>

        {/* Link to Tarife Page */}
        <Link 
          href="/dashboard/curier/tarife"
          className="block bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 rounded-xl sm:rounded-2xl border border-emerald-500/30 hover:border-emerald-500/50 p-6 mb-6 sm:mb-8 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/30 rounded-xl group-hover:bg-emerald-500/40 transition-colors">
                <EuroIcon className="w-7 h-7 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Adaugă Tarife</h3>
                <p className="text-sm text-gray-400">Configurează prețurile pentru serviciile tale</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Saved Tarife */}
        <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white">Tarife și Servicii Active</h2>
            </div>
            <span className="text-sm bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
              {tarife.length} {tarife.length === 1 ? 'tarif' : 'tarife'}
            </span>
          </div>
          
          {loadingTarife ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : Object.keys(tarifeByCountry).length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
                  <path d="M7 6h1v4" />
                  <path d="m16.71 13.88.7.71-2.82 2.82" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg mb-2">Nu ai niciun tarif salvat</p>
              <p className="text-gray-500 text-sm">Adaugă primul tău tarif folosind formularul de mai sus</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(tarifeByCountry)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([country, countryTarife]) => {
                  const countryCode = countryTarife[0]?.taraCode || countriesWithCodes.find(c => c.name === country)?.code || 'eu';
                  return (
                    <div key={country} className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
                      {/* Country Header */}
                      <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <Image
                            src={`/img/flag/${countryCode}.svg`}
                            alt={country}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover shadow-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-white">{country}</h3>
                            <p className="text-xs text-gray-500">{countryTarife.length} {countryTarife.length === 1 ? 'tarif' : 'tarife'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleCountryExpand(country)}
                            className="p-2 text-gray-500 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-all"
                            title={expandedCountries[country] ? 'Restrânge lista' : 'Extinde lista'}
                          >
                            <svg 
                              className={`w-4 h-4 transition-transform duration-200 ${expandedCountries[country] ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteAllForCountry(country)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Șterge toate tarifele pentru această țară"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Tarife List - collapsible */}
                      <div className={`divide-y divide-white/5 transition-all duration-200 overflow-hidden ${expandedCountries[country] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        {countryTarife.map((t) => {
                          const serviceInfo = serviceTypes.find(s => s.value === t.tipServiciu);
                          const unitLabel = t.unitType === 'm3' ? 'm³' : t.unitType === 'plic' ? 'plic' : t.unitType === 'nr' ? 'buc' : 'kg';
                          
                          // Get animal label
                          const animalLabels: Record<string, string> = {
                            caine: '🐕 Câine',
                            pisica: '🐱 Pisică',
                            pasare: '🐦 Pasăre',
                            rozator: '🐹 Rozător',
                            reptila: '🦎 Reptilă',
                            altul: '🐾 Altul',
                          };
                          
                          // Get vehicle icon component
                          const VehicleIconSmall = ({ type }: { type: string }) => {
                            const iconClass = "w-3.5 h-3.5 text-sky-400 inline-block";
                            switch(type) {
                              case 'masina':
                                return (
                                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                                    <path d="M5 17H3v-4l2-5h9l4 5h3v4h-2" />
                                  </svg>
                                );
                              case 'van':
                                return (
                                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                                    <path d="M3 9h13v8H3z" />
                                    <path d="M16 9h2l3 4v4h-2" />
                                  </svg>
                                );
                              case 'camion':
                                return (
                                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                                    <path d="M3 12h11V5H3z" />
                                    <path d="M14 8h3l3 4v6h-2" />
                                  </svg>
                                );
                              case 'tractor':
                                return (
                                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm11 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                                    <path d="M7 14V9h7l3 5" />
                                    <path d="M7 9V5h5" />
                                  </svg>
                                );
                              default:
                                return null;
                            }
                          };
                          
                          const vehicleLabelsText: Record<string, string> = {
                            masina: 'Mașină',
                            van: 'Van',
                            camion: 'Camion',
                            tractor: 'Tractor',
                          };
                          
                          // Currency based on country
                          const currencySymbol = country === 'Anglia' ? '£' : '€';
                          
                          return (
                            <div key={t.id} className="p-3 hover:bg-slate-700/30 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-1.5 rounded-lg ${serviceInfo?.bgColor || 'bg-slate-600/50'}`}>
                                    <ServiceIcon service={t.tipServiciu} className={`w-4 h-4 ${serviceInfo?.color || 'text-gray-400'}`} />
                                  </div>
                                  <div>
                                    <p className="text-white text-sm font-medium flex items-center gap-1 flex-wrap">
                                      {serviceInfo?.label || t.tipServiciu}
                                      {t.tipAnimal && <span className="ml-2 text-pink-400 text-xs">{animalLabels[t.tipAnimal]}</span>}
                                      {t.tipVehicul && t.tipVehicul.length > 0 && (
                                        <span className="ml-1 text-sky-400 text-xs flex items-center gap-1">
                                          {t.tipVehicul.map((v, idx) => (
                                            <span key={v} className="inline-flex items-center gap-0.5">
                                              <VehicleIconSmall type={v} />
                                              <span>{vehicleLabelsText[v]}</span>
                                              {idx < t.tipVehicul!.length - 1 && <span>,</span>}
                                            </span>
                                          ))}
                                        </span>
                                      )}
                                    </p>
                                    {/* Nu afișa minUnit pentru Animale sau Platforma */}
                                    {t.tipServiciu !== 'Animale' && t.tipServiciu !== 'Platforma' && (
                                      <p className="text-xs text-gray-500 flex items-center gap-1">
                                        {t.minUnit > 0 && <>{t.minUnit} {unitLabel}</>}
                                        {t.unitType === 'm3' && <CubeIcon className="w-3 h-3 text-purple-400" />}
                                        {t.unitType === 'kg' && <WeightIcon className="w-3 h-3 text-emerald-400" />}
                                        {t.unitType === 'nr' && <span className="text-orange-400 font-bold">#</span>}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  {/* Preț pentru Animale */}
                                  {t.tipServiciu === 'Animale' && t.pretAnimal !== undefined && (
                                    <span className="font-bold text-pink-400">
                                      {t.pretAnimal}{currencySymbol}
                                    </span>
                                  )}
                                  {/* Preț pentru alte servicii (nu Animale, nu Platforma) */}
                                  {t.tipServiciu !== 'Animale' && t.tipServiciu !== 'Platforma' && (
                                    <span className={`font-bold ${t.unitType === 'm3' ? 'text-purple-400' : t.unitType === 'nr' ? 'text-orange-400' : 'text-emerald-400'}`}>
                                      {t.pret}{currencySymbol}/{unitLabel}
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleDelete(t.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Șterge tarif"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              
                              {/* Extra info for Animale */}
                              {t.tipServiciu === 'Animale' && (
                                <div className="mt-2 flex gap-2 ml-10">
                                  {t.areCertificat && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      Certificat
                                    </span>
                                  )}
                                  {t.areAsigurare && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                      </svg>
                                      Asigurare
                                    </span>
                                  )}
                                  {!t.areCertificat && !t.areAsigurare && (
                                    <span className="text-xs text-gray-500">Fără certificat / asigurare</span>
                                  )}
                                </div>
                              )}
                              
                              {/* Extra info for Platforma */}
                              {t.tipServiciu === 'Platforma' && (
                                <div className="mt-2 flex gap-2 ml-10">
                                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                    t.acceptaAvariat 
                                      ? 'bg-sky-500/20 text-sky-400' 
                                      : 'bg-amber-500/20 text-amber-400'
                                  }`}>
                                    {t.acceptaAvariat ? '✓ Accept și avariate' : '⚠ Doar funcționale'}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
