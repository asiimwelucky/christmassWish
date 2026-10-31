'use client';

import React, { useState, useEffect } from 'react';
import ChristmasFlower from '@/components/christmas/botanical/ChristmasFlower';

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
      className={`py-2 px-4 text-center border-t border-white/10 shrink-0 ${className}`}
      role="contentinfo"
    >
      <div className="max-w-xl mx-auto flex items-center justify-center gap-2 text-[11px] text-white/50">
        <span className="shrink-0 opacity-45" aria-hidden="true">
          <ChristmasFlower kind="evergreen" size={24} detail="low" glow={false} snow={false} flipX angle={-6} seed={53} />
        </span>
        <span className="font-semibold text-white/70">ASMART.TEC</span>
        <span>·</span>
        <span>Kagadi, Uganda</span>
        <span>·</span>
        <span>© {currentYear}</span>
        <span className="shrink-0 opacity-45" aria-hidden="true">
          <ChristmasFlower kind="evergreen" size={24} detail="low" glow={false} snow={false} angle={-6} seed={59} />
        </span>
      </div>
    </footer>
  );
}
