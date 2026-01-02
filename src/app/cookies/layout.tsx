import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica Cookies - Curierul Perfect',
  description: 'Informații despre utilizarea cookie-urilor pe platforma Curierul Perfect.',
  alternates: {
    canonical: 'https://curierulperfect.com/cookies',
  },
  openGraph: {
    title: 'Politica Cookies | Curierul Perfect',
    description: 'Cum folosim cookie-urile pe site-ul Curierul Perfect.',
    url: 'https://curierulperfect.com/cookies',
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Curierul Perfect',
  },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
