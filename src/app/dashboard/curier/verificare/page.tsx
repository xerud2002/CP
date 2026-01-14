'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, deleteField } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ArrowLeftIcon, CheckCircleIcon } from '@/components/icons/DashboardIcons';
import { showSuccess, showError } from '@/lib/toast';
import { showConfirm } from '@/components/ui/ConfirmModal';
import { logError } from '@/lib/errorMessages';
import { CourierProfile } from '@/types';
import { serviceTypes } from '@/lib/constants';
import { ServiceIcon } from '@/components/icons/ServiceIcons';

import { getDocumentRequirements } from '@/utils/documentRequirements';

// Category colors helper for document requirement cards
const getCategoryColors = (category: string): string => {
  switch (category) {
    case 'identity':
      return 'bg-blue-500/20 text-blue-400';
    case 'company':
      return 'bg-purple-500/20 text-purple-400';
    case 'transport':
      return 'bg-orange-500/20 text-orange-400';
    case 'special':
      return 'bg-emerald-500/20 text-emerald-400';
    default:
      return 'bg-slate-500/20 text-slate-400';
  }
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

// Type for uploaded document status
interface UploadedDocument {
  url: string;
  name: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

// Allowed file types for document upload
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function VerificarePageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<CourierProfile | null>(null);
  const [activeServices, setActiveServices] = useState<string[]>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<Record<string, UploadedDocument>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [savingServices, setSavingServices] = useState(false);

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

  // Toggle service selection and save to Firebase
  const toggleService = async (serviceValue: string) => {
    if (!user) return;
    
    const normalizedService = serviceValue.toLowerCase();
    const isCurrentlySelected = activeServices.includes(normalizedService);
    
    // Prevent deselecting services with approved documents
    if (isCurrentlySelected && isServiceLocked(serviceValue)) {
      showError('Nu poți dezactiva acest serviciu deoarece ai documente verificate pentru el');
      return;
    }
    
    setSavingServices(true);
    const newServices = isCurrentlySelected
      ? activeServices.filter(s => s !== normalizedService)
      : [...activeServices, normalizedService];
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { serviciiOferite: newServices });
      setActiveServices(newServices);
      showSuccess('Servicii actualizate!');
    } catch (error) {
      logError(error);
      showError('Eroare la actualizarea serviciilor');
    } finally {
      setSavingServices(false);
    }
  };

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

  const handleFileUpload = useCallback(async (docId: string, file: File) => {
    if (!user) return;

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      showError('Format invalid. Doar PDF, JPG, JPEG sau PNG sunt permise.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
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
  }, [user]);

  // Memoize documents calculation BEFORE any early returns
  const documents = useMemo(
    () => profile ? getDocumentRequirements(profile.tara_sediu || 'RO', activeServices, profile.tipBusiness || 'pf') : [],
    [profile, activeServices]
  );
  const requiredDocs = useMemo(() => documents.filter(d => d.required), [documents]);
  
  // Filter optional documents to show only those for active services OR approved documents
  const optionalDocs = useMemo(() => {
    return documents.filter(d => {
      if (d.required) return false; // Skip required docs
      
      // Always show if document is already approved (verified)
      const uploaded = uploadedDocuments[d.id];
      if (uploaded && uploaded.status === 'approved') return true;
      
      // If document has no specific services, show it
      if (!d.forServices || d.forServices.length === 0) return true;
      
      // Show only if at least one of its services is active
      return d.forServices.some(service => 
        activeServices.includes(service.toLowerCase())
      );
    });
  }, [documents, activeServices, uploadedDocuments]);

  // Check if a service has approved documents (cannot be deselected)
  const isServiceLocked = useCallback((serviceId: string) => {
    const normalizedService = serviceId.toLowerCase();
    // Check if any approved document is required for this service
    return Object.entries(uploadedDocuments).some(([docId, docData]) => {
      if (docData.status !== 'approved') return false;
      // Find the document requirement
      const docReq = documents.find(d => d.id === docId);
      if (!docReq || !docReq.forServices) return false;
      // Check if this service is in the document's service list
      return docReq.forServices.some(s => s.toLowerCase() === normalizedService);
    });
  }, [uploadedDocuments, documents]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-white/5 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/curier" className="p-2 hover:bg-slate-800/80 rounded-xl">
              <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
            </Link>
            <div className="p-2.5 bg-gradient-to-br from-green-500/20 to-green-500/20 rounded-xl border border-green-500/20">
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
        {/* Why Verification is Important */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30 shrink-0">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">De ce este important să îți verifici contul?</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Contul verificat îți oferă <span className="text-green-400 font-semibold">acces prioritar la comenzi</span> și crește încrederea clienților din toată Europa. 
                Curierii verificați sunt afișați primii în căutări și primesc <span className="text-green-400 font-semibold">mai multe solicitări de transport</span>. 
                Cu cât documentele tale sunt la zi, cu atât mai rapid vei putea accepta comenzi și dezvolta afacerea ta pe platformă.
              </p>
            </div>
          </div>
        </div>

        {/* Services Selection Section */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/5 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Servicii Active</h3>
              <p className="text-sm text-gray-400">Selectează serviciile pe care le oferi pentru a vedea documentele necesare</p>
            </div>
            <div className="text-sm text-gray-400">
              {activeServices.length} / {serviceTypes.length} active
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {serviceTypes.map((service) => {
              const normalizedValue = service.id.toLowerCase();
              const isLocked = isServiceLocked(service.id);
              const isSelected = activeServices.includes(normalizedValue) || isLocked;
              
              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  disabled={savingServices || isLocked}
                  className={`group relative p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? `${service.bgColor} ${service.color.replace('text-', 'border-')} border-opacity-50`
                      : 'bg-slate-700/30 border-white/5 hover:border-white/20'
                  } ${
                    isLocked ? 'opacity-75 cursor-not-allowed' : 'disabled:opacity-50'
                  }`}
                  title={isLocked ? 'Serviciu blocat - ai documente verificate' : ''}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? service.bgColor : 'bg-slate-600/50'}`}>
                      <ServiceIcon service={service.id} className={`w-5 h-5 ${isSelected ? service.color : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {service.label}
                      </h4>
                      <p className="text-xs text-gray-500">{service.description}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className={`w-5 h-5 rounded-full ${service.bgColor} flex items-center justify-center`}>
                          <svg className={`w-3 h-3 ${service.color}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {isLocked && (
                      <div className="absolute bottom-2 right-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center" title="Blocat - documente verificate">
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Verification Status */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/5 p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Verified Count */}
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-emerald-400 font-bold text-xl">
                  {Object.values(uploadedDocuments).filter(d => d.status === 'approved').length}
                </p>
                <p className="text-gray-400 text-xs">Verificate</p>
              </div>
            </div>

            {/* Pending Count */}
            <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-amber-400 font-bold text-xl">
                  {Object.values(uploadedDocuments).filter(d => d.status === 'pending').length}
                </p>
                <p className="text-gray-400 text-xs">În așteptare</p>
              </div>
            </div>

            {/* Total Required */}
            <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl border border-white/5">
              <div className="p-2 bg-slate-600/50 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-xl">{requiredDocs.length}</p>
                <p className="text-gray-400 text-xs">Obligatorii</p>
              </div>
            </div>
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
              {requiredDocs.map((docReq) => {
                const uploaded = uploadedDocuments[docReq.id];
                const isUploading = uploadingDoc === docReq.id;
                const isApproved = uploaded?.status === 'approved';
                
                // Show simplified card for approved documents
                if (isApproved) {
                  return (
                    <div key={docReq.id} className="bg-emerald-500/10 backdrop-blur-xl rounded-xl border border-emerald-500/30 p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-emerald-400 font-medium flex items-center gap-2">
                            {docReq.title}
                            <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                              ✓ Verificat
                            </span>
                          </h4>
                          <p className="text-gray-500 text-sm mt-0.5">Document aprobat de administrator</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={docReq.id} className={`bg-slate-800/40 backdrop-blur-xl rounded-xl border p-4 transition-colors relative ${
                    uploaded ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 hover:border-orange-500/50'
                  }`}>
                    {/* Action buttons - top right */}
                    {uploaded && uploaded.status !== 'approved' && (
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <a
                          href={uploaded.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Vezi document"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        <button
                          onClick={async () => {
                            if (!user) return;
                            const confirmed = await showConfirm({
                              title: 'Șterge document',
                              message: 'Ești sigur că vrei să ștergi acest document? Va trebui re-încărcat.',
                              confirmText: 'Șterge',
                              cancelText: 'Anulează',
                              variant: 'warning'
                            });
                            if (confirmed) {
                              try {
                                const docRef = doc(db, 'profil_curier', user.uid);
                                await setDoc(docRef, {
                                  documents: {
                                    [docReq.id]: deleteField()
                                  }
                                }, { merge: true });
                                
                                setUploadedDocuments(prev => {
                                  const newDocs = { ...prev };
                                  delete newDocs[docReq.id];
                                  return newDocs;
                                });
                                
                                showSuccess('Document șters cu succes!');
                              } catch (error) {
                                logError(error);
                                showError('Eroare la ștergerea documentului.');
                              }
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Șterge document"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getCategoryColors(docReq.category)}`}>
                        {getDocIcon(docReq.icon)}
                      </div>
                      <div className="flex-1 min-w-0 pr-20">
                        <h4 className="text-white font-medium mb-1 flex items-center gap-2">
                          {docReq.title}
                          <span className="text-red-400 text-xs">*</span>
                          {docReq.forServices && (
                            <span className="text-xs px-2 py-0.5 bg-slate-700 text-gray-400 rounded-full">
                              {docReq.forServices.join(', ')}
                            </span>
                          )}
                        </h4>
                        <p className="text-gray-500 text-sm mb-3">{docReq.description}</p>
                        
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
                          <div>
                            <div className="flex items-center gap-3">
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
                            <p className="text-xs text-gray-500 mt-2">
                              📎 {uploaded.name} • {uploaded.uploadedAt.toLocaleDateString('ro-RO')}
                            </p>
                            {uploaded.status !== 'approved' && (
                              <p className="text-xs text-yellow-500/80 mt-1">
                                💡 Dacă link-ul nu funcționează, apasă &quot;Șterge&quot; și re-încarcă documentul
                              </p>
                            )}
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
                                if (file) handleFileUpload(docReq.id, file);
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
              {optionalDocs.map((docReq) => {
                const uploaded = uploadedDocuments[docReq.id];
                const isApproved = uploaded?.status === 'approved';
                
                // Show simplified card for approved documents
                if (isApproved) {
                  return (
                    <div key={docReq.id} className="bg-emerald-500/10 backdrop-blur-xl rounded-xl border border-emerald-500/30 p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-emerald-400 font-medium flex items-center gap-2">
                            {docReq.title}
                            <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                              ✓ Verificat
                            </span>
                          </h4>
                          <p className="text-gray-500 text-sm mt-0.5">Document aprobat de administrator</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={docReq.id} className={`bg-slate-800/40 backdrop-blur-xl rounded-xl border p-4 relative ${
                    uploaded ? 'border-emerald-500/50' : 'border-white/5'
                  }`}>
                    {/* Action buttons - top right */}
                    {uploaded && uploaded.status !== 'approved' && (
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <a
                          href={uploaded.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="Vezi document"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        <button
                          onClick={async () => {
                            if (!user) return;
                            const confirmed = await showConfirm({
                              title: 'Șterge document',
                              message: 'Ești sigur că vrei să ștergi acest document? Va trebui re-încărcat.',
                              confirmText: 'Șterge',
                              cancelText: 'Anulează',
                              variant: 'warning'
                            });
                            if (confirmed) {
                              try {
                                const docRef = doc(db, 'profil_curier', user.uid);
                                await setDoc(docRef, {
                                  documents: {
                                    [docReq.id]: deleteField()
                                  }
                                }, { merge: true });
                                
                                setUploadedDocuments(prev => {
                                  const newDocs = { ...prev };
                                  delete newDocs[docReq.id];
                                  return newDocs;
                                });
                                
                                showSuccess('Document șters cu succes!');
                              } catch (error) {
                                logError(error);
                                showError('Eroare la ștergerea documentului.');
                              }
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Șterge document"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                    {/* Similar structure as required docs */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-slate-700/50 text-gray-400">
                        {getDocIcon(docReq.icon)}
                      </div>
                      <div className="flex-1 pr-20">
                        <h4 className="text-white font-medium mb-1">{docReq.title}</h4>
                        <p className="text-gray-500 text-sm mb-3">{docReq.description}</p>
                        
                        {uploaded ? (
                          <div>
                            <div className="flex items-center gap-3">
                              {/* Status badge */}
                              {uploaded.status && (
                                <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                                  uploaded.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                  uploaded.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {uploaded.status === 'approved' ? '✓ Aprobat' :
                                   uploaded.status === 'rejected' ? '✗ Respins' :
                                   '⏱ În verificare'}
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              📎 Document încărcat • {uploaded.uploadedAt.toLocaleDateString('ro-RO')}
                            </p>
                            {uploaded.status !== 'approved' && (
                              <p className="text-xs text-yellow-500/80 mt-1">
                                💡 Dacă link-ul nu funcționează, apasă &quot;Șterge&quot; și re-încarcă documentul
                              </p>
                            )}
                          </div>
                        ) : (
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
                                if (file) handleFileUpload(docReq.id, file);
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
      </div>
    </div>
  );
}

export default function VerificarePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    }>
      <VerificarePageContent />
    </Suspense>
  );
}
