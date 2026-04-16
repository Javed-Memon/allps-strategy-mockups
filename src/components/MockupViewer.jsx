import React, { Suspense, lazy, useEffect } from 'react'

export default function MockupViewer({ mockup, modules, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const modulePath = `./mockups/${mockup.file}.jsx`
  const loader = modules[modulePath]

  if (!loader) {
    return (
      <Overlay onClose={onClose} title={mockup.title}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100%', color: 'var(--text-secondary)',
          gap: 12,
        }}>
          <span style={{ fontSize: 40 }}>⚠</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Mockup file not found</span>
          <code style={{ fontSize: 12, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 6 }}>
            {modulePath}
          </code>
        </div>
      </Overlay>
    )
  }

  const LazyComponent = lazy(loader)

  return (
    <Overlay onClose={onClose} title={mockup.title}>
      <Suspense fallback={<LoadingSpinner />}>
        <LazyComponent />
      </Suspense>
    </Overlay>
  )
}

function Overlay({ onClose, title, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: '#07090F',
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.2s ease',
    }}>
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

      {/* Viewer toolbar */}
      <div style={{
        height: 48,
        background: 'rgba(13,18,32,0.95)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 12,
        flexShrink: 0,
        backdropFilter: 'blur(8px)',
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px 12px',
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'var(--font-body)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          ← Back to Launcher
        </button>

        <div style={{
          flex: 1,
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 13,
          color: 'var(--text-secondary)',
          letterSpacing: '0.03em',
        }}>
          {title}
        </div>

        <div style={{ width: 120 }} /> {/* spacer to center title */}
      </div>

      {/* Mockup content area */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', gap: 16,
      color: 'var(--text-secondary)',
    }}>
      <div style={{
        width: 32, height: 32,
        border: '2px solid var(--border)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <span style={{ fontSize: 13 }}>Loading mockup…</span>
    </div>
  )
}
