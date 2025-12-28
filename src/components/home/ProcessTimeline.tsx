'use client';

import Link from 'next/link';

const timelineSteps = [
  {
    id: 1,
    title: 'Completezi formularul',
    description: 'Alegi serviciul, destinația și completezi detaliile despre ce vrei să transporți. Procesul e simplu și rapid.',
    timeLabel: '2 MINUTE',
    timeColor: 'orange',
    side: 'left',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    gradient: 'from-orange-500 to-orange-600',
    shadow: 'shadow-orange-500/30',
    timeIcon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Primești oferte',
    description: 'Transportatorii disponibili pe ruta ta văd cererea și îți trimit oferte personalizate cu prețuri competitive.',
    timeLabel: '2-24 ORE',
    timeColor: 'green',
    side: 'right',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    gradient: 'from-green-500 to-emerald-600',
    shadow: 'shadow-green-500/30',
    timeIcon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Compari și alegi',
    description: 'Vezi toate ofertele, compari prețurile, citești recenziile și alegi transportatorul care ți se potrivește cel mai bine.',
    timeLabel: '5-10 MINUTE',
    timeColor: 'blue',
    side: 'left',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    gradient: 'from-blue-500 to-cyan-600',
    shadow: 'shadow-blue-500/30',
    timeIcon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Confirmi detaliile',
    description: 'Comunici direct cu transportatorul ales, negociezi detalii suplimentare dacă e nevoie și confirmi comanda finală.',
    timeLabel: 'INSTANT',
    timeColor: 'purple',
    side: 'right',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    gradient: 'from-purple-500 to-pink-600',
    shadow: 'shadow-purple-500/30',
    timeIcon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Transportul e realizat',
    description: 'Transportatorul ridică și livrează conform acordului. Primești actualizări pe parcurs și confirmare la finalizare.',
    timeLabel: 'CONFORM ACORDULUI',
    timeColor: 'amber',
    side: 'left',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    gradient: 'from-amber-500 to-orange-600',
    shadow: 'shadow-amber-500/30',
    timeIcon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Lași o recenzie',
    description: 'Ajuți comunitatea lăsând o recenzie bazată pe experiența ta. Feedback-ul tău contează pentru alți utilizatori.',
    timeLabel: 'OPȚIONAL',
    timeColor: 'yellow',
    side: 'right',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    gradient: 'from-yellow-500 to-amber-600',
    shadow: 'shadow-yellow-500/30',
    timeIcon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  },
];

const timeColorClasses: Record<string, { bg: string; border: string; text: string }> = {
  orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400' },
  green: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/30', text: 'text-amber-400' },
  yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' },
};

export default function ProcessTimeline() {
  return (
    <section className="below-fold py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-linear-to-b from-slate-900/50 to-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-orange-500/10 text-orange-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Procesul complet
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-3">
            <span className="text-white">De la comandă la </span>
            <span className="text-gradient">livrare</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Urmărește fiecare pas al procesului de transport - simplu, transparent și eficient
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line - hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-linear-to-b from-orange-500 via-green-500 to-purple-500"></div>

          {/* Timeline Steps */}
          <div className="space-y-8 sm:space-y-10 md:space-y-12">
            {timelineSteps.map((step) => {
              const timeColors = timeColorClasses[step.timeColor];
              const isLeft = step.side === 'left';
              
              return (
                <div key={step.id} className="relative flex flex-col md:flex-row items-center gap-4 sm:gap-5 md:gap-6">
                  {/* Left text for left-side items */}
                  {isLeft ? (
                    <>
                      <div className="md:w-1/2 md:text-right md:pr-8 w-full order-1 md:order-0">
                        <div className="text-center md:text-right w-full">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 px-3 md:px-0">{step.title}</h3>
                          <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-3 md:px-0 mb-2 sm:mb-3">
                            {step.description}
                          </p>
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${timeColors.bg} border ${timeColors.border} ${timeColors.text} text-[11px] sm:text-xs font-bold`}>
                            {step.timeIcon}
                            {step.timeLabel}
                          </div>
                        </div>
                      </div>
                      {/* Icon */}
                      <div className="relative shrink-0 order-2 md:order-0">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br ${step.gradient} flex items-center justify-center shadow-lg ${step.shadow} border-4 border-slate-900`}>
                          {step.icon}
                        </div>
                      </div>
                      <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
                    </>
                  ) : (
                    <>
                      <div className="md:w-1/2 md:pr-8 hidden md:block"></div>
                      {/* Right text for right-side items */}
                      <div className="md:w-1/2 md:pl-8 w-full text-center md:text-left order-1 md:order-3">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 px-3 md:px-0">{step.title}</h3>
                        <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-3 md:px-0 mb-2 sm:mb-3">
                          {step.description}
                        </p>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${timeColors.bg} border ${timeColors.border} ${timeColors.text} text-[11px] sm:text-xs font-bold`}>
                          {step.timeIcon}
                          {step.timeLabel}
                        </div>
                      </div>
                      {/* Icon */}
                      <div className="relative shrink-0 order-2 md:order-2">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br ${step.gradient} flex items-center justify-center shadow-lg ${step.shadow} border-4 border-slate-900`}>
                          {step.icon}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 sm:mt-12 md:mt-14 text-center px-3">
          <Link 
            href="/comanda"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all active:scale-95 md:hover:scale-105 text-sm sm:text-base min-h-12 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto"
          >
            <span>Solicită oferte gratuit</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">Gratuit și fără obligații • Primești oferte în 24h</p>
        </div>
      </div>
    </section>
  );
}
