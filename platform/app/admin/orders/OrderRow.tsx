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

// ─── الثوابت ───────────────────────────────────────────────────────────────
const COLORS = [
  { en: 'Black',      ar: 'أسود',      hex: '#1a1a1a' },
  { en: 'White',      ar: 'أبيض',      hex: '#e0e0e0' },
  { en: 'Dark Navy',  ar: 'نيلي',      hex: '#1B2A4A' },
  { en: 'Royal Blue', ar: 'أزرق ملكي', hex: '#1C4EBF' },
  { en: 'Brown',      ar: 'جوزي',      hex: '#6B3F2A' },
  { en: 'Burgundy',   ar: 'ماروني',    hex: '#6D1A36' },
  { en: 'Charcoal',   ar: 'رصاصي',     hex: '#3D3D3D' },
  { en: 'Taupe',      ar: 'توبي',      hex: '#B5A69A' },
  { en: 'Olive',      ar: 'زيتوني',    hex: '#5A5E3A' },
]

const SIZES = ['XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL']

const STATUS_AR: Record<string, string> = {
  new: 'جديد', confirmed: 'مؤكد', shipped: 'شُحن', delivered: 'سُلّم', cancelled: 'ملغي',
}
const STATUS_COLOR: Record<string, string> = {
  new: '#2563eb', confirmed: '#7c3aed', shipped: '#d97706', delivered: '#16a34a', cancelled: '#dc2626',
}

// ─── Styles ────────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', border: '1px solid #e0e0e0', borderRadius: 6,
  padding: '8px 10px', fontSize: 13, fontFamily: 'inherit',
  color: '#1a1a1a', background: '#fff', boxSizing: 'border-box',
  minHeight: 40,
}
const sel: React.CSSProperties = { ...inp, cursor: 'pointer' }

const btn = (v: 'dark' | 'ghost' | 'danger' | 'gold'): React.CSSProperties => ({
  background: v === 'dark' ? '#1a1a1a' : v === 'gold' ? 'rgba(201,168,76,0.1)' : 'transparent',
  color:      v === 'dark' ? '#fff' : v === 'danger' ? '#c0392b' : v === 'gold' ? '#c9a84c' : '#666',
  border:     `1px solid ${v === 'dark' ? '#1a1a1a' : v === 'danger' ? '#f5c6c6' : v === 'gold' ? '#c9a84c55' : '#ddd'}`,
  borderRadius: 6, padding: '7px 14px', fontSize: '0.78rem',
  cursor: 'pointer', fontFamily: 'inherit', minHeight: 36, whiteSpace: 'nowrap',
})

// ─── Types ─────────────────────────────────────────────────────────────────
interface OrderItem {
  id: number
  sku: string | null; brand: string | null; sub: string | null
  color: string | null; size: string | null; qty: number
  unit_price: number; line_total: number
  product?: { img_key: string; category_id: string; cat_seq: string | null } | null
}

interface Props {
  order: Order & { order_items?: OrderItem[] }
  index: number
}

const emptyNew = () => ({ sku: '', brand: '', sub: '', color: '', size: '', qty: 1, unitPrice: 35000 })

