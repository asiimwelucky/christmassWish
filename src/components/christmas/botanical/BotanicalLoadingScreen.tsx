'use client'

import React from 'react'
import AsmartLogo from '@/components/christmas/AsmartLogo'
import ChristmasBotanicalArrangement from './ChristmasBotanicalArrangement'

interface BotanicalLoadingScreenProps {
  label: string
  hint?: string
  className?: string
}

/**
 * Shared festive waiting state for the wish maker and greeting pages.
 */
export default function BotanicalLoadingScreen({
  label,
  hint,
  className = '',
}: BotanicalLoadingScreenProps) {
  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-[#081426] text-white flex flex-col items-center justify-center gap-5 px-6 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-glow absolute inset-0" aria-hidden="true" />

      <div className="loading-card relative flex w-[min(82vw,300px)] aspect-[2/3] items-center justify-center overflow-hidden rounded-[2rem] border border-[#F5D76E]/25 bg-[#0A1628]/70 p-6 text-center shadow-[0_0_70px_rgba(212,175,55,0.12)]">
        <div className="relative z-10 flex flex-col items-center">
          <div className="loading-logo">
            <AsmartLogo size={48} />
          </div>
          <div className="my-5">
            <ChristmasBotanicalArrangement width={200} />
          </div>
          <p className="font-display text-xl font-semibold text-[#F5D76E]">{label}</p>
          <p className="mt-2 max-w-[13rem] text-xs leading-relaxed text-white/65">
            {hint || 'A little Christmas magic is on its way.'}
          </p>
          <div className="loading-progress mt-5 w-36" aria-hidden="true">
            <span />
          </div>
          <span className="mt-3 text-[10px] uppercase tracking-[0.24em] text-white/40">
            Please wait
          </span>
        </div>
      </div>

      <div className="loading-stars" aria-hidden="true">
        <span>✦</span>
        <span>✧</span>
        <span>✦</span>
      </div>
    </div>
  )
}
