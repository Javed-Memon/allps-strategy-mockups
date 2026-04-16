import React from 'react'

export default function Header({ config, total, theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <header style={{
      background: 'var(--header-bg)',
      borderBottom: '1px solid var(--header-border)',
      padding: '0 24px',
      marginBottom: 36,
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.25s ease, border-color 0.25s ease',
    }}>
      {/* Decorative grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(var(--header-grid) 1px, transparent 1px),
          linear-gradient(90deg, var(--header-grid) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute', right: -60, top: -60,
        width: 300, height: 300,
        background: `radial-gradient(circle, rgba(0,194,168,${isDark ? '0.08' : '0.06'}) 0%, transparent 70%)`,
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
            color: 'var(--header-title)',
            marginBottom: 8,
            transition: 'color 0.25s ease',
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

        {/* Right: count + theme toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
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
      </div>
    </header>
  )
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '7px 13px',
        borderRadius: 100,
        border: '1px solid var(--border)',
        background: 'var(--toggle-bg)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        fontSize: 12,
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--toggle-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--toggle-bg)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 1V2.5M7 11.5V13M1 7H2.5M11.5 7H13M2.93 2.93L4 4M10 10L11.07 11.07M2.93 11.07L4 10M10 4L11.07 2.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M12 8.5A5.5 5.5 0 015.5 2a5.5 5.5 0 100 10A5.5 5.5 0 0012 8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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
