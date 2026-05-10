'use client'

import { useState, useTransition } from 'react'
import { deleteSuggestion } from '@/lib/actions/admin-management'
import { dateEn, timeEn } from '@/lib/utils'

interface Suggestion { id: number; text: string; created_at: string }
interface Props { suggestions: Suggestion[] }

export default function SuggestionsClient({ suggestions: initial }: Props) {
  const [items, setItems] = useState(initial)
  const [pending, startTransition] = useTransition()

  function handleDelete(id: number) {
    if (!confirm('حذف هذا الاقتراح؟')) return
    startTransition(async () => {
      const res = await deleteSuggestion(id)
      if (res.ok) setItems(p => p.filter(s => s.id !== id))
    })
  }

  return (
    <div style={{ padding: '32px 28px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1a1a1a', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 4px' }}>
        اقتراحات الزبائن
      </h1>
      <p style={{ color: '#aaa', fontSize: 13, margin: '0 0 28px' }}>{items.length} اقتراح</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.length === 0 && (
          <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 40, textAlign: 'center', color: '#bbb' }}>
            لا توجد اقتراحات بعد
          </div>
        )}
        {items.map(s => (
          <div key={s.id} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 8px', color: '#1a1a1a', fontSize: 14, lineHeight: 1.7 }}>{s.text}</p>
              <span style={{ color: '#bbb', fontSize: 11, direction: 'ltr', display: 'inline-block' }}>
                {dateEn(s.created_at)} · {timeEn(s.created_at)}
              </span>
            </div>
            <button
              onClick={() => handleDelete(s.id)}
              disabled={pending}
              style={{ background: 'none', color: '#ddd', border: 'none', cursor: 'pointer', fontSize: 16, padding: 4, flexShrink: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
              onMouseLeave={e => (e.currentTarget.style.color = '#ddd')}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
