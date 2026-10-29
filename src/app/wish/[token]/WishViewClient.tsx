'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BrandHeader from '@/components/christmas/BrandHeader';
import ChristmasLights from '@/components/christmas/ChristmasLights';
import SnowEffect from '@/components/christmas/SnowEffect';
import StarField from '@/components/christmas/StarField';
import Footer from '@/components/christmas/Footer';
import { GreetingCard } from '@/components/ui/GreetingCard';
import ShareModal from '@/components/ui/ShareModal';
import ConfettiEffect from '@/components/ui/ConfettiEffect';
import { audioChimes } from '@/components/ui/AudioChimes';
import { trackEvent } from '@/lib/analytics';
import type { Wish } from '@/types';
import { Sparkles, Share2, ArrowLeft, Heart } from 'lucide-react';

interface WishViewClientProps {
  wish: Wish;
}

export default function WishViewClient({ wish }: WishViewClientProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    trackEvent('wish_link_opened', { wish_id: wish.public_token });
    audioChimes.playTwinkle();
  }, [wish.public_token]);

  return (
    <div className="relative min-h-screen bg-[#0A1628] text-white flex flex-col justify-between overflow-hidden">
      <StarField />
      <SnowEffect />
      <ConfettiEffect active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        token={wish.public_token}
        senderName={wish.display_name}
        cardRef={cardRef}
      />

      {/* Top Lights */}
      <div className="relative z-10">
        <ChristmasLights count={12} />
      </div>

      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-4 py-8 text-center flex flex-col items-center justify-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <BrandHeader variant="compact" />
        </div>

        {/* Greeting Banner */}
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40 mb-3 pulse-glow">
            🎄 A Christmas Greeting Just For You
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Merry Christmas,{' '}
            <span className="gold-shimmer">{wish.display_name}</span>!
          </h1>
        </div>

        {/* Card Component */}
        <div className="w-full max-w-lg mb-8">
          <GreetingCard
            ref={cardRef}
            displayName={wish.display_name}
            recipientType={wish.recipient_type}
            personalMessage={wish.personal_message}
          />
        </div>

        {/* Share & Download Action */}
        <div className="flex justify-center items-center w-full max-w-sm mb-8">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="btn-gold w-full flex items-center justify-center gap-2 py-3 px-6 text-xs shadow-lg"
          >
            <Share2 className="w-4 h-4" />
            <span>Share & Download Card</span>
          </button>
        </div>

        {/* Viral Forward Loop Card */}
        <div className="w-full max-w-lg festive-card p-6 border border-[#27AE60]/40 text-left bg-gradient-to-r from-[#0D4A28]/40 to-[#142850]/40">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#27AE60]/20 text-[#27AE60] flex items-center justify-center shrink-0 text-xl">
              🎁
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-white mb-1">
                Pass the Christmas Joy Forward!
              </h3>
              <p className="text-xs text-white/70 mb-3 leading-relaxed">
                Create your own customized Christmas card and surprise a friend, parent, teacher, or student today.
              </p>
              <Link
                href={`/create?from=${wish.public_token}`}
                className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-2 shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Your Own Wish</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

