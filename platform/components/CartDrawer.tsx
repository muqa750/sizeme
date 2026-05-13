'use client'
import React, { useState, useTransition, type CSSProperties } from 'react'
import { useCart } from '@/context/CartContext'
import { fmt, imgPath } from '@/lib/utils'
import { submitOrder, validateCoupon, type OrderPayload } from '@/app/actions'

const PROVINCES = [
  'بغداد', 'البصرة', 'الموصل', 'أربيل', 'السليمانية', 'الأنبار',
  'كربلاء', 'كركوك', 'النجف', 'بابل', 'الديوانية', 'الناصرية',
  'صلاح الدين', 'السماوة', 'دهوك', 'ميسان', 'سامراء', 'ديالى',
]

function isValidIraqiPhone(phone: string): boolean {
  return /^(78|77|75)\d{8}$/.test(phone) || /^0(78|77|75)\d{8}$/.test(phone)
}

type Step = 'cart' | 'checkout' | 'success'

const labelStyle: CSSProperties = {
  fontSize: '0.7rem', letterSpacing: '0.08em', color: '#888',
  display: 'block', marginBottom: 6,
}
const inputStyle: CSSProperties = {
  width: '100%', padding: '0.625rem 0.75rem',
  border: '1px solid #e5e5e5', fontSize: '0.875rem',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', borderRadius: 4,
  color: 'var(--ink)', background: 'var(--paper)',
}

