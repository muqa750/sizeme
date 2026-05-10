'use client'

import { useState, useTransition } from 'react'
import { deleteSubscriber, deleteAllSubscribers } from '@/lib/actions/admin-management'
import { dateEn, timeEn } from '@/lib/utils'

interface Subscriber { id: number; contact: string; created_at: string }
interface Props { subscribers: Subscriber[]; count: number }

const btnDanger: React.CSSProperties = { background: 'none', color: '#c0392b', border: '1px solid #f5c6c6', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic, sans-serif', cursor: 'pointer' }
const btnGhost:  React.CSSProperties = { background: 'none', color: '#888', border: '1px solid #e8e8e8', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontFamily: 'IBM Plex Sans Arabic, sans-serif', cursor: 'pointer' }

export default function NewsletterClient({ subscribers: initial, count }: Props) {
  const [subs, setSubs]         = useState(initial)
  const [pending, startTransition] = useTransition()

  function handleDelete(id: number) {
    if (!confirm('حذف هذا المشترك؟')) return
    startTransition(async () => {
      const res = await deleteSubscriber(id)
      if (res.ok) setSubs(p => p.filter(s => s.id !== id))
    })
  }

  function handleDeleteAll() {
    if (!confirm(`هل تريد حذف جميع المشتركين (${subs.length})؟ هذا الإجراء لا يمكن التراجع عنه.`)) return
    startTransition(async () => {
      const res = await deleteAllSubscribers()
      if (res.ok) setSubs([])
    })
  }

  return (
    <div style={{ padding: '32px 28px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1a1a1a', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 4px' }}>
            النشرة البريدية
          </h1>
          <p style={{ color: '#aaa', fontSize: 13, margin: 0 }}>
            {subs.length.toLocaleString('en-US')} مشترك
          </p>
        </div>
        {subs.length > 0 && (
          <button style={btnDanger} onClick={handleDeleteAll} disabled={pending}>
            حذف الكل
          </button>
        )}
      </div>

      {/* Export hint */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: '14px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#888' }}>
        <span>💡</span>
        <span>لتصدير القائمة كـ CSV، انسخ بيانات العمود واستخدمها في أداة بريد إلكتروني كـ Mailchimp أو Brevo.</span>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              {['#', 'البريد / الهاتف', 'تاريخ الاشتراك', ''].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 500, color: '#888', fontSize: 11, letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subs.length === 0 && (
              <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: '#bbb' }}>لا يوجد مشتركون</td></tr>
            )}
            {subs.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < subs.length - 1 ? '1px solid #f5f5f5' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '11px 14px', color: '#ccc', fontSize: 11 }}>{i + 1}</td>
                <td style={{ padding: '11px 14px', color: '#1a1a1a', direction: 'ltr', textAlign: 'right' }}>
                  {s.contact}
                </td>
                <td style={{ padding: '11px 14px', color: '#999', fontSize: 12, direction: 'ltr', textAlign: 'right' }}>
                  {dateEn(s.created_at)} · {timeEn(s.created_at)}
                </td>
                <td style={{ padding: '11px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button style={btnDanger} onClick={() => handleDelete(s.id)} disabled={pending}>حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
