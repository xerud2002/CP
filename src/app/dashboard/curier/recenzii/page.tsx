'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowLeftIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import { showSuccess, showWarning } from '@/lib/toast';
import { logError } from '@/lib/errorMessages';
import { getRatingClass, getRatingBgClass, formatRating, ratingColors } from '@/lib/rating';
import RatingCard from '@/components/RatingCard';

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

// Chat Icon Component
const ChatIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

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
        
        reviewsSnapshot.forEach((doc) => {
          const data = doc.data();
          reviewsData.push({
            id: doc.id,
            clientId: data.clientId,
            clientName: data.clientName || 'Client',
            courierId: data.courierId,
            orderId: data.orderId,
            rating: data.rating,
            comment: data.comment,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });
        
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
            <div className="p-2.5 bg-linear-to-br from-blue-500/20 to-blue-500/20 rounded-xl border border-blue-500/20">
              <ChatIcon />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">Recenzii</h1>
              <p className="text-xs sm:text-sm text-gray-400">Feedback-ul clienților tăi</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Rating Overview - DOS Style */}
        <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <RatingCard 
              rating={rating}
              reviewCount={reviewCount}
              size="lg"
            />

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg mb-2">Impactul recenziilor</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Un rating ridicat îți <span className="text-cyan-400 font-semibold">crește vizibilitatea</span> în platformă și 
                atrage mai mulți clienți. Recenziile pozitive confirmă calitatea serviciilor tale și îți construiesc 
                <span className="text-cyan-400 font-semibold"> reputația</span> în comunitatea CurierulPerfect.
              </p>
            </div>
          </div>
        </div>

        {/* Request Review Options */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Invite via Email */}
          <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 shrink-0">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Invită prin Email</h3>
                <p className="text-gray-400 text-sm">Trimite invitație de recenzie clienților tăi prin email</p>
              </div>
            </div>
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); showWarning('Funcție în curs de dezvoltare'); }}>
              <div>
                <label className="form-label">Email client</label>
                <input 
                  type="email" 
                  placeholder="client@example.com"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="form-label">Mesaj personalizat (opțional)</label>
                <textarea 
                  placeholder="Adaugă un mesaj personal..."
                  className="form-input resize-none"
                  rows={3}
                />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Trimite invitație
              </button>
            </form>
          </div>

          {/* Request Review Link */}
          <div className="bg-linear-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-xl rounded-2xl border border-orange-500/30 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30 shrink-0">
                <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Link de recenzie</h3>
                <p className="text-gray-400 text-sm">Generează link unic pentru a solicita recenzii</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="form-label">Link-ul tău de recenzie</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={`https://curierul-perfect.vercel.app/review/${user?.uid || ''}`}
                    className="form-input flex-1"
                    readOnly
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://curierul-perfect.vercel.app/review/${user?.uid || ''}`);
                      showSuccess('Link copiat în clipboard!');
                    }}
                    className="btn-outline-orange shrink-0"
                    title="Copiază link"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="bg-slate-900/40 rounded-lg p-4 border border-orange-500/20">
                <p className="text-gray-400 text-xs leading-relaxed">
                  💡 <span className="font-semibold">Sfat:</span> Trimite acest link clienților tăi prin SMS, WhatsApp sau alte platforme pentru a-i încuraja să lase o recenzie.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/5 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ChatIcon />
            </div>
            Toate recenziile
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <ChatIcon />
              </div>
              <p className="text-gray-400 text-lg mb-2">Nu ai recenzii încă</p>
              <p className="text-gray-500 text-sm">
                Primele recenzii vor apărea după finalizarea comenzilor și evaluarea de către clienți.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-5 border border-white/5 hover:border-blue-500/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-semibold">
                        {review.clientName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{review.clientName}</p>
                        <p className="text-gray-500 text-xs">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    {/* Color-coded star rating */}
                    <div className="flex gap-1">
                      {renderStars(review.rating, 'w-4 h-4 sm:w-5 sm:h-5')}
                    </div>
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-300 text-sm leading-relaxed pl-13">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Card */}
        <HelpCard />
      </div>
    </div>
  );
}
