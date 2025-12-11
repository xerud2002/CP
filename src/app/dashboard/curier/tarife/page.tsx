'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeftIcon, TrashIcon, BoxIcon } from '@/components/icons/DashboardIcons';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Tarif {
  id: string;
  tara: string;
  taraCode: string;
  tipServiciu: string;
  pret: number;
  minUnit: number;
  unitType: 'kg' | 'm3' | 'nr' | 'plic';
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

// Service types with custom SVG icons - ordered: Standard, Express, Frigorific, Fragil first
const serviceTypes = [
  { 
    value: 'Standard', 
    label: 'Standard', 
    description: 'Transport standard de colete',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    kgOnly: true,
  },
  { 
    value: 'Express', 
    label: 'Express', 
    description: 'Livrare urgentă 24-48h',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    kgOnly: true,
  },
  { 
    value: 'Frigo', 
    label: 'Frigorific', 
    description: 'Transport refrigerat',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    kgOnly: true,
  },
  { 
    value: 'Fragil', 
    label: 'Fragil', 
    description: 'Colete fragile cu manipulare atentă',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    kgOnly: true,
  },
  { 
    value: 'Door2Door', 
    label: 'Door to Door', 
    description: 'Ridicare și livrare la adresă',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
  },
  { 
    value: 'Mobila', 
    label: 'Mobilă', 
    description: 'Transport mobilier și electrocasnice',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    m3Only: true,
  },
  { 
    value: 'Animale', 
    label: 'Animale', 
    description: 'Transport animale de companie',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
  },
  { 
    value: 'Documente', 
    label: 'Documente', 
    description: 'Plicuri și documente importante',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/20',
    plicuriOnly: true,
  },
  { 
    value: 'Auto', 
    label: 'Piese Auto', 
    description: 'Piese auto și componente',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
  { 
    value: 'Electronice', 
    label: 'Electronice', 
    description: 'Produse electronice fragile',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
  },
  { 
    value: 'Paleti', 
    label: 'Paleți', 
    description: 'Transport paleți și marfă paletizată',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    nrOnly: true,
  },
  { 
    value: 'Platforma', 
    label: 'Platformă Auto', 
    description: 'Transport vehicule pe platformă',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/20',
  },
];

// Service icons as components
const ServiceIcon = ({ service, className = "w-6 h-6" }: { service: string; className?: string }) => {
  const icons: Record<string, React.ReactElement> = {
    Standard: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
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
    Frigo: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h10" />
        <path d="M9 4v16" />
        <path d="m3 9 3 3-3 3" />
        <path d="M12 6 9 9 6 6" />
        <path d="m6 18 3-3 1.5 1.5" />
        <path d="M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
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
    Animale: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="4" r="2" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="20" cy="16" r="2" />
        <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
      </svg>
    ),
    Documente: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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
    Electronice: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
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
    Platforma: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Truck/trailer platform */}
        <rect x="1" y="14" width="22" height="4" rx="1" />
        <circle cx="5" cy="20" r="2" />
        <circle cx="19" cy="20" r="2" />
        <path d="M7 20h10" />
        {/* Car on platform */}
        <path d="M6 10h8l2 4H4l2-4z" />
        <circle cx="7" cy="14" r="1" />
        <circle cx="13" cy="14" r="1" />
        <path d="M17 8l2 2v4" />
        <path d="M19 8h2" />
      </svg>
    ),
  };
  
  return icons[service] || icons.Standard;
};

