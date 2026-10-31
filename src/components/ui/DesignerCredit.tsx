import React from 'react';

export const DESIGNER = {
  name: 'Asiimwe Lucky',
  whatsapp: '+256799654710',
  /** wa.me takes the number in international form without the plus sign. */
  waLink: 'https://wa.me/256799654710',
};

interface DesignerCreditProps {
  className?: string;
}

/**
 * Sits inside the node html2canvas rasterises, so it travels with every
 * downloaded and reshared card as well as showing on screen.
 */
export default function DesignerCredit({ className = '' }: DesignerCreditProps) {
  return (
    <a
      href={DESIGNER.waLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex max-w-full flex-col items-center justify-center gap-0.5 rounded-full border border-[rgba(212,175,55,0.15)] bg-[rgba(10,22,40,0.7)] px-3 py-1 text-center leading-tight text-[rgba(255,255,255,0.55)] transition-colors hover:text-[#F5D76E] ${className}`}
    >
      <span className="text-[9px] uppercase tracking-[0.2em] text-[rgba(212,175,55,0.85)]">
        Designed by {DESIGNER.name}
      </span>
      <span className="text-[9px] tracking-wide text-[rgba(255,255,255,0.45)]">
        WhatsApp {DESIGNER.whatsapp}
      </span>
    </a>
  );
}
