'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeftIcon } from '@/components/icons/DashboardIcons';
import { showSuccess } from '@/lib/toast';
import { logError } from '@/lib/errorMessages';
import { getRatingClass } from '@/lib/rating';

// Types
interface Review {
  id: string;
  clientId: string;
  clientName: string;
  courierId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Star Icon Component (filled)
const StarIcon = ({ filled = true, className = "" }: { filled?: boolean; className?: string }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 20 20" stroke={filled ? "none" : "currentColor"}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function RecenziiPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [rating, setRating] = useState(5.0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Load rating and reviews
  useEffect(() => {
    const loadReviewsData = async () => {
      if (!user) return;
      
      try {
        // Get rating from profile
        const profilRef = doc(db, 'profil_curier', user.uid);
        const profilSnap = await getDoc(profilRef);
        
        if (profilSnap.exists()) {
          const profilData = profilSnap.data();
          setRating(profilData.rating !== undefined ? profilData.rating : 5.0);
          setReviewCount(profilData.reviewCount !== undefined ? profilData.reviewCount : 0);
        }

        // Load reviews from recenzii collection
        const reviewsQuery = query(
          collection(db, 'recenzii'),
          where('courierId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const reviewsData: Review[] = [];
        
        for (const docSnap of reviewsSnapshot.docs) {
          const data = docSnap.data();
          
          // Get client name if not in review
          let clientName = data.clientName || 'Client';
          if (!data.clientName && data.clientId) {
            try {
              const clientRef = doc(db, 'users', data.clientId);
              const clientSnap = await getDoc(clientRef);
              if (clientSnap.exists()) {
                const clientData = clientSnap.data();
                clientName = clientData.displayName || clientData.nume || clientData.email?.split('@')[0] || 'Client';
              }
            } catch (err) {
              console.error('Error loading client name:', err);
            }
          }
          
          reviewsData.push({
            id: docSnap.id,
            clientId: data.clientId,
            clientName: clientName,
            courierId: data.courierId,
            orderId: data.orderId,
            rating: data.rating,
            comment: data.comment,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        }
        
        setReviews(reviewsData);
      } catch (error) {
        logError(error);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (user) {
      loadReviewsData();
    }
  }, [user]);

  // Helper function to render stars with color-coding (daiostea.ro style)
  const renderStars = (rating: number, size: string = 'w-5 h-5') => {
    const stars = [];
    const colorClass = getRatingClass(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          filled={i <= rating}
          className={`${size} ${i <= rating ? colorClass : 'text-gray-600'}`}
        />
      );
    }
    return stars;
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading || loadingReviews) {
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
            <Link href="/dashboard/curier" className="p-2 hover:bg-slate-800/80 rounded-xl transition-colors">
              <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
            </Link>
            <div className="p-2.5 bg-linear-to-br from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/20">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">Recenzii</h1>
              <p className="text-xs sm:text-sm text-gray-400">Feedback-ul clienților tăi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Rating Overview */}
        <div className="bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left: Large Rating Display */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-end gap-3">
                <span className="text-6xl font-bold text-white">{rating.toFixed(1)}</span>
                <div className="pb-2">
                  <div className="flex gap-1 mb-1">
                    {renderStars(rating, 'w-6 h-6')}
                  </div>
                  <p className="text-sm text-gray-400">{reviewCount} {reviewCount === 1 ? 'recenzie' : 'recenzii'}</p>
                </div>
              </div>
            </div>

            {/* Right: Quick Share */}
            <div className="flex-1 max-w-md w-full">
              <div className="bg-slate-900/40 rounded-xl p-4 border border-white/5">
                <label className="text-xs font-medium text-gray-400 mb-2 block">Link-ul tău de recenzie</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={`curierul-perfect.vercel.app/review/${user?.uid || ''}`}
                    className="form-input flex-1 text-sm"
                    readOnly
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://curierul-perfect.vercel.app/review/${user?.uid || ''}`);
                      showSuccess('Link copiat!');
                    }}
                    className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors shrink-0"
                    title="Copiază link"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Trimite acest link clienților pentru a primi recenzii
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Toate recenziile
            </h2>
            {reviews.length > 0 && (
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-full border border-blue-500/30">
                {reviews.length}
              </span>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/20">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg mb-2 font-medium">Nu ai recenzii încă</p>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Primele recenzii vor apărea după finalizarea comenzilor și evaluarea de către clienți. Trimite link-ul tău de recenzie pentru a primi feedback.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Client info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {review.clientName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{review.clientName}</p>
                        <p className="text-gray-500 text-xs">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    
                    {/* Right: Stars */}
                    <div className="flex gap-0.5 shrink-0">
                      {renderStars(review.rating, 'w-4 h-4')}
                    </div>
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-300 text-sm leading-relaxed mt-3 pl-13">
                      &quot;{review.comment}&quot;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
