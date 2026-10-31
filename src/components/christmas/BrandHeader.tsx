'use client';

import React from 'react';
import ChristmasFlower from '@/components/christmas/botanical/ChristmasFlower';
import AsmartLogo from '@/components/christmas/AsmartLogo';

interface BrandHeaderProps {
  variant?: 'full' | 'compact';
  showCompactName?: boolean;
}

/** Small sprigs flanking the wordmark — botanical framing without crowding the logo. */
function BrandSprig({ flip = false, size = 34 }: { flip?: boolean; size?: number }) {
  return (
    <span className="floral-float hidden shrink-0 opacity-70 sm:inline-block" aria-hidden="true" style={{ animationDuration: '10s', animationDelay: flip ? '-3.1s' : '-1.2s' }}>
      <ChristmasFlower kind="evergreen" size={size} detail="low" glow={false} snow={false} flipX={flip} angle={flip ? 8 : -8} seed={flip ? 41 : 37} />
    </span>
  );
}

export default function BrandHeader({
  variant = 'full',
  showCompactName = true,
}: BrandHeaderProps) {
  return (
    <header className="text-center" role="banner">
      {variant === 'full' ? (
        <div className="flex items-center justify-center gap-3 mb-1">
          <BrandSprig flip size={38} />
          <AsmartLogo size={48} />
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-[#D4AF37] opacity-80">
              ASMART.TEC
            </p>
            <p className="text-xs text-white/50 tracking-wider">Kagadi, Uganda</p>
          </div>
          <BrandSprig size={38} />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <BrandSprig flip size={28} />
          <AsmartLogo size={34} />
          {showCompactName && (
            <span className="text-sm font-semibold text-white/80 tracking-wide">
              ASMART.TEC
            </span>
          )}
          <BrandSprig size={28} />
        </div>
      )}
    </header>
  );
}
