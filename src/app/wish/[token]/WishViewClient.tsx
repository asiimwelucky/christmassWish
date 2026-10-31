'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SnowEffect from '@/components/christmas/SnowEffect';
import AsmartLogo from '@/components/christmas/AsmartLogo';
import BotanicalDivider from '@/components/christmas/botanical/BotanicalDivider';
import ChristmasFloralCorner from '@/components/christmas/botanical/ChristmasFloralCorner';
import DesignerCredit from '@/components/ui/DesignerCredit';
import NowPlaying from '@/components/ui/NowPlaying';
import ConfettiEffect from '@/components/ui/ConfettiEffect';
import { audioChimes } from '@/components/ui/AudioChimes';
import { trackEvent } from '@/lib/analytics';
import type { Wish } from '@/types';
import { Repeat } from 'lucide-react';

interface WishViewClientProps {
  wish: Wish;
}

export default function WishViewClient({ wish }: WishViewClientProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    trackEvent('wish_link_opened', { wish_id: wish.public_token });
    audioChimes.playTwinkle();
  }, [wish.public_token]);

  // Handing the wish on keeps the chain alive: the new card records this token
  // as its parent, and its own receiver gets the same button.
  const chainHref = `/create?from=${encodeURIComponent(wish.public_token)}&by=${encodeURIComponent(
    wish.display_name,
  )}`;

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-x-hidden bg-[#0A1628] text-white">
      <SnowEffect />
      <ConfettiEffect active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="relative z-20 flex shrink-0 justify-center px-3 pt-3">
        <NowPlaying />
      </div>

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-3 py-2">
        {/*
          9:16 is the ideal shape, expressed as a MINIMUM height so a long
          message on a short screen grows the card instead of clipping copy.
          Width caps at 56.25svh, which is exactly 9/16 of a full screen —
          hence the 100svh term below.
        */}
        <div
          className="christmas-card relative flex w-full max-w-[56.25svh] flex-col items-center justify-center overflow-hidden border border-[rgba(212,175,55,0.5)] bg-[rgba(16,29,50,0.95)] px-7 py-8 text-center shadow-2xl"
          style={{ minHeight: 'min(calc((100vw - 1.75rem) * 16 / 9), 100svh)' }}
        >
          <div className="christmas-card-frame" aria-hidden="true" />
          {/*
            Botanical frame. Two hero sprays in the top-left/bottom-right
            corners, lighter cream pairs opposite. All orientation happens
            inside the SVGs (never a CSS transform) because this exact node is
            rasterised by html2canvas for the WhatsApp download.
          */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <ChristmasFloralCorner
              corner="top-left"
              sizePct={20}
              density="full"
              style={{ top: 12, left: 12 }}
              seed={5}
            />
            <ChristmasFloralCorner
              corner="bottom-right"
              sizePct={20}
              density="full"
              style={{ bottom: 12, right: 12 }}
              seed={13}
            />
            <ChristmasFloralCorner
              corner="top-right"
              sizePct={12}
              density="light"
              variant="cream"
              sparkles={false}
              style={{ top: 18, right: 18 }}
              seed={21}
            />
            <ChristmasFloralCorner
              corner="bottom-left"
              sizePct={12}
              density="light"
              variant="cream"
              sparkles={false}
              style={{ bottom: 18, left: 18 }}
              seed={29}
            />
          </div>

          {/* Receiver-side branding, in flow above the message so it can never
              be clipped and is part of the downloaded card. */}
          <div className="relative z-10 flex shrink-0 flex-col items-center gap-1.5 pb-6">
            <AsmartLogo size={44} />
            <span className="text-[9px] uppercase tracking-[0.28em] text-[rgba(255,255,255,0.45)]">
              ASMART TEC
            </span>
          </div>

          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#F5D76E]">
              A Christmas wish for you
            </p>
            <h1 className="christmas-title mt-3 font-serif text-[clamp(1.9rem,7svh,2.9rem)] font-bold leading-tight text-white">
              Merry Christmas!
            </h1>
            <div className="my-4 flex justify-center" aria-hidden="true">
              <BotanicalDivider size={24} ruleWidth={50} />
            </div>
            <p className="mx-auto max-w-[19rem] text-[clamp(1.05rem,3svh,1.35rem)] leading-relaxed break-words text-[rgba(255,248,240,0.9)]">
              {wish.personal_message?.trim() ||
                'Wishing you peace, joy, and love this Christmas and throughout the New Year.'}
            </p>
            <p className="mt-6 text-[13px] text-[rgba(255,255,255,0.60)]">With love,</p>
            <p className="mt-1 text-[clamp(1.1rem,3.4svh,1.6rem)] font-semibold break-words text-[#F5D76E]">
              {wish.display_name}
            </p>
            <p className="mx-auto mt-3 max-w-[15rem] text-[10px] tracking-wide text-[rgba(255,255,255,0.45)]">
              {wish.parent_token
                ? 'This wish was passed on — add yours and keep it travelling.'
                : 'Add your own wish and pass the joy on.'}
            </p>
          </div>

          <div className="relative z-10 flex shrink-0 justify-center pt-5">
            <DesignerCredit />
          </div>
        </div>
      </main>

      <div className="relative z-20 shrink-0 px-4 pb-4">
        <div className="mx-auto flex w-[min(92vw,22rem)] flex-col gap-2">
          <Link
            href={chainHref}
            className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider shadow-lg"
          >
            <Repeat className="h-4 w-4" />
            <span>Add your wish &amp; pass it on</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
