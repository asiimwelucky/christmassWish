'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BrandHeader from '@/components/christmas/BrandHeader';
import ChristmasLights from '@/components/christmas/ChristmasLights';
import ChristmasTree from '@/components/christmas/ChristmasTree';
import SnowEffect from '@/components/christmas/SnowEffect';
import StarField from '@/components/christmas/StarField';
import Footer from '@/components/christmas/Footer';
import { trackEvent } from '@/lib/analytics';
import { Sparkles, Play, Share2, Heart, Award, ShieldCheck } from 'lucide-react';

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
    <div className="relative min-h-screen bg-[#0A1628] text-white flex flex-col justify-between overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Dynamic Backgrounds */}
      <StarField />
      <SnowEffect />

      {/* Top Christmas Lights */}
      <div className="relative z-10">
        <ChristmasLights count={14} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full text-center">
        {/* Brand Header */}
        <div className="mb-6">
          <BrandHeader variant="full" />
        </div>

        {/* Live Counter Badge */}
        {campaign?.show_public_counter && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F5D76E] text-xs font-semibold tracking-wide mb-6 shadow-md pulse-glow">
            <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-ping" />
            <span>
              {campaign.total_wishes_created !== null
                ? `${campaign.total_wishes_created.toLocaleString()} Festive Wishes Shared So Far!`
                : 'Spreading Christmas Joy Across Kagadi!'}
            </span>
          </div>
        )}

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-serif font-extrabold tracking-tight mb-4 text-white">
          Merry Christmas from{' '}
          <span className="gold-shimmer block sm:inline">Paradigm Institute</span>
        </h1>

        <p className="text-base sm:text-xl text-[#FFF8F0]/85 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Celebrate hope, connection, and learning this festive season. Create a customized greeting for someone you cherish, or explore our interactive holiday story!
        </p>

        {/* Interactive Christmas Tree Display */}
        <div className="mb-8">
          <ChristmasTree size="md" />
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-12">
          <Link
            href="/create"
            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 text-base shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create Christmas Wish</span>
          </Link>

          <Link
            href="/skit"
            className="btn-outline w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 text-base bg-white/5 border border-[#D4AF37]/60"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Watch Christmas Skit</span>
          </Link>
        </div>

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl text-left">
          <div className="festive-card p-5 border border-white/10 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#C0392B]/20 text-[#E74C3C] flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-white mb-1">Send to Anyone</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Personalized for friends, family, students, teachers, or colleagues.
            </p>
          </div>

          <div className="festive-card p-5 border border-white/10 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#F5D76E] flex items-center justify-center mb-3">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-white mb-1">Instant WhatsApp Share</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              One-click WhatsApp sharing, downloadable PNG cards, or direct links.
            </p>
          </div>

          <div className="festive-card p-5 border border-white/10 hover:border-[#D4AF37]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#27AE60]/20 text-[#27AE60] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-white mb-1">100% Free & Private</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              No registration or phone numbers required. Instant, secure, and ad-free.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
