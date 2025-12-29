import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Curierul Perfect - Cum Funcționează';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
        }}
      >
        {/* Orange accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(to right, #f97316, #ea580c)',
          }}
        />

        {/* Logo text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(to bottom right, #f97316, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </svg>
          </div>
          <span
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#f97316',
              letterSpacing: '-0.02em',
            }}
          >
            Curierul Perfect
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            marginBottom: '24px',
            lineHeight: 1.1,
          }}
        >
          Cum Funcționează?
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '48px',
            maxWidth: '800px',
          }}
        >
          Transport România-Europa în 5 pași simpli
        </div>

        {/* Steps preview */}
        <div
          style={{
            display: 'flex',
            gap: '24px',
          }}
        >
          {['Postezi', 'Primești oferte', 'Alegi', 'Confirmi', 'Livrare'].map(
            (step, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(to bottom right, #f97316, #ea580c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 700,
                  }}
                >
                  {idx + 1}
                </div>
                <span
                  style={{
                    fontSize: '16px',
                    color: '#e2e8f0',
                    fontWeight: 500,
                  }}
                >
                  {step}
                </span>
              </div>
            )
          )}
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'rgba(249, 115, 22, 0.1)',
            borderRadius: '100px',
            border: '1px solid rgba(249, 115, 22, 0.3)',
          }}
        >
          <span style={{ color: '#f97316', fontSize: '18px', fontWeight: 600 }}>
            100% Gratuit • Fără Comisioane
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
