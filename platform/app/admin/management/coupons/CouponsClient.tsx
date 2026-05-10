'use client'

import { useState, useTransition } from 'react'
import {
  createCoupon, updateCoupon, deleteCoupon, toggleCouponActive,
} from '@/lib/actions/admin-management'
import type { Coupon } from '@/lib/types'

// ─── Shared styles ───────────────────────────────────────────────────────────
const S = {
  page:    { padding: '32px 28px', direction: 'rtl' as const, fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#f9f9f9', minHeight: '100vh' },
  card:    { background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 24, marginBottom: 16 },
  title:   { fontSize: 28, fontWeight: 600, color: '#1a1a1a', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 4px' },
  sub:     { color: '#aaa', fontSize: 13, margin: '0 0 28px' },
  label:   { display: 'block', fontSize: 12, color: '#888', marginBottom: 5, fontFamily: 'IBM Plex Sans Arabic, sans-serif' } as const,
  input:   { width: '100%', border: '1px solid #e8e8e8', borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'IBM Plex Sans Arabic, sans-serif', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' } as const,
  select:  { width: '100%', border: '1px solid #e8e8e8', borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'IBM Plex Sans Arabic, sans-serif', color: '#1a1a1a', background: '#fff', outline: 'none', cursor: 'pointer' } as const,
  btnPrimary: { background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontFamily: 'IBM Plex Sans Arabic, sans-serif', cursor: 'pointer', transition: 'opacity .15s' } as const,
  btnAccent:  { background: '#c9a84c', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontFamily: 'IBM Plex Sans Arabic, sans-serif', cursor: 'pointer' } as const,
  btnDanger:  { background: 'none', color: '#c0392b', border: '1px solid #f5c6c6', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic, sans-serif', cursor: 'pointer' } as const,
  btnGhost:   { background: 'none', color: '#888', border: '1px solid #e8e8e8', borderRadius: 8, padding: '6px 14px', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic, sans-serif', cursor: 'pointer' } as const,
}

const TYPE_LABEL: Record<string, string> = { percent: 'نسبة %', fixed: 'مبلغ ثابت' }

interface Props { coupons: Coupon[] }

interface FormState {
  code: string; type: 'percent' | 'fixed'; value: string
  expires_at: string; max_uses: string; is_active: boolean
}

const emptyForm = (): FormState => ({
  code: '', type: 'percent', value: '', expires_at: '', max_uses: '', is_active: true,
})

export default function CouponsClient({ coupons: initial }: Props) {
  const [coupons, setCoupons] = useState(initial)
  const [showForm, setShowForm]   = useState(false)
  const [editId, setEditId]       = useState<number | null>(null)
  const [form, setForm]           = useState<FormState>(emptyForm())
  const [err, setErr]             = useState('')
  const [pending, startTransition] = useTransition()

  function openNew() { setEditId(null); setForm(emptyForm()); setShowForm(true); setErr('') }
  function openEdit(c: Coupon) {
    setEditId(c.id)
    setForm({
      code: c.code, type: c.type, value: String(c.value),
      expires_at: c.expires_at?.slice(0, 10) ?? '',
      max_uses:   c.max_uses != null ? String(c.max_uses) : '',
      is_active:  c.is_active,
    })
    setShowForm(true); setErr('')
  }
  function closeForm() { setShowForm(false); setEditId(null) }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const fd = new FormData()
    fd.set('code',       form.code)
    fd.set('type',       form.type)
    fd.set('value',      form.value)
    fd.set('expires_at', form.expires_at)
    fd.set('max_uses',   form.max_uses)
    fd.set('is_active',  String(form.is_active))

    startTransition(async () => {
      const res = editId
        ? await updateCoupon(editId, fd)
        : await createCoupon(fd)
      if (!res.ok) { setErr(res.error ?? 'حدث خطأ'); return }
      // Optimistic update — refresh via router would be better but we reload
      window.location.reload()
    })
  }

  function handleToggle(c: Coupon) {
    startTransition(async () => {
      await toggleCouponActive(c.id, !c.is_active)
      window.location.reload()
    })
  }

  function handleDelete(id: number) {
    if (!confirm('هل تريد حذف هذا الكوبون نهائياً؟')) return
    startTransition(async () => {
      await deleteCoupon(id)
      setCoupons(prev => prev.filter(c => c.id !== id))
    })
  }

  const f = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <div style={S.page}>
      <h1 style={S.title}>الكوبونات</h1>
      <p style={S.sub}>إدارة رموز الخصم — نسبة أو مبلغ ثابت</p>

      {/* ── Add Button ── */}
      {!showForm && (
        <button onClick={openNew} style={{ ...S.btnAccent, marginBottom: 20 }}>
          + إضافة كوبون جديد
        </button>
      )}

      {/* ── Form ── */}
      {showForm && (
        <div style={S.card}>
          <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 20px', color: '#1a1a1a' }}>
            {editId ? 'تعديل الكوبون' : 'كوبون جديد'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label as any}>رمز الكوبون *</span>
                <input style={S.input} value={form.code} onChange={f('code')} placeholder="WELCOME10" required />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label as any}>نوع الخصم *</span>
                <select style={S.select} value={form.type} onChange={f('type')}>
                  <option value="percent">نسبة مئوية %</option>
                  <option value="fixed">مبلغ ثابت د.ع</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label as any}>القيمة *</span>
                <input style={S.input} type="number" min="1" value={form.value} onChange={f('value')} placeholder={form.type === 'percent' ? '10' : '5000'} required />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label as any}>تاريخ الانتهاء</span>
                <input style={S.input} type="date" value={form.expires_at} onChange={f('expires_at')} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label as any}>الحد الأقصى للاستخدام</span>
                <input style={S.input} type="number" min="1" value={form.max_uses} onChange={f('max_uses')} placeholder="بلا حد" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5, justifyContent: 'flex-end' }}>
                <span style={S.label as any}>الحالة</span>
                <select style={S.select} value={String(form.is_active)} onChange={e => setForm(p => ({ ...p, is_active: e.target.value === 'true' }))}>
                  <option value="true">مفعّل ✓</option>
                  <option value="false">معطّل ✗</option>
                </select>
              </label>
            </div>
            {err && <p style={{ color: '#c0392b', fontSize: 12, marginBottom: 12 }}>{err}</p>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={S.btnPrimary} disabled={pending}>
                {pending ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إضافة الكوبون'}
              </button>
              <button type="button" style={S.btnGhost} onClick={closeForm}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Table ── */}
      <div style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              {['الرمز', 'النوع', 'القيمة', 'الاستخدام', 'تاريخ الانتهاء', 'الحالة', ''].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 500, color: '#888', fontSize: 11, letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#bbb' }}>لا توجد كوبونات بعد</td></tr>
            )}
            {coupons.map((c, i) => {
              const expired = c.expires_at && new Date(c.expires_at) < new Date()
              return (
                <tr key={c.id} style={{ borderBottom: i < coupons.length - 1 ? '1px solid #f5f5f5' : 'none', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.05em', color: '#1a1a1a' }}>
                    {c.code}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#555' }}>{TYPE_LABEL[c.type]}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#c9a84c', direction: 'ltr', textAlign: 'right' }}>
                    {c.type === 'percent' ? `${c.value}%` : `${c.value.toLocaleString('en-US')} د.ع`}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#888', fontSize: 12 }}>
                    {c.used_count}{c.max_uses != null ? ` / ${c.max_uses}` : ''}
                  </td>
                  <td style={{ padding: '12px 14px', color: expired ? '#c0392b' : '#888', fontSize: 12 }}>
                    {c.expires_at ? c.expires_at.slice(0, 10) : '—'}
                    {expired && ' ⚠'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <button onClick={() => handleToggle(c)} style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 11, border: 'none', cursor: 'pointer',
                      background: c.is_active ? '#d4edda' : '#f8d7da',
                      color:      c.is_active ? '#155724' : '#721c24',
                    }}>
                      {c.is_active ? 'مفعّل' : 'معطّل'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button style={S.btnGhost} onClick={() => openEdit(c)}>تعديل</button>
                      <button style={S.btnDanger} onClick={() => handleDelete(c.id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
