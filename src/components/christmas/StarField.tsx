'use client';

import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
}

export default function StarField() {
  const [stars, setStars] = useState<Star[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const count = 60;
    setStars(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 2.5,
        duration: `${2 + Math.random() * 4}s`,
        delay: `${Math.random() * 5}s`,
      }))
    );
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDuration: reducedMotion ? '0s' : star.duration,
            animationDelay: reducedMotion ? '0s' : star.delay,
          }}
        />
      ))}
    </div>
  );
}
