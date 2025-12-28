'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, memo, lazy, Suspense, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { logError } from '@/lib/errorMessages';
import { useUserActivity } from '@/hooks/useUserActivity';
import { useAdminMessages } from '@/hooks/useAdminMessages';
import CourierChatModal from '@/components/orders/CourierChatModal';
import {
  UserIcon,
  BoxIcon,
  CheckCircleIcon,
  BellIcon,
  StarIcon,
  ChatIcon,
} from '@/components/icons/DashboardIcons';
import { AdminMessagesListModal, AdminMessageModal } from '@/components/admin';
import { User } from '@/types';
import { getDocumentRequirements } from '@/utils/documentRequirements';

// Lazy load below-fold components
const HelpCard = lazy(() => import('@/components/HelpCard'));

// ============================================
// TYPES & INTERFACES
// ============================================
interface RecentMessage {
  id: string;
  orderId: string;
  orderNumber?: number;
  clientId?: string;
  senderName: string;
  senderRole: 'client' | 'curier' | 'admin';
  message: string;
  createdAt: Date;
  read?: boolean;
  senderId?: string;
  unreadCount?: number;
}

interface CourierVerificationData {
  isVerified: boolean;
  approvedDocuments: string[];
  pendingDocuments: string[];
}

// ============================================
// CONFIGURATION DATA
// ============================================

// Setup steps for new couriers
interface SetupStep {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
}

// Setup steps - Only active features: Profile and Services
// Zone and Calendar are disabled and removed from setup flow
const getSetupSteps = (profileComplete: boolean, servicesComplete: boolean): SetupStep[] => [
  { id: 'profile', title: 'Completează profilul', description: 'Date personale și business', href: '/dashboard/curier/profil', icon: UserIcon, completed: profileComplete },
  { id: 'services', title: 'Adaugă servicii', description: 'Ce oferi clienților?', href: '/dashboard/curier/servicii', icon: StarIcon, completed: servicesComplete },
];

// Navigation tiles for main menu
interface NavTile {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeKey?: 'services' | 'profile' | 'verification';
}

const mainNavTiles: NavTile[] = [
  {
    href: '/dashboard/curier/comenzi',
    icon: BoxIcon,
    title: 'Comenzi',
    description: 'Oferte comenzi',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 hover:bg-orange-500/20',
    borderColor: 'border-orange-500/20 hover:border-orange-500/40',
  },
  {
    href: '/dashboard/curier/verificare',
    icon: CheckCircleIcon,
    title: 'Verificare',
    description: 'Documente și verificare',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
    badgeKey: 'verification',
  },
  {
    href: '/dashboard/curier/recenzii',
    icon: BellIcon,
    title: 'Recenzii',
    description: 'Feedback clienți',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
  },
  {
    href: '/dashboard/curier/profil',
    icon: UserIcon,
    title: 'Profil',
    description: 'Setările contului',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10 hover:bg-pink-500/20',
    borderColor: 'border-pink-500/20 hover:border-pink-500/40',
    badgeKey: 'profile',
  },
  {
    href: '/dashboard/curier/suport',
    icon: ChatIcon,
    title: 'Suport',
    description: 'Ajutor 24/7',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10 hover:bg-violet-500/20',
    borderColor: 'border-violet-500/20 hover:border-violet-500/40',
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bună dimineața';
  if (hour < 18) return 'Bună ziua';
  return 'Bună seara';
}

// ============================================
// SUB-COMPONENTS
// ============================================

// Header Component
const DashboardHeader = memo(function DashboardHeader({ adminUnreadCount, onLogout, onBellClick, onGuideClick }: { 
  adminUnreadCount?: number;
  onLogout: () => void;
  onBellClick?: () => void;
  onGuideClick?: () => void;
}) {
  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-60">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            {/* Logo Image */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-all">
              <Image 
                src="/img/logo2.png" 
                alt="Curierul Perfect Logo" 
                width={40} 
                height={40} 
                priority
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            {/* Text - Hidden on mobile */}
            <div className="hidden sm:flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight leading-none">
                <span className="group-hover:opacity-80 transition-opacity" style={{color: '#FF8C00'}}>CurierulPerfect</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium tracking-wider uppercase text-center">- TRANSPORT EUROPA -</span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Notifications / Messages */}
            <button 
              onClick={onBellClick}
              className="relative p-2.5 sm:p-2 text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5 active:bg-white/10"
              title="Mesaje de la administrator"
            >
              <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              {(adminUnreadCount ?? 0) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 bg-red-500 rounded-full text-[10px] sm:text-xs font-bold text-white flex items-center justify-center shadow-lg animate-pulse">
                  {(adminUnreadCount ?? 0) > 9 ? '9+' : adminUnreadCount}
                </span>
              )}
            </button>

            {/* Guide Button */}
            <button 
              onClick={onGuideClick}
              className="p-2.5 sm:p-2 text-gray-400 hover:text-purple-400 transition-colors rounded-xl hover:bg-purple-500/10 active:bg-purple-500/20"
              title="Ghid platformă"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </button>

            {/* Help / Support */}
            <a 
              href="mailto:contact@curierulperfect.com"
              className="p-2.5 sm:p-2 text-gray-400 hover:text-emerald-400 transition-colors rounded-xl hover:bg-emerald-500/10 active:bg-emerald-500/20"
              title="Suport"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </a>

            {/* Logout */}
            <button 
              onClick={onLogout}
              className="p-2.5 sm:px-4 sm:py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all active:bg-white/10"
              title="Ieșire"
            >
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              <span className="hidden sm:inline">Ieșire</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
});

