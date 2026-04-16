import React from 'react'

export default function CategoryFilter({ categories, active, onChange, registry }) {
  const counts = registry.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1
    return acc
  }, {})

  return (
    <div style={{
      display: 'flex',
      gap: 6,
      overflowX: 'auto',
      paddingBottom: 16,
      marginBottom: 24,
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      <style>{`.cat-scroll::-webkit-scrollbar { display: none; }`}</style>

      {categories.map(cat => {
        const isActive = active === cat
        const count = cat === 'All' ? registry.length : (counts[cat] || 0)
        if (cat !== 'All' && count === 0) return null

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            style={{
              flexShrink: 0,
              padding: '7px 14px',
              borderRadius: 100,
              fontSize: 12,
              fontWeight: isActive ? 700 : 500,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
              background: isActive ? 'rgba(0,194,168,0.12)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {cat}
            <span style={{
              fontSize: 10,
              background: isActive ? 'rgba(0,194,168,0.2)' : 'rgba(255,255,255,0.07)',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              padding: '1px 6px',
              borderRadius: 20,
              fontWeight: 700,
            }}>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
