'use client'
import type React from 'react'
import { COLOR_HEX, COLOR_NAMES_AR } from '@/lib/utils'

interface Props {
  brands: string[]
  colors: string[]
  activeBrand: string | null
  activeColor: string | null
  onBrand: (b: string | null) => void
  onColor: (c: string | null) => void
}

const chip = (active: boolean): React.CSSProperties => ({
  flexShrink: 0,
  padding: '0.28rem 0.8rem',
  borderRadius: '999px',
  border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
  background: active ? 'var(--ink)' : 'transparent',
  color: active ? '#fff' : 'var(--mute)',
  fontSize: '0.7rem',
  letterSpacing: '0.04em',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'all 0.18s',
  whiteSpace: 'nowrap',
  lineHeight: 1.4,
})

const label: React.CSSProperties = {
  fontSize: '0.68rem',
  letterSpacing: '0.12em',
  color: 'var(--ink)',
  fontWeight: 600,
  flexShrink: 0,
  userSelect: 'none',
}

export default function FilterBar({
  brands, colors, activeBrand, activeColor, onBrand, onColor,
}: Props) {
  if (brands.length < 2 && colors.length < 2) return null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.55rem',
        direction: 'rtl',
      }}
    >
      {/* ── الماركات ── */}
      {brands.length > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}
        >
          <span style={label}>الماركة</span>
          <button style={chip(!activeBrand)} onClick={() => onBrand(null)}>الكل</button>
          {brands.map(b => (
            <button
              key={b}
              style={chip(activeBrand === b)}
              onClick={() => onBrand(activeBrand === b ? null : b)}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      {/* ── الألوان ── */}
      {colors.length > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexWrap: 'wrap',
            direction: 'rtl',
          }}
        >
          <span style={label}>اللون</span>
          <button style={chip(!activeColor)} onClick={() => onColor(null)}>الكل</button>
          {colors.map(c => {
            const isActive = activeColor === c
            return (
              <button
                key={c}
                title={COLOR_NAMES_AR[c] ?? c}
                onClick={() => onColor(isActive ? null : c)}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: COLOR_HEX[c],
                  border: isActive
                    ? '2px solid var(--accent)'
                    : '1.5px solid rgba(0,0,0,0.14)',
                  outline: isActive ? '2.5px solid var(--accent)' : 'none',
                  outlineOffset: 2,
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0,
                  transition: 'outline 0.15s, border 0.15s',
                  boxShadow: c === 'White' ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : 'none',
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
