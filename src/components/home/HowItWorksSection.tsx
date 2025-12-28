'use client';

const steps = [
  {
    id: 1,
    label: 'PASUL 01',
    title: 'Selectează serviciul',
    description: 'Alege tipul de transport și destinația pentru trimiterea ta.',
    color: 'orange',
    icon: (
      <svg className="w-7 h-7 sm:w-9 sm:h-9 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 2,
    label: 'PASUL 02',
    title: 'Primește oferte',
    description: 'Transportatorii disponibili îți trimit oferte personalizate și competitive.',
    color: 'green',
    icon: (
      <svg className="w-7 h-7 sm:w-9 sm:h-9 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 3,
    label: 'PASUL 03',
    title: 'Alege transportatorul',
    description: 'Compară prețurile, recenziile și alege transportatorul potrivit pentru tine.',
    color: 'blue',
    icon: (
      <svg className="w-7 h-7 sm:w-9 sm:h-9 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 4,
    label: 'PASUL 04',
    title: 'Lasă o recenzie',
    description: 'Ajută comunitatea lăsând feedback despre experiența ta cu transportatorul.',
    color: 'yellow',
    icon: (
      <svg className="w-7 h-7 sm:w-9 sm:h-9 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

const colorClasses: Record<string, { bg: string; border: string; hoverBorder: string; label: string; line: string }> = {
  orange: {
    bg: 'from-orange-500/20 to-orange-600/10',
    border: 'border-orange-500/20',
    hoverBorder: 'group-hover:border-orange-500/40',
    label: 'bg-orange-500/10 text-orange-400',
    line: 'from-orange-500/50',
  },
  green: {
    bg: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/20',
    hoverBorder: 'group-hover:border-green-500/40',
    label: 'bg-green-500/10 text-green-400',
    line: 'from-green-500/50',
  },
  blue: {
    bg: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/20',
    hoverBorder: 'group-hover:border-blue-500/40',
    label: 'bg-blue-500/10 text-blue-400',
    line: 'from-blue-500/50',
  },
  yellow: {
    bg: 'from-yellow-500/20 to-amber-600/10',
    border: 'border-yellow-500/20',
    hoverBorder: 'group-hover:border-yellow-500/40',
    label: 'bg-yellow-500/10 text-yellow-400',
    line: 'from-yellow-500/50',
  },
};

export default function HowItWorksSection() {
  return (
    <section className="below-fold py-12 sm:py-16 md:py-24 px-3 sm:px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-orange-500/10 text-orange-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Simplu și rapid
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            <span className="text-white">Cum </span>
            <span className="text-gradient">funcționează</span>
            <span className="text-white">?</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto px-4">
            În doar 4 pași simpli, transportul tău ajunge la destinație în siguranță.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const colors = colorClasses[step.color];
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.id} className="relative group">
                {/* Connector line - hide on last item */}
                {!isLast && (
                  <div className={`hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-linear-to-r ${colors.line} to-transparent`}></div>
                )}
                
                <div className="text-center">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-linear-to-br ${colors.bg} border ${colors.border} flex items-center justify-center group-hover:scale-110 ${colors.hoverBorder} transition-all duration-300`}>
                    {step.icon}
                  </div>
                  <div className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full ${colors.label} text-[10px] sm:text-xs font-bold mb-2 sm:mb-3`}>
                    {step.label}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1.5 sm:mb-2 px-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm px-2">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
