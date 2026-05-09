'use client'
import { useState } from 'react'
import Link from 'next/link'

const SIZE_TABLE = [
  { size: '2XL', weight: '95–105', chest: '120–130', waist: '106–116' },
  { size: '3XL', weight: '105–115', chest: '130–140', waist: '116–126' },
  { size: '4XL', weight: '115–125', chest: '140–150', waist: '126–136' },
  { size: '5XL', weight: '125–140', chest: '150–162', waist: '136–148' },
  { size: '6XL', weight: '140–155', chest: '162–174', waist: '148–160' },
  { size: '7XL', weight: '155–175', chest: '174–186', waist: '160–172' },
]

const JEANS_TABLE = [
  { size: '38', weight: '75–85',   waist: '96–101'  },
  { size: '40', weight: '85–95',   waist: '101–106' },
  { size: '42', weight: '95–110',  waist: '106–112' },
  { size: '44', weight: '110–125', waist: '112–118' },
  { size: '46', weight: '125–140', waist: '118–125' },
  { size: '48', weight: '140–155', waist: '125–132' },
]

export default function SizeGuidePage() {
  const [weight, setWeight]   = useState('')
  const [height, setHeight]   = useState('')
  const [result, setResult]   = useState<string | null>(null)
  const [type, setType]       = useState<'tshirt' | 'jeans'>('tshirt')

  function calculate() {
    const w = parseFloat(weight)
    if (!w || w < 50 || w > 250) { setResult('أدخل وزناً صحيحاً'); return }

    if (type === 'tshirt') {
      const match = SIZE_TABLE.find(row => {
        const [min, max] = row.weight.split('–').map(Number)
        return w >= min && w <= max
      })
      setResult(match ? `مقاسك المقترح: ${match.size}` : w < 95 ? 'مقاسك أقل من 2XL — تواصل معنا' : 'مقاسك أكبر من 7XL — تواصل معنا')
    } else {
      const match = JEANS_TABLE.find(row => {
        const [min, max] = row.weight.split('–').map(Number)
        return w >= min && w <= max
      })
      setResult(match ? `مقاسك المقترح: ${match.size}` : 'تواصل معنا للمساعدة')
    }
  }

  const cell = { padding: '0.625rem 0.75rem', fontSize: '0.82rem', borderBottom: '1px solid var(--line)', color: 'var(--ink)' } as const
  const hcell = { ...cell, fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--mute)', fontWeight: 600 } as const

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.25rem 5rem', direction: 'rtl' }}>

      {/* Breadcrumb */}
      <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--mute)', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: 'var(--mute)', textDecoration: 'none' }}>SIZEME</Link>
        {' / '}حاسبة المقاس
      </p>

      <h1 className="serif" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 400, marginBottom: '0.5rem' }}>
        احسب مقاسك
      </h1>
      <p style={{ color: 'var(--mute)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
        أدخل وزنك للحصول على مقاسك المناسب
      </p>

      {/* Calculator */}
      <div style={{ background: '#fafaf9', border: '1px solid var(--line)', padding: '1.5rem', marginBottom: '2.5rem' }}>

        {/* Type toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
          {(['tshirt', 'jeans'] as const).map(t => (
            <button
              key={t}
              onClick={() => { setType(t); setResult(null) }}
              style={{
                padding: '0.4rem 1rem',
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                border: '1px solid',
                borderColor: type === t ? 'var(--ink)' : 'var(--line)',
                background: type === t ? 'var(--ink)' : '#fff',
                color: type === t ? '#fff' : 'var(--mute)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {t === 'tshirt' ? 'تيشيرت / قميص / بولو' : 'بنطرون / جينز'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--mute)', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
              الوزن (كغ) *
            </label>
            <input
              type="number"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="مثال: 120"
              style={{
                width: '100%',
                border: '1px solid var(--line)',
                padding: '0.625rem 0.75rem',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'inherit',
                background: '#fff',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.7rem', color: 'var(--mute)', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
              الطول (سم) — اختياري
            </label>
            <input
              type="number"
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder="مثال: 175"
              style={{
                width: '100%',
                border: '1px solid var(--line)',
                padding: '0.625rem 0.75rem',
                fontSize: '0.875rem',
                outline: 'none',
                fontFamily: 'inherit',
                background: '#fff',
              }}
            />
          </div>
          <button
            onClick={calculate}
            style={{
              background: 'var(--ink)',
              color: '#fff',
              border: 'none',
              padding: '0.625rem 1.25rem',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              height: 40,
              flexShrink: 0,
            }}
          >
            احسب
          </button>
        </div>

        {result && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.3)',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--ink)',
          }}>
            {result}
          </div>
        )}
      </div>

      {/* T-Shirt Table */}
      <h2 className="serif" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
        جدول مقاسات التيشيرت والقميص والبولو
      </h2>
      <div style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ background: '#fafaf9' }}>
              {['المقاس', 'الوزن (كغ)', 'محيط الصدر (سم)', 'محيط الخصر (سم)'].map(h => (
                <th key={h} style={hcell}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_TABLE.map(row => (
              <tr key={row.size}>
                <td style={{ ...cell, fontWeight: 700 }}>{row.size}</td>
                <td style={cell}>{row.weight}</td>
                <td style={cell}>{row.chest}</td>
                <td style={cell}>{row.waist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Jeans Table */}
      <h2 className="serif" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
        جدول مقاسات البنطرون والجينز
      </h2>
      <div style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ background: '#fafaf9' }}>
              {['المقاس', 'الوزن (كغ)', 'محيط الخصر (سم)'].map(h => (
                <th key={h} style={hcell}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {JEANS_TABLE.map(row => (
              <tr key={row.size}>
                <td style={{ ...cell, fontWeight: 700 }}>{row.size}</td>
                <td style={cell}>{row.weight}</td>
                <td style={cell}>{row.waist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '0.78rem', color: 'var(--mute)', lineHeight: 1.7 }}>
        ملاحظة: هذه الأرقام تقديرية. إذا كنت بين مقاسين ننصح باختيار الأكبر.
        للمساعدة الشخصية تواصل معنا عبر{' '}
        <a href="https://wa.me/9647739334545" style={{ color: 'var(--accent)' }}>واتساب</a>.
      </p>

      <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--line)', paddingTop: '1.5rem' }}>
        <Link href="/" style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--mute)', textDecoration: 'none' }}>
          ← العودة للرئيسية
        </Link>
      </div>
    </main>
  )
}
