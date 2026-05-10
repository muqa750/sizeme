'use client'
import { useState, useTransition } from 'react'
import { fmtEn, dateEn, timeEn, imgPath } from '@/lib/utils'
import StatusSelect from './StatusSelect'
import {
  updateOrderDetails,
  updateOrderItem,
  removeOrderItem,
  addOrderItem,
} from '@/lib/actions/admin-management'
import type { Order } from '@/lib/types'

// ─── قوائم الألوان والمقاسات ─────────────────────────────────────────────────
const COLORS: { en: string; ar: string; hex: string }[] = [
  { en: 'Black',      ar: 'أسود',       hex: '#1a1a1a' },
  { en: 'White',      ar: 'أبيض',       hex: '#e0e0e0' },
  { en: 'Dark Navy',  ar: 'نيلي',       hex: '#1B2A4A' },
  { en: 'Royal Blue', ar: 'أزرق ملكي', hex: '#1C4EBF' },
  { en: 'Brown',      ar: 'جوزي',       hex: '#6B3F2A' },
  { en: 'Burgundy',   ar: 'ماروني',     hex: '#6D1A36' },
  { en: 'Charcoal',   ar: 'رصاصي',      hex: '#3D3D3D' },
  { en: 'Taupe',      ar: 'توبي',       hex: '#B5A69A' },
  { en: 'Olive',      ar: 'زيتوني',     hex: '#5A5E3A' },
]

const SIZES = ['XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL']

// ─── Styles ───────────────────────────────────────────────────────────────────
const inputSt: React.CSSProperties = {
  width: '100%', border: '1px solid #e0e0e0', borderRadius: 6,
  padding: '7px 10px', fontSize: 12, fontFamily: 'inherit',
  color: '#1a1a1a', outline: 'none', boxSizing: 'border-box',
  background: '#fff',
}
const selectSt: React.CSSProperties = {
  ...inputSt, cursor: 'pointer', appearance: 'auto',
}
const btnSm = (variant: 'dark' | 'ghost' | 'danger'): React.CSSProperties => ({
  background: variant === 'dark' ? '#1a1a1a' : 'none',
  color:      variant === 'dark' ? '#fff' : variant === 'danger' ? '#c0392b' : '#666',
  border:     variant === 'dark' ? 'none' : `1px solid ${variant === 'danger' ? '#f5c6c6' : '#ddd'}`,
  borderRadius: 5, padding: '4px 10px', fontSize: '0.7rem',
  cursor: 'pointer', fontFamily: 'inherit',
})

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderItem {
  id: number
  sku: string | null
  brand: string | null
  sub: string | null
  color: string | null
  size: string | null
  qty: number
  unit_price: number
  line_total: number
  product?: { img_key: string; category_id: string; cat_seq: string | null } | null
}

interface Props {
  order: Order & { order_items?: OrderItem[] }
  index: number
}

