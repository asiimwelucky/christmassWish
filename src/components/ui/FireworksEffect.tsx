'use client';

import { useEffect, useRef } from 'react';

interface FireworksEffectProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  lifetime: number;
  color: string;
  radius: number;
}

const BURSTS = [
  { at: 0, x: 0.22, y: 0.3 },
  { at: 620, x: 0.78, y: 0.25 },
  { at: 1280, x: 0.5, y: 0.38 },
];

const COLORS = ['#F5D76E', '#E74C3C', '#27AE60', '#FFFFFF', '#F39C12'];

export default function FireworksEffect({ active }: FireworksEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const startedAt = performance.now();
    let previousFrame = startedAt;
    let nextBurst = 0;
    let frame = 0;

    const render = (now: number) => {
      const elapsed = now - startedAt;
      const delta = Math.min((now - previousFrame) / 1000, 0.04);
      previousFrame = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      while (nextBurst < BURSTS.length && elapsed >= BURSTS[nextBurst].at) {
        const burst = BURSTS[nextBurst++];
        const x = window.innerWidth * burst.x;
        const y = window.innerHeight * burst.y;
        for (let i = 0; i < 36; i++) {
          const angle = (Math.PI * 2 * i) / 36 + Math.random() * 0.12;
          const speed = 65 + Math.random() * 130;
          particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            age: 0,
            lifetime: 1.1 + Math.random() * 0.7,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            radius: 1.2 + Math.random() * 1.8,
          });
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.age += delta;
        if (particle.age >= particle.lifetime) {
          particles.splice(i, 1);
          continue;
        }

        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.vy += 48 * delta;

        const opacity = 1 - particle.age / particle.lifetime;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (elapsed < 3900 || particles.length > 0) {
        frame = window.requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40 select-none"
      aria-hidden="true"
    />
  );
}
