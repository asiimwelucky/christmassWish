'use client';

import { useEffect } from 'react';
import { audioChimes } from '@/components/ui/AudioChimes';

/** Start the background carol after the browser allows audio from a gesture. */
export default function NowPlaying() {
  useEffect(() => {
    const gestures = ['pointerdown', 'touchend', 'keydown'] as const;
    let unlocking = false;
    let unlocked = false;

    const unlock = () => {
      if (unlocking || unlocked) return;
      unlocking = true;

      void audioChimes.resumeAudio().then((ready) => {
        unlocking = false;
        if (!ready) return;

        unlocked = true;
        audioChimes.startTheme();
        gestures.forEach((gesture) => window.removeEventListener(gesture, unlock));
      });
    };

    gestures.forEach((gesture) => {
      window.addEventListener(gesture, unlock, { passive: true });
    });

    return () => {
      gestures.forEach((gesture) => window.removeEventListener(gesture, unlock));
      audioChimes.stopTheme();
    };
  }, []);

  return null;
}
