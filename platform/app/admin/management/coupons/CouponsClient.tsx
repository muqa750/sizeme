'use client'

import { useState, useTransition } from 'react'
import {
  createCoupon, updateCoupon, deleteCoupon, toggleCouponActive,
} from '@/lib/actions/admin-management'
import type { Coupon } from '@/lib/types'
import type { CouponUsageMap } from '@/lib/admin-api'
import { fmtEn, dateEn } from '@/lib/utils'

const S = {
  page:    { padding: '1.25rem 1rem', direction: 'rtl' as const, fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#f9f9f9', minHeight: '100vh', maxWidth: 860, margin: '0 auto' },
  card:    { background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, padding: 20, marginBottom: 14 },
  label:   { display: 'block', fontSize: 12, color: '#888', marginBottom: 5 } as const,
  input:   { width: '100%', border: '1px solid #e8e8e8', borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box', minHeight: 40 } as const,
  select:  { width: '100%', border: '1px solid #e8e8e8', borderRadius: 8, padding: '9px 12px', fontSize: 13, fontFamily: 'inherit', color: '#1a1a1a', background: '#fff', outline: 'none', cursor: 'pointer', minHeight: 40 } as const,
  btnPrimary: { background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', minHeight: 40 } as const,
  btnAccent:  { background: '#c9a84c', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontFamily: 'inherit', cursor: 'pointer', minHeight: 40 } as const,
  btnDanger:  { background: 'none', color: '#c0392b', border: '1px solid #f5c6c6', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', minHeight: 36 } as const,
  btnGhost:   { background: 'none', color: '#888', border: '1px solid #e8e8e8', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', minHeight: 36 } as const,
}

const TYPE_LABEL: Record<string, string> = { percent: 'نسبة %', fixed: 'مبلغ ثابت' }

interface Props {
  coupons:  Coupon[]
  usageMap: CouponUsageMap
}
interface FormState {
  code: string; type: 'percent' | 'fixed'; value: string
  expires_at: string; max_uses: string; is_active: boolean
}
const emptyForm = (): FormState => ({
  code: '', type: 'percent', value: '', expires_at: '', max_uses: '', is_active: true,
})

export default function CouponsClient({ coupons: initial, usageMap }: Props) {
  const [coupons, setCoupons]       = useState(initial)
  const [showForm, setShowForm]     = useState(false)
  const [editId, setEditId]         = useState<number | null>(null)
  const [form, setForm]             = useState<FormState>(emptyForm())
  const [err, setErr]               = useState('')
  const [pending, startTransition]  = useTransition()
  const [expandedCode, setExpanded] = useState<string | null>(null)

  function openNew()   { setEditId(null); setForm(emptyForm()); setShowForm(true); setErr('') }
  function closeForm() { setShowForm(false); setEditId(null); setErr('') }
  function openEdit(c: Coupon) {
    setEditId(c.id)
    setForm({
      code: c.code, type: c.type, value: String(c.value),
      expires_at: c.expires_at?.slice(0, 10) ?? '',
      max_uses: c.max_uses != null ? String(c.max_uses) : '',
      is_active: c.is_active,
    })
    setShowForm(true); setErr('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr('')
    const fd = new FormData()
    fd.set('code', form.code); fd.set('type', form.type); fd.set('value', form.value)
    fd.set('expires_at', form.expires_at); fd.set('max_uses', form.max_uses)
    fd.set('is_active', String(form.is_active))
    startTransition(async () => {
      const res = editId ? await updateCoupon(editId, fd) : await createCoupon(fd)
      if (!res.ok) { setErr(res.error ?? 'حدث خطأ'); return }
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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1a1a1a', margin: '0 0 2px' }}>الكوبونات</h1>
          <p style={{ color: '#aaa', fontSize: 12, margin: 0 }}>إدارة رموز الخصم</p>
        </div>
        {!showForm && (
          <button onClick={openNew} style={S.btnAccent}>+ إضافة</button>
        )}
      </div>

      {/* ── الفورم ── */}
      {showForm && (
        <div style={S.card}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '0 0 16px', color: '#1a1a1a' }}>
            {editId ? 'تعديل الكوبون' : 'كوبون جديد'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label}>رمز الكوبون *</span>
                <input style={S.input} value={form.code} onChange={f('code')} placeholder="WELCOME10" required />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label}>نوع الخصم *</span>
                <select style={S.select} value={form.type} onChange={f('type')}>
                  <option value="percent">نسبة مئوية %</option>
                  <option value="fixed">مبلغ ثابت د.ع</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label}>القيمة *</span>
                <input style={S.input} type="number" min="1" value={form.value} onChange={f('value')}
                  placeholder={form.type === 'percent' ? '10' : '5000'} required />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label}>تاريخ الانتهاء</span>
                <input style={S.input} type="date" value={form.expires_at} onChange={f('expires_at')} />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label}>الحد الأقصى للاستخدام</span>
                <input style={S.input} type="number" min="1" value={form.max_uses} onChange={f('max_uses')} placeholder="بلا حد" />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={S.label}>الحالة</span>
                <select style={S.select} value={String(form.is_active)}
                  onChange={e => setForm(p => ({ ...p, is_active: e.target.value === 'true' }))}>
                  <option value="true">مفعّل ✓</option>
                  <option value="false">معطّل ✗</option>
                </select>
              </label>
            </div>
            {err && <p style={{ color: '#c0392b', fontSize: 12, marginBottom: 10 }}>{err}</p>}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={S.btnPrimary} disabled={pending}>
                {pending ? 'جاري الحفظ...' : editId ? 'حفظ التعديلات' : 'إضافة الكوبون'}
              </button>
              <button type="button" style={S.btnGhost} onClick={closeForm}>إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {/* ── قائمة الكوبونات ── */}
      {coupons.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#bbb', background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12 }}>
          لا توجد كوبونات بعد
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {coupons.map(c => {
            const expired   = c.expires_at && new Date(c.expires_at) < new Date()
            const orders    = usageMap[c.code] ?? []
            const totalDiscount = orders.reduce((s, o) => s + o.coupon_discount, 0)
            const isExpanded = expandedCode === c.code

            return (
              <div key={c.id} style={{ background: '#fff', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden' }}>

                {/* ── رأس الكوبون ── */}
                <div style={{ padding: '14px 16px' }}>

                  {/* الصف الأول: الرمز + الحالة */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                      {c.code}
                    </span>
                    <button onClick={() => handleToggle(c)} style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 11, border: 'none', cursor: 'pointer',
                      background: c.is_active ? '#d4edda' : '#f8d7da',
                      color: c.is_active ? '#155724' : '#721c24',
                    }}>
                      {c.is_active ? 'مفعّل' : 'معطّل'}
                    </button>
                  </div>

                  {/* تفاصيل الكوبون */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', fontSize: 12, color: '#888', marginBottom: 12 }}>
                    <span>
                      {TYPE_LABEL[c.type]}:
                      <b style={{ color: '#c9a84c', marginRight: 4 }}>
                        {c.type === 'percent' ? `${c.value}%` : `${c.value.toLocaleString('en-US')} د.ع`}
                      </b>
                    </span>
                    {c.expires_at && (
                      <span style={{ color: expired ? '#c0392b' : '#888' }}>
                        ينتهي: {c.expires_at.slice(0, 10)}{expired && ' ⚠'}
                      </span>
                    )}
                    {c.max_uses != null && (
                      <span>الحد الأقصى: <b style={{ color: '#555' }}>{c.max_uses}</b></span>
                    )}
                  </div>

                  {/* ── إحصائية الاستخدام ── */}
                  <div style={{
                    display: 'flex', gap: 10, marginBottom: 12,
                    padding: '10px 14px',
                    background: orders.length > 0 ? 'rgba(201,168,76,0.06)' : '#fafafa',
                    border: `1px solid ${orders.length > 0 ? '#c9a84c33' : '#f0f0f0'}`,
                    borderRadius: 8,
                  }}>
                    <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid #e8e8e8' }}>
                      <p style={{ fontSize: 20, fontWeight: 700, color: orders.length > 0 ? '#c9a84c' : '#aaa', lineHeight: 1, direction: 'ltr', margin: '0 0 4px' }}>
                        {orders.length}
                      </p>
                      <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>مرة استُخدم</p>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1, direction: 'ltr', margin: '0 0 4px' }}>
                        {totalDiscount > 0 ? fmtEn(totalDiscount) : '—'}
                      </p>
                      <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>إجمالي الخصم</p>
                    </div>
                  </div>

                  {/* زر عرض الطلبات */}
                  {orders.length > 0 && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : c.code)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#c9a84c', fontSize: 12, padding: 0,
                        display: 'flex', alignItems: 'center', gap: 4,
                        marginBottom: 12,
                      }}
                    >
                      {isExpanded ? '▲ إخفاء الطلبات' : `▼ عرض الطلبات (${orders.length})`}
                    </button>
                  )}

                  {/* أزرار التعديل */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={S.btnGhost} onClick={() => openEdit(c)}>تعديل</button>
                    <button style={S.btnDanger} onClick={() => handleDelete(c.id)}>حذف</button>
                  </div>
                </div>

                {/* ── قائمة الطلبات التي استخدمت الكوبون ── */}
                {isExpanded && orders.length > 0 && (
                  <div style={{ borderTop: '1px solid #f0f0f0', background: '#fafafa', padding: '12px 16px' }}>
                    <p style={{ fontSize: 11, color: '#aaa', marginBottom: 10 }}>الطلبات التي استخدمت هذا الكوبون</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {orders.map(o => (
                        <div key={o.order_id} style={{
                          background: '#fff', border: '1px solid #eee',
                          borderRadius: 8, padding: '10px 14px',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          flexWrap: 'wrap', gap: 8,
                        }}>
                          <div>
                            <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#888', margin: '0 0 3px' }}>
                              {o.order_id}
                            </p>
                            <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>{o.name}</p>
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <p style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, margin: '0 0 3px', direction: 'ltr' }}>
                              − {fmtEn(o.coupon_discount)}
                            </p>
                            <p style={{ fontSize: 11, color: '#bbb', margin: 0, direction: 'ltr' }}>
                              {dateEn(o.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
