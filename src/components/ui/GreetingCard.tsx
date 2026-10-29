'use client';

import React, { forwardRef } from 'react';
import type { RecipientType } from '@/types';

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
        className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 text-center select-none shadow-2xl ${className}`}
        style={{
          background: 'radial-gradient(ellipse at top, #142850 0%, #0A1628 70%, #060D18 100%)',
          border: '2px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 0 35px rgba(212, 175, 55, 0.2), inset 0 0 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Decorative corner flourishes */}
        <div className="absolute top-3 left-4 text-xl opacity-75 text-[#D4AF37]" aria-hidden="true">
          ✦ ❅
        </div>
        <div className="absolute top-3 right-4 text-xl opacity-75 text-[#D4AF37]" aria-hidden="true">
          ❅ ✦
        </div>
        <div className="absolute bottom-3 left-4 text-xl opacity-75 text-[#D4AF37]" aria-hidden="true">
          ❅ ✦
        </div>
        <div className="absolute bottom-3 right-4 text-xl opacity-75 text-[#D4AF37]" aria-hidden="true">
          ✦ ❅
        </div>

        {/* Institution Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #C0392B 0%, #D4AF37 100%)' }}
          >
            P
          </div>
          <div className="text-left">
            <p className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">
              Paradigm Institute
            </p>
            <p className="text-[9px] text-white/50 tracking-wide">Kagadi, Uganda</p>
          </div>
        </div>

        {/* Recipient Tag */}
        <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5D76E] text-xs font-medium tracking-wide mb-3">
          {RECIPIENT_LABELS[recipientType] || 'Special Christmas Blessing'}
        </div>

        {/* Heading */}
        <h2
          className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2 tracking-tight"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
        >
          Merry Christmas!
        </h2>

        {/* Name Highlight */}
        <div className="my-3">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-1">Specially for</p>
          <span
            className="text-2xl sm:text-3xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#F5D76E] via-[#FFF8F0] to-[#D4AF37]"
            style={{
              textShadow: '0 0 20px rgba(212,175,55,0.4)',
              fontFamily: 'var(--font-playfair), serif',
            }}
          >
            {displayName || 'You'}
          </span>
        </div>

        {/* Central Decorative Ribbon */}
        <div className="flex items-center justify-center gap-2 my-4 text-[#D4AF37]/60">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <span className="text-sm">🎄 🎁 🌟</span>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>

        {/* Body Message */}
        <p className="text-sm sm:text-base text-[#FFF8F0]/90 leading-relaxed max-w-md mx-auto mb-4 font-light">
          May the wonder, peace, and boundless joy of Christmas touch your heart and brighten your home.
          Wishing you a brilliant season and an inspiring New Year ahead!
        </p>

        {/* Personal Note if provided */}
        {personalMessage && (
          <div className="my-4 p-4 rounded-xl bg-white/[0.04] border border-[#D4AF37]/25 max-w-md mx-auto text-left">
            <p className="text-[11px] text-[#D4AF37] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>💌</span> Personal Note
            </p>
            <p className="text-sm italic text-white/95 leading-snug break-words">
              &ldquo;{personalMessage}&rdquo;
            </p>
          </div>
        )}

        {/* Institute Motto */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
          <span>Building Bright Futures</span>
          <span className="text-[#D4AF37]/80">christmas.paradigminstitute.ac.ug</span>
        </div>
      </div>
    );
  }
);

GreetingCard.displayName = 'GreetingCard';

