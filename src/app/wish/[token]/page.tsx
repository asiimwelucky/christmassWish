import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import type { Wish } from '@/types';
import WishViewClient from './WishViewClient';

interface PageProps {
  params: Promise<{ token: string }>;
}

async function getWish(token: string): Promise<Wish | null> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('wishes')
      .select('id, public_token, display_name, recipient_type, personal_message, template_version, parent_token, created_at, expires_at')
      .eq('public_token', token)
      .single();

    if (error || !data) {
      return null;
    }
    return data as Wish;
  } catch (err) {
    console.error('Failed to load wish server-side:', err);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const wish = await getWish(token);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://christmas.paradigminstitute.ac.ug';
  const name = wish?.display_name || 'Someone special';

  const title = `🎄 Merry Christmas, ${name}! | Paradigm Institute`;
  const description = `${name} has a special Christmas wish for you from Paradigm Institute, Kagadi, Uganda! Open to read your greeting.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/wish/${token}`,
      siteName: 'Paradigm Institute Christmas Wishes',
      images: [
        {
          url: '/christmas-hero-bg.jpg',
          width: 1200,
          height: 630,
          alt: `Christmas wish for ${name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/christmas-hero-bg.jpg'],
    },
  };
}

async function WishPageContent({ params }: PageProps) {
  const { token } = await params;
  const wish = await getWish(token);

  if (!wish) {
    return (
      <div className="min-h-screen bg-[#0A1628] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#C0392B]/20 text-3xl flex items-center justify-center mb-4 border border-[#C0392B]/40">
          🎄
        </div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Greeting Not Found</h1>
        <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
          This Christmas greeting link may have expired or was typed incorrectly. But you can still create a brand new one to share!
        </p>
        <Link href="/create" className="btn-primary">
          Create a Christmas Wish
        </Link>
      </div>
    );
  }

  return <WishViewClient wish={wish} />;
}

export default function WishPage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A1628] text-white flex items-center justify-center">
          <div className="text-sm text-[#F5D76E] animate-pulse">Loading Christmas Greeting...</div>
        </div>
      }
    >
      <WishPageContent {...props} />
    </Suspense>
  );
}
