'use client'
import { useEffect } from 'react'

export default function SplashLoader() {
  useEffect(() => {
    // بعد تحميل الصفحة نفدّي الـ loader
    const el = document.getElementById('sizeLoader')
    if (!el) return

    // نعطيه وقت بسيط يتنفس ثم يختفي
    const timer = setTimeout(() => {
      el.classList.add('fade-out')
    }, 1400)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div id="sizeLoader" aria-hidden="true">
      <div className="ld-logo">SIZEME</div>
    </div>
  )
}
