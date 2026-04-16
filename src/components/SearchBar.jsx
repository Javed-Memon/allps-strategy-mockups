import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 0 }}>
      <svg
        style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', pointerEvents: 'none',
        }}
        width="15" height="15" viewBox="0 0 15 15" fill="none"
      >
        <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      <input
        type="text"
        placeholder="Search mockups…"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: 'var(--bg-card)',
          border: `1px solid ${value ? 'var(--border-accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          padding: '9px 12px 9px 36px',
          fontSize: 13,
          fontFamily: 'var(--font-body)',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onBlur={e => e.currentTarget.style.borderColor = value ? 'var(--border-accent)' : 'var(--border)'}
      />

      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: 2, fontSize: 14,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ✕
        </button>
      )}
    </div>
  )
}
