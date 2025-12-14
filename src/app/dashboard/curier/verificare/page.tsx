'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ArrowLeftIcon, CheckCircleIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/errorMessages';

// Types
interface UploadedDocument {
  url: string;
  name: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

interface DocumentRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  icon: 'id' | 'license' | 'company' | 'transport' | 'pet' | 'cold' | 'vehicle' | 'insurance';
  category: 'identity' | 'company' | 'transport' | 'special' | 'cold' | 'insurance';
  forServices?: string[];
}

interface CourierProfile {
  taraSediu: string;
  tipBusiness: 'firma' | 'pf';
}

// Document requirements function (same as in profil/page.tsx)
const getDocumentRequirements = (
  countryCode: string, 
  activeServices: string[], 
  tipBusiness: 'firma' | 'pf'
): DocumentRequirement[] => {
  const documents: DocumentRequirement[] = [];

  // === ALWAYS REQUIRED: ID Document ===
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

  // Transport Persoane - Taxi/passenger transport license
  if (activeServices.includes('Persoane')) {
    documents.push({
      id: 'passenger_transport_license',
      title: countryCode === 'ro' ? 'Licență Transport Persoane' :
             countryCode === 'gb' ? 'Private Hire / Taxi Licence' :
             countryCode === 'de' ? 'Personenbeförderungsschein' :
             countryCode === 'fr' ? 'Licence VTC / Taxi' :
             'Licență Transport Persoane',
      description: 'Autorizație obligatorie pentru transport persoane cu plată',
      required: true,
      icon: 'license',
      category: 'transport',
      forServices: ['Persoane'],
    });
  }

  // Transfer Aeroport - Airport transfer license
  if (activeServices.includes('Aeroport')) {
    documents.push({
      id: 'airport_transfer_license',
      title: countryCode === 'ro' ? 'Licență Transfer Aeroport' :
             countryCode === 'gb' ? 'Airport Transfer Licence' :
             countryCode === 'de' ? 'Flughafentransfer-Lizenz' :
             'Licență Transfer Aeroport',
      description: 'Autorizație pentru servicii transfer aeroport',
      required: true,
      icon: 'license',
      category: 'transport',
      forServices: ['Aeroport'],
    });
  }

  // Tractări Auto - Towing service license
  if (activeServices.includes('Tractari')) {
    documents.push({
      id: 'towing_license',
      title: countryCode === 'ro' ? 'Atestat Tractare Auto' :
             countryCode === 'gb' ? 'Vehicle Recovery Licence' :
             countryCode === 'de' ? 'Abschleppgenehmigung' :
             countryCode === 'fr' ? 'Agrément Dépannage' :
             'Atestat Tractare Auto',
      description: 'Autorizație pentru servicii tractare și asistență rutieră',
      required: true,
      icon: 'vehicle',
      category: 'transport',
      forServices: ['Tractari'],
    });
  }

  // Mutări Mobilă - Furniture transport certification
  if (activeServices.includes('Mobila')) {
    documents.push({
      id: 'furniture_transport_cert',
      title: countryCode === 'ro' ? 'Atestat Transport Mobilier' :
             countryCode === 'gb' ? 'Removal Services Licence' :
             countryCode === 'de' ? 'Umzugslizenz' :
             'Atestat Transport Mobilier',
      description: 'Certificat pentru servicii de mutări și transport mobilier',
      required: false,
      icon: 'transport',
      category: 'transport',
      forServices: ['Mobila'],
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

  // CMR Insurance for international transport
  if (activeServices.some(s => ['Colete', 'Express', 'Fragil', 'Electronice'].includes(s))) {
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

// Icon helper
const getDocIcon = (iconType: string) => {
  const iconClass = "w-5 h-5";
  switch (iconType) {
    case 'id':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      );
    case 'license':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      );
    case 'company':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
        </svg>
      );
    case 'transport':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
        </svg>
      );
    case 'pet':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      );
    case 'vehicle':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
        </svg>
      );
    case 'insurance':
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      );
  }
};

