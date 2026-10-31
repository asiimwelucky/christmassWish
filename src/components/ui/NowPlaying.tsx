'use client';

import { useEffect, useRef } from 'react';

/** Start the background song after the visitor's first interaction. */
export default function NowPlaying() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let starting = false;

    const removeGestureListeners = () => {
      window.removeEventListener('pointerdown', startPlayback, true);
      window.removeEventListener('touchstart', startPlayback, true);
      window.removeEventListener('keydown', startPlayback, true);
    };

    const startPlayback = () => {
      if (starting || !audio.paused) return;
      starting = true;

      // Call play directly in the user gesture handler for mobile autoplay policies.
      void audio.play().then(
        () => {
          starting = false;
          removeGestureListeners();
        },
        (error: unknown) => {
          starting = false;
          if (error instanceof DOMException && error.name !== 'NotAllowedError') {
            console.error('Background Christmas song could not play:', error);
          }
        },
      );
    };

    window.addEventListener('pointerdown', startPlayback, { capture: true, passive: true });
    window.addEventListener('touchstart', startPlayback, { capture: true, passive: true });
    window.addEventListener('keydown', startPlayback, true);

    return () => {
      removeGestureListeners();
      audio.pause();
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/merry-christmas.mp3"
      loop
      preload="auto"
      playsInline
      aria-hidden="true"
      className="hidden"
    />
  );
}
