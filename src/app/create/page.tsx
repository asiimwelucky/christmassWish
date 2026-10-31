'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BrandHeader from '@/components/christmas/BrandHeader';
import ChristmasLights from '@/components/christmas/ChristmasLights';
import SnowEffect from '@/components/christmas/SnowEffect';
import StarField from '@/components/christmas/StarField';
import Footer from '@/components/christmas/Footer';
import { GreetingCard } from '@/components/ui/GreetingCard';
import BotanicalLoadingScreen from '@/components/christmas/botanical/BotanicalLoadingScreen';
import ChristmasFlower from '@/components/christmas/botanical/ChristmasFlower';
import ShareModal from '@/components/ui/ShareModal';
import ConfettiEffect from '@/components/ui/ConfettiEffect';
import FireworksEffect from '@/components/ui/FireworksEffect';
import { audioChimes } from '@/components/ui/AudioChimes';
import { trackEvent } from '@/lib/analytics';
import { Sparkles, ArrowLeft, Send } from 'lucide-react';

const PRESET_MESSAGES = [
  'Wishing you a peaceful Christmas and a prosperous New Year full of opportunities!',
  'May your home be filled with laughter, love, and sweet Christmas blessings.',
  'Thank you for inspiring me this year! Looking forward to achieving great things together in 2025.',
  'Warmest holiday wishes from Kagadi! May all your dreams come true in the coming year.',
];

function CreateWishForm() {
  const searchParams = useSearchParams();
  const parentToken = searchParams.get('from') || null;
  const fromName = searchParams.get('by') || null;

  const [displayName, setDisplayName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result state
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    trackEvent('wish_creation_started');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim() || displayName.trim().length < 2) {
      setError('Please provide a name of at least 2 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName.trim(),
          recipient_type: 'everyone',
          personal_message: personalMessage.trim() || undefined,
          parent_token: parentToken || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create wish.');
      }

      setCreatedToken(data.public_token);
      setShowConfetti(true);
      audioChimes.playCelebrationChord();
      setIsShareModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      trackEvent('wish_creation_failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen max-h-screen bg-[#0A1628] text-white flex flex-col overflow-hidden">
      <StarField />
      <SnowEffect />
      <ConfettiEffect active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <FireworksEffect active={showConfetti} />

      {/* Share Modal on Success */}
      {createdToken && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          token={createdToken}
          senderName={displayName}
          cardRef={cardRef}
        />
      )}

      {/* Top Lights */}
      <div className="relative z-10 shrink-0">
        <ChristmasLights count={12} />
      </div>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-1 overflow-hidden flex flex-col">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-1 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
          <BrandHeader variant="compact" />
        </div>

        {/* Title */}
        <div className="relative text-center mb-1 shrink-0">
          <span
            className="floral-float absolute left-0 top-1/2 hidden -translate-y-1/2 sm:block"
            style={{ animationDuration: '10s', animationDelay: '-1.6s' }}
          >
            <ChristmasFlower kind="evergreen" size={78} detail="low" glow={false} snow={false} seed={41} />
          </span>
          <span
            className="floral-float absolute right-0 top-1/2 hidden -translate-y-1/2 sm:block"
            style={{ animationDuration: '12s', animationDelay: '-4.1s' }}
          >
            <ChristmasFlower kind="evergreen" size={78} detail="low" glow={false} snow={false} flipX seed={43} />
          </span>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
            Create a <span className="gold-shimmer">Christmas Wish</span>
          </h1>
          <p className="text-[11px] text-white/70 max-w-md mx-auto hidden sm:block">
            Design a personalized holiday greeting. Share on WhatsApp or download the card!
          </p>
        </div>

        {/* Two-Column Layout: Form & Live Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start flex-1 min-h-0 overflow-hidden">
          {/* Left: Input Form */}
          <div className="festive-card p-3 sm:p-4 border border-[#D4AF37]/30 shadow-xl overflow-y-auto max-h-full">
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Chain banner — set when the card arrived from another receiver */}
              {parentToken && (
                <div className="rounded-xl border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-3 py-2 text-[11px] leading-snug text-[#FFF8F0]/90">
                  <span className="font-semibold text-[#F5D76E]">
                    {fromName ? `${fromName} passed a Christmas wish to you` : 'You opened a shared Christmas wish'}
                  </span>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs">
                  {error}
                </div>
              )}

              {/* Name Input */}
              <div>
                <label htmlFor="name-input" className="block text-[11px] font-semibold uppercase tracking-wider text-[#F5D76E] mb-1">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name-input"
                  type="text"
                  maxLength={50}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="festive-input py-2 text-sm"
                  required
                />
              </div>

              {/* Personal Message */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="msg-input" className="text-[11px] font-semibold uppercase tracking-wider text-[#F5D76E]">
                    Personal Message <span className="text-white/40 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-white/40 font-mono">
                    {personalMessage.length}/280
                  </span>
                </div>
                <textarea
                  id="msg-input"
                  rows={5}
                  maxLength={280}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Write a warm note or click a quick suggestion below..."
                  className="festive-input min-h-36 resize-y py-3 text-base leading-relaxed"
                />

                {/* Preset Suggestions */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {PRESET_MESSAGES.slice(0, 3).map((msg, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setPersonalMessage(msg)}
                      className="text-[10px] text-left py-0.5 px-2 rounded bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 text-white/75 transition-colors"
                    >
                      &ldquo;{msg.slice(0, 32)}...&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !displayName.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm shadow-xl font-bold uppercase tracking-wider"
              >
                {loading ? (
                  <span>Generating Card...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{parentToken ? 'Add My Wish & Pass It On' : 'Create & Share Wish'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Live Preview */}
          <div className="hidden lg:flex flex-col items-center overflow-hidden max-h-full">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#D4AF37] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              <span>Live Card Preview</span>
            </p>
            <div className="w-full max-w-md">
              <GreetingCard
                ref={cardRef}
                displayName={displayName.trim() || 'Your Name'}
                recipientType="everyone"
                personalMessage={personalMessage.trim() || null}
              />
            </div>
            {createdToken && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="btn-gold py-2 px-4 text-xs flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Share Options</span>
                </button>
                <Link
                  href={`/wish/${createdToken}`}
                  className="btn-outline py-2 px-4 text-xs flex items-center gap-1.5"
                >
                  <span>View Public Page</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="relative z-10 shrink-0">
        <Footer />
      </div>
    </div>
  );
}

export default function CreateWishPage() {
  return (
    <Suspense
      fallback={
        <BotanicalLoadingScreen
          label="Loading Christmas Wish Maker..."
          hint="Freshening the poinsettias"
        />
      }
    >
      <CreateWishForm />
    </Suspense>
  );
}
