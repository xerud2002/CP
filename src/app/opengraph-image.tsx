/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Curierul Perfect - Transport Romania Europa';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Fetch the logo image and convert to base64 data URL
  const logoResponse = await fetch(
    new URL('/img/logo2.png', 'https://curierulperfect.com')
  );
  const logoArrayBuffer = await logoResponse.arrayBuffer();
  const logoBase64 = Buffer.from(logoArrayBuffer).toString('base64');
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

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
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            {/* Logo from website */}
            <img
              src={logoDataUrl}
              alt="Curierul Perfect"
              width={64}
              height={64}
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'contain',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '38px',
                  fontWeight: 700,
                  color: '#FF8C00',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
              >
                CurierulPerfect
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: '#6b7280',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginTop: '4px',
                  textAlign: 'center',
                }}
              >
                - TRANSPORT EUROPA - ROMANIA -
              </span>
            </div>
          </div>

          {/* Main title with gradient */}
          <div
            style={{
              fontSize: '54px',
              fontWeight: 700,
              background: 'linear-gradient(to right, #ffffff 0%, #f97316 50%, #ffffff 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              textAlign: 'center',
              marginBottom: '20px',
              lineHeight: 1.1,
            }}
          >
            Transport national si european
          </div>

          {/* Services grid - 2 rows */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}
          >
            {/* Row 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {['Colete', 'Plicuri', 'Persoane', 'Mobila'].map((service, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '22px',
                      color: '#e2e8f0',
                      fontWeight: 500,
                    }}
                  >
                    {service}
                  </span>
                  {idx < 3 && (
                    <span style={{ color: '#f97316', fontSize: '20px', marginLeft: '6px' }}>•</span>
                  )}
                </div>
              ))}
            </div>
            {/* Row 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {['Electronice', 'Animale', 'Platforma Auto', 'Tractari'].map((service, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '22px',
                      color: '#94a3b8',
                      fontWeight: 500,
                    }}
                  >
                    {service}
                  </span>
                  {idx < 3 && (
                    <span style={{ color: '#f97316', fontSize: '20px', marginLeft: '6px' }}>•</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Features row with SVG icons */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
            }}
          >
            {/* Curieri verificati */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 28px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '50px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              <span style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 600 }}>
                Curieri verificati
              </span>
            </div>

            {/* Preturi competitive */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 28px',
                background: 'rgba(249, 115, 22, 0.1)',
                borderRadius: '50px',
                border: '1px solid rgba(249, 115, 22, 0.3)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              <span style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 600 }}>
                Preturi competitive
              </span>
            </div>

            {/* Raspuns rapid */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 28px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '50px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 600 }}>
                Raspuns rapid
              </span>
            </div>
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
            background: 'rgba(0, 0, 0, 0.4)',
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
              gap: '8px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span style={{ fontSize: '16px', color: '#94a3b8' }}>Gratuit pentru toti</span>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span style={{ fontSize: '16px', color: '#94a3b8' }}>20 tari europene</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
