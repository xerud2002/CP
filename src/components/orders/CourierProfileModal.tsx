'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { serviceTypes } from '@/lib/constants';

interface CourierProfileModalProps {
  courierId: string;
  companyName: string;
  onClose: () => void;
}

interface CourierProfile {
  firma: string;
  descriere: string;
  telefon: string;
  email: string;
  verificat: boolean;
  rating: number;
  nrRecenzii: number;
  nrLivrari: number;
  serviciiOferite: string[];
  zoneAcoperire: string[];
  dataInregistrare: Date | null;
  aniExperienta: number;
  profileImage?: string;
}

export default function CourierProfileModal({ courierId, companyName, onClose }: CourierProfileModalProps) {
  const [profile, setProfile] = useState<CourierProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get courier profile
        const profilDoc = await getDoc(doc(db, 'profil_curier', courierId));
        const profilData = profilDoc.data();

        // Get user data
        const userDoc = await getDoc(doc(db, 'users', courierId));
        const userData = userDoc.data();

        // Get coverage zones
        const zonesQuery = query(
          collection(db, 'zona_acoperire'),
          where('uid', '==', courierId)
        );
        const zonesSnapshot = await getDocs(zonesQuery);
        const zones: string[] = [];
        zonesSnapshot.forEach(doc => {
          const data = doc.data();
          // Build zone string: "Oras, Judet" or just "Judet" if no oras
          const capitalize = (str: string) => str ? str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : '';
          const oras = data.oras ? capitalize(data.oras) : '';
          const judet = data.judet ? capitalize(data.judet) : '';
          
          if (oras && judet) {
            zones.push(`${oras}, ${judet}`);
          } else if (judet) {
            zones.push(judet);
          } else if (oras) {
            zones.push(oras);
          } else if (data.tara) {
            zones.push(capitalize(data.tara));
          }
        });
        const uniqueZones = [...new Set(zones)];

        // Get reviews count and average
        const reviewsQuery = query(
          collection(db, 'recenzii'),
          where('courierId', '==', courierId)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        let totalRating = 0;
        let reviewCount = 0;
        reviewsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.rating) {
            totalRating += data.rating;
            reviewCount++;
          }
        });
        const avgRating = reviewCount > 0 ? totalRating / reviewCount : 0;

        // Calculate years of experience
        const createdAt = userData?.createdAt?.toDate() || profilData?.createdAt?.toDate();
        const yearsExperience = createdAt 
          ? Math.floor((Date.now() - createdAt.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : 0;

        setProfile({
          firma: profilData?.firma || profilData?.numeCompanie || companyName,
          descriere: profilData?.descriere || profilData?.bio || '',
          telefon: profilData?.telefon || userData?.telefon || '',
          email: userData?.email || '',
          verificat: userData?.verificat || profilData?.verificat || false,
          rating: avgRating,
          nrRecenzii: reviewCount,
          nrLivrari: profilData?.nrLivrari || userData?.nrLivrari || 0,
          serviciiOferite: userData?.serviciiOferite || profilData?.serviciiOferite || [],
          zoneAcoperire: uniqueZones,
          dataInregistrare: createdAt,
          aniExperienta: yearsExperience,
          profileImage: profilData?.profileImage || profilData?.logo || profilData?.logoUrl
        });
      } catch (error) {
        console.error('Error fetching courier profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [courierId, companyName]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const getServiceLabel = (serviceId: string) => {
    const service = serviceTypes.find(s => 
      s.id.toLowerCase() === serviceId.toLowerCase() || 
      s.value.toLowerCase() === serviceId.toLowerCase()
    );
    return service?.label || serviceId;
  };

  // Use portal to render modal at document body level
  if (typeof window === 'undefined') return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-linear-to-br from-orange-500/20 to-amber-500/10 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            {profile?.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt={profile?.firma || companyName}
                className="w-16 h-16 rounded-xl object-cover shadow-lg border-2 border-orange-500/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {companyName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{profile?.firma || companyName}</h2>
                {profile?.verificat && (
                  <div className="p-1 bg-emerald-500/20 rounded-full" title="Verificat">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm">Companie de curierat</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="spinner"></div>
            </div>
          ) : profile ? (
            <div className="space-y-5">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                {/* Rating */}
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white font-bold">{profile.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{profile.nrRecenzii} recenzii</p>
                </div>

                {/* Deliveries */}
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-white font-bold">{profile.nrLivrari}</span>
                  </div>
                  <p className="text-gray-500 text-xs">livrări</p>
                </div>

                {/* Experience */}
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white font-bold">{profile.aniExperienta < 1 ? '<1' : profile.aniExperienta}</span>
                  </div>
                  <p className="text-gray-500 text-xs">{profile.aniExperienta === 1 ? 'an' : 'ani'}</p>
                </div>
              </div>

              {/* Description */}
              {profile.descriere && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Despre companie</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{profile.descriere}</p>
                </div>
              )}

              {/* Services */}
              {profile.serviciiOferite.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Servicii oferite</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.serviciiOferite.map((service, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/70 rounded-lg border border-white/5"
                      >
                        <ServiceIcon service={service} className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-300 text-xs">{getServiceLabel(service)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coverage Zones */}
              {profile.zoneAcoperire.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Zone de acoperire</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.zoneAcoperire.slice(0, 8).map((zone, index) => (
                      <span 
                        key={index}
                        className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20"
                      >
                        {zone}
                      </span>
                    ))}
                    {profile.zoneAcoperire.length > 8 && (
                      <span className="px-2.5 py-1 bg-slate-700/50 text-gray-400 text-xs rounded-full">
                        +{profile.zoneAcoperire.length - 8} altele
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Nu s-au putut încărca informațiile</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-800/30">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
          >
            Închide
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
