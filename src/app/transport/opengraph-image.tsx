import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Transport România Europa | Curierul Perfect';
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
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(to bottom right, #f97316, #ea580c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="32"
              height="32"
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
              fontSize: '28px',
              fontWeight: 700,
              color: '#f97316',
            }}
          >
            Curierul Perfect
          </span>
        </div>

        {/* Flags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* RO Flag */}
          <div
            style={{
              width: '80px',
              height: '52px',
              borderRadius: '8px',
              display: 'flex',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ flex: 1, background: '#002B7F' }} />
            <div style={{ flex: 1, background: '#FCD116' }} />
            <div style={{ flex: 1, background: '#CE1126' }} />
          </div>

          {/* Arrow */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>

          {/* EU Flag */}
          <div
            style={{
              width: '80px',
              height: '52px',
              borderRadius: '8px',
              background: '#003399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontSize: '28px' }}>🇪🇺</span>
          </div>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: '60px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
            lineHeight: 1.1,
          }}
        >
          Transport România - Europa
        </div>

        {/* Countries */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {['🇩🇪 Germania', '🇮🇹 Italia', '🇪🇸 Spania', '🇬🇧 UK', '🇫🇷 Franța'].map(
            (country, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '18px',
                  color: '#e2e8f0',
                }}
              >
                {country}
              </div>
            )
          )}
        </div>

        {/* Services */}
        <div
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            textAlign: 'center',
          }}
        >
          Colete • Mobilă • Persoane • Mașini • Animale
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
            Postează gratuit • Primești oferte
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
