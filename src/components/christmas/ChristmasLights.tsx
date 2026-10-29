'use client';

import React from 'react';

const LIGHTS = [
  { color: '#E74C3C', glow: 'rgba(231,76,60,0.7)' },
  { color: '#F5D76E', glow: 'rgba(245,215,110,0.7)' },
  { color: '#3498DB', glow: 'rgba(52,152,219,0.7)' },
  { color: '#27AE60', glow: 'rgba(39,174,96,0.7)' },
  { color: '#E67E22', glow: 'rgba(230,126,34,0.7)' },
  { color: '#9B59B6', glow: 'rgba(155,89,182,0.7)' },
];

export default function ChristmasLights({ count = 12 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="relative w-full overflow-hidden py-2">
      {/* Wire */}
      <div
        className="absolute left-0 right-0"
        style={{ top: '14px', height: '2px', background: 'rgba(255,255,255,0.15)' }}
      />
      {/* Lights */}
      <div className="flex justify-around items-start px-2">
        {Array.from({ length: count }).map((_, i) => {
          const light = LIGHTS[i % LIGHTS.length];
          const delay = `${(i * 0.18).toFixed(2)}s`;
          return (
            <div key={i} className="flex flex-col items-center">
              {/* Wire drop */}
              <div
                style={{
                  width: '2px',
                  height: `${8 + (i % 3) * 4}px`,
                  background: 'rgba(255,255,255,0.2)',
                }}
              />
              {/* Bulb */}
              <div
                className="light-bulb"
                style={{
                  backgroundColor: light.color,
                  boxShadow: `0 0 8px 2px ${light.glow}`,
                  animationDelay: delay,
                  animationDuration: `${1 + (i % 4) * 0.3}s`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
