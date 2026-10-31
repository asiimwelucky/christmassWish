import type { Metadata } from 'next';
import { Inter, Playfair_Display, Dancing_Script } from 'next/font/google';
import NowPlaying from '@/components/ui/NowPlaying';
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

const siteUrl =
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Merry Christmas from ASMART.TEC | Kagadi, Uganda',
  description:
    'Share the joy this Christmas! Create a personalized greeting from ASMART.TEC and spread the love with friends and family.',
  keywords: [
    'ASMART.TEC',
    'Christmas Wishes',
    'Kagadi Uganda',
    'Christmas Greeting',
    'Share Christmas',
    'Festive',
  ],
  authors: [{ name: 'ASMART.TEC', url: siteUrl }],
  openGraph: {
    type: 'website',
    locale: 'en_UG',
    url: siteUrl,
    siteName: 'ASMART.TEC Christmas Wishes',
    title: '🎄 Merry Christmas from ASMART.TEC!',
    description:
      'Someone has a special Christmas message for you from ASMART.TEC. Open it, add your name, and share the joy!',
    images: [
      {
        url: '/christmas-hero-bg.jpg',
        width: 1280,
        height: 720,
        alt: 'ASMART.TEC Christmas Wishes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '🎄 Merry Christmas from ASMART.TEC!',
    description: 'A special Christmas message awaits you from ASMART.TEC.',
    images: ['/christmas-hero-bg.jpg'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/asmart-logo-sm.jpg',
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
        <NowPlaying />
      </body>
    </html>
  );
}
