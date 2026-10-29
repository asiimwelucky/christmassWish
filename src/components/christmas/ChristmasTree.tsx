'use client';

import React from 'react';

interface ChristmasTreeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ChristmasTree({ className = '', size = 'md' }: ChristmasTreeProps) {
  const sizes = {
    sm: { tree: 'text-6xl', star: 'text-2xl', gifts: 'text-xl' },
    md: { tree: 'text-8xl', star: 'text-3xl', gifts: 'text-2xl' },
    lg: { tree: 'text-[10rem]', star: 'text-4xl', gifts: 'text-3xl' },
  };

  const ornamentColors = [
    '#E74C3C', '#D4AF37', '#3498DB', '#E67E22', '#9B59B6', '#1ABC9C',
  ];

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`} aria-hidden="true">
      {/* Star on top */}
      <div className={`${sizes[size].star} float`} style={{ filter: 'drop-shadow(0 0 12px #F5D76E)' }}>
        ⭐
      </div>

      {/* Tree body — SVG for precision */}
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={size === 'lg' ? 'w-64 h-72' : size === 'md' ? 'w-48 h-56' : 'w-32 h-36'}
        aria-label="Decorated Christmas tree"
      >
        {/* Tree layers */}
        <polygon points="100,10 155,90 45,90" fill="#1A6B3A" />
        <polygon points="100,40 168,135 32,135" fill="#1D7A42" />
        <polygon points="100,75 180,185 20,185" fill="#1A6B3A" />

        {/* Trunk */}
        <rect x="85" y="185" width="30" height="30" rx="3" fill="#6B3A2A" />

        {/* Ornaments */}
        {ornamentColors.map((color, i) => {
          const positions = [
            [100, 65], [75, 105], [125, 105], [58, 152], [100, 145], [142, 152],
          ];
          const [cx, cy] = positions[i] ?? [100, 100];
          return (
            <circle key={i} cx={cx} cy={cy} r="7" fill={color} opacity="0.9">
              <animate
                attributeName="opacity"
                values="0.9;0.5;0.9"
                dur={`${1.5 + i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Lights — small circles */}
        {[
          [85, 80], [115, 80], [65, 120], [100, 118], [135, 120], [50, 162], [85, 162], [115, 162], [150, 162],
        ].map(([cx, cy], i) => (
          <circle key={`light-${i}`} cx={cx} cy={cy} r="4" fill={['#E74C3C', '#F5D76E', '#3498DB', '#E67E22'][i % 4]}>
            <animate
              attributeName="r"
              values="4;5.5;4"
              dur={`${0.8 + i * 0.15}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.4;1"
              dur={`${0.8 + i * 0.15}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Tinsel / garlands */}
        <path d="M55,90 Q100,80 145,90" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M38,135 Q100,120 162,135" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.6" />
      </svg>

      {/* Gifts below */}
      <div className={`flex gap-2 -mt-3 ${sizes[size].gifts}`}>
        <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🎁</span>
        <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🎀</span>
        <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🎁</span>
      </div>
    </div>
  );
}
