import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Curierul Perfect - Transport România Europa';
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

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(to bottom right, #f97316, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="48"
              height="48"
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
              fontSize: '48px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            Curierul Perfect
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            marginBottom: '24px',
            lineHeight: 1.2,
            maxWidth: '900px',
          }}
        >
          Transport România - Europa
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '48px',
            maxWidth: '700px',
          }}
        >
          Colete • Mobilă • Persoane • Mașini • Animale
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
          }}
        >
          {[
            { icon: '✓', text: 'Gratuit pentru clienți' },
            { icon: '✓', text: 'Transportatori verificați' },
            { icon: '✓', text: 'Fără comisioane' },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <span style={{ color: '#22c55e', fontSize: '24px', fontWeight: 700 }}>
                {feature.icon}
              </span>
              <span style={{ color: '#e2e8f0', fontSize: '20px', fontWeight: 500 }}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '20px',
            color: '#64748b',
          }}
        >
          curierulperfect.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
