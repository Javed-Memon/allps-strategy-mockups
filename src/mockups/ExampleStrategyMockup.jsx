/**
 * ALLPS AI — Strategy Mockup Placeholder
 * ─────────────────────────────────────────────────────────────
 * Replace this with your actual strategy/planning mockup component.
 * This file has NO dependencies on other mockup files.
 */
import React from 'react'

export default function ExampleStrategyMockup() {
  return (
    <div style={{
      minHeight: '100%',
      background: '#0D1220',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      color: '#F0F4FF',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 28, fontWeight: 800,
          marginBottom: 12,
          background: 'linear-gradient(135deg, #F59E0B, #EC4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Strategy & Planning Mockup
        </h2>
        <p style={{ color: '#8892A4', lineHeight: 1.6, fontSize: 14 }}>
          This is a placeholder. Replace this file with your actual strategy artefact.
          Each file in <code style={{ color: '#F59E0B' }}>src/mockups/</code> becomes
          a standalone, independently launchable prototype.
        </p>
      </div>
    </div>
  )
}
