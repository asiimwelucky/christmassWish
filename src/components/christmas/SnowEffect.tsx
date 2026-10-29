'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Snowflake {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  fontSize: string;
  opacity: number;
}

export default function SnowEffect() {
  const [flakes, setFlakes] = useState<Snowflake[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const countRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) return;

    const count = window.innerWidth < 640 ? 18 : 30;
    const generated: Snowflake[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${6 + Math.random() * 8}s`,
      animationDelay: `${Math.random() * 8}s`,
      fontSize: `${0.6 + Math.random() * 0.8}rem`,
      opacity: 0.4 + Math.random() * 0.6,
    }));
    setFlakes(generated);
    countRef.current = count;
  }, []);

  if (reducedMotion || flakes.length === 0) return null;

  const symbols = ['❄', '❅', '❆', '✦', '·', '•'];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="snowflake select-none"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            fontSize: flake.fontSize,
            opacity: flake.opacity,
          }}
        >
          {symbols[flake.id % symbols.length]}
        </span>
      ))}
    </div>
  );
}
