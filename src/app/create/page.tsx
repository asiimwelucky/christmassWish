'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BrandHeader from '@/components/christmas/BrandHeader';
import ChristmasLights from '@/components/christmas/ChristmasLights';
import SnowEffect from '@/components/christmas/SnowEffect';
import StarField from '@/components/christmas/StarField';
import Footer from '@/components/christmas/Footer';
import { GreetingCard } from '@/components/ui/GreetingCard';
import ShareModal from '@/components/ui/ShareModal';
import ConfettiEffect from '@/components/ui/ConfettiEffect';
import { audioChimes } from '@/components/ui/AudioChimes';
import { trackEvent } from '@/lib/analytics';
import type { RecipientType } from '@/types';
import { Sparkles, ArrowLeft, Send, Users, User, Heart, GraduationCap, Briefcase, Globe } from 'lucide-react';

const RECIPIENT_OPTIONS: Array<{ type: RecipientType; label: string; icon: any }> = [
  { type: 'everyone', label: 'Everyone', icon: Globe },
  { type: 'friend', label: 'Friend', icon: Heart },
  { type: 'family', label: 'Family', icon: Users },
  { type: 'student', label: 'Student', icon: GraduationCap },
  { type: 'teacher', label: 'Teacher', icon: User },
  { type: 'colleague', label: 'Colleague', icon: Briefcase },
];

const PRESET_MESSAGES = [
  'Wishing you a peaceful Christmas and a prosperous New Year full of opportunities!',
  'May your home be filled with laughter, love, and sweet Christmas blessings.',
  'Thank you for inspiring me this year! Looking forward to achieving great things together in 2025.',
  'Warmest holiday wishes from Kagadi! May all your dreams come true in the coming year.',
];

function CreateWishForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const parentToken = searchParams.get('from') || null;

  const [displayName, setDisplayName] = useState('');
  const [recipientType, setRecipientType] = useState<RecipientType>('everyone');
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
          recipient_type: recipientType,
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
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      trackEvent('wish_creation_failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A1628] text-white flex flex-col justify-between overflow-hidden">
      <StarField />
      <SnowEffect />
      <ConfettiEffect active={showConfetti} onComplete={() => setShowConfetti(false)} />

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
      <div className="relative z-10">
        <ChristmasLights count={12} />
      </div>

      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <BrandHeader variant="compact" />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
            Create a <span className="gold-shimmer">Christmas Wish</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
            Design a personalized holiday greeting from Paradigm Institute. Share it instantly on WhatsApp or download the digital card!
          </p>
        </div>

        {/* Two-Column Layout: Form & Live Card Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Input Form */}
          <div className="festive-card p-6 sm:p-8 border border-[#D4AF37]/30 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs">
                  {error}
                </div>
              )}

              {/* Name Input */}
              <div>
                <label htmlFor="name-input" className="block text-xs font-semibold uppercase tracking-wider text-[#F5D76E] mb-2">
                  Recipient or Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name-input"
                  type="text"
                  maxLength={50}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Sarah & Family, John, Class of 2024"
                  className="festive-input"
                  required
                />
                <p className="text-[11px] text-white/40 mt-1">
                  This will be highlighted beautifully on the card.
                </p>
              </div>

              {/* Recipient Type Pills */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#F5D76E] mb-2">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {RECIPIENT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = recipientType === opt.type;
                    return (
                      <button
                        type="button"
                        key={opt.type}
                        onClick={() => setRecipientType(opt.type)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#D4AF37] text-[#0A1628] font-bold shadow-md'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Message */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="msg-input" className="text-xs font-semibold uppercase tracking-wider text-[#F5D76E]">
                    Personal Message <span className="text-white/40 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[11px] text-white/40 font-mono">
                    {personalMessage.length}/280
                  </span>
                </div>
                <textarea
                  id="msg-input"
                  rows={3}
                  maxLength={280}
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="Write a warm note or choose one from the suggestions below..."
                  className="festive-input resize-none"
                />

                {/* Preset Suggestions */}
                <div className="mt-2.5 space-y-1.5">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider">
                    Quick suggestions:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_MESSAGES.map((msg, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setPersonalMessage(msg)}
                        className="text-[11px] text-left py-1 px-2.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-white/80 transition-colors"
                      >
                        &ldquo;{msg.slice(0, 38)}...&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !displayName.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base shadow-xl"
              >
                {loading ? (
                  <span>Generating Card...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Create & Share Wish</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Live Preview */}
          <div className="flex flex-col items-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37] mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Card Preview</span>
            </p>
            <div className="w-full max-w-md">
              <GreetingCard
                ref={cardRef}
                displayName={displayName.trim() || 'Your Name'}
                recipientType={recipientType}
                personalMessage={personalMessage.trim() || null}
              />
            </div>
            {createdToken && (
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="btn-gold py-2.5 px-6 text-xs flex items-center gap-2 shadow"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Share Options</span>
                </button>
                <Link
                  href={`/wish/${createdToken}`}
                  className="btn-outline py-2.5 px-6 text-xs flex items-center gap-2"
                >
                  <span>View Public Page</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default function CreateWishPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A1628] text-white flex items-center justify-center">
          <div className="text-sm text-[#F5D76E] animate-pulse">Loading Christmas Wish Maker...</div>
        </div>
      }
    >
      <CreateWishForm />
    </Suspense>
  );
}
