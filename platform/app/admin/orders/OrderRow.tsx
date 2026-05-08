'use client'
import { useState } from 'react'
import { fmtEn, dateEn, timeEn, imgPath } from '@/lib/utils'
import StatusSelect from './StatusSelect'
import type { Order } from '@/lib/types'

const STATUS_AR: Record<string, string> = {
  new: 'جديد',
  confirmed: 'مؤكد',
  shipped: 'شُحن',
  delivered: 'سُلّم',
  cancelled: 'ملغي',
}

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
  product?: {
    img_key: string
    category_id: string
    cat_seq: string | null
  } | null
}

interface Props {
  order: Order & { order_items?: OrderItem[] }
  index: number
}

export default function OrderRow({ order, index }: Props) {
  const [open, setOpen] = useState(false)
  const items = order.order_items ?? []
  const totalQty = items.reduce((s, i) => s + i.qty, 0)

  // Zebra striping
  const rowBg = open ? '#f5f7ff' : index % 2 === 0 ? '#fff' : '#fafafa'

  return (
    <>
      {/* ══ الصف الرئيسي ══ */}
      <tr
        onClick={() => setOpen(o => !o)}
        style={{
          borderBottom: open ? 'none' : '1px solid #efefef',
          cursor: 'pointer',
          background: rowBg,
          transition: 'background 0.15s',
        }}
      >
        <td style={{ padding: '0.875rem 0.5rem 0.875rem 1rem', width: 20, color: '#ccc', fontSize: '0.65rem', userSelect: 'none' }}>
          {open ? '▲' : '▼'}
        </td>
        <td style={{ padding: '0.875rem 0.5rem', fontFamily: 'monospace', color: '#555', whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
          {order.order_id}
        </td>
        <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
          {order.name}
        </td>
        <td style={{ padding: '0.875rem 0.5rem', color: '#888', direction: 'ltr', textAlign: 'right', fontSize: '0.78rem' }}>
          {order.phone}
        </td>
        <td style={{ padding: '0.875rem 0.5rem', color: '#888', fontSize: '0.78rem' }}>
          {order.province ?? '—'}{order.area ? ` · ${order.area}` : ''}
        </td>
        <td style={{ padding: '0.875rem 0.5rem', color: '#888', fontSize: '0.78rem' }}>
          {totalQty} قطعة
        </td>
        <td style={{ padding: '0.875rem 0.5rem', fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.85rem', direction: 'ltr', textAlign: 'right' }}>
          {fmtEn(order.total)}
        </td>
        <td style={{ padding: '0.875rem 0.5rem' }} onClick={e => e.stopPropagation()}>
          <StatusSelect orderId={order.order_id} current={order.status} />
        </td>
        <td style={{ padding: '0.875rem 1rem 0.875rem 0.5rem', color: '#bbb', fontSize: '0.7rem', whiteSpace: 'nowrap', direction: 'ltr', textAlign: 'right' }}>
          {dateEn(order.created_at)}
          <br />
          {timeEn(order.created_at)}
        </td>
      </tr>

      {/* ══ الصف الموسّع ══ */}
      {open && (
        <tr style={{ background: '#f5f7ff', borderBottom: '2px solid #e0e6ff' }}>
          <td colSpan={9} style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
            <div style={{ maxWidth: 860 }}>

              {/* ── معلومات الزبون ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: '0.625rem 1.5rem',
                padding: '1rem 1.25rem',
                background: '#fff',
                border: '1px solid #e5e5e5',
                marginBottom: '1rem',
                fontSize: '0.78rem',
              }}>
                <InfoCell label="الاسم" value={order.name} />
                <InfoCell label="الهاتف" value={order.phone} dir="ltr" />
                <InfoCell label="المحافظة" value={order.province ?? '—'} />
                {order.area && <InfoCell label="المنطقة" value={order.area} />}
                {order.address && <InfoCell label="العنوان" value={order.address} />}
                {order.notes && <InfoCell label="ملاحظات" value={order.notes} />}
              </div>

              {/* ── المنتجات ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem' }}>
                {items.map(item => {
                  const imgSrc = item.product
                    ? imgPath(item.product.category_id, item.product.cat_seq, item.product.img_key, 1)
                    : null

                  return (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: '#fff',
                      padding: '0.75rem 1rem',
                      border: '1px solid #e5e5e5',
                    }}>
                      {/* صورة */}
                      <div style={{ width: 44, height: 58, background: '#f2f2f2', flexShrink: 0, overflow: 'hidden' }}>
                        {imgSrc && (
                          <img
                            src={imgSrc}
                            alt={item.brand ?? ''}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        )}
                      </div>

                      {/* تفاصيل */}
                      <div style={{ flex: 1, fontSize: '0.8rem' }}>
                        <p style={{ fontWeight: 600, marginBottom: 3 }}>
                          {item.brand}
                          {item.sub && (
                            <span style={{ fontWeight: 400, color: '#999', fontSize: '0.72rem' }}> — {item.sub}</span>
                          )}
                        </p>
                        <div style={{ display: 'flex', gap: '1.25rem', color: '#888', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                          {item.sku && <span>كود: <b style={{ color: '#555' }}>{item.sku}</b></span>}
                          {item.color && <span>اللون: <b style={{ color: '#555' }}>{item.color}</b></span>}
                          {item.size && <span>المقاس: <b style={{ color: '#555' }}>{item.size}</b></span>}
                          <span>الكمية: <b style={{ color: '#555' }}>{item.qty}</b></span>
                        </div>
                      </div>

                      {/* السعر — يسار */}
                      <div style={{ textAlign: 'left', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                        <p style={{ fontWeight: 600 }}>{fmtEn(item.line_total)}</p>
                        {item.qty > 1 && (
                          <p style={{ fontSize: '0.68rem', color: '#bbb' }}>{fmtEn(item.unit_price)} × {item.qty}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ── ملخص التسعير ── */}
              <div style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                padding: '0.875rem 1.25rem',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                maxWidth: 300,
                marginRight: 'auto',
              }}>
                <PriceLine label="المجموع الفرعي" value={fmtEn(order.subtotal)} />
                {order.bulk_discount > 0 && (
                  <PriceLine label="خصم الكمية" value={`− ${fmtEn(order.bulk_discount)}`} color="#16a34a" />
                )}
                {order.coupon_discount > 0 && (
                  <PriceLine
                    label={`كوبون${order.coupon_code ? ` (${order.coupon_code})` : ''}`}
                    value={`− ${fmtEn(order.coupon_discount)}`}
                    color="#16a34a"
                  />
                )}
                <PriceLine
                  label="التوصيل"
                  value={order.shipping === 0 ? 'مجاني 🎉' : fmtEn(order.shipping)}
                  color={order.shipping === 0 ? '#16a34a' : undefined}
                />
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

function PriceLine({ label, value, color, bold }: {
  label: string; value: string; color?: string; bold?: boolean
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ color: color ?? (bold ? '#1a1a1a' : '#555'), fontWeight: bold ? 700 : 400 }}>
        {value}
      </span>
    </div>
  )
}
