import React from 'react';

interface AsmartLogoProps {
  /** Edge of the white badge in px. */
  size?: number;
  /** Circle for avatars, rounded tile for cards and headers. */
  shape?: 'tile' | 'circle';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The supplied mark carries a pure-white background and its own wordmark, so it
 * sits in a white badge instead of being colour-keyed. A plain <img> is used on
 * purpose: this badge lands inside the node html2canvas rasterises for the
 * WhatsApp download, and a direct same-origin file is the one thing that
 * serializer always paints.
 */
export default function AsmartLogo({
  size = 44,
  shape = 'tile',
  className = '',
  style,
}: AsmartLogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden bg-white ${
        shape === 'circle' ? 'rounded-full' : 'rounded-xl'
      } ${className}`}
      style={{
        width: size,
        height: size,
        padding: Math.round(size * 0.07),
        boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
        ...style,
      }}
    >
      <img
        src={size <= 56 ? '/asmart-logo-sm.jpg' : '/asmart-logo.jpg'}
        alt="ASMART TEC"
        width={size}
        height={size}
        className="h-full w-full object-contain"
        draggable={false}
      />
    </span>
  );
}
