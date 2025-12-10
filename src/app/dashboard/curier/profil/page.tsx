'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import { ArrowLeftIcon, CheckIcon } from '@/components/icons/DashboardIcons';
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

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
  // Vehicle Info
  vehiculTip: string;
  vehiculMarca: string;
  vehiculCapacitate: string;
  // Profile
  descriere: string;
  experienta: string;
  profileImage: string;
}

// Countries with flags for company location
const countries = [
  { code: 'ro', name: 'România', flag: '/img/flag/ro.svg' },
  { code: 'gb', name: 'Anglia', flag: '/img/flag/gb.svg' },
  { code: 'de', name: 'Germania', flag: '/img/flag/de.svg' },
  { code: 'it', name: 'Italia', flag: '/img/flag/it.svg' },
  { code: 'es', name: 'Spania', flag: '/img/flag/es.svg' },
  { code: 'fr', name: 'Franța', flag: '/img/flag/fr.svg' },
  { code: 'at', name: 'Austria', flag: '/img/flag/at.svg' },
  { code: 'be', name: 'Belgia', flag: '/img/flag/be.svg' },
  { code: 'nl', name: 'Olanda', flag: '/img/flag/nl.svg' },
  { code: 'gr', name: 'Grecia', flag: '/img/flag/gr.svg' },
  { code: 'pt', name: 'Portugalia', flag: '/img/flag/pt.svg' },
  { code: 'ie', name: 'Irlanda', flag: '/img/flag/ie.svg' },
];

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

// Document requirements - based on business type and services
interface DocumentRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  icon: 'id' | 'company' | 'transport' | 'insurance' | 'pet' | 'vehicle' | 'cold' | 'license';
  category: 'identity' | 'company' | 'special' | 'cold' | 'insurance' | 'transport';
  forServices?: string[];
}

const getDocumentRequirements = (
  countryCode: string, 
  activeServices: string[], 
  tipBusiness: 'pf' | 'firma'
): DocumentRequirement[] => {
  const documents: DocumentRequirement[] = [];

  // === ALWAYS REQUIRED: ID Document ===
  // UK accepts Driving License as ID, other countries require ID Card/Passport
  documents.push({
    id: 'id_card',
    title: countryCode === 'gb' 
      ? 'Driving Licence / Passport' 
      : 'Carte de Identitate / Pașaport',
    description: countryCode === 'gb'
      ? 'Full UK Driving Licence or valid Passport'
      : 'Copie față-verso a actului de identitate valid',
    required: true,
    icon: countryCode === 'gb' ? 'license' : 'id',
    category: 'identity',
  });

  // === FIRMA (Company) specific documents ===
  if (tipBusiness === 'firma') {
    documents.push({
      id: 'company_registration',
      title: countryCode === 'ro' ? 'Certificat CUI/CIF' :
             countryCode === 'gb' ? 'Certificate of Incorporation' :
             countryCode === 'de' ? 'Handelsregisterauszug' :
             countryCode === 'fr' ? 'Extrait Kbis' :
             countryCode === 'it' ? 'Visura Camerale' :
             countryCode === 'es' ? 'Certificado de Inscripción' :
             'Certificat Înregistrare Firmă',
      description: 'Document oficial de înregistrare a companiei',
      required: true,
      icon: 'company',
      category: 'company',
    });
  }

  // === PF (Individual) specific documents ===
  if (tipBusiness === 'pf') {
    documents.push({
      id: 'pf_authorization',
      title: countryCode === 'ro' ? 'Autorizație PFA / II / IF' :
             countryCode === 'gb' ? 'Self-Employment Registration' :
             countryCode === 'de' ? 'Gewerbeanmeldung' :
             'Autorizație Persoană Fizică',
      description: 'Document care atestă activitatea ca persoană fizică autorizată',
      required: true,
      icon: 'company',
      category: 'company',
    });
  }

  // === DRIVING LICENSE - Required for all transport services ===
  if (activeServices.length > 0) {
    documents.push({
      id: 'driving_license',
      title: 'Permis de Conducere',
      description: 'Categoria B sau superioară, în funcție de vehicul',
      required: true,
      icon: 'license',
      category: 'transport',
    });
  }

  // === SERVICE-SPECIFIC DOCUMENTS ===

  // Animale - Pet transport certificate
  if (activeServices.includes('Animale')) {
    documents.push({
      id: 'pet_transport_cert',
      title: countryCode === 'ro' ? 'Autorizație ANSVSA' :
             countryCode === 'gb' ? 'APHA Pet Transport Licence' :
             countryCode === 'de' ? 'Tiertransport-Zulassung' :
             countryCode === 'fr' ? 'Agrément Transporteur' :
             'Certificat Transport Animale',
      description: 'Autorizație obligatorie pentru transportul animalelor',
      required: true,
      icon: 'pet',
      category: 'special',
      forServices: ['Animale'],
    });
  }

  // Frigo - ATP certificate
  if (activeServices.includes('Frigo')) {
    documents.push({
      id: 'atp_certificate',
      title: 'Certificat ATP',
      description: 'Certificat pentru transportul mărfurilor perisabile',
      required: true,
      icon: 'cold',
      category: 'cold',
      forServices: ['Frigo'],
    });
  }

  // Platformă - Special vehicle license
  if (activeServices.includes('Platformă')) {
    documents.push({
      id: 'platform_license',
      title: 'Atestat Platformă Auto',
      description: 'Atestat pentru operare platformă/trailer',
      required: true,
      icon: 'vehicle',
      category: 'transport',
      forServices: ['Platformă'],
    });
  }

  // Paleți / heavy transport
  if (activeServices.includes('Paleți')) {
    documents.push({
      id: 'heavy_transport_cert',
      title: 'Certificat Transport Marfă',
      description: 'Atestat profesional pentru transport marfă',
      required: true,
      icon: 'transport',
      category: 'transport',
      forServices: ['Paleți'],
    });
  }

  // === INSURANCE DOCUMENTS ===

  // UK requires Goods in Transit Insurance
  if (countryCode === 'gb') {
    documents.push({
      id: 'gb_goods_insurance',
      title: 'Goods in Transit Insurance',
      description: 'Asigurare obligatorie pentru bunuri în tranzit (UK)',
      required: true,
      icon: 'insurance',
      category: 'insurance',
    });
  }

  // CMR Insurance for international transport (recommended)
  if (activeServices.some(s => ['Standard', 'Express', 'Fragil', 'Electronice'].includes(s))) {
    documents.push({
      id: 'cmr_insurance',
      title: 'Asigurare CMR',
      description: 'Asigurare pentru transport internațional (recomandat)',
      required: false,
      icon: 'insurance',
      category: 'insurance',
    });
  }

  return documents;
};

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
  vehiculTip: '',
  vehiculMarca: '',
  vehiculCapacitate: '',
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

const TruckIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const PetIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="4" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="4" cy="8" r="2" />
    <circle cx="8" cy="14" r="2" />
    <circle cx="14" cy="14" r="2" />
    <path d="M12 18c-1.5 0-3 .5-4 2 1-1.5 2.5-2 4-2s3 .5 4 2c-1-1.5-2.5-2-4-2z" />
  </svg>
);

const IdCardIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="8" cy="12" r="2" />
    <path d="M14 10h4" />
    <path d="M14 14h4" />
  </svg>
);

const SnowflakeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="m8 6 4-4 4 4" />
    <path d="m8 18 4 4 4-4" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="m6 8-4 4 4 4" />
    <path d="m18 8 4 4-4 4" />
  </svg>
);

const LicenseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 8h10" />
    <path d="M7 12h4" />
    <circle cx="15" cy="14" r="2" />
    <path d="M17 18v-2a2 2 0 0 0-4 0v2" />
  </svg>
);

const getDocIcon = (iconType: string) => {
  switch (iconType) {
    case 'id': return <IdCardIcon />;
    case 'company': return <BuildingIcon />;
    case 'transport': return <TruckIcon />;
    case 'insurance': return <ShieldIcon />;
    case 'pet': return <PetIcon />;
    case 'vehicle': return <TruckIcon />;
    case 'cold': return <SnowflakeIcon />;
    case 'license': return <LicenseIcon />;
    default: return <DocumentIcon />;
  }
};

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
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<CourierProfile>(defaultProfile);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  
  // Get initial tab from URL or default to 'personal'
  const tabFromUrl = searchParams.get('tab') as 'personal' | 'company' | 'documents' | null;
  const [activeTab, setActiveTab] = useState<'personal' | 'company' | 'documents'>(tabFromUrl || 'personal');
  
  const [prefixDropdownOpen, setPrefixDropdownOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [activeServices, setActiveServices] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prefixDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Function to change tab and update URL
  const handleTabChange = (tab: 'personal' | 'company' | 'documents') => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (prefixDropdownRef.current && !prefixDropdownRef.current.contains(event.target as Node)) {
        setPrefixDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setCountryDropdownOpen(false);
      }
    };
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
          setProfile({ ...defaultProfile, ...docSnap.data() } as CourierProfile);
        } else {
          // Pre-fill email from auth
          setProfile({ ...defaultProfile, email: user.email || '' });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  // Load active services from user's serviciiOferite (selected in Servicii oferite)
  useEffect(() => {
    const loadActiveServices = async () => {
      if (!user) return;
      
      try {
        // Get services from user document's serviciiOferite field
        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          if (userData.serviciiOferite && Array.isArray(userData.serviciiOferite)) {
            setActiveServices(userData.serviciiOferite);
          }
        }
      } catch (error) {
        console.error('Error loading active services:', error);
      }
    };

    if (user) {
      loadActiveServices();
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
      await setDoc(docRef, {
        ...profile,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      showSavedMessage('Profilul a fost salvat cu succes!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Eroare la salvare. Încearcă din nou.');
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
      alert('Te rugăm să selectezi o imagine validă.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Imaginea este prea mare. Dimensiunea maximă este 5MB.');
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
      console.error('Error uploading image:', error);
      alert('Eroare la încărcarea imaginii. Încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  const getCompletionPercentage = () => {
    const fields = [
      profile.nume, profile.telefon, profile.email,
      profile.firma, profile.sediu, profile.cui, profile.iban,
      profile.vehiculTip, profile.vehiculMarca
    ];
    const filled = fields.filter(f => f && f.trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Success Message */}
      {savedMessage && (
        <div className="fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-pulse">
          <CheckIcon className="w-5 h-5" />
          {savedMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/curier" className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 text-sm">
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Înapoi la Dashboard</span>
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              <SaveIcon />
              {saving ? 'Se salvează...' : 'Salvează'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Profile Header Card */}
        <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <div 
                onClick={handleImageClick}
                className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center cursor-pointer overflow-hidden border-4 border-slate-700 group-hover:border-orange-500/50 transition-all"
              >
                {profile.profileImage ? (
                  <Image 
                    src={profile.profileImage} 
                    alt="Profile" 
                    fill 
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover object-center"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                ) : (
                  <span className="text-4xl sm:text-5xl font-bold text-white">
                    {profile.nume ? profile.nume.charAt(0).toUpperCase() : '?'}
                  </span>
                )}
              </div>
              <button 
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 p-2 bg-slate-700 rounded-full border-2 border-slate-600 hover:bg-slate-600 transition-colors"
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
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">
                {profile.nume || 'Completează profilul'}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base mb-2 sm:mb-3">{profile.firma || 'Adaugă firma ta'}</p>
              
              {/* Completion Progress */}
              <div className="max-w-xs mx-auto sm:mx-0">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Profil completat</span>
                  <span className={`font-medium ${completionPercentage >= 80 ? 'text-green-400' : completionPercentage >= 50 ? 'text-yellow-400' : 'text-orange-400'}`}>
                    {completionPercentage}%
                  </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${completionPercentage >= 80 ? 'bg-green-500' : completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3 sm:gap-6">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-white">0</div>
                <div className="text-xs text-gray-500">Comenzi</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-yellow-400">⭐ 0.0</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-400">0</div>
                <div className="text-xs text-gray-500">Recenzii</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => handleTabChange('personal')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'personal'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <UserIcon />
            Date Personale
          </button>
          <button
            onClick={() => handleTabChange('company')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'company'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BuildingIcon />
            Date Firmă
          </button>
          <button
            onClick={() => handleTabChange('documents')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === 'documents'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <DocumentIcon />
            Documente
          </button>
        </div>

        {/* Tab Content */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 order-1">
            {activeTab === 'personal' && (
              <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <UserIcon />
                  </div>
                  Informații Personale
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
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
                          className="form-select w-32 flex items-center gap-2 cursor-pointer"
                        >
                          <Image
                            src={phonePrefixes.find(p => p.code === profile.telefonPrefix)?.flag || '/img/flag/ro.svg'}
                            alt=""
                            width={20}
                            height={14}
                            className="rounded-sm shrink-0"
                          />
                          <span>{phonePrefixes.find(p => p.code === profile.telefonPrefix)?.name || '+40'}</span>
                          <svg className="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {prefixDropdownOpen && (
                          <div className="absolute z-50 mt-1 w-32 bg-slate-800 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            {phonePrefixes.map((p) => (
                              <button
                                key={p.code}
                                type="button"
                                onClick={() => {
                                  setProfile({ ...profile, telefonPrefix: p.code });
                                  setPrefixDropdownOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 transition-colors ${
                                  profile.telefonPrefix === p.code ? 'bg-slate-700/50' : ''
                                }`}
                              >
                                <Image
                                  src={p.flag}
                                  alt=""
                                  width={20}
                                  height={14}
                                  className="rounded-sm shrink-0"
                                />
                                <span className="text-white text-sm">{p.name}</span>
                              </button>
                            ))}
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

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Descriere (opțional)</label>
                    <textarea
                      value={profile.descriere}
                      onChange={(e) => setProfile({ ...profile, descriere: e.target.value })}
                      className="form-input min-h-[100px]"
                      placeholder="Scrie câteva cuvinte despre tine și experiența ta în transport..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Experiență în transport</label>
                    <select
                      value={profile.experienta}
                      onChange={(e) => setProfile({ ...profile, experienta: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Selectează...</option>
                      <option value="<1">Sub 1 an</option>
                      <option value="1-3">1-3 ani</option>
                      <option value="3-5">3-5 ani</option>
                      <option value="5-10">5-10 ani</option>
                      <option value="10+">Peste 10 ani</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-3 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg shrink-0">
                    <BuildingIcon />
                  </div>
                  <span>Date Firmă</span>
                </h2>

                {/* Business Type Selector - Improved Mobile */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">Tip activitate *</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, tipBusiness: 'firma' })}
                      className={`p-2.5 sm:p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                        profile.tipBusiness === 'firma'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1 sm:gap-2">
                        <span className="text-2xl sm:text-3xl">🏢</span>
                        <span className={`font-medium text-xs sm:text-base ${profile.tipBusiness === 'firma' ? 'text-purple-400' : 'text-gray-300'}`}>
                          Firmă
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500 text-center leading-tight">SRL, SA, PFA, II, IF</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, tipBusiness: 'pf' })}
                      className={`p-2.5 sm:p-4 rounded-xl border-2 transition-all active:scale-[0.98] ${
                        profile.tipBusiness === 'pf'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1 sm:gap-2">
                        <span className="text-2xl sm:text-3xl">👤</span>
                        <span className={`font-medium text-xs sm:text-base ${profile.tipBusiness === 'pf' ? 'text-blue-400' : 'text-gray-300'}`}>
                          Persoană Fizică
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500 text-center leading-tight">Fără firmă înregistrată</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                  {/* Denumire firmă - Full width */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                      {profile.tipBusiness === 'firma' ? 'Denumire firmă *' : 'Nume complet *'}
                    </label>
                    <input
                      type="text"
                      value={profile.firma}
                      onChange={(e) => setProfile({ ...profile, firma: e.target.value })}
                      className="form-input text-sm sm:text-base"
                      placeholder={profile.tipBusiness === 'firma' ? 'SC Exemplu SRL' : 'Ion Popescu'}
                    />
                  </div>

                  {/* Țara și Adresa - Stack on mobile */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Țara sediu</label>
                    <div className="relative" ref={countryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                        className="form-select w-full flex items-center gap-2 sm:gap-3 cursor-pointer min-h-[42px] sm:min-h-[46px] text-sm sm:text-base"
                      >
                        <Image
                          src={countries.find(c => c.code === profile.taraSediu)?.flag || '/img/flag/ro.svg'}
                          alt=""
                          width={24}
                          height={16}
                          className="rounded-sm shrink-0"
                        />
                        <span className="flex-1 text-left truncate">{countries.find(c => c.code === profile.taraSediu)?.name || 'România'}</span>
                        <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {countryDropdownOpen && (
                        <div className="absolute z-50 mt-1 w-full bg-slate-800 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {countries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setProfile({ ...profile, taraSediu: c.code });
                                setCountryDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:py-3 hover:bg-slate-700 transition-colors ${
                                profile.taraSediu === c.code ? 'bg-slate-700/50' : ''
                              }`}
                            >
                              <Image
                                src={c.flag}
                                alt=""
                                width={24}
                                height={16}
                                className="rounded-sm shrink-0"
                              />
                              <span className="text-white text-sm sm:text-base">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Adresă sediu</label>
                    <input
                      type="text"
                      value={profile.sediu}
                      onChange={(e) => setProfile({ ...profile, sediu: e.target.value })}
                      className="form-input text-sm sm:text-base"
                      placeholder="Str. Exemplu, Nr. 1, Oraș"
                    />
                  </div>

                  {/* CUI/VAT and Registration */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                      {countryTaxInfo[profile.taraSediu]?.taxLabel || 'CUI / CIF'} *
                    </label>
                    <input
                      type="text"
                      value={profile.cui}
                      onChange={(e) => setProfile({ ...profile, cui: e.target.value })}
                      className="form-input text-sm sm:text-base"
                      placeholder={countryTaxInfo[profile.taraSediu]?.taxPlaceholder || 'RO12345678'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                      {countryTaxInfo[profile.taraSediu]?.regLabel || 'Nr. înregistrare'}
                    </label>
                    <input
                      type="text"
                      value={profile.nrInmatriculare}
                      onChange={(e) => setProfile({ ...profile, nrInmatriculare: e.target.value })}
                      className="form-input text-sm sm:text-base"
                      placeholder={countryTaxInfo[profile.taraSediu]?.regPlaceholder || 'J40/1234/2024'}
                    />
                  </div>

                  {/* Banking Section - Improved Mobile */}
                  {countryTaxInfo[profile.taraSediu]?.bankType === 'uk' ? (
                    // UK: Sort Code + Account Number
                    <>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Sort Code *</label>
                        <input
                          type="text"
                          value={profile.sortCode}
                          onChange={(e) => setProfile({ ...profile, sortCode: e.target.value })}
                          className="form-input text-sm sm:text-base font-mono"
                          placeholder={countryTaxInfo[profile.taraSediu]?.sortCodePlaceholder || '12-34-56'}
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Account Number *</label>
                        <input
                          type="text"
                          value={profile.accountNumber}
                          onChange={(e) => setProfile({ ...profile, accountNumber: e.target.value })}
                          className="form-input text-sm sm:text-base font-mono"
                          placeholder={countryTaxInfo[profile.taraSediu]?.accountNumberPlaceholder || '12345678'}
                        />
                      </div>
                    </>
                  ) : (
                    // All other countries: IBAN
                    <div className="sm:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">IBAN *</label>
                      <input
                        type="text"
                        value={profile.iban}
                        onChange={(e) => setProfile({ ...profile, iban: e.target.value })}
                        className="form-input text-sm sm:text-base font-mono"
                        placeholder={countryTaxInfo[profile.taraSediu]?.ibanPlaceholder || 'RO49 AAAA 1B31 0075 9384 0000'}
                      />
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Contul în care vei primi plățile pentru transporturi
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                    <DocumentIcon />
                  </div>
                  Documente Necesare
                </h2>

                {/* Business type & Services info */}
                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-slate-700/30 rounded-lg sm:rounded-xl space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Tip activitate:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      profile.tipBusiness === 'firma' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {profile.tipBusiness === 'firma' ? '🏢 Firmă' : '👤 Persoană Fizică'}
                    </span>
                  </div>
                  {activeServices.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs mb-2">Servicii active:</p>
                      <div className="flex flex-wrap gap-2">
                        {activeServices.map(service => (
                          <span key={service} className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
                  Documentele sunt afișate în funcție de tipul de activitate și serviciile activate.
                </p>
                <p className="text-gray-500 text-xs mb-4 sm:mb-6">
                  Documentele cu <span className="text-red-400">*</span> sunt obligatorii.
                </p>

                {/* Required Documents */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    Documente Obligatorii ({getDocumentRequirements(profile.taraSediu, activeServices, profile.tipBusiness).filter(d => d.required).length})
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {getDocumentRequirements(profile.taraSediu, activeServices, profile.tipBusiness)
                      .filter(doc => doc.required)
                      .map((doc) => (
                        <div key={doc.id} className="border border-dashed border-slate-600 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-orange-500/50 transition-colors">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`p-2 sm:p-3 rounded-lg ${
                              doc.category === 'identity' ? 'bg-blue-500/20 text-blue-400' :
                              doc.category === 'company' ? 'bg-purple-500/20 text-purple-400' :
                              doc.category === 'transport' ? 'bg-green-500/20 text-green-400' :
                              doc.category === 'special' ? 'bg-pink-500/20 text-pink-400' :
                              doc.category === 'cold' ? 'bg-cyan-500/20 text-cyan-400' :
                              doc.category === 'insurance' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-slate-700/50 text-gray-400'
                            }`}>
                              {getDocIcon(doc.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-sm sm:text-base mb-1 flex flex-wrap items-center gap-1 sm:gap-2">
                                {doc.title}
                                <span className="text-red-400 text-xs">*</span>
                                {doc.forServices && (
                                  <span className="text-xs px-2 py-0.5 bg-slate-700 text-gray-400 rounded-full">
                                    {doc.forServices.join(', ')}
                                  </span>
                                )}
                              </h4>
                              <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">{doc.description}</p>
                              <label className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700 hover:bg-slate-600 rounded-lg cursor-pointer transition-colors">
                                <UploadIcon />
                                <span className="text-xs sm:text-sm text-gray-300">Încărcați document</span>
                                <input type="file" accept="image/*,.pdf" className="hidden" />
                              </label>
                            </div>
                            <div className="text-yellow-500 shrink-0" title="În așteptare">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Optional Documents - Only shown if there are any */}
                {getDocumentRequirements(profile.taraSediu, activeServices, profile.tipBusiness).filter(d => !d.required).length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-xs sm:text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2 sm:mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      Documente Recomandate ({getDocumentRequirements(profile.taraSediu, activeServices, profile.tipBusiness).filter(d => !d.required).length})
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {getDocumentRequirements(profile.taraSediu, activeServices, profile.tipBusiness)
                        .filter(doc => !doc.required)
                        .map((doc) => (
                          <div key={doc.id} className="border border-dashed border-slate-700 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-emerald-500/50 transition-colors opacity-80 hover:opacity-100">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className={`p-2 sm:p-3 rounded-lg ${
                                doc.category === 'insurance' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-slate-700/50 text-gray-400'
                              }`}>
                                {getDocIcon(doc.icon)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-gray-300 font-medium text-sm sm:text-base mb-1 flex flex-wrap items-center gap-1 sm:gap-2">
                                  {doc.title}
                                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                                    Opțional
                                  </span>
                                </h4>
                                <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">{doc.description}</p>
                                <label className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors">
                                  <UploadIcon />
                                  <span className="text-xs sm:text-sm text-gray-400">Încărcați document</span>
                                  <input type="file" accept="image/*,.pdf" className="hidden" />
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Info box */}
                <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg sm:rounded-xl">
                  <p className="text-blue-400 text-xs sm:text-sm">
                    <strong>💡 Verificare rapidă:</strong> Documentele sunt verificate în 24-48 ore. Vei primi notificare la aprobare.
                  </p>
                </div>

                {/* Hint for more services */}
                {activeServices.length === 0 && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg sm:rounded-xl">
                    <p className="text-amber-400 text-xs sm:text-sm">
                      <strong>💼 Adaugă servicii:</strong> Mergi la <Link href="/dashboard/curier/tarife" className="underline hover:text-amber-300">Servicii și Tarife</Link> pentru a activa servicii și a vedea documentele necesare.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-4 order-2">
            {/* Quick Links */}
            <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">Acțiuni rapide</h3>
              <div className="space-y-2">
                <Link
                  href="/dashboard/curier/zona-acoperire"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="p-1.5 sm:p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Zonă acoperire</p>
                    <p className="text-gray-500 text-xs">Configurează țările</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/curier/tarife"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="p-1.5 sm:p-2 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors">
                    <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 10h12" />
                      <path d="M4 14h9" />
                      <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Servicii și Tarife</p>
                    <p className="text-gray-500 text-xs">Gestionează prețurile</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/curier/calendar"
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors group"
                >
                  <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                    <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Calendar</p>
                    <p className="text-gray-500 text-xs">Zile de colectare</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-linear-to-br from-orange-500/10 to-amber-500/10 rounded-xl sm:rounded-2xl border border-orange-500/20 p-4 sm:p-5">
              <h3 className="text-orange-400 font-medium text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-2">
                <span>💡</span> Sfaturi
              </h3>
              <ul className="text-xs sm:text-sm text-gray-400 space-y-1.5 sm:space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5">•</span>
                  Un profil complet atrage mai mulți clienți
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5">•</span>
                  Adaugă o poză de profil profesională
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5">•</span>
                  Completează datele firmei pentru facturare
                </li>
              </ul>
            </div>

            {/* Status Card */}
            <div className="bg-slate-800/50 rounded-xl sm:rounded-2xl border border-white/5 p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">Status cont</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Verificat</span>
                  <span className="text-yellow-400 text-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    În așteptare
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Documente</span>
                  <span className="text-orange-400 text-sm">0 / 3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Membru din</span>
                  <span className="text-gray-300 text-sm">Dec 2025</span>
                </div>
              </div>
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