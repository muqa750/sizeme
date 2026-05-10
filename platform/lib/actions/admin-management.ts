'use server'

import { createAdminClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// ══════════════════════════════════════════════════════════════
//  COUPONS
// ══════════════════════════════════════════════════════════════

export async function createCoupon(formData: FormData) {
  const admin = createAdminClient()

  const code      = (formData.get('code') as string).trim().toUpperCase()
  const type      = formData.get('type') as 'percent' | 'fixed'
  const value     = Number(formData.get('value'))
  const expiresAt = (formData.get('expires_at') as string) || null
  const maxUses   = formData.get('max_uses') ? Number(formData.get('max_uses')) : null
  const isActive  = formData.get('is_active') === 'true'

  if (!code || !type || !value) return { ok: false, error: 'تأكد من ملء جميع الحقول المطلوبة' }

  const { error } = await admin.from('coupons').insert({
    code,
    type,
    value,
    expires_at: expiresAt,
    max_uses:   maxUses,
    is_active:  isActive,
  })

  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/management/coupons')
  return { ok: true }
}

export async function updateCoupon(id: number, formData: FormData) {
  const admin = createAdminClient()

  const code      = (formData.get('code') as string).trim().toUpperCase()
  const type      = formData.get('type') as 'percent' | 'fixed'
  const value     = Number(formData.get('value'))
  const expiresAt = (formData.get('expires_at') as string) || null
  const maxUses   = formData.get('max_uses') ? Number(formData.get('max_uses')) : null
  const isActive  = formData.get('is_active') === 'true'

  const { error } = await admin.from('coupons').update({
    code, type, value,
    expires_at: expiresAt,
    max_uses:   maxUses,
    is_active:  isActive,
  }).eq('id', id)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/management/coupons')
  return { ok: true }
}

export async function deleteCoupon(id: number) {
  const admin = createAdminClient()
  const { error } = await admin.from('coupons').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/management/coupons')
  return { ok: true }
}

export async function toggleCouponActive(id: number, isActive: boolean) {
  const admin = createAdminClient()
  const { error } = await admin.from('coupons').update({ is_active: isActive }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/management/coupons')
  return { ok: true }
}

// ══════════════════════════════════════════════════════════════
//  NEWSLETTER
// ══════════════════════════════════════════════════════════════

export async function deleteSubscriber(id: number) {
  const admin = createAdminClient()
  const { error } = await admin.from('newsletter_subscribers').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/management/newsletter')
  return { ok: true }
}

export async function deleteAllSubscribers() {
  const admin = createAdminClient()
  const { error } = await admin.from('newsletter_subscribers').delete().neq('id', 0)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/management/newsletter')
  return { ok: true }
}

// ══════════════════════════════════════════════════════════════
//  SETTINGS
// ══════════════════════════════════════════════════════════════

export async function updateSetting(key: string, value: string) {
  const admin = createAdminClient()

  let parsed: unknown = value
  try { parsed = JSON.parse(value) } catch { /* leave as string */ }

  const { error } = await admin.from('settings').upsert({ key, value: parsed })
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/management/settings')
  return { ok: true }
}

// ══════════════════════════════════════════════════════════════
//  ORDERS — تعديل تفاصيل الطلب
// ══════════════════════════════════════════════════════════════

export async function updateOrderDetails(
  orderId: string,
  data: {
    name:     string
    phone:    string
    province: string
    area:     string
    address:  string
    notes:    string
  },
) {
  const admin = createAdminClient()

  const { error } = await admin
    .from('orders')
    .update({
      name:     data.name.trim(),
      phone:    data.phone.trim(),
      province: data.province.trim() || null,
      area:     data.area.trim()     || null,
      address:  data.address.trim()  || null,
      notes:    data.notes.trim()    || null,
    })
    .eq('order_id', orderId)

  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/orders')
  return { ok: true }
}

// ══════════════════════════════════════════════════════════════
//  ORDER ITEMS — تعديل وحذف منتجات الطلب
// ══════════════════════════════════════════════════════════════

export async function updateOrderItem(
  itemId: number,
  orderId: string,
  data: { qty: number; color: string; size: string; sku: string },
) {
  const admin = createAdminClient()

  const { data: item } = await admin
    .from('order_items')
    .select('unit_price')
    .eq('id', itemId)
    .single()

  if (!item) return { ok: false, error: 'العنصر غير موجود' }

  const lineTotal = item.unit_price * data.qty

  const { error } = await admin
    .from('order_items')
    .update({
      qty:        data.qty,
      color:      data.color  || null,
      size:       data.size   || null,
      sku:        data.sku    || null,
      line_total: lineTotal,
    })
    .eq('id', itemId)

  if (error) return { ok: false, error: error.message }

  await recalcOrderTotal(admin, orderId)
  revalidatePath('/admin/orders')
  revalidatePath('/admin/analytics')
  return { ok: true }
}

export async function addOrderItem(
  orderId: string,
  data: {
    sku:       string
    brand:     string
    sub:       string
    color:     string
    size:      string
    qty:       number
    unitPrice: number
  },
) {
  const admin = createAdminClient()

  if (!data.brand.trim()) return { ok: false, error: 'اسم الماركة مطلوب' }

  const lineTotal = data.unitPrice * data.qty

  const { error } = await admin.from('order_items').insert({
    order_id:   orderId,
    product_id: null,
    sku:        data.sku    || null,
    brand:      data.brand.trim(),
    sub:        data.sub    || null,
    color:      data.color  || null,
    size:       data.size   || null,
    qty:        data.qty,
    unit_price: data.unitPrice,
    line_total: lineTotal,
  })

  if (error) return { ok: false, error: error.message }

  await recalcOrderTotal(admin, orderId)
  revalidatePath('/admin/orders')
  revalidatePath('/admin/analytics')
  return { ok: true }
}

export async function removeOrderItem(itemId: number, orderId: string) {
  const admin = createAdminClient()

  const { error } = await admin.from('order_items').delete().eq('id', itemId)
  if (error) return { ok: false, error: error.message }

  await recalcOrderTotal(admin, orderId)

  revalidatePath('/admin/orders')
  revalidatePath('/admin/analytics')
  return { ok: true }
}

// ── حساب مجموع الطلب بعد أي تعديل على المنتجات ─────────────────────────────
async function recalcOrderTotal(admin: ReturnType<typeof import('@/lib/supabase').createAdminClient>, orderId: string) {
  // جلب كل المنتجات المتبقية
  const { data: items } = await admin
    .from('order_items')
    .select('line_total')
    .eq('order_id', orderId)

  const newSubtotal = (items ?? []).reduce((s, i) => s + (i.line_total ?? 0), 0)

  // جلب الطلب الحالي لمعرفة الخصومات والتوصيل
  const { data: order } = await admin
    .from('orders')
    .select('bulk_discount, coupon_discount, shipping')
    .eq('order_id', orderId)
    .single()

  if (!order) return

  const newTotal =
    newSubtotal
    - (order.bulk_discount    ?? 0)
    - (order.coupon_discount  ?? 0)
    + (order.shipping         ?? 0)

  await admin
    .from('orders')
    .update({ subtotal: newSubtotal, total: Math.max(0, newTotal) })
    .eq('order_id', orderId)
}

// ══════════════════════════════════════════════════════════════
//  SUGGESTIONS — حذف اقتراح
// ══════════════════════════════════════════════════════════════

export async function deleteSuggestion(id: number) {
  const admin = createAdminClient()
  const { error } = await admin.from('suggestions').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/management/suggestions')
  return { ok: true }
}