// ─── Component ─────────────────────────────────────────────────────────────
export default function OrderRow({ order }: Props) {
  const [open, setOpen]             = useState(false)
  const [pending, startTransition]  = useTransition()

  // معلومات الزبون
  const [editing, setEditing]   = useState(false)
  const [saveErr, setSaveErr]   = useState('')
  const [saveDone, setSaveDone] = useState(false)
  const [editData, setEditData] = useState({
    name: order.name ?? '', phone: order.phone ?? '',
    province: order.province ?? '', area: order.area ?? '',
    address: order.address ?? '', notes: order.notes ?? '',
  })

  // تعديل منتج
  const [items, setItems]           = useState(order.order_items ?? [])
  const [editItemId, setEditItemId] = useState<number | null>(null)
  const [itemEdit, setItemEdit]     = useState({ qty: 1, color: '', size: '', sku: '' })
  const [itemErr, setItemErr]       = useState('')

  // إضافة منتج
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState(emptyNew())
  const [addErr, setAddErr]   = useState('')

  const totalQty = items.reduce((s, i) => s + i.qty, 0)
  const sc = STATUS_COLOR[order.status] ?? '#888'

  // ── handlers ─────────────────────────────────────────────────────────────
  function handleSaveEdit() {
    setSaveErr(''); setSaveDone(false)
    startTransition(async () => {
      const res = await updateOrderDetails(order.order_id, editData)
      if (!res.ok) { setSaveErr(res.error ?? 'حدث خطأ'); return }
      setSaveDone(true); setEditing(false)
      setTimeout(() => setSaveDone(false), 2500)
    })
  }

  function startItemEdit(item: OrderItem) {
    setEditItemId(item.id)
    setItemEdit({ qty: item.qty, color: item.color ?? '', size: item.size ?? '', sku: item.sku ?? '' })
    setItemErr(''); setShowAdd(false)
  }

  function handleSaveItem() {
    if (!editItemId) return; setItemErr('')
    startTransition(async () => {
      const res = await updateOrderItem(editItemId, order.order_id, itemEdit)
      if (!res.ok) { setItemErr(res.error ?? 'حدث خطأ'); return }
      setItems(prev => prev.map(i =>
        i.id === editItemId
          ? { ...i, ...itemEdit, line_total: i.unit_price * itemEdit.qty }
          : i
      ))
      setEditItemId(null)
    })
  }

  function handleRemove(itemId: number) {
    if (!confirm('حذف هذا المنتج من الطلب؟')) return
    startTransition(async () => {
      const res = await removeOrderItem(itemId, order.order_id)
      if (!res.ok) { setItemErr(res.error ?? 'حدث خطأ'); return }
      setItems(prev => prev.filter(i => i.id !== itemId))
    })
  }

  function handleAddItem() {
    setAddErr('')
    if (!newItem.brand.trim()) { setAddErr('اسم الماركة مطلوب'); return }
    startTransition(async () => {
      const res = await addOrderItem(order.order_id, newItem)
      if (!res.ok) { setAddErr(res.error ?? 'حدث خطأ'); return }
      setItems(prev => [...prev, {
        id: Date.now(), sku: newItem.sku || null, brand: newItem.brand,
        sub: newItem.sub || null, color: newItem.color || null,
        size: newItem.size || null, qty: newItem.qty,
        unit_price: newItem.unitPrice, line_total: newItem.unitPrice * newItem.qty, product: null,
      }])
      setNewItem(emptyNew()); setShowAdd(false)
    })
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, overflow: 'hidden' }}>

      {/* ── رأس البطاقة — اضغط للتوسيع ── */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ padding: '14px 16px', cursor: 'pointer', userSelect: 'none' }}
      >
        {/* الصف الأول: رقم الطلب + الحالة */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#555', flex: 1 }}>
            {order.order_id}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{
              padding: '2px 10px', borderRadius: 4, fontSize: '0.72rem',
              color: sc, background: sc + '18', whiteSpace: 'nowrap',
            }}>
              {STATUS_AR[order.status] ?? order.status}
            </span>
            <span style={{ color: '#ccc', fontSize: '0.7rem' }}>{open ? '▲' : '▼'}</span>
          </div>
        </div>

        {/* الصف الثاني: الاسم + التاريخ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{order.name}</span>
          <span style={{ fontSize: '0.7rem', color: '#bbb', direction: 'ltr' }}>
            {dateEn(order.created_at)}
          </span>
        </div>

        {/* الصف الثالث: الهاتف + المحافظة */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#888', direction: 'ltr' }}>{order.phone}</span>
          {(order.province || order.area) && (
            <span style={{ fontSize: '0.78rem', color: '#aaa' }}>
              {order.province}{order.area ? ` · ${order.area}` : ''}
            </span>
          )}
        </div>

        {/* الصف الرابع: الكمية + المبلغ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid #f5f5f5' }}>
          <span style={{ fontSize: '0.78rem', color: '#aaa' }}>{totalQty} قطعة</span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', direction: 'ltr' }}>{fmtEn(order.total)}</span>
        </div>
      </div>

      {/* ── التفاصيل الموسّعة ── */}
      {open && (
        <div style={{ borderTop: '1px solid #f0f0f0', padding: '16px', background: '#fafbff' }}>

          {/* تغيير الحالة */}
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.75rem', color: '#aaa', flexShrink: 0 }}>الحالة:</span>
            <div style={{ flex: 1 }}>
              <StatusSelect orderId={order.order_id} current={order.status} />
            </div>
          </div>

          {/* ── معلومات الزبون ── */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 600 }}>معلومات الزبون</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {saveDone && <span style={{ color: '#27ae60', fontSize: '0.72rem' }}>✓ تم الحفظ</span>}
                {!editing
                  ? <button onClick={() => setEditing(true)} style={btn('ghost')}>تعديل</button>
                  : <>
                      <button onClick={handleSaveEdit} disabled={pending} style={btn('dark')}>{pending ? '...' : 'حفظ'}</button>
                      <button onClick={() => { setEditing(false); setSaveErr('') }} style={btn('ghost')}>إلغاء</button>
                    </>
                }
              </div>
            </div>
            {saveErr && <p style={{ color: '#c0392b', fontSize: '0.72rem', marginBottom: 6 }}>{saveErr}</p>}

            {editing ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, padding: 12, background: '#fff', border: '1px solid #d0d8ff', borderRadius: 8 }}>
                {([
                  { key: 'name',     label: 'الاسم',      dir: 'rtl' },
                  { key: 'phone',    label: 'الهاتف',     dir: 'ltr' },
                  { key: 'province', label: 'المحافظة',   dir: 'rtl' },
                  { key: 'area',     label: 'المنطقة',    dir: 'rtl' },
                  { key: 'address',  label: 'العنوان',    dir: 'rtl' },
                  { key: 'notes',    label: 'ملاحظات',    dir: 'rtl' },
                ] as const).map(f => (
                  <div key={f.key}>
                    <p style={{ fontSize: '0.65rem', color: '#bbb', marginBottom: 4 }}>{f.label}</p>
                    <input style={{ ...inp, direction: f.dir }} value={editData[f.key]}
                      onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px 16px', padding: 12, background: '#fff', border: '1px solid #eee', borderRadius: 8, fontSize: '0.82rem' }}>
                <InfoCell label="الاسم"      value={order.name} />
                <InfoCell label="الهاتف"     value={order.phone} dir="ltr" />
                <InfoCell label="المحافظة"   value={order.province ?? '—'} />
                {order.area    && <InfoCell label="المنطقة"  value={order.area} />}
                {order.address && <InfoCell label="العنوان"  value={order.address} />}
                {order.notes   && <InfoCell label="ملاحظات"  value={order.notes} />}
              </div>
            )}
          </div>

          {/* ── المنتجات ── */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.72rem', color: '#aaa', fontWeight: 600 }}>المنتجات ({items.length})</span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {itemErr && <span style={{ color: '#c0392b', fontSize: '0.72rem' }}>{itemErr}</span>}
                {!showAdd && (
                  <button onClick={() => { setShowAdd(true); setEditItemId(null) }} style={btn('gold')}>
                    + إضافة
                  </button>
                )}
              </div>
            </div>

            {/* فورم إضافة */}
            {showAdd && (
              <div style={{ background: '#fffdf5', border: '1px solid #c9a84c44', padding: 14, marginBottom: 10, borderRadius: 8 }}>
                <p style={{ fontSize: '0.72rem', color: '#c9a84c', fontWeight: 600, marginBottom: 12 }}>منتج جديد</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 10 }}>
                  {[
                    { label: 'كود SKU',        key: 'sku',    ph: 'SZ-001' },
                    { label: 'الماركة *',       key: 'brand',  ph: 'Sizeme' },
                    { label: 'النوع / القسم',   key: 'sub',    ph: 'تي شيرت' },
                  ].map(f => (
                    <div key={f.key}>
                      <p style={{ fontSize: '0.65rem', color: '#aaa', marginBottom: 4 }}>{f.label}</p>
                      <input style={inp} placeholder={f.ph}
                        value={(newItem as any)[f.key]}
                        onChange={e => setNewItem(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#aaa', marginBottom: 4 }}>اللون</p>
                    <select style={sel} value={newItem.color} onChange={e => setNewItem(p => ({ ...p, color: e.target.value }))}>
                      <option value="">— اختر —</option>
                      {COLORS.map(c => <option key={c.en} value={c.en}>{c.ar}</option>)}
                    </select>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#aaa', marginBottom: 4 }}>المقاس</p>
                    <select style={sel} value={newItem.size} onChange={e => setNewItem(p => ({ ...p, size: e.target.value }))}>
                      <option value="">— اختر —</option>
                      {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#aaa', marginBottom: 4 }}>الكمية</p>
                    <input type="number" min="1" style={{ ...inp, textAlign: 'center', direction: 'ltr' }}
                      value={newItem.qty} onChange={e => setNewItem(p => ({ ...p, qty: Math.max(1, +e.target.value || 1) }))} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#aaa', marginBottom: 4 }}>السعر (د.ع)</p>
                    <input type="number" min="0" style={{ ...inp, direction: 'ltr' }}
                      value={newItem.unitPrice} onChange={e => setNewItem(p => ({ ...p, unitPrice: +e.target.value || 0 }))} />
                  </div>
                </div>
                {addErr && <p style={{ color: '#c0392b', fontSize: '0.72rem', marginBottom: 8 }}>{addErr}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleAddItem} disabled={pending} style={btn('dark')}>{pending ? '...' : 'إضافة للطلب'}</button>
                  <button onClick={() => { setShowAdd(false); setAddErr('') }} style={btn('ghost')}>إلغاء</button>
                </div>
              </div>
            )}

            {/* قائمة المنتجات */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(item => {
                const imgSrc  = item.product ? imgPath(item.product.category_id, item.product.cat_seq, item.product.img_key, 1) : null
                const isEdit  = editItemId === item.id
                const colorHex = COLORS.find(c => c.en === item.color)?.hex

                return (
                  <div key={item.id} style={{
                    background: '#fff', borderRadius: 8, padding: 12,
                    border: `1px solid ${isEdit ? '#c9a84c66' : '#eee'}`,
                  }}>
                    {/* صف المنتج */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      {/* صورة */}
                      <div style={{ width: 48, height: 62, background: '#f2f2f2', borderRadius: 6, flexShrink: 0, overflow: 'hidden' }}>
                        {imgSrc && <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                      </div>

                      {/* معلومات */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 4 }}>
                          {item.brand}
                          {item.sub && <span style={{ fontWeight: 400, color: '#999', fontSize: '0.75rem' }}> — {item.sub}</span>}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', color: '#888', fontSize: '0.75rem' }}>
                          {item.sku   && <span>كود: <b style={{ color: '#555' }}>{item.sku}</b></span>}
                          {item.color && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: colorHex ?? '#ccc', border: '1px solid #ddd', display: 'inline-block', flexShrink: 0 }} />
                              <b style={{ color: '#555' }}>{item.color}</b>
                            </span>
                          )}
                          {item.size && <span>مقاس: <b style={{ color: '#555' }}>{item.size}</b></span>}
                          <span>كمية: <b style={{ color: '#555' }}>{item.qty}</b></span>
                        </div>
                      </div>

                      {/* السعر */}
                      <div style={{ textAlign: 'left', flexShrink: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', direction: 'ltr' }}>{fmtEn(item.line_total)}</p>
                        {item.qty > 1 && <p style={{ fontSize: '0.68rem', color: '#bbb', direction: 'ltr' }}>{fmtEn(item.unit_price)} ×{item.qty}</p>}
                      </div>
                    </div>

                    {/* أزرار التعديل */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                      {isEdit ? (
                        <>
                          <button onClick={handleSaveItem} disabled={pending} style={btn('dark')}>{pending ? '...' : 'حفظ'}</button>
                          <button onClick={() => setEditItemId(null)} style={btn('ghost')}>إلغاء</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startItemEdit(item)} style={btn('ghost')}>تعديل</button>
                          <button onClick={() => handleRemove(item.id)} disabled={pending} style={btn('danger')}>حذف</button>
                        </>
                      )}
                    </div>

                    {/* حقول التعديل */}
                    {isEdit && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid #f5f5f5' }}>
                        <div>
                          <p style={{ fontSize: '0.65rem', color: '#aaa', marginBottom: 4 }}>كود SKU</p>
                          <input style={inp} value={itemEdit.sku}
                            onChange={e => setItemEdit(p => ({ ...p, sku: e.target.value }))} placeholder={item.sku ?? 'اختياري'} />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.65rem', color: '#aaa', marginBottom: 4 }}>الكمية</p>
                          <input type="number" min="1" max="99" style={{ ...inp, textAlign: 'center', direction: 'ltr' }}
                            value={itemEdit.qty} onChange={e => setItemEdit(p => ({ ...p, qty: Math.max(1, +e.target.value || 1) }))} />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.65rem', color: '#aaa', marginBottom: 4 }}>اللون</p>
                          <select style={sel} value={itemEdit.color} onChange={e => setItemEdit(p => ({ ...p, color: e.target.value }))}>
                            <option value="">— بدون لون —</option>
                            {COLORS.map(c => <option key={c.en} value={c.en}>{c.ar}</option>)}
                          </select>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.65rem', color: '#aaa', marginBottom: 4 }}>المقاس</p>
                          <select style={sel} value={itemEdit.size} onChange={e => setItemEdit(p => ({ ...p, size: e.target.value }))}>
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
                <div style={{ padding: '1.25rem', textAlign: 'center', color: '#bbb', background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, fontSize: '0.8rem' }}>
                  لا توجد منتجات
                </div>
              )}
            </div>
          </div>

          {/* ── ملخص التسعير ── */}
          <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: '12px 16px', fontSize: '0.82rem' }}>
            <PriceLine label="المجموع الفرعي" value={fmtEn(order.subtotal)} />
            {order.bulk_discount > 0 && <PriceLine label="خصم الكمية" value={`− ${fmtEn(order.bulk_discount)}`} color="#16a34a" />}
            {order.coupon_discount > 0 && (
              <PriceLine label={`كوبون${order.coupon_code ? ` (${order.coupon_code})` : ''}`} value={`− ${fmtEn(order.coupon_discount)}`} color="#16a34a" />
            )}
            <PriceLine label="التوصيل" value={order.shipping === 0 ? 'مجاني 🎉' : fmtEn(order.shipping)} color={order.shipping === 0 ? '#16a34a' : undefined} />
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8, marginTop: 8 }}>
              <PriceLine label="المجموع الكلي" value={fmtEn(order.total)} bold />
            </div>
          </div>

          {/* تاريخ الطلب */}
          <p style={{ fontSize: '0.7rem', color: '#ccc', textAlign: 'center', marginTop: 12, direction: 'ltr' }}>
            {dateEn(order.created_at)} — {timeEn(order.created_at)}
          </p>
        </div>
      )}
    </div>
  )
}

// ── مكونات مساعدة ─────────────────────────────────────────────────────────────
function InfoCell({ label, value, dir }: { label: string; value: string; dir?: string }) {
  return (
    <div>
      <p style={{ fontSize: '0.65rem', color: '#bbb', marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#333', fontWeight: 500, direction: dir as any }}>{value}</p>
    </div>
  )
}

function PriceLine({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: bold ? 0 : 6 }}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ color: color ?? (bold ? '#1a1a1a' : '#555'), fontWeight: bold ? 700 : 400, direction: 'ltr' }}>{value}</span>
    </div>
  )
}
