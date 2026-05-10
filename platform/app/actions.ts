'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { generateOrderId, fmt } from '@/lib/utils'
import { sendOrderNotification } from '@/lib/email'

export interface OrderPayload {
  name:            string
  phone:           string
  province:        string
  area:            string
  address:         string
  notes:           string
  coupon_code:     string
  coupon_discount: number
  subtotal:        number
  bulk_discount:   number
  shipping:        number
  total:           number
  items: Array<{
    product_id:  number | null
    sku:         string
    brand:       string
    sub:         string
    color:       string
    size:        string
    qty:         number
    unit_price:  number
    line_total:  number
  }>
}

const WA_NUMBER = '9647739334545'

export async function submitOrder(payload: OrderPayload) {
  const admin    = createAdminClient()
  const order_id = generateOrderId()

  const { items, ...rest } = payload

  // إدخال الطلب
  const { error: orderErr } = await admin
    .from('orders')
    .insert({
      order_id,
      status:         'new',
      payment_method: 'cod',
      lang:           'ar',
      ...rest,
    })

  if (orderErr) {
    console.error('Order insert error:', orderErr)
    throw new Error(orderErr.message)
  }

  // إدخال المنتجات
  const { error: itemsErr } = await admin
    .from('order_items')
    .insert(items.map(i => ({ ...i, order_id })))

  if (itemsErr) {
    console.error('Items insert error:', itemsErr)
    throw new Error(itemsErr.message)
  }

  // تحديث كاش الأدمن
  revalidatePath('/admin')
  revalidatePath('/admin/orders')
  revalidatePath('/admin/analytics')

  // إرسال إيميل التنبيه (لا يوقف الطلب إذا فشل)
  sendOrderNotification({
    order_id:        order_id,
    name:            payload.name,
    phone:           payload.phone,
    province:        payload.province,
    area:            payload.area,
    address:         payload.address,
    notes:           payload.notes,
    coupon_code:     payload.coupon_code,
    items:           payload.items,
    subtotal:        payload.subtotal,
    bulk_discount:   payload.bulk_discount,
    coupon_discount: payload.coupon_discount,
    shipping:        payload.shipping,
    total:           payload.total,
  }).catch(err => console.error('[Email] sendOrderNotification failed:', err))

  // بناء رسالة الواتساب
  const itemsText = items
    .map(i => `• ${i.brand}${i.sub ? ` (${i.sub})` : ''} — ${i.color} — ${i.size} × ${i.qty}`)
    .join('\n')

  const msg = [
    `🛍️ طلب جديد — SizeMe`,
    `━━━━━━━━━━━━━━━━`,
    `📋 رقم الطلب: ${order_id}`,
    `👤 الاسم: ${payload.name}`,
    `📞 الهاتف: ${payload.phone}`,
    `📍 ${payload.province}${payload.area ? ' — ' + payload.area : ''}`,
    payload.address ? `🏠 ${payload.address}` : '',
    payload.notes   ? `📝 ${payload.notes}`   : '',
    `━━━━━━━━━━━━━━━━`,
    itemsText,
    `━━━━━━━━━━━━━━━━`,
    payload.bulk_discount > 0 ? `خصم الكمية: − ${fmt(payload.bulk_discount)}` : '',
    `التوصيل: ${payload.shipping === 0 ? 'مجاني' : fmt(payload.shipping)}`,
    `💰 الإجمالي: ${fmt(payload.total)}`,
    `الدفع عند الاستلام`,
  ].filter(Boolean).join('\n')

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

  return { order_id, waUrl }
}
