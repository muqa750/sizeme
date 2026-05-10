'use client'
import { useState, useTransition } from 'react'
import { useCart }   from '@/context/CartContext'
import { fmt, imgPath } from '@/lib/utils'
import { submitOrder, type OrderPayload } from '@/app/actions'

const PROVINCES = [
  'بغداد','البصرة','نينوى','أربيل','السليمانية','كركوك',
  'النجف','كربلاء','بابل','ديالى','الأنبار','ذي قار',
  'المثنى','القادسية','واسط','ميسان','صلاح الدين','دهوك',
]

type Step = 'cart' | 'checkout' | 'success'

export default function CartDrawer() {
  const { items, totals, open, setOpen, removeItem, setQty, clear, itemKey } = useCart()
  const [step, setStep]       = useState<Step>('cart')
  const [orderId, setOrderId] = useState('')
  const [waUrl,   setWaUrl]   = useState('')
  const [pending, startTx]    = useTransition()

  // Form state
  const [form, setForm] = useState({
    name: '', phone: '', province: '', area: '', address: '', notes: '',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.province) return

    startTx(async () => {
      try {
        const payload: OrderPayload = {
          ...form,
          coupon_code:     '',
          coupon_discount: 0,
          subtotal:        totals.subtotal,
          bulk_discount:   totals.bulkDisc,
          shipping:        totals.shipping,
          total:           totals.total,
          items: items.map(i => ({
            product_id: i.productId,
            sku:        i.sku,
            brand:      i.brand,
            sub:        i.sub ?? '',
            color:      i.color,
            size:       i.size,
            qty:        i.qty,
            unit_price: totals.unitPrice,
            line_total: i.qty * totals.unitPrice,
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
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 100,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', maxWidth: 420,
        height: '100%',
        background: '#fff',
        zIndex: 101,
        display: 'flex',
        flexDirection: 'column',
        direction: 'rtl',
        animation: 'slideIn 0.25s ease',
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
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em' }}>
                السلة {totals.qty > 0 && `(${totals.qty})`}
              </span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#888' }}>
                ×
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
                    gap: '1rem',
                    paddingBottom: '1rem',
                    marginBottom: '1rem',
                    borderBottom: '1px solid #f0f0f0',
                  }}>
                    {/* Image */}
                    <div style={{ width: 70, height: 90, background: '#f7f7f7', flexShrink: 0, overflow: 'hidden' }}>
                      <img
                        src={imgPath(item.categoryId, item.catSeq, item.imgKey, 1)}
                        alt={item.brand}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem', marginBottom: 2 }}>
                        {item.brand}
                      </p>
                      {item.sub && <p style={{ fontSize: '0.7rem', color: '#888', marginBottom: 4 }}>{item.sub}</p>}
                      <p style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: 8 }}>
                        {item.color} · {item.size}
                      </p>

                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          onClick={() => setQty(key, item.qty - 1)}
                          style={{ width: 26, height: 26, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: '0.875rem', minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                        <button
                          onClick={() => setQty(key, item.qty + 1)}
                          style={{ width: 26, height: 26, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(key)}
                          style={{ marginRight: 'auto', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '0.75rem' }}
                        >
                          حذف
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {fmt(item.qty * totals.unitPrice)}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e5e5e5' }}>
                {/* Bulk discount notice */}
                {totals.qty < 4 && (
                  <p style={{ fontSize: '0.72rem', color: '#888', marginBottom: '0.75rem', textAlign: 'center' }}>
                    أضف {4 - totals.qty} قطعة للحصول على سعر 30,000 د.ع للقطعة
                  </p>
                )}

                {/* Totals */}
                <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {totals.bulkDisc > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#16a34a' }}>
                      <span>خصم الكمية</span>
                      <span>− {fmt(totals.bulkDisc)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888' }}>
                    <span>التوصيل</span>
                    <span>{totals.shipping === 0 ? 'مجاني 🎉' : fmt(totals.shipping)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '0.95rem', marginTop: 4 }}>
                    <span>الإجمالي</span>
                    <span>{fmt(totals.total)}</span>
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
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #e5e5e5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <button
                onClick={() => setStep('cart')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '1.1rem' }}
              >
                ←
              </button>
              <span style={{ fontSize: '0.8rem', letterSpacing: '0.15em' }}>بيانات التوصيل</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {/* Order summary */}
              <div style={{
                background: '#f9f9f9',
                padding: '0.875rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.75rem',
                color: '#888',
              }}>
                {items.length} منتج · {fmt(totals.total)} إجمالي
                {totals.shipping === 0 && ' · توصيل مجاني'}
              </div>

              {/* Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { key: 'name',    label: 'الاسم الكامل *',     type: 'text',  ph: 'محمد أحمد'         },
                  { key: 'phone',   label: 'رقم الهاتف *',       type: 'tel',   ph: '07xxxxxxxxx'      },
                  { key: 'area',    label: 'المنطقة / الحي',     type: 'text',  ph: 'الكرادة'           },
                  { key: 'address', label: 'العنوان التفصيلي',   type: 'text',  ph: 'شارع، زقاق، رقم...' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: '#888', display: 'block', marginBottom: 6 }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.ph}
                      value={form[f.key as keyof typeof form]}
                      onChange={set(f.key as keyof typeof form)}
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.75rem',
                        border: '1px solid #e5e5e5',
                        fontSize: '0.875rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}

                {/* Province */}
                <div>
                  <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: '#888', display: 'block', marginBottom: 6 }}>
                    المحافظة *
                  </label>
                  <select
                    value={form.province}
                    onChange={set('province')}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      border: '1px solid #e5e5e5',
                      fontSize: '0.875rem',
                      background: '#fff',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">اختر المحافظة</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', color: '#888', display: 'block', marginBottom: 6 }}>
                    ملاحظات (اختياري)
                  </label>
                  <textarea
                    placeholder="أي تفاصيل إضافية..."
                    value={form.notes}
                    onChange={set('notes')}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.75rem',
                      border: '1px solid #e5e5e5',
                      fontSize: '0.875rem',
                      resize: 'none',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e5e5e5' }}>
              <button
                onClick={handleOrder}
                disabled={pending || !form.name || !form.phone || !form.province}
                style={{
                  width: '100%',
                  background: pending ? '#888' : '#1a1a1a',
                  color: '#fff',
                  padding: '0.875rem',
                  border: 'none',
                  fontSize: '0.8rem',
                  letterSpacing: '0.15em',
                  cursor: pending ? 'wait' : 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                {pending ? '...' : `تأكيد الطلب · ${fmt(totals.total)}`}
              </button>
              <p style={{ fontSize: '0.68rem', color: '#aaa', textAlign: 'center', marginTop: '0.625rem' }}>
                الدفع عند الاستلام
              </p>
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