export default function CartDrawer() {
  const { items, totals, open, setOpen, removeItem, setQty, clear, itemKey } = useCart()
  const [step, setStep] = useState<Step>('cart')
  const [orderId, setOrderId] = useState('')
  const [waUrl, setWaUrl] = useState('')
  const [pending, startTx] = useTransition()

  // Coupon state
  const [couponInput, setCouponInput] = useState('')
  const [couponStatus, setCouponStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'percent' | 'fixed'; value: number } | null>(null)

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round(totals.subtotal * appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0

  async function handleCoupon(e: React.FormEvent) {
    e.preventDefault()
    if (!couponInput.trim() || couponStatus === 'loading') return
    setCouponStatus('loading')
    const result = await validateCoupon(couponInput)
    if (result.ok) {
      setAppliedCoupon(result)
      setCouponStatus('idle')
      setCouponInput('')
    } else {
      setCouponStatus('error')
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponStatus('idle')
    setCouponInput('')
  }

  // Form state
  const [form, setForm] = useState({
    name: '', phone: '', province: '', area: '', address: '', notes: '',
  })
  const [phoneError, setPhoneError] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.province) return

    startTx(async () => {
      try {
        // الأسعار تُحسب على السيرفر — نرسل بيانات المنتجات فقط
        const payload: OrderPayload = {
          ...form,
          coupon_code: appliedCoupon?.code ?? '',
          items: items.map(i => ({
            product_id: i.productId,
            sku: i.sku,
            brand: i.brand,
            sub: i.sub ?? '',
            color: i.color,
            size: i.size,
            qty: i.qty,
          })),
        }
        const { order_id, waUrl } = await submitOrder(payload)
        setOrderId(order_id)
        setWaUrl(waUrl)
        clear()
        setStep('success')
      } catch {
        alert('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى')
      }
    })
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop — الشريط المبلور على اليمين */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 100,
          animation: 'fadeIn 0.25s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: 'calc(100% - 56px)',
        maxWidth: 560,
        height: '100%',
        background: 'var(--paper)',
        zIndex: 101,
        display: 'flex',
        flexDirection: 'column',
        direction: 'rtl',
        animation: 'slideIn 0.28s cubic-bezier(0.25,0.46,0.45,0.94)',
        boxShadow: '4px 0 32px rgba(0,0,0,0.12)',
      }}>

        {/* ══ STEP: CART ══ */}
        {step === 'cart' && (
          <>
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e5e5e5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                السلة {totals.qty > 0 && `(${totals.qty})`}
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                  color: '#888', fontSize: '0.75rem', letterSpacing: '0.08em',
                  padding: '4px 0',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                تابع التسوق
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#aaa', fontSize: '0.875rem' }}>
                  السلة فارغة
                </div>
              ) : items.map(item => {
                const key = itemKey(item)
                return (
                  <div key={key} style={{
                    display: 'flex',
                    gap: '0.75rem',
                    paddingBottom: '0.875rem',
                    marginBottom: '0.875rem',
                    borderBottom: '1px solid #f0f0f0',
                    alignItems: 'stretch',
                  }}>
                    {/* Image */}
                    <div style={{ width: 54, flexShrink: 0, background: '#f7f7f7', overflow: 'hidden', borderRadius: 4 }}>
                      <img
                        src={imgPath(item.categoryId, item.catSeq, item.imgKey, 1)}
                        alt={item.brand}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                      <div>
                        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.92rem', marginBottom: 1, lineHeight: 1.2 }}>
                          {item.brand}
                        </p>
                        {item.sub && (
                          <p style={{ fontSize: '0.68rem', color: '#aaa', marginBottom: 2 }}>{item.sub}</p>
                        )}
                        <p style={{ fontSize: '0.68rem', color: '#bbb' }}>
                          {item.color} · {item.size}
                        </p>
                      </div>

                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          border: '1px solid #e8e8e8', borderRadius: 6, overflow: 'hidden',
                        }}>
                          <button
                            onClick={() => setQty(key, item.qty - 1)}
                            style={{ width: 24, height: 24, border: 'none', borderLeft: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', fontSize: '0.9rem', color: '#666', lineHeight: 1 }}
                          >−</button>
                          <span style={{ fontSize: '0.78rem', minWidth: 22, textAlign: 'center', color: '#222' }}>{item.qty}</span>
                          <button
                            onClick={() => setQty(key, item.qty + 1)}
                            style={{ width: 24, height: 24, border: 'none', borderRight: '1px solid #e8e8e8', background: '#fff', cursor: 'pointer', fontSize: '0.9rem', color: '#666', lineHeight: 1 }}
                          >+</button>
                        </div>
                      </div>
                    </div>

                    {/* Price + إزالة */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', color: 'var(--ink)' }}>
                        {fmt(item.qty * totals.unitPrice)}
                      </span>
                      <button
                        onClick={() => removeItem(key)}
                        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.74rem', padding: 0 }}
                      >
                        إزالة
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '1.25rem 1.5rem' }}>
                {/* Bulk discount notice */}
                {totals.qty < 4 && (
                  <p style={{ fontSize: '0.72rem', color: '#888', marginBottom: '0.75rem', textAlign: 'center' }}>
                    أضف {4 - totals.qty} قطعة بعد للحصول على سعر 30,000 د.ع للقطعة
                  </p>
                )}

                {/* Coupon Field */}
                {appliedCoupon ? (
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
                    padding: '0.5rem 0.75rem', marginBottom: '0.875rem',
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 500 }}>
                      {appliedCoupon.code} · خصم {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}%` : fmt(appliedCoupon.value)} · مفعّل ✓
                    </span>
                    <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '0.7rem', cursor: 'pointer', padding: '2px 6px' }}>
                      إزالة
                    </button>
                  </div>
                ) : (
                  <div style={{ marginBottom: couponStatus === 'error' ? '0.25rem' : '0.875rem' }}>
                    <form
                      onSubmit={handleCoupon}
                      style={{
                        display: 'flex', alignItems: 'center',
                        border: '1px solid #e5e5e5', borderRadius: 8,
                        overflow: 'hidden', background: '#fff',
                      }}
                    >
                      <input
                        value={couponInput}
                        onChange={e => { setCouponInput(e.target.value); setCouponStatus('idle') }}
                        placeholder="كود الخصم"
                        style={{
                          flex: 1, border: 'none', outline: 'none',
                          padding: '0.55rem 0.75rem', fontSize: '0.8rem',
                          fontFamily: 'inherit', background: 'transparent',
                          color: 'var(--ink)', textAlign: 'right', direction: 'rtl',
                        }}
                      />
                      <button
                        type="submit"
                        disabled={couponStatus === 'loading'}
                        style={{
                          background: '#fff', border: 'none', borderRight: '1px solid #e5e5e5',
                          padding: '0.55rem 1rem', fontSize: '0.75rem',
                          color: '#555', cursor: 'pointer', whiteSpace: 'nowrap',
                          fontFamily: 'inherit', letterSpacing: '0.04em',
                        }}
                      >
                        {couponStatus === 'loading' ? '...' : 'تطبيق'}
                      </button>
                    </form>
                    {couponStatus === 'error' && (
                      <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.3rem', paddingRight: 4 }}>
                        الكود غير صحيح أو منتهي الصلاحية
                      </p>
                    )}
                  </div>
                )}

                {/* Totals */}
                <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {totals.bulkDisc > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#16a34a' }}>
                      <span>خصم الكمية</span>
                      <span>− {fmt(totals.bulkDisc)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#16a34a' }}>
                      <span>كوبون الخصم</span>
                      <span>− {fmt(couponDiscount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' }}>
                    <span>التوصيل</span>
                    <span>{totals.shipping === 0 ? 'مجاني 🎉' : fmt(totals.shipping)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.95rem', marginTop: 4 }}>
                    <span>الإجمالي</span>
                    <span>{fmt(totals.total - couponDiscount)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  style={{
                    width: '100%',
                    background: '#1a1a1a',
                    color: '#fff',
                    padding: '0.875rem',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: '0.8rem',
                    letterSpacing: '0.15em',
                    cursor: 'pointer',
                  }}
                >
                  إتمام الطلب
                </button>
              </div>
            )}
          </>
        )}

        {/* ══ STEP: CHECKOUT ══ */}
        {step === 'checkout' && (
          <>
            {/* Header */}
            <div style={{ padding: '0.875rem 1.5rem', borderBottom: '1px solid #e5e5e5' }}>
              <button
                onClick={() => setStep('cart')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                  color: '#888', fontSize: '0.75rem', padding: 0,
                  fontFamily: 'inherit',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                العودة للسلة
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>

              {/* العنوان */}
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1rem' }}>
                بيانات التوصيل
              </p>

              {/* Order summary */}
              <div style={{
                background: '#f9f9f9',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.75rem',
                color: '#888',
                borderRadius: 6,
              }}>
                {items.length === 1 ? '1 منتج' : `${items.length} منتجات`}
                {' · '}{fmt(totals.total - couponDiscount)}
                {' · الإجمالي مع التوصيل'}
              </div>

              {/* Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* الاسم */}
                <div>
                  <label style={labelStyle}>الاسم الكامل *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    style={inputStyle}
                  />
                </div>

                {/* الهاتف */}
                <div>
                  <label style={labelStyle}>رقم الهاتف *</label>
                  <input
                    type="tel"
                    placeholder="07xxxxxxxxx"
                    value={form.phone}
                    onChange={e => {
                      set('phone')(e)
                      setPhoneError(false)
                    }}
                    onBlur={() => {
                      if (form.phone && !isValidIraqiPhone(form.phone)) setPhoneError(true)
                    }}
                    style={{ ...inputStyle, borderColor: phoneError ? '#dc2626' : '#e5e5e5' }}
                  />
                  {phoneError && (
                    <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: 4 }}>
                      الرقم غير صحيح
                    </p>
                  )}
                  <p style={{ fontSize: '0.68rem', color: '#bbb', marginTop: 4 }}>
                    يفضل أن يكون الرقم مرتبطاً بواتساب
                  </p>
                </div>

                {/* الدولة — مقفلة */}
                <div>
                  <label style={labelStyle}>الدولة</label>
                  <input
                    type="text"
                    value="العراق"
                    readOnly
                    style={{ ...inputStyle, color: '#888', background: '#fafafa', cursor: 'default' }}
                  />
                </div>

                {/* المحافظة */}
                <div>
                  <label style={labelStyle}>المحافظة *</label>
                  <select
                    value={form.province}
                    onChange={set('province')}
                    style={{ ...inputStyle, background: '#fff' }}
                  >
                    <option value="">اختر المحافظة</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* المدينة */}
                <div>
                  <label style={labelStyle}>المدينة *</label>
                  <input
                    type="text"
                    value={form.area}
                    onChange={set('area')}
                    style={inputStyle}
                  />
                </div>

                {/* المنطقة / الحي والشارع */}
                <div>
                  <label style={labelStyle}>المنطقة / الحي والشارع *</label>
                  <input
                    type="text"
                    placeholder="العنوان التفصيلي..."
                    value={form.address}
                    onChange={set('address')}
                    style={inputStyle}
                  />
                </div>

                {/* الملاحظات */}
                <div>
                  <label style={labelStyle}>ملاحظات (اختياري)</label>
                  <textarea
                    placeholder="تفاصيل إضافية مثل وقت استلامك المفضل للطلب، وزنك وطولك لمساعدتنا في التأكد من دقة القياس المناسب لك"
                    value={form.notes}
                    onChange={set('notes')}
                    rows={3}
                    style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                {/* طريقة الدفع */}
                <div>
                  <label style={labelStyle}>طريقة الدفع</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                    {/* الدفع عند الاستلام — مفعّل */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      border: '1.5px solid #1a1a1a', borderRadius: 8,
                      padding: '0.7rem 1rem', background: '#fff',
                    }}>
                      {/* ورقة نقدية */}
                      <svg width="28" height="18" viewBox="0 0 28 18" fill="none" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="1" width="26" height="16" rx="3" />
                        <line x1="3" y1="9" x2="9" y2="9" />
                        <text x="14" y="13" fontSize="7" fontFamily="IBM Plex Sans Arabic, sans-serif" fill="#1a1a1a" stroke="none" textAnchor="middle" fontWeight="500">$</text>
                        <line x1="19" y1="9" x2="25" y2="9" />
                      </svg>
                      <span style={{ fontSize: '0.82rem', color: '#1a1a1a', fontWeight: 500 }}>الدفع عند الاستلام</span>
                      <div style={{ marginRight: 'auto', width: 16, height: 16, borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                      </div>
                    </div>

                    {/* دفع إلكتروني — قريباً */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      border: '1px solid #e8e8e8', borderRadius: 8,
                      padding: '0.7rem 1rem', background: '#fafafa',
                      opacity: 0.65,
                    }}>
                      {/* بطاقة دفع */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="2" />
                        <path d="M2 10h20" />
                        <path d="M6 14h4" />
                      </svg>
                      <span style={{ fontSize: '0.82rem', color: '#777' }}>دفع إلكتروني آمن</span>
                      <span style={{
                        marginRight: 'auto', fontSize: '0.62rem', color: '#666',
                        border: '1px solid #bbb', borderRadius: 4,
                        padding: '2px 7px', letterSpacing: '0.06em', fontWeight: 500,
                      }}>
                        قريباً
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            <div style={{
              padding: '1rem 1.5rem',
              paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 12px))',
              borderTop: '1px solid #e5e5e5',
              flexShrink: 0,
            }}>
              <button
                onClick={handleOrder}
                disabled={pending || !form.name || !form.phone || !form.province || !form.area || !form.address || phoneError}
                style={{
                  width: '100%',
                  background: pending ? '#888' : '#1a1a1a',
                  color: '#fff',
                  padding: '0.875rem',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em',
                  cursor: pending ? 'wait' : 'pointer',
                  transition: 'background 0.2s',
                  opacity: (!form.name || !form.phone || !form.province || !form.area || !form.address || phoneError) ? 0.45 : 1,
                }}
              >
                {pending ? '...' : `تأكيد الطلب · ${fmt(totals.total - couponDiscount)}`}
              </button>
            </div>
          </>
        )}

        {/* ══ STEP: SUCCESS ══ */}
        {step === 'success' && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>✓</div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.5rem',
              marginBottom: '0.75rem',
            }}>
              تم استلام طلبك
            </h2>
            <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              رقم الطلب
            </p>
            <p style={{
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              letterSpacing: '0.1em',
              marginBottom: '2rem',
              color: '#1a1a1a',
            }}>
              {orderId}
            </p>
            <p style={{ color: '#888', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              سنتواصل معك قريباً لتأكيد الطلب.
              <br />الدفع عند الاستلام.
            </p>
            {/* زر واتساب */}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem',
                  background: '#25D366',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'none',
                  marginBottom: '0.75rem',
                  boxSizing: 'border-box',
                }}
              >
                📲 فتح واتساب
              </a>
            )}
            <button
              onClick={() => { setStep('cart'); setOpen(false) }}
              style={{
                padding: '0.75rem 2rem',
                background: 'none',
                color: '#888',
                border: '1px solid #e5e5e5',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              العودة للمتجر
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(-100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  )
}
