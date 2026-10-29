'use client';

import React from 'react';

interface BrandHeaderProps {
  variant?: 'full' | 'compact';
}

export default function BrandHeader({ variant = 'full' }: BrandHeaderProps) {
  return (
    <header className="text-center" role="banner">
      {variant === 'full' ? (
        <>
          <div className="flex items-center justify-center gap-3 mb-1">
            {/* Logo treatment — text-based since no logo file provided */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #C0392B 0%, #D4AF37 100%)',
                boxShadow: '0 0 20px rgba(212,175,55,0.4)',
              }}
              aria-hidden="true"
            >
              P
            </div>
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-[#D4AF37] opacity-80">
                Paradigm Institute
              </p>
              <p className="text-xs text-white/50 tracking-wider">Kagadi, Uganda</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #C0392B 0%, #D4AF37 100%)' }}
            aria-hidden="true"
          >
            P
          </div>
          <span className="text-sm font-semibold text-white/80 tracking-wide">
            Paradigm Institute
          </span>
        </div>
      )}
    </header>
  );
}