const emptyNewItem = () => ({
  sku: '', brand: '', sub: '', color: '', size: '', qty: 1, unitPrice: 35000,
})

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderRow({ order, index }: Props) {
  const [open, setOpen]           = useState(false)
  const [pending, startTransition] = useTransition()

  // ─ معلومات الزبون
  const [editing, setEditing]   = useState(false)
  const [saveErr, setSaveErr]   = useState('')
  const [saveDone, setSaveDone] = useState(false)
  const [editData, setEditData] = useState({
    name:     order.name     ?? '',
    phone:    order.phone    ?? '',
    province: order.province ?? '',
    area:     order.area     ?? '',
    address:  order.address  ?? '',
    notes:    order.notes    ?? '',
  })

  // ─ تعديل منتج
  const [items, setItems]         = useState(order.order_items ?? [])
  const [editItemId, setEditItemId] = useState<number | null>(null)
  const [itemEdit, setItemEdit]   = useState<{ qty: number; color: string; size: string; sku: string }>({
    qty: 1, color: '', size: '', sku: '',
  })
  const [itemErr, setItemErr] = useState('')

  // ─ إضافة منتج جديد
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem]         = useState(emptyNewItem())
  const [addErr, setAddErr]           = useState('')

  const totalQty = items.reduce((s, i) => s + i.qty, 0)
  const rowBg    = open ? '#f5f7ff' : index % 2 === 0 ? '#fff' : '#fafafa'

  // ── معلومات الزبون ──────────────────────────────────────────────────────────
  function handleSaveEdit() {
    setSaveErr(''); setSaveDone(false)
    startTransition(async () => {
      const res = await updateOrderDetails(order.order_id, editData)
      if (!res.ok) { setSaveErr(res.error ?? 'حدث خطأ'); return }
      setSaveDone(true); setEditing(false)
      setTimeout(() => setSaveDone(false), 2500)
    })
  }

  // ── تعديل منتج ──────────────────────────────────────────────────────────────
  function startItemEdit(item: OrderItem) {
    setEditItemId(item.id)
    setItemEdit({ qty: item.qty, color: item.color ?? '', size: item.size ?? '', sku: item.sku ?? '' })
    setItemErr(''); setShowAddForm(false)
  }

  function handleSaveItem() {
    if (!editItemId) return
    setItemErr('')
    startTransition(async () => {
      const res = await updateOrderItem(editItemId, order.order_id, itemEdit)
      if (!res.ok) { setItemErr(res.error ?? 'حدث خطأ'); return }
      setItems(prev => prev.map(i =>
        i.id === editItemId
          ? { ...i, qty: itemEdit.qty, color: itemEdit.color, size: itemEdit.size, sku: itemEdit.sku, line_total: i.unit_price * itemEdit.qty }
          : i
      ))
      setEditItemId(null)
    })
  }

  function handleRemoveItem(itemId: number) {
    if (!confirm('هل تريد حذف هذا المنتج من الطلب؟')) return
    startTransition(async () => {
      const res = await removeOrderItem(itemId, order.order_id)
      if (!res.ok) { setItemErr(res.error ?? 'حدث خطأ'); return }
      setItems(prev => prev.filter(i => i.id !== itemId))
    })
  }

  // ── إضافة منتج جديد ─────────────────────────────────────────────────────────
  function handleAddItem() {
    setAddErr('')
    if (!newItem.brand.trim()) { setAddErr('اسم الماركة مطلوب'); return }
    startTransition(async () => {
      const res = await addOrderItem(order.order_id, newItem)
      if (!res.ok) { setAddErr(res.error ?? 'حدث خطأ'); return }
      // أضف بصريًا للقائمة
      setItems(prev => [...prev, {
        id: Date.now(), // مؤقت حتى يتم reload
        sku:        newItem.sku    || null,
        brand:      newItem.brand,
        sub:        newItem.sub    || null,
        color:      newItem.color  || null,
        size:       newItem.size   || null,
        qty:        newItem.qty,
        unit_price: newItem.unitPrice,
        line_total: newItem.unitPrice * newItem.qty,
        product:    null,
      }])
      setNewItem(emptyNewItem())
      setShowAddForm(false)
    })
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ══ الصف الرئيسي ══ */}
      <tr onClick={() => setOpen(o => !o)} style={{
        borderBottom: open ? 'none' : '1px solid #efefef',
        cursor: 'pointer', background: rowBg, transition: 'background 0.15s',
      }}>
        <td style={{ padding: '0.875rem 0.5rem 0.875rem 1rem', width: 20, color: '#ccc', fontSize: '0.65rem', userSelect: 'none' }}>
          {open ? '▲' : '▼'}
        </td>
        <td style={{ padding: '0.875rem 0.5rem', fontFamily: 'monospace', color: '#555', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
          {order.order_id}
        </td>
        <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>{order.name}</td>
        <td style={{ padding: '0.875rem 0.5rem', color: '#888', direction: 'ltr', textAlign: 'right', fontSize: '0.78rem' }}>{order.phone}</td>
        <td style={{ padding: '0.875rem 0.5rem', color: '#888', fontSize: '0.78rem' }}>
          {order.province ?? '—'}{order.area ? ` · ${order.area}` : ''}
        </td>
        <td style={{ padding: '0.875rem 0.5rem', color: '#888', fontSize: '0.78rem' }}>{totalQty} قطعة</td>
        <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.85rem', direction: 'ltr', textAlign: 'right' }}>
          {fmtEn(order.total)}
        </td>
        <td style={{ padding: '0.875rem 0.5rem' }} onClick={e => e.stopPropagation()}>
          <StatusSelect orderId={order.order_id} current={order.status} />
        </td>
        <td style={{ padding: '0.875rem 1rem 0.875rem 0.5rem', color: '#bbb', fontSize: '0.7rem', whiteSpace: 'nowrap', direction: 'ltr', textAlign: 'right' }}>
          {dateEn(order.created_at)}<br />{timeEn(order.created_at)}
        </td>
      </tr>

      {/* ══ الصف الموسّع ══ */}
      {open && (
        <tr style={{ background: '#f5f7ff', borderBottom: '2px solid #e0e6ff' }}>
          <td colSpan={9} style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
            <div style={{ maxWidth: 900 }}>

              {/* ── معلومات الزبون ── */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '0.08em' }}>معلومات الزبون</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {saveDone && <span style={{ color: '#27ae60', fontSize: '0.72rem' }}>✓ تم الحفظ</span>}
                    {!editing
                      ? <button onClick={() => setEditing(true)} style={btnSm('ghost')}>تعديل</button>
                      : <>
                          <button onClick={handleSaveEdit} disabled={pending} style={btnSm('dark')}>{pending ? '...' : 'حفظ'}</button>
                          <button onClick={() => { setEditing(false); setSaveErr('') }} style={btnSm('ghost')}>إلغاء</button>
                        </>
                    }
                  </div>
                </div>
                {saveErr && <p style={{ color: '#c0392b', fontSize: '0.72rem', marginBottom: 6 }}>{saveErr}</p>}

                {editing ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.625rem', padding: '1rem 1.25rem', background: '#fff', border: '1px solid #d0d8ff' }}>
                    {([
                      { key: 'name', label: 'الاسم', dir: 'rtl' },
                      { key: 'phone', label: 'الهاتف', dir: 'ltr' },
                      { key: 'province', label: 'المحافظة', dir: 'rtl' },
                      { key: 'area', label: 'المنطقة', dir: 'rtl' },
                      { key: 'address', label: 'العنوان', dir: 'rtl' },
                      { key: 'notes', label: 'ملاحظات', dir: 'rtl' },
                    ] as const).map(f => (
                      <div key={f.key}>
                        <p style={{ fontSize: '0.62rem', color: '#bbb', marginBottom: 4 }}>{f.label}</p>
                        <input style={{ ...inputSt, direction: f.dir }} value={editData[f.key]}
                          onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.625rem 1.5rem', padding: '1rem 1.25rem', background: '#fff', border: '1px solid #e5e5e5', fontSize: '0.78rem' }}>
                    <InfoCell label="الاسم" value={order.name} />
                    <InfoCell label="الهاتف" value={order.phone} dir="ltr" />
                    <InfoCell label="المحافظة" value={order.province ?? '—'} />
                    {order.area    && <InfoCell label="المنطقة" value={order.area} />}
                    {order.address && <InfoCell label="العنوان" value={order.address} />}
                    {order.notes   && <InfoCell label="ملاحظات" value={order.notes} />}
                  </div>
                )}
              </div>

              {/* ── المنتجات ── */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '0.08em' }}>المنتجات ({items.length})</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {itemErr && <span style={{ color: '#c0392b', fontSize: '0.72rem' }}>{itemErr}</span>}
                    {!showAddForm && (
                      <button onClick={() => { setShowAddForm(true); setEditItemId(null) }} style={{ ...btnSm('ghost'), color: '#c9a84c', borderColor: '#c9a84c55' }}>
                        + إضافة منتج
                      </button>
                    )}
                  </div>
                </div>

                {/* ─ فورم إضافة منتج جديد ─ */}
                {showAddForm && (
                  <div style={{ background: '#fffdf5', border: '1px solid #c9a84c44', padding: '14px 16px', marginBottom: 8 }}>
                    <p style={{ fontSize: '0.7rem', color: '#c9a84c', fontWeight: 600, marginBottom: 12, letterSpacing: '0.06em' }}>منتج جديد</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 10 }}>
                      <div>
                        <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>كود SKU</p>
                        <input style={inputSt} value={newItem.sku} onChange={e => setNewItem(p => ({ ...p, sku: e.target.value }))} placeholder="SZ-001" />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>الماركة *</p>
                        <input style={inputSt} value={newItem.brand} onChange={e => setNewItem(p => ({ ...p, brand: e.target.value }))} placeholder="Sizeme" />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>النوع / القسم</p>
                        <input style={inputSt} value={newItem.sub} onChange={e => setNewItem(p => ({ ...p, sub: e.target.value }))} placeholder="تي شيرت" />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>اللون</p>
                        <select style={selectSt} value={newItem.color} onChange={e => setNewItem(p => ({ ...p, color: e.target.value }))}>
                          <option value="">— اختر —</option>
                          {COLORS.map(c => (
                            <option key={c.en} value={c.en}>{c.ar} ({c.en})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>المقاس</p>
                        <select style={selectSt} value={newItem.size} onChange={e => setNewItem(p => ({ ...p, size: e.target.value }))}>
                          <option value="">— اختر —</option>
                          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>الكمية</p>
                        <input type="number" min="1" style={{ ...inputSt, textAlign: 'center', direction: 'ltr' }}
                          value={newItem.qty} onChange={e => setNewItem(p => ({ ...p, qty: Math.max(1, parseInt(e.target.value) || 1) }))} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>سعر الوحدة (د.ع)</p>
                        <input type="number" min="0" style={{ ...inputSt, direction: 'ltr' }}
                          value={newItem.unitPrice} onChange={e => setNewItem(p => ({ ...p, unitPrice: parseInt(e.target.value) || 0 }))} />
                      </div>
                    </div>
                    {addErr && <p style={{ color: '#c0392b', fontSize: '0.72rem', marginBottom: 8 }}>{addErr}</p>}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleAddItem} disabled={pending} style={btnSm('dark')}>{pending ? '...' : 'إضافة للطلب'}</button>
                      <button onClick={() => { setShowAddForm(false); setAddErr('') }} style={btnSm('ghost')}>إلغاء</button>
                    </div>
                  </div>
                )}

                {/* ─ قائمة المنتجات ─ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {items.map(item => {
                    const imgSrc   = item.product ? imgPath(item.product.category_id, item.product.cat_seq, item.product.img_key, 1) : null
                    const isEditing = editItemId === item.id

                    return (
                      <div key={item.id} style={{
                        background: '#fff', padding: '0.75rem 1rem',
                        border: `1px solid ${isEditing ? '#c9a84c66' : '#e5e5e5'}`,
                        transition: 'border-color .2s',
                      }}>
                        {/* صف الأساسي */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: 44, height: 58, background: '#f2f2f2', flexShrink: 0, overflow: 'hidden' }}>
                            {imgSrc && <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                          </div>

                          <div style={{ flex: 1, fontSize: '0.8rem' }}>
                            <p style={{ fontWeight: 600, marginBottom: 3 }}>
                              {item.brand}
                              {item.sub && <span style={{ fontWeight: 400, color: '#999', fontSize: '0.72rem' }}> — {item.sub}</span>}
                            </p>
                            <div style={{ display: 'flex', gap: '1.25rem', color: '#888', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                              {item.sku   && <span>كود: <b style={{ color: '#555' }}>{item.sku}</b></span>}
                              {item.color && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  اللون:
                                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS.find(c => c.en === item.color)?.hex ?? '#ccc', border: '1px solid #ddd', display: 'inline-block' }} />
                                  <b style={{ color: '#555' }}>{item.color}</b>
                                </span>
                              )}
                              {item.size  && <span>المقاس: <b style={{ color: '#555' }}>{item.size}</b></span>}
                              <span>الكمية: <b style={{ color: '#555' }}>{item.qty}</b></span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'left', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                            <p style={{ fontWeight: 600 }}>{fmtEn(item.line_total)}</p>
                            {item.qty > 1 && <p style={{ fontSize: '0.68rem', color: '#bbb' }}>{fmtEn(item.unit_price)} × {item.qty}</p>}
                          </div>

                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                            {isEditing ? (
                              <>
                                <button onClick={handleSaveItem} disabled={pending} style={btnSm('dark')}>{pending ? '...' : 'حفظ'}</button>
                                <button onClick={() => setEditItemId(null)} style={btnSm('ghost')}>إلغاء</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => startItemEdit(item)} style={btnSm('ghost')}>تعديل</button>
                                <button onClick={() => handleRemoveItem(item.id)} disabled={pending} style={btnSm('danger')}>✕</button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* حقول التعديل */}
                        {isEditing && (
                          <div style={{ display: 'grid', gridTemplateColumns: '110px 90px 1fr 1fr', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid #f5f5f5' }}>
                            <div>
                              <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>كود SKU</p>
                              <input style={inputSt} value={itemEdit.sku}
                                onChange={e => setItemEdit(p => ({ ...p, sku: e.target.value }))}
                                placeholder={item.sku ?? 'اختياري'} />
                            </div>
                            <div>
                              <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>الكمية</p>
                              <input type="number" min="1" max="99"
                                style={{ ...inputSt, textAlign: 'center', direction: 'ltr' }}
                                value={itemEdit.qty}
                                onChange={e => setItemEdit(p => ({ ...p, qty: Math.max(1, parseInt(e.target.value) || 1) }))} />
                            </div>
                            <div>
                              <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>اللون</p>
                              <select style={selectSt} value={itemEdit.color}
                                onChange={e => setItemEdit(p => ({ ...p, color: e.target.value }))}>
                                <option value="">— بدون لون —</option>
                                {COLORS.map(c => (
                                  <option key={c.en} value={c.en}>{c.ar} ({c.en})</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: 4 }}>المقاس</p>
                              <select style={selectSt} value={itemEdit.size}
                                onChange={e => setItemEdit(p => ({ ...p, size: e.target.value }))}>
                                <option value="">— بدون مقاس —</option>
                                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {items.length === 0 && (
                    <div style={{ padding: '1.25rem', textAlign: 'center', color: '#bbb', background: '#fff', border: '1px solid #f0f0f0', fontSize: '0.8rem' }}>
                      لا توجد منتجات — اضغط "إضافة منتج" لإضافة منتج للطلب
                    </div>
                  )}
                </div>
              </div>

              {/* ── ملخص التسعير ── */}
              <div style={{ background: '#fff', border: '1px solid #e5e5e5', padding: '0.875rem 1.25rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, marginRight: 'auto' }}>
                <PriceLine label="المجموع الفرعي" value={fmtEn(order.subtotal)} />
                {order.bulk_discount > 0 && <PriceLine label="خصم الكمية" value={`− ${fmtEn(order.bulk_discount)}`} color="#16a34a" />}
                {order.coupon_discount > 0 && (
                  <PriceLine label={`كوبون${order.coupon_code ? ` (${order.coupon_code})` : ''}`} value={`− ${fmtEn(order.coupon_discount)}`} color="#16a34a" />
                )}
                <PriceLine label="التوصيل" value={order.shipping === 0 ? 'مجاني 🎉' : fmtEn(order.shipping)} color={order.shipping === 0 ? '#16a34a' : undefined} />
                <div style={{ borderTop: '1px solid #efefef', paddingTop: 8, marginTop: 2 }}>
                  <PriceLine label="المجموع الكلي" value={fmtEn(order.total)} bold />
                </div>
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  )
}

/* ── مكونات مساعدة ── */
function InfoCell({ label, value, dir }: { label: string; value: string; dir?: string }) {
  return (
    <div>
      <p style={{ fontSize: '0.65rem', color: '#bbb', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#333', fontWeight: 500, direction: dir as any }}>{value}</p>
    </div>
  )
}

function PriceLine({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ color: color ?? (bold ? '#1a1a1a' : '#555'), fontWeight: bold ? 700 : 400 }}>{value}</span>
    </div>
  )
}
