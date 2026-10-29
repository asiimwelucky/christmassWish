'use client';

import React, { useState, RefObject } from 'react';
import html2canvas from 'html2canvas';
import { trackEvent } from '@/lib/analytics';
import { buildWhatsAppShareUrl, buildWishUrl } from '@/lib/utils';
import { Share2, Copy, Check, Download, MessageCircle, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  senderName: string;
  cardRef?: RefObject<HTMLDivElement | null>;
}

export default function ShareModal({
  isOpen,
  onClose,
  token,
  senderName,
  cardRef,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const wishUrl = buildWishUrl(token);
  const waUrl = buildWhatsAppShareUrl(token, senderName);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wishUrl);
      setCopied(true);
      trackEvent('link_copied', { wish_id: token });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsApp = () => {
    trackEvent('whatsapp_share_clicked', { wish_id: token, campaign_source: 'whatsapp' });
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `🎄 Merry Christmas from ${senderName}!`,
          text: `I made a special Christmas wish for you from Paradigm Institute! Open it here:`,
          url: wishUrl,
        });
        trackEvent('native_share_attempted', { wish_id: token, campaign_source: 'native_share' });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef?.current) return;
    try {
      setDownloading(true);
      trackEvent('greeting_card_downloaded', { wish_id: token });
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0A1628',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Paradigm-Christmas-Wish-${senderName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Card download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-title"
    >
      <div className="relative w-full max-w-md festive-card p-6 sm:p-8 text-white shadow-2xl border border-[#D4AF37]/40 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-1 rounded-full transition-colors"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-2xl">
            🎁
          </div>
          <h3 id="share-title" className="text-2xl font-serif font-bold text-white">
            Share Your Christmas Wish!
          </h3>
          <p className="text-xs text-white/70 mt-1">
            Spread love, joy, and festive cheer with your friends & family in Kagadi and beyond.
          </p>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-3">
          {/* WhatsApp Primary Button */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-white transition-all transform active:scale-98 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)',
            }}
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Share on WhatsApp</span>
          </button>

          {/* Copy Link Input & Button */}
          <div className="flex items-center gap-2 bg-white/5 border border-[#D4AF37]/30 rounded-xl p-1.5 pl-3">
            <span className="text-xs text-white/70 truncate flex-1 font-mono">
              {wishUrl}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D4AF37] text-[#0A1628] text-xs font-bold transition-all hover:bg-[#F5D76E] shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-green-900" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Native Web Share (Mobile Friendly) */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all text-sm"
            >
              <Share2 className="w-4 h-4" />
              <span>More Share Options</span>
            </button>
          )}

          {/* Download Image Card */}
          {cardRef && (
            <button
              onClick={handleDownloadCard}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-[#96281B] to-[#C0392B] hover:brightness-110 border border-[#E74C3C]/40 text-white transition-all text-sm shadow"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Preparing Image...' : 'Download Festive Greeting Card'}</span>
            </button>
          )}
        </div>

        {/* Small reassurance */}
        <p className="text-[11px] text-center text-white/40 mt-5">
          🔒 No phone numbers or emails collected. Safe, private & free.
        </p>
      </div>
    </div>
  );
}