// Welcome Section Component - Simplified
const WelcomeSection = memo(function WelcomeSection({ userName, hasNewOrders, rating, reviewCount, verificationData }: { userName: string; hasNewOrders: boolean; rating: number; reviewCount: number; verificationData?: CourierVerificationData }) {
  const greeting = getGreeting();

  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900/70 via-slate-800/50 to-slate-900/70 backdrop-blur-sm border border-orange-500/10 p-4 sm:p-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-linear-to-br from-orange-500/8 to-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-linear-to-tr from-emerald-500/8 to-emerald-600/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                {greeting}, <span className="text-emerald-400">{userName}</span>!
              </h1>
              {/* Verification Badge */}
              {verificationData?.isVerified && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] sm:text-xs font-medium border border-emerald-500/30" title="Cont verificat">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Verificat</span>
                </span>
              )}
            </div>
            {hasNewOrders ? (
              <p className="text-orange-400 text-xs sm:text-base flex items-center gap-1.5 sm:gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full animate-pulse"></span>
                Comenzi noi de procesat
              </p>
            ) : (
              <p className="text-gray-400 text-xs sm:text-base">Bine ai revenit în panoul tău</p>
            )}
          </div>

          {/* Status Badge */}
          <div className="shrink-0 flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-sm font-medium border border-emerald-500/30">
              ● Online
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="flex flex-col items-center p-2 sm:p-3 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-orange-500/20">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="p-1.5 bg-orange-500/20 rounded-lg">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-white">0</span>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Comenzi</span>
          </div>

          <div className="flex flex-col items-center p-2 sm:p-3 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-yellow-500/20">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-white">{rating.toFixed(1)}</span>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Rating</span>
          </div>

          <div className="flex flex-col items-center p-2 sm:p-3 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-emerald-500/20">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-white">{reviewCount}</span>
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Recenzii</span>
          </div>
        </div>

        {/* Certification & Verification Badges */}
        {verificationData && (verificationData.approvedDocuments.length > 0 || !verificationData.isVerified) && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {/* Verified Status */}
              {verificationData.isVerified ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] sm:text-xs font-medium border border-emerald-500/25">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Identitate verificată
                </span>
              ) : (
                <Link href="/dashboard/curier/verificare" className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-[10px] sm:text-xs font-medium border border-amber-500/25 hover:bg-amber-500/25 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Neverificat
                </Link>
              )}

              {/* Approved Certifications */}
              {verificationData.approvedDocuments.includes('cmr_insurance') && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/15 text-blue-400 text-[10px] sm:text-xs font-medium border border-blue-500/25" title="Asigurare CMR aprobată">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  CMR
                </span>
              )}

              {verificationData.approvedDocuments.includes('gb_goods_insurance') && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/15 text-blue-400 text-[10px] sm:text-xs font-medium border border-blue-500/25" title="Goods in Transit Insurance">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  GIT Insurance
                </span>
              )}

              {verificationData.approvedDocuments.includes('pet_transport_cert') && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-500/15 text-pink-400 text-[10px] sm:text-xs font-medium border border-pink-500/25" title="Autorizație transport animale">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  Animale
                </span>
              )}

              {verificationData.approvedDocuments.includes('passenger_transport_license') && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/15 text-purple-400 text-[10px] sm:text-xs font-medium border border-purple-500/25" title="Licență transport persoane">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Persoane
                </span>
              )}

              {verificationData.approvedDocuments.includes('towing_license') && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/15 text-orange-400 text-[10px] sm:text-xs font-medium border border-orange-500/25" title="Atestat tractare auto">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  Tractări
                </span>
              )}

              {verificationData.approvedDocuments.includes('platform_license') && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 text-[10px] sm:text-xs font-medium border border-cyan-500/25" title="Atestat platformă auto">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  Platformă
                </span>
              )}

              {verificationData.approvedDocuments.includes('heavy_transport_cert') && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-[10px] sm:text-xs font-medium border border-amber-500/25" title="Certificat transport marfă">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Marfă
                </span>
              )}

              {verificationData.approvedDocuments.includes('furniture_transport_cert') && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/15 text-indigo-400 text-[10px] sm:text-xs font-medium border border-indigo-500/25" title="Atestat transport mobilier">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                  </svg>
                  Mobilier
                </span>
              )}

              {/* Pending Documents Count */}
              {verificationData.pendingDocuments.length > 0 && (
                <Link href="/dashboard/curier/verificare" className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/15 text-yellow-400 text-[10px] sm:text-xs font-medium border border-yellow-500/25 hover:bg-yellow-500/25 transition-colors">
                  <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  {verificationData.pendingDocuments.length} în verificare
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

// Setup Progress Component for new couriers
// Shows only 2 active steps: Profile and Services (Zones and Calendar are disabled)
const SetupProgress = memo(function SetupProgress({ setupComplete, completedSteps, totalSteps }: { setupComplete: boolean; completedSteps: number; totalSteps: number }) {
  if (setupComplete) return null;
  
  const percentage = Math.round((completedSteps / totalSteps) * 100);
  const steps = getSetupSteps(completedSteps >= 1, completedSteps >= 2);
  
  return (
    <section className="bg-linear-to-br from-amber-500/10 to-orange-500/10 rounded-xl sm:rounded-2xl border border-amber-500/20 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base">Configurează contul</h3>
            <p className="text-gray-400 text-xs sm:text-sm">{completedSteps} din {totalSteps} pași completați</p>
          </div>
        </div>
        <span className="text-amber-400 font-bold text-lg sm:text-xl">{percentage}%</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-linear-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Steps */}
      <div className="grid grid-cols-2 gap-2">
        {steps.map((step) => (
          <Link
            key={step.id}
            href={step.href}
            className={`p-3 rounded-lg border transition-all ${step.completed 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {step.completed ? (
                <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              ) : (
                <step.icon className="w-4 h-4" />
              )}
              <span className="text-xs font-medium truncate">{step.title}</span>
            </div>
            <p className="text-[10px] text-gray-500 truncate">{step.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
});

// Main Navigation Grid
const MainNavigation = memo(function MainNavigation({ badges, newOrdersCount, profilePercent, verificationPercent }: { badges: Record<string, boolean>; newOrdersCount: number; profilePercent: number; verificationPercent: number }) {
  // Color mappings for hover gradients
  const gradientMap: Record<string, string> = {
    'text-orange-400': 'from-orange-500/20 to-amber-500/20',
    'text-amber-400': 'from-amber-500/20 to-yellow-500/20',
    'text-purple-400': 'from-purple-500/20 to-pink-500/20',
    'text-blue-400': 'from-blue-500/20 to-cyan-500/20',
    'text-emerald-400': 'from-emerald-500/20 to-green-500/20',
    'text-pink-400': 'from-pink-500/20 to-rose-500/20',
  };
  
  const borderColorMap: Record<string, string> = {
    'text-orange-400': 'border-orange-500/30 hover:border-orange-400/50',
    'text-amber-400': 'border-amber-500/30 hover:border-amber-400/50',
    'text-purple-400': 'border-purple-500/30 hover:border-purple-400/50',
    'text-blue-400': 'border-blue-500/30 hover:border-blue-400/50',
    'text-emerald-400': 'border-emerald-500/30 hover:border-emerald-400/50',
    'text-pink-400': 'border-pink-500/30 hover:border-pink-400/50',
  };
  
  const iconBgMap: Record<string, string> = {
    'text-orange-400': 'bg-orange-500/20',
    'text-amber-400': 'bg-amber-500/20',
    'text-purple-400': 'bg-purple-500/20',
    'text-blue-400': 'bg-blue-500/20',
    'text-emerald-400': 'bg-emerald-500/20',
    'text-pink-400': 'bg-pink-500/20',
  };

  return (
    <section>
      <h2 className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wide mb-2 sm:mb-3">Meniu rapid</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        {mainNavTiles.map((tile) => {
          const needsAttention = tile.badgeKey && badges[tile.badgeKey];
          const isComenziCard = tile.href === '/dashboard/curier/comenzi';
          const hasNewOrders = isComenziCard && newOrdersCount > 0;
          const gradient = gradientMap[tile.color] || 'from-slate-500/20 to-slate-500/20';
          const borderColor = borderColorMap[tile.color] || 'border-white/10 hover:border-white/20';
          const iconBg = iconBgMap[tile.color] || 'bg-slate-500/20';
          
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className={`group relative bg-linear-to-br from-slate-800/90 via-slate-850/85 to-slate-900/90 backdrop-blur-xl rounded-xl border ${borderColor} p-3 sm:p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 active:scale-95`}
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300`}></div>
              
              {/* New Orders Badge - only for Comenzi card */}
              {hasNewOrders && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 sm:h-6 sm:w-6 bg-orange-500 items-center justify-center border-2 border-slate-900">
                    <span className="text-[10px] sm:text-xs font-bold text-white">{newOrdersCount}</span>
                  </span>
                </span>
              )}
              
              {/* Setup Badge indicator - for other cards */}
              {!isComenziCard && needsAttention && (
                <span className="absolute -top-1.5 -right-1.5 flex z-10">
                  {tile.badgeKey === 'profile' ? (
                    // Profile completion badge with percentage
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 sm:h-7 sm:w-7 bg-orange-500 items-center justify-center border-2 border-slate-900">
                        <span className="text-[8px] sm:text-[10px] font-bold text-white">{profilePercent}%</span>
                      </span>
                    </>
                  ) : tile.badgeKey === 'verification' ? (
                    // Verification documents badge with percentage
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 sm:h-7 sm:w-7 bg-emerald-500 items-center justify-center border-2 border-slate-900">
                        <span className="text-[8px] sm:text-[10px] font-bold text-white">{verificationPercent}%</span>
                      </span>
                    </>
                  ) : (
                    // Default badge with !
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-5 sm:w-5 bg-orange-500 items-center justify-center">
                        <span className="text-[7px] sm:text-[10px] font-bold text-white">!</span>
                      </span>
                    </>
                  )}
                </span>
              )}
              
              <div className="relative">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${iconBg} rounded-lg flex items-center justify-center mb-2`}>
                  <tile.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${tile.color}`} />
                </div>
                <h3 className="text-white font-semibold text-xs sm:text-sm mb-0.5">{tile.title}</h3>
                <p className="text-gray-400 text-[10px] sm:text-xs truncate">{tile.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
});

// Orders Summary Component - Replaces Quick Actions
const OrdersSummary = memo(function OrdersSummary() {
  return (
    <section className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-3.5 sm:p-6 border border-white/5 h-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/20 rounded-lg">
            <BoxIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
          </div>
          Sumar comenzi
        </h3>
        <Link href="/dashboard/curier/comenzi" className="text-[11px] sm:text-sm text-orange-400 hover:text-orange-300 transition-colors">
          Vezi toate →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-1.5 sm:gap-4 mb-3 sm:mb-4">
        <div className="text-center p-2 sm:p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-base sm:text-2xl font-bold text-orange-400">0</p>
          </div>
          <p className="text-[9px] sm:text-xs text-gray-400">Noi</p>
        </div>
        <div className="text-center p-2 sm:p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base sm:text-2xl font-bold text-emerald-400">0</p>
          </div>
          <p className="text-[9px] sm:text-xs text-gray-400">Livrate</p>
        </div>
      </div>
      
      <Link 
        href="/dashboard/curier/comenzi"
        className="flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-medium rounded-xl transition-colors text-xs sm:text-sm"
      >
        <BoxIcon className="w-4 h-4" />
        Vezi comenzile
      </Link>
    </section>
  );
});

// Recent Activity Component - Shows recent messages
const RecentActivity = memo(function RecentActivity({ 
  recentMessages, 
  unreadCount, 
  onMessageClick, 
  onAdminMessageClick 
}: { 
  recentMessages: RecentMessage[]; 
  unreadCount: number; 
  onMessageClick: (orderId: string, orderNumber: string, clientId: string, clientName: string) => void;
  onAdminMessageClick: () => void;
}) {
  // Format timestamp to relative time
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Acum';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours} ore`;
    if (diffDays < 7) return `${diffDays} zile`;
    return date.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short' });
  };

  // Truncate message preview
  const truncateMessage = (msg: string, maxLength: number = 40) => {
    if (msg.length <= maxLength) return msg;
    return msg.substring(0, maxLength).trim() + '...';
  };

  // Format display name: "Prenume N." (handles "prenume.nume", "prenume nume", "prenumeNume")
  const formatDisplayName = (name: string): string => {
    if (!name) return 'Client';
    // Split by dot, space, or camelCase
    let parts = name.split(/[.\s]+/).filter(Boolean);
    if (parts.length === 1) {
      // Try camelCase split
      const camelParts = name.split(/(?=[A-Z])/).filter(Boolean);
      if (camelParts.length >= 2) parts = camelParts;
    }
    if (parts.length >= 2) {
      const firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
      const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
      return `${firstName} ${lastInitial}.`;
    }
    // Single word - capitalize
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <section className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-3.5 sm:p-6 border border-white/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-2">
          <div className="relative p-1.5 bg-purple-500/20 rounded-lg">
            <BellIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full" />
            )}
          </div>
          Mesaje recente
          {unreadCount > 0 && (
            <span className="text-[10px] sm:text-xs font-medium text-orange-400 bg-orange-500/20 px-1.5 py-0.5 rounded-full">
              {unreadCount} noi
            </span>
          )}
        </h3>
      </div>
      <div className="space-y-1.5 sm:space-y-2 flex-1 flex flex-col">
        {recentMessages.length === 0 ? (
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <ChatIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400/50" />
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">Niciun mesaj recent</p>
          </div>
        ) : (
          <>
            {recentMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  if (msg.senderRole === 'admin') {
                    onAdminMessageClick();
                  } else {
                    onMessageClick(msg.orderId, String(msg.orderNumber || ''), msg.clientId || '', msg.senderName);
                  }
                }}
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors group w-full text-left"
              >
                <div className="relative shrink-0 mt-0.5">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center ${
                    !msg.read ? 'bg-orange-500/30' : 'bg-slate-700'
                  }`}>
                    {msg.senderRole === 'admin' ? (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-purple-500 to-pink-500">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                    ) : (
                      <Image
                        src="/img/default-avatar.svg"
                        alt={formatDisplayName(msg.senderName)}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {!msg.read && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className={`text-[11px] sm:text-sm font-medium truncate ${!msg.read ? 'text-white' : 'text-gray-300'}`}>
                        {formatDisplayName(msg.senderName)}
                      </span>
                      {msg.unreadCount && msg.unreadCount > 0 && (
                        <span className="text-[9px] sm:text-[10px] font-semibold text-orange-400 bg-orange-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                          {msg.unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] sm:text-xs text-gray-500 shrink-0">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <p className={`text-[10px] sm:text-xs truncate ${!msg.read ? 'text-gray-300' : 'text-gray-500'}`}>
                    {msg.orderNumber ? `#CP${msg.orderNumber} · ` : ''}{truncateMessage(msg.message)}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-400 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
            <Link
              href="/dashboard/curier/comenzi"
              className="text-center text-[11px] sm:text-xs text-purple-400 hover:text-purple-300 py-2 transition-colors"
            >
              Vezi toate mesajele →
            </Link>
          </>
        )}
      </div>
    </section>
  );
});

