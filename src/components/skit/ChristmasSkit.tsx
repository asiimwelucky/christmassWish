'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { audioChimes } from '@/components/ui/AudioChimes';
import ConfettiEffect from '@/components/ui/ConfettiEffect';
import ChristmasLights from '@/components/christmas/ChristmasLights';
import { Volume2, VolumeX, ChevronRight, ChevronLeft, Sparkles, Heart, Gift, BookOpen, Star } from 'lucide-react';

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    title: 'Nightfall in Kagadi',
    subtitle: 'Beneath the calm Ugandan skies, a bright Christmas star illuminates the rolling hills of Kagadi.',
    badge: 'Scene 1: The Star of Wonder',
  },
  {
    id: 2,
    title: 'The Paradigm Community',
    subtitle: 'At Paradigm Institute, students, tutors, and friends gather to reflect on a year of growth, learning, and resilience.',
    badge: 'Scene 2: Together in Joy',
  },
  {
    id: 3,
    title: 'The Tree of Blessings',
    subtitle: 'Tap each Christmas ornament on the tree to unlock words of blessing and wisdom for the coming year.',
    badge: 'Scene 3: Interactive Blessings',
  },
  {
    id: 4,
    title: 'Illumination of Tomorrow',
    subtitle: 'When hearts unite in kindness, the whole community shines. Every small light creates a brilliant future.',
    badge: 'Scene 4: The Great Illumination',
  },
  {
    id: 5,
    title: 'The Christmas Blessing & Call',
    subtitle: 'From everyone at Paradigm Institute: May your holiday be blessed and your New Year full of victory!',
    badge: 'Finale: Pass the Light Forward',
  },
];

const ORNAMENTS = [
  { id: 1, title: 'Knowledge', icon: BookOpen, message: 'May your curiosity open doors no circumstance can close.', color: '#3498DB' },
  { id: 2, title: 'Hope', icon: Star, message: 'Even the smallest light pierces the darkest night.', color: '#F5D76E' },
  { id: 3, title: 'Kindness', icon: Heart, message: 'A gentle word spoken in Kagadi can echo across the world.', color: '#E74C3C' },
  { id: 4, title: 'Generosity', icon: Gift, message: 'True abundance is found in lifting others alongside you.', color: '#27AE60' },
  { id: 5, title: 'Excellence', icon: Sparkles, message: 'Dare to build skills that will transform our future.', color: '#9B59B6' },
];

