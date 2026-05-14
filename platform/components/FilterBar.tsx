'use client'
import type React from 'react'
import { COLOR_HEX, COLOR_NAMES_AR } from '@/lib/utils'

interface Props {
  brands: string[]
  colors: string[]
  activeBrands: string[]
  activeColors: string[]
  onBrand: (brands: string[]) => void
  onColor: (colors: string[]) => void
}

function getLuminance(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
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

const COLOR_ORDER = [
  'Black', 'White', 'Burgundy', 'Taupe', 'Olive', 'Royal Blue', 'Charcoal', 'Brown', 'Dark Navy',
]

export default function FilterBar({
  brands, colors, activeBrands, activeColors, onBrand, onColor,
}: Props) {
  if (brands.length < 2 && colors.length < 2) return null

  function toggleBrand(b: string) {
    onBrand(activeBrands.includes(b) ? activeBrands.filter(x => x !== b) : [...activeBrands, b])
  }

  function toggleColor(c: string) {
    onColor(activeColors.includes(c) ? activeColors.filter(x => x !== c) : [...activeColors, c])
  }

  const sortedColors = [...colors].sort((a, b) => {
    const ai = COLOR_ORDER.indexOf(a)
    const bi = COLOR_ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', direction: 'rtl', paddingTop: '1rem', paddingBottom: '1.25rem' }}>

      {/* ── الماركات — صفين بحجم طبيعي لكل زر ── */}
      {brands.length > 1 && (() => {
        const mid  = Math.ceil(brands.length / 2)
        const row1 = brands.slice(0, mid)
        const row2 = brands.slice(mid)
        const rowStyle: React.CSSProperties = {
          display: 'flex', flexWrap: 'nowrap', gap: '0.35rem',
          scrollbarWidth: 'none',
        }
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', paddingRight: '1.25rem' }}>
              <span style={label}>الماركة</span>
              <button style={chip(activeBrands.length === 0)} onClick={() => onBrand([])}>الكل</button>
            </div>
            <div style={{ overflowX: 'auto', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingRight: '1.25rem', paddingLeft: '1.25rem' } as React.CSSProperties}>
              <div style={rowStyle}>
                {row1.map(b => (
                  <button key={b} style={chip(activeBrands.includes(b))} onClick={() => toggleBrand(b)}>{b}</button>
                ))}
              </div>
              {row2.length > 0 && (
                <div style={rowStyle}>
                  {row2.map(b => (
                    <button key={b} style={chip(activeBrands.includes(b))} onClick={() => toggleBrand(b)}>{b}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* ── الألوان — صف واحد مع تمرير ── */}
      {colors.length > 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', paddingRight: '1.25rem' }}>
            <span style={label}>اللون</span>
            <button style={chip(activeColors.length === 0)} onClick={() => onColor([])}>الكل</button>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            gap: '0.4rem',
            paddingRight: '1.25rem',
            paddingLeft: '1.25rem',
            paddingBottom: '2px',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}>
            {sortedColors.map(c => {
              const hex = COLOR_HEX[c] ?? '#888888'
              const isActive = activeColors.includes(c)
              const textColor = getLuminance(hex) > 0.5 ? '#1a1a1a' : '#ffffff'
              return (
                <button
                  key={c}
                  onClick={() => toggleColor(c)}
                  style={{
                    flexShrink: 0,
                    width: 64,
                    height: 32,
                    borderRadius: '999px',
                    background: hex,
                    color: textColor,
                    fontSize: '0.6rem',
                    letterSpacing: '0.02em',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: 'all 0.18s',
                    border: isActive
                      ? '2.5px solid var(--accent)'
                      : `1.5px solid ${getLuminance(hex) > 0.85 ? 'rgba(0,0,0,0.15)' : 'transparent'}`,
                    outline: isActive ? '2px solid var(--accent)' : 'none',
                    outlineOffset: 2,
                    boxSizing: 'border-box',
                  }}
                >
                  {COLOR_NAMES_AR[c] ?? c}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
