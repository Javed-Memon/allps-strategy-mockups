import React, { useState } from 'react'
import { StatusBadge } from '../App.jsx'

const categoryColors = {
  'Product Roadmap':       '#F59E0B',
  'Go-to-Market':          '#EC4899',
  'Competitive Analysis':  '#6366F1',
  'Pricing & Packaging':   '#10B981',
  'Investor Materials':    '#3B82F6',
  'Partnership Strategy':  '#8B5CF6',
  'Hiring & Org Design':   '#F97316',
  'OKRs & Metrics':        '#14B8A6',
  'Customer Research':     '#EAB308',
  'Other':                 '#94A3B8',
}

export default function MockupCard({ mockup, isNew, onLaunch, onShowMeta, animationDelay }) {
  const [hovered, setHovered] = useState(false)
  const catColor = categoryColors[mockup.category] || '#94A3B8'

  return (
    <div
      className="fade-up"
      style={{
        animationDelay: `${animationDelay}ms`,
        background: hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--border-accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: 24,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onLaunch(mockup)}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: catColor, opacity: 0.7,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <StatusBadge status={mockup.status} />
          {isNew && <NewBadge />}
        </div>
        <button
          onClick={(e) => onShowMeta(mockup, e)}
          title="View details"
          style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 6, color: 'var(--text-muted)', cursor: 'pointer',
            padding: '3px 8px', fontSize: 11, letterSpacing: '0.05em',
            transition: 'all 0.15s', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          INFO
        </button>
      </div>

      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
          lineHeight: 1.3, marginBottom: 8, color: 'var(--text-primary)',
        }}>
          {mockup.title}
        </h3>
        <p style={{
          color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {mockup.description}
        </p>
      </div>

      <div style={{
        marginTop: 'auto', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 11, padding: '3px 9px', borderRadius: 20, fontWeight: 600,
            background: `${catColor}18`, color: catColor, letterSpacing: '0.03em',
          }}>
            {mockup.category}
          </span>
          <span style={{
            fontSize: 11, padding: '3px 8px', borderRadius: 20,
            background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)',
          }}>
            {mockup.type === 'react' ? 'JSX' : 'HTML'}
          </span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: hovered ? 'var(--accent)' : 'var(--text-muted)',
          fontSize: 13, fontWeight: 600, transition: 'color 0.15s',
          fontFamily: 'var(--font-display)',
        }}>
          Launch
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            style={{ transition: 'transform 0.2s', transform: hovered ? 'translateX(3px)' : 'translateX(0)' }}>
            <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

function NewBadge() {
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 20,
      background: 'rgba(251,191,36,0.15)', color: '#FBBF24',
      border: '1px solid rgba(251,191,36,0.25)',
    }}>
      New
    </span>
  )
}
