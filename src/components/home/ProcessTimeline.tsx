'use client';

import Link from 'next/link';

const timelineSteps = [
  {
    id: 1,
    title: 'Completezi formularul',
    description: 'Alegi serviciul, introduci adresele și descrii ce vrei să transporți. Simplu, în doar 2 minute.',
    timeLabel: '2 minute',
    color: 'orange',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Primești oferte',
    description: 'Transportatorii disponibili pe ruta ta văd cererea și îți trimit oferte personalizate cu prețuri competitive.',
    timeLabel: '2-24 ore',
    color: 'emerald',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Compari și alegi',
    description: 'Vezi toate ofertele, compari prețurile, citești recenziile și alegi transportatorul perfect pentru tine.',
    timeLabel: '5-10 min',
    color: 'blue',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Confirmi detaliile',
    description: 'Comunici direct cu transportatorul ales prin chat, stabilești detaliile și confirmi comanda.',
    timeLabel: 'Instant',
    color: 'violet',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Transportul e realizat',
    description: 'Transportatorul ridică și livrează coletul. Primești actualizări pe parcurs și confirmare la livrare.',
    timeLabel: 'Conform acordului',
    color: 'amber',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Lași o recenzie',
    description: 'Evaluezi experiența și ajuți comunitatea. Feedback-ul tău contează pentru alți utilizatori.',
    timeLabel: 'Opțional',
    color: 'rose',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

const colorClasses: Record<string, { 
  iconBg: string;
  iconText: string;
  badge: string;
  badgeText: string;
  dot: string;
  line: string;
}> = {
  orange: {
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    iconText: 'text-white',
    badge: 'bg-orange-500/15 border-orange-500/30',
    badgeText: 'text-orange-400',
    dot: 'bg-orange-500',
    line: 'from-orange-500',
  },
  emerald: {
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    iconText: 'text-white',
    badge: 'bg-emerald-500/15 border-emerald-500/30',
    badgeText: 'text-emerald-400',
    dot: 'bg-emerald-500',
    line: 'from-emerald-500',
  },
  blue: {
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconText: 'text-white',
    badge: 'bg-blue-500/15 border-blue-500/30',
    badgeText: 'text-blue-400',
    dot: 'bg-blue-500',
    line: 'from-blue-500',
  },
  violet: {
    iconBg: 'bg-gradient-to-br from-violet-500 to-violet-600',
    iconText: 'text-white',
    badge: 'bg-violet-500/15 border-violet-500/30',
    badgeText: 'text-violet-400',
    dot: 'bg-violet-500',
    line: 'from-violet-500',
  },
  amber: {
    iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
    iconText: 'text-white',
    badge: 'bg-amber-500/15 border-amber-500/30',
    badgeText: 'text-amber-400',
    dot: 'bg-amber-500',
    line: 'from-amber-500',
  },
  rose: {
    iconBg: 'bg-gradient-to-br from-rose-500 to-rose-600',
    iconText: 'text-white',
    badge: 'bg-rose-500/15 border-rose-500/30',
    badgeText: 'text-rose-400',
    dot: 'bg-rose-500',
    line: 'from-rose-500',
  },
};

export default function ProcessTimeline() {
  return (
    <section className="below-fold py-16 sm:py-20 md:py-28 px-4 bg-linear-to-b from-slate-900 via-slate-900/95 to-slate-900 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium mb-4">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Procesul complet
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">De la comandă la </span>
            <span className="text-gradient">livrare</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Urmărește fiecare pas - transparent, simplu și eficient
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - desktop only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <div className="h-full w-full bg-linear-to-b from-orange-500/50 via-emerald-500/50 to-rose-500/50"></div>
          </div>

          {/* Mobile vertical line */}
          <div className="md:hidden absolute left-8 top-0 bottom-0 w-px">
            <div className="h-full w-full bg-linear-to-b from-orange-500/30 via-emerald-500/30 to-rose-500/30"></div>
          </div>

          {/* Steps */}
          <div className="space-y-8 md:space-y-12">
            {timelineSteps.map((step, index) => {
              const colors = colorClasses[step.color];
              const isLeft = index % 2 === 0;
              
              return (
                <div key={step.id} className="relative flex justify-center">
                  {/* Centered card with icon and content, subtle zig-zag */}
                  <div className={`hidden md:flex w-full max-w-2xl mx-auto ${isLeft ? '' : 'flex-row-reverse'}`}>
                    <div className="relative flex items-center w-full bg-slate-900/80 border border-slate-800 rounded-2xl shadow-lg px-6 py-6 gap-6">
                      {/* Vertical line behind icon */}
                      <div className="absolute left-8 top-0 bottom-0 w-px z-0">
                        <div className="h-full w-full bg-linear-to-b from-orange-500/50 via-emerald-500/50 to-rose-500/50"></div>
                      </div>
                      {/* Icon */}
                      <div className="relative z-10 w-16 h-16 flex items-center justify-center rounded-2xl border-2 border-slate-800 bg-slate-900/60 shadow-md mr-4">
                        <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center`}>{step.icon}</div>
                        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full ${colors.dot} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>{step.id}</div>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${colors.badge} mb-3`}>
                          <svg className={`w-3.5 h-3.5 ${colors.badgeText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className={`text-xs font-semibold ${colors.badgeText}`}>{step.timeLabel}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm">{step.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex items-start gap-5">
                    {/* Icon */}
                    <div className="relative z-10 shrink-0">
                      <div className={`w-14 h-14 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center shadow-lg`}>
                        {step.icon}
                      </div>
                      {/* Step number badge */}
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${colors.dot} flex items-center justify-center text-white text-[10px] font-bold shadow`}>
                        {step.id}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${colors.badge} mb-2`}>
                        <svg className={`w-3 h-3 ${colors.badgeText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`text-[11px] font-semibold ${colors.badgeText}`}>{step.timeLabel}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1.5">{step.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 sm:mt-16 text-center">
          <Link 
            href="/comanda"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base"
          >
            <span>Solicită oferte gratuit</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-slate-500 text-sm mt-4 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Gratuit
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Fără obligații
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Oferte în 24h
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
