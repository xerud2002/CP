'use client';

const steps = [
  {
    id: 1,
    number: '01',
    title: 'Descrie transportul',
    description: 'Completezi formularul în 2 minute. Spune-ne ce trimiți, de unde și unde - noi ne ocupăm de restul.',
    color: 'orange',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
        <path 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    number: '02',
    title: 'Primești oferte',
    description: 'Transportatori verificați îți trimit oferte personalizate. Vezi prețuri clare, fără surprize ascunse.',
    color: 'emerald',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
        <path 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
        <circle cx="18" cy="5" r="3" fill="currentColor" className="text-emerald-400" />
      </svg>
    ),
  },
  {
    id: 3,
    number: '03',
    title: 'Alegi transportatorul sau compania',
    description: 'Compari recenzii, rating-uri și prețuri. Comunici direct și alegi opțiunea potrivită pentru tine.',
    color: 'blue',
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
    id: 4,
    number: '04',
    title: 'Lași o recenzie',
    description: 'Evaluezi experiența și ajuți comunitatea. Feedback-ul tău contează pentru alți utilizatori.',
    color: 'amber',
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
  number: string;
  dot: string;
  line: string;
}> = {
  orange: {
    bg: 'bg-orange-500/5',
    iconBg: 'bg-orange-500/15',
    iconText: 'text-orange-400',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    number: 'text-orange-500',
    dot: 'bg-orange-500',
    line: 'via-orange-500/30',
  },
  emerald: {
    bg: 'bg-emerald-500/5',
    iconBg: 'bg-emerald-500/15',
    iconText: 'text-emerald-400',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    number: 'text-emerald-500',
    dot: 'bg-emerald-500',
    line: 'via-emerald-500/30',
  },
  blue: {
    bg: 'bg-blue-500/5',
    iconBg: 'bg-blue-500/15',
    iconText: 'text-blue-400',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    number: 'text-blue-500',
    dot: 'bg-blue-500',
    line: 'via-blue-500/30',
  },
  amber: {
    bg: 'bg-amber-500/5',
    iconBg: 'bg-amber-500/15',
    iconText: 'text-amber-400',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    number: 'text-amber-500',
    dot: 'bg-amber-500',
    line: 'via-amber-500/30',
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Simplu și rapid
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Cum </span>
            <span className="text-gradient">funcționează</span>
            <span className="text-white">?</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Transport în 4 pași simpli. Fără bătăi de cap, fără surprize.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, index) => {
            const colors = colorClasses[step.color];
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.id} className="relative group">
                {/* Connection line - desktop only */}
                {!isLast && (
                  <div className="hidden lg:block absolute top-12 left-[60%] right-0 h-px">
                    <div className={`h-full w-full bg-gradient-to-r from-transparent ${colors.line} to-transparent`}></div>
                  </div>
                )}
                
                {/* Card */}
                <div className={`relative h-full p-6 rounded-2xl ${colors.bg} border ${colors.border} transition-all duration-300 group-hover:translate-y-[-4px]`}>
                  {/* Step Number - Top Right */}
                  <div className={`absolute top-4 right-4 text-5xl font-black ${colors.number} opacity-10 select-none`}>
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${colors.dot}`}></span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${colors.number}`}>
                        Pasul {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
