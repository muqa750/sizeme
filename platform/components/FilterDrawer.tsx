'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { COLOR_HEX, COLOR_NAMES_AR } from '@/lib/utils'

interface Props {
  brands: string[]
  colors: string[]
  activeBrand: string | null
  activeColor: string | null
  onApply: (brand: string | null, color: string | null) => void
  totalResults: number
}

export default function FilterDrawer({
  brands,
  colors,
  activeBrand,
  activeColor,
  onApply,
  totalResults,
}: Props) {
  const [open, setOpen] = useState(false)
  const [pendingBrand, setPendingBrand] = useState<string | null>(activeBrand)
  const [pendingColor, setPendingColor] = useState<string | null>(activeColor)

  useEffect(() => { setPendingBrand(activeBrand) }, [activeBrand])
  useEffect(() => { setPendingColor(activeColor) }, [activeColor])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isActive = activeBrand !== null || activeColor !== null
  const activeCount = (activeBrand ? 1 : 0) + (activeColor ? 1 : 0)

  if (brands.length < 2 && colors.length < 2) return null

  function handleApply() {
    onApply(pendingBrand, pendingColor)
    setOpen(false)
  }

  function handleReset() {
    setPendingBrand(null)
    setPendingColor(null)
    onApply(null, null)
    setOpen(false)
  }

  const chipBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center',
    padding: '0.35rem 0.85rem', borderRadius: 999,
    fontSize: '0.75rem', letterSpacing: '0.04em',
    cursor: 'pointer', border: '1px solid var(--line)',
    background: 'transparent', color: 'var(--ink)',
    fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap',
  }
  const chipActive: React.CSSProperties = {
    ...chipBase, background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--ink)',
  }

  /* ── Portal content (overlay + drawer) ── */
  const portal = (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.68)',
          zIndex: 9000,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.28s',
        }}
      />

      {/* Bottom Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 9001,
          background: 'var(--paper)',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -16px 60px rgba(0,0,0,0.25)',
          padding: '0 1.25rem 2.5rem',
          transform: open ? 'translateY(0)' : 'translateY(105%)',
          transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1)',
          maxHeight: '82vh',
          overflowY: 'auto',
          direction: 'rtl',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0.8rem 0 0.4rem' }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--line)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', letterSpacing: '0.06em', fontWeight: 400, color: 'var(--ink)' }}>
            تصفية المنتجات
          </h3>
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mute)', padding: '0.25rem', lineHeight: 1 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* الماركة */}
        {brands.length >= 2 && (
          <div style={{ marginBottom: '1.75rem' }}>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--mute)', marginBottom: '0.75rem' }}>الماركة</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              <button style={pendingBrand === null ? chipActive : chipBase} onClick={() => setPendingBrand(null)}>الكل</button>
              {brands.map(b => (
                <button key={b} style={pendingBrand === b ? chipActive : chipBase} onClick={() => setPendingBrand(p => p === b ? null : b)}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* اللون */}
        {colors.length >= 2 && (
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--mute)', marginBottom: '0.75rem' }}>اللون</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              <button style={pendingColor === null ? chipActive : chipBase} onClick={() => setPendingColor(null)}>الكل</button>
              {colors.map(c => (
                <button
                  key={c}
                  style={{ ...(pendingColor === c ? chipActive : chipBase), gap: '0.4rem' }}
                  onClick={() => setPendingColor(p => p === c ? null : c)}
                >
                  <span style={{
                    display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                    background: COLOR_HEX[c] ?? '#ccc', border: '1px solid rgba(0,0,0,0.15)', flexShrink: 0,
                  }} />
                  {COLOR_NAMES_AR[c] ?? c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleApply}
            style={{
              flex: 1, padding: '0.75rem', borderRadius: 10,
              background: 'var(--ink)', color: 'var(--paper)',
              border: 'none', fontSize: '0.82rem', letterSpacing: '0.06em',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            عرض {totalResults > 0 ? `${totalResults} ` : ''}النتائج
          </button>
          {(pendingBrand || pendingColor) && (
            <button
              onClick={handleReset}
              style={{
                padding: '0.75rem 1.25rem', borderRadius: 10,
                background: 'transparent', color: 'var(--mute)',
                border: '1px solid var(--line)', fontSize: '0.78rem',
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              إعادة ضبط
            </button>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* ── Trigger row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>

        {/* Filter button */}
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            padding: '0.38rem 1rem', borderRadius: 999,
            border: isActive ? '1px solid var(--ink)' : '1px solid var(--line)',
            background: isActive ? 'var(--ink)' : 'transparent',
            color: isActive ? 'var(--paper)' : 'var(--ink)',
            fontSize: '0.75rem', letterSpacing: '0.06em',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          تصفية
          {activeCount > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 17, height: 17, borderRadius: '50%',
              background: 'var(--paper)', color: 'var(--ink)',
              fontSize: '0.65rem', fontWeight: 700, lineHeight: 1,
            }}>
              {activeCount}
            </span>
          )}
        </button>

        {/* Active filter chips */}
        {activeBrand && (
          <button
            onClick={() => onApply(null, activeColor)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.28rem 0.7rem', borderRadius: 999,
              border: '1px solid var(--accent)', background: 'rgba(201,168,76,0.08)',
              color: 'var(--accent)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {activeBrand}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        {activeColor && (
          <button
            onClick={() => onApply(activeBrand, null)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.28rem 0.7rem', borderRadius: 999,
              border: '1px solid var(--accent)', background: 'rgba(201,168,76,0.08)',
              color: 'var(--accent)', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <span style={{
              display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
              background: COLOR_HEX[activeColor] ?? '#ccc', border: '1px solid rgba(0,0,0,0.12)', flexShrink: 0,
            }} />
            {COLOR_NAMES_AR[activeColor] ?? activeColor}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Portal — يرسم خارج كل stacking context */}
      {typeof document !== 'undefined' && createPortal(portal, document.body)}
    </>
  )
}
