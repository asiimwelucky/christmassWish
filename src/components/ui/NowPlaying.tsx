'use client';

import React, { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { audioChimes, DEFAULT_SONG_TITLE } from '@/components/ui/AudioChimes';

interface NowPlayingProps {
  className?: string;
}

/**
 * The carol autoplays as soon as the wish opens. Browsers refuse sound until
 * the visitor touches the screen, so the loop starts immediately and one-shot
 * gesture listeners unlock the AudioContext on the first tap or keypress. Being
 * muted only silences the bells, so the loop is honest about its own state.
 */
export default function NowPlaying({ className = '' }: NowPlayingProps) {
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    audioChimes.startTheme();

    const gestures = ['pointerdown', 'touchstart', 'keydown'] as const;
    const unlock = () => {
      void audioChimes.resumeAudio();
    };
    gestures.forEach((g) => window.addEventListener(g, unlock, { once: true, passive: true }));

    return () => {
      gestures.forEach((g) => window.removeEventListener(g, unlock));
      audioChimes.stopTheme();
    };
  }, []);

  const toggle = () => {
    if (audioChimes.isThemePlaying()) {
      audioChimes.stopTheme();
      setPlaying(false);
    } else {
      audioChimes.startTheme();
      setPlaying(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause the Christmas carol' : 'Play the Christmas carol'}
      title={playing ? 'Pause the Christmas carol' : 'Play the Christmas carol'}
      className={`flex max-w-full items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#0A1628]/85 px-3 py-1.5 backdrop-blur transition-colors hover:border-[#D4AF37]/75 ${className}`}
    >
      {playing ? (
        <Pause className="h-3.5 w-3.5 shrink-0 text-[#F5D76E]" />
      ) : (
        <Play className="h-3.5 w-3.5 shrink-0 text-[#F5D76E]" />
      )}

      <span className="flex h-3 shrink-0 items-end gap-[2px]" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`eq-bar w-[2px] rounded-full bg-[#D4AF37] ${playing ? 'eq-bar-live' : ''}`}
            style={{ animationDelay: `${i * 0.18}s`, height: playing ? undefined : '4px' }}
          />
        ))}
      </span>

      <span className="hidden shrink-0 text-[9px] uppercase tracking-[0.18em] text-white/45 sm:inline">
        Now playing
      </span>
      <span className="truncate text-[11px] font-semibold italic text-[#F5D76E]">
        {DEFAULT_SONG_TITLE}
      </span>
    </button>
  );
}
