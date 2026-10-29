import type { Metadata } from 'next';
import { Inter, Playfair_Display, Dancing_Script } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
});

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
  weight: ['600', '700'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://christmas.paradigminstitute.ac.ug';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Merry Christmas from Paradigm Institute | Kagadi, Uganda',
  description:
    'Share the joy this Christmas! Create your personalized Christmas greeting from Paradigm Institute, Kagadi, Uganda, and spread the love with friends and family.',
  keywords: [
    'Paradigm Institute',
    'Christmas Wishes',
    'Kagadi Uganda',
    'Christmas Greeting',
    'Share Christmas',
    'Festive',
  ],
  authors: [{ name: 'Paradigm Institute', url: siteUrl }],
  openGraph: {
    type: 'website',
    locale: 'en_UG',
    url: siteUrl,
    siteName: 'Paradigm Institute Christmas Wishes',
    title: '🎄 Merry Christmas from Paradigm Institute!',
    description:
      'Someone has a special Christmas message for you from Paradigm Institute, Kagadi, Uganda. Open it, add your name, and share the joy!',
    images: [
      {
        url: '/christmas-hero-bg.jpg',
        width: 1280,
        height: 720,
        alt: 'Paradigm Institute Christmas Wishes 2024',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎄 Merry Christmas from Paradigm Institute!',
    description: 'A special Christmas message awaits you from Paradigm Institute, Kagadi, Uganda.',
    images: ['/christmas-hero-bg.jpg'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${dancing.variable}`}>
      <body className="antialiased min-h-screen bg-[#0A1628]">
        {children}
      </body>
    </html>
  );
}
