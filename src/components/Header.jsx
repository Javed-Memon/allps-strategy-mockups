import React from 'react'

export default function Header({ config, total }) {
  return (
    <header style={{
      background: config.headerGradient,
      borderBottom: '1px solid rgba(0,194,168,0.15)',
      padding: '0 24px',
      marginBottom: 36,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(0,194,168,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,194,168,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute', right: -60, top: -60,
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(0,194,168,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '32px 0',
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Logo />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
            }}>
              {config.orgName}
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#F0F4FF',
            marginBottom: 8,
          }}>
            {config.launcherName}
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            fontWeight: 300,
            letterSpacing: '0.01em',
          }}>
            {config.subtitle}
          </p>
        </div>

        {/* Count badge */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 4,
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 48,
            fontWeight: 800,
            color: 'var(--accent)',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}>
            {total}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            mockups
          </span>
        </div>
      </div>
    </header>
  )
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="7" fill="rgba(0,194,168,0.15)" />
      <path d="M8 20L14 8L20 20" stroke="#00C2A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 16H18" stroke="#00C2A8" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
