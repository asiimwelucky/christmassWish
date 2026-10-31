import { ImageResponse } from 'next/og';
import { getWishByToken } from '@/lib/wishes';

export const alt = 'Personalized Christmas greeting card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface ImageProps {
  params: Promise<{ token: string }>;
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { token } = await params;
  const wish = await getWishByToken(token);
  const name = wish?.display_name || 'Someone special';
  const message =
    wish?.personal_message?.trim() ||
    'Wishing you peace, joy, and love this Christmas and throughout the New Year.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#081426',
          backgroundImage:
            'radial-gradient(ellipse at 50% 45%, #19334a 0%, #0a1628 65%, #050b14 100%)',
          color: '#fff8f0',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            width: 1110,
            height: 550,
            padding: '45px 70px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            border: '2px solid rgba(245, 215, 110, 0.72)',
            borderRadius: 28,
            background:
              'linear-gradient(145deg, rgba(20, 40, 80, 0.8), rgba(10, 22, 40, 0.9))',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#f5d76e',
              fontFamily: 'Arial, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: 'uppercase',
            }}
          >
            ASMART.TEC
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              color: '#fff8f0',
              fontSize: 68,
              fontStyle: 'italic',
              fontWeight: 700,
              lineHeight: 1.1,
              textShadow: '0 4px 20px rgba(245, 215, 110, 0.22)',
            }}
          >
            Merry Christmas!
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 12,
              color: '#f5d76e',
              fontFamily: 'Arial, sans-serif',
              fontSize: 25,
              fontWeight: 600,
            }}
          >
            A personal wish for {name.slice(0, 50)}
          </div>
          <div
            style={{
              display: 'flex',
              maxWidth: 900,
              maxHeight: 118,
              overflow: 'hidden',
              marginTop: 25,
              color: 'rgba(255, 248, 240, 0.9)',
              fontFamily: 'Arial, sans-serif',
              fontSize: 30,
              lineHeight: 1.4,
            }}
          >
            “{message.slice(0, 160)}”
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              color: 'rgba(255, 255, 255, 0.58)',
              fontFamily: 'Arial, sans-serif',
              fontSize: 17,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Open your greeting • Add your wish • Pass it on
          </div>
        </div>
      </div>
    ),
    size,
  );
}
