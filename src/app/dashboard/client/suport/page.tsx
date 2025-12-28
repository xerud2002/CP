'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, ChatIcon, MailIcon, BellIcon, PackageIcon, UserIcon, StarIcon } from '@/components/icons/DashboardIcons';
import HelpCard from '@/components/HelpCard';
import { CONTACT_INFO } from '@/lib/contact';
import { useAdminMessages } from '@/hooks/useAdminMessages';
import UserMessageModal from '@/components/UserMessageModal';

const contactMethods = [
  {
    icon: MailIcon,
    title: 'Email',
    value: CONTACT_INFO.email,
    description: 'Răspundem în 24-48 ore',
    action: 'mailto:contact@curierulperfect.com',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    hoverBg: 'hover:bg-blue-500/20',
    hoverBorder: 'hover:border-blue-500/40',
  },
  {
    icon: ChatIcon,
    title: 'WhatsApp',
    value: 'Mesaj rapid',
    description: 'Contact direct pentru urgențe',
    action: 'https://wa.me/40XXXXXXXXX',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    hoverBg: 'hover:bg-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/40',
  },
  {
    icon: BellIcon,
    title: 'Mesaj Admin',
    value: 'Contact direct',
    description: 'Trimite mesaj echipei',
    action: 'admin-message',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    hoverBg: 'hover:bg-purple-500/20',
    hoverBorder: 'hover:border-purple-500/40',
  },
];

export default function SuportClientPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showAdminMessageModal, setShowAdminMessageModal] = useState(false);
  const { unreadCount } = useAdminMessages(user?.uid || '');

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
            const isAdminMessage = method.action === 'admin-message';
            const handleClick = () => {
              if (isAdminMessage) {
                setShowAdminMessageModal(true);
              } else if (method.action) {
                window.open(method.action, '_blank');
              }
            };
            
            return (
              <button
                key={index}
                onClick={handleClick}
                className={`group ${method.bg} ${method.hoverBg} backdrop-blur-sm rounded-xl border ${method.border} ${method.hoverBorder} p-4 sm:p-6 text-center hover:scale-105 transition-all duration-300 cursor-pointer relative overflow-hidden`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.bg.replace('/10', '/20')} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {isAdminMessage && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 z-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-purple-500 items-center justify-center text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  </span>
                )}
                <div className="relative z-10">
                  <div className={`w-14 h-14 ${method.bg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${method.color}`} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-1">{method.title}</h3>
                  <p className={`${method.color} font-semibold text-sm mb-1`}>{method.value}</p>
                  <p className="text-xs text-gray-400">{method.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Support Info */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Cum te putem ajuta?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Asistență pentru comenzi */}
            <div className="group bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-5 hover:border-emerald-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <PackageIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-2">Asistență pentru comenzi</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Probleme cu comenzile active, întârzieri sau modificări - suntem aici pentru tine</p>
                </div>
              </div>
            </div>

            {/* Întrebări despre servicii */}
            <div className="group bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm rounded-xl border border-blue-500/20 p-5 hover:border-blue-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <ChatIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-2">Întrebări despre servicii</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Informații despre cum funcționează platforma, prețuri și serviciile disponibile</p>
                </div>
              </div>
            </div>

            {/* Raportare comportament */}
            <div className="group bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-sm rounded-xl border border-red-500/20 p-5 hover:border-red-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <BellIcon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-2">Raportare comportament neprofesional</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Limbaj inadecvat, atitudine nepotrivită sau orice formă de hărțuire - te ajutăm imediat</p>
                </div>
              </div>
            </div>

            {/* Servicii neprestate */}
            <div className="group bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-5 hover:border-yellow-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-2">Servicii neprestate sau probleme financiare</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Curierul nu și-a îndeplinit obligațiile, întârzieri nejustificate sau probleme cu plata</p>
                </div>
              </div>
            </div>

            {/* Sesizare încălcări */}
            <div className="group bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-sm rounded-xl border border-orange-500/20 p-5 hover:border-orange-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-2">Sesizare încălcări ale termenilor</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Activități suspecte, înșelătorii sau încălcări grave ale regulamentului platformei</p>
                </div>
              </div>
            </div>

            {/* Probleme tehnice */}
            <div className="group bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm rounded-xl border border-purple-500/20 p-5 hover:border-purple-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-2">Probleme tehnice</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Erori pe platformă, probleme cu contul sau funcționalități care nu lucrează corect</p>
                </div>
              </div>
            </div>

            {/* Feedback și sugestii */}
            <div className="group bg-gradient-to-br from-pink-500/10 to-pink-600/5 backdrop-blur-sm rounded-xl border border-pink-500/20 p-5 hover:border-pink-500/40 transition-all hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <StarIcon className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base mb-2">Feedback și sugestii</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">Ideile tale ne ajută să construim o platformă mai bună pentru toată comunitatea</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-xl border border-red-500/30 p-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <BellIcon className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">Protecția ta este prioritatea noastră</h4>
              <p className="text-gray-300 text-sm mb-3">
                Dacă ai întâmpinat o situație neplăcută, te rugăm să ne contactezi imediat. Fiecare sesizare este tratată cu seriozitate și confidențialitate.
              </p>
              <ul className="space-y-1.5 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>Toate raportările sunt investigate în maxim 24 de ore</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-400 mt-0.5">•</span>
                  <span>Identitatea ta rămâne protejată pe toată durata investigației</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Curieri cu comportament inadecvat pot fi suspendați sau eliminați permanent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  <span>Oferim suport complet pentru recuperarea prejudiciilor în cazuri dovedite</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <HelpCard />
        </div>
      </main>

      {/* Admin Message Modal */}
      {showAdminMessageModal && (
        <UserMessageModal
          isOpen={showAdminMessageModal}
          onClose={() => setShowAdminMessageModal(false)}
          userId={user?.uid || ''}
          userRole="client"
        />
      )}
    </div>
  );
}
