'use client'
import { useState } from 'react'
import { submitReview } from '@/lib/actions/reviews'

const CRITERIA = [
  { key: 'fabric_rating',   label: 'جودة القماش'   },
  { key: 'size_rating',     label: 'صحة المقاسات'  },
  { key: 'delivery_rating', label: 'سرعة التوصيل'  },
  { key: 'service_rating',  label: 'خدمة العملاء'   },
] as const

type RatingKey = typeof CRITERIA[number]['key']

const inp: React.CSSProperties = {
  width: '100%', border: '1px solid var(--line)', borderRadius: 0,
  padding: '0.7rem 0.875rem', fontSize: '0.875rem', fontFamily: 'inherit',
  background: 'var(--paper)', color: 'var(--ink)', outline: 'none',
  boxSizing: 'border-box', direction: 'rtl',
}

export default function ReviewForm() {
  const [name, setName]   = useState('')
  const [body, setBody]   = useState('')
  const [ratings, setRatings] = useState<Record<RatingKey, number>>({
    fabric_rating: 0, size_rating: 0, delivery_rating: 0, service_rating: 0,
  })
  const [hover, setHover] = useState<Record<RatingKey, number>>({
    fabric_rating: 0, size_rating: 0, delivery_rating: 0, service_rating: 0,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const allRated = Object.values(ratings).every(v => v > 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !body.trim() || !allRated) return
    setStatus('loading'); setErrMsg('')

    const res = await submitReview({
      name, body,
      fabric_rating:   ratings.fabric_rating,
      size_rating:     ratings.size_rating,
      delivery_rating: ratings.delivery_rating,
      service_rating:  ratings.service_rating,
    })

    if (res.ok) {
      setStatus('done')
    } else {
      setStatus('error'); setErrMsg(res.error ?? 'حدث خطأ')
    }
  }

  if (status === 'done') {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem', border: '1px solid var(--line)', background: '#fafaf9' }}>
        <p className="serif" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>شكراً على رأيك 🤍</p>
        <p style={{ fontSize: '0.825rem', color: 'var(--mute)' }}>تقييمك يساعد زبائن آخرين في اختيار المقاس الصحيح.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid var(--line)', background: '#fafaf9', padding: '2rem 1.75rem' }}>
      <p className="serif" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--ink)' }}>
        شاركنا رأيك
      </p>

      {/* الاسم */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--mute)', marginBottom: '0.35rem', letterSpacing: '0.08em' }}>
          الاسم
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="الاسم الكامل"
          maxLength={60}
          required
          style={inp}
        />
      </div>

      {/* الرأي */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--mute)', marginBottom: '0.35rem', letterSpacing: '0.08em' }}>
          رأيك
        </label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="شاركنا تجربتك مع المنتج والتوصيل..."
          maxLength={600}
          rows={4}
          required
          style={{ ...inp, resize: 'vertical', minHeight: 100 }}
        />
      </div>

      {/* التقييمات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        {CRITERIA.map(({ key, label }) => (
          <div key={key}>
            <p style={{ fontSize: '0.72rem', color: 'var(--mute)', marginBottom: '0.5rem', letterSpacing: '0.06em' }}>{label}</p>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatings(p => ({ ...p, [key]: star }))}
                  onMouseEnter={() => setHover(p => ({ ...p, [key]: star }))}
                  onMouseLeave={() => setHover(p => ({ ...p, [key]: 0 }))}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                    fontSize: '1.4rem', lineHeight: 1,
                    color: star <= (hover[key] || ratings[key]) ? 'var(--accent)' : 'var(--line)',
                    transition: 'color 0.1s',
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {errMsg && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{errMsg}</p>}

      <button
        type="submit"
        disabled={status === 'loading' || !name.trim() || !body.trim() || !allRated}
        style={{
          background: 'var(--ink)', color: '#fff', border: 'none',
          padding: '0.75rem 2.5rem', fontSize: '0.78rem',
          letterSpacing: '0.1em', cursor: 'pointer',
          fontFamily: 'inherit', opacity: (!name.trim() || !body.trim() || !allRated) ? 0.4 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {status === 'loading' ? '...' : 'أرسل رأيك'}
      </button>
    </form>
  )
}
