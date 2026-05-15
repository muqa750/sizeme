'use client'
import { useRef, useState, useEffect } from 'react'

interface Props {
  children: React.ReactNode
}

/**
 * Wrapper يدعم:
 * - Touch scroll على الموبايل (تلقائي)
 * - Drag scroll بالماوس على الديسكتوب
 * - منع فتح الرابط أثناء السحب
 */
export default function SimilarProductsScroll({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // حالة الـ drag (داخل ref حتى لا تسبب re-render)
  const drag = useRef({
    active:    false,
    startX:    0,
    scrollX:   0,
    moved:     0,
  })

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    // فقط زر الماوس الأيسر
    if (e.button !== 0) return
    drag.current.active  = true
    drag.current.startX  = e.pageX
    drag.current.scrollX = el.scrollLeft
    drag.current.moved   = 0
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el || !drag.current.active) return
    const dx = e.pageX - drag.current.startX
    drag.current.moved = Math.abs(dx)
    // RTL: السحب لليمين يقلل scrollLeft (في RTL القيم سالبة)
    el.scrollLeft = drag.current.scrollX - dx
    // تفعيل حالة is-dragging بعد عتبة 5px لتجنب false positive
    if (drag.current.moved > 5 && !isDragging) {
      setIsDragging(true)
    }
  }

  function endDrag() {
    if (!drag.current.active) return
    drag.current.active = false
    // إنهاء حالة السحب بعد تأخير صغير لمنع click عرضي
    setTimeout(() => setIsDragging(false), 50)
  }

  // إنهاء السحب لو خرج الماوس من النافذة كلها
  useEffect(() => {
    function onUp() { endDrag() }
    window.addEventListener('mouseup', onUp)
    return () => window.removeEventListener('mouseup', onUp)
  }, [])

  // منع click عند انتهاء سحب فعلي
  function onClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.moved > 5) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div
      ref={ref}
      className={`similar-scroll${isDragging ? ' is-dragging' : ''}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onClickCapture={onClickCapture}
    >
      {children}
    </div>
  )
}
