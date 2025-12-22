'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, ChatIcon, PhoneIcon, MailIcon, ClockIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';

const faqItems = [
  {
    question: 'Cum pot trimite un colet în Europa?',
    answer: 'Completează formularul de comandă, alege serviciul dorit și vei primi oferte de la curierii noștri parteneri în 24-48 ore.',
  },
  {
    question: 'Cât durează livrarea?',
    answer: 'Timpul de livrare depinde de destinație și serviciul ales. De obicei, livrările în Europa durează între 2-7 zile lucrătoare.',
  },
  {
    question: 'Cum funcționează programul de fidelitate?',
    answer: 'Câștigi 1 punct pentru fiecare RON cheltuit. Punctele îți aduc reduceri de până la 15% și alte beneficii exclusive.',
  },
  {
    question: 'Ce metode de plată acceptați?',
    answer: 'Acceptăm plata cu card, transfer bancar și numerar la ridicare (în funcție de curier).',
  },
  {
    question: 'Pot anula o comandă?',
    answer: 'Da, poți anula comanda gratuit înainte ca aceasta să fie preluată de curier. După preluare, se pot aplica taxe de anulare.',
  },
];

const contactMethods = [
  {
    icon: PhoneIcon,
    title: 'Telefon',
    value: '+40 XXX XXX XXX',
    description: 'Luni-Vineri, 09:00-18:00',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: MailIcon,
    title: 'Email',
    value: 'support@curierulperfect.ro',
    description: 'Răspundem în 24 ore',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    icon: ChatIcon,
    title: 'WhatsApp',
    value: '+40 XXX XXX XXX',
    description: 'Chat rapid 24/7',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
];

export default function SuportClientPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'client')) {
      router.push('/login?role=client');
    }
  }, [user, loading, router]);

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
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-pink-500/20 flex items-center justify-center">
                  <ChatIcon className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white">Suport Clienți</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Ajutor 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div 
                key={index}
                className={`${method.bg} backdrop-blur-sm rounded-xl border ${method.border} p-4 sm:p-6 text-center hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className={`w-12 h-12 ${method.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${method.color}`} />
                </div>
                <h3 className="text-white font-semibold mb-1">{method.title}</h3>
                <p className={`${method.color} font-medium text-sm mb-1`}>{method.value}</p>
                <p className="text-xs text-gray-500">{method.description}</p>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ChatIcon className="w-5 h-5 text-pink-400" />
            Întrebări Frecvente
          </h2>
          
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div 
                key={index}
                className="bg-slate-700/30 rounded-xl border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-700/50 transition-all"
                >
                  <span className="text-white font-medium">{item.question}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-4 pb-4 text-sm text-gray-400">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20 p-6 text-center mb-6">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClockIcon className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Program de Lucru</h3>
          <div className="space-y-1 text-gray-300">
            <p>Luni - Vineri: 09:00 - 18:00</p>
            <p>Sâmbătă - Duminică: 10:00 - 16:00</p>
            <p className="text-emerald-400 font-medium mt-2">WhatsApp disponibil 24/7</p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </main>
    </div>
  );
}
