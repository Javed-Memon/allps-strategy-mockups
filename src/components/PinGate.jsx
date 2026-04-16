import React, { useState, useRef, useEffect } from 'react'

export default function PinGate({ pin, onUnlock, config }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const refs = [useRef(), useRef(), useRef(), useRef()]

  useEffect(() => { refs[0].current?.focus() }, [])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    setError(false)
    if (val && i < 3) refs[i + 1].current?.focus()

    if (val && i === 3) {
      const entered = [...next].join('')
      if (entered === String(pin)) {
        onUnlock()
      } else {
        setShake(true)
        setError(true)
        setTimeout(() => {
          setDigits(['', '', '', ''])
          setShake(false)
          refs[0].current?.focus()
        }, 600)
      }
    }
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: config.headerGradient,
    }}>
      <div style={{
        textAlign: 'center',
        padding: 48,
        background: 'rgba(13,18,32,0.8)',
        borderRadius: 20,
        border: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        maxWidth: 340,
        width: '90%',
      }}>
        <div style={{
          width: 56, height: 56,
          background: 'rgba(0,194,168,0.1)',
          borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: 24,
        }}>
          🔒
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22, fontWeight: 700,
          marginBottom: 8, color: 'var(--text-primary)',
        }}>
          {config.launcherName}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 32, lineHeight: 1.5 }}>
          Enter your 4-digit PIN to access this launcher
        </p>

        <div style={{
          display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20,
          animation: shake ? 'shake 0.4s ease' : 'none',
        }}>
          <style>{`
            @keyframes shake {
              0%,100% { transform: translateX(0) }
              25% { transform: translateX(-8px) }
              75% { transform: translateX(8px) }
            }
          `}</style>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                width: 52, height: 60,
                textAlign: 'center',
                fontSize: 28, fontWeight: 700,
                fontFamily: 'var(--font-display)',
                background: error ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${error ? 'rgba(239,68,68,0.4)' : (d ? 'var(--accent)' : 'var(--border)')}`,
                borderRadius: 12,
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>Incorrect PIN. Try again.</p>
        )}
      </div>
    </div>
  )
}
