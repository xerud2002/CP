'use client';

import Link from 'next/link';

const courierBenefits = [
  {
    id: 1,
    title: 'Alegi rutele tale',
    description: 'Controlezi destinațiile și programul. Lucrezi doar pe rutele care te interesează.',
    color: 'green',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Câștiguri pe drum',
    description: 'Optimizează-ți veniturile transportând pe rutele pe care oricum călătorești.',
    color: 'blue',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Program flexibil',
    description: 'Tu decizi când și cât lucrezi. Fără obligații, în ritmul tău.',
    color: 'purple',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const colorClasses: Record<string, { iconBg: string; border: string; hoverBorder: string; hoverGradient: string; shadow: string }> = {
  green: {
    iconBg: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/30',
    hoverBorder: 'hover:border-green-500/30',
    hoverGradient: 'group-hover:from-green-500/5 group-hover:to-green-500/10',
    shadow: 'shadow-green-500/20',
  },
  blue: {
    iconBg: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-500/30',
    hoverGradient: 'group-hover:from-blue-500/5 group-hover:to-blue-500/10',
    shadow: 'shadow-blue-500/20',
  },
  purple: {
    iconBg: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    hoverBorder: 'hover:border-purple-500/30',
    hoverGradient: 'group-hover:from-purple-500/5 group-hover:to-purple-500/10',
    shadow: 'shadow-purple-500/20',
  },
};

const trustIndicators = [
  '100% gratuit pe perioadă nedeterminată',
  'Contactezi clienții direct - zero comisioane',
  'Activare în 24h',
];

export default function BecomeCourierCTA() {
  return (
    <section className="below-fold py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-900/95 to-slate-900 pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-100 h-100 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-br from-slate-800/90 via-slate-800/70 to-slate-800/90 backdrop-blur-xl border border-white/10 shadow-2xl">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-green-500/5 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-green-500/10 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative p-5 sm:p-6 md:p-10 lg:p-14">
            {/* Icon with animation */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-5 sm:mb-6 md:mb-8 group">
              <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl animate-pulse"></div>
              <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-full h-full rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/40 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h8M8 17a2 2 0 11-4 0m4 0a2 2 0 10-4 0m12 0a2 2 0 11-4 0m4 0a2 2 0 10-4 0M3 9h13a2 2 0 012 2v4H3V9zm13 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v4h13z" />
                </svg>
              </div>
            </div>
            
            {/* Title */}
            <div className="text-center mb-5 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 px-2">
                <span className="bg-linear-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">Vrei să fii </span><span className="bg-linear-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] drop-shadow-[0_0_30px_rgba(52,211,153,0.5)]">Partener de Transport</span><span className="bg-linear-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">?</span>
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
                Găsește clienți pe rutele tale existente. Selectezi zonele pe care le acoperi și serviciile oferite, iar noi îți aducem comenzi pe drumul tău.
              </p>
            </div>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto">
              {courierBenefits.map((benefit) => {
                const colors = colorClasses[benefit.color];
                
                return (
                  <div key={benefit.id} className={`group relative bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/5 ${colors.hoverBorder} transition-all duration-300 active:scale-95 md:hover:-translate-y-1`}>
                    <div className={`absolute inset-0 bg-linear-to-br from-transparent to-transparent ${colors.hoverGradient} rounded-xl sm:rounded-2xl transition-all duration-300`}></div>
                    <div className="relative">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl bg-linear-to-br ${colors.iconBg} border ${colors.border} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg ${colors.shadow}`}>
                        {benefit.icon}
                      </div>
                      <h3 className="text-white font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-center">{benefit.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm text-center leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
              <Link 
                href="/register?role=curier" 
                className="group/btn relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 text-white font-bold rounded-xl transition-all active:scale-95 md:hover:scale-105 text-base sm:text-lg min-h-12 overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 via-pink-500 to-orange-500 transition-transform group-hover/btn:scale-110"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-500 to-orange-500 rounded-xl blur-lg opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
                
                {/* Content */}
                <span className="relative z-10">Înregistrează-te Gratuit</span>
                <svg className="relative z-10 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/despre-parteneri" 
                className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 rounded-xl font-semibold text-base sm:text-lg min-h-12 bg-slate-800/60 backdrop-blur-sm border-2 border-slate-700/60 text-gray-200 hover:text-white hover:bg-slate-700/80 hover:border-slate-600 transition-all active:scale-95 md:hover:scale-105 shadow-lg"
              >
                <span>Află Mai Multe</span>
                <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 pt-8 border-t border-white/5">
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-white">{indicator}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
