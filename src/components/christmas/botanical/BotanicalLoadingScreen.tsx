'use client'

import React from 'react'
import ChristmasBotanicalArrangement from './ChristmasBotanicalArrangement'

interface BotanicalLoadingScreenProps {
  label: string
  hint?: string
  className?: string
}

/**
 * Shared waiting state for the wish maker and the greeting pages: the botanical
 * spray unfolds while the page resolves, instead of a bare spinner.
 */
export default function BotanicalLoadingScreen({
  label,
  hint,
  className = '',
}: BotanicalLoadingScreenProps) {
  return (
    <div
      className={`min-h-screen bg-[#0A1628] text-white flex flex-col items-center justify-center gap-4 px-6 ${className}`}
      role="status"
      aria-live="polite"
    >
      <ChristmasBotanicalArrangement width={280} />

      <div className="text-center">
        <p className="animate-pulse text-sm tracking-wide text-[#F5D76E]">{label}</p>
        {hint && <p className="mt-1.5 text-xs text-white/50">{hint}</p>}
      </div>
    </div>
  )
}
