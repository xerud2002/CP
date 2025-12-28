'use client';

const steps = [
  {
    id: 1,
    label: 'PASUL 01',
    title: 'Descrie transportul',
    description: 'Completezi datele despre ce vrei să transporți, de unde și unde - durează 2 minute.',
    color: 'orange',
    icon: (
      <svg className="w-7 h-7 sm:w-9 sm:h-9 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 2,
    label: 'PASUL 02',
    title: 'Primești oferte',
    description: 'Curieri verificați văd comanda ta și îți trimit oferte cu prețuri clare și termene concrete.',
    color: 'green',
    icon: (
      <svg className="w-7 h-7 sm:w-9 sm:h-9 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  },
  {
    id: 3,
    label: 'PASUL 03',
    title: 'Alegi curierul',
    description: 'Vezi rating-ul, recenziile și prețurile. Discuți detaliile și confirmi transportatorul preferat.',
    color: 'blue',
    icon: (
      <svg className="w-7 h-7 sm:w-9 sm:h-9 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 4,
    label: 'PASUL 04',
    title: 'Transport finalizat',
    description: 'După livrare, evaluezi curierul - ajuți următorii clienți să aleagă cu încredere.',
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
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Comandă transport sigur în doar 4 pași simpli - fără telefoane, fără negocieri, fără surprize.
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
