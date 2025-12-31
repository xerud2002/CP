'use client';

const missionPoints = [
  {
    id: 1,
    title: 'Conectăm clienții cu transportatori de încredere',
    description: 'Platforma noastră pune în legătură directă clienții cu companii de transport verificate, eliminând intermediarii și simplificând procesul.',
    color: 'orange',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
        <path 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Protejăm împotriva fraudei',
    description: 'Fiecare transportator trece printr-un proces de verificare. Monitorizăm activitatea și eliminăm operatorii neseriosi pentru siguranța ta.',
    color: 'emerald',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
        <path 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Transparență prin recenzii reale',
    description: 'Citește experiențele altor clienți înainte să alegi. Recenziile oneste te ajută să iei decizia corectă și mențin calitatea serviciilor.',
    color: 'blue',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
        <path 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
  },
];

const colorClasses: Record<string, { 
  bg: string; 
  iconBg: string;
  iconText: string;
  border: string; 
  dot: string;
}> = {
  orange: {
    bg: 'bg-orange-500/5',
    iconBg: 'bg-orange-500/15',
    iconText: 'text-orange-400',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    dot: 'bg-orange-500',
  },
  emerald: {
    bg: 'bg-emerald-500/5',
    iconBg: 'bg-emerald-500/15',
    iconText: 'text-emerald-400',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    dot: 'bg-emerald-500',
  },
  blue: {
    bg: 'bg-blue-500/5',
    iconBg: 'bg-blue-500/15',
    iconText: 'text-blue-400',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    dot: 'bg-blue-500',
  },
};

export default function HowItWorksSection() {
  return (
    <section className="below-fold py-16 sm:py-20 md:py-28 px-4 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium mb-4">
            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            De ce existăm
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-white via-orange-100 to-white bg-clip-text text-transparent">Misiunea </span>
            <span className="bg-linear-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto] drop-shadow-[0_0_30px_rgba(251,146,60,0.5)]">noastră</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Construim o piață de transport sigură și transparentă, unde calitatea serviciilor este garantată de comunitate.
          </p>
        </div>

        {/* Mission Points Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {missionPoints.map((point) => {
            const colors = colorClasses[point.color];
            
            return (
              <div key={point.id} className="relative group">
                {/* Card */}
                <div className={`relative h-full p-6 sm:p-8 rounded-2xl ${colors.bg} border ${colors.border} transition-all duration-300 group-hover:-translate-y-1`}>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {point.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-xl font-bold text-white mb-3">
                      {point.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Transportatori verificați</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Recenzii autentice</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Comunicare directă</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
