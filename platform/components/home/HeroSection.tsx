'use client'
import { useEffect, useRef } from 'react'

interface Props {
  videoUrl?: string
}

export default function HeroSection({ videoUrl }: Props) {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const video    = videoRef.current
    const fallback = fallbackRef.current
    if (!video || !fallback) return

    // إخفاء الـ fallback عند تحضّر الفيديو
    const show = () => { fallback.style.opacity = '0'; fallback.style.pointerEvents = 'none' }
    const hide = () => { fallback.style.opacity = '1'; fallback.style.pointerEvents = 'none' }

    if (video.readyState >= 3) {
      show()
    } else {
      video.addEventListener('canplay', show, { once: true })
      video.addEventListener('error',   hide, { once: true })
    }

    // iOS / Safari: بعض المتصفحات تتجاهل autoplay حتى مع muted
    // نستدعي play() يدوياً داخل useEffect (بعد mount)
    const tryPlay = () => {
      const p = video.play()
      if (p !== undefined) {
        p.catch(() => {
          // silent — بعض المتصفحات القديمة ترفض فنتركها
        })
      }
    }

    if (video.readyState >= 2) {
      tryPlay()
    } else {
      video.addEventListener('loadeddata', tryPlay, { once: true })
    }

    return () => {
      video.removeEventListener('canplay',    show)
      video.removeEventListener('error',      hide)
      video.removeEventListener('loadeddata', tryPlay)
    }
  }, [videoUrl])

  return (
    <section className="pt-10 md:pt-16">

      {/* ── النص ── */}
      <div className="text-center mb-8 max-w-7xl mx-auto px-5">
        <p className="kicker hero-rise" style={{ marginBottom: '0.75rem' }}>
          أناقة تناسب كل المقاسات.
        </p>
        <h1
          className="serif hero-rise-1"
          style={{ fontSize: 'clamp(2.1rem, 8.2vw, 4.1rem)', lineHeight: 1.1, marginTop: '0.75rem' }}
        >
          الوجهة الأولى في العراق
          <br />
          <span style={{ color: 'var(--mute)' }}>للمقاسات الخاصة</span>
        </h1>
        <p
          className="hero-rise-2 mx-auto"
          style={{ color: 'var(--mute)', marginTop: '1rem', maxWidth: '36rem', fontSize: 'clamp(0.875rem, 2.3vw, 1rem)' }}
        >
          تشكيلات حصرية من دور الأزياء العالمية تلائم أسلوب حياتك
        </p>
      </div>

      {/* ── الفيديو ── */}
      <div
        className="hero-rise-3"
        style={{
          aspectRatio: '16/9',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2a24 100%)',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* الفيديو — يظهر فقط إذا وُجد رابط */}
        {videoUrl && (
          <video
            key={videoUrl}
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              pointerEvents: 'none',
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Fallback — يختفي بعد تحمّل الفيديو */}
        <div
          ref={fallbackRef}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.5s ease',
            opacity: 1,
          }}
        >
          <div className="text-center">
            <div style={{
              width: 78, height: 78, borderRadius: '999px',
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              backdropFilter: 'blur(8px)',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="serif" style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.25em' }}>
              رؤيتنا
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