export default function ChristmasSkit() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [unlockedOrnaments, setUnlockedOrnaments] = useState<number[]>([]);
  const [activeOrnamentNote, setActiveOrnamentNote] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    trackEvent('skit_started');
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioChimes.setMuted(next);
    if (!next) {
      audioChimes.playTwinkle();
    }
  };

  const handleNext = () => {
    if (currentScene < SCENES.length - 1) {
      const nextScene = currentScene + 1;
      setCurrentScene(nextScene);
      audioChimes.playTwinkle();

      if (nextScene === SCENES.length - 1) {
        setShowConfetti(true);
        audioChimes.playJingleChime();
        trackEvent('skit_completed');
      }
    }
  };

  const handlePrev = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
      audioChimes.playBell(440, 0.4, 0.1);
    }
  };

  const handleOrnamentClick = (id: number, message: string) => {
    if (!unlockedOrnaments.includes(id)) {
      setUnlockedOrnaments([...unlockedOrnaments, id]);
    }
    setActiveOrnamentNote(message);
    audioChimes.playCelebrationChord();
  };

  const scene = SCENES[currentScene];

  return (
    <div className="relative w-full max-w-2xl mx-auto festive-card p-6 sm:p-10 text-white overflow-hidden shadow-2xl border border-[#D4AF37]/35">
      <ConfettiEffect active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Top Bar: Sound toggle and progress dots */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-1.5">
          {SCENES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentScene(idx);
                if (idx === SCENES.length - 1) {
                  setShowConfetti(true);
                  audioChimes.playJingleChime();
                  trackEvent('skit_completed');
                }
              }}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentScene
                  ? 'w-8 bg-[#D4AF37]'
                  : idx < currentScene
                  ? 'w-3 bg-[#27AE60]'
                  : 'w-2.5 bg-white/20'
              }`}
              aria-label={`Go to scene ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={toggleSound}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white/80 transition-colors"
          aria-label={isMuted ? 'Unmute holiday music' : 'Mute holiday music'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#F5D76E]" />}
          <span>{isMuted ? 'Muted' : 'Sound On'}</span>
        </button>
      </div>

      <ChristmasLights count={10} />

      {/* Scene Content Frame */}
      <div className="min-h-[360px] flex flex-col justify-between py-6">
        {/* Badge & Title */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-[#D4AF37]/20 text-[#F5D76E] border border-[#D4AF37]/40 mb-3">
            {scene.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
            {scene.title}
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed">
            {scene.subtitle}
          </p>
        </div>

        {/* Scene Graphic / Interactive Area */}
        <div className="my-6">
          {currentScene === 0 && (
            <div className="relative text-center py-8">
              <div className="text-7xl mb-4 float inline-block" style={{ filter: 'drop-shadow(0 0 25px #F5D76E)' }}>
                ⭐
              </div>
              <p className="text-xs text-white/60 italic max-w-sm mx-auto">
                &ldquo;A light shines in the east of Lake Albert, across the Kagadi ridges, announcing a season of gratitude.&rdquo;
              </p>
            </div>
          )}

          {currentScene === 1 && (
            <div className="text-center py-6">
              <div className="flex justify-center items-center gap-4 text-4xl mb-4">
                <span className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow">👨‍🎓</span>
                <span className="p-3 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 shadow-lg text-5xl">🎄</span>
                <span className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow">👩‍🏫</span>
              </div>
              <p className="text-sm text-[#F5D76E] font-medium max-w-md mx-auto">
                Paradigm Institute stands as a beacon for ambition, community growth, and digital skills in Kagadi, Uganda.
              </p>
            </div>
          )}

          {currentScene === 2 && (
            <div className="text-center">
              <p className="text-xs text-[#D4AF37] uppercase tracking-wider mb-3">
                Tap ornaments to collect blessings ({unlockedOrnaments.length}/{ORNAMENTS.length})
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                {ORNAMENTS.map((item) => {
                  const Icon = item.icon;
                  const isUnlocked = unlockedOrnaments.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleOrnamentClick(item.id, item.message)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all transform active:scale-95 ${
                        isUnlocked
                          ? 'border-2 text-white shadow-lg'
                          : 'bg-white/10 text-white/70 hover:bg-white/15 border border-white/20'
                      }`}
                      style={{
                        borderColor: isUnlocked ? item.color : undefined,
                        backgroundColor: isUnlocked ? `${item.color}33` : undefined,
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: item.color }} />
                      <span>{item.title}</span>
                    </button>
                  );
                })}
              </div>

              {activeOrnamentNote && (
                <div className="p-4 rounded-xl bg-white/10 border border-[#D4AF37]/40 max-w-md mx-auto animate-in fade-in">
                  <p className="text-sm italic text-[#FFF8F0] font-serif">
                    &ldquo;{activeOrnamentNote}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {currentScene === 3 && (
            <div className="text-center py-4">
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl mb-1">🕯️</div>
                  <div className="text-[11px] font-semibold text-[#F5D76E]">Learning</div>
                </div>
                <div className="p-3 rounded-xl bg-[#C0392B]/20 border border-[#C0392B]/40 text-center">
                  <div className="text-2xl mb-1">🤝</div>
                  <div className="text-[11px] font-semibold text-white">Community</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl mb-1">🚀</div>
                  <div className="text-[11px] font-semibold text-[#F5D76E]">Innovation</div>
                </div>
              </div>
              <p className="text-xs text-white/70 max-w-sm mx-auto">
                Together, each student and family lights the path to a brighter tomorrow.
              </p>
            </div>
          )}

          {currentScene === 4 && (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🎉 🌟 🎁</div>
              <p className="text-lg font-serif font-bold text-[#F5D76E] mb-2">
                Merry Christmas & Prosperous 2025!
              </p>
              <p className="text-xs text-white/80 max-w-md mx-auto leading-relaxed mb-6">
                Spread this warmth! You can now compose your own Christmas card with a personal note and send it to your loved ones in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/create"
                  className="btn-primary text-center text-sm py-3 px-6 shadow-lg inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Your Wish Now</span>
                </Link>
                <Link
                  href="/"
                  className="btn-outline text-center text-sm py-3 px-6 inline-flex items-center justify-center gap-2"
                >
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Scene Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentScene === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-white/40 font-mono">
            {currentScene + 1} / {SCENES.length}
          </span>

          {currentScene < SCENES.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-5 py-2 rounded-full text-xs font-bold bg-[#D4AF37] hover:bg-[#F5D76E] text-[#0A1628] transition-all transform active:scale-95 shadow"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentScene(0);
                audioChimes.playTwinkle();
              }}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white"
            >
              <span>Replay</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

