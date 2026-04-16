import React from 'react'

export default function StatsBar({ registry, filtered, search, activeCategory }) {
  const approved = registry.filter(m => m.status === 'approved').length
  const inReview = registry.filter(m => m.status === 'review').length
  const draft = registry.filter(m => m.status === 'draft').length
  const isFiltered = search || activeCategory !== 'All'

  return (
    <div style={{
      display: 'flex',
      gap: 20,
      marginBottom: 24,
      flexWrap: 'wrap',
      alignItems: 'center',
    }}>
      {isFiltered && (
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {registry.length} mockups
        </span>
      )}

      <div style={{ display: 'flex', gap: 16, marginLeft: isFiltered ? 'auto' : 0 }}>
        <Stat label="Approved" value={approved} color="#00C2A8" />
        <Stat label="In Review" value={inReview} color="#FBBF24" />
        <Stat label="Draft" value={draft} color="#4A5568" />
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  if (value === 0) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: color, fontWeight: 700 }}>{value}</span>
    </div>
  )
}
