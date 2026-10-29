'use client';

import React, { useState, useEffect } from 'react';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const [currentYear, setCurrentYear] = useState<number>(2024);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer
      className={`py-8 px-4 text-center border-t border-white/10 ${className}`}
      role="contentinfo"
    >
      <div className="max-w-xl mx-auto space-y-3">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #C0392B 0%, #D4AF37 100%)' }}
            aria-hidden="true"
          >
            P
          </div>
          <span className="text-sm font-semibold text-white/70">Paradigm Institute</span>
        </div>
        <p className="text-xs text-white/40">Kagadi, Uganda — Building Bright Futures</p>

        {/* Privacy note */}
        <p className="text-xs text-white/30 max-w-xs mx-auto leading-relaxed">
          🔒 We collect only anonymous usage statistics — no email, no phone, no registration required.
          {' '}Statistics count browser instances, not verified identities.{' '}
          Data is retained for 90 days.
        </p>

        {/* Copyright */}
        <p className="text-xs text-white/25">
          © {currentYear} Paradigm Institute. All rights reserved.
        </p>

        <p className="text-xs text-white/20">
          🎄 Spreading joy this Christmas season
        </p>
      </div>
    </footer>
  );
}
