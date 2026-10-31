'use client';

import { useEffect } from 'react';
import { audioChimes } from '@/components/ui/AudioChimes';

export default function NowPlaying() {

  useEffect(() => {
    const gestures = ['pointerdown', 'keydown'] as const;
    const unlock = () => {
      audioChimes.startTheme();
      void audioChimes.resumeAudio();
      gestures.forEach((gesture) => {
        window.removeEventListener(gesture, unlock);
      });
    };
    gestures.forEach((gesture) => {
      window.addEventListener(gesture, unlock, { once: true, passive: true });
    });

    return () => {
      gestures.forEach((gesture) => window.removeEventListener(gesture, unlock));
      audioChimes.stopTheme();
    };
  }, []);

  return null;
}
