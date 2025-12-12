'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { countries, judetByCountry } from '@/lib/constants';

// Servicii disponibile cu iconițe SVG (identice cu homepage)
const servicii = [
  { 
    id: 'colete', 
    name: 'Transport Colete', 
    description: 'Colete și pachete standard',
    color: 'from-blue-500 to-cyan-500',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
  },
  { 
    id: 'plicuri', 
    name: 'Transport Plicuri/Documente', 
    description: 'Documente și plicuri urgente',
    color: 'from-yellow-500 to-orange-500',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  { 
    id: 'mobila', 
    name: 'Transport Mobilă', 
    description: 'Mobilier și obiecte voluminoase',
    color: 'from-amber-500 to-orange-500',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0Z" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 18v2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 18v2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 4v9" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  { 
    id: 'electronice', 
    name: 'Transport Electronice', 
    description: 'Echipamente electronice fragile',
    color: 'from-purple-500 to-pink-500',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" /><line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  { 
    id: 'animale', 
    name: 'Transport Animale', 
    description: 'Transport animale de companie',
    color: 'from-pink-500 to-rose-500',
    icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm3.5-2c-.83 0-1.5.67-1.5 1.5S8.67 7 9.5 7s1.5-.67 1.5-1.5S10.33 4 9.5 4zm5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-2.5 9c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
  },
  { 
    id: 'persoane', 
    name: 'Transport Persoane', 
    description: 'Pasageri - călătorii în Europa',
    color: 'from-rose-500 to-pink-500',
    icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
  },
  { 
    id: 'aeroport', 
    name: 'Transport Aeroport', 
    description: 'Transfer la/de la aeroport',
    color: 'from-cyan-500 to-blue-500',
    icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
  },
  { 
    id: 'platforma', 
    name: 'Transport cu Platformă', 
    description: 'Vehicule și echipamente grele',
    color: 'from-red-500 to-orange-500',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><rect x="2" y="16" width="20" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 16V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="8" cy="20" r="1" /><circle cx="16" cy="20" r="1" /><path d="M12 16V4" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 7h6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
  { 
    id: 'tractari', 
    name: 'Tractări Auto', 
    description: 'Tractări și asistență rutieră',
    color: 'from-orange-500 to-red-500',
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path d="M5 17h-2a1 1 0 0 1-1-1v-5l3-3h14l3 3v5a1 1 0 0 1-1 1h-2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round" /><path d="m9 17 6-6" strokeLinecap="round" strokeLinejoin="round" /><path d="m15 11 4 4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="17" cy="17" r="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  },
];

// Opțiuni suplimentare
const optiuniSuplimentare = [
  { id: 'asigurare', name: 'Asigurare Transport', price: 'variabil', description: 'Asigurare conform valorii mărfii' },
  { id: 'standard', name: 'Serviciu Standard', price: '', description: 'Deplasare pe ruta curierului pentru predare/ridicare colet' },
  { id: 'door_to_door', name: 'Serviciu Door to Door', price: '100+ RON', description: 'Ridicare și livrare la ușă' },
  { id: 'urgenta', name: 'Livrare Urgentă', price: '+30%', description: 'Livrare în max 24-48h' },
  { id: 'weekend', name: 'Livrare Weekend', price: '+20%', description: 'Ridicare/livrare sâmbătă-duminică' },
];

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
    adresa_ridicare: '',
    
    tara_livrare: 'GB',
    judet_livrare: '',
    oras_livrare: '',
    adresa_livrare: '',
    
    // Detalii transport
    greutate: '',
    lungime: '',
    latime: '',
    inaltime: '',
    cantitate: '1',
    valoare_marfa: '',
    descriere: '',
    
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
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calendar state pentru data_specifica
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Calendar state pentru range start
  const [isCalendarStartOpen, setIsCalendarStartOpen] = useState(false);
  const [calendarStartMonth, setCalendarStartMonth] = useState(new Date().getMonth());
  const [calendarStartYear, setCalendarStartYear] = useState(new Date().getFullYear());
  const calendarStartRef = useRef<HTMLDivElement>(null);

  // Calendar state pentru range end
  const [isCalendarEndOpen, setIsCalendarEndOpen] = useState(false);
  const [calendarEndMonth, setCalendarEndMonth] = useState(new Date().getMonth());
  const [calendarEndYear, setCalendarEndYear] = useState(new Date().getFullYear());
  const calendarEndRef = useRef<HTMLDivElement>(null);

  const monthNames = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
  const dayNames = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (calendarStartRef.current && !calendarStartRef.current.contains(event.target as Node)) {
        setIsCalendarStartOpen(false);
      }
      if (calendarEndRef.current && !calendarEndRef.current.contains(event.target as Node)) {
        setIsCalendarEndOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Salvează datele în localStorage la fiecare modificare
  useEffect(() => {
    try {
      localStorage.setItem('comanda_step', step.toString());
      localStorage.setItem('comanda_service', selectedService);
      localStorage.setItem('comanda_formData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [step, selectedService, formData]);

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

  // Calendar helper functions
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const isDateDisabled = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(calendarYear, calendarMonth, day);
    const formattedValue = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, data_ridicare: formattedValue }));
    setIsCalendarOpen(false);
  };

  const handleDateStartSelect = (day: number) => {
    const date = new Date(calendarStartYear, calendarStartMonth, day);
    const formattedValue = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, data_ridicare: formattedValue }));
    setIsCalendarStartOpen(false);
  };

  const handleDateEndSelect = (day: number) => {
    const date = new Date(calendarEndYear, calendarEndMonth, day);
    const formattedValue = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, data_ridicare_end: formattedValue }));
    setIsCalendarEndOpen(false);
  };

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

  const validateStep = (currentStep: number): boolean => {
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
      if (!formData.oras_ridicare) newErrors.oras_ridicare = 'Orașul este obligatoriu';
      if (!formData.adresa_ridicare) newErrors.adresa_ridicare = 'Adresa este obligatorie';
      
      if (!formData.judet_livrare) newErrors.judet_livrare = 'Selectează județul/regiunea';
      if (!formData.oras_livrare) newErrors.oras_livrare = 'Orașul este obligatoriu';
      if (!formData.adresa_livrare) newErrors.adresa_livrare = 'Adresa este obligatorie';
    }

    if (currentStep === 4) {
      if (selectedService !== 'persoane' && selectedService !== 'aeroport') {
        if (!formData.greutate) newErrors.greutate = 'Greutatea este obligatorie';
        if (!formData.descriere) newErrors.descriere = 'Descrierea este obligatorie';
      }
      
      // Validare în funcție de tipul de programare
      if (formData.tip_programare === 'data_specifica') {
        if (!formData.data_ridicare) newErrors.data_ridicare = 'Selectează data ridicării';
      }
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
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;

    setSubmitting(true);
    setMessage('');

    try {
      const orderData = {
        uid_client: user?.uid || 'guest',
        serviciu: selectedService,
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
        timestamp: Date.now(),
      };

      await addDoc(collection(db, 'comenzi'), orderData);
      
      setMessage('✅ Comanda a fost trimisă cu succes! Vei primi oferte de la parteneri în 24-48 ore.');
      
      // Resetează formularul și localStorage
      setStep(1);
      setSelectedService('');
      setFormData({
        nume: '',
        email: '',
        telefon: '',
        tara_ridicare: 'RO',
        judet_ridicare: '',
        oras_ridicare: '',
        adresa_ridicare: '',
        tara_livrare: 'GB',
        judet_livrare: '',
        oras_livrare: '',
        adresa_livrare: '',
        greutate: '',
        lungime: '',
        latime: '',
        inaltime: '',
        cantitate: '1',
        valoare_marfa: '',
        descriere: '',
        tip_programare: 'data_specifica',
        data_ridicare: '',
        data_ridicare_end: '',
        optiuni: [],
        tip_ofertanti: [],
        observatii: '',
      });
      
      // Curăță localStorage
      try {
        localStorage.removeItem('comanda_step');
        localStorage.removeItem('comanda_service');
        localStorage.removeItem('comanda_formData');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
      
      // Redirect după 3 secunde
      setTimeout(() => {
        if (user) {
          router.push('/dashboard/client');
        } else {
          router.push('/');
        }
      }, 3000);
    } catch (error) {
      console.error('❌ Error submitting order:', error);
      setMessage('❌ Eroare la trimiterea comenzii. Te rugăm să încerci din nou.');
    } finally {
      setSubmitting(false);
    }
  };

  const judetRidicareList = judetByCountry[formData.tara_ridicare] || [];
  const judetLivrareList = judetByCountry[formData.tara_livrare] || [];

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
                  <h1 className="text-lg sm:text-xl font-bold text-white">Comandă Transport</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Completează detaliile comenzii tale</p>
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
            <div className="space-y-6">
              {/* Ridicare */}
              <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Adresa de ridicare</h2>
                    <p className="text-gray-400 text-sm">De unde ridicăm?</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Țara *</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                          <Image 
                            src={`/img/flag/${formData.tara_ridicare.toLowerCase()}.svg`} 
                            alt={countries.find(c => c.code === formData.tara_ridicare)?.name || ''} 
                            width={24} 
                            height={18} 
                            className="rounded-sm shadow-sm"
                          />
                        </div>
                        <select
                          name="tara_ridicare"
                          value={formData.tara_ridicare}
                          onChange={handleInputChange}
                          className="form-select w-full pl-14"
                          style={{ paddingLeft: '3.5rem' }}
                        >
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Județ/Regiune *</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                          <Image 
                            src={`/img/flag/${formData.tara_ridicare.toLowerCase()}.svg`} 
                            alt={countries.find(c => c.code === formData.tara_ridicare)?.name || ''} 
                            width={24} 
                            height={18} 
                            className="rounded-sm shadow-sm opacity-60"
                          />
                        </div>
                        <select
                          name="judet_ridicare"
                          value={formData.judet_ridicare}
                          onChange={handleInputChange}
                          className="form-select w-full pl-14"
                          style={{ paddingLeft: '3.5rem' }}
                        >
                          <option value="">Selectează...</option>
                          {judetRidicareList.map((j) => (
                            <option key={j} value={j}>{j}</option>
                          ))}
                        </select>
                      </div>
                      {errors.judet_ridicare && <p className="text-red-400 text-sm mt-1">{errors.judet_ridicare}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Oraș *</label>
                    <input
                      type="text"
                      name="oras_ridicare"
                      value={formData.oras_ridicare}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      placeholder="București"
                    />
                    {errors.oras_ridicare && <p className="text-red-400 text-sm mt-1">{errors.oras_ridicare}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Adresa completă *</label>
                    <input
                      type="text"
                      name="adresa_ridicare"
                      value={formData.adresa_ridicare}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      placeholder="Str. Exemplu, Nr. 10, Sector 1"
                    />
                    {errors.adresa_ridicare && <p className="text-red-400 text-sm mt-1">{errors.adresa_ridicare}</p>}
                  </div>
                </div>
              </div>

              {/* Livrare */}
              <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Adresa de livrare</h2>
                    <p className="text-gray-400 text-sm">Unde livrăm?</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Țara *</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                          <Image 
                            src={`/img/flag/${formData.tara_livrare.toLowerCase()}.svg`} 
                            alt={countries.find(c => c.code === formData.tara_livrare)?.name || ''} 
                            width={24} 
                            height={18} 
                            className="rounded-sm shadow-sm"
                          />
                        </div>
                        <select
                          name="tara_livrare"
                          value={formData.tara_livrare}
                          onChange={handleInputChange}
                          className="form-select w-full pl-14"
                          style={{ paddingLeft: '3.5rem' }}
                        >
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Județ/Regiune *</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                          <Image 
                            src={`/img/flag/${formData.tara_livrare.toLowerCase()}.svg`} 
                            alt={countries.find(c => c.code === formData.tara_livrare)?.name || ''} 
                            width={24} 
                            height={18} 
                            className="rounded-sm shadow-sm opacity-60"
                          />
                        </div>
                        <select
                          name="judet_livrare"
                          value={formData.judet_livrare}
                          onChange={handleInputChange}
                          className="form-select w-full pl-14"
                          style={{ paddingLeft: '3.5rem' }}
                        >
                          <option value="">Selectează...</option>
                          {judetLivrareList.map((j) => (
                            <option key={j} value={j}>{j}</option>
                          ))}
                        </select>
                      </div>
                      {errors.judet_livrare && <p className="text-red-400 text-sm mt-1">{errors.judet_livrare}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Oraș *</label>
                    <input
                      type="text"
                      name="oras_livrare"
                      value={formData.oras_livrare}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      placeholder="London"
                    />
                    {errors.oras_livrare && <p className="text-red-400 text-sm mt-1">{errors.oras_livrare}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Adresa completă *</label>
                    <input
                      type="text"
                      name="adresa_livrare"
                      value={formData.adresa_livrare}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      placeholder="123 Example Street, London"
                    />
                    {errors.adresa_livrare && <p className="text-red-400 text-sm mt-1">{errors.adresa_livrare}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Detalii Transport */}
          {step === 4 && (
            <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Detalii transport</h2>
                  <p className="text-gray-400 text-sm">Informații despre ce vrei să trimiți</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {selectedService !== 'persoane' && selectedService !== 'aeroport' && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Greutate (kg) *</label>
                        <input
                          type="number"
                          name="greutate"
                          value={formData.greutate}
                          onChange={handleInputChange}
                          className="form-input w-full"
                          placeholder="10"
                          min="0"
                          step="0.1"
                        />
                        {errors.greutate && <p className="text-red-400 text-sm mt-1">{errors.greutate}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Lungime (cm)</label>
                        <input
                          type="number"
                          name="lungime"
                          value={formData.lungime}
                          onChange={handleInputChange}
                          className="form-input w-full"
                          placeholder="50"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Lățime (cm)</label>
                        <input
                          type="number"
                          name="latime"
                          value={formData.latime}
                          onChange={handleInputChange}
                          className="form-input w-full"
                          placeholder="30"
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Înălțime (cm)</label>
                        <input
                          type="number"
                          name="inaltime"
                          value={formData.inaltime}
                          onChange={handleInputChange}
                          className="form-input w-full"
                          placeholder="20"
                          min="0"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Cantitate (bucăți)</label>
                        <input
                          type="number"
                          name="cantitate"
                          value={formData.cantitate}
                          onChange={handleInputChange}
                          className="form-input w-full"
                          placeholder="1"
                          min="1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Valoare marfă (EUR)</label>
                        <input
                          type="number"
                          name="valoare_marfa"
                          value={formData.valoare_marfa}
                          onChange={handleInputChange}
                          className="form-input w-full"
                          placeholder="100"
                          min="0"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {(selectedService === 'persoane' || selectedService === 'aeroport') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Număr pasageri</label>
                    <input
                      type="number"
                      name="cantitate"
                      value={formData.cantitate}
                      onChange={handleInputChange}
                      className="form-input w-full"
                      placeholder="1"
                      min="1"
                      max="8"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descriere {selectedService !== 'persoane' && selectedService !== 'aeroport' && '*'}
                  </label>
                  <textarea
                    name="descriere"
                    value={formData.descriere}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    rows={3}
                    placeholder="Descrie ce vrei să trimiți (ex: colet fragil, electronice, mobilă, etc.)"
                  />
                  {errors.descriere && <p className="text-red-400 text-sm mt-1">{errors.descriere}</p>}
                </div>
                
                {/* Program de ridicare/livrare - Simplificat */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Program de ridicare *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tip_programare: 'data_specifica' }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                        formData.tip_programare === 'data_specifica'
                          ? 'border-orange-500 bg-linear-to-br from-orange-500/20 to-amber-500/10 shadow-lg shadow-orange-500/20'
                          : 'border-white/10 hover:border-white/20 bg-slate-700/40 hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <h4 className="font-semibold text-white">Dată specifică</h4>
                      </div>
                      <p className="text-xs text-gray-400">Alege o dată exactă</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tip_programare: 'range' }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                        formData.tip_programare === 'range'
                          ? 'border-orange-500 bg-linear-to-br from-orange-500/20 to-amber-500/10 shadow-lg shadow-orange-500/20'
                          : 'border-white/10 hover:border-white/20 bg-slate-700/40 hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h4 className="font-semibold text-white">Interval de date</h4>
                      </div>
                      <p className="text-xs text-gray-400">Între două date</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tip_programare: 'flexibil' }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                        formData.tip_programare === 'flexibil'
                          ? 'border-orange-500 bg-linear-to-br from-orange-500/20 to-amber-500/10 shadow-lg shadow-orange-500/20'
                          : 'border-white/10 hover:border-white/20 bg-slate-700/40 hover:bg-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h4 className="font-semibold text-white">Flexibil</h4>
                      </div>
                      <p className="text-xs text-gray-400">Oricând în următoarele zile</p>
                    </button>
                  </div>
                </div>

                {/* Date specifice - Afișare condițională */}
                {formData.tip_programare === 'data_specifica' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Selectează data *</label>
                    <div className="relative" ref={calendarRef}>
                      <button
                        type="button"
                        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-left text-white hover:border-orange-500/50 transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <svg className="w-5 h-5 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {formData.data_ridicare ? (
                            <span className="text-sm truncate">{formatDateDisplay(formData.data_ridicare)}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">Alege o dată</span>
                          )}
                        </div>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isCalendarOpen && (
                        <div className="absolute z-50 mt-2 left-0 right-0 sm:left-auto sm:right-auto sm:w-80 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                          <div className="flex items-center justify-between p-4 border-b border-white/5">
                            <button
                              type="button"
                              onClick={() => {
                                if (calendarMonth === 0) {
                                  setCalendarMonth(11);
                                  setCalendarYear(calendarYear - 1);
                                } else {
                                  setCalendarMonth(calendarMonth - 1);
                                }
                              }}
                              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <span className="font-semibold text-white">{monthNames[calendarMonth]} {calendarYear}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (calendarMonth === 11) {
                                  setCalendarMonth(0);
                                  setCalendarYear(calendarYear + 1);
                                } else {
                                  setCalendarMonth(calendarMonth + 1);
                                }
                              }}
                              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>

                          <div className="grid grid-cols-7 gap-1 px-3 pt-3">
                            {dayNames.map(day => (
                              <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">{day}</div>
                            ))}
                          </div>

                          <div className="grid grid-cols-7 gap-1 p-3">
                            {Array.from({ length: getFirstDayOfMonth(calendarMonth, calendarYear) }).map((_, i) => (
                              <div key={`empty-${i}`} className="h-10" />
                            ))}
                            {Array.from({ length: getDaysInMonth(calendarMonth, calendarYear) }).map((_, i) => {
                              const day = i + 1;
                              const isDisabled = isDateDisabled(day, calendarMonth, calendarYear);
                              const isSelected = formData.data_ridicare && 
                                new Date(formData.data_ridicare).getDate() === day &&
                                new Date(formData.data_ridicare).getMonth() === calendarMonth &&
                                new Date(formData.data_ridicare).getFullYear() === calendarYear;
                              
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => !isDisabled && handleDateSelect(day)}
                                  disabled={isDisabled}
                                  className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isDisabled 
                                      ? 'text-gray-600 cursor-not-allowed' 
                                      : isSelected
                                        ? 'bg-linear-to-br from-orange-600 to-amber-600 text-white shadow-lg'
                                        : 'text-white hover:bg-slate-700/50'
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.data_ridicare && <p className="text-red-400 text-sm mt-1">{errors.data_ridicare}</p>}
                  </div>
                )}

                {formData.tip_programare === 'range' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Data de la *</label>
                      <div className="relative" ref={calendarStartRef}>
                        <button
                          type="button"
                          onClick={() => setIsCalendarStartOpen(!isCalendarStartOpen)}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-left text-white hover:border-blue-500/50 transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <svg className="w-5 h-5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {formData.data_ridicare ? (
                              <span className="text-sm truncate">{formatDateDisplay(formData.data_ridicare)}</span>
                            ) : (
                              <span className="text-gray-400 text-sm">Dată start</span>
                            )}
                          </div>
                          <svg className={`w-5 h-5 text-gray-400 transition-transform ${isCalendarStartOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isCalendarStartOpen && (
                          <div className="absolute z-50 mt-2 left-0 right-0 sm:left-auto sm:right-auto sm:w-80 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (calendarStartMonth === 0) {
                                    setCalendarStartMonth(11);
                                    setCalendarStartYear(calendarStartYear - 1);
                                  } else {
                                    setCalendarStartMonth(calendarStartMonth - 1);
                                  }
                                }}
                                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <span className="font-semibold text-white">{monthNames[calendarStartMonth]} {calendarStartYear}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (calendarStartMonth === 11) {
                                    setCalendarStartMonth(0);
                                    setCalendarStartYear(calendarStartYear + 1);
                                  } else {
                                    setCalendarStartMonth(calendarStartMonth + 1);
                                  }
                                }}
                                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 px-3 pt-3">
                              {dayNames.map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">{day}</div>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 p-3">
                              {Array.from({ length: getFirstDayOfMonth(calendarStartMonth, calendarStartYear) }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-10" />
                              ))}
                              {Array.from({ length: getDaysInMonth(calendarStartMonth, calendarStartYear) }).map((_, i) => {
                                const day = i + 1;
                                const isDisabled = isDateDisabled(day, calendarStartMonth, calendarStartYear);
                                const isSelected = formData.data_ridicare && 
                                  new Date(formData.data_ridicare).getDate() === day &&
                                  new Date(formData.data_ridicare).getMonth() === calendarStartMonth &&
                                  new Date(formData.data_ridicare).getFullYear() === calendarStartYear;
                                
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => !isDisabled && handleDateStartSelect(day)}
                                    disabled={isDisabled}
                                    className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                                      isDisabled 
                                        ? 'text-gray-600 cursor-not-allowed' 
                                        : isSelected
                                          ? 'bg-linear-to-br from-blue-600 to-cyan-600 text-white shadow-lg'
                                          : 'text-white hover:bg-slate-700/50'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.data_ridicare && <p className="text-red-400 text-sm mt-1">{errors.data_ridicare}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Data până la *</label>
                      <div className="relative" ref={calendarEndRef}>
                        <button
                          type="button"
                          onClick={() => setIsCalendarEndOpen(!isCalendarEndOpen)}
                          className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-left text-white hover:border-blue-500/50 transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <svg className="w-5 h-5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {formData.data_ridicare_end ? (
                              <span className="text-sm truncate">{formatDateDisplay(formData.data_ridicare_end)}</span>
                            ) : (
                              <span className="text-gray-400 text-sm">Dată final</span>
                            )}
                          </div>
                          <svg className={`w-5 h-5 text-gray-400 transition-transform ${isCalendarEndOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isCalendarEndOpen && (
                          <div className="absolute z-50 mt-2 left-0 right-0 sm:left-auto sm:right-auto sm:w-80 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (calendarEndMonth === 0) {
                                    setCalendarEndMonth(11);
                                    setCalendarEndYear(calendarEndYear - 1);
                                  } else {
                                    setCalendarEndMonth(calendarEndMonth - 1);
                                  }
                                }}
                                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <span className="font-semibold text-white">{monthNames[calendarEndMonth]} {calendarEndYear}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (calendarEndMonth === 11) {
                                    setCalendarEndMonth(0);
                                    setCalendarEndYear(calendarEndYear + 1);
                                  } else {
                                    setCalendarEndMonth(calendarEndMonth + 1);
                                  }
                                }}
                                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 px-3 pt-3">
                              {dayNames.map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">{day}</div>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1 p-3">
                              {Array.from({ length: getFirstDayOfMonth(calendarEndMonth, calendarEndYear) }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-10" />
                              ))}
                              {Array.from({ length: getDaysInMonth(calendarEndMonth, calendarEndYear) }).map((_, i) => {
                                const day = i + 1;
                                const isDisabled = isDateDisabled(day, calendarEndMonth, calendarEndYear);
                                const isSelected = formData.data_ridicare_end && 
                                  new Date(formData.data_ridicare_end).getDate() === day &&
                                  new Date(formData.data_ridicare_end).getMonth() === calendarEndMonth &&
                                  new Date(formData.data_ridicare_end).getFullYear() === calendarEndYear;
                                
                                return (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => !isDisabled && handleDateEndSelect(day)}
                                    disabled={isDisabled}
                                    className={`h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                                      isDisabled 
                                        ? 'text-gray-600 cursor-not-allowed' 
                                        : isSelected
                                          ? 'bg-linear-to-br from-blue-600 to-cyan-600 text-white shadow-lg'
                                          : 'text-white hover:bg-slate-700/50'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      {errors.data_ridicare_end && <p className="text-red-400 text-sm mt-1">{errors.data_ridicare_end}</p>}
                    </div>
                  </div>
                )}

                {formData.tip_programare === 'flexibil' && (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-green-400 font-medium mb-1">Program flexibil selectat</p>
                        <p className="text-sm text-gray-400">Curierii vor putea ridica coletul în funcție de disponibilitatea lor. Vei fi contactat pentru confirmare.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Opțiuni Suplimentare și Revizuire */}
          {step === 5 && (
            <div className="space-y-6">
              {/* Tip ofertanți */}
              <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">De la cine dorești oferte?</h2>
                    <p className="text-gray-400 text-sm">Selectează tipul de transportatori</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className="flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all hover:border-white/20"
                    style={{
                      borderColor: formData.tip_ofertanti.includes('firme') ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                      backgroundColor: formData.tip_ofertanti.includes('firme') ? 'rgba(59,130,246,0.1)' : 'rgba(71,85,105,0.3)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.tip_ofertanti.includes('firme')}
                      onChange={() => handleOfertantiToggle('firme')}
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-slate-700 text-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-bold text-white text-lg">Firme de Transport</span>
                      </div>
                      <p className="text-sm text-gray-400">Companii cu licență, asigurare și echipamente profesionale</p>
                    </div>
                  </label>

                  <label
                    className="flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all hover:border-white/20"
                    style={{
                      borderColor: formData.tip_ofertanti.includes('persoane_private') ? '#10b981' : 'rgba(255,255,255,0.1)',
                      backgroundColor: formData.tip_ofertanti.includes('persoane_private') ? 'rgba(16,185,129,0.1)' : 'rgba(71,85,105,0.3)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.tip_ofertanti.includes('persoane_private')}
                      onChange={() => handleOfertantiToggle('persoane_private')}
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-slate-700 text-green-500 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-bold text-white text-lg">Persoane Private</span>
                      </div>
                      <p className="text-sm text-gray-400">Transportatori independenți cu tarife flexibile</p>
                    </div>
                  </label>
                </div>

                {formData.tip_ofertanti.length === 0 && (
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-amber-400 text-sm font-medium">Selectează cel puțin un tip pentru a primi oferte</p>
                  </div>
                )}
              </div>

              {/* Opțiuni suplimentare */}
              <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">Opțiuni suplimentare</h2>
                    <p className="text-gray-400 text-sm">Servicii adiționale (opțional)</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {optiuniSuplimentare.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-white/20"
                      style={{
                        borderColor: formData.optiuni.includes(opt.id) ? '#34d399' : 'rgba(255,255,255,0.1)',
                        backgroundColor: formData.optiuni.includes(opt.id) ? 'rgba(52,211,153,0.1)' : 'rgba(71,85,105,0.3)'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.optiuni.includes(opt.id)}
                        onChange={() => handleOptionToggle(opt.id)}
                        className="mt-1 w-5 h-5 rounded border-white/20 bg-slate-700 text-green-500 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-white block mb-1">{opt.name}</span>
                        <p className="text-sm text-gray-400">{opt.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Observații */}
              <div className="bg-linear-to-br from-slate-800/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Observații suplimentare</h2>
                    <p className="text-gray-400 text-sm">Detalii adiționale (opțional)</p>
                  </div>
                </div>
                
                <textarea
                  name="observatii"
                  value={formData.observatii}
                  onChange={handleInputChange}
                  className="form-input w-full"
                  rows={4}
                  placeholder="Ex: marfă fragilă, necesită manipulare specială, alte cerințe..."
                />
              </div>

              {/* Sumar comandă */}
              <div className="bg-linear-to-br from-orange-500/20 via-amber-500/10 to-green-500/20 backdrop-blur-xl rounded-2xl border-2 border-orange-500/30 p-6 sm:p-8 shadow-2xl shadow-orange-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500/30 to-amber-500/30 border border-orange-500/50 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-green-400">Sumar comandă</h2>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Serviciu:</span>
                    <span className="text-white font-semibold">
                      {servicii.find(s => s.id === selectedService)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ruta:</span>
                    <span className="text-white font-semibold">
                      {countries.find(c => c.code === formData.tara_ridicare)?.name} → {countries.find(c => c.code === formData.tara_livrare)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Program ridicare:</span>
                    <span className="text-white font-semibold">
                      {formData.tip_programare === 'data_specifica' && formData.data_ridicare ? formData.data_ridicare : ''}
                      {formData.tip_programare === 'range' && formData.data_ridicare && formData.data_ridicare_end ? `${formData.data_ridicare} - ${formData.data_ridicare_end}` : ''}
                      {formData.tip_programare === 'flexibil' ? 'Flexibil' : ''}
                      {!formData.tip_programare ? '-' : ''}
                    </span>
                  </div>
                  {formData.optiuni.length > 0 && (
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-gray-400 block mb-2">Opțiuni suplimentare:</span>
                      <div className="flex flex-wrap gap-2">
                        {formData.optiuni.map(optId => (
                          <span key={optId} className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                            {optiuniSuplimentare.find(o => o.id === optId)?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 p-5 bg-linear-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">Ce urmează:</p>
                  </div>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Trimitem cererea către partenerii noștri</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Vei primi oferte în <strong className="text-white">24-48 ore</strong></span>
                    </li>
                    <li className="flex items-start gap-2.5 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Compari și alegi oferta potrivită</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-xl ${
                  message.includes('✅') 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {message}
                </div>
              )}
            </div>
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
