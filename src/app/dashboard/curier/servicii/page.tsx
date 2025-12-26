'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { logError } from '@/lib/errorMessages';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ServiceIcon as BaseServiceIcon } from '@/components/icons/ServiceIcons';
import { getDocumentRequirements } from '@/utils/documentRequirements';

// Type for uploaded document status
interface UploadedDocument {
  url: string;
  name: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

// Service types with custom structure for servicii page
// NOTE: Not imported from constants due to custom subOptions for Colete service
// and special flags (kgOnly, plicuriOnly, persoaneOnly, m3Only, nrOnly)
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

// Local ServiceIcon wrapper with additional icons for sub-options
const ServiceIcon = ({ service, className = "w-6 h-6" }: { service: string; className?: string }) => {
  // Additional icons specific to servicii page (sub-options)
  const additionalIcons: Record<string, React.ReactElement> = {
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
    Frigorific: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18m0-18l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12h18M3 12l3-3m-3 3l3 3m15-3l-3-3m3 3l-3 3" />
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
  
  // Check if it's a sub-option icon
  if (additionalIcons[service]) {
    return additionalIcons[service];
  }
  
  // Otherwise use base ServiceIcon component
  return <BaseServiceIcon service={service} className={className} />;
};

export default function TarifePracticatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Selected services state (services the courier offers)
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [savingServices, setSavingServices] = useState(false);
  
  // Verification status state
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDocument>>({});
  const [tipBusiness, setTipBusiness] = useState<'firma' | 'pf'>('pf');
  const [taraSediu, setTaraSediu] = useState('ro');
  const [isVerified, setIsVerified] = useState(false);

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
          setIsVerified(userData.verified || false);
        }
        
        // Load verification data from profil_curier
        const profileDoc = await getDoc(doc(db, 'profil_curier', user.uid));
        if (profileDoc.exists()) {
          const profileData = profileDoc.data();
          setUploadedDocs(profileData.documents || {});
          setTipBusiness(profileData.tipBusiness || 'pf');
          setTaraSediu(profileData.tara_sediu?.toLowerCase() || 'ro');
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
        await updateDoc(userDocRef, { serviciiOferite: newServices });
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
                {selectedServices.filter(sv => serviceTypes.find(s => s.value === sv)).length} / {serviceTypes.length} active
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

        {/* Verification Status Section */}
        {(() => {
          const documentRequirements = getDocumentRequirements(taraSediu, selectedServices, tipBusiness);
          const approvedDocs = documentRequirements.filter(doc => uploadedDocs[doc.id]?.status === 'approved');
          const pendingDocs = documentRequirements.filter(doc => uploadedDocs[doc.id]?.status === 'pending');
          
          return (
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                  isVerified 
                    ? 'bg-linear-to-br from-emerald-500/20 to-green-500/20' 
                    : 'bg-linear-to-br from-amber-500/20 to-orange-500/20'
                }`}>
                  {isVerified ? (
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Status Verificare</h2>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {isVerified 
                      ? 'Contul tău este verificat' 
                      : 'Documentele tale sunt în curs de verificare'
                    }
                  </p>
                </div>
              </div>

              {/* Verified Documents */}
              {approvedDocs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Documente Verificate ({approvedDocs.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {approvedDocs.map(docReq => (
                      <div 
                        key={docReq.id} 
                        className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                          <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate">{docReq.title}</p>
                          <p className="text-emerald-400 text-xs">Verificat</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Documents */}
              {pendingDocs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    În așteptare ({pendingDocs.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pendingDocs.map(docReq => (
                      <div 
                        key={docReq.id} 
                        className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium text-sm truncate">{docReq.title}</p>
                          <p className="text-amber-400 text-xs">În verificare</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service Verification Status */}
              {selectedServices.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Servicii Selectate ({selectedServices.filter(sv => serviceTypes.find(s => s.value === sv)).length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedServices.map(serviceValue => {
                      const service = serviceTypes.find(s => s.value === serviceValue);
                      
                      // Skip services that don't exist in serviceTypes
                      if (!service) return null;
                      
                      // Check if service-specific documents are verified
                      const serviceDocIds = documentRequirements
                        .filter(d => d.forServices?.includes(serviceValue))
                        .map(d => d.id);
                      const hasServiceDocs = serviceDocIds.length > 0;
                      const allServiceDocsVerified = serviceDocIds.every(id => uploadedDocs[id]?.status === 'approved');
                      const isServiceVerified = isVerified && (!hasServiceDocs || allServiceDocsVerified);
                      
                      return (
                        <div 
                          key={serviceValue} 
                          className={`rounded-xl p-4 flex items-center gap-3 border ${
                            isServiceVerified
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-slate-700/30 border-white/10'
                          }`}
                        >
                          <div className={`w-10 h-10 ${service?.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                            <ServiceIcon service={serviceValue} className={`w-5 h-5 ${service?.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium text-sm truncate">{service?.label}</p>
                            <p className={`text-xs ${
                              isServiceVerified ? 'text-emerald-400' : 'text-gray-400'
                            }`}>
                              {isServiceVerified ? 'Verificat' : 'Neconfirmat'}
                            </p>
                          </div>
                          {isServiceVerified && (
                            <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No documents uploaded yet */}
              {approvedDocs.length === 0 && pendingDocs.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-4">Nu ai încărcat încă documente pentru verificare</p>
                  <Link 
                    href="/dashboard/curier/verificare" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors border border-blue-500/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Încarcă documente
                  </Link>
                </div>
              )}
            </div>
          );
        })()}

        {/* Help Card */}
        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </div>
    </div>
  );
}
