'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { showSuccess, showError } from '@/lib/toast';
import { calculateNewRating } from '@/lib/rating';
import Link from 'next/link';

interface CourierProfile {
  nume: string;
  prenume: string;
  rating: number;
  reviewCount: number;
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const courierId = params.courierId as string;

  const [courier, setCourier] = useState<CourierProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    rating: 0,
    comment: ''
  });

  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    loadCourier();
  }, [courierId]);

  const loadCourier = async () => {
    try {
      const courierDoc = await getDoc(doc(db, 'profil_curier', courierId));
      
      if (!courierDoc.exists()) {
        showError(new Error('Curier invalid'));
        setLoading(false);
        return;
      }

      const data = courierDoc.data();
      setCourier({
        nume: data.nume || '',
        prenume: data.prenume || '',
        rating: data.rating || 5.0,
        reviewCount: data.reviewCount || 0
      });
    } catch (error) {
      console.error('Error loading courier:', error);
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName.trim()) {
      showError(new Error('Te rugăm să introduci numele tău'));
      return;
    }

    if (formData.rating === 0) {
      showError(new Error('Te rugăm să selectezi un rating'));
      return;
    }

    setSubmitting(true);

    try {
      // Add review to recenzii collection
      await addDoc(collection(db, 'recenzii'), {
        courierId,
        clientId: 'anonymous', // For public reviews, we don't have a clientId
        clientName: formData.clientName.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
        createdAt: serverTimestamp()
      });

      // Update courier rating in profil_curier
      const newRating = calculateNewRating(
        courier!.rating,
        courier!.reviewCount,
        formData.rating
      );

      await updateDoc(doc(db, 'profil_curier', courierId), {
        rating: newRating,
        reviewCount: courier!.reviewCount + 1
      });

      showSuccess('Recenzie trimisă cu succes! Mulțumim pentru feedback!');
      
      // Reset form
      setFormData({ clientName: '', rating: 0, comment: '' });
      
      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      showError(error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hoveredStar || formData.rating);
          return (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="transition-transform hover:scale-110"
            >
              <svg 
                className={`w-12 h-12 transition-colors ${
                  isActive 
                    ? 'text-amber-400 fill-amber-400' 
                    : 'text-gray-600 fill-transparent'
                }`}
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!courier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Curier invalid</h1>
          <p className="text-gray-400 mb-6">Link-ul de recenzie nu este valid</p>
          <Link href="/" className="btn-primary inline-block">
            Înapoi la pagina principală
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-white/5 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Înapoi
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/20">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Lasă o recenzie</h1>
            <p className="text-gray-400">
              pentru <span className="text-white font-semibold">{courier.prenume} {courier.nume}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="form-label">Numele tău</label>
              <input 
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Ex: Ion Popescu"
                className="form-input"
                required
                disabled={submitting}
              />
            </div>

            {/* Rating */}
            <div>
              <label className="form-label text-center block mb-4">
                Cum ai evalua serviciile?
              </label>
              {renderStars()}
              {formData.rating > 0 && (
                <p className="text-center text-gray-400 text-sm mt-3">
                  {formData.rating === 5 && 'Excelent! 🌟'}
                  {formData.rating === 4 && 'Foarte bine! 👍'}
                  {formData.rating === 3 && 'Bine 👌'}
                  {formData.rating === 2 && 'Satisfăcător'}
                  {formData.rating === 1 && 'Nesatisfăcător'}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="form-label">Comentariu (opțional)</label>
              <textarea 
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Spune-ne mai multe despre experiența ta..."
                className="form-input resize-none"
                rows={4}
                disabled={submitting}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || formData.rating === 0 || !formData.clientName.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="spinner w-5 h-5"></div>
                  Se trimite...
                </span>
              ) : (
                'Trimite recenzia'
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-500 text-center">
              Recenzia ta ajută alți utilizatori să ia decizii informate și îmbunătățește calitatea serviciilor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
