'use server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { generateOrderId, fmt } from '@/lib/utils'
import { sendOrderNotification } from '@/lib/email'
import type { OrderInsert, OrderItemInsert } from '@/lib/types'

// ── ثوابت الأسعار (السيرفر هو المرجع الوحيد) ──────────────────────────────
const UNIT_PRICE     = 35_000
const BULK_PRICE     = 30_000
const BULK_THRESHOLD = 4
const SHIP_THRESHOLD = 10
const SHIPPING       = 5_000

// ── Rate Limiting بحسب رقم الهاتف ─────────────────────────────────────────
const phoneRateMap = new Map<string, { count: number; windowStart: number }>()
const MAX_ORDERS_PER_HOUR = 3
const RATE_WINDOW         = 60 * 60 * 1000

function isPhoneRateLimited(phone: string): boolean {
  const now   = Date.now()
  const entry = phoneRateMap.get(phone)
  if (!entry || now - entry.windowStart > RATE_WINDOW) {
    phoneRateMap.set(phone, { count: 1, windowStart: now })
    return false
  }
  if (entry.count >= MAX_ORDERS_PER_HOUR) return true
  phoneRateMap.set(phone, { count: entry.count + 1, windowStart: entry.windowStart })
  return false
}

// ── تنظيف المدخلات ────────────────────────────────────────────────────────
function sanitize(str: string, maxLen = 300): string {
  return str
    .trim()
    .replace(/<[^>]*>/g, '')
    .slice(0, maxLen)
}

// ── نوع الـ payload القادم من المتجر ──────────────────────────────────────
export interface OrderPayload {
  name:        string
  phone:       string
  province:    string
  area:        string
  address:     string
  notes:       string
  coupon_code: string
  items: Array<{
    product_id: number | null
    sku:        string
    brand:      string
    sub:        string
    color:      string
    size:       string
    qty:        number
  }>
}

// ── التحقق الأساسي من البيانات ─────────────────────────────────────────────
function validate(p: OrderPayload): string | null {
  if (!p.name  || p.name.trim().length  < 2)    return 'الاسم مطلوب'
  if (!p.phone || p.phone.trim().length < 7)     return 'رقم الهاتف مطلوب'
  if (!p.province || p.province.trim().length < 2) return 'المحافظة مطلوبة'
  if (!Array.isArray(p.items) || p.items.length === 0) return 'السلة فارغة'
  for (const i of p.items) {
    if (!Number.isInteger(i.qty) || i.qty < 1 || i.qty > 20) return 'كمية غير صالحة'
  }
  return null
}

const WA_NUMBER = '9647739334545'

