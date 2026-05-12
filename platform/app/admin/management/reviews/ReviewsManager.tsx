'use client'
import { useState, useTransition } from 'react'
import type { Review } from '@/lib/types'

interface Props { reviews: Review[] }

const inp: React.CSSProperties = {
  width: '100%', border: '1px solid #e0e0e0', borderRadius: 6,
  padding: '8px 10px', fontSize: 13, fontFamily: 'inherit',
  color: '#1a1a1a', background: '#fff', boxSizing: 'border-box',
  direction: 'rtl',
}

export default function ReviewsManager({ reviews: initial }: Props) {
  const [reviews, setReviews] = useState(initial)
  const [editId, setEditId]   = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editBody, setEditBody] = useState('')
  const [pending, start]      = useTransition()
  const [err, setErr]         = useState('')

  function startEdit(r: Review) {
    setEditId(r.id); setEditName(r.name); setEditBody(r.body); setErr('')
  }

  function cancelEdit() { setEditId(null); setErr('') }

  function handleSave(id: number) {
    if (!editName.trim() || !editBody.trim()) return
    setErr('')
    start(async () => {
      const res = await fetch('/api/admin/review', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editName, body: editBody }),
      })
      if (!res.ok) { setErr('حدث خطأ'); return }
      setReviews(prev => prev.map(r => r.id === id ? { ...r, name: editName, body: editBody } : r))
      setEditId(null)
    })
  }

  function handleDelete(id: number) {
    if (!confirm('حذف هذا الرأي نهائياً؟')) return
    start(async () => {
      const res = await fetch('/api/admin/review', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) { setErr('حدث خطأ'); return }
      setReviews(prev => prev.filter(r => r.id !== id))
    })
  }

  const avg = (r: Review) =>
    ((r.fabric_rating + r.size_rating + r.delivery_rating + r.service_rating) / 4).toFixed(1)

  return (
    <div style={{ padding: '1.25rem 1rem', direction: 'rtl', maxWidth: 860, margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a' }}>
          الآراء
          <span style={{ fontSize: '0.78rem', color: '#aaa', marginRight: 6, fontWeight: 400 }}>({reviews.length})</span>
        </h1>
      </div>

      {err && <p style={{ color: '#c0392b', fontSize: '0.78rem', marginBottom: 12 }}>{err}</p>}

      {reviews.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#aaa', background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8 }}>
          لا توجد آراء بعد
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {reviews.map(r => (
          <div key={r.id} style={{ background: '#fff', border: `1px solid ${editId === r.id ? '#c9a84c44' : '#e5e5e5'}`, borderRadius: 10, padding: '14px 16px' }}>

            {editId === r.id ? (
              /* وضع التعديل */
              <div>
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: '0.65rem', color: '#bbb', marginBottom: 4 }}>الاسم</p>
                  <input style={inp} value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: '0.65rem', color: '#bbb', marginBottom: 4 }}>الرأي</p>
                  <textarea style={{ ...inp, resize: 'vertical', minHeight: 80 }} value={editBody} onChange={e => setEditBody(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleSave(r.id)} disabled={pending}
                    style={{ background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {pending ? '...' : 'حفظ'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: 6, padding: '7px 14px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              /* وضع العرض */
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</p>
                      <p style={{ fontSize: '0.68rem', color: '#aaa', direction: 'ltr' }}>
                        {new Date(r.created_at).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#c9a84c', fontWeight: 700 }}>
                    ★ {avg(r)}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.75, marginBottom: 10 }}>"{r.body}"</p>

                {/* أعمدة التقييم */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '0.7rem', color: '#aaa', marginBottom: 12 }}>
                  <span>القماش: <b style={{ color: '#555' }}>{r.fabric_rating}/5</b></span>
                  <span>المقاسات: <b style={{ color: '#555' }}>{r.size_rating}/5</b></span>
                  <span>التوصيل: <b style={{ color: '#555' }}>{r.delivery_rating}/5</b></span>
                  <span>الخدمة: <b style={{ color: '#555' }}>{r.service_rating}/5</b></span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => startEdit(r)}
                    style={{ background: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: 6, padding: '6px 14px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)} disabled={pending}
                    style={{ background: 'transparent', color: '#c0392b', border: '1px solid #f5c6c6', borderRadius: 6, padding: '6px 14px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    حذف
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
