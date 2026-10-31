import { ImageResponse } from 'next/og';
import { getWishByToken } from '@/lib/wishes';

export const alt = 'Personalized Christmas greeting card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const christmasTreeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="500" viewBox="0 0 420 500">
  <defs>
    <linearGradient id="needles" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#27864d"/>
      <stop offset="1" stop-color="#07452c"/>
    </linearGradient>
    <radialGradient id="gold">
      <stop offset="0" stop-color="#fff5b8"/>
      <stop offset="1" stop-color="#e6ad35"/>
    </radialGradient>
    <radialGradient id="red">
      <stop offset="0" stop-color="#ff8580"/>
      <stop offset="1" stop-color="#b91f35"/>
    </radialGradient>
  </defs>
  <path d="M210 12 224 47 261 49 233 73 242 109 210 89 178 109 187 73 159 49 196 47Z"
    fill="url(#gold)" stroke="#fff1a8" stroke-width="3"/>
  <path d="M210 80 140 194 280 194Z" fill="url(#needles)" stroke="#52a76a" stroke-width="3"/>
  <path d="M210 125 95 290 325 290Z" fill="url(#needles)" stroke="#52a76a" stroke-width="3"/>
  <path d="M210 190 45 405 375 405Z" fill="url(#needles)" stroke="#52a76a" stroke-width="3"/>
  <path d="M210 154C170 202 250 220 145 261S264 300 93 359M210 226C155 278 274 291 104 349S268 368 65 397"
    fill="none" stroke="#f3d16b" stroke-width="6" stroke-linecap="round"/>
  <g fill="url(#gold)" stroke="#fff0a0" stroke-width="2">
    <circle cx="185" cy="158" r="9"/><circle cx="231" cy="184" r="8"/>
    <circle cx="143" cy="235" r="10"/><circle cx="265" cy="249" r="9"/>
    <circle cx="194" cy="271" r="8"/><circle cx="105" cy="325" r="10"/>
    <circle cx="220" cy="328" r="10"/><circle cx="306" cy="346" r="9"/>
  </g>
  <g fill="url(#red)" stroke="#ffaaa0" stroke-width="2">
    <circle cx="229" cy="145" r="8"/><circle cx="177" cy="219" r="9"/>
    <circle cx="286" cy="220" r="10"/><circle cx="118" cy="278" r="9"/>
    <circle cx="244" cy="293" r="9"/><circle cx="164" cy="351" r="10"/>
    <circle cx="268" cy="379" r="10"/>
  </g>
  <g fill="#fff5c3">
    <circle cx="163" cy="180" r="4"/><circle cx="253" cy="205" r="4"/>
    <circle cx="168" cy="300" r="4"/><circle cx="284" cy="315" r="4"/>
    <circle cx="126" cy="369" r="4"/><circle cx="233" cy="365" r="4"/>
  </g>
  <path d="M175 400H245V480H175Z" fill="#9a542d"/>
  <path d="M165 480H255" stroke="#e6bd77" stroke-width="7" stroke-linecap="round"/>
</svg>`;
const christmasTreeImage = `data:image/svg+xml,${encodeURIComponent(christmasTreeSvg)}`;

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
            position: 'relative',
            width: 1110,
            height: 550,
            padding: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '2px solid rgba(245, 215, 110, 0.72)',
            borderRadius: 28,
            background:
              'linear-gradient(145deg, rgba(20, 40, 80, 0.82), rgba(7, 24, 34, 0.94))',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 350,
              height: 460,
              flexShrink: 0,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 175,
              background:
                'radial-gradient(ellipse at center, rgba(31, 126, 76, 0.32) 0%, rgba(10, 22, 40, 0) 72%)',
            }}
          >
            <img
              src={christmasTreeImage}
              alt=""
              width={340}
              height={450}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              width: 660,
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              height: '100%',
              padding: '30px 28px 30px 42px',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              color: '#f5d76e',
              fontFamily: 'Arial, sans-serif',
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: 'uppercase',
              }}
            >
              ASMART.TEC
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 24,
                color: '#fff8f0',
                fontSize: 54,
                fontStyle: 'italic',
                fontWeight: 700,
                lineHeight: 1.08,
                textShadow: '0 4px 20px rgba(245, 215, 110, 0.22)',
              }}
            >
              Merry Christmas!
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 16,
                color: '#f5d76e',
                fontFamily: 'Arial, sans-serif',
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              A personal wish for {name.slice(0, 42)}
            </div>
            <div
              style={{
                display: 'flex',
                maxWidth: 670,
                maxHeight: 125,
                overflow: 'hidden',
                marginTop: 20,
                color: 'rgba(255, 248, 240, 0.9)',
                fontFamily: 'Arial, sans-serif',
                fontSize: 27,
                lineHeight: 1.4,
              }}
            >
              “{message.slice(0, 140)}”
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 27,
                color: 'rgba(255, 255, 255, 0.58)',
                fontFamily: 'Arial, sans-serif',
                fontSize: 15,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}
            >
              Open your greeting • Add your wish • Pass it on
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
