'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, Suspense, useMemo } from 'react';
import { ArrowLeftIcon, CheckIcon, UserIcon as DashboardUserIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';

import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { logError } from '@/lib/errorMessages';
import { showError } from '@/lib/toast';
import { countries } from '@/lib/constants';

interface CourierProfile {
  // Personal Info
  nume: string;
  telefon: string;
  telefonPrefix: string;
  email: string;
  // Business Type
  tipBusiness: 'pf' | 'firma'; // pf = persoana fizica, firma = company
  // Company Info
  firma: string;
  sediu: string;
  taraSediu: string;
  nrInmatriculare: string;
  cui: string;
  iban: string;
  // UK specific bank fields
  sortCode: string;
  accountNumber: string;
  // Profile
  descriere: string;
  experienta: string;
  profileImage: string;
  // Verification Status
  verificationStatus?: 'verified' | 'pending' | 'none';
  insuranceStatus?: 'verified' | 'pending' | 'none';
}

// Tax ID and registration info per country
// Banking: UK uses Sort Code + Account Number, Ireland can use both IBAN and local format
const countryTaxInfo: Record<string, { 
  taxLabel: string; 
  taxPlaceholder: string; 
  regLabel: string; 
  regPlaceholder: string; 
  bankType: 'iban' | 'uk'; 
  ibanPlaceholder?: string;
  sortCodePlaceholder?: string;
  accountNumberPlaceholder?: string;
}> = {
  ro: { taxLabel: 'CUI / CIF', taxPlaceholder: 'RO12345678', regLabel: 'Nr. înregistrare', regPlaceholder: 'J40/1234/2024', bankType: 'iban', ibanPlaceholder: 'RO49AAAA1B31007593840000' },
  gb: { taxLabel: 'VAT Number', taxPlaceholder: 'GB123456789', regLabel: 'Company Number', regPlaceholder: '12345678', bankType: 'uk', sortCodePlaceholder: '12-34-56', accountNumberPlaceholder: '12345678' },
  de: { taxLabel: 'USt-IdNr.', taxPlaceholder: 'DE123456789', regLabel: 'Handelsregister', regPlaceholder: 'HRB 12345', bankType: 'iban', ibanPlaceholder: 'DE89 3704 0044 0532 0130 00' },
  it: { taxLabel: 'Partita IVA', taxPlaceholder: 'IT12345678901', regLabel: 'REA', regPlaceholder: 'MI-1234567', bankType: 'iban', ibanPlaceholder: 'IT60 X054 2811 1010 0000 0123 456' },
  es: { taxLabel: 'NIF / CIF', taxPlaceholder: 'ESA12345678', regLabel: 'Registro Mercantil', regPlaceholder: 'Tomo 1234, Folio 56', bankType: 'iban', ibanPlaceholder: 'ES91 2100 0418 4502 0005 1332' },
  fr: { taxLabel: 'N° TVA', taxPlaceholder: 'FR12345678901', regLabel: 'SIRET', regPlaceholder: '123 456 789 00012', bankType: 'iban', ibanPlaceholder: 'FR76 3000 6000 0112 3456 7890 189' },
  at: { taxLabel: 'UID-Nummer', taxPlaceholder: 'ATU12345678', regLabel: 'Firmenbuch', regPlaceholder: 'FN 123456a', bankType: 'iban', ibanPlaceholder: 'AT61 1904 3002 3457 3201' },
  be: { taxLabel: 'N° TVA / BTW', taxPlaceholder: 'BE0123456789', regLabel: 'Nr. întreprindere', regPlaceholder: '0123.456.789', bankType: 'iban', ibanPlaceholder: 'BE68 5390 0754 7034' },
  nl: { taxLabel: 'BTW-nummer', taxPlaceholder: 'NL123456789B01', regLabel: 'KVK-nummer', regPlaceholder: '12345678', bankType: 'iban', ibanPlaceholder: 'NL91 ABNA 0417 1643 00' },
  gr: { taxLabel: 'ΑΦΜ (AFM)', taxPlaceholder: 'EL123456789', regLabel: 'ΓΕΜΗ', regPlaceholder: '123456789000', bankType: 'iban', ibanPlaceholder: 'GR16 0110 1250 0000 0001 2300 695' },
  pt: { taxLabel: 'NIF', taxPlaceholder: 'PT123456789', regLabel: 'NIPC', regPlaceholder: '501234567', bankType: 'iban', ibanPlaceholder: 'PT50 0002 0123 1234 5678 9015 4' },
  ie: { taxLabel: 'VAT Number', taxPlaceholder: 'IE1234567T', regLabel: 'CRO Number', regPlaceholder: '123456', bankType: 'iban', ibanPlaceholder: 'IE29 AIBK 9311 5212 3456 78' },
};

// Tax info for individuals (Persoană Fizică / Sole Trader)
const countryTaxInfoPF: Record<string, { 
  taxLabel: string; 
  taxPlaceholder: string; 
  regLabel: string; 
  regPlaceholder: string; 
  bankType: 'iban' | 'uk'; 
  ibanPlaceholder?: string;
  sortCodePlaceholder?: string;
  accountNumberPlaceholder?: string;
}> = {
  ro: { taxLabel: 'CNP', taxPlaceholder: '1234567890123', regLabel: 'CIF (opțional)', regPlaceholder: 'RO12345678', bankType: 'iban', ibanPlaceholder: 'RO49AAAA1B31007593840000' },
  gb: { taxLabel: 'UTR (Unique Taxpayer Reference)', taxPlaceholder: '1234567890', regLabel: 'National Insurance Number', regPlaceholder: 'QQ123456C', bankType: 'uk', sortCodePlaceholder: '12-34-56', accountNumberPlaceholder: '12345678' },
  de: { taxLabel: 'Steuernummer', taxPlaceholder: '12/345/67890', regLabel: 'Steuer-ID', regPlaceholder: '12 345 678 901', bankType: 'iban', ibanPlaceholder: 'DE89 3704 0044 0532 0130 00' },
  it: { taxLabel: 'Codice Fiscale', taxPlaceholder: 'RSSMRA80A01H501U', regLabel: 'Partita IVA (opțional)', regPlaceholder: 'IT12345678901', bankType: 'iban', ibanPlaceholder: 'IT60 X054 2811 1010 0000 0123 456' },
  es: { taxLabel: 'NIF Personal', taxPlaceholder: '12345678Z', regLabel: 'N° Seguridad Social', regPlaceholder: '123456789012', bankType: 'iban', ibanPlaceholder: 'ES91 2100 0418 4502 0005 1332' },
  fr: { taxLabel: 'N° SIRET', taxPlaceholder: '123 456 789 00012', regLabel: 'N° SIREN', regPlaceholder: '123 456 789', bankType: 'iban', ibanPlaceholder: 'FR76 3000 6000 0112 3456 7890 189' },
  at: { taxLabel: 'Steuernummer', taxPlaceholder: '12-345/6789', regLabel: 'Sozialversicherungsnummer', regPlaceholder: '1234 010180', bankType: 'iban', ibanPlaceholder: 'AT61 1904 3002 3457 3201' },
  be: { taxLabel: 'N° National / Rijksregisternummer', taxPlaceholder: '12.34.56-789.01', regLabel: 'N° TVA (opțional)', regPlaceholder: 'BE0123456789', bankType: 'iban', ibanPlaceholder: 'BE68 5390 0754 7034' },
  nl: { taxLabel: 'BSN (Burgerservicenummer)', taxPlaceholder: '123456789', regLabel: 'KVK-nummer (opțional)', regPlaceholder: '12345678', bankType: 'iban', ibanPlaceholder: 'NL91 ABNA 0417 1643 00' },
  gr: { taxLabel: 'ΑΦΜ (AFM) Προσωπικό', taxPlaceholder: '123456789', regLabel: 'ΑΜΚΑ', regPlaceholder: '12345678901', bankType: 'iban', ibanPlaceholder: 'GR16 0110 1250 0000 0001 2300 695' },
  pt: { taxLabel: 'NIF Pessoal', taxPlaceholder: '123456789', regLabel: 'NISS', regPlaceholder: '12345678901', bankType: 'iban', ibanPlaceholder: 'PT50 0002 0123 1234 5678 9015 4' },
  ie: { taxLabel: 'PPS Number', taxPlaceholder: '1234567T', regLabel: 'Tax Reference Number (opțional)', regPlaceholder: '1234567T', bankType: 'iban', ibanPlaceholder: 'IE29 AIBK 9311 5212 3456 78' },
};

const phonePrefixes = [
  { code: 'ro', name: '+40', flag: '/img/flag/ro.svg' },
  { code: 'gb', name: '+44', flag: '/img/flag/gb.svg' },
  { code: 'it', name: '+39', flag: '/img/flag/it.svg' },
  { code: 'es', name: '+34', flag: '/img/flag/es.svg' },
  { code: 'de', name: '+49', flag: '/img/flag/de.svg' },
  { code: 'fr', name: '+33', flag: '/img/flag/fr.svg' },
  { code: 'at', name: '+43', flag: '/img/flag/at.svg' },
  { code: 'be', name: '+32', flag: '/img/flag/be.svg' },
  { code: 'nl', name: '+31', flag: '/img/flag/nl.svg' },
  { code: 'gr', name: '+30', flag: '/img/flag/gr.svg' },
  { code: 'pt', name: '+351', flag: '/img/flag/pt.svg' },
  { code: 'ie', name: '+353', flag: '/img/flag/ie.svg' },
];



const defaultProfile: CourierProfile = {
  nume: '',
  telefon: '',
  telefonPrefix: 'ro',
  email: '',
  tipBusiness: 'firma',
  firma: '',
  sediu: '',
  taraSediu: 'ro',
  nrInmatriculare: '',
  cui: '',
  iban: '',
  sortCode: '',
  accountNumber: '',
  descriere: '',
  experienta: '',
  profileImage: '',
};

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

const CameraIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

function ProfilCurierContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<CourierProfile>(defaultProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  
  const [prefixDropdownOpen, setPrefixDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'pending' | 'none'>('none');
  const [insuranceStatus, setInsuranceStatus] = useState<'verified' | 'pending' | 'none'>('none');
  const prefixDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (prefixDropdownRef.current && !prefixDropdownRef.current.contains(event.target as Node)) {
        setPrefixDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load profile from Firebase
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const docRef = doc(db, 'profil_curier', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const profileData = { ...defaultProfile, ...data };
          setProfile(profileData as CourierProfile);
          
          // Set verification status
          setVerificationStatus(profileData.verificationStatus || 'none');
          setInsuranceStatus(profileData.insuranceStatus || 'none');
        } else {
          // Pre-fill email from auth
          setProfile({ ...defaultProfile, email: user.email || '' });
          setVerificationStatus('none');
          setInsuranceStatus('none');
        }
        
        // Load orders count (courier's accepted orders)
        const ordersQuery = query(collection(db, 'comenzi'), where('courierId', '==', user.uid));
        const ordersSnapshot = await getDocs(ordersQuery);
        setOrdersCount(ordersSnapshot.size);
      } catch (error) {
        logError(error, 'Error loading profile');
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  const showSavedMessage = (message: string) => {
    setSavedMessage(message);
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const docRef = doc(db, 'profil_curier', user.uid);
      
      // Check if this is the first time saving the profile (profile completion)
      const existingDoc = await getDoc(docRef);
      
      await setDoc(docRef, {
        ...profile,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      
      showSavedMessage('Profilul a fost salvat cu succes!');
    } catch (error) {
      logError(error, 'Error saving profile');
      showError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Te rugăm să selectezi o imagine validă.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Imaginea este prea mare. Dimensiunea maximă este 5MB.');
      return;
    }

    setSaving(true);
    try {
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `profile_images/${user.uid}/${Date.now()}_${file.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update profile with new image URL
      setProfile(prev => ({ ...prev, profileImage: downloadURL }));
      
      // Save to Firestore
      const docRef = doc(db, 'profil_curier', user.uid);
      await setDoc(docRef, {
        profileImage: downloadURL,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      showSavedMessage('Imaginea de profil a fost actualizată!');
    } catch (error) {
      logError(error, 'Error uploading image');
      showError(error);
    } finally {
      setSaving(false);
    }
  };

  // Memoize completion percentage calculation to avoid recalculation on every render
  const completionPercentage = useMemo(() => {
    const fields = [
      profile.nume, profile.telefon, profile.email,
      profile.firma, profile.sediu, profile.cui, profile.iban
    ];
    const filled = fields.filter(f => f && f.trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  }, [profile.nume, profile.telefon, profile.email, profile.firma, profile.sediu, profile.cui, profile.iban]);

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Success Message */}
      {savedMessage && (
        <div className="fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <CheckIcon className="w-5 h-5" />
          {savedMessage}
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href="/dashboard/curier" 
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <DashboardUserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white">Profil Curier</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Editează datele tale</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 text-sm sm:text-base"
            >
              <SaveIcon />
              <span className="hidden sm:inline">{saving ? 'Se salvează...' : 'Salvează'}</span>
              <span className="sm:hidden">{saving ? '...' : 'Salvează'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Profile Header Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 mb-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Profile Image */}
            <div className="relative group shrink-0">
              <div 
                onClick={handleImageClick}
                className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-linear-to-br from-orange-500/20 to-amber-600/20 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-slate-700/50 group-hover:border-orange-500/50 transition-all duration-300 shadow-2xl group-hover:shadow-orange-500/20"
              >
                <Image 
                  src={profile.profileImage || '/img/default-avatar.png'} 
                  alt="Profile" 
                  fill 
                  sizes="(max-width: 640px) 128px, 144px"
                  className="object-cover object-center rounded-2xl"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
              <button 
                onClick={handleImageClick}
                className="absolute -bottom-2 -right-2 p-3 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl border-3 border-slate-800 hover:from-orange-400 hover:to-orange-500 transition-all shadow-xl hover:scale-110 active:scale-95"
                title="Schimbă imaginea"
              >
                <CameraIcon />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                    {profile.nume || 'Completează profilul'}
                  </h1>
                  <p className="text-gray-400 text-base sm:text-lg">{profile.firma || 'Adaugă firma ta'}</p>
                </div>

                {/* Quick Stats - Desktop */}
                <div className="hidden lg:flex gap-3">
                  <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/5 hover:border-orange-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 bg-orange-500/20 rounded-lg">
                        <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-white">{ordersCount}</div>
                    </div>
                    <div className="text-xs text-gray-400 font-medium">Comenzi</div>
                  </div>

                  
                  <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/5 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-2 rounded-lg ${
                        verificationStatus === 'verified' ? 'bg-emerald-500/20' :
                        verificationStatus === 'pending' ? 'bg-yellow-500/20' :
                        'bg-red-500/20'
                      }`}>
                        <svg className={`w-5 h-5 ${
                          verificationStatus === 'verified' ? 'text-emerald-400' :
                          verificationStatus === 'pending' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 font-medium">Verificat</div>
                  </div>
                  
                  <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/5 hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-2 rounded-lg ${
                        insuranceStatus === 'verified' ? 'bg-emerald-500/20' :
                        insuranceStatus === 'pending' ? 'bg-yellow-500/20' :
                        'bg-red-500/20'
                      }`}>
                        <svg className={`w-5 h-5 ${
                          insuranceStatus === 'verified' ? 'text-emerald-400' :
                          insuranceStatus === 'pending' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 font-medium">Asigurare</div>
                  </div>
                </div>
              </div>
              
              {/* Completion Progress */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${completionPercentage >= 80 ? 'bg-green-500/20' : completionPercentage >= 50 ? 'bg-yellow-500/20' : 'bg-orange-500/20'}`}>
                      <svg className={`w-5 h-5 ${completionPercentage >= 80 ? 'text-green-400' : completionPercentage >= 50 ? 'text-yellow-400' : 'text-orange-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-200 font-semibold text-base">Profil completat</span>
                  </div>
                  <span className={`font-bold text-2xl ${completionPercentage >= 80 ? 'text-green-400' : completionPercentage >= 50 ? 'text-yellow-400' : 'text-orange-400'}`}>
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30 shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${completionPercentage >= 80 ? 'bg-linear-to-r from-green-500 to-emerald-500' : completionPercentage >= 50 ? 'bg-linear-to-r from-yellow-500 to-amber-500' : 'bg-linear-to-r from-orange-500 to-amber-500'} shadow-lg`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Quick Stats - Mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 lg:hidden">
                <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl px-3 py-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-orange-500/20 rounded-lg">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>
                    <div className="text-xl font-bold text-white">{ordersCount}</div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Comenzi</div>
                </div>

                
                <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl px-3 py-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-2 rounded-lg ${
                      verificationStatus === 'verified' ? 'bg-emerald-500/20' :
                      verificationStatus === 'pending' ? 'bg-yellow-500/20' :
                      'bg-red-500/20'
                    }`}>
                      <svg className={`w-4 h-4 ${
                        verificationStatus === 'verified' ? 'text-emerald-400' :
                        verificationStatus === 'pending' ? 'text-yellow-400' :
                        'text-red-400'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Verificat</div>
                </div>
                
                <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl px-3 py-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-2 rounded-lg ${
                      insuranceStatus === 'verified' ? 'bg-emerald-500/20' :
                      insuranceStatus === 'pending' ? 'bg-yellow-500/20' :
                      'bg-red-500/20'
                    }`}>
                      <svg className={`w-4 h-4 ${
                        insuranceStatus === 'verified' ? 'text-emerald-400' :
                        insuranceStatus === 'pending' ? 'text-yellow-400' :
                        'text-red-400'
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">Asigurare</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
            {/* Personal Information & Business Data - Full Width Cards */}
            <div className="space-y-6">
              {/* Business Information Section */}
              <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2.5 bg-linear-to-br from-blue-500/30 to-blue-600/30 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/20">
                    <BuildingIcon />
                  </div>
                  <span>{profile.tipBusiness === 'firma' ? 'Date Firmă' : 'Date Business'}</span>
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Denumire firmă */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {profile.tipBusiness === 'firma' ? 'Denumire firmă *' : 'Nume complet *'}
                    </label>
                    <input
                      type="text"
                      value={profile.firma}
                      onChange={(e) => setProfile({ ...profile, firma: e.target.value })}
                      className="form-input"
                      placeholder={profile.tipBusiness === 'firma' ? 'SC Exemplu SRL' : 'Ion Popescu'}
                    />
                  </div>

                  {/* Țara sediu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Țara sediu</label>
                    <div className="relative" ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                        className="form-input w-full flex items-center gap-2 sm:gap-3 cursor-pointer min-h-12 sm:min-h-11 touch-manipulation"
                      >
                        <Image
                          src={countries.find(c => c.code === profile.taraSediu)?.flag || '/img/flag/ro.svg'}
                          alt=""
                          width={20}
                          height={14}
                          className="rounded-sm shrink-0 w-5 h-auto sm:w-6"
                        />
                        <span className="flex-1 text-left truncate">{countries.find(c => c.code === profile.taraSediu)?.name || 'România'}</span>
                        <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {countryDropdownOpen && (
                        <div className="fixed sm:absolute inset-0 sm:inset-auto z-100 sm:mt-1 w-full sm:w-auto bg-slate-800 sm:border border-white/10 sm:rounded-lg shadow-xl max-h-screen sm:max-h-60 overflow-hidden flex flex-col">
                          <div className="p-3 sm:p-0 border-b sm:border-0 border-white/10 flex sm:hidden items-center justify-between">
                            <span className="text-sm font-medium text-gray-300">Selectează țara</span>
                            <button
                              type="button"
                              onClick={() => setCountryDropdownOpen(false)}
                              className="p-2 hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
                              aria-label="Închide"
                            >
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex-1 overflow-y-auto dropdown-scrollbar">
                          {countries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setProfile({ ...profile, taraSediu: c.code });
                                setCountryDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 sm:px-3 py-4 sm:py-2.5 hover:bg-slate-700 active:bg-slate-600 transition-colors touch-manipulation ${
                                profile.taraSediu === c.code ? 'bg-slate-700/50' : ''
                              }`}
                            >
                              <Image
                                src={c.flag}
                                alt=""
                                width={20}
                                height={14}
                                className="rounded-sm shrink-0 w-5 h-auto"
                              />
                              <span className="text-white text-sm sm:text-base">{c.name}</span>
                            </button>
                          ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Adresă sediu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Adresă sediu</label>
                    <input
                      type="text"
                      value={profile.sediu}
                      onChange={(e) => setProfile({ ...profile, sediu: e.target.value })}
                      className="form-input"
                      placeholder="Str. Exemplu, Nr. 1, Oraș"
                    />
                  </div>

                  {/* CUI/VAT */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {profile.tipBusiness === 'firma' 
                        ? (countryTaxInfo[profile.taraSediu]?.taxLabel || 'CUI / CIF')
                        : (countryTaxInfoPF[profile.taraSediu]?.taxLabel || 'CNP')
                      } *
                    </label>
                    <input
                      type="text"
                      value={profile.cui}
                      onChange={(e) => setProfile({ ...profile, cui: e.target.value })}
                      className="form-input"
                      placeholder={profile.tipBusiness === 'firma'
                        ? (countryTaxInfo[profile.taraSediu]?.taxPlaceholder || 'RO12345678')
                        : (countryTaxInfoPF[profile.taraSediu]?.taxPlaceholder || '1234567890123')
                      }
                    />
                  </div>

                  {/* Registration Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {profile.tipBusiness === 'firma'
                        ? (countryTaxInfo[profile.taraSediu]?.regLabel || 'Nr. înregistrare')
                        : (countryTaxInfoPF[profile.taraSediu]?.regLabel || 'CIF (opțional)')
                      }
                    </label>
                    <input
                      type="text"
                      value={profile.nrInmatriculare}
                      onChange={(e) => setProfile({ ...profile, nrInmatriculare: e.target.value })}
                      className="form-input"
                      placeholder={profile.tipBusiness === 'firma'
                        ? (countryTaxInfo[profile.taraSediu]?.regPlaceholder || 'J40/1234/2024')
                        : (countryTaxInfoPF[profile.taraSediu]?.regPlaceholder || 'RO12345678')
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6 sm:p-8 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2.5 bg-linear-to-br from-orange-500/30 to-orange-600/30 rounded-xl border border-orange-500/30 shadow-lg shadow-orange-500/20">
                    <UserIcon />
                  </div>
                  Informații Personale
                </h2>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nume complet *</label>
                    <input
                      type="text"
                      value={profile.nume}
                      onChange={(e) => setProfile({ ...profile, nume: e.target.value })}
                      className="form-input"
                      placeholder="Ion Popescu"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="form-input"
                      placeholder="email@exemplu.com"
                    />
                  </div>

                  <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Număr telefon *</label>
                  <div className="flex gap-2">
                    {/* Custom Prefix Dropdown */}
                    <div className="relative" ref={prefixDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setPrefixDropdownOpen(!prefixDropdownOpen)}
                        className="form-input w-28 sm:w-32 flex items-center gap-1.5 sm:gap-2 cursor-pointer min-h-12 sm:min-h-11 touch-manipulation"
                      >
                        <Image
                          src={phonePrefixes.find(p => p.code === profile.telefonPrefix)?.flag || '/img/flag/ro.svg'}
                          alt={`Steag ${phonePrefixes.find(p => p.code === profile.telefonPrefix)?.name || 'România'}`}
                          width={20}
                          height={14}
                          className="rounded-sm shrink-0 w-5 h-auto"
                        />
                        <span className="text-sm sm:text-base">{phonePrefixes.find(p => p.code === profile.telefonPrefix)?.name || '+40'}</span>
                        <svg className="w-4 h-4 ml-auto text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {prefixDropdownOpen && (
                        <div className="fixed sm:absolute inset-0 sm:inset-auto z-100 sm:mt-1 w-full sm:w-48 bg-slate-800 sm:border border-white/10 sm:rounded-lg shadow-xl max-h-screen sm:max-h-60 overflow-hidden flex flex-col">
                          <div className="p-3 sm:p-0 border-b sm:border-0 border-white/10 flex sm:hidden items-center justify-between">
                            <span className="text-sm font-medium text-gray-300">Selectează prefix</span>
                            <button
                              type="button"
                              onClick={() => setPrefixDropdownOpen(false)}
                              className="p-2 hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
                              aria-label="Închide"
                            >
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex-1 overflow-y-auto dropdown-scrollbar">
                          {phonePrefixes.map((p) => (
                            <button
                              key={p.code}
                              type="button"
                              onClick={() => {
                                setProfile({ ...profile, telefonPrefix: p.code });
                                setPrefixDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 sm:px-3 py-4 sm:py-2.5 hover:bg-slate-700 active:bg-slate-600 transition-colors touch-manipulation ${
                                profile.telefonPrefix === p.code ? 'bg-slate-700/50' : ''
                              }`}
                            >
                              <Image
                                src={p.flag}
                                alt=""
                                width={20}
                                height={14}
                                className="rounded-sm shrink-0 w-5 h-auto"
                              />
                              <span className="text-white text-sm sm:text-base">{p.name}</span>
                            </button>
                          ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={profile.telefon}
                      onChange={(e) => setProfile({ ...profile, telefon: e.target.value })}
                      className="form-input flex-1"
                      placeholder="7xx xxx xxx"
                    />
                  </div>
                </div>
              </div>
            </div>

{/* Help Card */}
        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default function ProfilCurierPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="spinner"></div></div>}>
      <ProfilCurierContent />
    </Suspense>
  );
}
