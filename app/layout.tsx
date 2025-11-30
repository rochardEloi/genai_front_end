import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Horizon IA - Réussis ton bac malgré l\'insécurité',
    template: '%s | Horizon IA',
  },
  description: 'L\'éducation sans limite pour les élèves haïtiens. Diagnostic automatique, exercices adaptatifs, explications interactives et dashboard de progression.',
  keywords: [
    'éducation',
    'Haïti',
    'baccalauréat',
    'IA',
    'apprentissage',
    'exercices',
    'cours',
    'diagnostic',
  ],
  authors: [{ name: 'Horizon IA' }],
  creator: 'Horizon IA Team',
  openGraph: {
    type: 'website',
    locale: 'fr_HT',
    url: 'https://horizon-ia.com',
    title: 'Horizon IA - Plateforme d\'apprentissage',
    description: 'L\'éducation sans limite pour les élèves haïtiens',
    siteName: 'Horizon IA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horizon IA',
    description: 'L\'éducation sans limite pour les élèves haïtiens',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
