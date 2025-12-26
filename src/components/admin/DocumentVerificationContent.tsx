'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError } from '@/lib/toast';
import { showConfirm } from '@/components/ui/ConfirmModal';

// Required documents that must be approved for courier verification
const REQUIRED_DOCUMENTS = ['id_card', 'company_registration', 'pf_authorization'];

interface UploadedDocument {
  url: string;
  name: string;
  uploadedAt: Date | { toDate: () => Date };
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

interface CourierDocuments {
  uid: string;
  nume: string;
  denumire_firma?: string;
  telefon: string;
  email?: string;
  documents: Record<string, UploadedDocument>;
  services: string[];
}

export default function DocumentVerificationContent() {
  const [couriers, setCouriers] = useState<CourierDocuments[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedCourier, setSelectedCourier] = useState<CourierDocuments | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDocKey, setSelectedDocKey] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load filter status from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('adminDocFilterStatus');
    if (saved === 'all' || saved === 'pending' || saved === 'approved' || saved === 'rejected') {
      setFilterStatus(saved);
    }
    // Mark as initialized after loading from localStorage
    setIsInitialized(true);
  }, []);

  // Persist filter status to localStorage when it changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('adminDocFilterStatus', filterStatus);
  }, [filterStatus, isInitialized]);

  useEffect(() => {
    loadCouriers();
  }, []);

  const loadCouriers = async () => {
    setLoading(true);
    try {
      const couriersSnapshot = await getDocs(collection(db, 'profil_curier'));
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      const usersMap = new Map();
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === 'curier') {
          usersMap.set(doc.id, {
            email: data.email,
            telefon: data.telefon,
            services: data.serviciiOferite || []
          });
        }
      });

      const couriersData: CourierDocuments[] = [];
      couriersSnapshot.forEach((doc) => {
        const data = doc.data();
        const userData = usersMap.get(doc.id);
        
        if (data.documents && Object.keys(data.documents).length > 0) {
          couriersData.push({
            uid: doc.id,
            nume: data.nume || 'Fără nume',
            denumire_firma: data.denumire_firma,
            telefon: data.telefon || userData?.telefon || 'N/A',
            email: userData?.email || 'N/A',
            documents: data.documents,
            services: userData?.services || []
          });
        }
      });

      setCouriers(couriersData);
    } catch (error) {
      console.error('Error loading couriers:', error);
      showError('Eroare la încărcarea curierilor');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDocument = async (courierId: string, docKey: string) => {
    const confirmed = await showConfirm({
      title: 'Aprobă document',
      message: 'Ești sigur că vrei să aprobi acest document?',
      confirmText: 'Aprobă',
      cancelText: 'Anulează'
    });

    if (!confirmed) return;

    try {
      const docRef = doc(db, 'profil_curier', courierId);
      await updateDoc(docRef, {
        [`documents.${docKey}.status`]: 'approved',
        [`documents.${docKey}.approvedAt`]: new Date(),
        [`documents.${docKey}.rejectionReason`]: null
      });
      
      // Check if all required documents are now approved
      const courierDoc = await getDoc(docRef);
      if (courierDoc.exists()) {
        const courierData = courierDoc.data();
        const documents = courierData.documents || {};
        
        // Get which required docs this courier has uploaded
        const uploadedRequiredDocs = REQUIRED_DOCUMENTS.filter(reqDoc => documents[reqDoc]);
        
        // Check if all uploaded required docs are approved
        const allRequiredApproved = uploadedRequiredDocs.length > 0 && 
          uploadedRequiredDocs.every(reqDoc => documents[reqDoc]?.status === 'approved');
        
        if (allRequiredApproved) {
          // Update user verification status
          const userRef = doc(db, 'users', courierId);
          await updateDoc(userRef, {
            verified: true,
            verifiedAt: serverTimestamp()
          });
          
          // Also update courier profile
          await updateDoc(docRef, {
            verificationStatus: 'verified',
            verifiedAt: serverTimestamp()
          });
          
          showSuccess('Document aprobat! Curierul a fost marcat ca VERIFICAT ✓');
        } else {
          showSuccess('Document aprobat!');
        }
      } else {
        showSuccess('Document aprobat!');
      }
      
      loadCouriers();
    } catch (error) {
      console.error('Error approving document:', error);
      showError('Eroare la aprobarea documentului');
    }
  };

  const handleRejectDocument = async (courierId: string, docKey: string) => {
    setSelectedCourier(couriers.find(c => c.uid === courierId) || null);
    setSelectedDocKey(docKey);
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      showError('Introdu un motiv pentru respingere');
      return;
    }

    if (!selectedCourier) return;

    try {
      const docRef = doc(db, 'profil_curier', selectedCourier.uid);
      await updateDoc(docRef, {
        [`documents.${selectedDocKey}.status`]: 'rejected',
        [`documents.${selectedDocKey}.rejectedAt`]: new Date(),
        [`documents.${selectedDocKey}.rejectionReason`]: rejectionReason
      });
      showSuccess('Document respins!');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedDocKey('');
      setSelectedCourier(null);
      loadCouriers();
    } catch (error) {
      console.error('Error rejecting document:', error);
      showError('Eroare la respingerea documentului');
    }
  };

  const getDocumentLabel = (docKey: string): string => {
    // Map document IDs to Romanian labels
    const docLabels: Record<string, string> = {
      'id_card': 'Carte de Identitate / Pașaport',
      'company_registration': 'Certificat Înregistrare Firmă',
      'pf_authorization': 'Autorizație PF',
      'animal_transport': 'Certificat Transport Animale',
      'person_transport': 'Licență Transport Persoane',
      'vehicle_towing': 'Atestat Tractare Auto',
      'furniture_transport': 'Atestat Transport Mobilier',
      'cmr_insurance': 'Asigurare CMR',
      'cold_chain': 'Certificat Lanț de Frig',
    };
    return docLabels[docKey] || docKey;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobat';
      case 'rejected':
        return 'Respins';
      default:
        return 'În așteptare';
    }
  };

  const filteredCouriers = couriers.filter(courier => {
    if (filterStatus === 'all') return true;
    return Object.values(courier.documents).some(doc => doc.status === filterStatus);
  });

  const getPendingCount = (courier: CourierDocuments) => {
    return Object.values(courier.documents).filter(doc => doc.status === 'pending').length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Verificare Documente Curieri</h2>
          <p className="text-gray-400 mt-1">
            {filteredCouriers.length} {filteredCouriers.length === 1 ? 'curier' : 'curieri'} cu documente
          </p>
        </div>
        
        {/* Filter tabs */}
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
              }`}
            >
              {status === 'all' ? 'Toate' : status === 'pending' ? 'În așteptare' : status === 'approved' ? 'Aprobate' : 'Respinse'}
            </button>
          ))}
        </div>
      </div>

      {/* Couriers list */}
      {filteredCouriers.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-white/5">
          <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400">Nu sunt documente de verificat</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCouriers.map((courier) => {
            const pendingCount = getPendingCount(courier);
            
            return (
              <div key={courier.uid} className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
                {/* Courier header */}
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      {courier.denumire_firma && (
                        <p className="text-sm font-medium text-orange-400 mb-0.5">{courier.denumire_firma}</p>
                      )}
                      <h3 className="text-lg font-semibold text-white">{courier.nume}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span>{courier.email}</span>
                        <span>•</span>
                        <span>{courier.telefon}</span>
                        {pendingCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400 font-medium">
                              {pendingCount} {pendingCount === 1 ? 'document în așteptare' : 'documente în așteptare'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents grid */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(courier.documents).map(([docKey, doc]) => (
                    <div key={docKey} className="bg-slate-700/30 rounded-lg p-4 border border-white/5 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h4 className="text-sm font-medium text-white leading-tight">{getDocumentLabel(docKey)}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium border shrink-0 ${getStatusColor(doc.status)}`}>
                          {getStatusText(doc.status)}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-400 mb-3 flex-1">
                        <p className="truncate" title={doc.name}>Fișier: <span className="text-gray-300">{doc.name || '-'}</span></p>
                        <p>
                          Încărcat:{' '}
                          <span className="text-gray-300">
                          {doc.uploadedAt && typeof doc.uploadedAt === 'object' && 'toDate' in doc.uploadedAt 
                            ? new Date(doc.uploadedAt.toDate()).toLocaleDateString('ro-RO') 
                            : doc.uploadedAt instanceof Date 
                              ? doc.uploadedAt.toLocaleDateString('ro-RO')
                              : 'N/A'}
                          </span>
                        </p>
                        {doc.rejectionReason && (
                          <p className="text-red-400 mt-2">
                            Motiv respingere: {doc.rejectionReason}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-all text-center"
                        >
                          Vezi
                        </a>
                        {doc.status !== 'approved' && (
                          <button
                            onClick={() => handleApproveDocument(courier.uid, docKey)}
                            className="flex-1 px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium transition-all"
                          >
                            Aprobă
                          </button>
                        )}
                        {doc.status !== 'rejected' && (
                          <button
                            onClick={() => handleRejectDocument(courier.uid, docKey)}
                            className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-all"
                          >
                            Respinge
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-white/10 max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">Respinge Document</h3>
            <p className="text-gray-400 mb-4">
              Introdu motivul pentru respingerea documentului. Curierul va trebui să încarce un document nou.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ex: Documentul este expirat / Imaginea este neclară / etc."
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedDocKey('');
                  setSelectedCourier(null);
                }}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
              >
                Anulează
              </button>
              <button
                onClick={submitRejection}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
              >
                Respinge Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
