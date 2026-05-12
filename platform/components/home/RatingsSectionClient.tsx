'use client'
import { useEffect, useRef } from 'react'

interface Stats {
  avg: number; fabric: number; size: number; delivery: number; service: number; count: number
}

// fallback في حال لم تكن هناك آراء بعد
const FALLBACK: Stats = { avg: 4.9, fabric: 5.0, size: 4.9, delivery: 4.8, service: 5.0, count: 143 }

export default function RatingsSectionClient({ stats }: { stats: Stats }) {
  const s = stats.count > 0 ? stats : FALLBACK

  const BARS = [
    { label: 'جودة القماش',   score: s.fabric.toFixed(1),   pct: Math.round(s.fabric   / 5 * 100) },
    { label: 'صحة المقاسات',  score: s.size.toFixed(1),     pct: Math.round(s.size     / 5 * 100) },
    { label: 'سرعة التوصيل',  score: s.delivery.toFixed(1), pct: Math.round(s.delivery / 5 * 100) },
    { label: 'خدمة العملاء',  score: s.service.toFixed(1),  pct: Math.round(s.service  / 5 * 100) },
  ]

  const sectionRef = useRef<HTMLElement>(null)
  const barsRef    = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          barsRef.current.forEach((bar, i) => {
            if (bar) setTimeout(() => { bar.style.width = bar.dataset.pct + '%' }, i * 120)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} style={{ background: 'var(--section-contrast)', color: '#fff' }}>
      <div style={{ padding: '3rem 1.25rem', maxWidth: '32rem', margin: '0 auto', textAlign: 'center' }}>
        <p className="kicker mb-6" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.35em' }}>
          تقييمات زبائننا
        </p>

        <div className="flex items-center justify-center gap-5 mb-8">
          <span className="serif text-white" style={{ fontSize: '5rem', lineHeight: 1 }}>
            {s.avg.toFixed(1)}
          </span>
          <div className="text-start">
            <div className="flex gap-1 mb-2">
              {[0,1,2,3,4].map(i => (
                <span key={i} style={{ color: '#c9a84c', fontSize: '1.5rem', lineHeight: 1, textShadow: '0 0 8px rgba(201,168,76,0.3)' }}>★</span>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
              من +{s.count} زبون راضٍ
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', maxWidth: '32rem', margin: '0 auto' }}>
          {BARS.map((bar, i) => (
            <div key={bar.label} className="text-start">
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{bar.label}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{bar.score}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  ref={el => { if (el) barsRef.current[i] = el }}
                  data-pct={bar.pct}
                  style={{ height: '100%', background: '#c9a84c', borderRadius: '999px', width: 0, transition: 'width 1.2s cubic-bezier(0.33, 1, 0.68, 1)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
