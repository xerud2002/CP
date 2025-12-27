'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { countries, judetByCountry } from '@/lib/constants';
import { getOraseForRegion } from '@/lib/cities';
import { getNextOrderNumber } from '@/utils/orderHelpers';
import { showSuccess, showError } from '@/lib/toast';
import TransportDetailsStep from './components/steps/TransportDetailsStep';
import OptionsReviewStep from './components/steps/OptionsReviewStep';
import LocationsStep from './components/steps/LocationsStep';

// Servicii disponibile cu iconițe SVG (identice cu homepage)
const servicii = [
  { 
    id: 'colete', 
    name: 'Colete', 
    description: 'Colete și pachete standard',
    color: 'from-blue-500 to-blue-600',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
  },
  { 
    id: 'plicuri', 
    name: 'Plicuri/Documente', 
    description: 'Documente și plicuri urgente',
    color: 'from-yellow-400 to-yellow-500',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  { 
    id: 'persoane', 
    name: 'Persoane', 
    description: 'Pasageri - călătorii în Europa',
    color: 'from-pink-500 to-pink-600',
    icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
  },
  { 
    id: 'electronice', 
    name: 'Electronice', 
    description: 'Echipamente electronice fragile',
    color: 'from-purple-500 to-purple-600',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  { 
    id: 'animale', 
    name: 'Animale', 
    description: 'Transport animale de companie',
    color: 'from-green-500 to-green-600',
    icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 512 512"><path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/></svg>
  },
  { 
    id: 'platforma', 
    name: 'Platformă', 
    description: 'Vehicule și echipamente grele',
    color: 'from-red-500 to-red-600',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="2" y="16" width="20" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 16V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="8" cy="20" r="1" /><circle cx="16" cy="20" r="1" /><path d="M12 16V4" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 7h6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  { 
    id: 'tractari', 
    name: 'Tractări Auto', 
    description: 'Tractări și asistență rutieră',
    color: 'from-orange-500 to-orange-600',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M5 17h-2a1 1 0 0 1-1-1v-5l3-3h14l3 3v5a1 1 0 0 1-1 1h-2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round" /><path d="m9 17 6-6" strokeLinecap="round" strokeLinejoin="round" /><path d="m15 11 4 4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="17" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  { 
    id: 'mobila', 
    name: 'Mobilă', 
    description: 'Mobilier și obiecte voluminoase',
    color: 'from-amber-500 to-amber-600',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 18v2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 18v2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 4v9" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  { 
    id: 'paleti', 
    name: 'Paleți', 
    description: 'Transport paleți și marfă paletizată',
    color: 'from-cyan-500 to-cyan-600',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 12h18" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 18h18" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 6v12" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 6v12" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 6v12" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
];

// Opțiuni suplimentare specifice pentru fiecare serviciu
const optiuniSuplimentareByService: Record<string, Array<{id: string, name: string, price: string, description: string}>> = {
  'colete': [
    { id: 'asigurare', name: 'Asigurare Transport', price: 'variabil', description: 'Asigurare conform valorii mărfii' },
    { id: 'frigo', name: 'Frigo', price: 'variabil', description: 'Transport frigorific pentru produse care necesită temperatură controlată' },
  ],
  'plicuri': [
    { id: 'asigurare', name: 'Asigurare Transport', price: 'variabil', description: 'Asigurare conform valorii documentelor' },
  ],
  'persoane': [
    { id: 'asigurare', name: 'Asigurare Transport', price: 'variabil', description: 'Asigurare pasageri' },
    { id: 'bagaje_extra', name: 'Bagaje Extra', price: 'variabil', description: 'Transport bagaje suplimentare' },
    { id: 'animale', name: 'Transport Animale', price: 'variabil', description: 'Transport animale de companie în timpul călătoriei' },
  ],
  'electronice': [
    { id: 'asigurare', name: 'Asigurare Transport', price: 'variabil', description: 'Asigurare conform valorii mărfii' },
    { id: 'ambalare_speciala', name: 'Ambalare Specială', price: 'variabil', description: 'Ambalare profesională pentru echipamente fragile' },
  ],
  'animale': [
    { id: 'asigurare', name: 'Asigurare Transport', price: 'variabil', description: 'Asigurare pentru animale de companie' },
    { id: 'cusca_transport', name: 'Cușcă Transport', price: 'variabil', description: 'Cușcă profesională de transport' },
  ],
  'platforma': [
    { id: 'asigurare', name: 'Asigurare Transport', price: 'variabil', description: 'Asigurare conform valorii vehiculului/echipamentului' },
  ],
  'tractari': [
    { id: 'asigurare', name: 'Asigurare Transport', price: 'variabil', description: 'Asigurare conform valorii vehiculului' },
  ],
  'mobila': [
    { id: 'asigurare', name: 'Asigurare Transport', price: 'variabil', description: 'Asigurare conform valorii mobilierului' },
    { id: 'montaj_demontaj', name: 'Montaj/Demontaj', price: 'variabil', description: 'Servicii de demontaj și montaj mobilier' },
    { id: 'ambalare', name: 'Ambalare Mobilier', price: 'variabil', description: 'Ambalare profesională pentru protecție maximă' },
  ],
  'paleti': [
    { id: 'asigurare', name: 'Asigurare Transport', price: 'variabil', description: 'Asigurare conform valorii mărfii' },
    { id: 'frigo', name: 'Frigo', price: 'variabil', description: 'Transport frigorific pentru produse care necesită temperatură controlată' },
  ],
};

function ComandaForm() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviciu = searchParams?.get('serviciu');

  // Protecție - redirectează dacă nu este autentificat sau nu este client
  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

  // Form state
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(serviciu || '');
  const [formData, setFormData] = useState({
    // Date personale
    nume: '',
    email: '',
    telefon: '',
    
    // Locații
    tara_ridicare: 'RO',
    judet_ridicare: '',
    oras_ridicare: '',
    localitate_ridicare: '',
    adresa_ridicare: '',
    
    tara_livrare: 'GB',
    judet_livrare: '',
    oras_livrare: '',
    localitate_livrare: '',
    adresa_livrare: '',
    
    // Detalii transport
    greutate: '',
    lungime: '',
    latime: '',
    inaltime: '',
    cantitate: '1',
    descriere: '',
    
    // Câmpuri specifice serviciu
    tip_animal: '',           // Animale
    tip_vehicul: '',          // Platformă, Tractări
    stare_vehicul: '',        // Platformă
    motiv_tractare: '',       // Tractări
    roti_functionale: '',     // Tractări
    numar_inmatriculare: '',  // Tractări, Platformă
    
    // Date ridicare/livrare - sistem simplificat
    tip_programare: 'data_specifica', // 'data_specifica' | 'range' | 'flexibil'
    data_ridicare: '',
    data_ridicare_end: '', // pentru range
    
    // Opțiuni
    optiuni: [] as string[],
    tip_ofertanti: [] as string[], // 'firme' | 'persoane_private'
    
    // Note
    observatii: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Încarcă datele din localStorage la mount
  useEffect(() => {
    try {
      const savedStep = localStorage.getItem('comanda_step');
      const savedService = localStorage.getItem('comanda_service');
      const savedFormData = localStorage.getItem('comanda_formData');

      if (savedStep) setStep(parseInt(savedStep));
      if (savedService && !serviciu) setSelectedService(savedService);
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        setFormData(prev => ({ ...prev, ...parsedData }));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, [serviciu]);

  // Resetează câmpuri specifice serviciului când se schimbă serviciul
  useEffect(() => {
    // Nu reseta dacă este încărcarea inițială sau dacă nu există serviciu selectat
    if (selectedService && step > 1) {
      setFormData(prev => ({
        ...prev,
        // Resetează câmpuri specifice serviciului
        tip_animal: '',
        tip_vehicul: '',
        stare_vehicul: '',
        motiv_tractare: '',
        roti_functionale: '',
        greutate: '',
        lungime: '',
        latime: '',
        inaltime: '',
        cantitate: '1',
        descriere: '',
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService]);

  // Salvează step și service în localStorage
  useEffect(() => {
    try {
      localStorage.setItem('comanda_step', step.toString());
      localStorage.setItem('comanda_service', selectedService);
    } catch (error) {
      console.error('Error saving step/service to localStorage:', error);
    }
  }, [step, selectedService]);

  // Salvează formData în localStorage (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('comanda_formData', JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving formData to localStorage:', error);
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Auto-fill pentru utilizatori autentificați
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nume: user.displayName || user.nume || '',
        email: user.email || '',
        telefon: user.telefon || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOptionToggle = (optionId: string) => {
    setFormData(prev => ({
      ...prev,
      optiuni: prev.optiuni.includes(optionId)
        ? prev.optiuni.filter(id => id !== optionId)
        : [...prev.optiuni, optionId]
    }));
  };

  const handleOfertantiToggle = (tip: string) => {
    setFormData(prev => ({
      ...prev,
      tip_ofertanti: prev.tip_ofertanti.includes(tip)
        ? prev.tip_ofertanti.filter(t => t !== tip)
        : [...prev.tip_ofertanti, tip]
    }));
  };

  const validateStep = useCallback((currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!selectedService) newErrors.serviciu = 'Selectează un serviciu';
    }

    if (currentStep === 2) {
      if (!formData.nume) newErrors.nume = 'Numele este obligatoriu';
      if (!formData.email) newErrors.email = 'Email-ul este obligatoriu';
      if (!formData.telefon) newErrors.telefon = 'Telefonul este obligatoriu';
    }

    if (currentStep === 3) {
      if (!formData.judet_ridicare) newErrors.judet_ridicare = 'Selectează județul/regiunea';
      // Trebuie să aibă fie oraș, fie localitate
      if (!formData.oras_ridicare && !formData.localitate_ridicare) {
        newErrors.locatie_ridicare = 'Selectează un oraș sau introdu o localitate';
      }
      
      if (!formData.judet_livrare) newErrors.judet_livrare = 'Selectează județul/regiunea';
      // Trebuie să aibă fie oraș, fie localitate
      if (!formData.oras_livrare && !formData.localitate_livrare) {
        newErrors.locatie_livrare = 'Selectează un oraș sau introdu o localitate';
      }
    }

    if (currentStep === 4) {
      // Validare greutate doar pentru colete și paleți
      if (selectedService === 'colete' || selectedService === 'paleti') {
        if (!formData.greutate) newErrors.greutate = 'Greutatea este obligatorie';
        if (!formData.descriere) newErrors.descriere = 'Descrierea este obligatorie';
      }
      
      // Validare descriere obligatorie pentru mașini (detalii vehicul)
      if (selectedService === 'masini') {
        if (!formData.descriere) newErrors.descriere = 'Detaliile vehiculului sunt obligatorii';
      }
      
      // Validare pentru tractări - tip vehicul și detalii obligatorii
      if (selectedService === 'tractari') {
        if (!formData.tip_vehicul) newErrors.tip_vehicul = 'Selectează tipul vehiculului';
        if (!formData.descriere) newErrors.descriere = 'Detaliile vehiculului și situației sunt obligatorii';
      }
      
      // Validare pentru mobilă - descriere obligatorie
      if (selectedService === 'mobila') {
        if (!formData.descriere) newErrors.descriere = 'Descrierea mobilierului este obligatorie';
      }
      
      // Validare data - obligatorie pentru toate serviciile
      if (!formData.data_ridicare) newErrors.data_ridicare = 'Selectează data ridicării';
      if (formData.tip_programare === 'range') {
        if (!formData.data_ridicare) newErrors.data_ridicare = 'Selectează data de start';
        if (!formData.data_ridicare_end) newErrors.data_ridicare_end = 'Selectează data de final';
        if (formData.data_ridicare && formData.data_ridicare_end && formData.data_ridicare > formData.data_ridicare_end) {
          newErrors.data_ridicare_end = 'Data finală trebuie să fie după data de start';
        }
      }
      // Pentru 'flexibil' nu sunt necesare validări de date
    }

    if (currentStep === 5) {
      // Validare pentru tipul de ofertanți
      if (formData.tip_ofertanti.length === 0) {
        newErrors.tip_ofertanti = 'Selectează cel puțin un tip de transportator';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedService, formData]);

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    const newStep = Math.max(step - 1, 1);
    
    // Dacă se merge înapoi la Pasul 1 (selectare serviciu), resetează serviciul selectat
    if (newStep === 1) {
      setSelectedService('');
    }
    
    setStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;

    setSubmitting(true);

    try {
      // CREATE new order
      const orderNumber = await getNextOrderNumber();
      
      const orderData = {
        uid_client: user?.uid || 'guest',
        serviciu: selectedService,
        orderNumber,
        ...formData,
        status: 'noua',
        createdAt: serverTimestamp(),
        timestamp: Date.now(),
      };

      await addDoc(collection(db, 'comenzi'), orderData);
      showSuccess('Comanda a fost trimisă cu succes! Vei primi oferte de la parteneri în 24-48 ore.');
      
      // Curăță localStorage
      try {
        localStorage.removeItem('comanda_step');
        localStorage.removeItem('comanda_service');
        localStorage.removeItem('comanda_formData');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
      
      // Redirect imediat la dashboard
      setTimeout(() => {
        if (user) {
          router.push('/dashboard/client/comenzi');
        } else {
          router.push('/');
        }
      }, 1000);
    } catch (error) {
      console.error('Error submitting order:', error);
      showError(error);
    } finally {
      setSubmitting(false);
    }
  }, [step, user, selectedService, formData, router, validateStep]);

  // Memoized judet lists
  const judetRidicareList = useMemo(
    () => judetByCountry[formData.tara_ridicare] || [],
    [formData.tara_ridicare]
  );
  
  const judetLivrareList = useMemo(
    () => judetByCountry[formData.tara_livrare] || [],
    [formData.tara_livrare]
  );

  // Memoized city lists
  const oraseRidicareList = useMemo(
    () => getOraseForRegion(formData.tara_ridicare, formData.judet_ridicare),
    [formData.tara_ridicare, formData.judet_ridicare]
  );

  const oraseLivrareList = useMemo(
    () => getOraseForRegion(formData.tara_livrare, formData.judet_livrare),
    [formData.tara_livrare, formData.judet_livrare]
  );

  // Memoized country names for summary display
  const ridicareCountryName = useMemo(
    () => countries.find(c => c.code === formData.tara_ridicare)?.name || formData.tara_ridicare,
    [formData.tara_ridicare]
  );

  const livrareCountryName = useMemo(
    () => countries.find(c => c.code === formData.tara_livrare)?.name || formData.tara_livrare,
    [formData.tara_livrare]
  );

  // Loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl shadow-black/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white">
                    Comandă Transport
                    {selectedService && (
                      <span className="ml-2 text-orange-400">
                        • {servicii.find(s => s.id === selectedService)?.name || selectedService}
                      </span>
                    )}
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Completează detaliile comenzii tale
                  </p>
                </div>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-medium text-gray-400">Pas <span className="text-white">{step}</span>/5</span>
              <div className="w-20 sm:w-32 h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-linear-to-r from-orange-500 via-amber-500 to-green-500 transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Selectare Serviciu */}
          {step === 1 && (
            <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Alege serviciul</h2>
                  <p className="text-gray-400 text-sm">Ce vrei să transporti?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {servicii.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service.id)}
                    className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                      selectedService === service.id
                        ? 'border-orange-500 bg-linear-to-br from-orange-500/20 to-amber-500/10 shadow-lg shadow-orange-500/20'
                        : 'border-white/10 hover:border-white/20 bg-slate-700/40 hover:bg-slate-700/60'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${service.color} flex items-center justify-center mb-3 text-white shadow-lg transition-transform group-hover:scale-110`}>
                      {service.icon}
                    </div>
                    <h3 className="font-bold text-white mb-1.5 group-hover:text-orange-400 transition-colors">{service.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{service.description}</p>
                    {selectedService === service.id && (
                      <div className="absolute top-3 right-3">
                        <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {errors.serviciu && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-400 text-sm font-medium">{errors.serviciu}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date Personale */}
          {step === 2 && (
            <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Datele tale de contact</h2>
                  <p className="text-gray-400 text-sm">Cum te putem contacta?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nume complet *</label>
                  <input
                    type="text"
                    name="nume"
                    value={formData.nume}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="Ion Popescu"
                  />
                  {errors.nume && <p className="text-red-400 text-sm mt-1">{errors.nume}</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      placeholder="ion@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Telefon *</label>
                    <input
                      type="tel"
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      placeholder="+40 712 345 678"
                    />
                    {errors.telefon && <p className="text-red-400 text-sm mt-1">{errors.telefon}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Locații */}
          {step === 3 && (
            <LocationsStep
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              errors={errors}
              judetRidicareList={judetRidicareList}
              judetLivrareList={judetLivrareList}
              oraseRidicareList={oraseRidicareList}
              oraseLivrareList={oraseLivrareList}
            />
          )}

          {/* Step 4: Detalii Transport */}
          {step === 4 && (
            <TransportDetailsStep
              selectedService={selectedService}
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          )}

          {/* Step 5: Opțiuni Suplimentare și Revizuire */}
          {step === 5 && (
            <OptionsReviewStep
              selectedService={selectedService}
              formData={formData}
              handleOfertantiToggle={handleOfertantiToggle}
              handleOptionToggle={handleOptionToggle}
              ridicareCountryName={ridicareCountryName}
              livrareCountryName={livrareCountryName}
              currentServiceInfo={servicii.find(s => s.id === selectedService)}
              serviceOptions={optiuniSuplimentareByService[selectedService] || []}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-slate-700/80 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Înapoi</span>
              </button>
            )}
            
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 hover:scale-[1.02] active:scale-95"
              >
                <span>Continuă</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 shadow-xl shadow-green-500/40 hover:shadow-green-500/60 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Se trimite...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Trimite comanda</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default function ComandaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    }>
      <ComandaForm />
    </Suspense>
  );
}
