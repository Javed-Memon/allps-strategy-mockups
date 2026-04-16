import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react'
import config from './launcher.config.js'
import registry from './mockups-registry.json'
import Header from './components/Header.jsx'
import MockupCard from './components/MockupCard.jsx'
import SearchBar from './components/SearchBar.jsx'
import CategoryFilter from './components/CategoryFilter.jsx'
import MockupViewer from './components/MockupViewer.jsx'
import PinGate from './components/PinGate.jsx'
import StatsBar from './components/StatsBar.jsx'

// Auto-discover all JSX mockup files
const mockupModules = import.meta.glob('./mockups/*.jsx')

function isNew(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr)
  const now = new Date()
  return (now - d) / (1000 * 60 * 60 * 24) <= 7
}

export default function App() {
  const [unlocked, setUnlocked] = useState(!config.accessPin)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeStatus, setActiveStatus] = useState('all')
  const [openMockup, setOpenMockup] = useState(null)
  const [openMeta, setOpenMeta] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  // Override CSS variables from config
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', config.accentColor)
    document.documentElement.style.setProperty('--accent-dark', config.accentColorDark)
  }, [])

  const filtered = registry
    .filter(m => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.tags || []).some(t => t.toLowerCase().includes(q)) ||
        m.category.toLowerCase().includes(q)
      const matchCat = activeCategory === 'All' || m.category === activeCategory
      const matchStatus = activeStatus === 'all' || m.status === activeStatus
      return matchSearch && matchCat && matchStatus
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.addedAt) - new Date(a.addedAt)
      if (sortBy === 'oldest') return new Date(a.addedAt) - new Date(b.addedAt)
      if (sortBy === 'alpha') return a.title.localeCompare(b.title)
      return 0
    })

  const handleLaunch = useCallback((mockup) => {
    if (mockup.type === 'html') {
      window.open(`/mockups/html/${mockup.file}`, '_blank')
      return
    }
    setOpenMockup(mockup)
  }, [])

  const handleShowMeta = useCallback((mockup, e) => {
    e.stopPropagation()
    setOpenMeta(mockup)
  }, [])

  if (!unlocked) return <PinGate pin={config.accessPin} onUnlock={() => setUnlocked(true)} config={config} />

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header config={config} total={registry.length} />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 24,
          paddingTop: 8,
        }}>
          <SearchBar value={search} onChange={setSearch} />

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={selectStyle}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="alpha">A → Z</option>
          </select>

          <select
            value={activeStatus}
            onChange={e => setActiveStatus(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All statuses</option>
            <option value="approved">Approved</option>
            <option value="review">In Review</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <CategoryFilter
          categories={config.categories}
          active={activeCategory}
          onChange={setActiveCategory}
          registry={registry}
        />

        <StatsBar registry={registry} filtered={filtered} search={search} activeCategory={activeCategory} />

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}>
            {filtered.map((mockup, i) => (
              <MockupCard
                key={mockup.id}
                mockup={mockup}
                isNew={isNew(mockup.addedAt)}
                onLaunch={handleLaunch}
                onShowMeta={handleShowMeta}
                animationDelay={i * 40}
              />
            ))}
          </div>
        )}
      </main>

      {/* Mockup viewer overlay */}
      {openMockup && (
        <MockupViewer
          mockup={openMockup}
          modules={mockupModules}
          onClose={() => setOpenMockup(null)}
        />
      )}

      {/* Metadata sidebar */}
      {openMeta && (
        <MetaSidebar mockup={openMeta} onClose={() => setOpenMeta(null)} onLaunch={handleLaunch} />
      )}
    </div>
  )
}

function EmptyState({ search }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 20px',
      color: 'var(--text-secondary)',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>◎</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8, color: 'var(--text-primary)' }}>
        No mockups found
      </div>
      <div style={{ fontSize: 14 }}>
        {search ? `No results for "${search}"` : 'No mockups match the current filters'}
      </div>
    </div>
  )
}

function MetaSidebar({ mockup, onClose, onLaunch }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      {/* backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }} />

      {/* Panel */}
      <div
        style={{
          position: 'relative',
          width: 360,
          height: '100%',
          background: 'var(--bg-card)',
          borderLeft: '1px solid var(--border)',
          padding: 32,
          overflowY: 'auto',
          animation: 'slideIn 0.25s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }`}</style>

        <button onClick={onClose} style={closeBtn}>✕</button>

        <div style={{ marginBottom: 24 }}>
          <StatusBadge status={mockup.status} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 12, marginBottom: 8, lineHeight: 1.3 }}>
            {mockup.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
            {mockup.description}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 24 }}>
          <MetaRow label="Category" value={mockup.category} />
          <MetaRow label="Type" value={mockup.type === 'react' ? 'React (JSX)' : 'HTML'} />
          <MetaRow label="Added" value={mockup.addedAt} />
          <MetaRow label="Added by" value={mockup.addedBy || '—'} />
        </div>

        {mockup.tags?.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Tags</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {mockup.tags.map(t => (
                <span key={t} style={{
                  fontSize: 12, padding: '4px 10px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 20, color: 'var(--text-secondary)',
                }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => { onClose(); onLaunch(mockup) }}
          style={{
            width: '100%', padding: '14px 0',
            background: 'var(--accent)', color: '#000',
            border: 'none', borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 15, cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Launch Mockup →
        </button>
      </div>
    </div>
  )
}

function MetaRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    approved: { label: 'Approved', bg: 'rgba(0,194,168,0.15)', color: '#00C2A8' },
    review:   { label: 'In Review', bg: 'rgba(251,191,36,0.15)', color: '#FBBF24' },
    draft:    { label: 'Draft', bg: 'rgba(255,255,255,0.08)', color: '#8892A4' },
  }
  const s = map[status] || map.draft
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '4px 10px', borderRadius: 20,
      background: s.bg, color: s.color,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: s.color,
        animation: status === 'review' ? 'pulse-dot 2s ease infinite' : 'none',
      }} />
      {s.label}
    </span>
  )
}

const selectStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-secondary)',
  padding: '8px 12px',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  outline: 'none',
}

const closeBtn = {
  position: 'absolute', top: 16, right: 16,
  background: 'transparent', border: 'none',
  color: 'var(--text-secondary)', cursor: 'pointer',
  fontSize: 18, padding: 8, borderRadius: 6,
  transition: 'color 0.15s',
}
