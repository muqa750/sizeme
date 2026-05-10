export const dynamic = 'force-dynamic'

import { getRatings } from '@/lib/admin-api'
import { dateEn } from '@/lib/utils'

const SCORE_EMOJI: Record<number, string> = { 1: '😡', 2: '😞', 3: '😐', 4: '😊', 5: '😍' }
const SCORE_COLOR: Record<number, string> = { 1: '#e74c3c', 2: '#e67e22', 3: '#f39c12', 4: '#27ae60', 5: '#c9a84c' }

export default async function RatingsPage() {
  const ratings = await getRatings() as any[]

  const avg = ratings.length
    ? (ratings.reduce((s: number, r: any) => s + (r.score ?? 0), 0) / ratings.length).toFixed(1)
    : '—'

  const dist = [5, 4, 3, 2, 1].map(score => ({
    score,
    count: ratings.filter((r: any) => r.score === score).length,
  }))

  return (
    <div style={{ padding: '32px 28px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, color: '#1a1a1a', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 4px' }}>
        تقييمات الزبائن
      </h1>
      <p style={{ color: '#aaa', fontSize: 13, margin: '0 0 28px' }}>للعرض فقط — {ratings.length} تقييم</p>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <div style={{ textAlign: 'center', paddingLeft: 24, borderLeft: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 48, fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#c9a84c', lineHeight: 1 }}>{avg}</div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>متوسط التقييم</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
          {dist.map(d => (
            <div key={d.score} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>{SCORE_EMOJI[d.score]}</span>
              <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${ratings.length ? (d.count / ratings.length * 100) : 0}%`, background: SCORE_COLOR[d.score], borderRadius: 99, transition: 'width .3s' }} />
              </div>
              <span style={{ color: '#888', fontSize: 12, minWidth: 24, textAlign: 'left', direction: 'ltr' }}>{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              {['التقييم', 'التعبير', 'التاريخ'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 500, color: '#888', fontSize: 11, letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ratings.length === 0 && (
              <tr><td colSpan={3} style={{ padding: 40, textAlign: 'center', color: '#bbb' }}>لا توجد تقييمات بعد</td></tr>
            )}
            {ratings.map((r: any, i: number) => (
              <tr key={r.id} style={{ borderBottom: i < ratings.length - 1 ? '1px solid #f5f5f5' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                <td style={{ padding: '12px 14px', fontSize: 22 }}>{SCORE_EMOJI[r.score] ?? '—'}</td>
                <td style={{ padding: '12px 14px', color: '#555' }}>{r.value ?? '—'}</td>
                <td style={{ padding: '12px 14px', color: '#aaa', fontSize: 12, direction: 'ltr', textAlign: 'right' }}>
                  {dateEn(r.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
