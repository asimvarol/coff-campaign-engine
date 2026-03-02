import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Coff Campaign Engine'
  const subtitle = searchParams.get('subtitle') || 'AI-Powered Marketing Platform'

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
          backgroundColor: '#0A0A0A',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1A1A1A 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1A1A1A 0%, transparent 50%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 40,
              fontWeight: 400,
              color: '#888888',
              textAlign: 'center',
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
