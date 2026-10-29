import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import BrandHeader from '@/components/christmas/BrandHeader';
import ChristmasSkit from '@/components/skit/ChristmasSkit';
import SnowEffect from '@/components/christmas/SnowEffect';
import StarField from '@/components/christmas/StarField';
import Footer from '@/components/christmas/Footer';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interactive Christmas Skit | Paradigm Institute, Kagadi',
  description:
    'Experience an uplifting holiday story of hope, community, and learning in Kagadi, Uganda. Tap to uncover blessings and share the festive spirit.',
};

export default function SkitPage() {
  return (
    <div className="relative min-h-screen bg-[#0A1628] text-white flex flex-col justify-between overflow-hidden">
      <StarField />
      <SnowEffect />

      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <BrandHeader variant="compact" />
        </div>

        {/* Skit Component */}
        <ChristmasSkit />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

