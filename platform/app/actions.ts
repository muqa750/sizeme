'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'
import { generateOrderId, fmt } from '@/lib/utils'
import { sendOrderNotification } from '@/lib/email'

// ── ثوابت الأسعار (السيرفر هو المرجع الوحيد) ──────────────────────────────
const UNIT_PRICE     = 35_000   // سعر القطعة الأساسي
const BULK_PRICE     = 30_000   // سعر الكمية (4 قطع فأكثر)
const BULK_THRESHOLD = 4        // الحد الأدنى لتفعيل سعر الكمية
const SHIP_THRESHOLD = 10       // الحد الأدنى للتوصيل المجاني
const SHIPPING       = 5_000    // سعر التوصيل

// ── Rate Limiting (بحسب رقم الهاتف) ──────────────────────────────────────
// ملاحظة: in-memory، كافٍ للمشروع — لا يتحمل هجمات ضخمة لكن يمنع الإساءة العادية
const phoneRateMap = new Map<string, { count: number; windowStart: number }>()
const MAX_ORDERS_PER_HOUR = 3
const RATE_WINDOW         = 60 * 60 * 1000 // ساعة

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
function sanitize(str: string): string {
  return str
    .trim()
    .replace(/<[^>]*>/g, '')           // إزالة HTML tags
    .replace(/[&<>"']/g, (c) => (
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' } as Record<string,string>)[c] ?? c
    ))
    .slice(0, 500)
}

// ── Zod Schema ─────────────────────────────────────────────────────────────
const itemSchema = z.object({
  product_id: z.number().int().positive().nullable(),
  sku:        z.string().max(50).default(''),
  brand:      z.string().min(1).max(100),
  sub:        z.string().max(100).default(''),
  color:      z.string().max(50).default(''),
  size:       z.string().max(20).default(''),
  qty:        z.number().int().min(1).max(20),
})

const orderSchema = z.object({
  name:        z.string().min(2).max(100),
  phone:       z.string().min(7).max(20),
  province:    z.string().min(2).max(50),
  area:        z.string().max(100).default(''),
  address:     z.string().max(300).default(''),
  notes:       z.string().max(500).default(''),
  coupon_code: z.string().max(30).default(''),
  items:       z.array(itemSchema).min(1).max(50),
})

export type OrderPayload = z.infer<typeof orderSchema>

const WA_NUMBER = '9647739334545'

// ── الدالة الرئيسية ────────────────────────────────────────────────────────
export async function submitOrder(rawPayload: OrderPayload) {

  // 1. التحقق من صحة البيانات عبر Zod
  const parsed = orderSchema.safeParse(rawPayload)
  if (!parsed.success) {
    console.error('[Order] Zod validation failed:', parsed.error.flatten())
    throw new Error('بيانات غير صالحة')
  }
  const payload = parsed.data

  // 2. Rate limiting بحسب رقم الهاتف
  if (isPhoneRateLimited(payload.phone)) {
    throw new Error('تم تجاوز الحد المسموح للطلبات، يرجى المحاولة لاحقاً')
  }

  // 3. تنظيف الحقول النصية
  const name     = sanitize(payload.name)
  const phone    = sanitize(payload.phone)
  const province = sanitize(payload.province)
  const area     = sanitize(payload.area)
  const address  = sanitize(payload.address)
  const notes    = sanitize(payload.notes)

  // 4. حساب الأسعار على السيرفر (السيرفر هو المرجع الوحيد)
  const totalQty  = payload.items.reduce((s, i) => s + i.qty, 0)
  const isBulk    = totalQty >= BULK_THRESHOLD
  const unitPrice = isBulk ? BULK_PRICE : UNIT_PRICE
  const subtotal  = totalQty * unitPrice
  const bulkDisc  = isBulk ? (UNIT_PRICE - BULK_PRICE) * totalQty : 0
  const shipping  = totalQty >= SHIP_THRESHOLD ? 0 : SHIPPING

  // 5. التحقق من الكوبون (اختياري)
  let coupon_code     = ''
  let coupon_discount = 0

  if (payload.coupon_code) {
    const admin = createAdminClient()
    const { data: coupon } = await admin
      .from('coupons')
      .select('*')
      .eq('code', payload.coupon_code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (coupon) {
      const now     = new Date()
      const expired = coupon.expires_at && new Date(coupon.expires_at) < now
      const maxed   = coupon.max_uses && coupon.used_count >= coupon.max_uses

      if (!expired && !maxed) {
        coupon_code     = coupon.code
        coupon_discount = coupon.type === 'percent'
          ? Math.round(subtotal * coupon.value / 100)
          : coupon.value
      }
    }
  }

  const total = subtotal - coupon_discount + shipping

  // 6. إدخال الطلب
  const admin    = createAdminClient()
  const order_id = generateOrderId()

  const { error: orderErr } = await admin
    .from('orders')
    .insert({
      order_id,
      status:          'new',
      payment_method:  'cod',
      lang:            'ar',
      name,
      phone,
      province,
      area,
      address,
      notes,
      coupon_code,
      coupon_discount,
      subtotal,
      bulk_discount: bulkDisc,
      shipping,
      total,
    })

  if (orderErr) {
    console.error('[Order] Insert error:', orderErr)
    throw new Error(orderErr.message)
  }

  // 7. إدخال المنتجات بالأسعار المحسوبة على السيرفر
  const itemsWithPrices = payload.items.map(i => ({
    order_id,
    product_id: i.product_id,
    sku:        i.sku,
    brand:      sanitize(i.brand),
    sub:        sanitize(i.sub),
    color:      sanitize(i.color),
    size:       sanitize(i.size),
    qty:        i.qty,
    unit_price: unitPrice,
    line_total: i.qty * unitPrice,
  }))

  const { error: itemsErr } = await admin.from('order_items').insert(itemsWithPrices)
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
    coupon_code,
    coupon_discount,
    items: itemsWithPrices.map(i => ({
      brand:      i.brand,
      sub:        i.sub,
      color:      i.color,
      size:       i.size,
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
    bulkDisc > 0   ? `خصم الكمية: − ${fmt(bulkDisc)}`          : '',
    coupon_discount > 0 ? `كوبون: − ${fmt(coupon_discount)}`   : '',
    `التوصيل: ${shipping === 0 ? 'مجاني' : fmt(shipping)}`,
    `💰 الإجمالي: ${fmt(total)}`,
    `الدفع عند الاستلام`,
  ].filter(Boolean).join('\n')

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

  return { order_id, waUrl }
}