export default function VerificarePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<CourierProfile | null>(null);
  const [activeServices, setActiveServices] = useState<string[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, UploadedDocument>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const profileDoc = await getDoc(doc(db, 'profil_curier', user.uid));
      if (profileDoc.exists()) {
        setProfile(profileDoc.data() as CourierProfile);
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setActiveServices(userDoc.data().serviciiOferite || []);
      }
    } catch (error) {
      logError(error);
    }
  }, [user]);

  const loadDocuments = useCallback(async () => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'profil_curier', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.documents) {
          const docs: Record<string, UploadedDocument> = {};
          Object.entries(data.documents).forEach(([key, value]: [string, unknown]) => {
            const docData = value as { 
              url: string; 
              fileName?: string; 
              name?: string; 
              uploadedAt?: { toDate: () => Date }; 
              status?: string; 
              rejectionReason?: string 
            };
            docs[key] = {
              url: docData.url,
              name: docData.fileName || docData.name || '',
              uploadedAt: docData.uploadedAt?.toDate() || new Date(),
              status: (docData.status as 'pending' | 'approved' | 'rejected') || 'pending',
              rejectionReason: docData.rejectionReason,
            };
          });
          setUploadedDocuments(docs);
        }
      }
    } catch (error) {
      logError(error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadDocuments();
    }
  }, [user, loadProfile, loadDocuments]);

  const handleFileUpload = async (docId: string, file: File) => {
    if (!user) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      showError('Format invalid. Doar PDF, JPG, JPEG sau PNG sunt permise.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('Fișierul este prea mare. Dimensiunea maximă este 10MB.');
      return;
    }

    setUploadingDoc(docId);
    setUploadProgress(0);

    try {
      // Create a reference to the file in Firebase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `courier_documents/${user.uid}/${docId}/${fileName}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      setUploadProgress(50);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUploadProgress(75);
      
      // Create document record
      const docRecord: UploadedDocument = {
        url: downloadURL,
        name: file.name,
        uploadedAt: new Date(),
        status: 'pending',
      };
      
      // Update local state
      setUploadedDocuments(prev => ({
        ...prev,
        [docId]: docRecord,
      }));
      
      // Save to Firestore
      const docRef = doc(db, 'profil_curier', user.uid);
      await setDoc(docRef, {
        documents: {
          [docId]: {
            url: downloadURL,
            fileName: file.name,
            uploadedAt: serverTimestamp(),
            status: 'pending',
          },
        },
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      setUploadProgress(100);
      showSuccess(`Document "${file.name}" încărcat cu succes!`);
    } catch (error) {
      logError(error);
      showError('Eroare la încărcarea documentului. Încearcă din nou.');
    } finally {
      setUploadingDoc(null);
      setUploadProgress(0);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  const documents = getDocumentRequirements(profile.taraSediu, activeServices, profile.tipBusiness);
  const requiredDocs = documents.filter(d => d.required);
  const optionalDocs = documents.filter(d => !d.required);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/curier" className="p-2 hover:bg-slate-800/80 rounded-xl">
              <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
            </Link>
            <div className="p-2.5 bg-linear-to-br from-green-500/20 to-green-500/20 rounded-xl border border-green-500/20">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">Verificare Documente</h1>
              <p className="text-xs sm:text-sm text-gray-400">Încarcă documentele necesare pentru verificare</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Info Section */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Informații importante</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Țara înregistrată: <span className="text-white">{profile.taraSediu}</span></p>
                <p>• Tip activitate: <span className="text-white">
                  {profile.tipBusiness === 'firma' ? '🏢 Firmă' : '👤 Persoană Fizică'}
                </span></p>
                {activeServices.length > 0 && (
                  <div>
                    <p className="mb-1">• Servicii active:</p>
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
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <p className="text-gray-400 text-sm mb-2">
              Documentele sunt afișate în funcție de tipul de activitate și serviciile activate.
            </p>
            <p className="text-gray-500 text-xs">
              Documentele cu <span className="text-red-400">*</span> sunt obligatorii.
            </p>
          </div>
        </div>

        {/* Required Documents */}
        {requiredDocs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              Documente Obligatorii ({requiredDocs.length})
            </h3>
            <div className="space-y-3">
              {requiredDocs.map((doc) => {
                const uploaded = uploadedDocuments[doc.id];
                const isUploading = uploadingDoc === doc.id;
                
                return (
                  <div key={doc.id} className={`bg-slate-800/40 backdrop-blur-xl rounded-xl border p-4 transition-colors ${
                    uploaded ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 hover:border-orange-500/50'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        doc.category === 'identity' ? 'bg-blue-500/20 text-blue-400' :
                        doc.category === 'company' ? 'bg-purple-500/20 text-purple-400' :
                        doc.category === 'transport' ? 'bg-green-500/20 text-green-400' :
                        doc.category === 'special' ? 'bg-pink-500/20 text-pink-400' :
                        doc.category === 'insurance' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-slate-700/50 text-gray-400'
                      }`}>
                        {getDocIcon(doc.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium mb-1 flex items-center gap-2">
                          {doc.title}
                          <span className="text-red-400 text-xs">*</span>
                          {doc.forServices && (
                            <span className="text-xs px-2 py-0.5 bg-slate-700 text-gray-400 rounded-full">
                              {doc.forServices.join(', ')}
                            </span>
                          )}
                        </h4>
                        <p className="text-gray-500 text-sm mb-3">{doc.description}</p>
                        
                        {isUploading && (
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                              <span className="text-xs text-orange-400">Se încarcă... {uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-1.5">
                              <div 
                                className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {uploaded ? (
                          <div className="flex items-center gap-3">
                            <a
                              href={uploaded.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Vezi
                            </a>
                            <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                              uploaded.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                              uploaded.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {uploaded.status === 'approved' ? '✓ Aprobat' :
                               uploaded.status === 'rejected' ? '✗ Respins' :
                               '⏱ În verificare'}
                            </div>
                          </div>
                        ) : (
                          <label className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg cursor-pointer transition-colors text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Încarcă document
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(doc.id, file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Optional Documents */}
        {optionalDocs.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Documente Opționale ({optionalDocs.length})
            </h3>
            <div className="space-y-3">
              {optionalDocs.map((doc) => {
                const uploaded = uploadedDocuments[doc.id];
                
                return (
                  <div key={doc.id} className={`bg-slate-800/40 backdrop-blur-xl rounded-xl border p-4 ${
                    uploaded ? 'border-emerald-500/50' : 'border-white/5'
                  }`}>
                    {/* Similar structure as required docs */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-slate-700/50 text-gray-400">
                        {getDocIcon(doc.icon)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{doc.title}</h4>
                        <p className="text-gray-500 text-sm mb-3">{doc.description}</p>
                        
                        {!uploaded && (
                          <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer transition-colors text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            Încarcă document
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(doc.id, file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
          <p className="text-blue-400 text-sm">
            <strong>💡 Verificare rapidă:</strong> Documentele sunt verificate în 24-48 ore. Vei primi notificare la aprobare.
          </p>
        </div>

        {/* Help Card */}
        <HelpCard />
      </div>
    </div>
  );
}
