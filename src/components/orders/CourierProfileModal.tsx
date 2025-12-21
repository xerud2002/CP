'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ServiceIcon } from '@/components/icons/ServiceIcons';
import { serviceTypes } from '@/lib/constants';
import { getRatingClass, getRatingBgClass, formatRating } from '@/lib/rating';

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
  aniExperienta: number;
  profileImage?: string;
}

// Helper: Capitalize each word
const capitalize = (str: string) => 
  str?.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') || '';

// Helper: Get service label from constants
const getServiceLabel = (serviceId: string) => {
  const normalized = serviceId.toLowerCase();
  const service = serviceTypes.find(s => s.id === normalized || s.value.toLowerCase() === normalized);
  return service?.label || serviceId;
};

export default function CourierProfileModal({ courierId, companyName, onClose }: CourierProfileModalProps) {
  const [profile, setProfile] = useState<CourierProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data - parallelized queries
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Parallel fetch: profile, user, zones, reviews
        const [profilDoc, userDoc, zonesSnapshot, reviewsSnapshot] = await Promise.all([
          getDoc(doc(db, 'profil_curier', courierId)),
          getDoc(doc(db, 'users', courierId)),
          getDocs(query(collection(db, 'zona_acoperire'), where('uid', '==', courierId))),
          getDocs(query(collection(db, 'recenzii'), where('courierId', '==', courierId)))
        ]);

        const profilData = profilDoc.data();
        const userData = userDoc.data();

        // Process zones
        const zones = new Set<string>();
        zonesSnapshot.forEach(doc => {
          const { oras, judet, tara } = doc.data();
          if (oras && judet) zones.add(`${capitalize(oras)}, ${capitalize(judet)}`);
          else if (judet) zones.add(capitalize(judet));
          else if (oras) zones.add(capitalize(oras));
          else if (tara) zones.add(capitalize(tara));
        });

        // Calculate rating
        let totalRating = 0, reviewCount = 0;
        reviewsSnapshot.forEach(doc => {
          const rating = doc.data().rating;
          if (rating) { totalRating += rating; reviewCount++; }
        });

        // Calculate experience
        const createdAt = userData?.createdAt?.toDate() || profilData?.createdAt?.toDate();
        const yearsExp = createdAt 
          ? Math.floor((Date.now() - createdAt.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          : 0;

        setProfile({
          firma: profilData?.firma || profilData?.numeCompanie || companyName,
          descriere: profilData?.descriere || profilData?.bio || '',
          telefon: profilData?.telefon || userData?.telefon || '',
          email: userData?.email || '',
          verificat: userData?.verificat || profilData?.verificat || false,
          rating: reviewCount > 0 ? totalRating / reviewCount : 0,
          nrRecenzii: reviewCount,
          nrLivrari: profilData?.nrLivrari || userData?.nrLivrari || 0,
          serviciiOferite: userData?.serviciiOferite || profilData?.serviciiOferite || [],
          zoneAcoperire: [...zones],
          aniExperienta: yearsExp,
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

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // SSR guard
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-linear-to-br from-orange-500/20 to-amber-500/10 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Închide"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            {profile?.profileImage ? (
              <Image 
                src={profile.profileImage} 
                alt={profile.firma}
                width={64}
                height={64}
                className="w-16 h-16 rounded-xl object-cover shadow-lg border-2 border-orange-500/30"
                unoptimized
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">
                  {companyName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white truncate">{profile?.firma || companyName}</h2>
                {profile?.verificat && (
                  <div className="shrink-0 p-1 bg-emerald-500/20 rounded-full" title="Verificat">
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
              <div className="spinner" />
            </div>
          ) : profile ? (
            <div className="space-y-5">
              {/* Stats Row - Color-coded rating like daiostea.ro */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard 
                  icon={<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />}
                  iconColor={getRatingClass(profile.rating)}
                  value={formatRating(profile.rating)}
                  label={`${profile.nrRecenzii} recenzii`}
                  bgClass={getRatingBgClass(profile.rating)}
                  filled
                />
                <StatCard 
                  icon={<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  iconColor="text-emerald-400"
                  value={profile.nrLivrari}
                  label="Comenzi Finalizate"
                  filled
                />
              </div>

              {/* Description */}
              {profile.descriere && (
                <Section title="Despre companie">
                  <p className="text-gray-400 text-sm leading-relaxed">{profile.descriere}</p>
                </Section>
              )}

              {/* Services */}
              {profile.serviciiOferite.length > 0 && (
                <Section title="Servicii oferite">
                  <div className="flex flex-wrap gap-2">
                    {profile.serviciiOferite.map((service, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/70 rounded-lg border border-white/5">
                        <ServiceIcon service={service} className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-300 text-xs">{getServiceLabel(service)}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Coverage Zones */}
              {profile.zoneAcoperire.length > 0 && (
                <Section title="Zone de acoperire">
                  <div className="flex flex-wrap gap-2">
                    {profile.zoneAcoperire.slice(0, 8).map((zone, i) => (
                      <span key={i} className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                        {zone}
                      </span>
                    ))}
                    {profile.zoneAcoperire.length > 8 && (
                      <span className="px-2.5 py-1 bg-slate-700/50 text-gray-400 text-xs rounded-full">
                        +{profile.zoneAcoperire.length - 8} altele
                      </span>
                    )}
                  </div>
                </Section>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-8">Nu s-au putut încărca informațiile</p>
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

// Sub-components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-300 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function StatCard({ icon, iconColor, value, label, filled, bgClass }: { 
  icon: React.ReactNode; 
  iconColor: string; 
  value: string | number; 
  label: string;
  filled?: boolean;
  bgClass?: string;
}) {
  return (
    <div className={`rounded-xl p-3 text-center border ${bgClass || 'bg-slate-800/50 border-white/5'}`}>
      <div className="flex items-center justify-center gap-1 mb-1">
        <svg className={`w-4 h-4 ${iconColor}`} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 20 20" stroke={filled ? undefined : 'currentColor'}>
          {icon}
        </svg>
        <span className="text-white font-bold">{value}</span>
      </div>
      <p className="text-gray-500 text-xs">{label}</p>
    </div>
  );
}
