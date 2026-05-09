'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

export default function WhatsAppFloat() {
  // الموضع المحفوظ — null يعني الموضع الافتراضي (أسفل اليسار)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const btnRef       = useRef<HTMLAnchorElement>(null)
  const startRef     = useRef<{ mx: number; my: number; ex: number; ey: number } | null>(null)
  const hasDragged   = useRef(false)
  const currentPos   = useRef<{ x: number; y: number } | null>(null)

  /* استرجاع الموضع المحفوظ */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wa-float-pos')
      if (saved) {
        const p = JSON.parse(saved)
        setPos(p)
        currentPos.current = p
      }
    } catch {}
  }, [])

  /* ── بداية السحب ── */
  function onPointerDown(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = btnRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    startRef.current = { mx: e.clientX, my: e.clientY, ex: rect.left, ey: rect.top }
    hasDragged.current = false
    el.setPointerCapture(e.pointerId)
    setDragging(true)
  }

  /* ── أثناء السحب ── */
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!startRef.current) return
    const dx = e.clientX - startRef.current.mx
    const dy = e.clientY - startRef.current.my

    // اعتبره سحباً بعد 6 بكسل
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) hasDragged.current = true
    if (!hasDragged.current) return

    const SIZE = 54
    const newX = Math.max(8, Math.min(window.innerWidth  - SIZE - 8, startRef.current.ex + dx))
    const newY = Math.max(8, Math.min(window.innerHeight - SIZE - 8, startRef.current.ey + dy))
    const p = { x: newX, y: newY }
    setPos(p)
    currentPos.current = p
  }, [])

  /* ── نهاية السحب ── */
  function onPointerUp() {
    setDragging(false)
    if (hasDragged.current && currentPos.current) {
      try { localStorage.setItem('wa-float-pos', JSON.stringify(currentPos.current)) } catch {}
    }
    startRef.current = null
  }

  /* امنع فتح الرابط إذا كان المستخدم يسحب */
  function onClick(e: React.MouseEvent) {
    if (hasDragged.current) { e.preventDefault(); hasDragged.current = false }
  }

  /* الموضع: إذا محدد → top/left مطلق، وإلا → bottom/left افتراضي */
  const fixedStyle: React.CSSProperties = pos
    ? { top: pos.y, left: pos.x, bottom: 'auto', right: 'auto' }
    : { bottom: '1.75rem', left: '1.75rem', top: 'auto', right: 'auto' }

  return (
    <a
      ref={btnRef}
      href="https://wa.me/9647739334545"
      target="_blank"
      rel="noreferrer"
      aria-label="تواصل عبر واتساب"
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        ...fixedStyle,
        position: 'fixed',
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: '#fff',
        border: '1.5px solid var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(201,168,76,0.22), 0 6px 28px rgba(0,0,0,0.08)',
        zIndex: 400,
        textDecoration: 'none',
        cursor: dragging ? 'grabbing' : 'grab',
        transition: dragging ? 'none' : 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* دلالة السحب */}
      {!dragging && (
        <span style={{
          position: 'absolute',
          top: -6,
          right: -6,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: 'var(--accent)',
          border: '2px solid #fff',
          opacity: 0.85,
        }} />
      )}

      {/* أيقونة واتساب */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="26" height="26" fill="var(--accent)">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.466.666 4.776 1.83 6.764L2 30l7.418-1.799A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.56 11.56 0 01-5.89-1.607l-.422-.25-4.404 1.068 1.1-4.29-.276-.44A11.558 11.558 0 014.4 16C4.4 9.6 9.6 4.4 16 4.4S27.6 9.6 27.6 16 22.4 27.6 16 27.6zm6.35-8.633c-.348-.174-2.058-1.015-2.378-1.13-.32-.116-.552-.174-.785.174-.232.348-.9 1.13-1.103 1.362-.203.232-.406.26-.754.087-.348-.174-1.47-.542-2.8-1.727-1.034-.924-1.732-2.064-1.936-2.412-.203-.348-.022-.536.153-.71.157-.155.348-.405.522-.608.174-.203.232-.348.348-.58.116-.232.058-.435-.029-.609-.087-.174-.785-1.892-1.075-2.59-.283-.68-.57-.587-.785-.598l-.668-.012c-.232 0-.609.087-.928.435-.32.348-1.218 1.19-1.218 2.902 0 1.713 1.247 3.368 1.421 3.6.174.232 2.455 3.748 5.95 5.257.832.359 1.48.573 1.986.733.835.266 1.595.228 2.196.138.67-.1 2.058-.841 2.348-1.654.29-.812.29-1.508.203-1.654-.087-.145-.32-.232-.668-.406z" />
      </svg>
    </a>
  )
}
