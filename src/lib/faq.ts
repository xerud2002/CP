/**
 * Frequently Asked Questions data
 * Centralized FAQ content for reuse across support pages
 */

export interface FAQItem {
  question: string;
  answer: string;
  category?: 'transport' | 'livrare' | 'fidelitate' | 'plata' | 'anulare' | 'general';
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Cum pot trimite un colet în Europa?',
    answer: 'Completează formularul de comandă, alege serviciul dorit și vei primi oferte de la curierii noștri parteneri în 24-48 ore.',
    category: 'transport'
  },
  {
    question: 'Cât durează livrarea?',
    answer: 'Timpul de livrare depinde de destinație și serviciul ales. De obicei, livrările în Europa durează între 2-7 zile lucrătoare.',
    category: 'livrare'
  },
  {
    question: 'Cum funcționează programul de fidelitate?',
    answer: 'Câștigi 1 punct pentru fiecare RON cheltuit. Punctele îți aduc reduceri de până la 15% și alte beneficii exclusive.',
    category: 'fidelitate'
  },
  {
    question: 'Ce metode de plată acceptați?',
    answer: 'Acceptăm plata cu card, transfer bancar și numerar la ridicare (în funcție de curier).',
    category: 'plata'
  },
  {
    question: 'Pot anula o comandă?',
    answer: 'Da, poți anula comanda gratuit înainte ca aceasta să fie preluată de curier. După preluare, se pot aplica taxe de anulare.',
    category: 'anulare'
  },
];

/**
 * Get FAQs filtered by category
 */
export function getFAQsByCategory(category?: FAQItem['category']): FAQItem[] {
  if (!category) return FAQ_ITEMS;
  return FAQ_ITEMS.filter(faq => faq.category === category);
}
