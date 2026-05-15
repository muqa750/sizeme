'use client'

/**
 * شريط تقدم ذهبي رفيع للأعلى — يظهر فور الضغط على أي رابط داخلي
 * ويختفي عند اكتمال الانتقال. لا مكتبات، CSS فقط.
 */

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function RouteProgress() {
  const pathname     = usePathname()
  const [width, setWidth]   = useState(0)
  const [visible, setVisible] = useState(false)
  const lastPath     = useRef(pathname)
  const timers       = useRef<number[]>([])

  function clearTimers() {
    timers.current.forEach(t => clearTimeout(t))
    timers.current = []
  }

  function start() {
    clearTimers()
    setVisible(true)
    setWidth(8)
    timers.current.push(window.setTimeout(() => setWidth(35), 100) as unknown as number)
    timers.current.push(window.setTimeout(() => setWidth(65), 400) as unknown as number)
    timers.current.push(window.setTimeout(() => setWidth(85), 900) as unknown as number)
  }

  function finish() {
    clearTimers()
    setWidth(100)
    timers.current.push(window.setTimeout(() => {
      setVisible(false)
      setWidth(0)
    }, 220) as unknown as number)
  }

  // عند تغير المسار → أنهِ الشريط
  useEffect(() => {
    if (pathname !== lastPath.current) {
      lastPath.current = pathname
      finish()
    }
  }, [pathname])

  // التقاط الضغط على أي رابط داخلي → ابدأ الشريط
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // تجاهل ctrl/cmd/middle click
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.('a')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href) return
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return
      if (a.target && a.target !== '' && a.target !== '_self') return
      // لا تشغل إذا نفس المسار
      try {
        const url = new URL(a.href, window.location.origin)
        if (url.pathname === window.location.pathname && url.search === window.location.search) return
      } catch {}
      start()
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true } as any)
  }, [])

  // popstate (زر الرجوع) → ابدأ
  useEffect(() => {
    function onPop() { start() }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (!visible) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 3, zIndex: 10000, pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background: 'var(--accent)',
          boxShadow:
            '0 0 18px rgba(201,168,76,0.95),' +
            ' 0 0 10px rgba(201,168,76,0.8),' +
            ' 0 1px 4px rgba(201,168,76,0.9)',
          transition: width === 100 ? 'width 0.2s ease-out, opacity 0.25s ease-out 0.2s' : 'width 0.35s ease-out',
          opacity: width === 100 ? 0 : 1,
        }}
      />
    </div>
  )
}