// ── الدالة الرئيسية ────────────────────────────────────────────────────────
export async function submitOrder(payload: OrderPayload) {

  // 1. التحقق من البيانات
  const validErr = validate(payload)
  if (validErr) throw new Error(validErr)

  // 2. Rate limiting
  if (isPhoneRateLimited(payload.phone.trim())) {
    throw new Error('تم تجاوز الحد المسموح للطلبات، يرجى المحاولة لاحقاً')
  }

  // 3. تنظيف الحقول النصية
  const name     = sanitize(payload.name,     100)
  const phone    = sanitize(payload.phone,     20)
  const province = sanitize(payload.province,  50)
  const area     = sanitize(payload.area,      100)
  const address  = sanitize(payload.address,   300)
  const notes    = sanitize(payload.notes,     500)

  // 4. حساب الأسعار على السيرفر فقط
  const totalQty  = payload.items.reduce((s, i) => s + i.qty, 0)
  const isBulk    = totalQty >= BULK_THRESHOLD
  const unitPrice = isBulk ? BULK_PRICE : UNIT_PRICE
  const subtotal  = totalQty * unitPrice
  const bulkDisc  = isBulk ? (UNIT_PRICE - BULK_PRICE) * totalQty : 0
  const shipping  = totalQty >= SHIP_THRESHOLD ? 0 : SHIPPING

  // 5. التحقق من الكوبون
  const admin = createAdminClient()
  let coupon_code:     string | null = null
  let coupon_discount: number        = 0

  if (payload.coupon_code?.trim()) {
    const { data: coupon } = await admin
      .from('coupons')
      .select('code, type, value, expires_at, max_uses, used_count, is_active')
      .eq('code', payload.coupon_code.trim().toUpperCase())
      .eq('is_active', true)
      .single()

    if (coupon) {
      const expired = coupon.expires_at && new Date(coupon.expires_at) < new Date()
      const maxed   = coupon.max_uses != null && coupon.used_count >= coupon.max_uses
      if (!expired && !maxed) {
        coupon_code     = coupon.code
        coupon_discount = coupon.type === 'percent'
          ? Math.round(subtotal * coupon.value / 100)
          : coupon.value
      }
    }
  }

  const total = subtotal - coupon_discount + shipping

  // 6. إدخال الطلب — explicit type لتجنب any never[] مشكلة TypeScript
  const order_id = generateOrderId()

  const orderData: OrderInsert = {
    order_id,
    status:          'new',
    payment_method:  'cod',
    lang:            'ar',
    name,
    phone,
    province:        province || null,
    area:            area     || null,
    address:         address  || null,
    notes:           notes    || null,
    coupon_code,
    coupon_discount,
    subtotal,
    bulk_discount:   bulkDisc,
    shipping,
    total,
  }

  const { error: orderErr } = await admin.from('orders').insert(orderData)
  if (orderErr) {
    console.error('[Order] Insert error:', orderErr)
    throw new Error(orderErr.message)
  }

  // 7. إدخال المنتجات بالأسعار المحسوبة على السيرفر
  const itemsData: OrderItemInsert[] = payload.items.map(i => ({
    order_id,
    product_id: i.product_id,
    sku:        i.sku        || null,
    brand:      sanitize(i.brand, 100) || null,
    sub:        sanitize(i.sub,   100) || null,
    color:      sanitize(i.color,  50) || null,
    size:       sanitize(i.size,   20) || null,
    qty:        i.qty,
    unit_price: unitPrice,
    line_total: i.qty * unitPrice,
  }))

  const { error: itemsErr } = await admin.from('order_items').insert(itemsData)
  if (itemsErr) {
    console.error('[Order] Items insert error:', itemsErr)
    throw new Error(itemsErr.message)
  }

  // 8. تحديث كاش الأدمن
  revalidatePath('/admin')
  revalidatePath('/admin/orders')
  revalidatePath('/admin/analytics')

  // 9. إرسال إيميل التنبيه (لا يوقف الطلب إذا فشل)
  sendOrderNotification({
    order_id,
    name,
    phone,
    province,
    area,
    address,
    notes,
    coupon_code:     coupon_code ?? '',
    coupon_discount,
    items: itemsData.map(i => ({
      brand:      i.brand      ?? '',
      sub:        i.sub        ?? '',
      color:      i.color      ?? '',
      size:       i.size       ?? '',
      qty:        i.qty,
      unit_price: i.unit_price,
      line_total: i.line_total,
    })),
    subtotal,
    bulk_discount: bulkDisc,
    shipping,
    total,
  }).catch(err => console.error('[Email] sendOrderNotification failed:', err))

  // 10. بناء رسالة الواتساب
  const itemsText = payload.items
    .map(i => `• ${i.brand}${i.sub ? ` (${i.sub})` : ''} — ${i.color} — ${i.size} × ${i.qty}`)
    .join('\n')

  const msg = [
    `🛍️ طلب جديد — SizeMe`,
    `━━━━━━━━━━━━━━━━`,
    `📋 رقم الطلب: ${order_id}`,
    `👤 الاسم: ${name}`,
    `📞 الهاتف: ${phone}`,
    `📍 ${province}${area ? ' — ' + area : ''}`,
    address ? `🏠 ${address}` : '',
    notes   ? `📝 ${notes}`   : '',
    `━━━━━━━━━━━━━━━━`,
    itemsText,
    `━━━━━━━━━━━━━━━━`,
    bulkDisc        > 0 ? `خصم الكمية: − ${fmt(bulkDisc)}`       : '',
    coupon_discount > 0 ? `كوبون: − ${fmt(coupon_discount)}`      : '',
    `التوصيل: ${shipping === 0 ? 'مجاني' : fmt(shipping)}`,
    `💰 الإجمالي: ${fmt(total)}`,
    `الدفع عند الاستلام`,
  ].filter(Boolean).join('\n')

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

  return { order_id, waUrl }
}
