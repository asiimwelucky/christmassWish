import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import type { Wish } from '@/types';
import EvergreenSprig from '@/components/christmas/botanical/EvergreenSprig';
import PoinsettiaDecoration from '@/components/christmas/botanical/PoinsettiaDecoration';
import BotanicalLoadingScreen from '@/components/christmas/botanical/BotanicalLoadingScreen';
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

  const siteUrl =
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';
  const name = wish?.display_name || 'Someone special';
  const personalMessage = wish?.personal_message?.trim();

  // Receiver-facing preview: when this link is reshared, the card and the
  // wording carry ASMART TEC rather than the creator's institution.
  const title = `🎄 Merry Christmas, ${name}! | ASMART TEC`;
  const description = personalMessage
    ? `${name} sent you a Christmas wish: “${personalMessage.slice(0, 140)}”`
    : `${name} sent you a Christmas wish from ASMART TEC. Open it, add your own wish and pass the joy on!`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/wish/${token}`,
      siteName: 'Christmas Wishes by ASMART TEC',
      images: [
        {
          url: '/christmas-hero-bg.jpg',
          width: 1376,
          height: 768,
          alt: `Christmas wish for ${name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: '/christmas-hero-bg.jpg',
          width: 1376,
          height: 768,
          alt: `Christmas wish for ${name}`,
        },
      ],
    },
  };
}

async function WishPageContent({ params }: PageProps) {
  const { token } = await params;
  const wish = await getWish(token);

  if (!wish) {
    return (
      <div className="min-h-screen bg-[#0A1628] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-5">
          <EvergreenSprig
            width={150}
            height={82}
            nodes={9}
            glow={false}
            angle={10}
            seed={61}
            className="absolute -left-16 top-8 opacity-90"
          />
          <EvergreenSprig
            width={150}
            height={82}
            nodes={9}
            glow={false}
            flipX
            angle={10}
            seed={63}
            className="absolute -right-16 top-8 opacity-90"
          />
          <PoinsettiaDecoration
            size={92}
            variant="red"
            foliage
            glow
            sparkles
            seed={65}
            duration={7}
            className="relative z-10"
          />
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
      fallback={<BotanicalLoadingScreen label="Opening your Christmas greeting..." hint="Unwrapping it slowly" />}
    >
      <WishPageContent {...props} />
    </Suspense>
  );
}
