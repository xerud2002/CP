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
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* Orange accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(to right, #f97316, #ea580c, #f97316)',
          }}
        />

        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '60px',
          }}
        >
          {/* Logo + Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(249, 115, 22, 0.3)',
              }}
            >
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
              >
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                <path d="m3.3 7 8.7 5 8.7-5" />
                <path d="M12 22V12" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '42px',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.02em',
              }}
            >
              Curierul Perfect
            </span>
          </div>

          {/* Main title with gradient */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              background: 'linear-gradient(to right, #ffffff 0%, #f97316 50%, #ffffff 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              marginBottom: '16px',
              lineHeight: 1.1,
            }}
          >
            Transport România - Europa
          </div>

          {/* Subtitle with services */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '48px',
            }}
          >
            {['Colete', 'Mobilă', 'Persoane', 'Auto', 'Animale'].map((service, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '24px',
                    color: '#94a3b8',
                    fontWeight: 500,
                  }}
                >
                  {service}
                </span>
                {idx < 4 && (
                  <span style={{ color: '#f97316', fontSize: '24px' }}>•</span>
                )}
              </div>
            ))}
          </div>

          {/* Features row */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
            }}
          >
            {[
              { icon: '🚚', text: 'Curieri verificați', color: '#22c55e' },
              { icon: '💰', text: 'Prețuri competitive', color: '#f97316' },
              { icon: '⚡', text: 'Răspuns rapid', color: '#3b82f6' },
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 28px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '50px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span style={{ fontSize: '24px' }}>{feature.icon}</span>
                <span
                  style={{
                    color: '#e2e8f0',
                    fontSize: '18px',
                    fontWeight: 600,
                  }}
                >
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '18px', color: '#f97316', fontWeight: 700 }}>
              curierulperfect.com
            </span>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '16px', color: '#22c55e' }}>✓</span>
            <span style={{ fontSize: '16px', color: '#94a3b8' }}>Gratuit pentru clienți</span>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '16px', color: '#22c55e' }}>✓</span>
            <span style={{ fontSize: '16px', color: '#94a3b8' }}>16 țări europene</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
