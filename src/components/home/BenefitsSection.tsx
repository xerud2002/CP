'use client';

const benefits = [
  {
    id: 1,
    title: 'Transportatori Verificați',
    description: 'Toți partenerii noștri sunt verificați și au recenzii reale de la clienți. Transport sigur și profesionist garantat.',
    color: 'orange',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Prețuri Competitive',
    description: 'Primești multiple oferte și alegi cea mai bună. Fără comisioane ascunse - plătești exact prețul negociat cu transportatorul.',
    color: 'green',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Contact Direct',
    description: 'Comunici direct cu transportatorul. Negociezi detaliile și primești confirmări în fiecare etapă a transportului.',
    color: 'blue',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    id: 4,
    title: 'Servicii Diverse',
    description: 'De la colete mici la mutări complete, transport persoane, animale de companie și vehicule - toate serviciile într-un singur loc.',
    color: 'purple',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    id: 5,
    title: 'Răspuns Rapid',
    description: 'Postezi cererea și primești oferte în câteva ore. Transportatorii îți răspund rapid pentru a-ți rezolva nevoia urgent.',
    color: 'cyan',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 6,
    title: 'Acoperire Națională și Europeană',
    description: 'Transport național în toată România și internațional în peste 20 țări europene. De la UK la Spania, de la Germania la Italia - acoperire completă.',
    color: 'amber',
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

const colorClasses: Record<string, { border: string; hoverBorder: string; bg: string; iconBg: string }> = {
  orange: {
    border: 'border-white/5',
    hoverBorder: 'hover:border-orange-500/30',
    bg: 'from-orange-500/5',
    iconBg: 'bg-orange-500/20',
  },
  green: {
    border: 'border-white/5',
    hoverBorder: 'hover:border-green-500/30',
    bg: 'from-green-500/5',
    iconBg: 'bg-green-500/20',
  },
  blue: {
    border: 'border-white/5',
    hoverBorder: 'hover:border-blue-500/30',
    bg: 'from-blue-500/5',
    iconBg: 'bg-blue-500/20',
  },
  purple: {
    border: 'border-white/5',
    hoverBorder: 'hover:border-purple-500/30',
    bg: 'from-purple-500/5',
    iconBg: 'bg-purple-500/20',
  },
  cyan: {
    border: 'border-white/5',
    hoverBorder: 'hover:border-cyan-500/30',
    bg: 'from-cyan-500/5',
    iconBg: 'bg-cyan-500/20',
  },
  amber: {
    border: 'border-white/5',
    hoverBorder: 'hover:border-amber-500/30',
    bg: 'from-amber-500/5',
    iconBg: 'bg-amber-500/20',
  },
};

export default function BenefitsSection() {
  return (
    <section className="below-fold py-12 sm:py-16 px-3 sm:px-4 bg-linear-to-b from-slate-900 to-slate-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            Avantajele platformei
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
            <span className="text-white">De ce să alegi </span>
            <span className="text-gradient">Curierul Perfect</span>
            <span className="text-white">?</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Soluție completă de transport național și european pentru orice tip de marfă sau pasageri între România și Europa
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {benefits.map((benefit) => {
            const colors = colorClasses[benefit.color];
            
            return (
              <div
                key={benefit.id}
                className={`group relative bg-slate-800/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${colors.border} ${colors.hoverBorder} transition-all duration-300 active:scale-95 sm:hover:scale-105`}
              >
                <div className={`absolute inset-0 bg-linear-to-br ${colors.bg} to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl ${colors.iconBg} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {benefit.description}
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
