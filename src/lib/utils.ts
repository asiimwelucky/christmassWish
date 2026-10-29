// src/lib/utils.ts — Shared utilities

/**
 * Build the WhatsApp share URL for a personalized wish.
 */
export function buildWhatsAppShareUrl(token: string, senderName: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  const wishUrl = `${siteUrl}/wish/${token}`;
  const message = encodeURIComponent(
    `🎄✨ Merry Christmas! Paradigm Institute has a special Christmas wish for you!\n\nOpen your personalized greeting here:\n${wishUrl}\n\nAdd your name and share the joy with someone else! 🎁`
  );
  return `https://wa.me/?text=${message}`;
}

/**
 * Build the full wish URL.
 */
export function buildWishUrl(token: string): string {
  const siteUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || '';
  return `${siteUrl}/wish/${token}`;
}

/**
 * Sanitize a display name: trim, limit to 50 chars, strip HTML.
 */
export function sanitizeName(name: string): string {
  return name
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .trim()
    .slice(0, 50);
}

/**
 * Sanitize a personal message: strip HTML, limit to 280 chars.
 */
export function sanitizeMessage(msg: string): string {
  return msg
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .trim()
    .slice(0, 280);
}

/**
 * Format a date for display.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Build the personalized Christmas greeting text.
 */
export function buildGreetingMessage(name: string, personalMessage?: string | null): string {
  const intro = `🎄 Merry Christmas, ${name}!`;
  const body = `May this beautiful season fill your heart with peace, your home with happiness, and your new year with endless opportunities.`;
  const footer = `From all of us at Paradigm Institute, Kagadi — thank you for being part of a community that learns, grows and inspires. 🌟`;
  const cta = `Share the joy. Someone else deserves a Christmas smile too! 🎁`;

  return [intro, '', body, '', personalMessage ? `💌 A personal note: ${personalMessage}` : null, '', footer, '', cta]
    .filter((line) => line !== null)
    .join('\n');
}

/**
 * Generate a random short ID for client-side use only.
 */
export function generateClientId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Sleep utility.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
