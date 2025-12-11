'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeftIcon, TrashIcon } from '@/components/icons/DashboardIcons';
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

// Tarife/Transport icon component - truck with price tag style
const TarifeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
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
    label: 'Colete & Pachete', 
    description: 'Transport rapid colete și pachete internaționale în Europa',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    defaultUnit: 'kg' as const,
    hasSubOptions: true,
    subOptions: [
      { value: 'express', label: 'Express', description: 'Livrare urgentă rapidă 24-48h în Europa', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
      { value: 'frigo', label: 'Frigorific', description: 'Transport refrigerat temperatură controlată', color: 'text-sky-400', bgColor: 'bg-sky-500/20' },
      { value: 'fragil', label: 'Fragil', description: 'Manipulare atentă și ambalare securizată', color: 'text-rose-400', bgColor: 'bg-rose-500/20' },
      { value: 'door2door', label: 'Door to Door', description: 'Serviciu ridicare și livrare la adresă Door to Door', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
    ]
  },
  { 
    value: 'Plicuri', 
    label: 'Plicuri & Documente', 
    description: 'Curierat rapid documente și acte importante în toată Europa',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    defaultUnit: 'plic' as const,
    unitLabel: 'plic',
  },
  { 
    value: 'Mobila', 
    label: 'Mobilă & Mutări', 
    description: 'Transport mobilier și servicii mutări internaționale',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    defaultUnit: 'm3' as const,
    unitLabel: 'm³',
  },
  { 
    value: 'Electronice', 
    label: 'Electronice & Electrocasnice', 
    description: 'Transport siguranță maximă TV, electrocasnice și produse electronice în Europa',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    defaultUnit: 'kg' as const,
  },
  { 
    value: 'Animale', 
    label: 'Animale de Companie', 
    description: 'Transport autorizat animale de companie cu certificat sanitar-veterinar',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    defaultUnit: 'animal' as const,
    unitLabel: 'animal',
  },
  { 
    value: 'Platforma', 
    label: 'Transport Platformă', 
    description: 'Transport auto pe platformă - mașini, utilaje, tractoare',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    defaultUnit: 'vehicul' as const,
    unitLabel: 'vehicul',
  },
  { 
    value: 'Tractari', 
    label: 'Tractări Auto', 
    description: 'Servicii tractare auto și asistență rutieră',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    defaultUnit: 'km' as const,
    unitLabel: 'km',
  },
  { 
    value: 'Aeroport', 
    label: 'Transfer Aeroport', 
    description: 'Servicii transfer aeroport rapid și confortabil pentru pasageri',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    defaultUnit: 'persoana' as const,
    unitLabel: 'persoană',
  },
  { 
    value: 'Persoane', 
    label: 'Transport Persoane', 
    description: 'Transport persoane confortabil și sigur în toată Europa',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    defaultUnit: 'persoana' as const,
    unitLabel: 'persoană',
  },
  { 
    value: 'Paleti', 
    label: 'Paleți & Marfă Paletizată', 
    description: 'Transport paleți europeni EUR și marfă paletizată industrială',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    defaultUnit: 'palet' as const,
    unitLabel: 'palet',
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
    Platforma: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="16" width="20" height="4" rx="1" />
        <path d="M7 16V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8" />
        <circle cx="8" cy="20" r="1" />
        <circle cx="16" cy="20" r="1" />
        <path d="M12 16V4" />
        <path d="M9 7h6" />
      </svg>
    ),
    Tractari: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
        <path d="M14 2l-3 3 3 3" />
        <path d="M11 5h7" />
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
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string } | null>(null);
  const [tipServiciu, setTipServiciu] = useState('');
  const [pret, setPret] = useState('');
  const [minUnit, setMinUnit] = useState('');
  const [unitType, setUnitType] = useState<'kg' | 'm3' | 'nr'>('kg');
  
  // Colete sub-options state
  const [coleteOptions, setColeteOptions] = useState({
    express: false,
    frigo: false,
    fragil: false,
    door2door: false,
  });
  
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

  // Force unit type based on service's defaultUnit
  useEffect(() => {
    const currentService = serviceTypes.find(s => s.value === tipServiciu);
    if (currentService?.defaultUnit === 'kg' && !currentService.unitLabel) {
      setUnitType('kg');
    } else if (currentService?.defaultUnit === 'm3') {
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
      
      // Add Colete sub-options
      if (tipServiciu === 'Colete') {
        docData.coleteOptions = coleteOptions;
      }
      
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
      
      // Add Colete sub-options to local object
      if (tipServiciu === 'Colete') {
        newTarif.coleteOptions = { ...coleteOptions };
      }
      
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
      // Reset Colete options
      setColeteOptions({ express: false, frigo: false, fragil: false, door2door: false });
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
                <TarifeIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Tarife Transport Internațional Europa</h1>
                <p className="text-sm text-gray-400 hidden sm:block">Setează prețuri competitive pentru transport colete, mobilă, paleți, persoane și servicii de curierat în Europa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Info Message */}
        <div className="bg-linear-to-br from-blue-500/10 via-blue-500/5 to-blue-600/10 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-5 sm:p-6 mb-6 sm:mb-8 shadow-lg shadow-blue-500/5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-500/20 rounded-xl shrink-0 mt-0.5">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">De ce este important?</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Serviciile și tarifele configurate permit platformei să îți trimită doar comenzile care se potrivesc cu specializarea ta. Cu cât adaugi mai multe servicii și tarife competitive, cu atât vei primi mai multe comenzi relevante de la clienți din toată Europa.
              </p>
            </div>
          </div>
        </div>

        {/* Add Form Section */}
        <div className="bg-linear-to-br from-slate-900/80 via-slate-800/50 to-slate-900/80 rounded-2xl border border-emerald-500/20 p-4 sm:p-6 mb-4 sm:mb-8 shadow-xl shadow-emerald-500/5">
          <div className="flex items-center justify-between mb-5 sm:mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 bg-linear-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Adaugă Tarif Nou</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Configurează prețul pentru fiecare țară și serviciu</p>
              </div>
            </div>
            {saving && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full">
                <div className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                <span className="text-xs text-emerald-400 font-medium">Salvare...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Main Form Row - Always on one line on desktop */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 items-end ${
              tipServiciu === 'Animale' 
                ? 'lg:grid-cols-[1fr_1fr_0.8fr_auto]'
                : tipServiciu === 'Platforma'
                  ? 'lg:grid-cols-[1fr_1fr_auto]'
                  : tipServiciu === 'Colete' || tipServiciu === 'Electronice'
                    ? unitType === 'm3'
                      ? 'lg:grid-cols-[1fr_1fr_0.9fr_auto]'
                      : 'lg:grid-cols-[1fr_1fr_0.9fr_0.7fr_auto]'
                    : 'lg:grid-cols-[1fr_1fr_0.9fr_auto]'
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

              {/* Price Input - Dynamic based on service type */}
              {tipServiciu && tipServiciu !== 'Animale' && tipServiciu !== 'Platforma' && (() => {
                const currentService = serviceTypes.find(s => s.value === tipServiciu);
                const currencySymbol = selectedCountry?.name === 'Anglia' ? '£' : '€';
                const unitLabel = currentService?.unitLabel || (currentService?.defaultUnit === 'm3' ? 'm³' : currentService?.defaultUnit || 'kg');
                const showKgM3Toggle = currentService?.defaultUnit === 'kg' && !currentService?.unitLabel;
                
                // Get icon and color based on unit
                const getUnitStyle = () => {
                  switch (currentService?.defaultUnit) {
                    case 'm3': return { color: 'text-purple-400', bg: 'bg-purple-500/20' };
                    case 'palet': return { color: 'text-orange-400', bg: 'bg-orange-500/20' };
                    case 'plic': return { color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
                    case 'persoana': return { color: 'text-cyan-400', bg: 'bg-cyan-500/20' };
                    case 'km': return { color: 'text-orange-400', bg: 'bg-orange-500/20' };
                    default: return { color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
                  }
                };
                const unitStyle = getUnitStyle();
                
                return (
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Preț / {unitLabel} ({currencySymbol})
                    </label>
                    <div className="flex h-[46px]">
                      {/* Show kg/m³ toggle only for services that support both */}
                      {showKgM3Toggle ? (
                        <>
                          <div className="flex bg-slate-800/50 border border-white/10 rounded-l-xl">
                            <button
                              type="button"
                              onClick={() => setUnitType('kg')}
                              className={`flex items-center justify-center gap-1.5 px-3 transition-all duration-200 rounded-l-xl ${
                                unitType === 'kg'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-r border-emerald-500/30'
                                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50 border-r border-white/10'
                              }`}
                            >
                              <WeightIcon className="w-4 h-4" />
                              <span className="font-medium text-sm">kg</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setUnitType('m3')}
                              className={`flex items-center justify-center gap-1.5 px-3 transition-all duration-200 ${
                                unitType === 'm3'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                              }`}
                            >
                              <CubeIcon className="w-4 h-4" />
                              <span className="font-medium text-sm">m³</span>
                            </button>
                          </div>
                          <div className="relative flex-1">
                            <input
                              type="number"
                              value={pret}
                              onChange={(e) => setPret(e.target.value)}
                              step="0.1"
                              min="0"
                              placeholder={unitType === 'kg' ? '2.5' : '45'}
                              className="w-full h-full px-3 bg-slate-800/50 border border-l-0 border-white/10 rounded-r-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors pr-10"
                              required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <span className={`text-sm font-medium ${unitType === 'kg' ? 'text-emerald-400' : 'text-purple-400'}`}>
                                {currencySymbol}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Fixed unit badge */}
                          <div className={`flex items-center justify-center gap-1.5 px-4 ${unitStyle.bg} border border-white/10 rounded-l-xl ${unitStyle.color}`}>
                            <span className="font-medium text-sm">{unitLabel}</span>
                          </div>
                          <div className="relative flex-1">
                            <input
                              type="number"
                              value={pret}
                              onChange={(e) => setPret(e.target.value)}
                              step="0.1"
                              min="0"
                              placeholder="ex: 25"
                              className="w-full h-full px-3 bg-slate-800/50 border border-l-0 border-white/10 rounded-r-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors pr-10"
                              required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <span className={`text-sm font-medium ${unitStyle.color}`}>
                                {currencySymbol}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
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

              {/* Submit Button - pentru toate serviciile EXCEPTÂND Animale și Platforma */}
              {tipServiciu && tipServiciu !== 'Animale' && tipServiciu !== 'Platforma' && (() => {
                const currentService = serviceTypes.find(s => s.value === tipServiciu);
                const showKgM3Toggle = currentService?.defaultUnit === 'kg' && !currentService?.unitLabel;
                const needsMinUnit = showKgM3Toggle && unitType === 'kg';
                
                return (
                  <button
                    type="submit"
                    disabled={saving || !selectedCountry || !tipServiciu || !pret || (needsMinUnit && !minUnit)}
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
                );
              })()}
            </div>

            {/* Colete Sub-Options - Displayed below main form */}
            {tipServiciu === 'Colete' && (
              <div className="mt-4 p-4 bg-linear-to-br from-blue-500/10 to-cyan-500/5 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <ServiceIcon service="Colete" className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Opțiuni Transport</span>
                  <span className="text-xs text-gray-500">(opțional)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {serviceTypes.find(s => s.value === 'Colete')?.subOptions?.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setColeteOptions(prev => ({
                        ...prev,
                        [option.value]: !prev[option.value as keyof typeof prev]
                      }))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                        coleteOptions[option.value as keyof typeof coleteOptions]
                          ? `${option.bgColor} border-current ${option.color}`
                          : 'bg-slate-800/50 border-white/10 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <ServiceIcon 
                        service={option.value === 'express' ? 'Express' : option.value === 'frigo' ? 'Frigo' : option.value === 'fragil' ? 'Fragil' : 'Door2Door'} 
                        className={`w-4 h-4 ${coleteOptions[option.value as keyof typeof coleteOptions] ? option.color : 'text-gray-500'}`} 
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