// ============================================
// ONBOARDING MODAL COMPONENT
// ============================================

const OnboardingModal = memo(function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Ofertă Specială!',
      subtitle: '100% GRATUIT pe perioadă nedeterminată',
      content: 'Acces exclusiv pentru curieri verificați. Platformă complet gratuită pe perioadă nedeterminată!',
      items: ['Comenzi nelimitate', 'Zero comisioane permanent', 'Chat direct cu clienții - contactezi direct', 'Acces gratuit pe perioadă nedeterminată'],
      cta: 'Revendică Acces Gratuit',
    },
    {
      title: 'Cum funcționează?',
      subtitle: 'Pași simpli',
      content: 'Procesul este rapid și transparent.',
      items: ['Vezi comenzile disponibile', 'Contactezi clienții direct', 'Negociezi prețul liber', 'Construiești reputația'],
      cta: 'Continuă',
    },
    {
      title: 'Gata de Start!',
      subtitle: 'Următorii pași',
      content: 'Completează profilul și activează serviciile tale.',
      items: ['Adaugă descriere & experiență', 'Selectează serviciile oferite', 'Răspunde rapid la mesaje', 'Construiește recenzii pozitive'],
      cta: 'Începe Acum!',
    },
  ];

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        
        {/* Progress bar */}
        <div className="h-1 bg-slate-800">
          <div 
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep ? 'bg-orange-500 w-4' : idx < currentStep ? 'bg-orange-500/50' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white rounded transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Step number */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {currentStep + 1}
            </span>
            <span className="text-orange-400 text-sm font-medium">{step.subtitle}</span>
          </div>

          {/* Title & description */}
          <h2 className="text-xl font-bold text-white mb-2">{step.title}</h2>
          <p className="text-slate-400 text-sm mb-5">{step.content}</p>

          {/* Items list */}
          <div className="space-y-2 mb-6">
            {step.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-lg">
                <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {!isFirst && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="p-3 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
              onClick={() => isLast ? onClose() : setCurrentStep(prev => prev + 1)}
              className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-400 rounded-xl font-semibold text-white transition-all active:scale-[0.98]"
            >
              {step.cta}
            </button>
          </div>

          {/* Skip on first step */}
          {isFirst && (
            <button onClick={onClose} className="w-full text-center text-xs text-slate-500 hover:text-slate-400 mt-3 py-2">
              Sări introducerea
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

// ============================================
// MAIN COMPONENT
// ============================================
export default function CurierDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [hasNoServices, setHasNoServices] = useState(false);
  const [hasNoProfile, setHasNoProfile] = useState(false);
  const [profileCompletionPercent, setProfileCompletionPercent] = useState(100);
  const [requiredDocsPercent, setRequiredDocsPercent] = useState(100);
  const [userNume, setUserNume] = useState<string | null>(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [rating, setRating] = useState(5.0);
  const [reviewCount, setReviewCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  // isNewCourier tracks if this is the courier's first visit
  const [, setIsNewCourier] = useState(false);
  const [showAdminMessages, setShowAdminMessages] = useState(false);
  const [selectedAdminUser, setSelectedAdminUser] = useState<User | null>(null);
  const [selectedChatOrder, setSelectedChatOrder] = useState<{ orderId: string; orderNumber?: string; clientId: string; clientName: string } | null>(null);
  const [verificationData, setVerificationData] = useState<CourierVerificationData | undefined>(undefined);

  // Track admin messages
  const { unreadCount: adminUnreadCount } = useAdminMessages();

  // Check if this is a new courier (first visit)
  useEffect(() => {
    if (user) {
      const onboardingKey = `curier_onboarding_${user.uid}`;
      const hasSeenOnboarding = localStorage.getItem(onboardingKey);
      if (!hasSeenOnboarding) {
        setIsNewCourier(true);
        setShowOnboarding(true);
      }
    }
  }, [user]);

  const handleCloseOnboarding = useCallback(() => {
    if (user) {
      const onboardingKey = `curier_onboarding_${user.uid}`;
      localStorage.setItem(onboardingKey, 'true');
    }
    setShowOnboarding(false);
    setIsNewCourier(false);
  }, [user]);

  const handleOpenOnboarding = useCallback(() => {
    setShowOnboarding(true);
  }, []);

  // Track user activity for online status
  useUserActivity(user?.uid);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'curier')) {
      router.push('/login?role=curier');
    }
  }, [user, loading, router]);

  // Check if user has selected services and get user name from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // First, try to get name from profil_curier collection
        const profilRef = doc(db, 'profil_curier', user.uid);
        const profilSnap = await getDoc(profilRef);
        
        // Track approved and pending documents
        const approvedDocs: string[] = [];
        const pendingDocs: string[] = [];
        let taraSediu = 'RO';
        let tipBusiness = 'pf';
        
        if (profilSnap.exists()) {
          const profilData = profilSnap.data();
          if (profilData.nume) {
            setUserNume(profilData.nume);
          }
          // Store country and business type for document requirements
          taraSediu = profilData.tara_sediu || profilData.taraSediu || 'RO';
          tipBusiness = profilData.tipBusiness || 'pf';
          
          // Set rating and reviewCount (default 5.0 for new couriers)
          setRating(profilData.rating !== undefined ? profilData.rating : 5.0);
          setReviewCount(profilData.reviewCount !== undefined ? profilData.reviewCount : 0);
          
          // Calculate profile completion percentage
          const fields = [
            profilData.nume, profilData.telefon, profilData.email,
            profilData.firma, profilData.sediu, profilData.cui, profilData.iban
          ];
          const filled = fields.filter(f => f && String(f).trim() !== '').length;
          const completionPercent = Math.round((filled / fields.length) * 100);
          setProfileCompletionPercent(completionPercent);
          
          // Check if profile is complete (has name and phone at minimum)
          setHasNoProfile(!profilData.nume || !profilData.telefon);
          
          // Parse documents for verification badges
          if (profilData.documents) {
            Object.entries(profilData.documents).forEach(([docId, docData]) => {
              const doc = docData as { status?: string };
              if (doc.status === 'approved') {
                approvedDocs.push(docId);
              } else if (doc.status === 'pending') {
                pendingDocs.push(docId);
              }
            });
          }
        } else {
          setHasNoProfile(true);
          // Set default rating for new couriers
          setRating(5.0);
          setReviewCount(0);
        }
        
        // Check services and verification status from users collection
        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
        const userSnapshot = await getDocs(userQuery);
        
        let isVerified = false;
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          const services = userData.serviciiOferite || [];
          setHasNoServices(!services || !Array.isArray(services) || services.length === 0);
          
          // Get verification status
          isVerified = userData.verified === true;
          
          // Calculate required documents completion percentage
          const allDocs = getDocumentRequirements(taraSediu, services, tipBusiness);
          const requiredDocs = allDocs.filter(d => d.required);
          if (requiredDocs.length > 0) {
            const approvedRequiredCount = requiredDocs.filter(d => approvedDocs.includes(d.id)).length;
            const requiredPercent = Math.round((approvedRequiredCount / requiredDocs.length) * 100);
            setRequiredDocsPercent(requiredPercent);
          } else {
            setRequiredDocsPercent(100); // No required docs = 100% complete
          }
          
          // Fallback: if no name from profil_curier, try users collection
          if (!userNume && userData.nume) {
            setUserNume(userData.nume);
          }
        } else {
          setHasNoServices(true);
          setRequiredDocsPercent(0); // No services = show badge
        }
        
        // Set verification data
        setVerificationData({
          isVerified,
          approvedDocuments: approvedDocs,
          pendingDocuments: pendingDocs
        });

      } catch (error) {
        logError(error, 'Error fetching curier user data');
      }
    };

    if (user) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch new orders count - only count orders created after last visit
  useEffect(() => {
    const fetchNewOrdersCount = async () => {
      if (!user) return;
      
      try {
        // Get last visit timestamp
        const lastVisit = localStorage.getItem('curier_comenzi_last_visit');
        const lastVisitTimestamp = lastVisit ? parseInt(lastVisit) : 0;
        
        // Get courier's active services
        const userQuery = query(
          collection(db, 'users'),
          where('uid', '==', user.uid)
        );
        const userSnapshot = await getDocs(userQuery);
        let activeServices: string[] = [];
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          activeServices = userData.serviciiOferite || [];
        }
        
        // Query new orders
        const q = query(
          collection(db, 'comenzi'),
          where('status', '==', 'noua')
        );
        const snapshot = await getDocs(q);
        
        // Count only new orders that match courier's services and were created after last visit
        let count = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          const orderService = data.serviciu || data.tipColet || 'Colete';
          const createdAt = data.createdAt?.toDate().getTime() || 0;
          
          // Normalize service names for comparison
          const normalizedOrderService = orderService.toLowerCase().trim();
          const normalizedActiveServices = activeServices.map(s => s.toLowerCase().trim());
          
          // Count if: matches services AND created after last visit
          if ((activeServices.length === 0 || normalizedActiveServices.includes(normalizedOrderService)) 
              && createdAt > lastVisitTimestamp) {
            count++;
          }
        });
        
        setNewOrdersCount(count);
      } catch (error) {
        logError(error, 'Error loading new orders count for courier');
      }
    };

    if (user) {
      fetchNewOrdersCount();
    }
  }, [user]);

  // Real-time listener for recent messages sent to this courier
  useEffect(() => {
    if (!user) return;

    // Query messages where this courier is the recipient (from clients)
    const qClient = query(
      collection(db, 'mesaje'),
      where('courierId', '==', user.uid),
      where('senderRole', '==', 'client'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    // Query admin messages for this courier
    const qAdmin = query(
      collection(db, 'admin_messages'),
      where('participants', 'array-contains', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    let allMessagesFromBoth: RecentMessage[] = [];
    let clientMessagesLoaded = false;
    let adminMessagesLoaded = false;

    const processMessages = () => {
      if (!clientMessagesLoaded || !adminMessagesLoaded) return;

      // Group by sender (senderId) and keep only the most recent message per sender
      // Also track unread count per sender
      const senderMessageMap = new Map<string, RecentMessage>();
      const senderUnreadCount = new Map<string, number>();

      allMessagesFromBoth.forEach(msg => {
        if (msg.senderId) {
          const existing = senderMessageMap.get(msg.senderId);
          
          // Count unread messages per sender
          if (!msg.read) {
            senderUnreadCount.set(msg.senderId, (senderUnreadCount.get(msg.senderId) || 0) + 1);
          }
          
          // Keep the message with the most recent createdAt
          if (!existing || msg.createdAt > existing.createdAt) {
            senderMessageMap.set(msg.senderId, msg);
          }
        }
      });

      // Convert map back to array, add unread count, and sort by date (most recent first)
      const uniqueMessages = Array.from(senderMessageMap.values())
        .map(msg => {
          const unreadCount = senderUnreadCount.get(msg.senderId!);
          return {
            ...msg,
            unreadCount: unreadCount && unreadCount > 0 ? unreadCount : undefined
          };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5); // Keep only top 5

      setRecentMessages(uniqueMessages);
      
      // Calculate total unread count
      const totalUnread = Array.from(senderUnreadCount.values()).reduce((sum, count) => sum + count, 0);
      setUnreadCount(totalUnread);
    };

    // Subscribe to client messages
    const unsubscribeClient = onSnapshot(qClient, async (snapshot) => {
      const clientMessages: RecentMessage[] = [];

      // Gather order IDs to fetch order numbers
      const orderIds = new Set<string>();
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.orderId) orderIds.add(data.orderId);
      });

      // Fetch order numbers in batch
      const orderNumbers: Record<string, number> = {};
      if (orderIds.size > 0) {
        const orderPromises = Array.from(orderIds).map(async (orderId) => {
          const orderDoc = await getDoc(doc(db, 'comenzi', orderId));
          if (orderDoc.exists()) {
            orderNumbers[orderId] = orderDoc.data().orderNumber;
          }
        });
        await Promise.all(orderPromises);
      }

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const createdAt = data.createdAt?.toDate?.() || new Date();
        const isRead = data.readByCourier === true;
        
        clientMessages.push({
          id: docSnap.id,
          orderId: data.orderId || '',
          orderNumber: orderNumbers[data.orderId],
          clientId: data.clientId,
          senderName: data.senderName || 'Client',
          senderRole: 'client',
          message: data.message || '',
          createdAt,
          read: isRead,
          senderId: data.senderId,
        });
      });

      // Update combined messages
      allMessagesFromBoth = [
        ...clientMessages,
        ...allMessagesFromBoth.filter(m => m.senderRole !== 'client')
      ];
      clientMessagesLoaded = true;
      processMessages();
    }, (error) => {
      logError(error, 'Error listening to client messages');
    });

    // Subscribe to admin messages
    const unsubscribeAdmin = onSnapshot(qAdmin, (snapshot) => {
      const adminMessages: RecentMessage[] = [];

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const createdAt = data.createdAt?.toDate?.() || new Date();
        const isRead = data.read === true;
        const isFromAdmin = data.senderRole === 'admin';
        
        // Only include messages sent by admin TO this courier
        if (isFromAdmin && data.receiverId === user.uid) {
          adminMessages.push({
            id: docSnap.id,
            orderId: '', // Admin messages don't have orderId
            senderName: data.senderName || 'Admin',
            senderRole: 'admin',
            message: data.message || '',
            createdAt,
            read: isRead,
            senderId: data.senderId,
          });
        }
      });

      // Update combined messages
      allMessagesFromBoth = [
        ...allMessagesFromBoth.filter(m => m.senderRole !== 'admin'),
        ...adminMessages
      ];
      adminMessagesLoaded = true;
      processMessages();
    }, (error) => {
      logError(error, 'Error listening to admin messages');
    });

    return () => {
      unsubscribeClient();
      unsubscribeAdmin();
    };
  }, [user]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push('/');
  }, [logout, router]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-400">Se încarcă...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Extract first name: prioritize Firestore 'nume', then displayName, then email prefix
  const getFirstName = () => {
    // First check Firestore 'nume' field (from profile)
    if (userNume) {
      const firstName = userNume.split(' ')[0];
      return firstName || 'Curier';
    }
    // Then check Firebase Auth displayName
    if (user.displayName) {
      const firstName = user.displayName.split(' ')[0];
      return firstName || 'Curier';
    }
    // Fallback to email prefix or 'Curier'
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Curier';
  };
  const userName = getFirstName();

  // Calculate setup progress based on actual completion state (only 2 active steps: Profile & Services)
  const completedStepsCount = [!hasNoProfile, !hasNoServices].filter(Boolean).length;
  const setupComplete = completedStepsCount === 2;

  // Badges for quick menu (only active features)
  // Show profile badge if profile is not 100% complete
  // Show verification badge if required documents are not 100% approved
  const menuBadges = {
    services: hasNoServices,
    profile: profileCompletionPercent < 100,
    verification: requiredDocsPercent < 100,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <DashboardHeader 
        adminUnreadCount={adminUnreadCount}
        onLogout={handleLogout}
        onBellClick={() => setShowAdminMessages(true)}
        onGuideClick={handleOpenOnboarding}
      />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Welcome Section */}
        <WelcomeSection userName={userName} hasNewOrders={false} rating={rating} reviewCount={reviewCount} verificationData={verificationData} />

        {/* Setup Progress - Only 2 steps: Profile and Services (Zones/Calendar disabled) */}
        <SetupProgress setupComplete={setupComplete} completedSteps={completedStepsCount} totalSteps={2} />

        {/* Main Navigation - Quick access to all sections */}
        <MainNavigation badges={menuBadges} newOrdersCount={newOrdersCount} profilePercent={profileCompletionPercent} verificationPercent={requiredDocsPercent} />

        {/* Stats and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-6">
          {/* Orders Summary - Takes 3 columns on large screens */}
          <div className="lg:col-span-3">
            <OrdersSummary />
          </div>
          
          {/* Recent Activity - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentActivity 
              recentMessages={recentMessages} 
              unreadCount={unreadCount}
              onMessageClick={(orderId, orderNumber, clientId, clientName) => {
                setSelectedChatOrder({ orderId, orderNumber, clientId, clientName });
              }}
              onAdminMessageClick={() => {
                setShowAdminMessages(true);
              }}
            />
          </div>
        </div>

        {/* Help Card - Lazy loaded */}
        <Suspense fallback={null}>
          <HelpCard />
        </Suspense>
      </main>

      {/* Modals */}
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      {showAdminMessages && <AdminMessagesListModal onClose={() => setShowAdminMessages(false)} onSelectUser={(user) => { setSelectedAdminUser(user); setShowAdminMessages(false); }} />}
      {selectedAdminUser && <AdminMessageModal user={selectedAdminUser} onClose={() => setSelectedAdminUser(null)} />}
      {selectedChatOrder && (
        <CourierChatModal
          orderId={selectedChatOrder.orderId}
          orderNumber={selectedChatOrder.orderNumber}
          clientId={selectedChatOrder.clientId}
          clientName={selectedChatOrder.clientName}
          onClose={() => setSelectedChatOrder(null)}
        />
      )}
    </div>
  );
}