export default function TarifePracticatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tarife, setTarife] = useState<Tarif[]>([]);
  const [loadingTarife, setLoadingTarife] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Selected services state (services the courier offers)
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [savingServices, setSavingServices] = useState(false);

  // Form state
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string } | null>(null);
  const [tipServiciu, setTipServiciu] = useState('');
  const [pret, setPret] = useState('');
  const [minUnit, setMinUnit] = useState('');
  const [unitType, setUnitType] = useState<'kg' | 'm3' | 'nr'>('kg');
  
  // Animale specific state
  const [tipAnimal, setTipAnimal] = useState<'caine' | 'pisica' | 'pasare' | 'rozator' | 'reptila' | 'altul'>('caine');
  const [pretAnimal, setPretAnimal] = useState('');
  const [areCertificat, setAreCertificat] = useState(false);
  const [areAsigurare, setAreAsigurare] = useState(false);
  
  // Platforma specific state
  const [tipVehicul, setTipVehicul] = useState<('masina' | 'van' | 'camion' | 'tractor')[]>([]);
  const [acceptaAvariat, setAcceptaAvariat] = useState(true);

  // Custom dropdowns state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  
  // Expanded countries state for tarife list
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({});
  
  const toggleCountryExpand = (country: string) => {
    setExpandedCountries(prev => ({
      ...prev,
      [country]: !prev[country]
    }));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries based on search
  const filteredCountries = countriesWithCodes.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Force kg unit when selecting a kgOnly service, or m3 for m3Only services
  useEffect(() => {
    const currentService = serviceTypes.find(s => s.value === tipServiciu);
    if (currentService?.kgOnly) {
      setUnitType('kg');
    } else if (currentService?.m3Only) {
      setUnitType('m3');
    }
  }, [tipServiciu]);

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
            setSelectedServices(userData.serviciiOferite);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Different validation for Animale/Platforma vs other services
    const isAnimalOrPlatform = tipServiciu === 'Animale' || tipServiciu === 'Platforma';
    const isSimplePriceService = tipServiciu === 'Documente' || tipServiciu === 'Paleti' || tipServiciu === 'Mobila';
    const isM3Selected = unitType === 'm3';
    
    if (!selectedCountry || !tipServiciu || !user) return;
    if (tipServiciu === 'Animale' && !pretAnimal) return;
    if (isSimplePriceService && !pret) return;
    // Pentru m³ nu cerem minUnit
    if (!isAnimalOrPlatform && !isSimplePriceService && !isM3Selected && (!pret || !minUnit)) return;
    if (!isAnimalOrPlatform && !isSimplePriceService && isM3Selected && !pret) return;

    // For Animale service, check combination with tipAnimal
    const existsForAnimale = tipServiciu === 'Animale' 
      ? tarife.some(t => t.tara === selectedCountry.name && t.tipServiciu === tipServiciu && t.tipAnimal === tipAnimal)
      : false;
    
    // For Platforma service, check combination with tipVehicul
    const existsForPlatforma = tipServiciu === 'Platforma'
      ? tarife.some(t => t.tara === selectedCountry.name && t.tipServiciu === tipServiciu && t.tipVehicul === tipVehicul)
      : false;
    
    // For other services, check simple combination
    const existsOther = tipServiciu !== 'Animale' && tipServiciu !== 'Platforma'
      ? tarife.some(t => t.tara === selectedCountry.name && t.tipServiciu === tipServiciu)
      : false;

    if (existsForAnimale) {
      alert(`Ai deja un tarif pentru transport ${tipAnimal} în ${selectedCountry.name}!`);
      return;
    }
    if (existsForPlatforma) {
      alert(`Ai deja un tarif pentru transport ${tipVehicul} pe platformă în ${selectedCountry.name}!`);
      return;
    }
    if (existsOther) {
      alert('Ai deja un tarif pentru această combinație țară-serviciu!');
      return;
    }

    setSaving(true);
    try {
      // Build document data
      const noMinUnit = isAnimalOrPlatform || isSimplePriceService || isM3Selected;
      const docData: Record<string, unknown> = {
        uid: user.uid,
        tara: selectedCountry.name,
        taraCode: selectedCountry.code,
        tipServiciu,
        pret: isAnimalOrPlatform ? 0 : parseFloat(pret),
        minUnit: noMinUnit ? 0 : parseInt(minUnit),
        unitType: isSimplePriceService ? (tipServiciu === 'Mobila' ? 'm3' : tipServiciu === 'Paleti' ? 'nr' : 'plic') : unitType,
        addedAt: serverTimestamp(),
      };
      
      // Add Animale specific fields
      if (tipServiciu === 'Animale') {
        docData.tipAnimal = tipAnimal;
        docData.pretAnimal = parseFloat(pretAnimal);
        docData.areCertificat = areCertificat;
        docData.areAsigurare = areAsigurare;
      }
      
      // Add Platforma specific fields
      if (tipServiciu === 'Platforma') {
        docData.tipVehicul = tipVehicul;
        docData.acceptaAvariat = acceptaAvariat;
      }

      const docRef = await addDoc(collection(db, 'tarife_curier'), docData);

      // Build local tarif object
      const newTarif: Tarif = {
        id: docRef.id,
        tara: selectedCountry.name,
        taraCode: selectedCountry.code,
        tipServiciu,
        pret: isAnimalOrPlatform ? 0 : parseFloat(pret),
        minUnit: noMinUnit ? 0 : parseInt(minUnit),
        unitType: isSimplePriceService ? (tipServiciu === 'Mobila' ? 'm3' : tipServiciu === 'Paleti' ? 'nr' : 'plic') : unitType,
      };
      
      if (tipServiciu === 'Animale') {
        newTarif.tipAnimal = tipAnimal;
        newTarif.pretAnimal = parseFloat(pretAnimal);
        newTarif.areCertificat = areCertificat;
        newTarif.areAsigurare = areAsigurare;
      }
      
      if (tipServiciu === 'Platforma') {
        newTarif.tipVehicul = tipVehicul;
        newTarif.acceptaAvariat = acceptaAvariat;
      }

      setTarife([newTarif, ...tarife]);

      // Reset form
      setSelectedCountry(null);
      setTipServiciu('');
      setPret('');
      setMinUnit('');
      setUnitType('kg');
      // Reset Animale fields
      setTipAnimal('caine');
      setPretAnimal('');
      setAreCertificat(false);
      setAreAsigurare(false);
      // Reset Platforma fields
      setTipVehicul([]);
      setAcceptaAvariat(true);
    } catch (error) {
      console.error('Error adding tarif:', error);
      alert('Eroare la salvare. Încearcă din nou.');
    } finally {
      setSaving(false);
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
                <h1 className="text-xl sm:text-2xl font-bold text-white">Tarife Practicate</h1>
                <p className="text-sm text-gray-400 hidden sm:block">Setează prețurile pentru fiecare țară și serviciu</p>
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
                <h2 className="text-lg font-semibold text-white">Servicii oferite</h2>
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

        {/* Add Form Section */}
        <div className="bg-slate-900/50 rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-6 mb-4 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="p-1.5 sm:p-2 bg-emerald-500/20 rounded-lg">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-white">Adaugă serviciu</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 items-end ${
              tipServiciu === 'Animale' 
                ? 'lg:grid-cols-[0.6fr_0.4fr_0.35fr_auto]'
                : tipServiciu === 'Platforma'
                  ? 'lg:grid-cols-[0.6fr_0.4fr_auto]'
                  : tipServiciu === 'Documente' || tipServiciu === 'Paleti' || tipServiciu === 'Mobila'
                    ? 'lg:grid-cols-[0.6fr_0.4fr_0.35fr_auto]'
                    : unitType === 'm3'
                      ? 'lg:grid-cols-[0.6fr_0.85fr_0.4fr_0.32fr_auto]'
                      : 'lg:grid-cols-[0.6fr_0.85fr_0.4fr_0.32fr_0.32fr_auto]'
            }`}>
              {/* Country Dropdown */}
              <div ref={countryDropdownRef}>
                <label className="block text-sm font-medium text-gray-400 mb-2">Țară</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-colors text-left"
                  >
                    {selectedCountry ? (
                      <>
                        <Image
                          src={`/img/flag/${selectedCountry.code}.svg`}
                          alt={selectedCountry.name}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="flex-1 truncate">{selectedCountry.name}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span className="flex-1 text-gray-500">Selectează țara</span>
                      </>
                    )}
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isCountryDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-2 border-b border-white/10">
                        <input
                          type="text"
                          placeholder="Caută țara..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsCountryDropdownOpen(false);
                              setCountrySearch('');
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors ${
                              selectedCountry?.code === country.code ? 'bg-emerald-500/20' : ''
                            }`}
                          >
                            <Image
                              src={`/img/flag/${country.code}.svg`}
                              alt={country.name}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-white">{country.name}</span>
                            {selectedCountry?.code === country.code && (
                              <svg className="w-5 h-5 text-emerald-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Type Dropdown */}
              <div ref={serviceDropdownRef}>
                <label className="block text-sm font-medium text-gray-400 mb-2">Tip Serviciu</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white hover:bg-slate-800 transition-colors text-left"
                  >
                    {tipServiciu ? (
                      <>
                        <div className={`p-1.5 rounded-lg ${serviceTypes.find(s => s.value === tipServiciu)?.bgColor}`}>
                          <ServiceIcon service={tipServiciu} className={`w-4 h-4 ${serviceTypes.find(s => s.value === tipServiciu)?.color}`} />
                        </div>
                        <span className="flex-1">{serviceTypes.find(s => s.value === tipServiciu)?.label}</span>
                      </>
                    ) : (
                      <span className="flex-1 text-gray-500">Selectează serviciul</span>
                    )}
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${isServiceDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isServiceDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
                      {serviceTypes.map((service) => (
                        <button
                          key={service.value}
                          type="button"
                          onClick={() => {
                            setTipServiciu(service.value);
                            // Auto-set unit type based on service
                            if (service.nrOnly) setUnitType('nr');
                            else if (service.m3Only) setUnitType('m3');
                            else if (service.kgOnly) setUnitType('kg');
                            setIsServiceDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors border-b border-white/5 last:border-b-0 ${
                            tipServiciu === service.value ? 'bg-emerald-500/10' : ''
                          }`}
                        >
                          <div className={`p-2 rounded-xl ${service.bgColor} shadow-lg`}>
                            <ServiceIcon service={service.value} className={`w-5 h-5 ${service.color}`} />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-white text-sm font-medium">{service.label}</p>
                            <p className="text-xs text-gray-500 truncate">{service.description}</p>
                          </div>
                          {tipServiciu === service.value && (
                            <div className="p-1 bg-emerald-500/20 rounded-full">
                              <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Animale - Preț per animal pe linia principală */}
              {tipServiciu === 'Animale' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Preț / {tipAnimal === 'caine' ? 'câine' : tipAnimal === 'pisica' ? 'pisică' : tipAnimal === 'pasare' ? 'pasăre' : tipAnimal === 'rozator' ? 'rozător' : tipAnimal === 'reptila' ? 'reptilă' : 'animal'} ({selectedCountry?.name === 'Anglia' ? '£' : '€'})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={pretAnimal}
                        onChange={(e) => setPretAnimal(e.target.value)}
                        step="1"
                        min="0"
                        placeholder="ex: 50"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-pink-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 transition-colors pr-12"
                        required
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 font-medium">
                        {selectedCountry?.name === 'Anglia' ? '£' : '€'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={saving || !selectedCountry || !pretAnimal}
                    className="h-12 px-5 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Se salvează...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                        </svg>
                        <span>Adaugă</span>
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Animale Specific Fields */}
              {tipServiciu === 'Animale' && (
                <div className="lg:col-span-4 p-5 bg-linear-to-br from-pink-500/10 to-purple-500/5 rounded-2xl border border-pink-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-pink-500/10">
                    <div className="p-2.5 bg-pink-500/20 rounded-xl">
                      <ServiceIcon service="Animale" className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <span className="text-base font-semibold text-white">Detalii Transport Animale</span>
                      <p className="text-xs text-gray-500">Selectează tipul și opțiunile de transport</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Tip Animal */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Tip Animal</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'caine', icon: '🐕', label: 'Câine' },
                          { value: 'pisica', icon: '🐱', label: 'Pisică' },
                          { value: 'pasare', icon: '🐦', label: 'Pasăre' },
                          { value: 'rozator', icon: '🐹', label: 'Rozător' },
                          { value: 'reptila', icon: '🦎', label: 'Reptilă' },
                          { value: 'altul', icon: '🐾', label: 'Altul' },
                        ].map((animal) => (
                          <button
                            key={animal.value}
                            type="button"
                            onClick={() => setTipAnimal(animal.value as typeof tipAnimal)}
                            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all duration-200 ${
                              tipAnimal === animal.value
                                ? 'bg-pink-500/20 border-2 border-pink-400 shadow-lg shadow-pink-500/10'
                                : 'bg-slate-800/50 border border-white/10 hover:border-pink-500/30 hover:bg-slate-800'
                            }`}
                          >
                            <span className="text-xl">{animal.icon}</span>
                            <span className={`text-xs font-medium ${tipAnimal === animal.value ? 'text-pink-400' : 'text-gray-400'}`}>
                              {animal.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Certificat Transport */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Certificat Transport Animale</label>
                      <button
                        type="button"
                        onClick={() => setAreCertificat(!areCertificat)}
                        className={`w-full h-[calc(100%-28px)] flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 ${
                          areCertificat 
                            ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-lg shadow-emerald-500/10' 
                            : 'bg-slate-800/50 border border-white/10 hover:border-emerald-500/30'
                        }`}
                      >
                        <div className={`p-3 rounded-full ${areCertificat ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
                          <svg className={`w-6 h-6 ${areCertificat ? 'text-emerald-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <span className={`text-sm font-medium ${areCertificat ? 'text-emerald-400' : 'text-gray-400'}`}>
                          {areCertificat ? 'Am certificat' : 'Fără certificat'}
                        </span>
                        <span className="text-xs text-gray-500">Click pentru a schimba</span>
                      </button>
                    </div>
                    
                    {/* Asigurare */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Asigurare</label>
                      <button
                        type="button"
                        onClick={() => setAreAsigurare(!areAsigurare)}
                        className={`w-full h-[calc(100%-28px)] flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 ${
                          areAsigurare 
                            ? 'bg-blue-500/20 border-2 border-blue-400 shadow-lg shadow-blue-500/10' 
                            : 'bg-slate-800/50 border border-white/10 hover:border-blue-500/30'
                        }`}
                      >
                        <div className={`p-3 rounded-full ${areAsigurare ? 'bg-blue-500/20' : 'bg-slate-700/50'}`}>
                          <svg className={`w-6 h-6 ${areAsigurare ? 'text-blue-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <span className={`text-sm font-medium ${areAsigurare ? 'text-blue-400' : 'text-gray-400'}`}>
                          {areAsigurare ? 'Cu asigurare' : 'Fără asigurare'}
                        </span>
                        <span className="text-xs text-gray-500">Click pentru a schimba</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Platforma Specific Fields */}
              {tipServiciu === 'Platforma' && (
                <div className="lg:col-span-6 p-5 bg-linear-to-br from-sky-500/10 to-blue-500/5 rounded-2xl border border-sky-500/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-sky-500/10">
                    <div className="p-2.5 bg-sky-500/20 rounded-xl">
                      <ServiceIcon service="Platforma" className="w-5 h-5 text-sky-400" />
                    </div>
                    <div>
                      <span className="text-base font-semibold text-white">Detalii Transport Platformă</span>
                      <p className="text-xs text-gray-500">Selectează tipul de vehicul și opțiunile</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tip Vehicul */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                        Tip Vehicul <span className="text-sky-400">(selectează unul sau mai multe)</span>
                        {tipVehicul.length > 0 && <span className="ml-2 text-sky-400">({tipVehicul.length} selectate)</span>}
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { value: 'masina', label: 'Mașină' },
                          { value: 'van', label: 'Van' },
                          { value: 'camion', label: 'Camion' },
                          { value: 'tractor', label: 'Tractor' },
                        ].map((vehicul) => {
                          const isSelected = tipVehicul.includes(vehicul.value as 'masina' | 'van' | 'camion' | 'tractor');
                          
                          // Custom vehicle icons
                          const VehicleIcon = () => {
                            const iconClass = `w-6 h-6 ${isSelected ? 'text-sky-400' : 'text-gray-400'}`;
                            switch(vehicul.value) {
                              case 'masina':
                                return (
                                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                                    <path d="M5 17H3v-4l2-5h9l4 5h3v4h-2" />
                                    <path d="M9 17h6" />
                                    <path d="M7 8v3" />
                                    <path d="M11 8v3" />
                                  </svg>
                                );
                              case 'van':
                                return (
                                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                                    <path d="M9 17h6" />
                                    <path d="M3 9h13v8H3z" />
                                    <path d="M16 9h2l3 4v4h-2" />
                                    <path d="M3 9V6h13v3" />
                                  </svg>
                                );
                              case 'camion':
                                return (
                                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                                    <path d="M9 18h6" />
                                    <path d="M3 12h11V5H3z" />
                                    <path d="M14 8h3l3 4v6h-2" />
                                    <path d="M3 18h2" />
                                    <path d="M3 8h11" />
                                  </svg>
                                );
                              case 'tractor':
                                return (
                                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 17a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm11 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
                                    <path d="M10 17h5" />
                                    <path d="M7 14V9h7l3 5" />
                                    <path d="M7 9V5h5" />
                                    <path d="M3 17h1" />
                                  </svg>
                                );
                              default:
                                return null;
                            }
                          };
                          
                          return (
                            <button
                              key={vehicul.value}
                              type="button"
                              onClick={() => {
                                const val = vehicul.value as 'masina' | 'van' | 'camion' | 'tractor';
                                if (isSelected) {
                                  setTipVehicul(tipVehicul.filter(v => v !== val));
                                } else {
                                  setTipVehicul([...tipVehicul, val]);
                                }
                              }}
                              className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 ${
                                isSelected
                                  ? 'bg-sky-500/20 border-2 border-sky-400 shadow-lg shadow-sky-500/10'
                                  : 'bg-slate-800/50 border border-white/10 hover:border-sky-500/30 hover:bg-slate-800'
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-1 right-1 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              <VehicleIcon />
                              <span className={`text-xs font-medium ${isSelected ? 'text-sky-400' : 'text-gray-400'}`}>
                                {vehicul.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Accept Avariat */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Stare Vehicul Acceptată</label>
                      <div className="grid grid-cols-2 gap-3 h-[calc(100%-28px)]">
                        <button
                          type="button"
                          onClick={() => setAcceptaAvariat(true)}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 ${
                            acceptaAvariat
                              ? 'bg-sky-500/20 border-2 border-sky-400 shadow-lg shadow-sky-500/10'
                              : 'bg-slate-800/50 border border-white/10 hover:border-sky-500/30 hover:bg-slate-800'
                          }`}
                        >
                          <div className={`p-2.5 rounded-full ${acceptaAvariat ? 'bg-sky-500/20' : 'bg-slate-700/50'}`}>
                            <svg className={`w-5 h-5 ${acceptaAvariat ? 'text-sky-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className={`text-sm font-medium ${acceptaAvariat ? 'text-sky-400' : 'text-gray-400'}`}>
                            Și avariate
                          </span>
                          <span className="text-xs text-gray-500">Accept toate</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setAcceptaAvariat(false)}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200 ${
                            !acceptaAvariat
                              ? 'bg-amber-500/20 border-2 border-amber-400 shadow-lg shadow-amber-500/10'
                              : 'bg-slate-800/50 border border-white/10 hover:border-amber-500/30 hover:bg-slate-800'
                          }`}
                        >
                          <div className={`p-2.5 rounded-full ${!acceptaAvariat ? 'bg-amber-500/20' : 'bg-slate-700/50'}`}>
                            <svg className={`w-5 h-5 ${!acceptaAvariat ? 'text-amber-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className={`text-sm font-medium ${!acceptaAvariat ? 'text-amber-400' : 'text-gray-400'}`}>
                            Doar funcționale
                          </span>
                          <span className="text-xs text-gray-500">Stare bună</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Button for Platforma */}
                  <button
                    type="submit"
                    disabled={saving || !selectedCountry}
                    className="w-full mt-4 h-12 px-5 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Se salvează...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14" />
                          <path d="M5 12h14" />
                        </svg>
                        <span>Adaugă</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Unit Type Toggle - hidden for Animale, Platforma, Documente, Paleti and Mobila services */}
              {tipServiciu !== 'Animale' && tipServiciu !== 'Platforma' && tipServiciu !== 'Documente' && tipServiciu !== 'Paleti' && tipServiciu !== 'Mobila' && (() => {
                const currentService = serviceTypes.find(s => s.value === tipServiciu);
                const isKgOnly = currentService?.kgOnly;
                const isM3Only = currentService?.m3Only;
                const isLocked = isKgOnly || isM3Only;
                const currencySymbol = selectedCountry?.name === 'Anglia' ? '£' : '€';
                
                return (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Unitate de măsură</label>
                      <div className={`flex bg-slate-800/50 border border-white/10 rounded-xl p-1 ${isLocked ? 'opacity-60' : ''}`}>
                        <button
                          type="button"
                          onClick={() => !isLocked && setUnitType('kg')}
                          disabled={isLocked}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            (unitType === 'kg' || isKgOnly) && !isM3Only
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                          } ${isLocked ? 'cursor-not-allowed' : ''} ${isM3Only ? 'opacity-50' : ''}`}
                        >
                          <WeightIcon className="w-4 h-4" />
                          <span className="font-medium">kg</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => !isLocked && setUnitType('m3')}
                          disabled={isLocked}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                            (unitType === 'm3' || isM3Only) && !isKgOnly
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                          } ${isLocked ? 'cursor-not-allowed' : ''} ${isKgOnly ? 'opacity-50' : ''}`}
                        >
                          <CubeIcon className="w-4 h-4" />
                          <span className="font-medium">m³</span>
                        </button>
                      </div>
                    </div>

                    {/* Price per unit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Preț/{isKgOnly || unitType === 'kg' ? 'kg' : 'm³'} ({currencySymbol})
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={pret}
                          onChange={(e) => setPret(e.target.value)}
                          step="0.1"
                          min="0"
                          placeholder={isKgOnly || unitType === 'kg' ? 'ex: 2.5' : 'ex: 45'}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors pr-12"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {isKgOnly || unitType === 'kg' ? (
                            <WeightIcon className="w-5 h-5 text-gray-500" />
                          ) : (
                            <CubeIcon className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Min unit - hidden for Animale, Platforma, Documente, Paleti, Mobila and when m3 is selected */}
              {tipServiciu !== 'Animale' && tipServiciu !== 'Platforma' && tipServiciu !== 'Documente' && tipServiciu !== 'Paleti' && tipServiciu !== 'Mobila' && unitType === 'kg' && (() => {
                return (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Taxare min. nr. KG
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={minUnit}
                    onChange={(e) => setMinUnit(e.target.value)}
                    step="1"
                    min="0"
                    placeholder="ex: 1"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors pr-12"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {unitType === 'kg' ? (
                      <WeightIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <CubeIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
              );
              })()}

              {/* Documente - Preț per plic */}
              {tipServiciu === 'Documente' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Preț / plic ({selectedCountry?.name === 'Anglia' ? '£' : '€'})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={pret}
                      onChange={(e) => setPret(e.target.value)}
                      step="0.5"
                      min="0"
                      placeholder="ex: 5"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-indigo-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors pr-12"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Paleti - Preț per palet */}
              {tipServiciu === 'Paleti' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Preț / palet ({selectedCountry?.name === 'Anglia' ? '£' : '€'})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={pret}
                      onChange={(e) => setPret(e.target.value)}
                      step="0.5"
                      min="0"
                      placeholder="ex: 10"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors pr-12"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <BoxIcon className="w-5 h-5 text-orange-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Mobila - Preț per m³ */}
              {tipServiciu === 'Mobila' && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Preț / m³ ({selectedCountry?.name === 'Anglia' ? '£' : '€'})
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={pret}
                      onChange={(e) => setPret(e.target.value)}
                      step="0.5"
                      min="0"
                      placeholder="ex: 45"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-amber-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors pr-12"
                      required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CubeIcon className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button - pentru toate serviciile EXCEPTÂND Animale și Platforma */}
              {tipServiciu !== 'Animale' && tipServiciu !== 'Platforma' && (
                <button
                  type="submit"
                  disabled={saving || !selectedCountry || !tipServiciu || 
                    (tipServiciu === 'Documente' && !pret) ||
                    (tipServiciu === 'Paleti' && !pret) ||
                    (tipServiciu === 'Mobila' && !pret) ||
                    (unitType === 'm3' && !pret) ||
                    (tipServiciu !== 'Platforma' && tipServiciu !== 'Documente' && tipServiciu !== 'Paleti' && tipServiciu !== 'Mobila' && unitType === 'kg' && (!pret || !minUnit))}
                  className="h-12 px-5 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Se salvează...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                      <span>Adaugă</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

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
