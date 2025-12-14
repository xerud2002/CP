'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { logError } from '@/lib/errorMessages';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeftIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
    value: 'Persoane', 
    label: 'Transport Persoane', 
    description: 'Transport persoane în Europa',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    persoaneOnly: true,
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
    value: 'Platforma', 
    label: 'Transport Platformă', 
    description: 'Transport auto pe platformă - mașini, utilaje, tractoare',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
  },
  { 
    value: 'Tractari', 
    label: 'Tractări Auto', 
    description: 'Servicii tractare auto și asistență rutieră',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
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
    value: 'Mobila', 
    label: 'Mutări Mobilă', 
    description: 'Transport mobilier',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    m3Only: true,
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
  
  // Selected services state (services the courier offers)
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [savingServices, setSavingServices] = useState(false);

  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        // Dropdown handling if needed
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        // Dropdown handling if needed
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

  // Load selected services from Firebase
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        // Load selected services from users collection
        const userQuery = query(
          collection(db, 'users'),
          where('uid', '==', user.uid)
        );
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setSelectedServices(userData.serviciiOferite || []);
        }
      } catch (error) {
        logError(error, 'Error loading servicii data');
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
      logError(error, 'Error saving servicii');
    } finally {
      setSavingServices(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/curier" 
              className="p-2.5 hover:bg-slate-800/80 rounded-xl transition-all duration-200 group"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-linear-to-br from-indigo-500/20 via-purple-500/15 to-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
                <svg className="w-7 h-7 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Servicii Transport & Curierat</h1>
                <p className="text-sm text-gray-400 hidden sm:block">Activează serviciile de transport și logistică pe care le oferi clienților din Europa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Info Message */}
        <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-indigo-500/20 p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-500/20 rounded-xl shrink-0 mt-0.5">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-2">De ce este important?</h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Serviciile active permit platformei să îți trimită doar comenzile care se potrivesc cu specializarea ta. Cu cât activezi mai multe servicii relevante, cu atât vei primi mai multe comenzi de la clienți din toată Europa.
              </p>
            </div>
          </div>
        </div>

        {/* Service Types Selection */}
        <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-white/5 p-4 sm:p-6 mb-6 sm:mb-8">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {serviceTypes.map((service) => {
              const isSelected = selectedServices.includes(service.value);
              
              // Border color based on service color
              const borderColorMap: Record<string, string> = {
                'text-blue-400': 'border-blue-500/30 hover:border-blue-400/50',
                'text-yellow-400': 'border-yellow-500/30 hover:border-yellow-400/50',
                'text-amber-400': 'border-amber-500/30 hover:border-amber-400/50',
                'text-purple-400': 'border-purple-500/30 hover:border-purple-400/50',
                'text-pink-400': 'border-pink-500/30 hover:border-pink-400/50',
                'text-red-400': 'border-red-500/30 hover:border-red-400/50',
                'text-orange-400': 'border-orange-500/30 hover:border-orange-400/50',
                'text-cyan-400': 'border-cyan-500/30 hover:border-cyan-400/50',
                'text-rose-400': 'border-rose-500/30 hover:border-rose-400/50',
              };
              
              const gradientMap: Record<string, string> = {
                'text-blue-400': 'from-blue-500/20 to-cyan-500/20',
                'text-yellow-400': 'from-yellow-500/20 to-orange-500/20',
                'text-amber-400': 'from-amber-500/20 to-orange-500/20',
                'text-purple-400': 'from-purple-500/20 to-pink-500/20',
                'text-pink-400': 'from-pink-500/20 to-rose-500/20',
                'text-red-400': 'from-red-500/20 to-orange-500/20',
                'text-orange-400': 'from-orange-500/20 to-amber-500/20',
                'text-cyan-400': 'from-cyan-500/20 to-blue-500/20',
                'text-rose-400': 'from-rose-500/20 to-pink-500/20',
              };
              
              const borderColor = borderColorMap[service.color] || 'border-white/10';
              const gradient = gradientMap[service.color] || 'from-slate-500/20 to-slate-500/20';
              
              return (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => toggleService(service.value)}
                  className={`group relative bg-slate-800/80 backdrop-blur-xl rounded-xl border p-3 sm:p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 active:scale-95 text-left ${
                    isSelected 
                      ? `${borderColor} ring-2 ring-emerald-500/50` 
                      : borderColor
                  }`}
                >
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300`}></div>
                  
                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center z-10 shadow-lg shadow-emerald-500/50">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                  <div className="relative">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 ${service.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                      <ServiceIcon service={service.value} className={`w-5 h-5 sm:w-6 sm:h-6 ${service.color}`} />
                    </div>
                    <h3 className="text-white font-semibold text-xs sm:text-sm mb-0.5">{service.label}</h3>
                    <p className="text-gray-400 text-[10px] sm:text-xs line-clamp-2">{service.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {selectedServices.length === 0 && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-linear-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-2 border-amber-500/30 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4 shadow-lg shadow-amber-500/10">
              <div className="p-2.5 bg-amber-500/20 rounded-xl shrink-0">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-amber-400 mb-1">Atenție!</p>
                <p className="text-sm text-amber-400/90">Selectează cel puțin un serviciu pentru a fi vizibil clienților și pentru a putea primi comenzi.</p>
              </div>
            </div>
          )}
        </div>

        {/* Help Card */}
        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </div>
    </div>
  );
}
