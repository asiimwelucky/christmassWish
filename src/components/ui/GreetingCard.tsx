'use client';

import React, { forwardRef } from 'react';
import type { RecipientType } from '@/types';
import AsmartLogo from '@/components/christmas/AsmartLogo';
import BotanicalDivider from '@/components/christmas/botanical/BotanicalDivider';
import DesignerCredit from '@/components/ui/DesignerCredit';

interface GreetingCardProps {
  displayName: string;
  recipientType?: RecipientType;
  personalMessage?: string | null;
  className?: string;
}

const RECIPIENT_LABELS: Record<RecipientType, string> = {
  friend: 'To a Cherished Friend',
  family: 'To Beloved Family',
  student: 'To an Inspiring Student',
  teacher: 'To an Esteemed Teacher',
  colleague: 'To a Valued Colleague',
  everyone: 'Special Christmas Blessing',
};

export const GreetingCard = forwardRef<HTMLDivElement, GreetingCardProps>(
  ({ displayName, recipientType = 'everyone', personalMessage, className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-3xl px-5 py-6 sm:px-7 sm:py-7 text-center select-none shadow-2xl ${className}`}
        style={{
          background: 'radial-gradient(ellipse at top, #142850 0%, #0A1628 70%, #060D18 100%)',
          border: '2px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 0 35px rgba(212, 175, 55, 0.2), inset 0 0 40px rgba(0,0,0,0.4)',
        }}
      >
        <div className="relative" style={{ zIndex: 1 }}>
          {/* Brand Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <AsmartLogo size={34} />
            <p className="text-left text-[10px] font-semibold uppercase tracking-widest text-[#D4AF37]">
              ASMART.TEC
            </p>
          </div>

          {/* Recipient Tag */}
          <div className="inline-block px-3 py-1 rounded-full bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] text-[#F5D76E] text-xs font-medium tracking-wide mb-3">
            {RECIPIENT_LABELS[recipientType] || 'Special Christmas Blessing'}
          </div>

          {/* Heading */}
          <h2
            className="font-script text-5xl sm:text-6xl font-bold text-white mb-2 tracking-tight"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            Merry Christmas!
          </h2>

          {/* Name Highlight */}
          <div className="my-3">
            <p className="text-xs uppercase tracking-widest text-[rgba(255,255,255,0.60)] mb-1">Specially for</p>
            <span
              className="text-2xl sm:text-3xl font-bold tracking-wide"
              style={{
                // Solid gold, not gradient-clipped text: html2canvas paints a
                // background-clip:text gradient as a filled rectangle, which
                // buries the recipient's name in the downloaded card.
                color: '#F5D76E',
                textShadow: '0 0 18px rgba(212,175,55,0.55), 0 2px 8px rgba(0,0,0,0.5)',
                fontFamily: 'var(--font-playfair), serif',
              }}
            >
              {displayName || 'You'}
            </span>
          </div>

          {/* Botanical rule */}
          <div className="flex justify-center my-4">
            <BotanicalDivider size={26} ruleWidth={54} />
          </div>

          {/* Body Message — narrower than the card so the corner sprays stay behind empty margins */}
          <p className="text-sm sm:text-base text-[rgba(255,248,240,0.9)] leading-relaxed max-w-[17.5rem] mx-auto mb-4 font-light">
            May the wonder, peace, and boundless joy of Christmas touch your heart and brighten your home.
            Wishing you a brilliant season and an inspiring New Year ahead!
          </p>

          {/* Personal Note if provided */}
          {personalMessage && (
            <div className="my-4 p-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(212,175,55,0.25)] max-w-[17.5rem] mx-auto text-left">
              <p className="text-[11px] text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
                Personal Note
              </p>
              <p className="text-base italic text-[rgba(255,255,255,0.95)] leading-relaxed break-words">
                &ldquo;{personalMessage}&rdquo;
              </p>
            </div>
          )}

          {/* Brand signature */}
          <div className="pt-4 mt-4 border-t-[rgba(255,255,255,0.10)] mx-auto max-w-[15rem]">
            <p className="text-[11px] text-[rgba(212,175,55,0.8)] tracking-wide">
              ASMART.TEC
            </p>
          </div>
          <DesignerCredit className="mt-4" />
        </div>
      </div>
    );
  }
);

GreetingCard.displayName = 'GreetingCard';
