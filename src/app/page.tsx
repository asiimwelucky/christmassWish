'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BrandHeader from '@/components/christmas/BrandHeader';
import ChristmasLights from '@/components/christmas/ChristmasLights';
import ChristmasTree from '@/components/christmas/ChristmasTree';
import SnowEffect from '@/components/christmas/SnowEffect';
import StarField from '@/components/christmas/StarField';
import Footer from '@/components/christmas/Footer';
import FallingPetals from '@/components/christmas/botanical/FallingPetals';
import FloatingChristmasFlowers from '@/components/christmas/botanical/FloatingChristmasFlowers';
import ChristmasFlower from '@/components/christmas/botanical/ChristmasFlower';
import DesignerCredit from '@/components/ui/DesignerCredit';
import { trackEvent } from '@/lib/analytics';
import { Sparkles } from 'lucide-react';

interface CampaignData {
  show_public_counter: boolean;
  total_wishes_created: number | null;
  campaign_name: string;
  is_active: boolean;
}

export default function HomePage() {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);

  useEffect(() => {
    trackEvent('page_view', { campaign_source: 'direct' });

    fetch('/api/campaign')
      .then((res) => res.json())
      .then((data) => setCampaign(data))
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A1628] text-white flex flex-col justify-between overflow-x-hidden select-none">
      {/* Dynamic Backgrounds */}
      <StarField />
      <SnowEffect />
      <FloatingChristmasFlowers />
      <FallingPetals count={6} />

      {/* Top Christmas Lights */}
      <div className="relative z-10 shrink-0">
        <ChristmasLights count={14} />
      </div>

      {/* Main Hero - Centered and Single-Screen Fit */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2 max-w-3xl mx-auto w-full text-center my-auto">
        {/* Brand Header */}
        <div className="mb-2">
          <BrandHeader variant="compact" />
        </div>

        {/* Live Counter Badge */}
        {campaign?.show_public_counter && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F5D76E] text-xs font-semibold tracking-wide mb-3 shadow-md pulse-glow">
            <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-ping" />
            <span>
              {campaign.total_wishes_created !== null
                ? `${campaign.total_wishes_created.toLocaleString()} Festive Wishes Shared So Far!`
                : 'Spreading Christmas Joy Across Kagadi!'}
            </span>
          </div>
        )}

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-tight mb-2 text-white leading-tight">
          Merry Christmas from{' '}
          <span className="gold-shimmer block sm:inline">ASMART.TEC</span>
        </h1>

        <p className="text-sm sm:text-base text-[#FFF8F0]/85 max-w-lg mx-auto mb-3 font-light leading-relaxed">
          Celebrate hope, connection, and learning this festive season. Create a customized greeting for someone you cherish and share the Christmas cheer!
        </p>

        {/* Christmas Tree framed by blooms */}
        <div className="mb-3 flex items-end justify-center gap-2 sm:gap-5">
          <span className="floral-float hidden shrink-0 lg:inline-block" style={{ animationDuration: '11s', animationDelay: '-2.4s' }}>
            <ChristmasFlower kind="holly" size={72} angle={-12} glow={false} detail="low" seed={23} />
          </span>

          <div className="transform scale-90 sm:scale-100 origin-center">
            <ChristmasTree size="sm" />
          </div>

          <span className="floral-float hidden shrink-0 lg:inline-block" style={{ animationDuration: '9.5s', animationDelay: '-0.8s' }}>
            <ChristmasFlower kind="white-poinsettia" size={66} detail="low" seed={29} />
          </span>
        </div>

        {/* Call to Action */}
        <div className="w-full max-w-xs mx-auto">
          <Link
            href="/create"
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm sm:text-base shadow-2xl tracking-wide uppercase font-bold"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create Christmas Wish</span>
          </Link>
          <DesignerCredit className="mt-3" />
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10 shrink-0">
        <Footer />
      </div>
    </div>
  );
}
