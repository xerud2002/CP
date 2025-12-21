'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatOrderNumber } from '@/utils/orderHelpers';
import { ArrowLeftIcon, StarIcon, CheckCircleIcon, UserIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';

interface Review {
  id: string;
  orderId: string;
  courierId: string;
  courierName: string;
  rating: number;
  comment: string;
  createdAt: Date | { seconds: number; nanoseconds: number } | null;
  serviciu: string;
}

interface Order {
  id: string;
  orderNumber?: number;
  serviciu: string;
  status: string;
  courierName?: string;
  courierId?: string;
}

function RecenziiClientContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('orderId');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadReviews();
      loadCompletedOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-select order from URL param and open review form
  useEffect(() => {
    if (orderIdFromUrl && completedOrders.length > 0 && !showReviewForm) {
      const order = completedOrders.find(o => o.id === orderIdFromUrl);
      if (order) {
        setSelectedOrder(order);
        setShowReviewForm(true);
      }
    }
  }, [orderIdFromUrl, completedOrders, showReviewForm]);

  // Auto-select order from URL param
  useEffect(() => {
    if (orderIdFromUrl && completedOrders.length > 0 && !showReviewForm) {
      const order = completedOrders.find(o => o.id === orderIdFromUrl);
      if (order) {
        setSelectedOrder(order);
        setShowReviewForm(true);
      }
    }
  }, [orderIdFromUrl, completedOrders, showReviewForm]);

  const loadReviews = async () => {
    if (!user) return;
    
    setLoadingReviews(true);
    try {
      const q = query(
        collection(db, 'recenzii'),
        where('clientId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const reviewsData: Review[] = [];
      snapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const loadCompletedOrders = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'comenzi'),
        where('uid_client', '==', user.uid),
        where('status', '==', 'livrata')
      );
      
      const snapshot = await getDocs(q);
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        const order = { id: doc.id, ...doc.data() } as Order;
        // Check if already reviewed
        const alreadyReviewed = reviews.some(r => r.orderId === order.id);
        if (!alreadyReviewed && order.courierId) {
          ordersData.push(order);
        }
      });
      setCompletedOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const updateCourierRating = async (courierId: string) => {
    try {
      // Get all reviews for this courier
      const reviewsQuery = query(
        collection(db, 'recenzii'),
        where('courierId', '==', courierId)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      
      if (reviewsSnapshot.empty) return;

      // Calculate average rating
      let totalRating = 0;
      let count = 0;
      reviewsSnapshot.forEach((doc) => {
        const reviewData = doc.data();
        totalRating += reviewData.rating || 0;
        count++;
      });

      const averageRating = totalRating / count;

      // Update courier profile
      const courierProfileRef = doc(db, 'profil_curier', courierId);
      await updateDoc(courierProfileRef, {
        rating: averageRating,
        reviewCount: count
      });
    } catch (error) {
      console.error('Error updating courier rating:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedOrder) return;

    setSubmitting(true);
    setMessage('');

    try {
      // Get client name
      const clientName = user.displayName || user.nume || user.email?.split('@')[0] || 'Client';

      await addDoc(collection(db, 'recenzii'), {
        clientId: user.uid,
        clientName: clientName,
        orderId: selectedOrder.id,
        courierId: selectedOrder.courierId,
        courierName: selectedOrder.courierName || 'Curier',
        rating,
        comment,
        serviciu: selectedOrder.serviciu,
        createdAt: serverTimestamp(),
      });

      // Update courier rating
      if (selectedOrder.courierId) {
        await updateCourierRating(selectedOrder.courierId);
      }
      
      setMessage('✅ Recenzie trimisă cu succes!');
      setShowReviewForm(false);
      setSelectedOrder(null);
      setRating(5);
      setComment('');
      loadReviews();
      loadCompletedOrders();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage('❌ Eroare la trimiterea recenziei.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href="/dashboard/client" 
                className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white">Recenziile Tale</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Evaluează serviciile</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-violet-500/20 text-violet-400 font-medium border border-violet-500/30">
                {reviews.length} {reviews.length === 1 ? 'recenzie' : 'recenzii'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <StarIcon className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{averageRating}</p>
                <p className="text-xs text-gray-500">Rating mediu</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{reviews.length}</p>
                <p className="text-xs text-gray-500">Recenzii date</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{completedOrders.length}</p>
                <p className="text-xs text-gray-500">De evaluat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders to Review */}
        {completedOrders.length > 0 && !showReviewForm && (
          <div className="bg-linear-to-br from-orange-500/20 to-yellow-500/20 rounded-xl border border-orange-500/20 p-4 sm:p-6 mb-6">
            <h3 className="text-white font-semibold mb-3">Comenzi finalizate - lasă o recenzie</h3>
            <div className="space-y-2">
              {completedOrders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{order.serviciu}</p>
                    <p className="text-xs text-gray-500">Comandă #{formatOrderNumber(order.orderNumber || order.id)}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowReviewForm(true);
                    }}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    Evaluează
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && selectedOrder && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Lasă o recenzie</h2>
              <button
                onClick={() => {
                  setShowReviewForm(false);
                  setSelectedOrder(null);
                  setRating(5);
                  setComment('');
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Comandă: {selectedOrder.serviciu}
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-all ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Comentariu</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="Descrie experiența ta cu curierul..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  submitting
                    ? 'bg-violet-500/50 text-violet-200 cursor-not-allowed'
                    : 'bg-violet-500 hover:bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  <>
                    <StarIcon className="w-5 h-5" />
                    Trimite Recenzia
                  </>
                )}
              </button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm ${
                message.includes('✅')
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {message}
              </div>
            )}
          </div>
        )}

        {/* Reviews List */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recenziile Tale</h2>
          
          {loadingReviews ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Se încarcă recenziile...</p>
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400 mb-2">Nu ai lăsat nicio recenzie încă</p>
              <p className="text-gray-500 text-sm">Recenziile tale vor apărea aici după ce evaluezi serviciile</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div 
                  key={review.id}
                  className="bg-slate-700/30 rounded-xl border border-white/5 p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{review.courierName}</p>
                      <p className="text-xs text-gray-500">{review.serviciu}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= review.rating ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                  <p className="text-xs text-gray-500">
                    {review.createdAt ? (
                      review.createdAt instanceof Date 
                        ? review.createdAt.toLocaleDateString('ro-RO')
                        : new Date(review.createdAt.seconds * 1000).toLocaleDateString('ro-RO')
                    ) : 'Recent'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </main>
    </div>
  );
}

export default function RecenziiClientPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    }>
      <RecenziiClientContent />
    </Suspense>
  );
}
